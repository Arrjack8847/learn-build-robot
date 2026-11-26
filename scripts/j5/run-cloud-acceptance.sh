#!/usr/bin/env bash
# Execute only in an authorized private development workspace, e.g. existing Codespaces.
# No deployments, no GitHub Actions, no push, no real provider credentials.
set -uo pipefail
umask 077
revision="${1:-HEAD}"
root="$(git rev-parse --show-toplevel)" || exit 1
commit="$(git -C "$root" rev-parse --verify "$revision^{commit}")" || exit 1
if ! git -C "$root" show "$commit:scripts/j5/cloud-browser-smoke.mjs" >/dev/null; then
  echo "Select a J5 commit containing the cloud acceptance runner."; exit 1
fi
qa="$(mktemp -d "$HOME/j5-qa-XXXXXX")" || exit 1
work="$qa/checkout"
logs="$qa/results"
mkdir -p "$logs" "$qa/clean-home" "$qa/browser"
server_pid=""
cleanup(){
  if [[ -n "$server_pid" ]]; then kill "$server_pid" 2>/dev/null || true; wait "$server_pid" 2>/dev/null || true; fi
  if [[ -d "$work" ]]; then git -C "$root" worktree remove --force "$work" >/dev/null 2>&1 || echo "Temporary checkout retained: $work"; fi
  # These directories were created by THIS invocation only. Keep logs/screenshots.
  rm -rf -- "$qa/clean-home" "$qa/browser"
  echo "QA evidence retained at: $logs"
}
trap cleanup EXIT
trap 'exit 130' INT
trap 'exit 143' TERM
git -C "$root" worktree add --detach "$work" "$commit" || exit 1
cd "$work" || exit 1
# Avoid inheriting company/Wix/HitPay/Resend/Vercel/GitHub credentials into tests or build.
clean(){ env -i PATH="$PATH" HOME="$qa/clean-home" USER=qa LOGNAME=qa LANG=C.UTF-8 CI=1 "$@"; }
{
  printf 'Commit: %s\n' "$commit"
  clean node --version
  clean npm --version
} > "$logs/environment.txt" 2>&1
cat "$logs/environment.txt"
if ! clean node -e 'const [a,b]=process.versions.node.split(".").map(Number);if(a<22||(a===22&&b<13))process.exit(1)'; then echo "Node 22.13+ required (SQLite native tests)."; exit 1; fi
failed=0
step(){
  local name="$1"; shift
  printf '\n== %s ==\n' "$name"
  "$@" 2>&1 | tee "$logs/$name.log"
  local rc=$?
  printf '%s\t%s\n' "$name" "$rc" >> "$logs/status.tsv"
  if [[ "$rc" != 0 ]]; then failed=1; return 1; fi
}
step regression clean node --test tests/j5-*.test.mjs || true
# Source PDFs are needed for the inventory regression above, but must never be
# copied to public output. Remove only disposable detached-worktree copies.
# This also avoids copying hundreds of PDFs twice during the Vite/Nitro build.
prune_qa_pdfs(){
  if [[ "$work" != "$qa/checkout" || ! -f "$work/.git" || -L "$work/public" || ! -d "$work/public" ]]; then
    echo "Refusing PDF pruning outside the disposable worktree."; return 1
  fi
  if [[ "$(git -C "$work" rev-parse --show-toplevel)" != "$work" ]] || git -C "$work" symbolic-ref -q HEAD >/dev/null; then
    echo "Refusing PDF pruning in a non-detached checkout."; return 1
  fi
  df -h "$work" || return 1
  df -i "$work" || return 1
  # find defaults to not following symbolic links. Only regular PDFs are removed.
  find "$work/public" -type f -iname '*.pdf' -print -delete || return 1
  local remaining
  remaining="$(find "$work/public" -type f -iname '*.pdf' -print -quit)" || return 1
  if [[ -n "$remaining" ]]; then echo "PDF pruning incomplete."; return 1; fi
  echo "No public source PDFs remain in the disposable checkout."
  df -h "$work" || return 1
}
step prebuild-pdf-prune prune_qa_pdfs || exit 1
if command -v bun >/dev/null 2>&1; then
  step dependencies clean bun install --frozen-lockfile
  dep=$?
else
  # Install bun only into npm's temporary cache inside the disposable clean home.
  step dependencies clean npm exec --yes --package=bun -- bun install --frozen-lockfile
  dep=$?
fi
if [[ "$dep" != 0 ]]; then
  echo "Dependencies unavailable; build, typecheck and browser not executed." | tee "$logs/blocker.txt"
  exit 1
fi
# The private build is the audited J5-only pipeline; do not run other journey prebuilds.
step private-build clean npm run build:j5-private
built=$?
step typecheck clean ./node_modules/.bin/tsc --noEmit || true
if [[ "$built" != 0 ]]; then
  echo "Private build/audit failed; no server started." | tee "$logs/browser-blocker.txt"
  exit 1
fi
if [[ ! -f .output/server/index.mjs ]]; then
  echo "Expected Nitro server output missing; browser not executed." | tee "$logs/browser-blocker.txt"
  exit 1
fi
step browser-package clean npm install --prefix "$qa/browser" --no-save --no-package-lock --no-audit --no-fund playwright
if [[ "$?" != 0 ]]; then exit 1; fi
step chromium-install clean "$qa/browser/node_modules/.bin/playwright" install chromium
if [[ "$?" != 0 ]]; then exit 1; fi
cp scripts/j5/cloud-browser-smoke.mjs "$qa/browser/cloud-browser-smoke.mjs" || exit 1
port="$(clean node -e 'const s=require("node:net").createServer();s.listen(0,"127.0.0.1",()=>{console.log(s.address().port);s.close()})')" || exit 1
# Loopback only. Do not forward any public port. Redirect server logs to evidence.
env -i PATH="$PATH" HOME="$qa/clean-home" USER=qa LOGNAME=qa LANG=C.UTF-8 NODE_ENV=production VERCEL_ENV=preview J5_PRIVATE_ENABLED=true VITE_J5_PRIVATE_UI=true HOST=127.0.0.1 NITRO_HOST=127.0.0.1 PORT="$port" NITRO_PORT="$port" node .output/server/index.mjs > "$logs/server.log" 2>&1 &
server_pid=$!
ready=0
for n in $(seq 1 60); do
  if ! kill -0 "$server_pid" 2>/dev/null; then break; fi
  if clean node -e 'fetch("http://127.0.0.1:"+process.argv[1]+"/practical/levels").then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))' "$port"; then ready=1; break; fi
  sleep 1
done
if [[ "$ready" != 1 ]]; then echo "Server readiness failed; inspect server.log." | tee "$logs/browser-blocker.txt"; exit 1; fi
step browser clean node "$qa/browser/cloud-browser-smoke.mjs" "$port" "$logs" || true
echo "Status codes (0 = passed):"
cat "$logs/status.tsv"
echo "Independent cloud regression only; real provider, Safari and private PDF migration acceptance remain separate."
exit "$failed"

# J5 private cloud acceptance runner

Use an **existing authorized GitHub Codespace** for this repository. Do not create a new billed resource, connect a company provider or forward a public port. A full Vite build is not equivalent to a deployment. This runner does not modify the active workspace checkout, push a commit, run Actions or deploy.

From the Codespace terminal:
```bash
git fetch origin feat/j5-student-learning-20261126 && git show FETCH_HEAD:scripts/j5/run-cloud-acceptance.sh | bash -s -- FETCH_HEAD
```

The script creates a detached temporary worktree from the fetched commit and a private evidence folder under the Codespace home. Node 22.13+ required. Dependencies use the repository bun.lock in frozen mode. Executes the entire native J5 suite (including PDF inventory), private build and artifact scanner, TypeScript check and, if the build passes, loopback-only actual Chromium UI tests. It uses a clean environment to avoid inherited company secrets. Playwright is installed only into a disposable test workspace. It checks six actual viewport layouts, original artwork load, restriction states, check-in and profile via fictional API intercepts, anonymous access and the default unavailable course/PDF server. No real student or provider data. The runner prints evidence directory and exit statuses; preserve failing logs as well as passing logs.

The browser and full build have **not** been executed by ChatGPT: full checkout DNS failed and the available cloud-browser account reported insufficient credits. Browser navigation in prior isolated runner was blocked. The new scripts are prepared and require actual execution in an authorized workspace. If the existing Codespace has stopped, only resume it if you agree to its applicable usage/quota. No public port is needed. Safari, real Wix database access, actual J2/J3/booking integration and real private PDF migration remain separate acceptance gates. Browser tests use mocks, not real providers.

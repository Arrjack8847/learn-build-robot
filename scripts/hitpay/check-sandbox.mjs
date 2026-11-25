// J3.1 — read-only sandbox connectivity check. Run in a private Codespace.
// Node 22+: node --env-file=.env.local scripts/hitpay/check-sandbox.mjs
// No customer data, charge creation, subscription creation or secret logging.
const sandbox = "https://api.sandbox.hit-pay.com";
async function check() {
  const key = process.env.HITPAY_API_KEY;
  const salt = process.env.HITPAY_SALT_KEY;
  const base = process.env.HITPAY_API_BASE_URL;
  if (!key?.trim() || !salt?.trim()) {
    console.error("Missing HitPay API key or salt in the private environment.");
    process.exitCode = 1;
    return;
  }
  if (base !== sandbox) {
    console.error("Refusing request: sandbox base URL required.");
    process.exitCode = 1;
    return;
  }
  const response = await fetch(sandbox + "/v1/subscription-plan?page=1&per_page=20", {
    method: "GET",
    headers: {
      "X-BUSINESS-API-KEY": key,
      "X-Requested-With": "XMLHttpRequest",
      "Accept": "application/json"
    },
    redirect: "error",
    signal: AbortSignal.timeout(15000)
  });
  if (!response.ok) {
    console.error("HitPay sandbox check failed (HTTP " + response.status + ").");
    process.exitCode = 1;
    return;
  }
  const payload = await response.json();
  if (!Array.isArray(payload?.data)) {
    console.error("Unexpected HitPay response format; connection not verified.");
    process.exitCode = 1;
    return;
  }
  console.log("HitPay sandbox API connected (read-only).");
  console.log("Subscription plans returned on first page: " + payload.data.length);
  console.log("Salt configured; signature validation still pending.");
}
check().catch(() => {
  console.error("Sandbox connection failed. Check network and configuration.");
  process.exitCode = 1;
});

import "./lib/error-capture";
import { handleEmailTest } from "./lib/resend-test.server";
import { handleParentOtpTest } from "./lib/parent-otp-test.server";
import { handleHitPaySandboxWebhook } from "./lib/hitpay-webhook.server";
import { handleSandboxCheckout } from "./lib/sandbox-checkout.server";
import { handleJ4Fixture } from "../scripts/staff/j4-fixture-http.mjs";
import { handleStaffDesk } from "../scripts/staff/desk-http.mjs";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      if (new URL(request.url).pathname === "/api/dev/email-test") return await handleEmailTest(request, process.env);
      if (new URL(request.url).pathname.startsWith("/api/dev/parent-otp/")) return await handleParentOtpTest(request, process.env);
      if (new URL(request.url).pathname === "/api/dev/hitpay/webhook") return await handleHitPaySandboxWebhook(request, process.env);
      if (new URL(request.url).pathname.startsWith("/api/dev/sandbox-checkout/")) return await handleSandboxCheckout(request, process.env);
      if (new URL(request.url).pathname.startsWith("/api/dev/j4-fixture/")) return await handleJ4Fixture(request, process.env);
      // No separate staff authentication. The former fixture HTTP endpoints are disabled.
      if (new URL(request.url).pathname.startsWith("/api/dev/staff-private/")) return new Response(JSON.stringify({ok:false,status:"NOT_FOUND"}), {status:404,headers:{"Content-Type":"application/json","Cache-Control":"no-store"}});
      if (new URL(request.url).pathname.startsWith("/api/dev/staff/")) return await handleStaffDesk(request, process.env);
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};

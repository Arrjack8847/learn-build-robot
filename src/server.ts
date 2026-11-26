import "./lib/error-capture";
import { handleIntegratedCheckout } from "../scripts/j123/checkout-http.mjs";
import { handleJ1Readiness } from "../scripts/j1/readiness.mjs";
import { handleEmailTest } from "./lib/resend-test.server";
import { handleStudentAuth } from "./lib/student-auth.server";
import { handleParentOtpTest } from "./lib/parent-otp-test.server";
import { handleHitPaySandboxWebhook } from "./lib/hitpay-webhook.server";
import { handleSandboxCheckout } from "./lib/sandbox-checkout.server";
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
      if (["/dev/testing-centre","/api/dev/j1/readiness"].includes(new URL(request.url).pathname)) return await handleJ1Readiness(request,process.env);
      if (new URL(request.url).pathname === "/api/dev/email-test") return await handleEmailTest(request, process.env);
      if (new URL(request.url).pathname.startsWith("/api/dev/student-auth/")) return await handleStudentAuth(request, process.env);
      if (new URL(request.url).pathname.startsWith("/api/dev/parent-otp/")) return await handleParentOtpTest(request, process.env);
      if (new URL(request.url).pathname === "/api/dev/hitpay/webhook") return await handleHitPaySandboxWebhook(request, process.env);
      if (new URL(request.url).pathname === "/api/dev/j123/checkout") return await handleIntegratedCheckout(request,process.env);
      if (new URL(request.url).pathname.startsWith("/api/dev/sandbox-checkout/")) return await handleSandboxCheckout(request, process.env);
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

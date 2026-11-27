import "./lib/error-capture";
import {isCombinedBranch,combinedRepositoryEnabled} from "../scripts/combined/scope.mjs";
import {handleCombinedScheduling} from "../scripts/combined/scheduling-http.mjs";
import {handleCombinedWorker} from "../scripts/combined/worker-http.mjs";
import {readCombinedAccess,verifyCombinedVisit} from "../scripts/combined/access-runtime.mjs";
import {classifyCoursePath} from "./lib/j5-course-path.mjs";
import {handleNizarFixture,fixtureEnabled} from "../scripts/nizar/fixture-http.mjs";
import {renderNizarPreview} from "../scripts/nizar/preview-page.mjs";
import {handleStaffFixture,staffFixtureEnabled} from "../scripts/nizar/staff-http.mjs";
import {renderNizarStaffPreview} from "../scripts/nizar/staff-page.mjs";
import { createJ12345ProfileHttp } from "../scripts/j12345/profile.mjs";
import { resolveJ2Student, readJ12345VerifiedChild } from "../scripts/j2-runtime.mjs";
import {readJ12345Progress} from "../scripts/j12345/progress.mjs";
import {createAssessmentHttp} from "../scripts/j12345/assessment-http.mjs";
import {resolveAssessmentQuiz,resolveAssessmentCandidates} from "./lib/j12345-assessment-catalog.server";
import {createProgressHttp} from "../scripts/j12345/progress-http.mjs";
import {createJ12345CourseBoundary,createJ12345CourseAuthority} from "../scripts/j12345/course.mjs";
import {resolveJ5CourseResource} from "./lib/j5-course-catalog.server";
declare const __J12345_STUDENT_PREVIEW__:boolean;
declare const __COMBINED_PREVIEW__:boolean;
const handleJ12345Course=createJ12345CourseBoundary({privateArtifact:__J12345_STUDENT_PREVIEW__,resolveStudent:resolveJ2Student,readVerifiedChild:readJ12345VerifiedChild,readAccess:readCombinedAccess,verifyVisit:verifyCombinedVisit,resolveResource:resolveJ5CourseResource,readProgress:readJ12345Progress});
const handleJ12345Profile=createJ12345ProfileHttp({resolveStudent:resolveJ2Student,readVerifiedChild:readJ12345VerifiedChild,readAccess:readCombinedAccess,readProgress:readJ12345Progress,verifyVisit:verifyCombinedVisit});
const handleJ12345Progress=createProgressHttp({resolveStudent:resolveJ2Student,readVerifiedChild:readJ12345VerifiedChild,authorizeCourse:createJ12345CourseAuthority({resolveStudent:resolveJ2Student,readVerifiedChild:readJ12345VerifiedChild,readAccess:readCombinedAccess,verifyVisit:verifyCombinedVisit,resolveResource:resolveJ5CourseResource,readProgress:readJ12345Progress})});
const handleJ12345Assessment=createAssessmentHttp({resolveStudent:resolveJ2Student,readVerifiedChild:readJ12345VerifiedChild,authorizeCourse:createJ12345CourseAuthority({resolveStudent:resolveJ2Student,readVerifiedChild:readJ12345VerifiedChild,readAccess:readCombinedAccess,verifyVisit:verifyCombinedVisit,resolveResource:resolveJ5CourseResource,readProgress:readJ12345Progress}),resolveQuiz:resolveAssessmentQuiz,resolveCandidates:resolveAssessmentCandidates});
import { handleIntegratedCheckout } from "../scripts/j123/checkout-http.mjs";
import { handleMembershipWorker } from "../scripts/j123/membership-worker-http.mjs";
import { handleJ1Readiness } from "../scripts/j1/readiness.mjs";
import { handleEmailTest } from "./lib/resend-test.server";
import { handleStudentAuth } from "./lib/student-auth.server";
import { handleParentOtpTest } from "./lib/parent-otp-test.server";
import { handleHitPaySandboxWebhook } from "./lib/hitpay-webhook.server";
import { handleSandboxCheckout } from "./lib/sandbox-checkout.server";
import { handleJ1234Attendance } from "../scripts/j1234/attendance-http.mjs";
import { handleJ1234Students } from "../scripts/j1234/student-http.mjs";
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
      const path=new URL(request.url).pathname;
      if(__COMBINED_PREVIEW__||isCombinedBranch(process.env)){
        const e=process.env,url=new URL(request.url);
        const denied=()=>new Response(null,{status:404,headers:{"Cache-Control":"private, no-store","X-Robots-Tag":"noindex, nofollow"}});
        if(!__COMBINED_PREVIEW__||!combinedRepositoryEnabled(e)||e["COMBINED_IDENTITY_ENABLED"]!=="1"||e["COMBINED_RUNTIME_ENABLED"]!=="1"||!e["VERCEL_URL"]||url.origin!=="https://"+e["VERCEL_URL"])return denied();
        if(["/api/dev/combined/booking","/api/dev/combined/staff","/api/dev/combined/check-in"].includes(path))return handleCombinedScheduling(request,e);
        if(path==="/api/dev/combined/worker")return handleCombinedWorker(request,e);
        if(path==="/staff/admin"||path==="/staff/admin/")return request.method==="GET"&&!url.search&&e["COMBINED_STAFF_ENABLED"]==="1"?renderNizarStaffPreview({combined:true}):denied();
        if(path.startsWith("/api/dev/parent-otp/"))return handleParentOtpTest(request,e);
        if(path.startsWith("/api/dev/student-auth/"))return handleStudentAuth(request,e);
        if(["/api/dev/j123/checkout","/api/dev/j123/checkout/status"].includes(path))return handleIntegratedCheckout(request,e);
        if(path==="/api/dev/j123/membership-worker")return handleMembershipWorker(request,e);
        if(path==="/api/dev/j5/profile")return handleJ12345Profile(request,e);
        if(path==="/api/dev/j5/progress")return handleJ12345Progress(request,e);
        if(path==="/api/dev/j5/assessment")return handleJ12345Assessment(request,e);
        if(path==="/api/dev/j5/course-access"||path.startsWith("/api/dev/j5/pdf/"))return handleJ12345Course(request,e,async()=>denied());
        // Never allow legacy attendance, auth, staff desk or payment routes in the combined artifact.
        if(request.method!=="GET"&&request.method!=="HEAD")return denied();
        const route=classifyCoursePath(path),shell=["/","/parent/sign-in","/parent/sign-in/","/parent/payment-return","/parent/payment-return/","/auth","/auth/","/student/dashboard","/student/dashboard/"].includes(path);
        if(!shell&&route.scope!=="shell"&&route.scope!=="protected")return denied();
        return handleJ12345Course(request,e,async()=>{
          const handler=await getServerEntry(),response=await normalizeCatastrophicSsrResponse(await handler.fetch(request,env,ctx));
          const headers=new Headers(response.headers);headers.set("Cache-Control","private, no-store");headers.set("X-Robots-Tag","noindex, nofollow");
          return new Response(request.method==="HEAD"?null:response.body,{status:response.status,statusText:response.statusText,headers});
        });
      }
      if(path==="/api/dev/nizar/booking")return await handleNizarFixture(request,process.env);
      if(path==="/api/dev/nizar/staff")return await handleStaffFixture(request,process.env);
      if(path==="/dev/nizar-staff"){const url=new URL(request.url);if(!staffFixtureEnabled(process.env)||request.method!=="GET"||url.search||!process.env["VERCEL_URL"]||url.origin!=="https://"+process.env["VERCEL_URL"])return new Response(null,{status:404,headers:{"Cache-Control":"no-store","X-Robots-Tag":"noindex, nofollow"}});return renderNizarStaffPreview();}
      if(path==="/dev/nizar-booking"){const url=new URL(request.url);if(!fixtureEnabled(process.env)||request.method!=="GET"||url.search||!process.env["VERCEL_URL"]||url.origin!=="https://"+process.env["VERCEL_URL"])return new Response(null,{status:404,headers:{"Cache-Control":"no-store","X-Robots-Tag":"noindex, nofollow"}});return renderNizarPreview();}
      if(path.startsWith("/api/dev/nizar/"))return new Response(null,{status:404,headers:{"Cache-Control":"no-store"}});
      if(__J12345_STUDENT_PREVIEW__&&(process.env["VERCEL_ENV"]!=="preview"||process.env["VERCEL_TARGET_ENV"]==="production"||process.env["VERCEL_GIT_COMMIT_REF"]!=="integration/j1-j2-j3-j4-j5-20261126")&&(path.startsWith("/api/dev/")||path==="/dev/testing-centre"||path==="/staff/admin"||path==="/student/dashboard"))return new Response(null,{status:404,headers:{"Cache-Control":"private, no-store","X-Robots-Tag":"noindex, nofollow"}});
      if (["/dev/testing-centre","/api/dev/j1/readiness"].includes(new URL(request.url).pathname)) return await handleJ1Readiness(request,process.env);
      if (new URL(request.url).pathname === "/api/dev/j5/assessment") return await handleJ12345Assessment(request,process.env);
      if (new URL(request.url).pathname === "/api/dev/j5/progress") return await handleJ12345Progress(request,process.env);
      if (new URL(request.url).pathname === "/api/dev/j5/profile") return await handleJ12345Profile(request,process.env);
      if (new URL(request.url).pathname === "/api/dev/j5/course-access" || new URL(request.url).pathname.startsWith("/api/dev/j5/pdf/")) return await handleJ12345Course(request,process.env,async()=>new Response(null,{status:404}));
      if (new URL(request.url).pathname.startsWith("/api/dev/j5/")) return new Response(null,{status:404,headers:{"Cache-Control":"no-store"}});
      if (new URL(request.url).pathname === "/api/dev/email-test") return await handleEmailTest(request, process.env);
      if (new URL(request.url).pathname.startsWith("/api/dev/student-auth/")) return await handleStudentAuth(request, process.env);
      if (new URL(request.url).pathname.startsWith("/api/dev/parent-otp/")) return await handleParentOtpTest(request, process.env);
      if (new URL(request.url).pathname === "/api/dev/hitpay/webhook") return await handleHitPaySandboxWebhook(request, process.env);
      if (new URL(request.url).pathname === "/api/dev/j123/membership-worker") return await handleMembershipWorker(request,process.env);
      if (["/api/dev/j123/checkout","/api/dev/j123/checkout/status"].includes(new URL(request.url).pathname)) return await handleIntegratedCheckout(request,process.env);
      if (new URL(request.url).pathname.startsWith("/api/dev/sandbox-checkout/")) return await handleSandboxCheckout(request, process.env);
      if (new URL(request.url).pathname.startsWith("/api/dev/j4-fixture/")) return await handleJ4Fixture(request, process.env);
      if (["/api/dev/j1234/attendance","/api/dev/j1234/check-in"].includes(new URL(request.url).pathname)) return await handleJ1234Attendance(request,process.env);
      if (new URL(request.url).pathname === "/api/dev/j1234/students") return await handleJ1234Students(request,process.env);
      if (new URL(request.url).pathname.startsWith("/api/dev/staff-private/") || new URL(request.url).pathname.startsWith("/api/dev/j1234/")) return new Response(JSON.stringify({ok:false,status:"NOT_FOUND"}), {status:404,headers:{"Content-Type":"application/json","Cache-Control":"no-store"}});
      if (new URL(request.url).pathname.startsWith("/api/dev/staff/")) return await handleStaffDesk(request, process.env);
      return await handleJ12345Course(request,process.env,async()=>{
        const handler = await getServerEntry();
        const response = await handler.fetch(request, env, ctx);
        return await normalizeCatastrophicSsrResponse(response);
      });
    } catch (error) {
      if(__J12345_STUDENT_PREVIEW__)console.error("J12345 request failed");else console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8", "Cache-Control":"private, no-store" },
      });
    }
  },
};

import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const signIn=read("src/routes/parent.sign-in.tsx");
const old=read("src/routes/parent.dashboard.tsx");
test("legacy dashboard and walkthroughs are inaccessible; compatibility route redirects only",()=>{
 assert.match(old,/throw redirect\(\{to:"\/parent\/sign-in",replace:true\}\)/);
 assert.doesNotMatch(old,/DashboardWalkthrough|walkthrough|family-child-edit/);
 assert.doesNotMatch(signIn,/ParentSignInPreview|parent\/dashboard|walkthrough/);
 for(const p of ["src/routes/parent.payment-preview.tsx","src/routes/parent.payment-return.tsx"])assert.doesNotMatch(read(p),/\/parent\/dashboard|[Pp]arent dashboard|Return to dashboard/);
 assert.equal(existsSync(new URL("../src/components/parent-dashboard-walkthrough.tsx",import.meta.url)),false);
 assert.equal(existsSync(new URL("../src/components/parent-registration-walkthrough.tsx",import.meta.url)),false);
});
test("student registration immediately leads to owned PIN setup and no payment",()=>{
 assert.match(signIn,/Create Your Account/);
 assert.match(signIn,/await nextAfterVerification\(r.child.id\);setConfirmed\(r.child\)/);
 assert.match(signIn,/portal\("family-child-get",\{childId:selected\}\)/);
 assert.match(signIn,/r\.child\.id!==selected/);
 assert.match(signIn,/studentAuth\("enrollment-status",\{studentId:confirmed.id\}\)/);
 assert.match(signIn,/No payment has been created or membership activated/);
 assert.match(signIn,/href="\/auth\/"/);
 assert.doesNotMatch(signIn,/RM360|sandbox-checkout|family-child-edit/);
});
test("resend countdown, multiple students and secure logout remain",()=>{assert.match(signIn,/Date\.now\(\)\+60000/);assert.match(signIn,/Register another student/);assert.match(signIn,/portal\("logout"\)/);});

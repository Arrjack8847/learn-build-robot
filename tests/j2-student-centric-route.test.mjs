import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const signIn=readFileSync(new URL("../src/routes/parent.sign-in.tsx",import.meta.url),"utf8");
const old=readFileSync(new URL("../src/routes/parent.dashboard.tsx",import.meta.url),"utf8");
test("normal payer route does not lead to parent management",()=>{assert.doesNotMatch(signIn,/window\.location\.replace\("\/parent\/dashboard"\)/);assert.match(old,/window\.location\.replace\("\/parent\/sign-in"\)/);assert.doesNotMatch(old,/family-child-edit/);});
test("payer selection rechecks server ownership and fails closed",()=>{assert.match(signIn,/portal\("family-child-get",\{childId:selected\}\)/);assert.match(signIn,/r\.child\.id!==selected/);assert.match(signIn,/No payment has been created or membership activated/);assert.doesNotMatch(signIn,/RM360|sandbox-checkout|family-child-edit/);});
test("resend countdown and new student registration are present",()=>{assert.match(signIn,/Date\.now\(\)\+60000/);assert.match(signIn,/Register another student/);assert.match(signIn,/portal\("logout"\)/);});

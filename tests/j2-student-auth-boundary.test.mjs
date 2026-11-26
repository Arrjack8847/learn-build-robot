import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const context=read("scripts/student-auth/session-context.mjs"),resolver=read("src/lib/student-auth.server.ts"),server=read("scripts/student-auth/http.mjs"),app=read("src/server.ts"),ui=read("src/components/student-sign-in.tsx"),parent=read("src/routes/parent.sign-in.tsx");
test("student authentication remains gated and private",()=>{assert.match(server,/STUDENT_AUTH_ENABLED!=="true"/);assert.match(server,/VERCEL_TARGET_ENV==="production"/);assert.match(server,/HttpOnly; SameSite=Strict/);assert.match(context,/student-proof\//);assert.match(app,/handleStudentAuth\(request, process.env\)/);});
test("student login returns no token, and clears payer and proof cookies",()=>{assert.match(server,/cookie\(studentCookie,r.token,14400\),cookie\(proofCookie,"",0\),cookie\(payerCookie,"",0\)/);assert.match(server,/oldPayer.service.logout\(p\)/);assert.doesNotMatch(server,/json\(200,r\)/);});
test("parent PIN enrollment is separate from student login",()=>{assert.match(parent,/studentAuth\("enroll",\{studentId:confirmed.id,pin:setupPin\}\)/);assert.match(ui,/studentAuth\("sign-in",\{studentId:selected,pin\}\)/);assert.match(context,/clock.now\(\)-created>600000/);assert.match(context,/clock.now\(\)-created>=300000/);});

test("J5 resolver is server-only and reads the student cookie",()=>{assert.match(resolver,/export async function resolveJ2Student\(request:Request,env:NodeJS.ProcessEnv\)/);assert.match(resolver,/identity.resolveStudentSession\(read\(request,studentCookie\)\)/);});

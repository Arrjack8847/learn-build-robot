import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const route=readFileSync(new URL("../src/routes/staff.admin.tsx",import.meta.url),"utf8");
test("J4 phase 9: service failure is not presented as empty confirmed data; recoverable UI and report requests",()=>{
 assert.match(route,/setLoadFailed\(false\);setRows\(\[\]\);setTotal\(0\)/);
 assert.match(route,/if\(!r.ok\)\{setLoadFailed\(true\)/);
 assert.match(route,/loadFailed&&!loading/);
 assert.match(route,/!loading&&!loadFailed&&rows.length===0/);
 assert.match(route,/Records unconfirmed/);
 assert.match(route,/disabled=\{page===1\|\|loading\|\|loadFailed\}/);
 assert.match(route,/disabled=\{page\*pageSize>=total\|\|loading\|\|loadFailed\}/);
 assert.match(route,/if\(reportPending\|\|busy\)return/);
 assert.match(route,/finally\{if\(current===epoch.current\)setReportPending\(false\);\}/);
 assert.match(route,/reportPending\?"Loading report…"/);
 assert.match(route,/setReportPending\(false\);setLoadFailed\(false\)/);
 assert.match(route,/setIssuedCode\(null\);setMessage\("Operation not confirmed. Refresh before retrying."\);setRevision/);
 assert.match(route,/else setMessage\("Isolated Wix fixture connection could not be confirmed."\)/);
});

// Runs actual built UI in private cloud Chromium. Mock HTTP responses exist ONLY in this test.
import assert from "node:assert/strict";
import { chromium } from "playwright";
import {join} from "node:path";
const port=Number(process.argv[2]),evidence=process.argv[3];
assert.ok(Number.isInteger(port)&&port>0&&port<=65535&&evidence);
const base="http://127.0.0.1:"+port;
const browser=await chromium.launch({headless:true,args:["--disable-background-networking"]});
let membership="active",checked=true,auth=true,progress=3;
function fixture(){
 const active=membership==="active",until=Date.now()+300000;
 return {ok:true,profile:{displayName:"Fictional QA Student",studentCode:"QA-1",accountStatus:"active",membership,validUntil:active?until:null,checkIn:checked?"verified":"required",checkInUntil:checked?until:null,learning:{currentLevel:1,overallCompleted:progress,overallRequired:60,learningCompleted:progress,buildingCompleted:0,quizzesPassed:0,challengesPassed:0,latest:null}},levels:Array.from({length:6},(_,i)=>{const reason=i!==0?"level-locked":!active?"membership-required":!checked?"check-in-required":null;return {level:i+1,status:i===0?"in-progress":"locked",completed:i===0?progress:0,required:10,available:reason===null,reason};})};
}
const context=await browser.newContext();
const page=await context.newPage();
const errors=[];
page.on("pageerror",e=>errors.push(String(e)));
await context.route("**/*",async route=>{
 const url=new URL(route.request().url());
 if(url.origin!==base)return route.abort();
 if(url.pathname==="/api/dev/j5/overview")return route.fulfill({status:auth?200:401,contentType:"application/json",body:JSON.stringify(auth?fixture():{ok:false,code:"STUDENT_AUTH_REQUIRED"})});
 if(url.pathname==="/api/dev/j5/check-in"){
  const code=route.request().postDataJSON()?.code;
  if(code!=="00123456")return route.fulfill({status:403,contentType:"application/json",body:JSON.stringify({ok:false,code:"CHECK_IN_REFUSED"})});
  checked=true;
  return route.fulfill({status:200,contentType:"application/json",body:JSON.stringify({ok:true,code:"CHECK_IN_VERIFIED",validUntil:Date.now()+300000})});
 }
 return route.continue();
});
const grid=page.locator('ul[aria-label="Choose your syllabus level"]');
const cards=grid.locator(":scope > li");
async function openLevels(){
 await page.goto(base+"/practical/levels",{waitUntil:"domcontentloaded"});
 await grid.waitFor();
 await page.waitForFunction(()=>document.querySelectorAll('ul[aria-label="Choose your syllabus level"] > li').length===6);
}
async function waitProgress(){
 await page.getByRole("progressbar",{name:"Level 1 requirements completed",exact:true}).waitFor();
}
try{
 // The default unconfigured server must not render protected content. These fetches do not use browser mocks.
 const direct=await fetch(base+"/practical/level-1",{redirect:"manual"});
 assert.equal(direct.status,503,"Expected fail-closed default course provider");
 const directPdf=await fetch(base+"/api/dev/j5/pdf/pdf-0001",{redirect:"manual"});
 assert.ok([403,404,503].includes(directPdf.status),"Default PDF provider must deny");
 for(const [width,height,cols] of [[320,568,2],[390,844,2],[844,390,3],[768,1024,2],[1366,768,3],[1920,1080,3]]){
  await page.setViewportSize({width,height});await openLevels();await waitProgress();
  assert.equal(await cards.count(),6);
  assert.equal(await grid.evaluate(e=>getComputedStyle(e).gridTemplateColumns.split(" ").length),cols);
  assert.equal(await cards.first().getByRole("link").count(),1);
  for(let i=1;i<6;i++)assert.equal(await cards.nth(i).getByRole("link").count(),0);
  await page.waitForFunction(()=>[...document.querySelectorAll('ul[aria-label="Choose your syllabus level"] img')].every(i=>i.complete&&i.naturalWidth>0));
  await page.evaluate(()=>document.fonts.ready);
  const dimensions=await page.evaluate(()=>{
   const grid=document.querySelector('ul[aria-label="Choose your syllabus level"]');
   const root=grid.closest("main");
   const measure=e=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e);return {x:r.x,y:r.y,w:r.width,h:r.height,clientHeight:e.clientHeight,scrollHeight:e.scrollHeight,minHeight:s.minHeight,flex:s.flex,overflow:s.overflow};};
   return {h:root.clientHeight,scroll:root.scrollHeight,w:root.clientWidth,sw:root.scrollWidth,root:measure(root),section:measure(grid.parentElement),grid:measure(grid),cards:[...grid.children].map(measure)};
  });
  console.log("Viewport layout",width,height,JSON.stringify(dimensions));
  // Save the failing viewport as well as successful ones before assertions.
  await page.screenshot({path:join(evidence,"levels-"+width+"x"+height+".png"),fullPage:true});
  assert.ok(dimensions.sw<=dimensions.w+2,"Horizontal overflow");
  if(height>=768&&width>=390)assert.ok(dimensions.scroll<=dimensions.h+2,"Normal viewport unexpectedly scrolls");
  assert.ok(dimensions.cards.every(c=>c.h>0&&c.w>0),"A level tile collapsed");
  console.log("PASS actual levels viewport",width,height);
 }
 for(const status of ["inactive","pending","failed","expired","renewal-required","verification-required"]){
  membership=status;await openLevels();await waitProgress();
  assert.equal(await cards.getByRole("link").count(),0);assert.equal(await cards.first().locator("progress").getAttribute("value"),String(progress));
  console.log("PASS membership restriction",status);
 }
 membership="active";checked=false;await openLevels();await waitProgress();
 assert.equal(await cards.getByRole("link").count(),0);
 await page.getByRole("link",{name:"Check in",exact:true}).click();
 const code=page.getByLabel("Your check-in code");await code.waitFor();
 await code.fill("99999999");await page.getByRole("button",{name:"Verify check-in"}).click();
 await page.getByRole("alert").filter({hasText:"couldn't verify"}).waitFor();
 await code.fill("00123456");await page.getByRole("button",{name:"Verify check-in"}).click();
 await page.getByText("Check-in verified",{exact:true}).waitFor();
 await page.getByRole("link",{name:"Continue to learning"}).click();await waitProgress();
 assert.equal(await cards.first().getByRole("link").count(),1);
 console.log("PASS actual check-in UI with mock API");
 await page.getByRole("link",{name:"My profile",exact:true}).click();
 await page.getByRole("heading",{name:"Fictional QA Student"}).waitFor();
 await page.getByText("Student ID: QA-1",{exact:true}).waitFor();
 await page.screenshot({path:join(evidence,"profile.png"),fullPage:true});
 console.log("PASS actual profile UI with mock API");
 auth=false;await openLevels();
 await page.getByRole("link",{name:"Sign in to open learning levels"}).waitFor();
 assert.equal(await cards.getByRole("link").count(),0);
 assert.equal(await cards.locator("progress").count(),0);
 assert.deepEqual(errors,[],"Uncaught browser errors");
 console.log("PASS unauthenticated UI and no stale progress");
 console.log("Chromium fixture UI passed; not actual provider authentication, booking, PDF or Safari acceptance.");
}finally{await context.close();await browser.close();}

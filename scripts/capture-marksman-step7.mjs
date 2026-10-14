/** Desktop/mobile browser screenshots for custom interactive Step 7.
 * These are UI evidence, NOT evidence of a physically verified pin fit.
 */
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
const base=process.env.FRAME_BASE_URL ?? "http://127.0.0.1:4173";
const dir="artifacts/marksman-step7";
await mkdir(dir,{recursive:true});
const browser=await chromium.launch({
  headless:true,
  args:["--enable-webgl","--use-gl=angle","--use-angle=swiftshader"],
});
try {
  const context=await browser.newContext({
    viewport:{width:1365,height:960},deviceScaleFactor:1,reducedMotion:"reduce",
  });
  const page=await context.newPage();
  const errors=[];
  page.on("pageerror",e=>errors.push(e.message));
  await page.addInitScript(()=>{
    localStorage.setItem("robolearn.progress.v1",JSON.stringify({
      completedStepIds:Array.from({length:6},(_,i)=>"marksmanship-s"+(i+1)),
    }));
  });
  await page.goto(base+"/practical/marksmanship",{waitUntil:"networkidle"});
  await page.getByRole("heading",{name:"Step 7 — Frame and central locking beam"})
    .waitFor({state:"visible",timeout:25000});
  const canvas=page.getByLabel("Step 7 real STL 3D frame and 15-hole beam locking demonstration");
  await canvas.waitFor({state:"visible",timeout:20000});
  await page.waitForTimeout(2500);
  const next=page.getByRole("button",{name:"Next action"});
  // Explicitly capture each state, so any missing geometry breaks QA.
  for(let phase=0;phase<=11;phase++){
    if(phase>0)await next.click();
    await page.waitForTimeout(500);
    const label=[
      "loose","first-pin","first-five","third-pin","both-fives",
      "first-seven","rectangle","black-one","both-black",
      "center-aligned","center-locked","inspection",
    ][phase];
    await canvas.screenshot({path:dir+"/"+String(phase).padStart(2,"0")+"-"+label+".png"});
  }
  await page.setViewportSize({width:390,height:844});
  await page.waitForTimeout(900);
  await canvas.screenshot({path:dir+"/mobile-inspection.png"});
  const fitWarning=page.getByText("Mechanical fit not verified");
  if(!(await fitWarning.isVisible()))throw Error("Missing mechanical verification warning");
  if(errors.length)throw Error("Browser errors: "+errors.join("; "));
  const continueBtn=page.getByRole("button",{name:"Continue to Step 8"});
  await continueBtn.click();
  await canvas.waitFor({state:"detached",timeout:10000});
  console.log("Captured 12 Step 7 states, mobile and Step 8 navigation.");
  await context.close();
}finally{
  await browser.close();
}

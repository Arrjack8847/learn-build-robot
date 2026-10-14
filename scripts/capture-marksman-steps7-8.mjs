/**
 * Headless browser render snapshots of actual lesson UI using Playwright.
 * These are software QA images, NOT validation of physical connector fit.
 * Run after a Vite dev server starts on http://127.0.0.1:4173.
 */
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const root = process.env.MARKSMAN_QA_BASE_URL ?? "http://127.0.0.1:4173";
const output="artifacts/marksman-steps7-8";
await mkdir(output,{recursive:true});

const browser=await chromium.launch({
  headless:true,
  args:["--enable-webgl","--use-gl=angle","--use-angle=swiftshader",
    "--disable-software-rasterizer=false","--no-sandbox"],
});
const context=await browser.newContext({
  viewport:{width:1280,height:900},
  deviceScaleFactor:1,
  reducedMotion:"reduce",
});
const page=await context.newPage();
const errors=[];
page.on("pageerror",error=>errors.push(error.message));
page.on("console",message=>{if(message.type()==="error")errors.push(message.text());});

try{
  await page.addInitScript(()=>{
    const defaultConfig={hollowASide:"front",hollowBSide:"back",
      bridgeAStart:4,bridgeASide:"front",bridgeBStart:9,bridgeBSide:"back"};
    const transforms={
      STEP5_BEAM_11:{parent:null,position:[0,4.1,0],rotation:[0,0,0],model:"beam11.stl"},
      STEP5_BRIDGE_A:{parent:null,position:[-4.6,-1.5,0],rotation:[0,0,0],model:"bridge-48989.stl"},
      STEP5_BRIDGE_B:{parent:null,position:[-0.9,-1.5,0],rotation:[0,0,0],model:"bridge-48989.stl"},
      STEP5_HOLLOW_A:{parent:null,position:[3.1,-1.5,0],rotation:[0,0,0],model:"hollow-15100.stl"},
      STEP5_HOLLOW_B:{parent:null,position:[5.8,-1.5,0],rotation:[0,0,0],model:"hollow-15100.stl"},
    };
    const parents=["STEP5_BRIDGE_A","STEP5_BRIDGE_A","STEP5_BRIDGE_B","STEP5_BRIDGE_B",
      "STEP5_HOLLOW_A","STEP5_HOLLOW_B"];
    const positions=[[-1,0,0],[1,0,0],[-1,0,0],[1,0,0],[-0.5,0,0.5],[-0.5,0,0.5]];
    for(let i=0;i<6;i++){
      const id=i<4?"STEP5_LONG_PIN_0"+(i+1):"STEP5_SHORT_PIN_0"+(i-3);
      transforms[id]={parent:parents[i],position:positions[i],
        rotation:i<4?[Math.PI,0,0]:[0,0,0],
        model:i<4?"pin-long-step5.stl":"pin-pin-step5.stl"};
    }
    localStorage.setItem("robot:marksmanship:step5:prepared:v2",JSON.stringify({
      version:2,assemblyId:"marksman-step5-prepared-connectors",
      beamHoleCount:11,beamUnattached:true,tutorialCompleted:true,
      transforms,
    }));
    localStorage.setItem("robot:marksmanship:step6:assembled:v1",JSON.stringify({
      version:1,assemblyId:"marksman-step6-main-connector-beam",
      mountingChoices:defaultConfig,tutorialCompleted:true,mechanicallyVerified:false,
    }));
    localStorage.setItem("robolearn.progress.v1",JSON.stringify({
      studentName:"Screenshot QA",
      completedStepIds:Array.from({length:6},(_,i)=>"marksmanship-s"+(i+1)),
    }));
  });
  await page.goto(root+"/practical/marksmanship",{waitUntil:"networkidle",timeout:60000});
  await page.getByText("Connect two 15-hole side beams",{exact:true}).first().waitFor({
    state:"visible",timeout:30000,
  });
  const webglCanvas=page.locator(".assembly-lesson-stage canvas");
  await webglCanvas.waitFor({state:"visible",timeout:30000});
  await page.waitForTimeout(2000);
  const next7=page.getByRole("button",{name:"Next Action"});
  for(let i=0;i<3;i++){
    await next7.click({timeout:15000});
    await page.waitForTimeout(250);
  }
  await page.getByText("Insert the first blue end connector · hole 15",{exact:true}).first().waitFor({
    state:"visible",timeout:15000,
  });
  await page.waitForTimeout(1500);
  await page.locator(".assembly-lesson-stage").screenshot({path:output+"/step7-first-beam-with-pin-desktop.png"});
  for(let i=3;i<7;i++){
    await next7.click({timeout:15000});
    await page.waitForTimeout(250);
  }
  await page.getByText("Inspect the finished two-rail assembly",{exact:true}).first().waitFor({
    state:"visible",timeout:15000,
  });
  await page.waitForTimeout(1000);
  await page.locator(".assembly-lesson-stage").screenshot({path:output+"/step7-final-desktop.png"});
  await page.setViewportSize({width:390,height:844});
  await page.waitForTimeout(1200);
  await page.locator(".assembly-lesson-stage").screenshot({path:output+"/step7-final-mobile.png"});
  await page.setViewportSize({width:1280,height:900});
  await page.getByRole("checkbox").check();
  await page.getByRole("button",{name:"Complete Step"}).click();
  await page.getByText("Step 8 — Assemble and lock the rectangular frame",{exact:true}).first().waitFor({
    state:"visible",timeout:15000,
  });
  await page.locator("section[aria-label='Step 8 assemble and lock the rectangular frame'] canvas").waitFor({state:"visible",timeout:30000});
  await page.waitForTimeout(1500);
  const next8=page.getByRole("button",{name:"Next action"});
  for(let i=0;i<11;i++){
    await next8.click({timeout:10000});
    await page.waitForTimeout(200);
  }
  await page.getByText("Inspect the assembled frame",{exact:true}).first().waitFor({
    state:"visible",timeout:15000,
  });
  await page.waitForTimeout(1100);
  await page.locator("section[aria-label='Step 8 assemble and lock the rectangular frame'] > div").filter({
    has:page.locator("canvas"),
  }).first().screenshot({path:output+"/step8-final-desktop.png"});
  await page.setViewportSize({width:390,height:844});
  await page.waitForTimeout(900);
  await page.locator("section[aria-label='Step 8 assemble and lock the rectangular frame'] > div").filter({
    has:page.locator("canvas"),
  }).first().screenshot({path:output+"/step8-final-mobile.png"});
  if(errors.length)throw new Error("Browser console errors: "+errors.join("; ").slice(0,3000));
  console.log("QA snapshots recorded. Connector fit is NOT physically verified.");
} finally {
  await context.close();await browser.close();
}

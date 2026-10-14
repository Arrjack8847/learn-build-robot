import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";

const source=(path)=>readFileSync(resolve(path),"utf8");
const ui=source("src/components/practical/AssemblyLessonUI.tsx");
const route=source("src/routes/practical/$projectId.tsx");

test("Core 3D lessons retain the common header through insertion",()=>{
  for(const [step,path] of [
    [1,"src/components/practical/MarksmanMotorAssembly.tsx"],
    [3,"src/components/practical/StepThreeAssembly.tsx"],
    [4,"src/components/practical/StepFourAssembly.tsx"],
    [5,"src/components/practical/StepFiveAssembly.tsx"],
    [6,"src/components/practical/StepSixAssembly.tsx"],
    [7,"src/components/practical/MarksmanFramePreparation.tsx"],
  ]){
    const lesson=source(path);
    assert.ok(lesson.includes("AssemblyLessonHeader"),"Unified header missing from Step "+step);
  }
  assert.ok(source("src/components/practical/MarksmanMotorAssembly.tsx").includes("step={step}"),
    "Steps 1 and 2 must both use the shared header");
  for(const component of ["AssemblyLessonHeader","AssemblyActionCard","AssemblyPlaybackControls","AssemblyUtilityControls"]){
    assert.ok(ui.includes("export function "+component),component+" must be reusable");
  }
});

test("Action numbering is one-based and matches every lesson's action count",()=>{
  assert.ok(ui.includes("Action {actionIndex + 1} of {actionCount}"));
  for(const path of ["StepThreeAssembly.tsx","StepFourAssembly.tsx","StepFiveAssembly.tsx","StepSixAssembly.tsx"]){
    const lesson=source("src/components/practical/"+path);
    assert.ok(lesson.includes("actionCount={"),path);
    assert.ok(lesson.includes("AssemblyActionCard"),path);
    assert.ok(lesson.includes("AssemblyPlaybackControls"),path);
    assert.ok(lesson.includes("AssemblyUtilityControls"),path);
  }
  assert.ok(source("src/components/practical/MarksmanFramePreparation.tsx").includes("actionCount={ACTIONS.length}"));
});

test("Single in-view floating dock controls Steps 1–9 completion",()=>{
  assert.ok(route.includes("!isInteractiveMarksman && <footer"));
  assert.ok(ui.includes("isFinalAction ? \"Complete Step\""));
  assert.ok(route.includes("isStepFive && !stepFiveReady"));
  assert.ok(route.includes("isStepSix && !stepSixReady"));
  assert.ok(!source("src/components/practical/StepFiveAssembly.tsx").includes(">Continue to Step 6"));
  assert.ok(!source("src/components/practical/StepSixAssembly.tsx").includes(">Continue to Step 7"));
  assert.ok(route.includes("const [preview3D, setPreview3D] = useState(true)"));
});

test("Step 7 is the saved Step 6 rail handoff, Step 8 is the separate frame",()=>{
  const step7=source("src/components/practical/StepSevenRailsAssembly.tsx");
  const step8=source("src/components/practical/StepEightAssembly.tsx");
  assert.ok(route.includes('<StepSevenRailsAssembly onCompleteStep={finishCurrentStep} />'));
  assert.ok(route.includes('<StepEightAssembly onReadyChange={() => {}}'));
  assert.ok(step7.includes("STEP_SIX_RESULT"));
  assert.ok(step7.includes("STEP_SEVEN_RESULT_KEY"));
  assert.ok(step8.includes("STEP_EIGHT_RESULT_KEY"));
  assert.ok(step8.includes("physicalCheck"));
});

test("Previous Step stays visible and navigates by lesson rather than animation action",()=>{
  assert.ok(route.includes('aria-label="Robot step navigation"'),"Shared step navigation must be visible");
  assert.ok(route.includes('className="sticky top-0 z-30'),"Previous Step remains visible during lesson scrolling");
  assert.ok(route.includes('aria-label="Previous Step"'),"The control has an accessible, distinct name");
  assert.ok(route.includes('disabled={currentIndex === 0}'),"The first step has no previous step");
  assert.ok(route.includes('onClick={() => setCurrentIndex((index) => Math.max(0, index - 1))}'),
    "Step 7 must navigate back to Step 6, and Step 6 must navigate back to Step 5");
  assert.ok(ui.includes('aria-label="Previous action"'),"Previous Action remains a separate control");
  assert.ok(route.includes('to="/practical"'),"Existing exit-project navigation remains intact");
});

test("Step 6 uses one full-screen 3D stage without a mounting panel",()=>{
  assert.ok(route.includes("currentIndex !== previousStepIndex.current"));
  assert.ok(route.includes("lessonScrollArea.current.scrollTop = 0"));
  const step6=source("src/components/practical/StepSixAssembly.tsx");
  assert.ok(step6.includes("AssemblyStage"));
  assert.ok(!step6.includes("Mounting setup · confirm with real parts"));
  assert.ok(!step6.includes('type="checkbox"'));
  assert.ok(step6.includes("Photo-estimated layout"));
  assert.ok(ui.includes("min-h-11"),"Touch targets should be at least 44px high");
});

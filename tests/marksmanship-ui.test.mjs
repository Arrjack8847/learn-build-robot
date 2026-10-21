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
  assert.ok(route.includes("<BuildingFloatingDock"), "Reference-only steps use the standard floating dock");
  assert.ok(ui.includes("data-dock-expanded={expanded}"), "3D lessons have expandable floating docks");
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

test("Shared building navigation preserves separate step and animation controls", () => {
  const studio=source("src/components/practical/BuildingStudio.tsx");
  assert.ok(route.includes("<BuildingStudioHeader"), "Unified step header required");
  assert.ok(route.includes("<BuildingStepDrawer"), "Step list drawer required");
  assert.ok(route.includes("previousDisabled={currentIndex === 0}"), "Previous step disabled on first step");
  assert.ok(route.includes("onPrevious={() => setCurrentIndex(index => Math.max(0, index - 1))}"),
    "Previous step returns to previous project step");
  assert.ok(studio.includes('aria-label="Back to robot selection"'));
  assert.ok(studio.includes('to="/practical"'), "Existing exit navigation remains intact");
  assert.ok(studio.includes('aria-label="Choose a building step"'));
  assert.ok(ui.includes('aria-label="Previous action"'), "Previous action remains a separate control");
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

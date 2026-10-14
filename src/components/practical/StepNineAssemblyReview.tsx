import { useState } from "react";
import { AssemblyStage, AssemblyLessonHeader } from "./AssemblyLessonUI";
import { StepSevenRailsScene } from "./StepSevenRailsScene";
import { StepEightScene } from "./StepEightScene";
import { STEP5_SNAPSHOT_KEY } from "./StepFiveScene";
import { STEP_SIX_RESULT, type StepSixMountConfig, type StepSixStepFiveTransforms } from "./StepSixGeometry";
import { STEP_SEVEN_FINAL_PHASE, STEP_SEVEN_RESULT_KEY, STEP_EIGHT_RESULT_KEY, type StepSevenRailConfig } from "./stepSevenRailGeometry";
import { STEP_EIGHT_DEMO_CONFIG, type StepEightConfig } from "./stepEightGeometry";

type ReadyState = {
  a:{assemblyId:string;mountingChoices:StepSevenRailConfig;physicallySelfConfirmed:boolean};
  b:{assemblyId:string;config:StepEightConfig;physicallySelfConfirmed:boolean};
  stepSixConfig:StepSixMountConfig;transforms:StepSixStepFiveTransforms;
};
function loadReady():ReadyState|null {
  if(typeof window==="undefined")return null;
  try{
    const a=JSON.parse(window.localStorage.getItem(STEP_SEVEN_RESULT_KEY)??"null");
    const b=JSON.parse(window.localStorage.getItem(STEP_EIGHT_RESULT_KEY)??"null");
    const five=JSON.parse(window.localStorage.getItem(STEP5_SNAPSHOT_KEY)??"null");
    const six=JSON.parse(window.localStorage.getItem(STEP_SIX_RESULT)??"null");
    if(a?.assemblyId!=="marksman-assembly-a-side-rails-v1"
      ||b?.assemblyId!=="marksman-assembly-b-rectangular-frame-v1"
      ||a.physicallySelfConfirmed!==true||b.physicallySelfConfirmed!==true
      ||!five?.transforms||!six?.mountingChoices)return null;
    return {a,b,stepSixConfig:six.mountingChoices,transforms:five.transforms};
  }catch{return null;}
}
export function StepNineAssemblyReview({onCompleteStep}:{onCompleteStep:()=>void}){
  const [ready]=useState(loadReady);
  const [view,setView]=useState<"A"|"B">("A");
  const [ack,setAck]=useState(false);
  return <div className="w-full space-y-3">
    <AssemblyLessonHeader step={9} title="Inspect the two separate finished assemblies"/>
    <div className="flex flex-wrap gap-2" role="group" aria-label="Choose completed assembly">
      {(["A","B"] as const).map(id=><button type="button" key={id}
        aria-pressed={view===id} onClick={()=>setView(id)}
        className={"min-h-11 rounded-xl border px-4 text-sm font-bold "+(view===id
          ?"border-[#168eea] bg-[#168eea] text-white":"border-slate-200 bg-white text-[#132654]")}>
        Assembly {id} · {id==="A"?"Side rails":"Locked frame"}
      </button>)}
    </div>
    <AssemblyStage
      scene={!ready?<div role="alert" className="grid h-full place-items-center p-5 text-center text-sm text-amber-900">
        Both Step 7 and Step 8 need a saved physical self-check in this browser. Return to those lessons to complete their independent assemblies.
      </div>:view==="A"?<StepSevenRailsScene phase={STEP_SEVEN_FINAL_PHASE} config={ready.a.mountingChoices}
        stepSixConfig={ready.stepSixConfig} prepared={ready.transforms} replayKey={0}
        paused={false} resetCameraKey={0} reducedMotion={true} onMotionComplete={()=>{}}/>
        :<StepEightScene phase={11} config={ready.b.config??STEP_EIGHT_DEMO_CONFIG}
        replayKey={0} resetCameraKey={0} paused={false} reducedMotion={true}
        autoInspect={false} cameraView="iso"/>}
      status={<span className="rounded-xl border border-amber-200 bg-amber-50/95 px-3 py-2 text-xs font-bold text-amber-900">
        Two independent assemblies · no combined mounting geometry yet
      </span>}
      dock={<div className="space-y-3 text-sm text-[#132654]">
        <h3 className="font-extrabold">Do not connect Assembly A and B yet</h3>
        <p>Rotate each structure separately and compare with the real IMG_1697 photograph. Future alignment between the two assemblies still needs mechanical verification.</p>
        <label className="flex items-start gap-2 text-xs">
          <input className="mt-0.5 size-4" type="checkbox" checked={ack}
            onChange={e=>setAck(e.target.checked)} />
          I checked that Assembly A and B are still separate and ready for the next confirmed construction operation.
        </label>
        <button type="button" disabled={!ready||!ack}
          onClick={onCompleteStep}
          className="min-h-11 w-full rounded-xl bg-[#168eea] px-5 font-bold text-white disabled:opacity-40">
          Complete Step 9 · Keep assemblies separate
        </button>
      </div>}
    />
  </div>;
}

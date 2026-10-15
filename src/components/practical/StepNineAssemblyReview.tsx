import { useEffect, useState } from "react";
import { CheckCircle2, ScanSearch, TriangleAlert } from "lucide-react";
import {
  AssemblyActionCard, AssemblyLessonHeader, AssemblyPlaybackControls, AssemblyStage,
} from "./AssemblyLessonUI";
import { StepNineScene } from "./StepNineScene";
import { STEP5_SNAPSHOT_KEY } from "./StepFiveScene";
import {
  STEP_SIX_RESULT, type StepSixMountConfig, type StepSixStepFiveTransforms,
} from "./StepSixGeometry";
import {
  STEP_SEVEN_RESULT_KEY, STEP_EIGHT_RESULT_KEY, type StepSevenRailConfig,
} from "./stepSevenRailGeometry";
import {
  STEP_EIGHT_DEMO_CONFIG, type StepEightConfig,
} from "./stepEightGeometry";
import {
  STEP_NINE_ACTIONS, STEP_NINE_ASSEMBLY_ID, STEP_NINE_FINAL_PHASE,
  stepNineMating,
} from "./stepNineGeometry";

type ReadyState = {
  a:{assemblyId:string;mountingChoices:StepSevenRailConfig;physicallySelfConfirmed:boolean};
  b:{assemblyId:string;config:StepEightConfig;physicallySelfConfirmed:boolean};
  stepSixConfig:StepSixMountConfig;transforms:StepSixStepFiveTransforms;
};
function loadReady():ReadyState|null {
  if(typeof window==="undefined")return null;
  try {
    const a=JSON.parse(window.localStorage.getItem(STEP_SEVEN_RESULT_KEY)??"null");
    const b=JSON.parse(window.localStorage.getItem(STEP_EIGHT_RESULT_KEY)??"null");
    const five=JSON.parse(window.localStorage.getItem(STEP5_SNAPSHOT_KEY)??"null");
    const six=JSON.parse(window.localStorage.getItem(STEP_SIX_RESULT)??"null");
    if(a?.assemblyId!=="marksman-assembly-a-side-rails-v1"
      ||b?.assemblyId!=="marksman-assembly-b-rectangular-frame-v1"
      ||a.physicallySelfConfirmed!==true||b.physicallySelfConfirmed!==true
      ||!a.mountingChoices||!five?.transforms||!six?.mountingChoices)return null;
    return {a,b,stepSixConfig:six.mountingChoices,transforms:five.transforms};
  }catch{return null;}
}
export function StepNineAssemblyReview({onCompleteStep}:{onCompleteStep:()=>void}){
  const [ready]=useState(loadReady);
  const [phase,setPhase]=useState(0);
  const [animating,setAnimating]=useState(Boolean(ready));
  const [paused,setPaused]=useState(false);
  const [replayKey,setReplayKey]=useState(0);
  const [resetCameraKey,setResetCameraKey]=useState(0);
  const [reducedMotion,setReducedMotion]=useState(false);
  const [cameraView,setCameraView]=useState<"iso"|"top"|"side"|"front"|"bottom">("iso");
  const [physicalCheck,setPhysicalCheck]=useState(false);
  const action=STEP_NINE_ACTIONS[phase]!;
  const final=phase===STEP_NINE_FINAL_PHASE;
  // Older browser snapshots may contain the pre-update Step 8 hole setting.
  // Preview the APPROVED updated finished assembly, but do not claim the
  // previous physical self-check also covered that updated configuration.
  const savedFrameConfig=ready?.b.config??STEP_EIGHT_DEMO_CONFIG;
  const needsStepEightRefresh=Boolean(ready &&
    savedFrameConfig.fifteenNearHole!==STEP_EIGHT_DEMO_CONFIG.fifteenNearHole);
  const frameConfig=needsStepEightRefresh?STEP_EIGHT_DEMO_CONFIG:savedFrameConfig;
  const beamY=ready?.transforms["STEP5_BEAM_11"]?.position[1]??4.1;
  const mating=ready?stepNineMating(ready.a.mountingChoices,ready.stepSixConfig,beamY):null;
  useEffect(()=>{
    const preference=window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if(!preference)return;
    const change=()=>setReducedMotion(preference.matches);
    change();preference.addEventListener?.("change",change);
    return ()=>preference.removeEventListener?.("change",change);
  },[]);
  function go(target:number){
    if(animating)return; // Finish one guided movement before accepting another.
    setAnimating(true);
    setPhase(Math.max(0,Math.min(STEP_NINE_FINAL_PHASE,target)));
    setPaused(false);setCameraView("iso");setPhysicalCheck(false);
  }
  function complete(){
    if(!ready||!final||!physicalCheck||animating||needsStepEightRefresh)return;
    try {
      window.localStorage.setItem("robot:marksmanship:step9:joined:v1",JSON.stringify({
        version:1,assemblyId:STEP_NINE_ASSEMBLY_ID,
        fromStep7:ready.a.assemblyId,fromStep8:ready.b.assemblyId,
        stepSevenReceivingHoles:[7,11],fourOriginalBluePins:true,
        usesUpdatedStepEightAssembly:true,stepEightBlackPinHoles:[7,11],
        stepEightFlippedUpsideDown:true,flipAxis:"horizontal-long-beam",
        stationaryDuringInsertion:"step8",loweredDuringInsertion:"step7",
        inspectionViews:["front","side","top","bottom"],
        longestStepEightBeamFacesFront:true,geometryUnchanged:true,
        photographedHolePositions:true,mechanicallyVerified:false,
        physicallySelfConfirmed:true,geometryWarnings:mating?.geometryWarnings??[],
        completedAt:new Date().toISOString(),
      }));
    }catch{/* Local storage is best-effort; lesson navigation still works. */}
    onCompleteStep();
  }
  return <div className="w-full space-y-3">
    <AssemblyLessonHeader step={9} title="Connect Step 8 to Step 7 · four blue pins"
      actionIndex={phase} actionCount={STEP_NINE_ACTIONS.length}
      trailing={<span className="inline-flex items-center gap-1 rounded-full
        border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10px]
        font-bold text-amber-900">
        <TriangleAlert className="size-3"/>Photo-guided · fit unverified
      </span>}/>
    <AssemblyStage
      scene={!ready?<div role="alert"
        className="grid h-full place-items-center p-5 text-center text-sm text-amber-900">
        Complete and physically check Steps 7 and 8 in this browser first. Step 9
        reuses those saved assemblies without replacing their pins or beams.
      </div>:<StepNineScene phase={phase} config={ready.a.mountingChoices}
        frameConfig={frameConfig} stepSixConfig={ready.stepSixConfig}
        prepared={ready.transforms} replayKey={replayKey} paused={paused}
        resetCameraKey={resetCameraKey} reducedMotion={reducedMotion}
        cameraView={cameraView} onMotionComplete={()=>setAnimating(false)}/>}
      status={<span className="inline-flex items-center gap-1.5 rounded-xl border
        border-sky-200 bg-sky-50/95 px-3 py-2 text-xs font-bold text-sky-900">
        <CheckCircle2 className="size-3.5"/>
        {phase===0
          ?"Preparation · completed Step 7 on left / updated Step 8 on right"
          :phase===1
            ?"Orient Step 8 · flip the complete frame upside down"
            :phase===2
              ?"Align four Step 8 pins beneath Step 7 holes 7 + 11"
              :phase===3
                ?"Keep Step 8 still · lower Step 7 onto all four blue pins"
                :"Inspect all four pin heads and grey cross-supports"}
      </span>}
      tools={<div className="flex flex-wrap items-center gap-1.5">
        <button type="button" title="Reset camera" aria-label="Reset Step 9 3D camera"
          onClick={()=>{setCameraView("iso");setResetCameraKey(v=>v+1);}}
          className="grid size-10 place-items-center rounded-xl border border-slate-200
            bg-white/95 text-slate-700 shadow-sm">
          <ScanSearch className="size-4"/>
        </button>
        {(["iso","top","front","side","bottom"] as const).map(view=><button
          type="button" key={view} disabled={!ready}
          aria-pressed={cameraView===view} onClick={()=>setCameraView(view)}
          className={"min-h-10 rounded-xl border px-2.5 text-xs font-bold capitalize shadow-sm "+
            (cameraView===view?"border-[#168eea] bg-[#168eea] text-white":
              "border-slate-200 bg-white/95 text-slate-700")}>
          {view==="iso"?"3D":view}
        </button>)}
      </div>}
      dock={<div className="space-y-3 text-[#132654]">
        <AssemblyActionCard actionIndex={phase} actionCount={STEP_NINE_ACTIONS.length}
          title={action.title} instruction={action.instruction}
          note={phase>=2?"The marked hole numbering starts at the exposed free end that already has a blue pin.":undefined}/>
        {phase===0&&<div className="grid grid-cols-2 gap-2 text-[11px] sm:text-xs">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5">
            <p className="font-extrabold">Assembly A · Step 7</p>
            <p className="mt-0.5 text-slate-600">Completed rails, turned 180° horizontally. All original connectors retained.</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5">
            <p className="font-extrabold">Assembly B · Updated Step 8</p>
            <p className="mt-0.5 text-slate-600">Completed frame with four blue pins and black locks in holes 7/11. Flip the whole frame upside down in Action 1.</p>
          </div>
        </div>}
        {needsStepEightRefresh&&<p role="alert" className="rounded-xl border border-amber-200
          bg-amber-50 p-2.5 text-[11px] leading-5 text-amber-900">
          Your browser saved an older Step 8 setting. The 3D preview shows the
          updated 7-and-11 configuration. Return to Step 8 and complete its
          physical check again before marking Step 9 finished.
        </p>}
        {mating?.geometryWarnings.length?<div role="alert" className="rounded-xl
          border border-amber-200 bg-amber-50 p-2.5 text-[11px] leading-5 text-amber-950">
          <span className="font-extrabold">Check saved geometry against your real photo:</span>
          {mating.geometryWarnings.map(item=><p key={item} className="mt-1">{item}</p>)}
          <p className="mt-1">The viewer preserves Step 7 as saved; it does not move an existing connector to hide a collision.</p>
        </div>:null}
        {final&&<label className="flex items-start gap-2 rounded-xl border
          border-sky-200 bg-sky-50 p-2.5 text-xs leading-5">
          <input type="checkbox" className="mt-0.5 size-4 shrink-0"
            checked={physicalCheck} onChange={e=>setPhysicalCheck(e.target.checked)}/>
          I checked the real assembly against the top, side and underside photos:
          Step 8 stays underneath and its four blue pins point upward; the whole
          Step 7 structure is lowered over the pins into holes 7 and 11 on both
          outer white rails. The two grey cross-supports and four pin heads are
          visible from the underside, and the longest white beam remains front-facing.
          I understand the 3D seating depth has not been physically measured.
        </label>}
        <AssemblyPlaybackControls
          onPrevious={()=>go(phase-1)}
          onReplay={()=>{if(animating)return;setAnimating(true);setPaused(false);setReplayKey(v=>v+1);}}
          onTogglePause={()=>setPaused(v=>!v)}
          onNext={()=>go(phase+1)}
          paused={paused} previousDisabled={!ready||animating||phase===0}
          replayDisabled={!ready||animating} pauseDisabled={!ready}
          nextDisabled={!ready||animating} isFinalAction={final}
          onComplete={complete}
          completeDisabled={!ready||animating||!physicalCheck||needsStepEightRefresh}/>
        <p className="text-[11px] text-slate-500">
          Action 0 prepares the two finished structures. Action 2 parks Step 8
          underneath and lifts Step 7 clear. Action 3 lowers Step 7 while Step 8
          remains stationary. Use the Bottom view to inspect the two grey
          cross-supports and four pin heads. Previous, Replay and Pause preserve
          the original Step 7 and Step 8 components.
          {animating?" Wait for the current animation to finish before advancing.":""}
        </p>
      </div>}
    />
  </div>;
}

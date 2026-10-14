import { useEffect, useState } from "react";
import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AssemblyLessonHeader, AssemblyActionCard, AssemblyPlaybackControls, AssemblyUtilityControls, AssemblyStage } from "./AssemblyLessonUI";
import { STEP5_SNAPSHOT_KEY } from "./StepFiveScene";
import { StepSixScene, type StepSixPreparedSnapshot } from "./StepSixScene";
import {
  STEP_SIX_DRAFT, STEP_SIX_RESULT,
  STEP_SIX_PHOTO_SUGGESTION, configComplete,
  getStepSixSnapshot, validateMountConfig,
  type StepSixMountConfig, type StepSixSide,
} from "./StepSixGeometry";

const ACTIONS = [
  ["6.1", "Identify all 11 mounting holes",
    "Keep the 11-hole beam from Step 5 separate from the four prepared connector units. Count its holes from the hollow-connector end, 1 through 11."],
  ["6.2", "Mount the first hollow connector",
    "Align the built-in +X post of the first prepared 15100 unit with beam hole 1. Move the WHOLE prepared assembly along the beam's Z axis; its original black pin stays attached."],
  ["6.3", "Mount the second hollow connector",
    "On the opposite face, align the second prepared 15100 unit with beam hole 2. Insert its original molded post without changing the position of its black pin."],
  ["6.4", "Identify bridge A's mounting holes",
    "Compare with your real Step 6 assembly. The two bridge mount axes are 16 mm apart. Therefore choose holes two indices apart, NOT adjacent holes."],
  ["6.5", "Insert bridge A as one rigid unit",
    "Align BOTH original long pins of bridge A with the selected beam holes. Insert the whole bridge straight along their shared axis. Do not reinsert pins into its body."],
  ["6.6", "Identify bridge B's mounting holes",
    "Choose the second mounting pair toward the far end of the 11-hole beam. Verify it from your physical assembly and select its mounting face."],
  ["6.7", "Insert bridge B as one rigid unit",
    "Insert both long pins together through the chosen pair. Their original positions relative to the bridge body stay fixed."],
  ["6.8", "Inspect the finished connector beam",
    "Inspect from the top, left and right. Two hollow and two bridge units must be attached to the 11-hole beam. Keep this assembly for the new Step 7 side-rail attachment."],
] as const;
const A_OPTIONS=[3,4,5,6,7] as const;
const B_OPTIONS=[6,7,8,9] as const;

function readPrepared():StepSixPreparedSnapshot|null{
  if(typeof window==="undefined")return null;
  try{
    const snap=JSON.parse(window.localStorage.getItem(STEP5_SNAPSHOT_KEY)||"null");
    if(!snap || snap.version!==2 || snap.assemblyId!=="marksman-step5-prepared-connectors"
      ||snap.beamHoleCount!==11||snap.beamUnattached!==true
      ||(snap.tutorialCompleted!==true && snap.physicallySelfConfirmed!==true)||!snap.transforms)return null;
    for(const id of ["STEP5_BEAM_11","STEP5_BRIDGE_A","STEP5_BRIDGE_B",
      "STEP5_HOLLOW_A","STEP5_HOLLOW_B","STEP5_LONG_PIN_01","STEP5_LONG_PIN_02",
      "STEP5_LONG_PIN_03","STEP5_LONG_PIN_04","STEP5_SHORT_PIN_01","STEP5_SHORT_PIN_02"]){
      const part=snap.transforms[id];
      if(!part||!Array.isArray(part.position)||part.position.length!==3
        ||!part.position.every((n:unknown)=>typeof n==="number"&&Number.isFinite(n))
        ||!Array.isArray(part.rotation)||part.rotation.length!==3)return null;
    }
    return snap as StepSixPreparedSnapshot;
  }catch{return null;}
}
function readDraft():{config:StepSixMountConfig;phase:number}{
  // Photo-based positions are provisional 3D demonstration geometry, never physical certification.
  const empty={config:{...STEP_SIX_PHOTO_SUGGESTION},phase:0};
  if(typeof window==="undefined")return empty;
  try{
    const saved=JSON.parse(window.localStorage.getItem(STEP_SIX_DRAFT)||"null");
    if(!saved?.config)return empty;
    const side=(v:unknown):StepSixSide|""=>v==="front"||v==="back"?v:"";
    const num=(v:unknown)=>typeof v==="number"&&Number.isInteger(v)?v:0;
    const c=saved.config;
    const config:StepSixMountConfig={
      hollowASide:side(c.hollowASide),hollowBSide:side(c.hollowBSide),
      bridgeAStart:num(c.bridgeAStart),bridgeASide:side(c.bridgeASide),
      bridgeBStart:num(c.bridgeBStart),bridgeBSide:side(c.bridgeBSide),
    };
    const phase=configComplete(config)&&Number.isInteger(saved.phase)
      &&saved.phase>=0&&saved.phase<8?saved.phase:0;
    const valid=validateMountConfig(config).length===0;
    return {config:valid ? config : {...STEP_SIX_PHOTO_SUGGESTION},phase:valid?phase:0};
  }catch{return empty;}
}

export function StepSixAssembly({onReadyChange,onBackToStep5,onContinueToStep7}:{
  onReadyChange:(ready:boolean)=>void;
  onBackToStep5:()=>void;
  onContinueToStep7:()=>void;
}){
  const [prepared,setPrepared]=useState<StepSixPreparedSnapshot|null>(null);
  const [draft]=useState(readDraft);
  const [config]=useState<StepSixMountConfig>(draft.config);
  const [phase,setPhase]=useState(draft.phase);
  const [busy,setBusy]=useState(false);
  const [paused,setPaused]=useState(false);
  const [replayKey,setReplayKey]=useState(0);
  const [resetCameraKey,setResetCameraKey]=useState(0);
  const [showManual,setShowManual]=useState(false);
  const [reducedMotion,setReducedMotion]=useState(false);
  const errors=validateMountConfig(config);
  const calibrated=errors.length===0;
  const ready=Boolean(prepared&&calibrated&&phase===7&&!busy);
  useEffect(()=>{setPrepared(readPrepared());},[]);
  useEffect(()=>{
    const media=window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if(!media)return;
    const update=()=>setReducedMotion(media.matches);
    update();media.addEventListener?.("change",update);
    return ()=>media.removeEventListener?.("change",update);
  },[]);
  useEffect(()=>{
    onReadyChange(ready);
    try{
      window.localStorage.setItem(STEP_SIX_DRAFT,JSON.stringify({config,phase}));
      if(ready&&prepared)window.localStorage.setItem(STEP_SIX_RESULT,JSON.stringify({
        ...getStepSixSnapshot(config,prepared.assemblyId),
        mountingChoices:config,tutorialCompleted:true,physicallyVerified:false,
        configurationBasis:"photo-estimate-unverified",completedAt:new Date().toISOString(),
      }));
      else window.localStorage.removeItem(STEP_SIX_RESULT);
    }catch{/* Browser storage optional. Step 5 handoff still required. */}
  },[ready,prepared,config,phase,onReadyChange]);

  function changePhase(next:number){
    if(busy||!calibrated||!prepared||next===phase)return;
    setBusy(true);setPaused(false);setPhase(Math.max(0,Math.min(7,next)));
  }
  function returnToFive(){
    setPhase(0);setPaused(false);setBusy(false);
    try{window.localStorage.removeItem(STEP_SIX_RESULT);
      window.localStorage.removeItem(STEP_SIX_DRAFT);}catch{/* optional */}
    onBackToStep5();
  }
  const action=ACTIONS[phase]!;

  return <div className="relative z-10 w-full space-y-3">
    <AssemblyLessonHeader step={6} title="Attach connectors to the 11-hole beam"
      actionIndex={phase} actionCount={ACTIONS.length} />
    {!prepared&&<div role="alert" className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-xs leading-5 text-amber-950">
      <TriangleAlert className="mr-1 inline size-4"/>
      No physically confirmed Step 5 saved state was found in this browser.
      Finish the Step 5 tutorial first.
      <Button type="button" size="sm" variant="outline" className="ml-2" onClick={returnToFive}>Open Step 5</Button>
    </div>}
    <AssemblyStage
      scene={prepared ? <StepSixScene phase={phase} prepared={prepared} config={config}
        replayKey={replayKey} paused={paused} resetCameraKey={resetCameraKey}
        reducedMotion={reducedMotion} onMotionComplete={()=>setBusy(false)}/>
        : <div className="grid h-full place-items-center p-6 text-center text-sm text-slate-600">
            Return to Step 5 to prepare the connector units before viewing this animation.
          </div>}
      status={<span className="inline-block rounded-xl border border-amber-200 bg-amber-50/95 px-2.5 py-2 text-[11px] font-bold text-amber-900">
        Photo-estimated layout · not mechanically verified
      </span>}
      tools={<AssemblyUtilityControls step={6} manualShown={showManual}
        onResetView={()=>setResetCameraKey(k=>k+1)}
        onToggleManual={()=>setShowManual(v=>!v)}
        onRestart={()=>{setPhase(0);setPaused(false);setBusy(false);}} />}
      dock={<>
        <AssemblyActionCard actionIndex={phase} actionCount={ACTIONS.length}
          title={action[1]} instruction={action[2]} />
        <AssemblyPlaybackControls paused={paused}
          previousDisabled={phase===0||busy} replayDisabled={busy||!calibrated||!prepared}
          pauseDisabled={!prepared}
          nextDisabled={!calibrated||!prepared||busy||phase===7}
          isFinalAction={phase===7} completeDisabled={!ready} onComplete={onContinueToStep7}
          onPrevious={()=>changePhase(phase-1)}
          onReplay={()=>{setPaused(false);setBusy(true);setReplayKey(k=>k+1);}}
          onTogglePause={()=>setPaused(p=>!p)}
          onNext={()=>changePhase(phase+1)}/>
      </>}
    />
    {showManual&&<div className="rounded-xl border border-slate-200 bg-white p-3">
      <img className="mx-auto max-h-80 w-full object-contain"
        src="/marksmanship/steps/6.png" alt="Original manual Step 6 reference retained during development"/>
    </div>}
    <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-950">
      <TriangleAlert aria-hidden="true" className="mr-1 inline size-3.5"/>
      The visible assembly uses provisional hole positions from a reference photograph. It is a teaching preview;
      completing this lesson does not certify physical pin fit or exact mounting faces.
      Compare the real kit and retained manual before physically building.
    </p>
  </div>;
}

import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AssemblyLessonHeader, AssemblyActionCard, AssemblyPlaybackControls, AssemblyUtilityControls, AssemblyStage } from "./AssemblyLessonUI";
import { getStepFivePreparedSnapshot, STEP5_SNAPSHOT_KEY, StepFiveScene } from "./StepFiveScene";

const STEP_FOUR_RESULT = "robot:marksmanship:step4:assembled:v1";
const PHASE_STORAGE = "robot:marksmanship:step5:phase:v2";

const ACTIONS = [
  {
    number: "5.1", title: "Inspect the 11-hole beam",
    instruction: "Take the straight beam with 11 circular holes. Check that all holes are empty. Keep the beam above the loose connector pieces.",
    note: "Original 11.stl: 11 holes, 8 mm pitch. No connectors touch the beam during Step 5.",
  },
  {
    number: "5.2A", title: "Insert the first long pin into bridge A",
    instruction: "Find the left through-hole of the first 48989 bridge. Line up the long pin with the hole's axis, then insert the shaft toward the opposite face until its collar stops at the near face.",
    note: "Hole centre: x=-8, y=4 mm (source STL); insertion along negative Z. The bridge already includes its own perpendicular posts.",
  },
  {
    number: "5.2B", title: "Insert the second long pin into bridge A",
    instruction: "Find the second mounting hole on this bridge. Insert the next long pin on the same parallel axis. Inspect both projecting ends without attaching the unit to the beam.",
    note: "Second centre: x=+8, y=4 mm. Both long pins remain children of bridge A.",
  },
  {
    number: "5.3A", title: "Insert the first long pin into bridge B",
    instruction: "Take the second 48989 bridge. Align the third long pin with the first mounting hole and slide it into place, as you did for bridge A.",
    note: "The second bridge has identical geometry, with no invented additional posts or connector parts.",
  },
  {
    number: "5.3B", title: "Insert the second long pin into bridge B",
    instruction: "Insert the fourth long pin into the remaining mounting hole. Both completed bridge units should have matching pin positions and face directions.",
    note: "The two bridge subassemblies remain separate from the 11-hole beam.",
  },
  {
    number: "5.4", title: "Prepare hollow connector A",
    instruction: "Identify the hollow cylindrical opening on the first 15100 right-angle connector. Insert one two-sided 16 mm pin along the opening's Z axis, stopping the central collar against the outer face.",
    note: "The opening is at native x=-4, y=0 mm. It is a close press-fit profile; check the real kit before treating the assembly as certified.",
  },
  {
    number: "5.5", title: "Prepare hollow connector B",
    instruction: "Repeat with the second 15100 body and the remaining two-sided pin. Keep its built-in perpendicular projection untouched.",
    note: "Both hollow connector bodies have their own child pin for reversible animation and later reuse.",
  },
  {
    number: "5.6", title: "Inspect the five separate prepared units",
    instruction: "Check the empty 11-hole beam above two bridge assemblies and two hollow connector assemblies. Each bridge has two long pins. Each hollow connector has one short two-sided pin. Do not install anything on the beam until Step 6.",
    note: "This completes the 3D tutorial; real-world fit is not automatically verified.",
  },
] as const;
function initialPhase(){
  if(typeof window==="undefined")return 0;
  try{
    const n=Number(window.localStorage.getItem(PHASE_STORAGE));
    return Number.isInteger(n)&&n>=0&&n<ACTIONS.length?n:0;
  }catch{return 0;}
}
function initialPhysicalCheck(){
  if(typeof window==="undefined")return false;
  try{
    const raw=window.localStorage.getItem(STEP5_SNAPSHOT_KEY);
    return JSON.parse(raw||"null")?.physicallySelfConfirmed===true;
  }catch{return false;}
}
export function StepFiveAssembly({onReadyChange,onBackToStep4,onContinueToStep6}:{
  onReadyChange:(ready:boolean)=>void;
  onBackToStep4:()=>void;
  onContinueToStep6:()=>void;
}){
  const [phase,setPhase]=useState(initialPhase);
  
  const [busy,setBusy]=useState(false);
  const [paused,setPaused]=useState(false);
  const [replayKey,setReplayKey]=useState(0);
  const [resetCameraKey,setResetCameraKey]=useState(0);
  const [showManual,setShowManual]=useState(false);
  const [reducedMotion,setReducedMotion]=useState(false);
  const [hasStepFour,setHasStepFour]=useState(false);
  const ready=phase===ACTIONS.length-1&&!busy;

  useEffect(()=>{
    const media=window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if(!media)return;
    const update=()=>setReducedMotion(media.matches);
    update();
    media.addEventListener?.("change",update);
    return ()=>media.removeEventListener?.("change",update);
  },[]);
  useEffect(()=>{
    try{setHasStepFour(Boolean(window.localStorage.getItem(STEP_FOUR_RESULT)));}
    catch{setHasStepFour(false);}
  },[]);
  useEffect(()=>{
    onReadyChange(ready);
    try{
      window.localStorage.setItem(PHASE_STORAGE,String(phase));
      if(ready){
        window.localStorage.setItem(STEP5_SNAPSHOT_KEY,JSON.stringify({
          ...getStepFivePreparedSnapshot(),
          physicallySelfConfirmed:true,
          preparedAt:new Date().toISOString(),
        }));
      }else{
        window.localStorage.removeItem(STEP5_SNAPSHOT_KEY);
      }
      // Step 4 shooting mechanism snapshot is NEVER modified.
    }catch{/* Browser storage is optional. */}
  },[phase,ready,onReadyChange]);

  const changePhase=(next:number)=>{
    if(busy)return;
    setPaused(false);setBusy(true);
    setPhase(Math.max(0,Math.min(ACTIONS.length-1,next)));
  };
  const restart=()=>{
    setPaused(false);setBusy(false);
    setPhase(0);setReplayKey(0);
    setResetCameraKey(k=>k+1);
  };
  const action=ACTIONS[phase]!;
  return <div className="relative z-10 w-full space-y-3">
    <AssemblyLessonHeader step={5} title="Prepare the 11-hole beam and connectors"
      actionIndex={phase} actionCount={ACTIONS.length} />
    <AssemblyStage
      scene={<StepFiveScene phase={phase} replayKey={replayKey} paused={paused}
        reducedMotion={reducedMotion} resetCameraKey={resetCameraKey}
        onMotionComplete={()=>setBusy(false)}/>}
      status={ready ? <span className="rounded-xl bg-emerald-50/95 p-2 text-xs font-bold text-emerald-900">Step 5 tutorial complete · beam remains empty</span> : null}
      tools={<AssemblyUtilityControls step={5} manualShown={showManual}
        onResetView={()=>setResetCameraKey(k=>k+1)}
        onToggleManual={()=>setShowManual(v=>!v)}
        onRestart={restart}/>}
      dock={<>
        <AssemblyActionCard actionIndex={phase} actionCount={ACTIONS.length}
          title={action.title} instruction={action.instruction}/>
        <AssemblyPlaybackControls paused={paused}
          previousDisabled={phase===0||busy} replayDisabled={busy}
          nextDisabled={phase===ACTIONS.length-1||busy}
          isFinalAction={phase===ACTIONS.length-1}
          completeDisabled={!ready} onComplete={onContinueToStep6}
          onPrevious={()=>changePhase(phase-1)}
          onReplay={()=>{setPaused(false);setBusy(true);setReplayKey(k=>k+1);}}
          onTogglePause={()=>setPaused(v=>!v)}
          onNext={()=>changePhase(phase+1)}/>
      </>}
    />
    {showManual&&<div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-3 sm:grid-cols-2">
      <figure>
        <img src="/marksmanship/steps/5.png" className="w-full object-contain"
          alt="Official manual Step 5 with 11-hole beam and connector units separate"/>
        <figcaption className="text-center text-xs text-slate-600">Step 5 reference</figcaption>
      </figure>
      <figure>
        <img src="/marksmanship/steps/6.png" className="w-full object-contain"
          alt="Official Step 6 assembly, for reference only; do not attach yet"/>
        <figcaption className="text-center text-xs text-slate-600">Step 6 — reference only</figcaption>
      </figure>
    </div>}
    <p className="text-[11px] leading-5 text-slate-500">
      <TriangleAlert className="mr-1 inline size-3.5"/>
      The original 48989 and 15100 bodies and genuine pin STLs are used at measured bore centres.
      Long pins align with 5 mm bridge bores. The 15100 hollow bore is tight against the 16 mm
      two-sided pin and may require real-world press-fit verification. Positions are
      geometry-informed, with no simulated beam attachment or geometry stretching.
    </p>
  </div>;
}

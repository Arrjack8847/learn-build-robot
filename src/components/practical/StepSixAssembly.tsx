import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Eye, Pause, Play, RotateCcw, ScanSearch, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { STEP5_SNAPSHOT_KEY } from "./StepFiveScene";
import { StepSixScene, type StepSixPreparedSnapshot } from "./StepSixScene";
import {
  EMPTY_MOUNT_CONFIG, STEP_SIX_DRAFT, STEP_SIX_RESULT,
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
    "Inspect from the top, left and right. Two hollow and two bridge units must be attached to the 11-hole beam. Keep this assembly for Step 8."],
] as const;
const A_OPTIONS=[3,4,5,6,7] as const;
const B_OPTIONS=[6,7,8,9] as const;

function readPrepared():StepSixPreparedSnapshot|null{
  if(typeof window==="undefined")return null;
  try{
    const snap=JSON.parse(window.localStorage.getItem(STEP5_SNAPSHOT_KEY)||"null");
    if(!snap || snap.version!==2 || snap.assemblyId!=="marksman-step5-prepared-connectors"
      ||snap.beamHoleCount!==11||snap.beamUnattached!==true
      ||snap.physicallySelfConfirmed!==true||!snap.transforms)return null;
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
function readDraft():{config:StepSixMountConfig;phase:number;confirmed:boolean}{
  const empty={config:{...EMPTY_MOUNT_CONFIG},phase:0,confirmed:false};
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
    return {config,phase,confirmed:saved.confirmed===true};
  }catch{return empty;}
}
const faceOptions=[["","Select from real assembly"],["front","Front / +Z face"],["back","Back / -Z face"]] as const;

export function StepSixAssembly({onReadyChange,onBackToStep5,onContinueToStep7}:{
  onReadyChange:(ready:boolean)=>void;
  onBackToStep5:()=>void;
  onContinueToStep7:()=>void;
}){
  const [prepared,setPrepared]=useState<StepSixPreparedSnapshot|null>(null);
  const [draft]=useState(readDraft);
  const [config,setConfig]=useState<StepSixMountConfig>(draft.config);
  const [phase,setPhase]=useState(draft.phase);
  const [confirmed,setConfirmed]=useState(draft.confirmed);
  const [busy,setBusy]=useState(false);
  const [paused,setPaused]=useState(false);
  const [replayKey,setReplayKey]=useState(0);
  const [resetCameraKey,setResetCameraKey]=useState(0);
  const [showManual,setShowManual]=useState(false);
  const [reducedMotion,setReducedMotion]=useState(false);
  const errors=validateMountConfig(config);
  const calibrated=errors.length===0;
  const ready=Boolean(prepared&&calibrated&&confirmed&&phase===7&&!busy);
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
      window.localStorage.setItem(STEP_SIX_DRAFT,JSON.stringify({config,phase,confirmed}));
      if(ready&&prepared)window.localStorage.setItem(STEP_SIX_RESULT,JSON.stringify({
        ...getStepSixSnapshot(config,prepared.assemblyId),
        mountingChoices:config,completedAt:new Date().toISOString(),
      }));
      else window.localStorage.removeItem(STEP_SIX_RESULT);
    }catch{/* Browser storage optional. Step 5 handoff still required. */}
  },[ready,prepared,config,phase,confirmed,onReadyChange]);

  function usePhotoLayout(){
    if(busy)return;
    // Suggested from the user's Step 6 reference, NOT mechanically certified.
    setConfig({...STEP_SIX_PHOTO_SUGGESTION});
    setPhase(0);setConfirmed(false);setPaused(false);
    setResetCameraKey(n=>n+1);
  }
  function choose<K extends keyof StepSixMountConfig>(key:K,value:StepSixMountConfig[K]){
    if(busy)return;
    setConfig(c=>({...c,[key]:value}));setPhase(0);setConfirmed(false);setPaused(false);
  }
  function changePhase(next:number){
    if(busy||!calibrated||!prepared||next===phase)return;
    setBusy(true);setPaused(false);setPhase(Math.max(0,Math.min(7,next)));
  }
  function returnToFive(){
    setPhase(0);setConfirmed(false);setPaused(false);setBusy(false);
    try{window.localStorage.removeItem(STEP_SIX_RESULT);
      window.localStorage.removeItem(STEP_SIX_DRAFT);}catch{/* optional */}
    onBackToStep5();
  }
  const action=ACTIONS[phase]!;
  const pairA=config.bridgeAStart?("Holes "+config.bridgeAStart+" & "+(config.bridgeAStart+2)):"Unselected";
  const pairB=config.bridgeBStart?("Holes "+config.bridgeBStart+" & "+(config.bridgeBStart+2)):"Unselected";

  const faceSelect=(key:"hollowASide"|"hollowBSide"|"bridgeASide"|"bridgeBSide",label:string)=>(
    <label className="space-y-1 text-xs font-semibold text-slate-700">
      {label}
      <select aria-label={label} value={config[key]}
        className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2 text-sm"
        onChange={e=>choose(key,e.target.value as StepSixSide|"")}>
        {faceOptions.map(([value,title])=><option value={value} key={value}>{title}</option>)}
      </select>
    </label>
  );
  const pairSelect=(key:"bridgeAStart"|"bridgeBStart",label:string,options:readonly number[])=>(
    <label className="space-y-1 text-xs font-semibold text-slate-700">
      {label}
      <select aria-label={label} value={config[key]}
        className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2 text-sm"
        onChange={e=>choose(key,Number(e.target.value))}>
        <option value={0}>Select from physical reference</option>
        {options.map(v=><option key={v} value={v}>Holes {v} & {v+2}</option>)}
      </select>
    </label>
  );
  return <div className="relative z-10 w-full space-y-3">
    <div className="flex flex-wrap items-center justify-between gap-2 px-1">
      <p className="text-xs font-black uppercase tracking-[0.12em] text-[#116eaf]">
        STEP 6 — ATTACH THE CONNECTORS TO THE 11-HOLE BEAM
      </p>
      <span className="rounded-full bg-white p-2 text-[11px] font-semibold text-slate-600">
        <Eye className="mr-1 inline size-3.5"/> Orbit · zoom · pinch
      </span>
    </div>
    {!prepared&&<div role="alert" className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-xs leading-5 text-amber-950">
      <TriangleAlert className="mr-1 inline size-4"/>
      No physically confirmed Step 5 saved state was found in this browser.
      Finish and confirm Step 5 first.
      <Button type="button" size="sm" variant="outline" className="ml-2" onClick={returnToFive}>Open Step 5</Button>
    </div>}
    <div className="grid w-full min-w-0 items-start gap-4 lg:grid-cols-[minmax(0,1.8fr)_minmax(315px,0.95fr)] xl:gap-6">
      <div className="min-w-0 space-y-3">
    {prepared&&!calibrated&&<div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-left text-xs leading-5 text-amber-900" role="status">
      <TriangleAlert className="mt-0.5 size-4 shrink-0"/>
      <span>The 3D workspace is ready. Choose the six <strong>Mounting setup</strong> options
        in the panel beside the viewer (or below it on mobile) to unlock Next and Replay.</span>
    </div>}
    <div className="relative h-[clamp(340px,55vh,620px)] min-w-0 overflow-hidden rounded-2xl border border-[#cddceb] bg-[#f7fafc]">
      {prepared?<StepSixScene phase={phase} prepared={prepared} config={config}
        replayKey={replayKey} paused={paused} resetCameraKey={resetCameraKey}
        reducedMotion={reducedMotion} onMotionComplete={()=>setBusy(false)}/>
        :<div className="grid h-full place-items-center p-4 text-center text-sm text-slate-600">
          Return to Step 5 to load the genuine prepared connector units.
        </div>}
      {ready&&<span className="pointer-events-none absolute right-2 top-2 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-800">
        <CheckCircle2 className="mr-1 inline size-4"/> Prepared for Step 7
      </span>}
    </div>
    <div aria-live="polite" className="rounded-xl border border-sky-100 bg-white p-3 text-left sm:p-4">
      <p className="text-xs font-extrabold uppercase tracking-[0.1em] text-[#116eaf]">
        Action {phase+1}/8 · {action[0]}
      </p>
      <h3 className="mt-1 text-base font-extrabold text-[#132654]">{action[1]}</h3>
      <p className="mt-1 text-sm leading-6 text-slate-700">{action[2]}</p>
    </div>
    <div className="grid gap-2 rounded-xl bg-sky-50 p-3 text-xs font-bold text-sky-900 sm:grid-cols-3">
      <span>Hollow units: holes 1 & 2</span>
      <span>Bridge A: {pairA}</span>
      <span>Bridge B: {pairB}</span>
    </div>
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div className="flex flex-wrap gap-2">
        <Button type="button" size="sm" variant="outline" disabled={phase===0||busy}
          onClick={()=>changePhase(phase-1)}>
          <ArrowLeft className="size-4"/> Previous
        </Button>
        <Button type="button" size="sm" variant="outline" disabled={phase===0||busy||!calibrated}
          onClick={()=>{setPaused(false);setBusy(true);setReplayKey(k=>k+1);}}>
          <RotateCcw className="size-4"/> Replay
        </Button>
        <Button type="button" size="sm" variant="outline" disabled={!prepared}
          onClick={()=>setPaused(p=>!p)}>
          {paused?<Play className="size-4"/>:<Pause className="size-4"/>}
          {paused?"Resume":"Pause"}
        </Button>
      </div>
      <Button type="button" size="sm" disabled={!calibrated||!prepared||busy||phase===7}
        className="bg-[#168eea] text-white" onClick={()=>changePhase(phase+1)}>
        {phase===6?"Final inspection":"Next action"} <ArrowRight className="size-4"/>
      </Button>
    </div>
    <div className="flex flex-wrap gap-2">
      <Button type="button" size="sm" variant="ghost" onClick={()=>setResetCameraKey(k=>k+1)}>
        <ScanSearch className="size-4"/> Reset camera
      </Button>
      <Button type="button" size="sm" variant="ghost" onClick={()=>setShowManual(v=>!v)}>
        <Eye className="size-4"/> {showManual?"Hide":"Show"} Step 6 manual
      </Button>
      <Button type="button" size="sm" variant="ghost"
        onClick={()=>{setPhase(0);setConfirmed(false);setPaused(false);setBusy(false);}}>
        <RotateCcw className="size-4"/> Restart Step 6
      </Button>
      <Button type="button" size="sm" variant="outline" onClick={returnToFive}>
        <ArrowLeft className="size-4"/> Return to Step 5
      </Button>
    </div>
      </div>
      <aside aria-label="Step 6 mounting settings and verification"
        className="min-w-0 space-y-3 lg:sticky lg:top-3 lg:max-h-[calc(100svh-185px)] lg:overflow-y-auto lg:pr-1">
    <div className="rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-[0_10px_28px_rgba(20,55,90,0.06)]">
      <h4 className="text-sm font-extrabold text-[#132654]">Mounting setup · confirm with real parts</h4>
      <p className="mt-1 text-xs leading-5 text-slate-600">
        First compare with your real Step 6 assembly: the hollow units use holes 1–2,
        but the bridge pairs and mounting faces still need confirmation.
        Front is the +Z face; Back is −Z. Select all six fields to unlock animations.
      </p>
      <div className="mt-3 rounded-xl border border-sky-200 bg-sky-50 p-3">
        <p className="text-xs font-semibold leading-5 text-[#145e9f]">
          Latest physical photo suggests: hollow connectors at 1 &amp; 2 on opposite
          sides, centre bridge at 4 &amp; 6 (near face), far-end bridge at 9 &amp; 11
          (back face). Both black pins stay upright. Verify the photographed
          hole indices and orientation against the actual parts.
        </p>
        <Button type="button" size="sm" variant="outline"
          className="mt-2 border-sky-300 bg-white text-[#145e9f]"
          disabled={busy} onClick={usePhotoLayout}>
          Use photographed layout (estimated)
        </Button>
      </div>
      <div className="mt-3 grid gap-3">
        {faceSelect("hollowASide","Hollow A · hole 1 · installation face")}
        {faceSelect("hollowBSide","Hollow B · hole 2 · installation face")}
        {pairSelect("bridgeAStart","Bridge A · first two-hole pair",A_OPTIONS)}
        {faceSelect("bridgeASide","Bridge A · installation face")}
        {pairSelect("bridgeBStart","Bridge B · far-end two-hole pair",B_OPTIONS)}
        {faceSelect("bridgeBSide","Bridge B · installation face")}
      </div>
      <p className="mt-2 text-xs font-bold text-[#145e9f]">
        Bridge A: {pairA} · Bridge B: {pairB} · 16 mm mounting-hole spacing.
      </p>
      {errors.length>0&&<p role="status" className="mt-2 text-xs leading-5 text-amber-800">
        <TriangleAlert className="mr-1 inline size-3.5"/>
        {errors[0]} Animations are disabled until mounting points are selected.
      </p>}
    </div>
    {showManual&&<div className="rounded-xl border border-slate-200 bg-white p-3">
      <img className="mx-auto max-h-80 w-full object-contain"
        src="/marksmanship/steps/6.png" alt="Official Marksmanship Step 6 assembly illustration"/>
    </div>}
    {phase===7&&<label className="flex cursor-pointer items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm leading-6 text-amber-950">
      <input type="checkbox" checked={confirmed}
        className="mt-1 size-4 shrink-0 accent-[#168eea]"
        onChange={e=>setConfirmed(e.target.checked)}/>
      <span>I compared every hole, mounting face, pin direction and inserted connector
        with my <strong>actual Step 6 physical assembly</strong>. The displayed seating
        depths are geometry-informed and not certified by STL collision testing.</span>
    </label>}
    {ready&&<Button type="button" className="w-full bg-[#168eea] text-white"
      onClick={onContinueToStep7}>
      Continue to Step 7 <ArrowRight className="size-4"/>
    </Button>}
    <p className="text-[11px] leading-5 text-slate-500">
      <TriangleAlert className="mr-1 inline size-3.5"/>
      Authentic Step 5 bodies/pins are reused from saved transforms. The photograph
      indicates near-side and far-side bridge assemblies, with both black pins upright.
      The suggested 4/6 and 9/11 pairs are estimates from a single angled photo.
      Confirm those positions, elastic fit and insertion depths on the actual kit.
      Step 7 remains unchanged.
    </p>
      </aside>
    </div>
  </div>;
}

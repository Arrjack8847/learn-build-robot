import { useEffect, useState } from "react";
import {
  ArrowLeft, ArrowRight, CheckCircle2, ChevronDown, Pause, Play,
  RotateCcw, ScanSearch, TriangleAlert, Upload,
} from "lucide-react";
import { StepEightScene } from "./StepEightScene";
import { STEP_EIGHT_RESULT_KEY } from "./stepSevenRailGeometry";
import {
  STEP_EIGHT_DEMO_CONFIG, STEP_EIGHT_MECHANICALLY_VERIFIED,
  STEP_EIGHT_SEQUENCE, stepEightConfigurationErrors,
  type StepEightConfig,
} from "./stepEightGeometry";

/**
 * Replaces the former photo-based Step 8 demonstration. This is deliberately
 * the only full-screen guided viewer for Step 8. The original manual remains
 * available in the enclosing route until the complete 1–7 UI migration.
 */
export function StepEightAssembly({
  onReadyChange,onBackToStep7,onContinueToStep9,
}:{
  onReadyChange:(ready:boolean)=>void;
  onBackToStep7:()=>void;
  onContinueToStep9:()=>void;
}) {
  const [phase,setPhase]=useState(0);
  const [physicalCheck,setPhysicalCheck]=useState(false);
  const [config,setConfig]=useState<StepEightConfig>({...STEP_EIGHT_DEMO_CONFIG});
  const [paused,setPaused]=useState(false);
  const [animating,setAnimating]=useState(false);
  const [replayKey,setReplayKey]=useState(0);
  const [resetCameraKey,setResetCameraKey]=useState(0);
  const [reducedMotion,setReducedMotion]=useState(false);
  const [autoInspect,setAutoInspect]=useState(true);
  const [cameraView,setCameraView]=useState<"iso"|"top"|"side"|"bottom">("iso");
  const [reference,setReference]=useState<string|null>(null);
  const finished=phase===STEP_EIGHT_SEQUENCE.length-1 &&
    stepEightConfigurationErrors(config).length===0;
  const ready=finished&&!animating&&physicalCheck;
  const details=STEP_EIGHT_SEQUENCE[phase]!;
  useEffect(()=>{
    onReadyChange(ready);
  },[onReadyChange,ready]);
  useEffect(()=>{
    const motion=window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if(!motion)return;
    const update=()=>setReducedMotion(motion.matches);
    update();
    motion.addEventListener?.("change",update);
    return ()=>motion.removeEventListener?.("change",update);
  },[]);
  useEffect(()=>{
    return ()=>{if(reference)URL.revokeObjectURL(reference);};
  },[reference]);
  function go(target:number){
    const next=Math.max(0,Math.min(STEP_EIGHT_SEQUENCE.length-1,target));
    if(next===phase)return;
    setAnimating(!reducedMotion);
    setPaused(false);setAutoInspect(true);setCameraView("iso");setPhase(next);
  }
  function edit(patch:Partial<StepEightConfig>){
    setConfig(previous=>({...previous,...patch}));
    setPhase(0);setPhysicalCheck(false);setPaused(false);
    setAnimating(false);setResetCameraKey(value=>value+1);
  }
  function uploadPhoto(file:File|undefined){
    if(!file||!file.type.startsWith("image/"))return;
    setReference(URL.createObjectURL(file));
  }
  function completeStepEight(){
    if(!ready)return;
    try{
      window.localStorage.setItem(STEP_EIGHT_RESULT_KEY,JSON.stringify({
        version:1,assemblyId:"marksman-assembly-b-rectangular-frame-v1",
        componentIds:["FIVE_A","FIVE_B","SEVEN_A","SEVEN_B","FIFTEEN","BLUE_1","BLUE_2","BLUE_3","BLUE_4","BLACK_1","BLACK_2"],config,mechanicallyVerified:false,
        physicallySelfConfirmed:true,blueConnectorsOnFiveHoleBeams:[2,4],
        unverified:["sevenHoleReceiverIndices","blackPinReceivingHoles","lockingInsertionDepth"],
        completedAt:new Date().toISOString(),
      }));
    }catch{/* storage not guaranteed */}
    onContinueToStep9();
  }
  return (
    <section aria-label="Step 8 assemble and lock the rectangular frame"
      className="mx-auto w-full min-w-0 max-w-[1540px]">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2 px-1">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-sky-700">
            Marksman · Interactive assembly
          </p>
          <h2 className="text-base font-black text-[#132654] sm:text-lg">
            Step 8 — Assemble and lock the rectangular frame
          </h2>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-[11px] font-bold text-amber-900">
          <TriangleAlert className="size-3.5"/>
          Mechanical fit not verified
        </span>
      </div>

      <div className="relative h-[clamp(450px,70svh,820px)] min-w-0 overflow-hidden
        rounded-[20px] border border-slate-200 bg-[#f5f8fc]
        shadow-[0_16px_45px_rgba(19,38,84,0.09)] sm:rounded-[28px]">
        <StepEightScene phase={phase} config={config} paused={paused}
          replayKey={replayKey} resetCameraKey={resetCameraKey}
          reducedMotion={reducedMotion} autoInspect={autoInspect}
          cameraView={cameraView} onMotionComplete={()=>setAnimating(false)}/>
        <span className="pointer-events-none absolute left-3 top-3 rounded-full
          bg-white/90 px-3 py-1.5 text-[10px] font-bold text-slate-600 shadow-sm
          backdrop-blur sm:text-xs">
          Drag to orbit · Pinch to zoom
        </span>
        <button type="button" aria-label="Reset 3D camera" title="Reset camera"
          className="absolute right-3 top-3 grid size-10 place-items-center rounded-full
            border border-slate-200 bg-white/95 text-slate-700 shadow-sm
            hover:bg-sky-50 focus-visible:outline-2 focus-visible:outline-sky-500"
          onClick={()=>{setCameraView("iso");setResetCameraKey(key=>key+1);}}>
          <ScanSearch className="size-4.5"/>
        </button>

        {finished&&<div aria-label="Completed frame inspection viewpoints"
          className="absolute left-3 top-14 flex flex-wrap gap-1.5 rounded-xl
            border border-slate-200 bg-white/90 p-1.5 shadow-sm backdrop-blur">
          {(["top","side","bottom","iso"] as const).map(view=>
            <button key={view} type="button" aria-pressed={cameraView===view}
              onClick={()=>{setAutoInspect(false);setCameraView(view);}}
              className={"min-h-9 rounded-lg px-2.5 text-[11px] font-bold capitalize "+
                (cameraView===view?"bg-[#168eea] text-white":"bg-white text-slate-700")}>
              {view==="iso"?"Isometric":view}
            </button>)}
        </div>}
        <div className="absolute inset-x-2 bottom-2 z-10 mx-auto max-w-[780px]
          rounded-2xl border border-white/80 bg-white/95 p-3 text-[#132654]
          shadow-[0_12px_35px_rgba(16,38,69,0.16)] backdrop-blur-lg
          sm:inset-x-4 sm:bottom-4 sm:p-4">
          <div aria-live="polite" className="flex min-w-0 items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl
              bg-[#e7f3ff] text-[12px] font-black text-[#0f69bd]">
              {details.number}
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="text-[13px] font-extrabold leading-5 sm:text-base">
                {details.title}
              </h3>
              <p className="mt-0.5 text-[11px] leading-[1.45] text-slate-600 sm:text-sm">
                {details.instruction}
              </p>
            </div>
          </div>
          <div aria-label="Step 8 micro-action progress" className="mt-3 flex gap-1">
            {STEP_EIGHT_SEQUENCE.map((item,index)=>(
              <span key={index} title={item.number+" "+item.title}
                className={"h-1.5 min-w-0 flex-1 rounded-full transition-colors "+
                  (index<=phase?"bg-[#168eea]":"bg-slate-200")}/>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-1.5 sm:gap-2">
            <button type="button" disabled={phase===0||animating}
              aria-label="Previous assembly action" onClick={()=>go(phase-1)}
              className="inline-flex min-h-11 items-center gap-1 rounded-xl border
                border-slate-200 px-2.5 text-xs font-bold disabled:opacity-40 sm:px-4 sm:text-sm">
              <ArrowLeft className="size-4"/><span className="hidden min-[390px]:inline">Previous</span>
            </button>
            <button type="button" aria-label={paused?"Resume animation":"Pause animation"}
              aria-pressed={paused} onClick={()=>setPaused(value=>!value)}
              className="grid size-11 shrink-0 place-items-center rounded-xl border border-slate-200">
              {paused?<Play className="size-4"/>:<Pause className="size-4"/>}
            </button>
            <button type="button" disabled={phase===0||animating}
              aria-label="Replay current assembly action"
              onClick={()=>{setAnimating(!reducedMotion);setPaused(false);setReplayKey(value=>value+1);}}
              className="grid size-11 shrink-0 place-items-center rounded-xl border border-slate-200">
              <RotateCcw className="size-4"/>
            </button>
            <button type="button"
              disabled={animating||(finished&&!physicalCheck)}
              onClick={()=>finished?completeStepEight():go(phase+1)}
              className="ml-auto inline-flex min-h-11 items-center justify-center gap-1
                rounded-xl bg-[#168eea] px-3 text-xs font-extrabold text-white
                transition-colors hover:bg-[#0e7ac8] disabled:cursor-not-allowed disabled:opacity-50 sm:px-5 sm:text-sm">
              {finished?"Complete Step 8":"Next action"}<ArrowRight className="size-4"/>
            </button>
          </div>
          {animating&&<p role="status" className="mt-2 text-center text-[11px] font-semibold text-sky-700">
            Smooth assembly motion in progress · Pause or resume at any time
          </p>}
          {finished&&!animating&&<p className="mt-2 text-center text-[11px] font-semibold text-emerald-800">
            <CheckCircle2 className="mr-1 inline size-3.5"/>
            Step 8 demonstration complete · confirm physical locking joints before continuing
          </p>}
        </div>
      </div>

      {finished&&<label className="mt-3 flex items-start gap-3 rounded-xl border border-sky-200 bg-sky-50 p-3 text-sm text-[#132654]">
        <input type="checkbox" checked={physicalCheck} className="mt-1 size-4 shrink-0"
          onChange={event=>setPhysicalCheck(event.target.checked)}/>
        I inspected my actual frame and confirm that both black connectors lock the central 15-hole beam into the rectangular frame. This is my own physical confirmation, not a certified fit calculation.
      </label>}
      <details className="mt-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
        <summary className="flex cursor-pointer list-none items-center justify-between
          gap-3 font-bold text-[#132654]">
          <span>Mechanical reference and optional calibration</span>
          <ChevronDown className="size-4 shrink-0"/>
        </summary>
        <p className="mt-3 text-xs leading-5 text-slate-600 sm:text-sm">
          The blue pins are assigned to positions 2 and 4 from the approved assembly sequence on each 5-hole beam.
          The receiving holes of the two 7-hole beams, the two black-pin mounting
          holes on the 15-hole beam, connector type, orientation and seating depth
          are <strong>not yet photo-verified</strong>. Default pairs below are
          geometrically coaxial demonstrations, not confirmed physical locations.
          The central pins are shown engaging Hole 3 of each 5-hole beam.
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5 text-xs font-bold">
            7-hole receiving pair · provisional
            <select aria-label="Select first receiving hole on each seven-hole beam"
              className="min-h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm"
              value={config.sevenNearHole}
              onChange={e=>edit({sevenNearHole:Number(e.target.value) as 1|2|3})}>
              <option value={1}>Holes 1 and 5</option>
              <option value={2}>Holes 2 and 6 (demo)</option>
              <option value={3}>Holes 3 and 7</option>
            </select>
          </label>
          <label className="flex flex-col gap-1.5 text-xs font-bold">
            15-hole black-pin pair · provisional
            <select aria-label="Select first black connector hole on fifteen-hole beam"
              className="min-h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm"
              value={config.fifteenNearHole}
              onChange={e=>edit({fifteenNearHole:Number(e.target.value)})}>
              {Array.from({length:11},(_,i)=><option key={i} value={i+1}>
                Holes {i+1} and {i+5}{i===5?" (demo)":""}
              </option>)}
            </select>
          </label>
        </div>
        <label className="mt-3 flex flex-wrap items-center gap-2 text-xs font-bold">
          <Upload className="size-4"/>Compare with an original close-up photograph
          <input aria-label="Upload a local real Step 8 assembly photograph"
            type="file" accept="image/*" className="block min-w-0 max-w-full text-xs"
            onChange={event=>uploadPhoto(event.target.files?.[0])}/>
        </label>
        {reference&&<img src={reference} alt="Locally chosen physical Step 8 reference"
          className="mt-3 max-h-72 w-full rounded-xl object-contain"/>}
        <label className="mt-3 inline-flex cursor-pointer items-center gap-2 text-xs font-semibold">
          <input type="checkbox" checked={autoInspect}
            onChange={event=>setAutoInspect(event.target.checked)}/>
          Auto-orbit completed assembly
        </label>
        {!STEP_EIGHT_MECHANICALLY_VERIFIED&&<p className="mt-3 text-xs text-amber-900">
          Pending: photographs IMG_1688, IMG_1690, IMG_1692–IMG_1696 and
          physical measurement of the connector shoulders and insertion depth.
        </p>}
      </details>
      <button type="button" onClick={onBackToStep7}
        className="mt-2 inline-flex min-h-10 items-center gap-1.5 px-2 text-xs
          font-semibold text-slate-500 hover:text-sky-700">
        <ArrowLeft className="size-4"/>Return to Step 7
      </button>
    </section>
  );
}

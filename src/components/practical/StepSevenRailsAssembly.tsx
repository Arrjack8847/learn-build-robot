import { useEffect, useState } from "react";
import { TriangleAlert, Upload } from "lucide-react";
import { AssemblyStage, AssemblyActionCard, AssemblyLessonHeader, AssemblyPlaybackControls, AssemblyUtilityControls } from "./AssemblyLessonUI";
import { STEP5_SNAPSHOT_KEY } from "./StepFiveScene";
import { STEP_SIX_RESULT, validateMountConfig, type StepSixMountConfig, type StepSixStepFiveTransforms } from "./StepSixGeometry";
import { StepSevenRailsScene } from "./StepSevenRailsScene";
import {
  STEP_SEVEN_ACTIONS, STEP_SEVEN_ASSEMBLY_ID, STEP_SEVEN_MECHANICALLY_VERIFIED,
  STEP_SEVEN_PHOTO_CONFIG, STEP_SEVEN_RESULT_KEY, railConfigurationErrors,
  railGuide, type StepSevenRailConfig,
} from "./stepSevenRailGeometry";

type Handoff = { stepSixConfig:StepSixMountConfig;transforms:StepSixStepFiveTransforms;stepSixId:string };
function readHandoff():Handoff|null {
  if(typeof window==="undefined")return null;
  try {
    const five=JSON.parse(window.localStorage.getItem(STEP5_SNAPSHOT_KEY)??"null");
    const six=JSON.parse(window.localStorage.getItem(STEP_SIX_RESULT)??"null");
    const choices=six?.mountingChoices as StepSixMountConfig|undefined;
    if(five?.version!==2 || !five.transforms || six?.assemblyId!=="marksman-step6-main-connector-beam"
      ||six?.tutorialCompleted!==true || !choices || validateMountConfig(choices).length)return null;
    for(const id of ["STEP5_BEAM_11","STEP5_HOLLOW_A","STEP5_HOLLOW_B","STEP5_BRIDGE_A","STEP5_BRIDGE_B",
      "STEP5_LONG_PIN_01","STEP5_LONG_PIN_02","STEP5_LONG_PIN_03","STEP5_LONG_PIN_04",
      "STEP5_SHORT_PIN_01","STEP5_SHORT_PIN_02"]) {
      const pose=five.transforms[id];
      if(!pose||!Array.isArray(pose.position)||!Array.isArray(pose.rotation)
        ||pose.position.length!==3||pose.rotation.length!==3
        ||![...pose.position,...pose.rotation].every((n:unknown)=>typeof n==="number"&&Number.isFinite(n)))return null;
    }
    return {stepSixConfig:choices,transforms:five.transforms,stepSixId:six.assemblyId};
  } catch{return null;}
}
export function StepSevenRailsAssembly({onCompleteStep}: {onCompleteStep:()=>void}){
  const [handoff]=useState(readHandoff);
  const [config,setConfig]=useState<StepSevenRailConfig>({...STEP_SEVEN_PHOTO_CONFIG});
  const [phase,setPhase]=useState(0);
  const [busy,setBusy]=useState(false);
  const [paused,setPaused]=useState(false);
  const [replayKey,setReplayKey]=useState(0);
  const [resetCameraKey,setResetCameraKey]=useState(0);
  const [reducedMotion,setReducedMotion]=useState(false);
  const [manual,setManual]=useState(false);
  const [physicalCheck,setPhysicalCheck]=useState(false);
  const [photo,setPhoto]=useState<string|null>(null);
  const valid=railConfigurationErrors(config).length===0;
  const finished=phase===STEP_SEVEN_ACTIONS.length-1&&!busy;
  const ready=Boolean(handoff&&finished&&valid&&physicalCheck);
  useEffect(()=>{
    const media=window.matchMedia?.("(prefers-reduced-motion: reduce)");if(!media)return;
    const update=()=>setReducedMotion(media.matches);update();
    media.addEventListener?.("change",update);
    return ()=>media.removeEventListener?.("change",update);
  },[]);
  useEffect(()=>()=>{if(photo)URL.revokeObjectURL(photo);},[photo]);
  function nextPhase(value:number){
    if(busy||!handoff||!valid)return;
    setBusy(true);setPaused(false);setPhysicalCheck(false);setPhase(Math.max(0,Math.min(STEP_SEVEN_ACTIONS.length-1,value)));
  }
  function finish(){
    if(!ready||!handoff)return;
    try{
      window.localStorage.setItem(STEP_SEVEN_RESULT_KEY,JSON.stringify({
        version:1,assemblyId:STEP_SEVEN_ASSEMBLY_ID,stepSixAssemblyId:handoff.stepSixId,
        railComponents:["STEP7_RAIL_FRONT_15","STEP7_RAIL_BACK_15"],
        centralComponentIds:["STEP5_BEAM_11","STEP5_HOLLOW_A","STEP5_HOLLOW_B","STEP5_BRIDGE_A","STEP5_BRIDGE_B"],
        additionalBlueConnectorCount:2,additionalBlueConnectorMounts:[{rail:"STEP7_RAIL_FRONT_15",hole:15},{rail:"STEP7_RAIL_BACK_15",hole:15}],additionalBlueConnectorsInstalled:true,
        additionalBlueConnectorIds:["STEP7_END_BLUE_FIRST","STEP7_END_BLUE_SECOND"],
        attachmentMethod:"grey-connector-assembly-pressed-onto-each-supported-rail",
        bothRailsMountedBeforeEndPins:true,
        mountingChoices:config,mechanicallyVerified:STEP_SEVEN_MECHANICALLY_VERIFIED,
        physicallySelfConfirmed:true,source:"learner-physical-attestation",completedAt:new Date().toISOString(),
      }));
    }catch{/* local storage may be unavailable; navigation still works */}
    onCompleteStep();
  }
  const item=STEP_SEVEN_ACTIONS[phase]!;
  const front=handoff?railGuide(handoff.stepSixConfig,"STEP7_RAIL_FRONT_15",config):null;
  const back=handoff?railGuide(handoff.stepSixConfig,"STEP7_RAIL_BACK_15",config):null;
  return <div className="relative z-10 w-full space-y-3">
    <AssemblyLessonHeader step={7} title="Connect two 15-hole side beams"
      actionIndex={phase} actionCount={STEP_SEVEN_ACTIONS.length}
      trailing={<span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-bold text-amber-950">
        Mechanical fit not verified
      </span>}/>
    {!handoff&&<div role="alert" className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-950">
      Complete and save Step 6 in this browser to load its real connector assembly and original Step 5 parts.
      Use Previous Step to return.
    </div>}
    <AssemblyStage
      scene={handoff?<StepSevenRailsScene phase={phase} config={config}
        stepSixConfig={handoff.stepSixConfig} prepared={handoff.transforms}
        replayKey={replayKey} paused={paused} resetCameraKey={resetCameraKey}
        reducedMotion={reducedMotion} onMotionComplete={()=>setBusy(false)}/>
        :<div className="grid h-full place-items-center p-5 text-sm text-slate-600">Missing saved Step 6 assembly</div>}
      status={<span className="rounded-xl border border-amber-200 bg-amber-50/95 px-2.5 py-2 text-[11px] font-bold text-amber-900">
        Photo-aligned holes · fit unverified
      </span>}
      tools={<AssemblyUtilityControls step={7} manualShown={manual}
        onResetView={()=>setResetCameraKey(v=>v+1)}
        onToggleManual={()=>setManual(v=>!v)}
        onRestart={()=>{setPhase(0);setPaused(false);setBusy(false);setPhysicalCheck(false);}}/>}
      dock={<>
        <AssemblyActionCard actionIndex={phase} actionCount={STEP_SEVEN_ACTIONS.length}
          title={item.title} instruction={item.instruction}
          note="Both white beams attach first. Candidate holes: first rail 6/8, second rail 1/3. Both blue pins enter the exposed end holes afterwards. Confirm connector fit with your physical kit."/>
        <AssemblyPlaybackControls paused={paused} onPrevious={()=>nextPhase(phase-1)}
          onReplay={()=>{if(!handoff)return;setBusy(true);setPaused(false);setReplayKey(v=>v+1);}}
          onTogglePause={()=>setPaused(v=>!v)} onNext={()=>nextPhase(phase+1)}
          previousDisabled={phase===0||busy} replayDisabled={!handoff||busy}
          pauseDisabled={!handoff} nextDisabled={busy||!handoff||!valid}
          isFinalAction={phase===STEP_SEVEN_ACTIONS.length-1}
          completeDisabled={!ready} onComplete={finish}/>
      </>}
    />
    {finished&&<label className="flex items-start gap-3 rounded-xl border border-sky-200 bg-sky-50 p-3 text-sm text-[#132654]">
      <input type="checkbox" checked={physicalCheck} className="mt-1 size-4 shrink-0"
        onChange={e=>setPhysicalCheck(e.target.checked)}/>
      I inspected my physical robot: both white rails are securely attached to the grey mounting joints and BOTH blue pins are installed in their exposed end holes. This is my own inspection, not a certified model-geometry fit.
    </label>}
    {manual&&<div className="grid gap-3 rounded-xl border border-slate-200 p-3 sm:grid-cols-2">
      {[7,8].map(n=><figure key={n}><img className="mx-auto max-h-64 w-full object-contain"
        src={`/marksmanship/steps/${n}.png`} alt={`Original unchanged manual Step ${n}`}/>
        <figcaption className="text-xs text-slate-500">Original manual Step {n}</figcaption></figure>)}
    </div>}
    <details className="rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-600">
      <summary className="cursor-pointer font-bold text-[#132654]">Physical geometry and reference calibration</summary>
      <p className="mt-2 leading-5">IMG_1729 and IMG_1731 show the grey assembly pressed down onto a supported white beam; IMG_1732–1733 show the two extra end pins fitted after both rails are mounted. Source STLs are unchanged. Candidate rail receiving pairs remain 6/8 and 1/3, and the new blue pins go in free-end hole 1 (numbered hole 15 from the grey-connector end). The exact grey/black shaft engagement and seating depth still require a real-kit check.</p>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        <label>Rail-to-center offset · provisional scene units
          <input className="mt-1 block w-full rounded-lg border px-2 py-2" type="number" min="1.4" max="4" step="0.1"
            value={config.railCenterDistance} onChange={e=>{setConfig(c=>({...c,railCenterDistance:Number(e.target.value)}));setPhase(0);}}/>
        </label>
        <div className="rounded-lg bg-sky-50 p-2 text-xs leading-5 text-sky-900"><strong>Photo-matched hole pairs</strong><p>First beam: holes 6 and 8 · second beam: holes 1 and 3, counted from the grey connector end. New blue pins: both hole 15 at the exposed free end.</p></div>
      </div>
      {front&&back&&<p className="mt-2">Step 6 bridge mounting holes: first [{front.sourceMountingHoles.join(", ")}], second [{back.sourceMountingHoles.join(", ")}]. 15-hole receiving holes: first [{front.candidateReceivingHoles.join(", ")}], second [{back.candidateReceivingHoles.join(", ")}]. The exact grey/black shaft engagement and collar seating remain unverified.</p>}
      <label className="mt-3 flex flex-wrap items-center gap-2"><Upload className="size-4"/>
        Compare an original photo (local only)
        <input aria-label="Choose real Step 7 physical assembly photograph" type="file" accept="image/*"
          onChange={e=>{const file=e.target.files?.[0];if(file?.type.startsWith("image/"))setPhoto(URL.createObjectURL(file));}}/>
      </label>
      {photo&&<img alt="Locally provided Step 7 reference" src={photo} className="mt-2 max-h-72 w-full object-contain"/>}
      <p className="mt-3 text-amber-900"><TriangleAlert className="mr-1 inline size-4"/>
        Both blue long connectors are installed at the photographed free-end holes. Connector shoulder depth and exact STL engagement remain unmeasured; visually compare with your real assembled kit.</p>
    </details>
  </div>;
}

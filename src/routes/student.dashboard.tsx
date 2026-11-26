import { createFileRoute } from "@tanstack/react-router";
import { J5PrivateProfile } from "@/components/j5/J5PrivateProfile";
import { j5PrivateUI } from "@/lib/j5-overview";
import { useEffect,useState } from "react";
import { BookOpen,Wrench,Trophy,ClipboardCheck,Lock,LockOpen,RefreshCw } from "lucide-react";
import { getProject } from "@/data/practical";
import { loadStudentDashboard,loadLevelReadiness,LmsError,type StudentDashboard,type LevelReadiness } from "@/lib/wix-lms";
export const Route=createFileRoute("/student/dashboard")({component:j5PrivateUI?J5PrivateProfile:Dashboard});
const names=["Little Inventors","Creative Builders","Problem Solvers","Tech Explorers","Innovators","Future Makers"];
const active=(status:string)=>["Unlocked","In progress","Completed"].includes(status);
const card="rounded-3xl border border-sky-100 bg-white p-5 shadow-sm";
function label(id:string){return getProject(id)?.title ?? id;}
function Dashboard(){
  const [data,setData]=useState<StudentDashboard|null>(null);
  const [readiness,setReadiness]=useState<LevelReadiness|null>(null);
  const [selected,setSelected]=useState<number|null>(null);
  const [error,setError]=useState("");
  const [readinessError,setReadinessError]=useState(false);
  const [reload,setReload]=useState(0);
  const [loading,setLoading]=useState(true);
  useEffect(()=>{
    const ctrl=new AbortController();
    setLoading(true);setError("");setData(null);setSelected(null);setReadiness(null);
    loadStudentDashboard(ctrl.signal).then(result=>{
      if(ctrl.signal.aborted)return;
      setData(result);
      const next=result.levels.filter(l=>active(l.status)&&l.status!=="Completed").sort((a,b)=>a.level-b.level)[0];
      setSelected(next?.level??result.levels.filter(l=>active(l.status)).sort((a,b)=>b.level-a.level)[0]?.level??null);
      setLoading(false);
    }).catch(e=>{
      if(ctrl.signal.aborted)return;
      setLoading(false);
      setError(e instanceof LmsError&&e.status===401?"Please sign in to view your profile.":e instanceof LmsError&&e.status===403?"Your student account is not currently authorized.":"Your student records could not be loaded. Please retry.");
    });
    return()=>ctrl.abort();
  },[reload]);
  useEffect(()=>{
    setReadiness(null);setReadinessError(false);
    if(selected===null)return;
    const ctrl=new AbortController();
    loadLevelReadiness(selected,ctrl.signal).then(r=>{if(!ctrl.signal.aborted)setReadiness(r);})
      .catch(()=>{if(!ctrl.signal.aborted)setReadinessError(true);});
    return()=>ctrl.abort();
  },[selected]);
  return <main className="h-full overflow-y-auto overscroll-contain bg-[#f3faff] px-4 py-5 text-[#132654] sm:px-8">
    <div className="mx-auto max-w-5xl space-y-5">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <a href="/" className="flex items-center gap-2 text-sm font-bold text-sky-700"><img src="/home/be-stem-ready-logo.svg" className="h-10 w-auto" alt="BE STEM READY"/></a>
        <a href="/auth/" className="rounded-xl border border-sky-200 bg-white px-4 py-2 text-sm font-bold">Account</a><a href="/practical/levels" className="rounded-xl border border-sky-200 bg-white px-4 py-2 text-sm font-bold">Learning levels</a><a href="/student/check-in" className="rounded-xl border border-sky-200 bg-white px-4 py-2 text-sm font-bold">Check in</a>
      </header>
      {loading?<p role="status" className={card}>Loading your student records…</p>:error?<section className={card}>
        <h1 className="text-xl font-black">My profile</h1><p role="alert" className="mt-3 text-sm">{error}</p>
        <div className="mt-4 flex gap-3"><a href="/auth/" className="rounded-xl bg-sky-600 px-4 py-3 text-sm font-bold text-white">Student account</a>
          <button type="button" onClick={()=>setReload(n=>n+1)} className="rounded-xl border px-4 py-3 text-sm font-bold">Retry</button></div>
      </section>:data&&<>
        <section className={card}>
          <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-wider text-sky-600">My profile</p>
          <h1 className="mt-1 text-2xl font-black sm:text-3xl">Welcome, {data.profile.displayName}</h1>
          <p className="mt-1 text-xs text-slate-500">{data.profile.accountStatus} · Curriculum {data.curriculumVersion}</p></div>
          <button type="button" onClick={()=>setReload(n=>n+1)} className="flex items-center gap-2 rounded-xl border border-sky-200 px-3 py-2 text-sm font-bold"><RefreshCw className="size-4"/> Refresh</button></div>
        </section>
        <section aria-label="Your progress" className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {([{name:"Learning completed",value:data.totals.learningCompleted,Icon:BookOpen},{name:"Models completed",value:data.totals.buildingCompleted,Icon:Wrench},{name:"Quiz attempts",value:data.totals.quizAttempts,Icon:ClipboardCheck},{name:"Achievements",value:data.totals.achievements,Icon:Trophy}]).map(({name,value,Icon})=><div className={card} key={name}><Icon className="size-5 text-sky-600"/><p className="mt-3 text-3xl font-black">{value}</p><p className="mt-1 text-xs font-semibold text-slate-600">{name}</p></div>)}
        </section>
        <section className={card}><h2 className="text-lg font-black">Your six levels</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">{[...data.levels].sort((a,b)=>a.level-b.level).map(l=><button key={l.level} type="button" disabled={!active(l.status)} onClick={()=>setSelected(l.level)} aria-pressed={selected===l.level} className={"rounded-2xl border p-3 text-left disabled:opacity-60 "+(selected===l.level?"border-sky-500 bg-sky-50":"border-slate-200")}>
            <div className="flex items-center justify-between gap-1"><span className="text-xs font-bold text-sky-700">LEVEL {l.level}</span>{active(l.status)?<LockOpen className="size-4 text-emerald-600"/>:<Lock className="size-4 text-slate-500"/>}</div>
            <p className="mt-2 text-sm font-black">{names[l.level-1]}</p><p className="mt-1 text-xs">{l.status}</p>
            <p className="mt-2 text-xs text-slate-600">{l.learningCompleted} learned · {l.buildingCompleted} built</p>
          </button>)}</div>
        </section>
        {selected!==null&&<section className={card}><h2 className="text-lg font-black">Level {selected} requirements</h2>
          {readinessError?<p role="alert" className="mt-3 text-sm">Requirements could not be loaded.</p>:!readiness?<p role="status" className="mt-3 text-sm">Loading requirements…</p>:<>
            {!readiness.unlockEnabled&&<p className="mt-3 rounded-xl bg-amber-50 p-3 text-xs text-amber-900">Proposed completion rules. Automatic unlocking is not enabled in this preview.</p>}
            {([{name:"Learning",m:readiness.requirements.learning},{name:"Building",m:readiness.requirements.building},{name:"Quizzes passed",m:readiness.requirements.quizzes}]).map(({name,m})=><div className="mt-4" key={name}><div className="flex justify-between gap-2 text-sm font-bold"><span>{name}</span><span>{m.completed}/{m.required}</span></div><progress className="mt-2 h-2 w-full accent-sky-500" value={m.completed} max={Math.max(1,m.required)} aria-label={name}/></div>)}
            <p className="mt-4 text-sm font-bold">Final Build: {readiness.requirements.challenge.satisfied?"Passed":"Not passed"}</p>
            {!readiness.coverage.quizCoverageComplete&&<p className="mt-2 text-xs text-slate-500">Backend quiz coverage: {readiness.coverage.quizBanksAvailable}/{readiness.coverage.quizBanksRequired}.</p>}
            {!readiness.coverage.challengeCoverageVerified&&<p className="mt-2 text-xs text-slate-500">Full challenge pool verification pending.</p>}
          </>}
        </section>}
        <section className={card}><h2 className="text-lg font-black">Recent quiz results</h2>
          {!data.recentQuizzes.length?<p className="mt-3 text-sm text-slate-600">No submitted quizzes yet.</p>:<ul className="mt-3 divide-y divide-sky-100">{data.recentQuizzes.map((q,i)=><li key={q.projectId+q.submittedAt+i} className="flex items-center justify-between gap-3 py-3 text-sm"><div><p className="font-bold">{label(q.projectId)}</p><p className="text-xs text-slate-500">Level {q.level}</p></div><span className={q.passed?"font-bold text-emerald-700":"font-bold text-slate-600"}>{q.scorePercent}% · {q.passed?"Passed":"Retry"}</span></li>)}</ul>}
        </section>
        <section className={card}><h2 className="text-lg font-black">Recent Final Builds ({data.totals.buildChallenges} total)</h2>
          {!data.recentChallenges.length?<p className="mt-3 text-sm text-slate-600">No submitted challenges yet.</p>:<ul className="mt-3 divide-y divide-sky-100">{data.recentChallenges.map((q,i)=><li key={q.projectId+q.submittedAt+i} className="flex justify-between gap-3 py-3 text-sm"><div><p className="font-bold">{label(q.projectId)}</p><p className="text-xs text-slate-500">{q.criteriaMet}/5 checks · {q.elapsedSeconds}s · {q.overtimeSeconds}s overtime</p></div><span className="font-bold">{q.passed?"Passed":"Retry"}</span></li>)}</ul>}
        </section>
        <section className={card}><h2 className="text-lg font-black">Achievements</h2>{!data.achievements.length?<p className="mt-3 text-sm text-slate-600">No achievements awarded yet.</p>:<ul className="mt-3 grid gap-2 sm:grid-cols-2">{data.achievements.map((a,i)=><li key={a.achievementId+i} className="rounded-xl bg-sky-50 p-3 text-sm"><Trophy className="mb-2 size-5 text-amber-500"/>{a.achievementId} · Level {a.level}</li>)}</ul>}{data.hasMoreAchievements&&<p className="mt-2 text-xs">Showing the first 50 achievements.</p>}</section>
      </>}
    </div>
  </main>;
}

import {useEffect,useState} from "react";
import {ArrowLeft,BookOpen,CalendarDays,CreditCard,Pencil,Plus,ShieldCheck,UserRound,Wallet} from "lucide-react";
import {readTestFamily,saveTestFamily,clearTestFamily,newTestChild,updateTestChild,validTestName,validTestYear,type TestFamily} from "../lib/parent-test-flow";
const card="rounded-3xl border border-sky-100 bg-white p-5 shadow-sm sm:p-6";
const button="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#168eea] px-4 py-3 text-sm font-bold text-white disabled:opacity-40";
const outline="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-sky-200 bg-white px-4 py-3 text-sm font-bold text-sky-800";
const field="mt-2 min-h-11 w-full rounded-xl border border-sky-200 bg-white px-3";
export function DashboardWalkthrough(){
  const [family,setFamily]=useState<TestFamily|null>(null);
  const [loaded,setLoaded]=useState(false);
  const [editing,setEditing]=useState<"add"|"edit"|null>(null);
  const [name,setName]=useState("");
  const [year,setYear]=useState("2018");
  const [notice,setNotice]=useState("");
  useEffect(()=>{setFamily(readTestFamily());setLoaded(true);},[]);
  const selected=family?.children.find(c=>c.id===family.selectedId);
  function persist(next:TestFamily){saveTestFamily(next);setFamily(next);}
  function begin(mode:"add"|"edit"){setEditing(mode);setName(mode==="edit"?selected?.name??"":"Test Child "+((family?.children.length??0)+1));setYear(mode==="edit"?String(selected?.birthYear??2018):"2018");setNotice("");}
  function save(){
    if(!family||!selected||!editing)return;
    if(!validTestName(name.trim())||!validTestYear(Number(year))){setNotice("Enter a fictional name starting with Test, Sample or Demo and a valid birth year.");return;}
    try{
      if(editing==="add"){
        if(family.children.length>=6)return;
        const child=newTestChild(name.trim(),Number(year));persist({...family,children:[...family.children,child],selectedId:child.id});
      }else setFamily(updateTestChild(family,{...selected,name:name.trim(),birthYear:Number(year)}));
      setEditing(null);setNotice("Fictional child profile saved for this tab.");
    }catch{setNotice("Could not save the walkthrough in this tab.");}
  }
  if(!loaded||!family||!selected)return <main className="grid h-full place-items-center overflow-y-auto bg-[#f3faff] p-4 text-[#132654]"><section className={card+" max-w-md text-center"}><h1 className="text-xl font-black">{loaded?"Start your test registration":"Loading walkthrough…"}</h1>{loaded&&<a href="/parent/sign-in?walkthrough=1" className={button+" mt-4"}>Register a fictional parent</a>}</section></main>;
  return <main className="h-full overflow-y-auto bg-[#f3faff] text-[#132654]"><div className="mx-auto max-w-6xl space-y-5 p-4 sm:p-8">
    <header className="flex flex-wrap items-center justify-between gap-3"><img src="/home/be-stem-ready-logo.svg" alt="BE STEM READY" className="h-12 max-w-[48%] object-contain"/><button className={outline} onClick={()=>{clearTestFamily();window.location.assign("/parent/sign-in?walkthrough=1");}}><ArrowLeft className="size-4"/> End test session</button></header>
    <p role="status" className="rounded-xl bg-amber-50 p-3 text-xs font-bold text-amber-900">Connected fictional walkthrough only. Data stays in this browser tab; no real account, Wix records, payment, email or course access.</p>
    <section className={card}><p className="text-xs font-black uppercase tracking-widest text-sky-700">STEM Makers Lab · Parent portal</p><h1 className="mt-2 text-3xl font-black">My family</h1><p className="mt-3 flex items-center gap-2 text-sm text-slate-600"><ShieldCheck className="size-4"/> {family.email} · Test account</p></section>
    <div className="grid gap-5 lg:grid-cols-[1fr_2fr]"><section className={card}><h2 className="text-lg font-black">Your children</h2><div className="mt-4 space-y-2">{family.children.map(c=><button key={c.id} aria-pressed={c.id===selected.id} className={"flex w-full items-center gap-3 rounded-xl border p-3 text-left "+(c.id===selected.id?"border-sky-500 bg-sky-50":"border-sky-100")} onClick={()=>{persist({...family,selectedId:c.id});setEditing(null);setNotice("");}}><UserRound className="size-5 text-sky-600"/><span className="min-w-0 flex-1 break-words"><strong>{c.name}</strong><span className="block text-xs text-slate-600">{c.birthYear} · {c.status}</span></span></button>)}</div><button className={outline+" mt-4 w-full"} disabled={family.children.length>=6} onClick={()=>begin("add")}><Plus className="size-4"/> Add test child</button></section>
    <div className="space-y-5"><section className={card}><div className="flex flex-wrap justify-between gap-3"><div><p className="text-xs font-bold uppercase text-sky-600">Selected child</p><h2 className="text-2xl font-black">{selected.name}</h2><p className="text-sm text-slate-600">Birth year: {selected.birthYear}</p></div><button className={outline} onClick={()=>begin("edit")}><Pencil className="size-4"/> Edit profile</button></div>
    {editing&&<form className="mt-4 space-y-3 rounded-xl bg-sky-50 p-4" onSubmit={e=>{e.preventDefault();save();}}><label className="block text-sm font-bold">Fictional name<input className={field} value={name} onChange={e=>setName(e.target.value)} required maxLength={48}/></label><label className="block text-sm font-bold">Birth year<input className={field} inputMode="numeric" value={year} onChange={e=>setYear(e.target.value.replace(/[^0-9]/g,"").slice(0,4))} required/></label><button className={button} type="submit">Save test child</button> <button className={outline} type="button" onClick={()=>setEditing(null)}>Cancel</button></form>}{notice&&<p role="status" className="mt-3 text-sm text-sky-800">{notice}</p>}</section>
    <section className={card}><div className="flex items-center gap-2"><CreditCard className="size-5 text-sky-600"/><h2 className="font-black">Membership</h2></div><p className="mt-3 text-2xl font-black">RM360 / month</p><p className="mt-2 text-sm">Test status: <strong>{selected.status}</strong></p><a href="/parent/payment-preview" className={button+" mt-4"}>Test payment for {selected.name}</a></section>
    <section className={card}><div className="flex items-center gap-2"><Wallet className="size-5 text-sky-600"/><h2 className="font-black">Example payment history</h2></div>{selected.history.length?<ul className="mt-3 divide-y divide-sky-100">{selected.history.map(n=><li key={n} className="flex justify-between py-3 text-sm"><span>Example charge {n}</span><strong>RM360.00</strong></li>)}</ul>:<p className="mt-3 text-sm text-slate-600">No example successful payments for this child.</p>}</section>
    <section className={card}><h2 className="flex items-center gap-2 font-black"><CalendarDays className="size-5 text-sky-600"/> Bookings</h2><p className="mt-2 text-sm text-slate-600">Not enabled in this walkthrough.</p><h2 className="mt-4 flex items-center gap-2 font-black"><BookOpen className="size-5 text-sky-600"/> Course access</h2><p className="mt-2 text-sm text-slate-600">Requires an authorized visit and J5 check-in pass.</p></section>
    </div></div></div></main>;
}

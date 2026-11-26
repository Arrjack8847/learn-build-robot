import {createFileRoute} from "@tanstack/react-router";
import {useEffect,useState} from "react";
import {ArrowLeft,CreditCard,ShieldCheck,CheckCircle2,Clock,XCircle,Mail} from "lucide-react";
import {readTestFamily,updateTestChild,testPayment,type TestFamily,type TestEvent} from "../lib/parent-test-flow";
export const Route=createFileRoute("/parent/payment-preview")({component:PaymentPreview,head:()=>({meta:[{title:"Membership test | BE STEM READY"},{name:"robots",content:"noindex, nofollow"}]})});
const button="min-h-12 rounded-xl border border-sky-200 bg-white px-4 py-3 text-sm font-bold text-sky-800";
const primary="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#168eea] px-4 py-3 text-sm font-bold text-white";
const card="rounded-3xl border border-sky-100 bg-white p-5 sm:p-7";
function PaymentPreview(){
  const [family,setFamily]=useState<TestFamily|null>(null);
  const [loaded,setLoaded]=useState(false);
  const [message,setMessage]=useState("");
  useEffect(()=>{setFamily(readTestFamily());setLoaded(true);},[]);
  const child=family?.children.find(c=>c.id===family.selectedId);
  function apply(event:TestEvent,message:string){
    if(!family||!child)return;
    try{setFamily(updateTestChild(family,testPayment(child,event)));setMessage(message);}catch{setMessage("Could not save the example payment state.");}
  }
  if(!loaded||!family||!child)return <main className="grid h-full place-items-center overflow-y-auto bg-[#f3faff] p-4 text-[#132654]"><section className={card+" text-center"}><h1 className="font-black">{loaded?"Register a test family first":"Loading walkthrough…"}</h1>{loaded&&<a href="/parent/sign-in?walkthrough=1" className={primary+" mt-4"}>Start registration</a>}</section></main>;
  const state=child.status;
  return <main className="h-full overflow-y-auto bg-[#f3faff] text-[#132654]"><div className="mx-auto max-w-3xl space-y-5 p-4 sm:p-8">
    <header className="flex flex-wrap items-center justify-between gap-3"><a href="/parent/sign-in" className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-sky-700"><ArrowLeft className="size-4"/> Student registration</a><img src="/home/be-stem-ready-logo.svg" alt="BE STEM READY" className="h-12 max-w-[48%] object-contain"/></header>
    <p className="rounded-xl bg-amber-50 p-3 text-xs font-bold leading-5 text-amber-900">Connected fictional payment test. No actual HitPay requests, card details, email delivery or real membership authorization. Changes apply only to the selected test child in this tab.</p>
    <section className={card}><div className="flex items-center gap-3"><CreditCard className="size-7 text-sky-600"/><div><p className="text-xs font-black uppercase tracking-widest text-sky-700">STEM Makers Lab</p><h1 className="text-2xl font-black">Monthly membership</h1></div></div>
    <p className="mt-5 text-4xl font-black">RM360<span className="text-sm font-semibold text-slate-600"> / child / month</span></p><p className="mt-2 text-sm text-slate-600">{child.name} · {family.email}</p>
    <div className="mt-5 rounded-2xl bg-sky-50 p-4"><p className="flex items-center gap-2 font-bold" role="status">{state==="paid"?<CheckCircle2 className="size-5 text-emerald-700"/>:state==="pending"?<Clock className="size-5"/>:<XCircle className="size-5 text-slate-600"/>} Test status: {state}</p><p className="mt-2 text-xs leading-5 text-slate-600">A checkout return alone never confirms payment.</p></div>
    {state==="unpaid"&&<button className={primary+" mt-5 w-full"} onClick={()=>apply("open","Example checkout opened; payment is pending.")}>Test Pay Now</button>}
    <p className="mt-3 flex items-center gap-2 text-xs text-slate-600"><ShieldCheck className="size-4"/> Real family checkout remains disabled.</p></section>
    <a href="/parent/checkout-test" className={primary+" w-full"}>Open separate HitPay sandbox trial</a><section className={card}><h2 className="text-lg font-black">Test payment outcomes</h2><div className="mt-4 grid gap-2 sm:grid-cols-2">
      {state==="pending"&&<><button className={button} onClick={()=>apply("abandon","Checkout closed. This child remains unpaid.")}>Close without paying</button><button className={button} onClick={()=>apply("return","Returned from checkout. Payment still pending.")}>Test checkout return</button></>}
      {(state==="pending"||state==="failed")&&<button className={button} onClick={()=>apply("success","Example verified payment received. Confirmation generated below.")}>Simulate verified payment</button>}
      {state==="paid"&&<><button className={button} onClick={()=>apply("duplicate","Duplicate example notice ignored. No extra payment recorded.")}>Simulate duplicate notice</button>{child.cycle===1&&<button className={button} onClick={()=>apply("fail-renewal","Example renewal failed. Membership is unpaid for access purposes.")}>Simulate failed renewal</button>}</>}
      {state!=="unpaid"&&state!=="cancelled"&&<button className={button} onClick={()=>apply("cancel","Example subscription cancelled.")}>Simulate cancellation</button>}
      <button className={button} onClick={()=>apply("reset","Example payment reset for this child only.")}>Reset this child's payment</button>
    </div>{message&&<p role="status" className="mt-4 rounded-xl bg-sky-50 p-3 text-sm">{message}</p>}</section>
    <section className={card}><h2 className="font-black">Example payment history</h2>{child.history.length?<ul className="mt-3 divide-y divide-sky-100">{child.history.map(c=><li key={c} className="flex justify-between py-3 text-sm"><span>Example charge {c}</span><strong>RM360.00</strong></li>)}</ul>:<p className="mt-3 text-sm text-slate-600">No successful example payments.</p>}</section>
    {child.history.length>0&&<section className={card}><h2 className="flex items-center gap-2 font-black"><Mail className="size-5 text-sky-600"/> Example confirmation</h2><p className="mt-3 text-sm leading-6">To: {family.email}<br/>Child: {child.name}<br/>Amount: RM360.00<br/>Billing cycle: {child.history.at(-1)}<br/>This is a preview, not an email or payment receipt.</p></section>}
    <a href="/parent/sign-in" className={primary+" w-full"}>Return to student registration</a>
  </div></main>;
}

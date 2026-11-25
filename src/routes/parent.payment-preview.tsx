import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, CreditCard, ShieldCheck, CheckCircle2, Clock, XCircle } from "lucide-react";
export const Route = createFileRoute("/parent/payment-preview")({
  component: PaymentPreview,
  head: () => ({ meta: [{ title: "Membership walkthrough | BE STEM READY" }, { name: "robots", content: "noindex, nofollow" }] }),
});
type State = "unpaid" | "pending" | "paid" | "failed" | "cancelled";
const button = "min-h-12 rounded-xl border border-sky-200 bg-white px-4 py-3 text-sm font-bold text-sky-800 focus-visible:outline-2 focus-visible:outline-sky-600";
const card = "rounded-3xl border border-sky-100 bg-white p-5 sm:p-7";
function PaymentPreview(){
  const [state,setState]=useState<State>("unpaid");
  const [cycle,setCycle]=useState(1);
  const [history,setHistory]=useState<string[]>([]);
  const [message,setMessage]=useState("");
  const paid=state==="paid";
  function reset(){setState("unpaid");setCycle(1);setHistory([]);setMessage("");}
  function success(){
    if(state!=="pending"&&state!=="failed")return;
    const key="Example charge "+cycle;
    if(history.includes(key)){setMessage("Duplicate example notification ignored.");return;}
    setHistory(previous=>[...previous,key]);setState("paid");setMessage("Example verified notification received. Example confirmation email queued.");
  }
  return <div className="h-full overflow-y-auto bg-[#f3faff] text-[#132654]">
    <div className="mx-auto max-w-3xl space-y-5 px-4 py-5 sm:px-8">
      <header className="flex flex-wrap items-center justify-between gap-3"><a href="/parent/dashboard" className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-sky-700"><ArrowLeft className="size-4"/> Parent dashboard</a><img src="/home/be-stem-ready-logo.svg" alt="BE STEM READY" className="h-12 max-w-[48%] object-contain"/></header>
      <p className="rounded-xl bg-amber-50 p-3 text-xs font-bold leading-5 text-amber-900">Fictional payment walkthrough. No HitPay requests, card collection, account changes, emails or bookings occur here.</p>
      <section className={card}>
        <div className="flex items-center gap-3"><CreditCard className="size-7 text-sky-600"/><div><p className="text-xs font-black uppercase tracking-widest text-sky-700">STEM Makers Lab</p><h1 className="text-2xl font-black">Monthly membership</h1></div></div>
        <p className="mt-5 text-4xl font-black">RM360<span className="text-sm font-semibold text-slate-600"> / child / month</span></p>
        <p className="mt-2 text-sm text-slate-600">Sample Child · Two-cycle sandbox fixture</p>
        <div className="mt-5 rounded-2xl bg-sky-50 p-4"><p className="flex items-center gap-2 font-bold" role="status">{paid?<CheckCircle2 className="size-5 text-emerald-700"/>:state==="pending"?<Clock className="size-5"/>:<XCircle className="size-5 text-slate-600"/>} Example status: {state}</p><p className="mt-2 text-xs leading-5 text-slate-600">A checkout return never confirms payment. Only a verified and reconciled provider notification can update membership in the future connected system.</p></div>
        <button disabled type="button" className="mt-5 min-h-12 w-full rounded-xl bg-slate-100 font-bold text-slate-600">Real Pay Now — not connected</button>
        <p className="mt-3 flex items-center gap-2 text-xs text-slate-600"><ShieldCheck className="size-4"/> Card details will be entered on HitPay's hosted checkout only.</p>
      </section>
      <section className={card}><h2 className="text-lg font-black">Explore example outcomes</h2><p className="mt-2 text-sm text-slate-600">These controls change only this preview. They are not actual webhook events.</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {state==="unpaid"&&<button className={button} onClick={()=>{setState("pending");setMessage("Example hosted checkout opened. Membership is not paid.");}}>Preview checkout</button>}
          {state==="pending"&&<><button className={button} onClick={()=>{setState("unpaid");setMessage("Example checkout closed; membership remains unpaid.");}}>Close without paying</button><button className={button} onClick={()=>setMessage("Example return received; still awaiting verified payment.")}>Preview checkout return</button></>}
          {(state==="pending"||state==="failed")&&<button className={button} onClick={success}>Simulate verified success</button>}
          {state==="paid"&&<><button className={button} onClick={()=>setMessage("Duplicate example notification ignored.")}>Simulate duplicate notice</button>{cycle===1&&<button className={button} onClick={()=>{setCycle(2);setState("failed");setMessage("Example renewal failed; membership unpaid and failure notification queued.");}}>Simulate failed renewal</button>}</>}
          {state!=="cancelled"&&state!=="unpaid"&&<button className={button} onClick={()=>{setState("cancelled");setMessage("Example subscription cancelled. Eligibility disabled in this fixture.");}}>Simulate cancellation</button>}
          <button className={button} onClick={reset}>Reset example</button>
        </div>{message&&<p className="mt-4 rounded-xl bg-sky-50 p-3 text-sm" role="status">{message}</p>}
      </section>
      <section className={card}><h2 className="font-black">Example payment history</h2>{history.length===0?<p className="mt-3 text-sm text-slate-600">No example successful payments.</p>:<ul className="mt-3 divide-y divide-sky-100">{history.map(h=><li key={h} className="flex justify-between py-3 text-sm"><span>{h}</span><span className="font-bold">RM360.00</span></li>)}</ul>}</section>
    </div>
  </div>;
}

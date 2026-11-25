import { createFileRoute } from "@tanstack/react-router";
import { Clock } from "lucide-react";
export const Route=createFileRoute("/parent/payment-return")({
  component: ReturnPending,
  head:()=>({meta:[{title:"Payment status | BE STEM READY"},{name:"robots",content:"noindex, nofollow"}]}),
});
function ReturnPending(){
  // Ignore all query strings; even a claimed success from the redirect is not proof.
  return <div className="grid h-full overflow-y-auto place-items-center bg-[#f3faff] p-4 text-[#132654]"><section className="w-full max-w-md space-y-4 rounded-3xl border border-sky-100 bg-white p-6 text-center"><Clock className="mx-auto size-12 text-sky-600" aria-hidden="true"/><h1 className="text-2xl font-black">Payment not confirmed</h1><p className="text-sm leading-6 text-slate-600">Returning from checkout does not verify a payment. This development screen has no connected payment status service, so no membership can be activated here.</p><a href="/parent/dashboard" className="flex min-h-12 items-center justify-center rounded-xl bg-sky-600 px-4 font-bold text-white">Return to parent dashboard</a></section></div>;
}

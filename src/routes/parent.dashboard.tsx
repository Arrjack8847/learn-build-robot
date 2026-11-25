import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { ArrowLeft, BookOpen, CalendarDays, ChevronRight, CreditCard, GraduationCap, Pencil, Plus, ShieldCheck, UserRound, UsersRound, Wallet } from "lucide-react";

export const Route = createFileRoute("/parent/dashboard")({
  component: ParentDashboardPreview,
  head: () => ({ meta: [{ title: "Parent portal preview | BE STEM READY" }, { name: "robots", content: "noindex, nofollow" }] }),
});

type SampleChild = { id: string; name: string; birthYear: number };
const initialChildren: SampleChild[] = [
  { id: "sample-1", name: "Sample Child 1", birthYear: 2018 },
  { id: "sample-2", name: "Sample Child 2", birthYear: 2020 },
];
const card = "rounded-3xl border border-sky-100 bg-white p-5 shadow-sm sm:p-6";
const primary = "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#168eea] px-4 py-3 text-sm font-bold text-white hover:bg-sky-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600";
const secondary = "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-sky-200 bg-white px-4 py-3 text-sm font-bold text-sky-800 hover:bg-sky-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600";

function ParentDashboardPreview() {
  // Isolated, fictional UI fixture only. No authentication or private API access.
  // Do not accept real names, persist fixture changes, or infer eligibility from these records.
  const [children, setChildren] = useState<SampleChild[]>(() => initialChildren.map(child => ({ ...child })));
  const [selectedId, setSelectedId] = useState(initialChildren[0].id);
  const [editing, setEditing] = useState(false);
  const [year, setYear] = useState(2018);
  const [notice, setNotice] = useState("");
  const nextId = useRef(3);
  const selected = children.find(child => child.id === selectedId) ?? children[0];
  function select(child: SampleChild) {
    setSelectedId(child.id); setEditing(false); setNotice("");
  }
  function addSample() {
    if (children.length >= 6) return;
    const n = nextId.current++;
    const child = { id: "sample-" + n, name: "Sample Child " + n, birthYear: 2019 };
    setChildren(previous => [...previous, child]);
    select(child);
    setNotice("Example child added to this preview only.");
  }
  function editSample() {
    setYear(selected.birthYear); setEditing(true); setNotice("");
  }
  function saveSample() {
    if (![2018, 2019, 2020, 2021].includes(year)) return;
    setChildren(previous => previous.map(child => child.id === selected.id ? { ...child, birthYear: year } : child));
    setEditing(false); setNotice("Example profile updated. Nothing was saved to Wix.");
  }
  function reset() {
    setChildren(initialChildren.map(child => ({ ...child })));
    nextId.current = 3; setSelectedId(initialChildren[0].id); setEditing(false); setNotice("Example records reset.");
  }
  const sections = [
    { title: "Membership", Icon: CreditCard, label: "Monthly plan", amount: "RM360 / month", description: "Membership eligibility will be supplied by verified payment records in J3.", action: "Payment not connected" },
    { title: "Bookings", Icon: CalendarDays, label: "Upcoming visits", amount: "Not connected", description: "Eligible children will be able to book an available hour through Nizar's scheduling system.", action: "Booking not connected" },
    { title: "Learning progress", Icon: GraduationCap, label: "Learn Build Robot", amount: "Not connected", description: "Child-specific learning records will be available after the LMS account migration.", action: "Progress not connected" },
  ];
  return (
    <div className="h-full overflow-y-auto bg-[#f3faff] text-[#132654]">
      <div className="mx-auto max-w-6xl space-y-5 px-4 pb-10 pt-4 sm:px-8">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <img src="/home/be-stem-ready-logo.svg" alt="BE STEM READY" className="h-12 max-w-[50%] object-contain" />
          <a href="/parent/sign-in" className={secondary}><ArrowLeft className="size-4" aria-hidden="true"/> Registration preview</a>
        </header>
        <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs font-semibold leading-5 text-amber-900" role="status">Development preview · fictional family only. No sign-in, database writes, payments, bookings or course access are enabled.</p>
        <section className={card}>
          <div className="flex items-start justify-between gap-4">
            <div><p className="text-xs font-black uppercase tracking-widest text-sky-700">STEM Makers Lab · Parent portal</p><h1 className="mt-2 text-3xl font-black sm:text-4xl">My family</h1><p className="mt-2 text-sm leading-6 text-slate-600">Manage each child's profile, membership and learning journey in one place.</p></div>
            <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-sky-50 text-sky-700"><UsersRound className="size-6" aria-hidden="true"/></div>
          </div>
          <p className="mt-4 flex items-center gap-2 text-xs font-semibold text-slate-600"><ShieldCheck className="size-4" aria-hidden="true"/> Example account · parent@example.invalid</p>
        </section>
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:items-start">
          <section className={card} aria-labelledby="children-heading">
            <div className="flex flex-wrap items-center justify-between gap-2"><h2 id="children-heading" className="text-lg font-black">Your children</h2><span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-sky-800">{children.length} profiles</span></div>
            <div className="mt-4 grid gap-2">
              {children.map(child => <button type="button" key={child.id} aria-pressed={selected.id === child.id} onClick={() => select(child)} className={"flex min-h-16 items-center gap-3 rounded-2xl border p-3 text-left focus-visible:outline-2 focus-visible:outline-sky-600 " + (selected.id === child.id ? "border-sky-500 bg-sky-50" : "border-slate-100 bg-white hover:bg-sky-50")}>
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-sky-100 text-sky-700"><UserRound className="size-5" aria-hidden="true"/></span>
                <span className="min-w-0 flex-1"><span className="block break-words text-sm font-bold">{child.name}</span><span className="block text-xs text-slate-600">Birth year: {child.birthYear}</span></span>
                <ChevronRight className="size-4 shrink-0 text-sky-600" aria-hidden="true"/>
              </button>)}
            </div>
            <button type="button" onClick={addSample} disabled={children.length >= 6} className={secondary + " mt-4 w-full border-dashed disabled:opacity-50"}><Plus className="size-4" aria-hidden="true"/> Add example child</button>
            <p className="mt-2 text-xs text-slate-500">Six example profiles maximum in this walkthrough only.</p>
          </section>
          <div className="min-w-0 space-y-5">
            <section className={card} aria-labelledby="profile-heading">
              <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-wider text-sky-600">Selected child</p><h2 id="profile-heading" className="mt-1 text-2xl font-black">{selected.name}</h2><p className="mt-1 text-sm text-slate-600">Birth year: {selected.birthYear}</p></div>
                {!editing && <button type="button" onClick={editSample} className={secondary}><Pencil className="size-4" aria-hidden="true"/> Edit example</button>}
              </div>
              {editing && <form onSubmit={event => { event.preventDefault(); saveSample(); }} className="mt-4 space-y-3 rounded-2xl bg-sky-50 p-4">
                <div><label htmlFor="example-name" className="text-sm font-bold">Child's name (fixed example)</label><input id="example-name" readOnly value={selected.name} className="mt-2 min-h-11 w-full rounded-xl border border-sky-200 bg-white px-3"/></div>
                <div><label htmlFor="example-year" className="text-sm font-bold">Birth year</label><select id="example-year" value={year} onChange={e => setYear(Number(e.target.value))} className="mt-2 min-h-11 w-full rounded-xl border border-sky-200 bg-white px-3">{[2018,2019,2020,2021].map(y => <option key={y} value={y}>{y}</option>)}</select></div>
                <div className="flex flex-wrap gap-2"><button type="submit" className={primary}>Save example</button><button type="button" className={secondary} onClick={() => setEditing(false)}>Cancel</button></div>
              </form>}
              {notice && <p role="status" className="mt-3 rounded-xl bg-sky-50 p-3 text-sm text-sky-800">{notice}</p>}
            </section>
            <section aria-label="Selected child services" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {sections.map(({title,Icon,label,amount,description,action}) => <div key={title} className={card+" flex flex-col"}>
                <div className="flex items-center gap-2"><Icon className="size-5 text-sky-600" aria-hidden="true"/><h3 className="text-sm font-black">{title}</h3></div>
                <p className="mt-4 text-xs font-semibold text-slate-500">{label}</p><p className="mt-1 text-lg font-black">{amount}</p><p className="mt-2 flex-1 text-xs leading-5 text-slate-600">{description}</p>
                <button type="button" disabled className="mt-4 min-h-11 rounded-xl bg-slate-100 px-3 text-xs font-semibold text-slate-600">{action}</button>
                {title==="Membership"&&<a href="/parent/payment-preview" className={secondary+" mt-2 text-xs"}>Payment walkthrough</a>}
              </div>)}
            </section>
            <section className={card}><div className="flex items-center gap-2"><Wallet className="size-5 text-sky-600" aria-hidden="true"/><h2 className="font-black">Payment history</h2></div><p className="mt-3 text-sm leading-6 text-slate-600">No live payment data is available in this preview. Confirmed HitPay transactions and receipts will appear after integration.</p></section>
            <section className={card}><div className="flex items-center gap-2"><BookOpen className="size-5 text-sky-600" aria-hidden="true"/><h2 className="font-black">Course access</h2></div><p className="mt-3 text-sm leading-6 text-slate-600">The parent dashboard will not grant course access. A valid child-specific check-in pass during an authorized visit is required in J5.</p></section>
          </div>
        </div>
        <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-sky-100 pt-4"><p className="text-xs text-slate-500">Preview state is temporary and resets on refresh.</p><button type="button" onClick={reset} className={secondary}>Reset walkthrough</button></footer>
      </div>
    </div>
  );
}

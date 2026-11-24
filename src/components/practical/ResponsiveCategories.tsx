import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ChevronLeft, ChevronRight, ScanLine, Search, X, type LucideIcon } from "lucide-react";

export type CategoryTile = { id: string; name: string; count: number; icon: LucideIcon; href: ReactNode };
const shades = ["#e9f5ff","#e9f8ed","#fff2e3","#fff0f8","#eef0ff","#e8f9f5","#fff8df","#f0eafa"];
const inks = ["#178bd1","#269455","#c58a25","#c83c86","#536cc3","#188d8b","#aa8021","#8d5dc4"];

export function ResponsiveCategories({ level, categories, extras }: { level: number; categories: CategoryTile[]; extras?: ReactNode }) {
  const [page,setPage] = useState(0);
  const [searchOpen,setSearchOpen] = useState(false);
  const [query,setQuery] = useState("");
  const [pageSize,setPageSize] = useState(6);
  const swipe = useRef<{ x: number; y: number } | null>(null);
  useEffect(() => {
    const update = () => {
      setPageSize(window.matchMedia('(min-width: 1500px)').matches ? 14 : window.matchMedia('(min-width: 1024px) and (orientation: landscape)').matches ? 8 : window.matchMedia('(min-width: 768px)').matches ? 9 : 6);
    };
    update();
    window.addEventListener("resize",update);
    return () => window.removeEventListener("resize",update);
  },[]);
  const filtered = categories.filter(c=>c.name.toLowerCase().includes(query.trim().toLowerCase()));
  const pages = Math.max(1,Math.ceil(filtered.length/pageSize));
  const current = Math.min(page,pages-1);
  const visible = filtered.slice(current*pageSize,(current+1)*pageSize);
  const changePage = (delta: number) => setPage(p => Math.max(0, Math.min(pages - 1, Math.min(p, pages - 1) + delta)));
  return <main className="relative isolate flex min-h-[100dvh] flex-col bg-[#f1faff] [text-size-adjust:100%] [-webkit-text-size-adjust:100%] text-[#254765]">
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,#e2f3ff,#f9fcff_55%,#eaf7ef)]"/>
    <header className="mx-auto flex h-[clamp(52px,8dvh,72px)] w-full max-w-[1180px] shrink-0 items-center justify-between px-4 sm:px-8">
      <Link to="/practical/levels" aria-label="Back to levels" className="grid size-11 place-items-center rounded-full border border-sky-100 bg-white shadow-sm focus-visible:outline-2 focus-visible:outline-sky-600"><ArrowLeft className="size-5 text-sky-700"/></Link>
      <img alt="BE STEM READY" src="/home/be-stem-ready-logo.svg" className="h-[clamp(34px,6dvh,48px)] max-w-[55%] object-contain"/>
      <button type="button" aria-label="Search categories" aria-expanded={searchOpen} onClick={()=>setSearchOpen(v=>!v)} className="grid size-11 place-items-center rounded-full border border-sky-100 bg-white shadow-sm focus-visible:outline-2 focus-visible:outline-sky-600"><Search className="size-5 text-sky-700"/></button>
    </header>
    <section className="mx-auto flex w-full max-w-[1180px] flex-1 flex-col px-4 pb-[max(12px,env(safe-area-inset-bottom))] sm:px-8">
      <div className="shrink-0 py-1 text-center">
        <p className="text-[11px] font-extrabold uppercase tracking-[.14em] text-sky-700">Level {level}</p>
        <h1 className="mt-1 text-[clamp(23px,3.6dvh,34px)] font-black leading-tight tracking-tight">Explore Categories</h1>
        <p className="mt-1 text-xs font-medium leading-tight text-[#607b91]">Choose what you want to build</p>
      </div>
      {searchOpen && <div className="absolute inset-x-4 top-[clamp(52px,8dvh,72px)] z-20 mx-auto flex max-w-md items-center gap-2 rounded-2xl border border-sky-200 bg-white p-2 shadow-xl"><Search className="ml-2 size-5 text-sky-500"/><input autoFocus type="search" aria-label="Search category names" placeholder="Search categories" value={query} onChange={e=>{setQuery(e.target.value);setPage(0)}} className="min-w-0 flex-1 bg-transparent p-2 text-base outline-none"/><button type="button" aria-label="Close search" onClick={()=>{setSearchOpen(false);setQuery("");setPage(0)}} className="grid size-11 place-items-center"><X className="size-5"/></button></div>}
      <div className="flex flex-1 flex-col py-[clamp(8px,1.5dvh,16px)]" onTouchStart={e=>{const t=e.touches[0];swipe.current=t?{x:t.clientX,y:t.clientY}:null}} onTouchCancel={()=>{swipe.current=null}} onTouchEnd={e=>{const start=swipe.current;swipe.current=null;const t=e.changedTouches[0];if(!start||!t)return;const dx=t.clientX-start.x,dy=t.clientY-start.y;if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.5)changePage(dx<0?1:-1)}}>
        <ul aria-label={`Level ${level} categories`} className="grid flex-1 grid-cols-2 grid-rows-[repeat(3,minmax(min-content,1fr))] gap-[clamp(8px,1.5dvh,14px)] md:grid-cols-3 lg:landscape:grid-cols-4 lg:landscape:grid-rows-[repeat(2,minmax(min-content,1fr))] min-[1500px]:grid-cols-7 min-[1500px]:grid-rows-[repeat(2,minmax(min-content,1fr))]">
          {visible.map(c=><li key={c.id} className="min-w-0 rounded-2xl border border-white bg-white/85 shadow-[0_4px_15px_rgba(31,95,138,.08)]">{c.href}</li>)}
        </ul>
        {!visible.length && <p className="py-8 text-center text-sm">No matching categories.</p>}
      </div>
      <nav aria-label="Category pagination" className="mb-3 flex shrink-0 items-center justify-center gap-4">
        <button type="button" aria-label="Previous categories" disabled={current===0} onClick={()=>changePage(-1)} className="grid size-11 place-items-center rounded-full bg-white/90 text-sky-700 shadow-sm disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-sky-600"><ChevronLeft className="size-5"/></button>
        <span aria-live="polite" className="min-w-[80px] text-center text-xs font-bold tabular-nums text-[#587a99]">Page {current+1} of {pages}</span>
        <button type="button" aria-label="Next categories" disabled={current>=pages-1} onClick={()=>changePage(1)} className="grid size-11 place-items-center rounded-full bg-white/90 text-sky-700 shadow-sm disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-sky-600"><ChevronRight className="size-5"/></button>
      </nav>
      <a href={"/practical/level-" + level + "/final-build"} aria-label={`Level ${level} Final Build Exam · Robot Discovery Scanner`} className="flex min-h-[64px] shrink-0 items-center gap-3 rounded-2xl bg-[#1767a8] px-4 py-3 text-white shadow-[0_5px_14px_rgba(23,103,168,.18)] transition-colors hover:bg-[#125b97] focus-visible:outline-4 focus-visible:outline-sky-500">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/15"><ScanLine aria-hidden="true" className="size-6"/></span>
        <span className="min-w-0 flex-1"><span className="block text-sm font-extrabold leading-tight">Final Build Challenge</span><span className="mt-1 block text-[11px] font-medium leading-tight text-[#dceeff]">Discover · Build · Complete</span></span>
        <ChevronRight aria-hidden="true" className="size-5 shrink-0"/>
      </a>
      {extras && <div className="sr-only">{extras}</div>}
    </section>
  </main>;
}
export function CategoryCard({ name, count, icon: Icon, index }: { name:string; count:number; icon:LucideIcon; index:number }) {
  return <div className="flex h-full min-h-[104px] flex-col items-center justify-center gap-1.5 rounded-2xl px-2 py-3 text-center sm:px-3" style={{backgroundColor:shades[index%8]}}>
    <Icon aria-hidden="true" className="size-[clamp(24px,4dvh,36px)] shrink-0" strokeWidth={1.9} style={{color:inks[index%8]}}/>
    <span className="w-full shrink-0 break-words text-[clamp(12px,1.8dvh,16px)] font-extrabold leading-[1.2] text-[#2c4d68]">{name}</span>
    <span className="shrink-0 text-[clamp(10px,1.4dvh,12px)] font-medium leading-tight text-[#607b91]">{count} {count === 1 ? "project" : "projects"}</span>
  </div>;
}

import { useEffect, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ChevronLeft, ChevronRight, Search, X, type LucideIcon } from "lucide-react";

export type CategoryTile = { id: string; name: string; count: number; icon: LucideIcon; href: ReactNode };
const shades = ["#e9f5ff","#e9f8ed","#fff2e3","#fff0f8","#eef0ff","#e8f9f5","#fff8df","#f0eafa"];
const inks = ["#178bd1","#269455","#c58a25","#c83c86","#536cc3","#188d8b","#aa8021","#8d5dc4"];

export function ResponsiveCategories({ level, categories, extras }: { level: number; categories: CategoryTile[]; extras?: ReactNode }) {
  const [page,setPage] = useState(0);
  const [searchOpen,setSearchOpen] = useState(false);
  const [query,setQuery] = useState("");
  const [pageSize,setPageSize] = useState(8);
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth, h = window.innerHeight;
      setPageSize(w >= 1500 ? 14 : w >= 740 && h > w ? 9 : 8);
    };
    update(); window.addEventListener("resize",update);
    return () => window.removeEventListener("resize",update);
  },[]);
  const filtered = categories.filter(c=>c.name.toLowerCase().includes(query.trim().toLowerCase()));
  const pages = Math.max(1,Math.ceil(filtered.length/pageSize));
  const current = Math.min(page,pages-1);
  const visible = filtered.slice(current*pageSize,(current+1)*pageSize);
  let startX: number | null = null;
  return <main className="relative isolate flex min-h-[100dvh] flex-col overflow-x-hidden bg-[#f1faff] [text-size-adjust:100%] [-webkit-text-size-adjust:100%] text-[#254765]">
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,#e2f3ff,#f9fcff_55%,#eaf7ef)]"/>
    <header className="mx-auto flex h-[clamp(56px,10dvh,86px)] w-full max-w-[1180px] shrink-0 items-center justify-between px-4 sm:px-8">
      <Link to="/practical/levels" aria-label="Back to levels" className="grid size-10 place-items-center rounded-full border border-sky-100 bg-white shadow-sm"><ArrowLeft className="size-5 text-sky-700"/></Link>
      <img alt="BE STEM READY" src="/home/be-stem-ready-logo.svg" className="h-[clamp(36px,7dvh,62px)] max-w-[55%] object-contain"/>
      <button type="button" aria-label="Search categories" onClick={()=>setSearchOpen(v=>!v)} className="grid size-10 place-items-center rounded-full border border-sky-100 bg-white shadow-sm"><Search className="size-5 text-sky-700"/></button>
    </header>
    <section className="mx-auto flex min-h-fit w-full max-w-[1180px] flex-1 flex-col px-4 pb-[max(8px,env(safe-area-inset-bottom))] sm:px-8">
      <div className="shrink-0 text-center">
        <p className="mx-auto w-fit rounded-full border border-sky-200 bg-white/70 px-4 py-1 text-xs font-bold text-sky-700">Level {level}</p>
        <h1 className="mt-1 text-[clamp(23px,4dvh,40px)] font-black tracking-tight">Explore Categories</h1>
      </div>
      {searchOpen && <div className="absolute inset-x-4 top-[clamp(58px,10dvh,90px)] z-20 mx-auto flex max-w-md items-center gap-2 rounded-2xl border border-sky-200 bg-white p-2 shadow-xl"><Search className="ml-2 size-5 text-sky-500"/><input autoFocus type="search" aria-label="Search category names" placeholder="Search categories" value={query} onChange={e=>{setQuery(e.target.value);setPage(0)}} className="min-w-0 flex-1 bg-transparent p-2 text-sm outline-none"/><button type="button" aria-label="Close search" onClick={()=>{setSearchOpen(false);setQuery("");setPage(0)}}><X className="size-5"/></button></div>}
      <div className="my-auto flex min-h-0 flex-1 flex-col py-[clamp(8px,1.5dvh,20px)]" onTouchStart={e=>{startX=e.touches[0]?.clientX??null}} onTouchEnd={e=>{if(startX===null)return;const dx=(e.changedTouches[0]?.clientX??startX)-startX;if(Math.abs(dx)>55)setPage(p=>Math.max(0,Math.min(pages-1,p+(dx<0?1:-1))));startX=null}}>
        <ul aria-label={`Level ${level} categories`} className="grid min-h-[408px] flex-1 grid-cols-2 grid-rows-4 gap-[clamp(7px,1.4dvh,12px)] md:min-h-[300px] md:grid-cols-3 md:grid-rows-3 md:portrait:grid-cols-3 lg:landscape:min-h-[200px] lg:landscape:grid-cols-4 lg:landscape:grid-rows-2 min-[1500px]:grid-cols-7 min-[1500px]:grid-rows-2 min-[1500px]:min-h-[200px]">
          {visible.map((c,i)=>{const Icon=c.icon;const idx=(current*pageSize+i)%8;return <li key={c.id} className="min-h-0 min-w-0">
            <div className="h-full min-h-0 rounded-[clamp(14px,2vw,24px)] border border-white bg-white/85 shadow-[0_4px_15px_rgba(31,95,138,.08)]">
              {c.href && <div className="h-full">{/* The route-specific Link is passed in by the caller to preserve typed routing. */}
                {c.href}
              </div>}
            </div>
          </li>})}
        </ul>
        {!visible.length && <p className="py-8 text-center text-sm">No matching categories.</p>}
      </div>
      <a href={"/practical/level-" + level + "/final-build"} aria-label={`Level ${level} Final Build Exam · Robot Discovery Scanner`} className="mb-2 flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-2xl border-2 border-[#75d3ff] bg-white px-3 py-2 text-center text-[#1767a8] shadow-sm hover:bg-sky-50 focus-visible:outline-4 focus-visible:outline-sky-500"><span aria-hidden="true" className="shrink-0 text-lg">🔬</span><span className="min-w-0"><span className="block text-sm font-black leading-tight">Level {level} Final Build Exam</span><span className="block text-[11px] font-semibold leading-tight">Robot Discovery Scanner</span></span></a>
      <div className="flex shrink-0 items-center justify-center gap-4 pb-1">
        <button type="button" aria-label="Previous categories" disabled={current===0} onClick={()=>setPage(p=>Math.max(0,p-1))} className="grid size-10 place-items-center rounded-full bg-white/90 text-sky-700 shadow-sm disabled:opacity-30"><ChevronLeft/></button>
        <span className="text-xs font-bold text-[#587a99]">Page {current+1} of {pages}</span>
        <button type="button" aria-label="Next categories" disabled={current>=pages-1} onClick={()=>setPage(p=>Math.min(pages-1,p+1))} className="grid size-10 place-items-center rounded-full bg-white/90 text-sky-700 shadow-sm disabled:opacity-30"><ChevronRight/></button>
      </div>
      {extras && <div className="sr-only">{extras}</div>}
    </section>
  </main>;
}
export function CategoryCard({ name, count, icon: Icon, index }: { name:string; count:number; icon:LucideIcon; index:number }) {
  return <div className="flex h-full min-h-0 flex-col items-center justify-center gap-[clamp(2px,.4dvh,5px)] rounded-[clamp(14px,2vw,24px)] px-2 py-1 text-center" style={{backgroundColor:shades[index%8]}}>
    <Icon aria-hidden="true" className="size-[clamp(20px,3.4dvh,34px)] shrink-0" strokeWidth={1.9} style={{color:inks[index%8]}}/>
    <span className="w-full shrink-0 break-words text-[clamp(11px,1.55dvh,15px)] font-extrabold leading-[1.15] text-[#2c4d68]">{name}</span>
    <span className="shrink-0 text-[clamp(10px,1.35dvh,12px)] font-medium leading-tight text-[#607b91]">{count} {count === 1 ? "project" : "projects"}</span>
  </div>;
}

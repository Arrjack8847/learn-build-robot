import { useCallback, useEffect, useRef, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  Bot,
  CircuitBoard,
  Cog,
  Lightbulb,
  Puzzle,
  Rocket,
  Sparkles,
  Target,
  Trophy,
  UserRound,
  UsersRound,
  Volume2,
  VolumeX,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { APP_NAME, IS_DEMO_CONTENT } from "@/config/app";
import { competitionInfo } from "@/data/competition";

const MOBILE_INTRO_STORAGE_KEY = "be-stem-ready-mobile-intro-seen";
const MOBILE_INTRO_FADE_MS = 350;
const MOBILE_INTRO_FALLBACK_MS = 6500;

const COMPETITION_PHOTO =
  "https://static.wixstatic.com/media/7fc4ca_7d9e79a593fb4ebda901b1bfea7b919f~mv2.jpg/v1/fill/w_980%2Ch_653%2Cal_c%2Cq_85%2Cusm_0.66_1.00_0.01%2Cenc_avif%2Cquality_auto/VEX-IQ.jpg";

export const Route = createFileRoute("/")({
  component: CompetitionWelcomePage,
});

function MobileLogoIntro() {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const hasStartedExitRef = useRef(false);
  const exitTimerRef = useRef<number | null>(null);

  const finishIntro = useCallback(() => {
    if (hasStartedExitRef.current) return;
    hasStartedExitRef.current = true;

    try {
      window.sessionStorage.setItem(MOBILE_INTRO_STORAGE_KEY, "true");
    } catch {
      // Storage can be unavailable in private/restricted browsing modes.
    }

    setIsFading(true);
    exitTimerRef.current = window.setTimeout(() => {
      setIsVisible(false);
    }, MOBILE_INTRO_FADE_MS);
  }, []);

  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let hasSeenIntro = false;
    try {
      hasSeenIntro =
        window.sessionStorage.getItem(MOBILE_INTRO_STORAGE_KEY) === "true";
    } catch {
      // If storage is unavailable, simply play the intro normally.
    }

    if (!isMobile || prefersReducedMotion || hasSeenIntro) {
      setIsVisible(false);
      return;
    }

    const fallbackTimer = window.setTimeout(
      finishIntro,
      MOBILE_INTRO_FALLBACK_MS,
    );

    return () => {
      window.clearTimeout(fallbackTimer);
      if (exitTimerRef.current !== null) {
        window.clearTimeout(exitTimerRef.current);
      }
    };
  }, [finishIntro]);

  useEffect(() => {
    if (!isVisible) return;

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    if (!isMobile) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[100] grid place-items-center bg-white transition-opacity duration-300 md:hidden ${
        isFading ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <video
        autoPlay
        className="h-full w-full object-contain"
        muted
        onEnded={finishIntro}
        onError={finishIntro}
        playsInline
        preload="auto"
      >
        <source
          src="/intro/Animated_logo_intro_sequence_1080p_202608281622.mp4"
          type="video/mp4"
        />
      </video>
    </div>
  );
}

function CompetitionWelcomePage() {
  return (
    <>
      <MobileLogoIntro />
      <MobileCompetitionHome />
      <DesktopCompetitionHome />
    </>
  );
}

function MobileCompetitionHome() {
  const [soundOn, setSoundOn] = useState(true);

  const stats = [
    { label: "Challenges", icon: Target, color: "#1598ea" },
    { label: "Competition", icon: UsersRound, color: "#ec168c" },
    { label: "Skills", icon: Lightbulb, color: "#f5a400" },
    { label: "Achievements", icon: Trophy, color: "#39b54a" },
  ] as const;

  const journey = [
    {
      title: "LEARN",
      detail: "Understand the challenge",
      icon: Bot,
      color: "#1598ea",
    },
    {
      title: "BUILD ROBOT",
      detail: "Build step by step",
      icon: Cog,
      color: "#f5a400",
    },
    {
      title: "QUIZ & READY",
      detail: "Test skills & get ready",
      icon: Puzzle,
      color: "#39b54a",
    },
  ] as const;

  return (
    <main className="relative flex h-[100svh] flex-col overflow-hidden bg-white px-3 pb-[max(10px,env(safe-area-inset-bottom))] pt-1 text-[#14254a] md:hidden [@media(min-height:850px)]:px-4 [@media(min-height:850px)]:pt-2">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <Cog className="absolute -left-5 top-[23%] size-16 text-[#1598ea]/9 [@media(min-height:850px)]:size-20" strokeWidth={1.5} />
        <Cog className="absolute left-16 top-[31%] size-9 text-[#1598ea]/9 [@media(min-height:850px)]:size-10" strokeWidth={1.5} />
        <Rocket className="absolute -right-4 top-[28%] size-16 -rotate-12 text-[#ec168c]/10 [@media(min-height:850px)]:size-20" strokeWidth={1.6} />
        <Cog className="absolute right-4 top-[40%] size-8 text-[#f5a400]/10 [@media(min-height:850px)]:size-9" strokeWidth={1.6} />
      </div>

      <header className="relative z-10 flex h-12 shrink-0 items-center justify-between [@media(max-height:700px)]:h-11 [@media(min-height:850px)]:h-14">
        <button
          aria-label={soundOn ? "Mute sounds" : "Turn on sounds"}
          aria-pressed={soundOn}
          className="grid size-10 place-items-center rounded-full border border-slate-200 bg-white text-[#1598ea] shadow-[0_5px_14px_rgba(18,50,93,0.09)] transition active:scale-95 [@media(max-height:700px)]:size-9 [@media(min-height:850px)]:size-11"
          onClick={() => setSoundOn((value) => !value)}
          type="button"
        >
          {soundOn ? <Volume2 className="size-[18px]" /> : <VolumeX className="size-[18px]" />}
        </button>

        <img
          alt="BE STEM READY"
          className="absolute left-1/2 top-1/2 h-10 w-auto -translate-x-1/2 -translate-y-1/2 object-contain [@media(max-height:700px)]:h-9 [@media(min-height:850px)]:h-11"
          src="/home/be-stem-ready-logo.svg"
        />

        <Link
          aria-label="Open profile and progress"
          className="grid size-10 place-items-center rounded-full border border-slate-200 bg-white text-[#1598ea] shadow-[0_5px_14px_rgba(18,50,93,0.09)] transition active:scale-95 [@media(max-height:700px)]:size-9 [@media(min-height:850px)]:size-11"
          to="/progress"
        >
          <UserRound className="size-[18px]" strokeWidth={2.2} />
        </Link>
      </header>

      <section className="relative z-10 shrink-0 text-center">
        <div className="mx-auto inline-flex items-center gap-1.5 rounded-full border border-[#1598ea]/35 bg-white/95 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.07em] text-[#1598ea] shadow-sm [@media(max-width:340px)]:px-2 [@media(max-width:340px)]:text-[8px] [@media(min-height:850px)]:mt-1 [@media(min-height:850px)]:px-3 [@media(min-height:850px)]:py-1.5 [@media(min-height:850px)]:text-[10px]">
          <Trophy className="size-3 [@media(min-height:850px)]:size-3.5" />
          CIPTRIX Robotics Practice
        </div>

        <h1 className="mt-2 text-[clamp(2rem,9.2vw,2.8rem)] font-black leading-[0.9] tracking-[-0.048em] [@media(max-height:700px)]:mt-1.5 [@media(max-height:700px)]:text-[clamp(1.85rem,8.6vw,2.35rem)] [@media(min-height:850px)]:mt-3 [@media(min-height:850px)]:text-[clamp(2.25rem,9.6vw,3rem)]">
          <span className="block text-[#1598ea]">Train Today.</span>
          <span className="mt-1 block text-[#ec168c] [@media(max-height:700px)]:mt-0.5">Compete Tomorrow.</span>
        </h1>

        <p className="mx-auto mt-2 max-w-[335px] text-[12.5px] font-medium leading-[17px] text-[#23365d] [@media(max-height:700px)]:mt-1.5 [@media(max-height:700px)]:max-w-[310px] [@media(max-height:700px)]:text-[11.5px] [@media(max-height:700px)]:leading-[15px] [@media(min-height:850px)]:mt-3 [@media(min-height:850px)]:max-w-[350px] [@media(min-height:850px)]:text-[14px] [@media(min-height:850px)]:leading-5">
          Learn the challenge, build your robot step by step, and get ready for real competition day.
        </p>
      </section>

      <section className="relative z-10 mt-2 h-[31svh] min-h-[170px] max-h-[270px] shrink-0 overflow-hidden rounded-[22px] border border-slate-100 bg-[#edf3f8] shadow-[0_10px_28px_rgba(24,72,120,0.11)] [@media(max-height:700px)]:mt-1.5 [@media(max-height:700px)]:h-[27svh] [@media(max-height:700px)]:min-h-[145px] [@media(max-height:700px)]:max-h-[190px] [@media(max-height:700px)]:rounded-[18px] [@media(min-height:850px)]:mt-3 [@media(min-height:850px)]:h-[31svh] [@media(min-height:850px)]:max-h-[285px] [@media(min-height:850px)]:rounded-[26px]">
        <img
          alt="Students preparing a robot in a robotics competition arena"
          className="h-full w-full object-cover"
          decoding="async"
          fetchPriority="high"
          src={COMPETITION_PHOTO}
          style={{ objectPosition: "center 58%" }}
        />

        <div className="absolute inset-x-2 bottom-2 grid h-9 grid-cols-4 divide-x divide-slate-200 rounded-[13px] bg-white/95 px-0.5 shadow-[0_6px_18px_rgba(17,53,92,0.13)] backdrop-blur-sm [@media(max-height:700px)]:bottom-1.5 [@media(max-height:700px)]:h-8 [@media(min-height:850px)]:inset-x-3 [@media(min-height:850px)]:bottom-3 [@media(min-height:850px)]:h-10 [@media(min-height:850px)]:rounded-[15px]">
          {stats.map(({ label, icon: Icon, color }) => (
            <div className="flex min-w-0 flex-col items-center justify-center gap-px" key={label}>
              <Icon className="size-3 [@media(max-height:700px)]:size-[11px] [@media(min-height:850px)]:size-3.5" style={{ color }} strokeWidth={2.2} />
              <span className="truncate text-[6px] font-extrabold uppercase tracking-[0.02em] text-[#14254a] [@media(max-width:340px)]:text-[5.5px] [@media(min-height:850px)]:text-[6.5px]">
                {label}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="relative z-10 shrink-0 pt-2 [@media(max-height:700px)]:pt-1.5 [@media(min-height:850px)]:pt-3">
        <div className="mb-1 px-1 [@media(max-height:700px)]:mb-0.5 [@media(min-height:850px)]:mb-1.5">
          <h2 className="text-[13px] font-black tracking-tight text-[#14254a] [@media(max-height:700px)]:text-[12px] [@media(min-height:850px)]:text-[14px]">Your Journey</h2>
        </div>

        <div className="relative grid grid-cols-3 gap-1.5">
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute left-[13%] right-[13%] top-[27px] h-7 w-[74%] [@media(max-height:700px)]:top-[24px] [@media(min-height:850px)]:top-[31px] [@media(min-height:850px)]:h-8"
            preserveAspectRatio="none"
            viewBox="0 0 300 32"
          >
            <path
              d="M0 16 C40 0 67 31 108 16 S177 1 218 16 S264 30 300 16"
              fill="none"
              stroke="#8b98ab"
              strokeDasharray="4 6"
              strokeLinecap="round"
              strokeWidth="4.5"
            />
          </svg>

          {journey.map(({ title, detail, icon: Icon, color }, index) => (
            <div className="relative flex min-w-0 flex-col items-center text-center" key={title}>
              <div
                className="relative z-10 grid size-14 place-items-center rounded-full border-[4px] border-white text-white shadow-[0_6px_16px_rgba(28,60,100,0.12)] [@media(max-height:700px)]:size-12 [@media(min-height:850px)]:size-[62px]"
                style={{ backgroundColor: color }}
              >
                <span className="absolute -top-2 grid size-5 place-items-center rounded-full border-2 border-white bg-inherit text-[9px] font-black [@media(max-height:700px)]:size-[18px] [@media(max-height:700px)]:text-[8px]">
                  {index + 1}
                </span>
                <Icon className="size-6 [@media(max-height:700px)]:size-5 [@media(min-height:850px)]:size-7" strokeWidth={2.4} />
              </div>
              <p className="mt-1.5 whitespace-nowrap text-[9.5px] font-black leading-none [@media(max-width:340px)]:text-[8.5px] [@media(max-height:700px)]:mt-1 [@media(max-height:700px)]:text-[8.5px] [@media(min-height:850px)]:mt-2 [@media(min-height:850px)]:text-[10px]" style={{ color }}>
                {title}
              </p>
              <p className="mt-1 hidden max-w-[105px] text-[9px] font-medium leading-[11px] text-[#425273] [@media(min-height:850px)]:block">
                {detail}
              </p>
            </div>
          ))}
          <Rocket className="absolute -right-2 top-1 size-5 -rotate-12 text-[#ec168c] [@media(max-height:700px)]:-right-1 [@media(max-height:700px)]:top-0.5 [@media(max-height:700px)]:size-[18px] [@media(min-height:850px)]:-right-2 [@media(min-height:850px)]:top-2 [@media(min-height:850px)]:size-6" strokeWidth={2.3} />
        </div>
      </section>

      <Button
        asChild
        className="relative z-10 mt-2 h-12 shrink-0 rounded-full bg-[#1598ea] text-[16px] font-black shadow-[0_9px_22px_rgba(21,152,234,0.23)] hover:bg-[#0f8bdd] [@media(max-height:700px)]:mt-1.5 [@media(max-height:700px)]:h-11 [@media(max-height:700px)]:text-[15px] [@media(min-height:850px)]:mt-3 [@media(min-height:850px)]:h-[54px] [@media(min-height:850px)]:text-[17px]"
      >
        <Link to="/join">
          Start Journey
          <ArrowRight className="ml-2 size-5" />
        </Link>
      </Button>
    </main>
  );
}

function DesktopCompetitionHome() {
  return (
    <div className="relative hidden h-full flex-col overflow-hidden bg-navy text-navy-foreground md:flex">
      <div aria-hidden="true" className="circuit-grid-dark absolute inset-0 opacity-50" />

      <header className="relative flex min-h-16 items-center justify-between border-b border-white/10 px-4 sm:px-8">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
            <CircuitBoard aria-hidden="true" className="size-5" />
          </span>
          <div>
            <p className="font-bold tracking-tight">{APP_NAME}</p>
            <p className="hidden text-xs text-navy-muted sm:block">Learn · Build · Compete</p>
          </div>
        </div>
        {IS_DEMO_CONTENT ? (
          <span className="rounded-full bg-navy-hover px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-navy-muted">
            Demo content
          </span>
        ) : null}
      </header>

      <main className="relative grid min-h-0 flex-1 place-items-center px-5 py-5 sm:px-8">
        <div className="grid w-full max-w-6xl items-center gap-7 lg:grid-cols-[1fr_0.9fr] lg:gap-12">
          <section className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full bg-navy-hover px-3 py-1.5 text-xs font-semibold text-navy-muted">
              <Sparkles aria-hidden="true" className="size-3.5 text-primary" />
              {competitionInfo.eyebrow}
            </div>
            <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              {competitionInfo.name}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-navy-muted sm:text-base lg:mx-0 lg:leading-7">
              {competitionInfo.description}
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-2 lg:justify-start">
              {competitionInfo.journey.map((item, index) => (
                <span
                  className="inline-flex items-center gap-2 rounded-full bg-navy-hover px-3 py-1.5 text-xs font-semibold"
                  key={item}
                >
                  <span className="grid size-5 place-items-center rounded-full bg-primary text-[10px] text-primary-foreground">
                    {index + 1}
                  </span>
                  {item}
                </span>
              ))}
            </div>

            <Button asChild className="mt-7 min-h-12 rounded-2xl px-7 text-base">
              <Link to="/join">
                Start Journey
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </section>

          <div className="hidden min-h-80 place-items-center rounded-[2.5rem] bg-navy-hover/80 p-8 lg:grid">
            <div className="relative grid size-60 place-items-center rounded-full bg-primary-soft text-primary">
              <div aria-hidden="true" className="absolute inset-5 rounded-full border border-primary/25" />
              <div aria-hidden="true" className="absolute inset-10 rounded-full border border-primary/20" />
              <Bot aria-hidden="true" className="size-28" strokeWidth={1.3} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
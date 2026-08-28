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
    <main className="relative flex h-[100dvh] flex-col overflow-hidden bg-white px-4 pb-3 pt-2 text-[#14254a] md:hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <Cog className="absolute -left-5 top-[22%] size-20 text-[#1598ea]/10" strokeWidth={1.5} />
        <Cog className="absolute left-16 top-[31%] size-10 text-[#1598ea]/10" strokeWidth={1.5} />
        <Rocket className="absolute -right-4 top-[27%] size-20 -rotate-12 text-[#ec168c]/12" strokeWidth={1.6} />
        <Cog className="absolute right-4 top-[40%] size-9 text-[#f5a400]/12" strokeWidth={1.6} />
      </div>

      <header className="relative z-10 flex h-14 shrink-0 items-center justify-between">
        <button
          aria-label={soundOn ? "Mute sounds" : "Turn on sounds"}
          aria-pressed={soundOn}
          className="grid size-11 place-items-center rounded-full border border-slate-200 bg-white text-[#1598ea] shadow-[0_6px_18px_rgba(18,50,93,0.10)] transition active:scale-95"
          onClick={() => setSoundOn((value) => !value)}
          type="button"
        >
          {soundOn ? <Volume2 className="size-5" /> : <VolumeX className="size-5" />}
        </button>

        <img
          alt="BE STEM READY"
          className="absolute left-1/2 top-1/2 h-12 w-auto -translate-x-1/2 -translate-y-1/2 object-contain"
          src="/home/be-stem-ready-logo.svg"
        />

        <Link
          aria-label="Open profile and progress"
          className="grid size-11 place-items-center rounded-full border border-slate-200 bg-white text-[#1598ea] shadow-[0_6px_18px_rgba(18,50,93,0.10)] transition active:scale-95"
          to="/progress"
        >
          <UserRound className="size-5" strokeWidth={2.2} />
        </Link>
      </header>

      <section className="relative z-10 shrink-0 text-center">
        <div className="mx-auto mt-1 inline-flex items-center gap-2 rounded-full border border-[#1598ea]/35 bg-white/95 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.08em] text-[#1598ea] shadow-sm">
          <Trophy className="size-3.5" />
          CIPTRIX Robotics Practice
        </div>

        <h1 className="mt-3 text-[clamp(2.3rem,10vw,3.15rem)] font-black leading-[0.96] tracking-[-0.045em]">
          <span className="block text-[#1598ea]">Train Today.</span>
          <span className="mt-1 block text-[#ec168c]">Compete Tomorrow.</span>
        </h1>

        <p className="mx-auto mt-3 max-w-[345px] text-[14px] font-medium leading-5 text-[#23365d] [@media(max-height:720px)]:mt-2 [@media(max-height:720px)]:text-[13px] [@media(max-height:720px)]:leading-[18px]">
          Learn the challenge, build your robot step by step, and get ready for real competition day.
        </p>
      </section>

      <section className="relative z-10 mt-3 min-h-[145px] flex-1 overflow-hidden rounded-[26px] border border-slate-100 bg-[#edf3f8] shadow-[0_14px_35px_rgba(24,72,120,0.12)] [@media(max-height:720px)]:mt-2">
        <img
          alt="Students preparing a robot in a robotics competition arena"
          className="h-full w-full object-cover object-center"
          decoding="async"
          fetchPriority="high"
          src={COMPETITION_PHOTO}
        />

        <div className="absolute inset-x-3 bottom-3 grid h-[50px] grid-cols-4 divide-x divide-slate-200 rounded-[18px] bg-white/95 px-1 shadow-[0_8px_24px_rgba(17,53,92,0.14)] backdrop-blur-sm">
          {stats.map(({ label, icon: Icon, color }) => (
            <div className="flex min-w-0 flex-col items-center justify-center gap-0.5" key={label}>
              <Icon className="size-4" style={{ color }} strokeWidth={2.2} />
              <span className="truncate text-[7px] font-extrabold uppercase tracking-[0.03em] text-[#14254a]">
                {label}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="relative z-10 shrink-0 pt-3 [@media(max-height:720px)]:pt-2">
        <div className="mb-1.5 flex items-center gap-2 px-1">
          <h2 className="text-[14px] font-black tracking-tight text-[#14254a]">Your Journey</h2>
          <Sparkles className="size-4 text-[#1598ea]" />
        </div>

        <div className="relative grid grid-cols-3 gap-2">
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute left-[13%] right-[13%] top-[31px] h-8 w-[74%]"
            preserveAspectRatio="none"
            viewBox="0 0 300 32"
          >
            <path
              d="M0 8 C48 8 49 27 96 27 C143 27 145 8 192 8 C236 8 251 22 300 13"
              fill="none"
              stroke="#8b98ab"
              strokeDasharray="5 5"
              strokeLinecap="round"
              strokeWidth="5"
            />
          </svg>

          {journey.map(({ title, detail, icon: Icon, color }, index) => (
            <div className="relative flex min-w-0 flex-col items-center text-center" key={title}>
              <div
                className="relative z-10 grid size-[62px] place-items-center rounded-full border-[4px] border-white text-white shadow-[0_7px_18px_rgba(28,60,100,0.13)] [@media(max-height:720px)]:size-[56px]"
                style={{ backgroundColor: color }}
              >
                <span className="absolute -top-2 grid size-5 place-items-center rounded-full border-2 border-white bg-inherit text-[9px] font-black">
                  {index + 1}
                </span>
                <Icon className="size-7 [@media(max-height:720px)]:size-6" strokeWidth={2.4} />
              </div>
              <p className="mt-1.5 whitespace-nowrap text-[10px] font-black leading-none" style={{ color }}>
                {title}
              </p>
              <p className="mt-1 max-w-[105px] text-[9px] font-medium leading-[11px] text-[#425273] [@media(max-height:720px)]:hidden">
                {detail}
              </p>
            </div>
          ))}
          <Rocket className="absolute -right-1 top-5 size-7 -rotate-12 text-[#ec168c]" strokeWidth={2.3} />
        </div>
      </section>

      <Button
        asChild
        className="relative z-10 mt-3 h-[54px] shrink-0 rounded-full bg-[#1598ea] text-[17px] font-black shadow-[0_12px_28px_rgba(21,152,234,0.25)] hover:bg-[#0f8bdd] [@media(max-height:720px)]:mt-2 [@media(max-height:720px)]:h-[50px]"
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

import { useCallback, useEffect, useRef, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  Bot,
  Cog,
  Lightbulb,
  Puzzle,
  Rocket,
  Target,
  Trophy,
  UserRound,
  UsersRound,
  Volume2,
  VolumeX,
} from "lucide-react";

import { Button } from "@/components/ui/button";

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

      <section className="relative z-10 mt-2 aspect-[3/2] w-full shrink-0 overflow-hidden rounded-[22px] border border-slate-100 bg-[#edf3f8] shadow-[0_10px_28px_rgba(24,72,120,0.11)] [@media(max-height:700px)]:mt-1.5 [@media(max-height:700px)]:aspect-[5/3] [@media(max-height:700px)]:rounded-[18px] [@media(min-height:850px)]:mt-3 [@media(min-height:850px)]:rounded-[26px]">
        <img
          alt="Students preparing a robot in a robotics competition arena"
          className="h-full w-full object-cover"
          decoding="async"
          fetchPriority="high"
          src={COMPETITION_PHOTO}
          style={{ objectPosition: "center 56%" }}
        />

        <div className="absolute inset-x-2 bottom-2 grid h-8 grid-cols-4 divide-x divide-slate-200 rounded-[12px] bg-white/94 px-0.5 shadow-[0_4px_12px_rgba(17,53,92,0.10)] backdrop-blur-sm [@media(max-height:700px)]:bottom-1.5 [@media(max-height:700px)]:h-7 [@media(min-height:850px)]:inset-x-3 [@media(min-height:850px)]:bottom-3 [@media(min-height:850px)]:h-9 [@media(min-height:850px)]:rounded-[14px]">
          {stats.map(({ label, icon: Icon, color }) => (
            <div className="flex min-w-0 flex-col items-center justify-center gap-px" key={label}>
              <Icon className="size-3 [@media(max-height:700px)]:size-[10px] [@media(min-height:850px)]:size-3.5" style={{ color }} strokeWidth={2.2} />
              <span className="truncate text-[5.8px] font-extrabold uppercase tracking-[0.02em] text-[#14254a] [@media(max-width:340px)]:text-[5.3px] [@media(min-height:850px)]:text-[6.3px]">
                {label}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="relative z-10 shrink-0 pt-3 [@media(max-height:700px)]:pt-2 [@media(min-height:850px)]:pt-4">
        <div className="mb-2 text-center [@media(max-height:700px)]:mb-1 [@media(min-height:850px)]:mb-2.5">
          <h2 className="text-[13px] font-black tracking-tight text-[#14254a] [@media(max-height:700px)]:text-[12px] [@media(min-height:850px)]:text-[14px]">Your Journey</h2>
        </div>

        <div className="relative grid grid-cols-3 gap-1.5">
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute left-[14%] right-[14%] top-[27px] h-7 w-[72%] [@media(max-height:700px)]:top-[24px] [@media(min-height:850px)]:top-[31px] [@media(min-height:850px)]:h-8"
            preserveAspectRatio="none"
            viewBox="0 0 300 32"
          >
            <path
              d="M0 16 C44 4 69 28 111 16 S177 4 218 16 S260 27 296 16"
              fill="none"
              stroke="#9aa6b7"
              strokeDasharray="4 7"
              strokeLinecap="round"
              strokeOpacity="0.72"
              strokeWidth="3"
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
              <p className="mt-2 whitespace-nowrap text-[9.5px] font-black leading-none [@media(max-width:340px)]:text-[8.5px] [@media(max-height:700px)]:mt-1.5 [@media(max-height:700px)]:text-[8.5px] [@media(min-height:850px)]:mt-2.5 [@media(min-height:850px)]:text-[10px]" style={{ color }}>
                {title}
              </p>
              <p className="mt-1 hidden max-w-[105px] text-[9px] font-medium leading-[11px] text-[#425273] [@media(min-height:850px)]:block">
                {detail}
              </p>
            </div>
          ))}
          <Rocket className="absolute right-0 top-[19px] size-5 -rotate-12 text-[#ec168c] [@media(max-height:700px)]:top-[16px] [@media(max-height:700px)]:size-[18px] [@media(min-height:850px)]:top-[22px] [@media(min-height:850px)]:size-6" strokeWidth={2.3} />
        </div>
      </section>

      <Button
        asChild
        className="relative z-10 mx-auto mt-4 h-12 w-[92%] shrink-0 rounded-full bg-[#1598ea] text-[16px] font-black shadow-[0_8px_20px_rgba(21,152,234,0.22)] hover:bg-[#0f8bdd] [@media(max-height:700px)]:mt-3 [@media(max-height:700px)]:h-11 [@media(max-height:700px)]:text-[15px] [@media(min-height:850px)]:mt-5 [@media(min-height:850px)]:h-[54px] [@media(min-height:850px)]:text-[17px]"
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
  const [soundOn, setSoundOn] = useState(true);

  const stats = [
    { label: "Challenges", icon: Target, color: "#ec168c" },
    { label: "Competition", icon: UsersRound, color: "#1598ea" },
    { label: "Skills", icon: Lightbulb, color: "#f5a400" },
    { label: "Achievements", icon: Trophy, color: "#39b54a" },
  ] as const;

  const journey = [
    { title: "LEARN", detail: "Understand the challenge", icon: Bot, color: "#1598ea" },
    { title: "BUILD ROBOT", detail: "Build step by step", icon: Cog, color: "#f5a400" },
    { title: "QUIZ & READY", detail: "Test skills & get ready", icon: Puzzle, color: "#39b54a" },
  ] as const;

  return (
    <div className="relative hidden h-full overflow-x-hidden overflow-y-auto bg-white text-[#14254a] md:block">
      {/* Playful desktop-only STEM scenery stays behind all interactive content. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-44 size-[380px] rounded-full bg-[#e4f5ff]/70 blur-3xl" />
        <div className="absolute -right-40 top-24 size-[470px] rounded-full bg-[#eaf7ff]/75 blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 size-[430px] rounded-full bg-[#eef9ff]/80 blur-3xl" />
        <Cog className="absolute -left-12 top-24 size-44 text-[#a7dfff]/55 xl:size-52" strokeWidth={1.8} />
        <Cog className="absolute -right-10 top-[30%] size-32 text-[#ffd0e3]/65 xl:size-44" strokeWidth={2} />
        <Cog className="absolute -left-9 bottom-12 size-28 text-[#ffda63]/75" strokeWidth={2.3} />
        <Cog className="absolute -right-14 bottom-0 size-48 text-[#ff9cc1]/65" strokeWidth={2} />
        <Cog className="absolute right-[2%] top-[48%] size-16 text-[#b8e6ff]/65" strokeWidth={2} />
        <div className="absolute left-[10%] top-[21%] size-5 rotate-12 rounded-sm bg-[#ffc63d] opacity-80" />
        <div className="absolute right-[13%] top-[39%] size-4 rotate-12 rounded-sm bg-[#ffc63d] opacity-80" />
        <div className="absolute -left-5 top-[37%] hidden size-48 rotate-[-18deg] items-center justify-center rounded-[46px] border-[12px] border-white bg-[#dff3ff]/80 text-[#168ee8] shadow-[0_12px_36px_rgba(21,152,234,0.08)] xl:flex">
          <Bot className="size-32" strokeWidth={1.8} />
        </div>
        <div className="absolute right-[3%] top-28 hidden size-36 rotate-[28deg] items-center justify-center rounded-full bg-[#eff9ff]/70 text-[#1598ea] xl:flex">
          <Rocket className="size-28" strokeWidth={1.65} />
        </div>
      </div>

      <header className="relative z-10 mx-auto flex h-[82px] w-full max-w-[1500px] items-center justify-between px-8 lg:px-12 xl:px-20">
        <button
          aria-label={soundOn ? "Mute sounds" : "Turn on sounds"}
          aria-pressed={soundOn}
          className="grid size-12 place-items-center rounded-full border border-[#d5e9f7] bg-[#f0f9ff] text-[#1598ea] shadow-[0_5px_15px_rgba(23,104,163,0.07)] transition hover:scale-105 hover:bg-[#e1f3ff] active:scale-95"
          onClick={() => setSoundOn((value) => !value)}
          type="button"
        >
          {soundOn ? <Volume2 className="size-6" /> : <VolumeX className="size-6" />}
        </button>

        <img
          alt="BE STEM READY"
          className="h-14 w-auto max-w-[38vw] object-contain lg:h-16"
          src="/home/be-stem-ready-logo.svg"
        />

        <Link
          aria-label="Open profile and progress"
          className="grid size-12 place-items-center rounded-full border border-[#d5e9f7] bg-[#f0f9ff] text-[#1598ea] shadow-[0_5px_15px_rgba(23,104,163,0.07)] transition hover:scale-105 hover:bg-[#e1f3ff] active:scale-95"
          to="/progress"
        >
          <UserRound className="size-6" strokeWidth={2.2} />
        </Link>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-[1500px] flex-col px-6 pb-10 pt-3 lg:px-12 xl:px-20">
        <section className="mx-auto flex w-full max-w-[1100px] flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#eaf7ff] px-5 py-2 text-[13px] font-extrabold text-[#087fe1] shadow-[0_3px_14px_rgba(21,152,234,0.06)] lg:text-[15px]">
            <Trophy className="size-5 text-[#f5a400]" fill="#f5a400" strokeWidth={1.6} />
            CIPTRIX Robotics Practice
          </div>

          <h1 className="mt-4 font-black leading-[0.98] tracking-[-0.055em] lg:mt-5">
            <span className="block text-[clamp(3.25rem,5.3vw,5.8rem)] text-[#1598ea]">
              Train Today.
            </span>
            <span className="mt-1 block text-[clamp(3.25rem,5.3vw,5.8rem)] text-[#ec168c]">
              Compete Tomorrow.
            </span>
          </h1>

          <p className="mt-4 max-w-[830px] text-[16px] font-medium leading-[1.45] text-[#23365d] lg:mt-5 lg:text-[19px] xl:text-[21px]">
            Learn the challenge, build your robot step by step, and get ready
            for real competition day.
          </p>
        </section>

        <div className="mt-8 grid min-w-0 gap-5 lg:mt-9 lg:grid-cols-[1.12fr_0.88fr] lg:items-stretch xl:gap-6">
          <section
            aria-label="Robotics competition and highlights"
            className="flex min-h-[350px] min-w-0 flex-col overflow-hidden rounded-[28px] border border-[#deedf8] bg-white p-3 shadow-[0_12px_36px_rgba(30,91,139,0.09)] lg:min-h-[390px] xl:min-h-[420px]"
          >
            <div className="relative min-h-[230px] flex-1 overflow-hidden rounded-[19px] bg-[#edf3f8]">
              <img
                alt="Students preparing a robot in a robotics competition arena"
                className="absolute inset-0 h-full w-full object-cover"
                decoding="async"
                fetchPriority="high"
                src={COMPETITION_PHOTO}
                style={{ objectPosition: "center 56%" }}
              />
            </div>
            <div className="mt-3 grid min-h-[82px] grid-cols-4 items-center divide-x divide-[#d7e8f5] rounded-[17px] bg-[#f0f9ff] py-2">
              {stats.map(({ label, icon: Icon, color }) => (
                <div className="flex min-w-0 flex-col items-center justify-center gap-1.5 px-1 text-center" key={label}>
                  <Icon className="size-6 lg:size-7" style={{ color }} strokeWidth={2.5} />
                  <span className="text-[10px] font-extrabold leading-tight text-[#14254a] xl:text-[12px]">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section
            aria-labelledby="desktop-journey-heading"
            className="flex min-h-[350px] min-w-0 flex-col rounded-[28px] border border-[#deedf8] bg-white/95 px-5 pb-6 pt-7 shadow-[0_12px_36px_rgba(30,91,139,0.09)] lg:min-h-[390px] lg:px-6 xl:min-h-[420px] xl:px-8"
          >
            <h2 id="desktop-journey-heading" className="text-center text-[29px] font-black tracking-tight text-[#14254a] lg:text-[32px] xl:text-[36px]">
              Your Journey
            </h2>

            <div className="relative mt-8 grid grid-cols-3 gap-2 lg:mt-9 xl:gap-3">
              <div aria-hidden="true" className="pointer-events-none absolute left-[16%] right-[16%] top-[40px] border-t-[4px] border-dashed border-[#b9dfff] xl:top-[47px]" />
              {journey.map(({ title, detail, icon: Icon, color }, index) => (
                <div className="relative flex min-w-0 flex-col items-center text-center" key={title}>
                  <div
                    className="relative z-10 grid size-20 place-items-center rounded-full border-[5px] border-white text-white shadow-[0_5px_16px_rgba(28,60,100,0.1)] xl:size-[94px]"
                    style={{ backgroundColor: color }}
                  >
                    <span className="absolute -right-1 -top-1 grid size-6 place-items-center rounded-full border-[3px] border-white bg-inherit text-[10px] font-black">
                      {index + 1}
                    </span>
                    <Icon className="size-9 xl:size-11" strokeWidth={2.5} />
                  </div>
                  <h3 className="mt-3 text-[12px] font-black leading-tight lg:text-[13px] xl:text-[16px]" style={{ color }}>
                    {title}
                  </h3>
                  <p className="mt-1 max-w-[145px] text-[11px] font-medium leading-[1.4] text-[#536789] lg:text-[12px] xl:text-[14px]">
                    {detail}
                  </p>
                </div>
              ))}
            </div>

            <Button
              asChild
              className="mt-auto h-[62px] w-full rounded-full bg-[#1598ea] text-[20px] font-black text-white shadow-[0_9px_22px_rgba(21,152,234,0.18)] transition hover:-translate-y-0.5 hover:bg-[#0c86de] xl:h-[70px] xl:text-[22px]"
            >
              <Link to="/join">
                Start Journey
                <ArrowRight className="ml-2 size-7" />
              </Link>
            </Button>
          </section>
        </div>
      </main>
    </div>
  );
}

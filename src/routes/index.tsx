import { useEffect, useRef, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Bot, CircuitBoard, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { APP_NAME, IS_DEMO_CONTENT } from "@/config/app";
import { competitionInfo } from "@/data/competition";

const MOBILE_INTRO_STORAGE_KEY = "be-stem-ready-mobile-intro-seen";
const MOBILE_INTRO_FADE_MS = 350;
const MOBILE_INTRO_FALLBACK_MS = 6500;

export const Route = createFileRoute("/")({
  component: CompetitionWelcomePage,
});

function MobileLogoIntro() {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const exitTimerRef = useRef<number | null>(null);

  const finishIntro = () => {
    if (isFading) return;

    try {
      window.sessionStorage.setItem(MOBILE_INTRO_STORAGE_KEY, "true");
    } catch {
      // Storage can be unavailable in private/restricted browsing modes.
    }

    setIsFading(true);
    exitTimerRef.current = window.setTimeout(() => {
      setIsVisible(false);
    }, MOBILE_INTRO_FADE_MS);
  };

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
  }, []);

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
    <div className="relative flex h-full flex-col overflow-hidden bg-navy text-navy-foreground">
      <MobileLogoIntro />

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

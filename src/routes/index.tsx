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

const BRAND_LOGO =
  "data:image/webp;base64,UklGRnI/AABXRUJQVlA4IGY/AABw3gKdASqaAUEBPm02mEikIqKkJEK4JCWTwYt2fHKlhx9AAX8GDz7j4NBxg9s2NTtKXg8oYwvys1PVOBHSIfe+bclCsrCEkE2Lk7U7jsOdAKjPWt0nX8T7vQB0ShSCLIoSzYO4VuCywbqCGzZzLtbJ9OkpHBV7RuUYCUVPFt5jSSj8Q0w7Gm3fWZKqVg7WmLHRF6Xc7pAuP1KJ39xpO8MZpF0hPq2oR+0fLLAo6v+m1LtYpdQ+VbGg9ElxD5k1g7xyxy5N5a1lGmYl+UaOpMEYK6BUJg4C8QMyP5LOiY0Yg4Nw2QxW9B8bA6dTn8+rsP8oA2r7iOdwr9ky5V9tLsI1aM1ctM6r9OqxdkwzRPvw0qR6UnOpl3FRmK6c2d5jTjgTkiBDkq5J9j7Gt6u8ksK3ZqHTrpWjy+Y8p0Y3H0DpQ9xr8tHk9ugsc1XHHjsQz6bC0D4h9wuevAsV0k8gLQpTtCvBPOsbH7HNh2OYBVVCk4oLwz7MWM4gSYA4qkpcUbGVh0Aq2+PqQEFc4fGsw9QWQwRwxyw0vkq8Dq4l0XfYXqxIisQ8yJ1qXTXl7Q8OFeQvR2ykmwPZp4Bw5xzq0LlF0e5LWx+qFl0UIOUZf9cXw5G2s4S1QYgdsWYgZlRkK9DxuQnQXq3RlrXj4f7apSUhfJsQVPzvH2nQKpG3gK8WcAo+z3iWc2BKGzr/fdhPF9Zr4mQ3ilJmOQXxT3JxYweQ9Y4RZxCDz0HTmUi0m8u3x4iALVwjcMcZiAiYjoqp7hYUm3DKvuMqjuqpo3EMBv3A1g0B8AUh84fCdt7JFSn1UQyct5SU0OWeKB+kzaKdHKq8P5l2GxxzBKNOyLuN5S0rXx8c2b0cK2Z4OeIuPmltK7CDKjvP5VDG5i4YlHz8XG2iZyP5R8pN9tQjA6h5YkwVEX4qYayQk2G+BmR9Nw1+z6pHCDslg7X0y0N4M4OC8fELKz7e2wH4u0E2e8A8nMIU2a4EQYhEjhXt9p/k9ca3JfEZlM3G2xYcl4hDqUjssnH9WTRoO+8hOG5eHhJ6iN0+cXzj3uThHjNQ3uGfIkHnIPPRUAm2XhSxAK5VRyE74QG5DZDeAASO+e2l1Q+CH1im4W3fNlGgwf9HytsPjgkq3rdIe/JZkHQ0tAWK4KX0S7FQXzqV3MQfeQbfzL70L3N8VXWmD5MB6l+R7FZMY1f6iR7N0nuXk9Qb1ZuySUZjF8gPoQ3y9gEsGQirNYUty5hH7j2QAA";

const COMPETITION_PHOTO =
  "data:image/webp;base64,UklGRkavAABXRUJQVlA4IDqvAABw2gSdASrQAfYBPm02mEikIqKkJER8JCWTwZx0hoxBESxBR79+jdx4GDc9xJ5KjZItg2J8p2cJi2sOUHZ0pZf4h9hdJxVztKaFPekUt1UFA/9XznH6tUwlrQeYVlxlblLvQTC3uqbC1ZR3kQ8Gmr1kSTc5yE3OJtoqaKKreFHiIw4TiSa6Xc0g3t4kI3oOzFOYhBb8uMrg3L68uQ8bq8JxBZDE92+dw6h3dW4/0bM0pRKi7h7iofG2I3LZvZTvIaFSx6TEwEBDwrdxbI3OwOUc+v+EDK5bOYYqJe0T7sfdHtIAxj8uM74P70ikxLCSoopKL5Q2KcWbznQnhVMoaE5r8L5M4Jb0TRvjphXTfLKaTI7Hx/+Q+NUq8M9Q2P3ZV2Kl8gG0wD+P2Xr+K8wCA9M0g+UO5XEL/rWQhIGr0oNTA9G/eIpFg+MzS0uKxKobd7b0V7vhJjF7axt6CbtE4Gn5C8YwD7FzHu7TzcXEvS0ZBri5woe5PjhGz9+Hi4lf7zSzlk3wCwX9xwUJQxs4v/SOeO7mghYdY3j7ycMJ4HzgVdeXlJCSHfDmUmwQ6nSaT85S4BBjhmOwMnLFJPvft1GlTIW9E+F6oTzvuQvmo0RQHlK1ROe9ywY81Eh7lq/hYw3pKdD7x4yL30P1y2kVXwWwJJ4o8q4eY+yA7BVMjk3+wVbeJnRGuIKu9JYp/Z+uaLrRw8jbZYG/EZwpGU5nU4Y+NPl9Kr0hJnk4gQe3ne4h2KbQBhKH3iyHiK6KWi9vLjZBXz90ynwK/vA0E3iMdFa2L8gvT8Y6P2pp4OORhsGSxUDncRzn1J9fN8k4fge/Dvfh0EPWi0V2lA6lWY35vrFE3JfV7q4T5jgpzo+uADAdKBwBTigOcEzciOv6kVZ2p5rHf3YPGLo1Gw1vOtVEwkP2Ayrf6/2jQGOXkj7QmZrHwgT9L6PRfMti2WZlwpOJHVe0ogvcEcZGUD9xoEpBZwuYkRBmt6RiVrLzJ4vX9yRHWfF+VcNzyZqP+8m1PpO+uT8nT0yB/R1QyB10eFQ71saCyz8wgFBVko8UlAjEiAWZs6+cIsSpmh7GsdCZyuaGcr4I8hADkl3QnnNwqLydQeLrj3RU6W4QJtS56X3vAnvaRt5Ur/GE7WvHjpT2bPO6y5I6+uZTXnUHTfex/BjnRi4ko1G2B0uQBp50JpOGFu+Ha8hPcsP6JwF02I59fUxyqzgjYryR2kMUh8YXyAAB";

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
    { label: "Real\nChallenges", icon: Target, color: "#1598ea" },
    { label: "Real\nCompetitions", icon: UsersRound, color: "#ec168c" },
    { label: "Real\nSkills", icon: Lightbulb, color: "#f5a400" },
    { label: "Real\nAchievements", icon: Trophy, color: "#39b54a" },
  ] as const;

  return (
    <main className="relative flex h-[100dvh] flex-col overflow-hidden bg-white px-4 pb-4 pt-3 text-[#14254a] md:hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <Cog className="absolute -left-4 top-24 size-20 text-[#1598ea]/10" strokeWidth={1.6} />
        <Cog className="absolute left-14 top-36 size-12 text-[#1598ea]/10" strokeWidth={1.6} />
        <Rocket className="absolute -right-3 top-[23%] size-20 rotate-[-8deg] text-[#ec168c]/12" strokeWidth={1.7} />
        <Cog className="absolute right-3 top-[37%] size-10 text-[#f5a400]/14" strokeWidth={1.8} />
        <svg className="absolute right-0 top-[18%] h-48 w-36 opacity-20" viewBox="0 0 140 190">
          <path
            d="M150 4 C98 38 146 75 87 108 C43 132 76 164 9 188"
            fill="none"
            stroke="#ec168c"
            strokeDasharray="7 8"
            strokeLinecap="round"
            strokeWidth="3"
          />
        </svg>
      </div>

      <header className="relative z-10 flex h-[58px] shrink-0 items-center justify-between">
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
          className="absolute left-1/2 top-1/2 h-[50px] w-auto -translate-x-1/2 -translate-y-1/2 object-contain"
          src={BRAND_LOGO}
        />

        <Link
          aria-label="Open profile and progress"
          className="grid size-11 place-items-center rounded-full border border-slate-200 bg-white text-[#1598ea] shadow-[0_6px_18px_rgba(18,50,93,0.10)] transition active:scale-95"
          to="/progress"
        >
          <UserRound className="size-5" strokeWidth={2.2} />
        </Link>
      </header>

      <section className="relative z-10 flex min-h-0 flex-1 flex-col">
        <div className="text-center">
          <div className="mx-auto mt-1 inline-flex items-center gap-2 rounded-full border border-[#1598ea]/35 bg-white/90 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.08em] text-[#1598ea] shadow-sm">
            <Trophy className="size-3.5" />
            CIPTRIX Robotics Practice
          </div>

          <h1 className="mt-2 font-black leading-[0.98] tracking-[-0.045em]">
            <span className="block text-[clamp(2rem,9.8vw,2.8rem)] text-[#1598ea]">
              Train Today.
            </span>
            <span className="mt-1 block text-[clamp(2rem,9.8vw,2.8rem)] text-[#ec168c]">
              Compete Tomorrow.
            </span>
          </h1>

          <p className="mx-auto mt-2 max-w-[340px] text-[clamp(0.76rem,3.2vw,0.9rem)] font-medium leading-[1.45] text-[#32405f]">
            Learn the challenge, build your robot step by step, and get ready for
            real competition day.
          </p>
        </div>

        <div className="relative mt-3 min-h-0 flex-1">
          <div className="relative h-full min-h-[190px] overflow-hidden rounded-[28px] border border-slate-100 bg-slate-100 shadow-[0_16px_35px_rgba(18,50,93,0.16)]">
            <img
              alt="Students preparing a robot for a robotics competition"
              className="h-full w-full object-cover"
              src={COMPETITION_PHOTO}
            />
            <div className="absolute inset-x-3 bottom-3 grid grid-cols-4 rounded-[22px] bg-white/95 px-1 py-2 shadow-[0_8px_20px_rgba(18,50,93,0.16)] backdrop-blur-sm">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    className={`flex min-w-0 flex-col items-center justify-center px-1 ${
                      index > 0 ? "border-l border-slate-200" : ""
                    }`}
                    key={stat.label}
                  >
                    <Icon
                      aria-hidden="true"
                      className="mb-1 size-5"
                      style={{ color: stat.color }}
                      strokeWidth={2.3}
                    />
                    <span className="whitespace-pre-line text-center text-[7.5px] font-black uppercase leading-[1.1] text-[#18284d]">
                      {stat.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <section className="mt-3 shrink-0">
          <div className="mb-1 flex items-center gap-2 px-1">
            <h2 className="text-[17px] font-black tracking-[-0.02em] text-[#162650]">
              Your Journey
            </h2>
            <Sparkles className="size-4 text-[#1598ea]" />
          </div>

          <div className="relative mx-auto grid max-w-[360px] grid-cols-3 items-start gap-2 px-1 pt-1">
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute left-[16%] top-[22px] h-[45px] w-[68%]"
              preserveAspectRatio="none"
              viewBox="0 0 240 45"
            >
              <path
                d="M0 15 C38 15 37 40 78 40 C119 40 116 8 159 8 C198 8 201 31 240 31"
                fill="none"
                stroke="#8c98a8"
                strokeDasharray="6 5"
                strokeLinecap="round"
                strokeWidth="6"
              />
              <path
                d="M0 15 C38 15 37 40 78 40 C119 40 116 8 159 8 C198 8 201 31 240 31"
                fill="none"
                stroke="#ffffff"
                strokeDasharray="10 7"
                strokeLinecap="round"
                strokeWidth="1.5"
              />
            </svg>

            <JourneyStep
              color="#1598ea"
              description="Understand the challenge"
              icon={Bot}
              label="Learn"
              number="1"
            />
            <JourneyStep
              color="#f5a400"
              description="Build step by step"
              icon={Cog}
              label="Build Robot"
              number="2"
            />
            <JourneyStep
              color="#39b54a"
              description="Test skills & get ready"
              icon={Puzzle}
              label="Quiz & Ready"
              number="3"
            />

            <Rocket
              aria-hidden="true"
              className="absolute -right-1 top-7 size-7 rotate-[18deg] text-[#ec168c]"
              strokeWidth={2.3}
            />
          </div>
        </section>

        <Button
          asChild
          className="mt-3 h-12 shrink-0 rounded-full bg-[#1598ea] text-[15px] font-black text-white shadow-[0_10px_24px_rgba(21,152,234,0.30)] hover:bg-[#118bd8]"
        >
          <Link to="/join">
            Start Journey
            <ArrowRight aria-hidden="true" className="size-5" />
          </Link>
        </Button>
      </section>
    </main>
  );
}

function JourneyStep({
  color,
  description,
  icon: Icon,
  label,
  number,
}: {
  color: string;
  description: string;
  icon: typeof Bot;
  label: string;
  number: string;
}) {
  return (
    <div className="relative z-10 flex min-w-0 flex-col items-center text-center">
      <div
        className="relative grid size-[58px] place-items-center rounded-full text-white shadow-[0_8px_18px_rgba(18,50,93,0.15)]"
        style={{ backgroundColor: color }}
      >
        <span
          className="absolute -top-2 grid size-6 place-items-center rounded-full border-2 border-white text-[10px] font-black text-white"
          style={{ backgroundColor: color }}
        >
          {number}
        </span>
        <Icon aria-hidden="true" className="size-7" strokeWidth={2.2} />
      </div>
      <h3
        className="mt-1.5 text-[10px] font-black uppercase leading-tight"
        style={{ color }}
      >
        {label}
      </h3>
      <p className="mt-0.5 max-w-[95px] text-[8.5px] font-medium leading-[1.25] text-[#43506b]">
        {description}
      </p>
    </div>
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
            <p className="hidden text-xs text-navy-muted sm:block">
              Learn · Build · Compete
            </p>
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
              <div
                aria-hidden="true"
                className="absolute inset-5 rounded-full border border-primary/25"
              />
              <div
                aria-hidden="true"
                className="absolute inset-10 rounded-full border border-primary/20"
              />
              <Bot aria-hidden="true" className="size-28" strokeWidth={1.3} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

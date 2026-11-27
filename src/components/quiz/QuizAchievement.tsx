import { useEffect, useState } from "react";
import { CheckCircle2, Clock3, Trophy } from "lucide-react";
import { getQuizBank, readQuizSavedState, type QuizSavedState, QUIZ_PASS_COUNT } from "@/data/quizStudio";

/** Read browser storage after hydration to avoid rendering a different SSR tree. */
export function useQuizSavedStatus(projectId: string): QuizSavedState | null {
  const [status, setStatus] = useState<QuizSavedState | null>(null);
  useEffect(() => {
    if(import.meta.env["VITE_J5_PRIVATE_UI"]==="true"){setStatus(null);return;}
    const update = () => setStatus(readQuizSavedState(projectId));
    const onCustomEvent = (event: Event) => {
      if ((event as CustomEvent<string>).detail === projectId) update();
    };
    update();
    window.addEventListener("storage", update);
    window.addEventListener("focus", update);
    window.addEventListener("bsr-quiz-saved", onCustomEvent);
    return () => {
      window.removeEventListener("storage", update);
      window.removeEventListener("focus", update);
      window.removeEventListener("bsr-quiz-saved", onCustomEvent);
    };
  }, [projectId]);
  return status;
}

/** Category cards: ONLY show Passed, never draft/in-progress progress. */
export function QuizPassedBadge({ projectId }: { projectId: string }) {
  const saved = useQuizSavedStatus(projectId);
  if (!getQuizBank(projectId) || saved?.bestScore == null || saved.bestScore < QUIZ_PASS_COUNT) return null;
  return (
    <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-extrabold text-emerald-700">
      <CheckCircle2 className="size-3.5" aria-hidden="true"/> Quiz Passed
    </span>
  );
}

/** Project detail: show the student's saved best and unfinished attempt, if any. */
export function QuizProjectProgress({ projectId }: { projectId: string }) {
  const saved = useQuizSavedStatus(projectId);
  if (!getQuizBank(projectId) || !saved) return null;
  const answered = saved.draft ? saved.draft.questionIds.filter(id => Object.prototype.hasOwnProperty.call(saved.draft?.answers, id)).length : 0;
  return (
    <div className="mt-3 space-y-2 text-sm">
      {saved.bestScore != null ? (
        <p className="flex items-center gap-2 font-semibold text-[#132654]">
          <Trophy className="size-4 text-amber-500" aria-hidden="true"/>
          Best score: {saved.bestScore}/5
          {saved.bestScore >= QUIZ_PASS_COUNT ? (
            <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-extrabold text-emerald-700">Passed</span>
          ) : null}
        </p>
      ) : null}
      {saved.draft ? (
        <p className="flex items-center gap-2 text-slate-600">
          <Clock3 className="size-4 text-[#168eea]" aria-hidden="true"/>
          Unfinished quiz: {answered}/5 answered — continue or start over in Quiz Studio
        </p>
      ) : null}
    </div>
  );
}

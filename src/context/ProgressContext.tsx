import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { DEMO_STUDENT_NAME } from "@/config/app";
import { allLessons, theoryModules } from "@/data/theory";
import { practicalProjects } from "@/data/practical";
import type { PracticalGrade, QuizAttempt, StudentProgress } from "@/types/learning";

const STORAGE_KEY = "robolearn.progress.v1";

const emptyProgress: StudentProgress = {
  studentName: DEMO_STUDENT_NAME,
  completedLessonIds: [],
  completedStepIds: [],
  quizAttempts: [],
  practicalGrades: [],
};

interface ProgressContextValue {
  progress: StudentProgress;
  hydrated: boolean;
  isLessonCompleted: (lessonId: string) => boolean;
  toggleLessonCompleted: (lessonId: string, value?: boolean) => void;
  isStepCompleted: (stepId: string) => boolean;
  toggleStepCompleted: (stepId: string, value?: boolean) => void;
  addQuizAttempt: (attempt: QuizAttempt) => void;
  addPracticalGrade: (grade: PracticalGrade) => void;
  resetProgress: () => void;
  stats: {
    totalLessons: number;
    completedLessons: number;
    theoryPercent: number;
    totalProjects: number;
    completedProjects: number;
    practicalPercent: number;
    overallPercent: number;
    averageQuizScore: number | null;
    averagePracticalGrade: number | null;
  };
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

function readStored(): StudentProgress {
  if (typeof window === "undefined") return emptyProgress;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyProgress;
    const parsed = JSON.parse(raw) as Partial<StudentProgress>;
    return { ...emptyProgress, ...parsed };
  } catch {
    return emptyProgress;
  }
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<StudentProgress>(emptyProgress);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setProgress(readStored());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      /* storage unavailable — demo progress simply will not persist */
    }
  }, [progress, hydrated]);

  const toggleInList = useCallback(
    (key: "completedLessonIds" | "completedStepIds", id: string, value?: boolean) => {
      setProgress((prev) => {
        const has = prev[key].includes(id);
        const next = value ?? !has;
        if (next === has) return prev;
        return {
          ...prev,
          [key]: next ? [...prev[key], id] : prev[key].filter((x) => x !== id),
        };
      });
    },
    [],
  );

  const value = useMemo<ProgressContextValue>(() => {
    const totalLessons = allLessons.length;
    const completedLessons = progress.completedLessonIds.length;
    const theoryPercent = totalLessons ? Math.round((completedLessons / totalLessons) * 100) : 0;

    const totalProjects = practicalProjects.length;
    const completedProjects = practicalProjects.filter((p) =>
      p.steps.every((s) => progress.completedStepIds.includes(s.id)),
    ).length;
    const practicalPercent = totalProjects
      ? Math.round((completedProjects / totalProjects) * 100)
      : 0;

    const totalUnits = totalLessons + practicalProjects.reduce((n, p) => n + p.steps.length, 0);
    const doneUnits =
      completedLessons +
      practicalProjects.reduce(
        (n, p) => n + p.steps.filter((s) => progress.completedStepIds.includes(s.id)).length,
        0,
      );

    const averageQuizScore = progress.quizAttempts.length
      ? Math.round(
          progress.quizAttempts.reduce((n, a) => n + a.percentage, 0) / progress.quizAttempts.length,
        )
      : null;
    const averagePracticalGrade = progress.practicalGrades.length
      ? Math.round(
          progress.practicalGrades.reduce((n, g) => n + g.total, 0) / progress.practicalGrades.length,
        )
      : null;

    return {
      progress,
      hydrated,
      isLessonCompleted: (id) => progress.completedLessonIds.includes(id),
      toggleLessonCompleted: (id, v) => toggleInList("completedLessonIds", id, v),
      isStepCompleted: (id) => progress.completedStepIds.includes(id),
      toggleStepCompleted: (id, v) => toggleInList("completedStepIds", id, v),
      addQuizAttempt: (attempt) =>
        setProgress((prev) => ({ ...prev, quizAttempts: [attempt, ...prev.quizAttempts].slice(0, 20) })),
      addPracticalGrade: (grade) =>
        setProgress((prev) => ({
          ...prev,
          practicalGrades: [grade, ...prev.practicalGrades].slice(0, 20),
        })),
      resetProgress: () => setProgress(emptyProgress),
      stats: {
        totalLessons,
        completedLessons,
        theoryPercent,
        totalProjects,
        completedProjects,
        practicalPercent,
        overallPercent: totalUnits ? Math.round((doneUnits / totalUnits) * 100) : 0,
        averageQuizScore,
        averagePracticalGrade,
      },
    };
  }, [progress, hydrated, toggleInList]);

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used inside ProgressProvider");
  return ctx;
}

/** Derived helpers shared across screens. */
export function useModuleProgress() {
  const { progress } = useProgress();
  return useCallback(
    (moduleId: string) => {
      const mod = theoryModules.find((m) => m.id === moduleId);
      if (!mod) return { completed: 0, total: 0, percent: 0, status: "Not Started" as const };
      const completed = mod.lessons.filter((l) => progress.completedLessonIds.includes(l.id)).length;
      const total = mod.lessons.length;
      const percent = total ? Math.round((completed / total) * 100) : 0;
      const status = completed === 0 ? "Not Started" : completed === total ? "Completed" : "In Progress";
      return { completed, total, percent, status } as const;
    },
    [progress.completedLessonIds],
  );
}

export function useProjectProgress() {
  const { progress } = useProgress();
  return useCallback(
    (projectId: string) => {
      const project = practicalProjects.find((p) => p.id === projectId);
      if (!project) return { completed: 0, total: 0, percent: 0, status: "Not Started" as const };
      const completed = project.steps.filter((s) => progress.completedStepIds.includes(s.id)).length;
      const total = project.steps.length;
      const percent = total ? Math.round((completed / total) * 100) : 0;
      const status = completed === 0 ? "Not Started" : completed === total ? "Completed" : "In Progress";
      return { completed, total, percent, status } as const;
    },
    [progress.completedStepIds],
  );
}

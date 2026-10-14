import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { DEMO_STUDENT_NAME } from "@/config/app";
import { allLessons, theoryModules } from "@/data/theory";
import { practicalProjects } from "@/data/practical";
import type { PracticalGrade, QuizAttempt, StudentProgress } from "@/types/learning";

const STORAGE_KEY = "robolearn.progress.v1";
const validLessonIds = new Set(allLessons.map((lesson) => lesson.id));
const validModuleIds = new Set(theoryModules.map((module) => module.id));
const validProjectIds = new Set(practicalProjects.map((project) => project.id));
const validStepIds = new Set(
  practicalProjects.flatMap((project) => project.steps.map((step) => step.id)),
);

const emptyProgress: StudentProgress = {
  studentName: DEMO_STUDENT_NAME,
  completedLessonIds: [],
  lastTheoryPageByModule: {},
  completedStepIds: [],
  legacyStepCompletionIds: [],
  quizAttempts: [],
  practicalGrades: [],
};

interface ProgressContextValue {
  progress: StudentProgress;
  hydrated: boolean;
  setStudentName: (name: string) => void;
  isLessonCompleted: (lessonId: string) => boolean;
  toggleLessonCompleted: (lessonId: string, value?: boolean) => void;
  setLastTheoryPage: (moduleId: string, pageIndex: number) => void;
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function readTheoryPages(value: unknown) {
  const pages: Record<string, number> = {};
  if (!isRecord(value)) return pages;

  for (const [moduleId, pageIndex] of Object.entries(value)) {
    if (
      validModuleIds.has(moduleId) &&
      typeof pageIndex === "number" &&
      Number.isInteger(pageIndex) &&
      pageIndex >= 0 &&
      pageIndex < 100
    ) {
      pages[moduleId] = pageIndex;
    }
  }
  return pages;
}

function isQuizAttempt(value: unknown): value is QuizAttempt {
  if (!isRecord(value)) return false;
  const candidate = value as Partial<QuizAttempt>;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.lessonId === "string" &&
    validLessonIds.has(candidate.lessonId) &&
    typeof candidate.lessonTitle === "string" &&
    typeof candidate.score === "number" &&
    typeof candidate.total === "number" &&
    typeof candidate.percentage === "number" &&
    typeof candidate.takenAt === "string" &&
    Array.isArray(candidate.results) &&
    candidate.results.every(
      (result) =>
        isRecord(result) &&
        typeof result["questionId"] === "string" &&
        typeof result["answer"] === "string" &&
        typeof result["correct"] === "boolean",
    ) &&
    isStringArray(candidate.strengths) &&
    isStringArray(candidate.review)
  );
}

function isPracticalGrade(value: unknown): value is PracticalGrade {
  if (!isRecord(value)) return false;
  const candidate = value as Partial<PracticalGrade>;
  if (!isRecord(candidate.breakdown)) return false;
  const breakdown = candidate.breakdown as Partial<PracticalGrade["breakdown"]>;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.projectId === "string" &&
    validProjectIds.has(candidate.projectId) &&
    typeof candidate.projectTitle === "string" &&
    typeof candidate.total === "number" &&
    typeof breakdown.assembly === "number" &&
    typeof breakdown.components === "number" &&
    typeof breakdown.functionality === "number" &&
    typeof breakdown.explanation === "number" &&
    isStringArray(candidate.strengths) &&
    isStringArray(candidate.issues) &&
    isStringArray(candidate.improvements) &&
    isStringArray(candidate.recommendedModuleIds) &&
    typeof candidate.gradedAt === "string"
  );
}

function readStored(): StudentProgress {
  if (typeof window === "undefined") return emptyProgress;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyProgress;
    const parsed = JSON.parse(raw) as Partial<StudentProgress> | null;
    if (!parsed || typeof parsed !== "object") return emptyProgress;

    return {
      studentName: typeof parsed.studentName === "string" ? parsed.studentName : emptyProgress.studentName,
      completedLessonIds: Array.isArray(parsed.completedLessonIds)
        ? parsed.completedLessonIds.filter(
            (id): id is string => typeof id === "string" && validLessonIds.has(id),
          )
        : [],
      lastTheoryPageByModule: readTheoryPages(parsed.lastTheoryPageByModule),
      completedStepIds: Array.isArray(parsed.completedStepIds)
        ? parsed.completedStepIds.filter(
            (id): id is string => typeof id === "string" && validStepIds.has(id),
          )
        : [],
      // Historical s7/s8 were manual operations or a custom frame sharing s7's ID.
      // Neither can safely be mapped to the inserted rail or frame lesson.
      // Keep them as historic evidence, never mark the new physical tasks completed.
      legacyStepCompletionIds: [...new Set([
        ...(Array.isArray(parsed.legacyStepCompletionIds) ? parsed.legacyStepCompletionIds : []),
        ...(Array.isArray(parsed.completedStepIds) ? parsed.completedStepIds : []),
      ].filter((id): id is string => id === "marksmanship-s7" || id === "marksmanship-s8"))],
      quizAttempts: Array.isArray(parsed.quizAttempts)
        ? parsed.quizAttempts.filter(isQuizAttempt).slice(0, 20)
        : [],
      practicalGrades: Array.isArray(parsed.practicalGrades)
        ? parsed.practicalGrades.filter(isPracticalGrade).slice(0, 20)
        : [],
    };
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
      setStudentName: (name) =>
        setProgress((prev) => ({ ...prev, studentName: name.trim().slice(0, 32) })),
      isLessonCompleted: (id) => progress.completedLessonIds.includes(id),
      toggleLessonCompleted: (id, v) => toggleInList("completedLessonIds", id, v),
      setLastTheoryPage: (moduleId, pageIndex) => {
        if (!validModuleIds.has(moduleId) || !Number.isInteger(pageIndex) || pageIndex < 0) return;
        setProgress((prev) => ({
          ...prev,
          lastTheoryPageByModule: {
            ...prev.lastTheoryPageByModule,
            [moduleId]: Math.min(pageIndex, 99),
          },
        }));
      },
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

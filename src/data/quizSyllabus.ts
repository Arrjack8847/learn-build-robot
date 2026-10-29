/**
 * Quiz Studio availability and curriculum source registry for Levels 1–6.
 *
 * A registered URL does NOT mean its educational content has been reviewed.
 * Only projects with a manually verified ten-question bank are playable.
 * Source-only projects stay pending rather than receiving fabricated quizzes.
 */
import { practicalProjects, getProject } from "./practical";
import { getLevelOneLecture } from "./levelOneLectures";
import { getLevelTwoLecture } from "./levelTwoLectures";
import { getLevelThreeLecture } from "./levelThreeLectures";
import { levelFourLearningLessons } from "./levelFourLearning";
import { levelFiveSixLearningLectures } from "./levelFiveSixContent";
import { getQuizBank } from "./quizStudio";

export type QuizSyllabusStatus = "ready" | "needs-question-review" | "missing-learning-source";

export interface QuizSyllabusEntry {
  projectId: string;
  title: string;
  level: 1 | 2 | 3 | 4 | 5 | 6;
  categoryId?: string;
  learningUrl: string | null;
  status: QuizSyllabusStatus;
}

/** The same registered Learning PDF used by the existing Learning Studio. */
export function getQuizLearningUrl(projectId: string): string | null {
  const project = getProject(projectId);
  if (!project) return null;
  switch (project.level) {
    case 1: return getLevelOneLecture(projectId)?.url ?? null;
    case 2: return getLevelTwoLecture(projectId)?.url ?? null;
    case 3: return getLevelThreeLecture(projectId)?.url ?? null;
    case 4: return levelFourLearningLessons.find(item => item.id === projectId)?.url ?? null;
    case 5:
    case 6: return levelFiveSixLearningLectures[projectId]?.url ?? null;
    default: return null;
  }
}

export function getQuizSyllabusEntry(projectId: string): QuizSyllabusEntry | null {
  const project = getProject(projectId);
  if (!project || !project.level || project.level < 1 || project.level > 6) return null;
  const level = project.level as QuizSyllabusEntry["level"];
  const learningUrl = getQuizLearningUrl(projectId);
  const status: QuizSyllabusStatus = getQuizBank(projectId)
    ? "ready" : learningUrl ? "needs-question-review" : "missing-learning-source";
  return {
    projectId,
    title: project.title,
    level,
    ...(project.categoryId ? { categoryId: project.categoryId } : {}),
    learningUrl,
    status,
  };
}

/** Inventory includes registered projects, not folders without a working project route. */
export function getQuizSyllabusInventory(): QuizSyllabusEntry[] {
  return practicalProjects
    .map(project => getQuizSyllabusEntry(project.id))
    .filter((entry): entry is QuizSyllabusEntry => entry !== null);
}

export function getQuizSyllabusSummary() {
  const inventory = getQuizSyllabusInventory();
  return [1, 2, 3, 4, 5, 6].map(level => {
    const entries = inventory.filter(item => item.level === level);
    return {
      level,
      registered: entries.length,
      ready: entries.filter(item => item.status === "ready").length,
      needingQuestionReview: entries.filter(item => item.status === "needs-question-review").length,
      missingSource: entries.filter(item => item.status === "missing-learning-source").length,
    };
  });
}

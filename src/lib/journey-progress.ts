import { practicalProjects } from "@/data/practical";
import { allLessons } from "@/data/theory";
import type { StudentProgress } from "@/types/learning";

export function getJourneyRequirements(progress: StudentProgress) {
  const learningComplete =
    allLessons.length > 0 &&
    allLessons.every((lesson) => progress.completedLessonIds.includes(lesson.id));
  const robotComplete =
    practicalProjects.length > 0 &&
    practicalProjects.every((project) =>
      project.steps.every((step) => progress.completedStepIds.includes(step.id)),
    );

  return {
    learningComplete,
    robotComplete,
    quizUnlocked: learningComplete && robotComplete,
    completedRequirements: Number(learningComplete) + Number(robotComplete),
  };
}

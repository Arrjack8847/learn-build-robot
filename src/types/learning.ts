export type Difficulty = "Beginner" | "Intermediate" | "Advanced";
export type Status = "Not Started" | "In Progress" | "Completed";

export interface TheoryLesson {
  id: string;
  moduleId: string;
  title: string;
  objectives: string[];
  content: string[];
  concept: { title: string; body: string };
  example: { title: string; body: string };
}

export interface TheoryModule {
  id: string;
  number: number;
  title: string;
  description: string;
  icon: string;
  durationMinutes: number;
  difficulty: Difficulty;
  lessons: TheoryLesson[];
}

export interface PracticalStep {
  id: string;
  number: number;
  title: string;
  description: string;
  image?: string;
  /** Immutable manual references; independent from the interactive step number. */
  originalManualStepNumbers?: number[];
  /** Historic/overlapping manual reference: not a new physical operation. */
  referenceOnly?: boolean;
  /** Independently reusable assembly produced by the lesson. */
  assemblyOutputId?: string;
  note?: { type: "warning" | "tip"; text: string };
}

export interface PracticalProject {
  id: string;
  number: number;
  title: string;
  description: string;
  objective: string;
  difficulty?: Difficulty;
  buildMinutes?: number;
  components: string[];
  safetyNote?: string;
  relatedModuleIds: string[];
  steps: PracticalStep[];
  troubleshooting: { question: string; answer: string }[];
}

export type QuizQuestionType = "multiple-choice" | "true-false" | "short-answer";

export interface QuizQuestion {
  id: string;
  type: QuizQuestionType;
  prompt: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  concept: string;
}

export interface QuizAnswerResult {
  questionId: string;
  answer: string;
  correct: boolean;
}

export interface QuizAttempt {
  id: string;
  lessonId: string;
  lessonTitle: string;
  score: number;
  total: number;
  percentage: number;
  takenAt: string;
  results: QuizAnswerResult[];
  strengths: string[];
  review: string[];
}

export interface PracticalGrade {
  id: string;
  projectId: string;
  projectTitle: string;
  total: number;
  breakdown: {
    assembly: number;
    components: number;
    functionality: number;
    explanation: number;
  };
  strengths: string[];
  issues: string[];
  improvements: string[];
  recommendedModuleIds: string[];
  gradedAt: string;
}

export interface StudentProgress {
  studentName: string;
  completedLessonIds: string[];
  lastTheoryPageByModule: Record<string, number>;
  completedStepIds: string[];
  /** Unmapped historic Step 7/8 completion records, retained without auto-certification. */
  legacyStepCompletionIds?: string[];
  quizAttempts: QuizAttempt[];
  practicalGrades: PracticalGrade[];
}

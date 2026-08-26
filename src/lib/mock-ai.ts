import type {
  PracticalGrade,
  PracticalProject,
  QuizAnswerResult,
  QuizAttempt,
  QuizQuestion,
  TheoryLesson,
} from "@/types/learning";

/**
 * SIMULATED AI LAYER
 * ------------------
 * Everything in this file is deterministic frontend mock logic. Each exported
 * function is async and shaped like a real API call, so it can later be
 * replaced by a real (multimodal) AI request without touching the UI.
 */

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export async function generateQuiz(lesson: TheoryLesson): Promise<QuizQuestion[]> {
  await wait(2200);
  const objective = lesson.objectives[0] ?? "the lesson topic";
  const secondObjective = lesson.objectives[1] ?? objective;

  return [
    {
      id: `${lesson.id}-q1`,
      type: "multiple-choice",
      prompt: `Which statement best describes "${lesson.concept.title}"?`,
      options: [
        lesson.concept.body,
        "It only matters when the robot is switched off.",
        "It is a naming convention with no practical effect.",
        "It applies to software but never to hardware.",
      ],
      correctAnswer: lesson.concept.body,
      explanation: `${lesson.concept.title}: ${lesson.concept.body}`,
      concept: lesson.concept.title,
    },
    {
      id: `${lesson.id}-q2`,
      type: "multiple-choice",
      prompt: `In "${lesson.title}", what is the main reason this topic matters when building a robot?`,
      options: [
        "It helps you predict how the robot will behave before you test it.",
        "It makes the robot look more professional.",
        "It reduces the number of components you need to buy.",
        "It is only required for written examinations.",
      ],
      correctAnswer: "It helps you predict how the robot will behave before you test it.",
      explanation:
        "Theory is useful when it lets you predict behaviour. If you can predict it, you can debug it quickly on the bench.",
      concept: lesson.title,
    },
    {
      id: `${lesson.id}-q3`,
      type: "true-false",
      prompt: `True or false: after this lesson you should be able to ${objective.toLowerCase()}.`,
      options: ["True", "False"],
      correctAnswer: "True",
      explanation: `That is exactly the first learning objective of this lesson: ${objective}.`,
      concept: "Learning objectives",
    },
    {
      id: `${lesson.id}-q4`,
      type: "true-false",
      prompt:
        "True or false: a worked example is only useful once you have memorised every definition in the lesson.",
      options: ["True", "False"],
      correctAnswer: "False",
      explanation:
        "Examples build understanding. Working through an example first often makes the definitions obvious afterwards.",
      concept: "Study method",
    },
    {
      id: `${lesson.id}-q5`,
      type: "short-answer",
      prompt: `In one or two sentences, explain in your own words how "${lesson.example.title}" demonstrates the idea from this lesson.`,
      correctAnswer: lesson.example.body,
      explanation: `A strong answer connects the example to the concept: ${lesson.example.body}`,
      concept: secondObjective,
    },
  ];
}

export interface QuizGradingInput {
  lesson: TheoryLesson;
  questions: QuizQuestion[];
  answers: Record<string, string>;
}

export async function gradeQuiz({
  lesson,
  questions,
  answers,
}: QuizGradingInput): Promise<QuizAttempt> {
  await wait(1400);

  const results: QuizAnswerResult[] = questions.map((q) => {
    const answer = (answers[q.id] ?? "").trim();
    let correct: boolean;
    if (q.type === "short-answer") {
      // Simulated AI judgement: a substantive answer is accepted.
      correct = answer.split(/\s+/).filter(Boolean).length >= 8;
    } else {
      correct = answer === q.correctAnswer;
    }
    return { questionId: q.id, answer, correct };
  });

  const score = results.filter((r) => r.correct).length;
  const strengths = questions
    .filter((q) => results.find((r) => r.questionId === q.id)?.correct)
    .map((q) => q.concept);
  const review = questions
    .filter((q) => !results.find((r) => r.questionId === q.id)?.correct)
    .map((q) => q.concept);

  return {
    id: `qa-${Date.now()}`,
    lessonId: lesson.id,
    lessonTitle: lesson.title,
    score,
    total: questions.length,
    percentage: Math.round((score / questions.length) * 100),
    takenAt: new Date().toISOString(),
    results,
    strengths: strengths.length ? unique(strengths) : ["You completed the full quiz without skipping."],
    review: review.length ? unique(review) : ["No concepts need review — you are ready to continue."],
  };
}

export interface PracticalGradingInput {
  project: PracticalProject;
  completedSteps: number;
  totalSteps: number;
  explanation: string;
  hasEvidence: boolean;
}

export async function gradePractical({
  project,
  completedSteps,
  totalSteps,
  explanation,
  hasEvidence,
}: PracticalGradingInput): Promise<PracticalGrade> {
  // Replace this call with a real multimodal request (image/video + text).
  await wait(2600);

  const completion = totalSteps ? completedSteps / totalSteps : 0;
  const words = explanation.trim().split(/\s+/).filter(Boolean).length;

  const assembly = Math.round(30 * completion);
  const components = Math.round(25 * (hasEvidence ? Math.max(0.6, completion) : 0.4));
  const functionality = Math.round(25 * (hasEvidence ? Math.max(0.55, completion) : 0.35));
  const explanationScore = Math.min(20, Math.round((words / 60) * 20));

  const total = assembly + components + functionality + explanationScore;

  const strengths: string[] = [];
  const issues: string[] = [];
  const improvements: string[] = [];

  if (completion >= 0.9) strengths.push("All building steps were completed and checked off in order.");
  else if (completion >= 0.5) strengths.push("A solid part of the build is finished and documented.");
  if (hasEvidence) strengths.push("Clear evidence was provided, which makes the assembly easy to review.");
  if (words >= 40) strengths.push("Your explanation describes the robot's behaviour in your own words.");
  if (!strengths.length) strengths.push("You submitted the project — that is the first step to feedback.");

  if (completion < 1) issues.push(`${totalSteps - completedSteps} building step(s) are still unchecked.`);
  if (!hasEvidence) issues.push("No photo or video was selected, so assembly quality could not be assessed.");
  if (words < 40) issues.push("The written explanation is short and misses the sense–think–act reasoning.");
  if (!issues.length) issues.push("No significant issues detected in this demonstration review.");

  improvements.push("Describe what the robot senses, decides and does, in that order.");
  improvements.push("Show the wiring area clearly in your photo so connections can be checked.");
  if (completion < 1) improvements.push("Finish and verify the remaining steps before resubmitting.");

  return {
    id: `pg-${Date.now()}`,
    projectId: project.id,
    projectTitle: project.title,
    total,
    breakdown: { assembly, components, functionality, explanation: explanationScore },
    strengths,
    issues,
    improvements,
    recommendedModuleIds: project.relatedModuleIds,
    gradedAt: new Date().toISOString(),
  };
}

function unique(values: string[]) {
  return Array.from(new Set(values));
}

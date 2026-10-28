/**
 * BE STEM READY Quiz Studio — Acceleration Car pilot.
 * Each bank item is grounded in the relevant teaching objective. Final page-level
 * slide references are deliberately omitted until the lecture PDF is verified.
 */
export type GearDiagram = "large-to-small" | "small-to-large";
export type QuizTopic = "gear-basics" | "gear-speed" | "gear-comparison" | "simple-maths" | "experiment";

export interface QuizQuestion {
  id: string;
  topic: QuizTopic;
  prompt: string;
  choices: readonly [string, string, string, string];
  correctIndex: number;
  /** Verified 1-based page of this project’s Learning PDF. */
  learningSlide: number;
  explanation: string;
  hint: string;
  diagram?: GearDiagram;
}

export interface QuizBank {
  projectId: string;
  title: string;
  questions: readonly QuizQuestion[];
}

const accelerationCarQuestions: QuizQuestion[] = [
  {
    id: "ac-01", learningSlide: 7, topic: "gear-basics", prompt: "What do gears help a robot do?",
    choices: ["Store electricity", "Transfer movement", "Make electricity", "Measure movement"],
    correctIndex: 1,
    explanation: "Gears pass movement from one rotating part to another.",
    hint: "Imagine turning one gear with your hand. What happens to a gear touching it?",
  },
  {
    id: "ac-02", learningSlide: 9, topic: "gear-basics", prompt: "What do we call the gear that starts the movement?",
    choices: ["Driving gear", "Driven gear", "Idler gear", "Support wheel"],
    correctIndex: 0,
    explanation: "The driving gear starts the motion. The driven gear receives it.",
    hint: "Think about which gear is connected to the part making the first turn.",
  },
  {
    id: "ac-03", learningSlide: 6, topic: "gear-speed", prompt: "The big gear A turns the small gear B. Which one turns faster?",
    choices: ["Big gear A", "Small gear B", "Both turn at the same speed", "Neither gear turns"],
    correctIndex: 1, diagram: "large-to-small",
    explanation: "When a bigger gear drives a smaller gear, the smaller gear spins faster.",
    hint: "A small gear has fewer teeth. Think about how many turns it makes while the big gear turns once.",
  },
  {
    id: "ac-04", learningSlide: 6, topic: "gear-speed", prompt: "The small gear A turns the big gear B. What happens to the big gear?",
    choices: ["It turns faster", "It turns slower", "It turns at the same speed", "It stops moving"],
    correctIndex: 1, diagram: "small-to-large",
    explanation: "A bigger driven gear turns more slowly than the smaller driving gear.",
    hint: "The big gear needs more teeth to pass the touching point during one full turn.",
  },
  {
    id: "ac-05", learningSlide: 11, topic: "gear-comparison", prompt: "Two same-sized gears turn each other. Which turns faster?",
    choices: ["The first gear", "The second gear", "Both turn at the same speed", "Neither gear can turn"],
    correctIndex: 2,
    explanation: "Gears with the same number of teeth turn at the same speed, in opposite directions.",
    hint: "Picture two wheels of equal size connected by their teeth.",
  },
  {
    id: "ac-06", learningSlide: 6, topic: "gear-comparison", prompt: "Which pair makes the second gear turn faster?",
    choices: ["Small gear drives a big gear", "Big gear drives a small gear", "Same-sized gears mesh", "A big gear drives an equally big gear"],
    correctIndex: 1,
    explanation: "A large driving gear makes a smaller driven gear rotate faster.",
    hint: "Compare how far a big gear's teeth travel during one turn with a small gear's teeth.",
  },
  {
    id: "ac-07", learningSlide: 10, topic: "simple-maths", prompt: "Gear A has 10 teeth. Gear B has 20 teeth. How many times as many teeth does B have?",
    choices: ["The same number", "Twice as many", "Three times as many", "Four times as many"],
    correctIndex: 1,
    explanation: "Twenty is twice ten, so Gear B has two times as many teeth.",
    hint: "How many groups of ten can you count in twenty?",
  },
  {
    id: "ac-08", learningSlide: 11, topic: "simple-maths", prompt: "A driving gear has 10 teeth and a driven gear has 20. What is 20 divided by 10?",
    choices: ["1", "2", "3", "4"],
    correctIndex: 1,
    explanation: "Twenty divided by ten equals two. This is the gear ratio using our lesson's formula.",
    hint: "How many tens fit inside twenty?",
  },
  {
    id: "ac-09", learningSlide: 13, topic: "experiment", prompt: "Which is listed as an assembly requirement for the Acceleration Car?",
    choices: ["Use exactly four gears", "Use only large wheels", "Build a stable structure", "Keep the motor at one fixed speed"],
    correctIndex: 2,
    explanation: "The lesson asks students to make the model stable before they test it.",
    hint: "Think about what would help the assembled model stay together as it moves.",
  },
  {
    id: "ac-10", learningSlide: 16, topic: "experiment", prompt: "How can you test what happens when gear sizes change?",
    choices: ["Change a gear and watch what happens", "Remove all the gears and stop", "Keep the gears still", "Change two parts without watching"],
    correctIndex: 0,
    explanation: "Change one gear, run the model, and observe how the movement changes.",
    hint: "A good experiment changes something, then checks the result.",
  },
];

export const quizBanks: Readonly<Record<string, QuizBank>> = {
  "acceleration-car": {
    projectId: "acceleration-car",
    title: "Acceleration Car",
    questions: accelerationCarQuestions,
  },
};

export const QUIZ_QUESTION_COUNT = 5;
export const QUIZ_PASS_COUNT = 4;

export function getQuizBank(projectId: string): QuizBank | undefined {
  return quizBanks[projectId];
}

/** One question per learning objective. On immediate retry prefer its paired, unseen question. */
export function selectQuizQuestions(
  bank: QuizBank,
  lastQuestionIds: readonly string[] = [],
  random: () => number = Math.random,
): QuizQuestion[] {
  const topics = [...new Set(bank.questions.map(question => question.topic))];
  if (topics.length !== QUIZ_QUESTION_COUNT) {
    throw new Error("Quiz bank must cover five learning objectives.");
  }
  const chosen = topics.map(topic => {
    const group = bank.questions.filter(question => question.topic === topic);
    const fresh = group.filter(question => !lastQuestionIds.includes(question.id));
    const choices = fresh.length > 0 ? fresh : group;
    return choices[Math.floor(Math.min(Math.max(random(), 0), 0.999999) * choices.length)]!;
  });
  for (let index = chosen.length - 1; index > 0; index--) {
    const other = Math.floor(Math.min(Math.max(random(), 0), 0.999999) * (index + 1));
    [chosen[index], chosen[other]] = [chosen[other]!, chosen[index]!];
  }
  return chosen;
}

export interface QuizDraft {
  questionIds: string[];
  answers: Record<string, number>;
  currentIndex: number;
}

export interface QuizSavedState {
  bestScore: number | null;
  lastQuestionIds: string[];
  draft: QuizDraft | null;
}

export function blankQuizState(): QuizSavedState {
  return { bestScore: null, lastQuestionIds: [], draft: null };
}

function storageKey(projectId: string) {
  return "bsr.quiz-studio.v1:" + projectId;
}

/** Only read on the client. Invalid/old browser data is ignored safely. */
export function readQuizSavedState(projectId: string): QuizSavedState {
  const bank = getQuizBank(projectId);
  if (typeof window === "undefined" || !bank) return blankQuizState();
  try {
    const raw = window.localStorage.getItem(storageKey(projectId));
    if (!raw) return blankQuizState();
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== "object") return blankQuizState();
    const record = value as Record<string, unknown>;
    const validIds = new Set(bank.questions.map(q => q.id));
    const bestScore = typeof record.bestScore === "number" && Number.isInteger(record.bestScore)
      && record.bestScore >= 0 && record.bestScore <= QUIZ_QUESTION_COUNT ? record.bestScore : null;
    const lastQuestionIds = Array.isArray(record.lastQuestionIds)
      ? record.lastQuestionIds.filter((id): id is string => typeof id === "string" && validIds.has(id))
      : [];
    let draft: QuizDraft | null = null;
    const saved = record.draft;
    if (saved && typeof saved === "object") {
      const candidate = saved as Record<string, unknown>;
      const questionIds = candidate.questionIds;
      const savedAnswers = candidate.answers;
      const currentIndex = candidate.currentIndex;
      if (Array.isArray(questionIds) && questionIds.length === QUIZ_QUESTION_COUNT
        && questionIds.every(id => typeof id === "string" && validIds.has(id))
        && new Set(questionIds).size === QUIZ_QUESTION_COUNT
        && savedAnswers && typeof savedAnswers === "object"
        && typeof currentIndex === "number" && Number.isInteger(currentIndex)
        && currentIndex >= 0 && currentIndex < QUIZ_QUESTION_COUNT) {
        const answers: Record<string, number> = {};
        for (const id of questionIds as string[]) {
          const answer = (savedAnswers as Record<string, unknown>)[id];
          if (typeof answer === "number" && Number.isInteger(answer) && answer >= 0 && answer <= 3) {
            answers[id] = answer;
          }
        }
        draft = { questionIds: [...questionIds], answers, currentIndex };
      }
    }
    return { bestScore, lastQuestionIds, draft };
  } catch {
    return blankQuizState();
  }
}

/** Returns false if storage is blocked or full. UI should warn rather than promise a save. */
export function writeQuizSavedState(projectId: string, state: QuizSavedState): boolean {
  if (typeof window === "undefined" || !getQuizBank(projectId)) return false;
  try {
    window.localStorage.setItem(storageKey(projectId), JSON.stringify(state));
    window.dispatchEvent(new CustomEvent("bsr-quiz-saved", { detail: projectId }));
    return true;
  } catch {
    return false;
  }
}

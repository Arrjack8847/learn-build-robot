import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  CircleX,
  LoaderCircle,
  RefreshCcw,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useProgress } from "@/context/ProgressContext";
import { generateQuiz, gradeQuiz } from "@/lib/mock-ai";
import type { QuizAttempt, QuizQuestion, TheoryLesson } from "@/types/learning";

type QuizStage = "idle" | "generating" | "answering" | "grading" | "results";

export function QuizExperience({ lesson }: { lesson: TheoryLesson }) {
  const { addQuizAttempt } = useProgress();
  const [stage, setStage] = useState<QuizStage>("idle");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null);
  const [error, setError] = useState<string | null>(null);

  const currentQuestion = questions[currentIndex];
  const currentAnswer = currentQuestion ? (answers[currentQuestion.id] ?? "") : "";
  const currentAnswered = currentAnswer.trim().length > 0;

  async function handleGenerate() {
    setError(null);
    setStage("generating");
    try {
      const generated = await generateQuiz(lesson);
      setQuestions(generated);
      setAnswers({});
      setCurrentIndex(0);
      setAttempt(null);
      setStage("answering");
    } catch {
      setError("The quiz could not be generated. Please try again.");
      setStage("idle");
    }
  }

  async function handleSubmit() {
    if (!currentAnswered) return;
    setError(null);
    setStage("grading");
    try {
      const gradedAttempt = await gradeQuiz({ lesson, questions, answers });
      addQuizAttempt(gradedAttempt);
      setAttempt(gradedAttempt);
      setStage("results");
    } catch {
      setError("Your answers could not be graded. Please try submitting again.");
      setStage("answering");
    }
  }

  function handleRetry() {
    setAnswers({});
    setCurrentIndex(0);
    setAttempt(null);
    setError(null);
    setStage("answering");
  }

  function handleCloseResults() {
    setAttempt(null);
    setError(null);
    setStage("idle");
  }

  if (stage === "idle") {
    return (
      <section
        aria-labelledby="quiz-heading"
        className="scroll-mt-6 rounded-3xl border border-primary/20 bg-primary-soft/50 p-6 shadow-card sm:p-8"
        id="lesson-quiz"
      >
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground">
              <BrainCircuit aria-hidden="true" className="size-6" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                Simulated AI
              </p>
              <h2 id="quiz-heading" className="mt-1 text-xl font-bold">
                Check your understanding
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                Generate a five-question quiz from this lesson. Your result and feedback will be
                saved to your progress on this device.
              </p>
            </div>
          </div>
          <Button className="min-h-11 shrink-0 rounded-xl px-5" onClick={handleGenerate}>
            <Sparkles aria-hidden="true" />
            Generate AI quiz
          </Button>
        </div>
        {error ? <p className="mt-4 text-sm font-medium text-destructive">{error}</p> : null}
      </section>
    );
  }

  if (stage === "generating" || stage === "grading") {
    const grading = stage === "grading";
    return (
      <section
        aria-labelledby="quiz-loading-heading"
        aria-live="polite"
        className="scroll-mt-6 rounded-3xl border bg-card p-8 text-center shadow-card sm:p-12"
        id="lesson-quiz"
      >
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-primary-soft text-primary">
          <LoaderCircle aria-hidden="true" className="size-7 animate-spin" />
        </span>
        <h2 id="quiz-loading-heading" className="mt-5 text-xl font-bold">
          {grading ? "Reviewing your answers" : "Creating your quiz"}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {grading
            ? "The simulated AI is preparing your score and learning feedback."
            : "The simulated AI is turning this lesson into five focused questions."}
        </p>
      </section>
    );
  }

  if (stage === "results" && attempt) {
    return (
      <QuizResults
        attempt={attempt}
        onClose={handleCloseResults}
        onRetry={handleRetry}
        questions={questions}
      />
    );
  }

  if (!currentQuestion) {
    return (
      <section className="rounded-3xl border bg-card p-8 text-center shadow-card" id="lesson-quiz">
        <h2 className="text-xl font-bold">Quiz unavailable</h2>
        <p className="mt-2 text-sm text-muted-foreground">No questions were generated.</p>
        <Button className="mt-5" onClick={handleGenerate}>
          Try again
        </Button>
      </section>
    );
  }

  const isLastQuestion = currentIndex === questions.length - 1;
  const quizPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  return (
    <section
      aria-labelledby="quiz-question-heading"
      className="scroll-mt-6 rounded-3xl border bg-card p-6 shadow-card sm:p-8"
      id="lesson-quiz"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            Knowledge check
          </p>
          <p className="mt-1 text-sm font-semibold text-muted-foreground">
            Question {currentIndex + 1} of {questions.length}
          </p>
        </div>
        <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-muted-foreground">
          {questionTypeLabel(currentQuestion)}
        </span>
      </div>
      <Progress aria-label={`${quizPercent}% through the quiz`} className="mt-4" value={quizPercent} />

      <div className="mt-8">
        <h2 id="quiz-question-heading" className="text-xl font-bold leading-8 sm:text-2xl">
          {currentQuestion.prompt}
        </h2>
        <QuestionAnswer
          answer={currentAnswer}
          onAnswer={(answer) =>
            setAnswers((previous) => ({ ...previous, [currentQuestion.id]: answer }))
          }
          question={currentQuestion}
        />
      </div>

      {error ? <p className="mt-5 text-sm font-medium text-destructive">{error}</p> : null}

      <div className="mt-8 flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-between">
        <Button
          className="min-h-11 rounded-xl"
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex((index) => Math.max(0, index - 1))}
          variant="outline"
        >
          <ArrowLeft aria-hidden="true" />
          Previous
        </Button>
        {isLastQuestion ? (
          <Button
            className="min-h-11 rounded-xl px-6"
            disabled={!currentAnswered}
            onClick={handleSubmit}
          >
            Submit quiz
            <CheckCircle2 aria-hidden="true" />
          </Button>
        ) : (
          <Button
            className="min-h-11 rounded-xl px-6"
            disabled={!currentAnswered}
            onClick={() => setCurrentIndex((index) => Math.min(questions.length - 1, index + 1))}
          >
            Next question
            <ArrowRight aria-hidden="true" />
          </Button>
        )}
      </div>
    </section>
  );
}

function QuestionAnswer({
  question,
  answer,
  onAnswer,
}: {
  question: QuizQuestion;
  answer: string;
  onAnswer: (answer: string) => void;
}) {
  if (question.type === "short-answer") {
    return (
      <div className="mt-6">
        <label className="text-sm font-semibold" htmlFor={`${question.id}-answer`}>
          Your answer
        </label>
        <Textarea
          className="mt-2 min-h-32 rounded-xl bg-background p-4 leading-6"
          id={`${question.id}-answer`}
          onChange={(event) => onAnswer(event.target.value)}
          placeholder="Explain the connection in one or two sentences…"
          value={answer}
        />
        <p className="mt-2 text-xs text-muted-foreground">
          Write at least one complete sentence so the simulated AI has enough detail to assess.
        </p>
      </div>
    );
  }

  return (
    <RadioGroup
      aria-labelledby="quiz-question-heading"
      className="mt-6 gap-3"
      onValueChange={onAnswer}
      value={answer}
    >
      {question.options?.map((option, index) => {
        const optionId = `${question.id}-option-${index}`;
        return (
          <div
            className={`flex items-start gap-3 rounded-xl border p-4 transition ${
              answer === option ? "border-primary bg-primary-soft" : "hover:border-primary/30"
            }`}
            key={option}
          >
            <RadioGroupItem className="mt-0.5 shrink-0" id={optionId} value={option} />
            <label className="cursor-pointer text-sm leading-6" htmlFor={optionId}>
              {option}
            </label>
          </div>
        );
      })}
    </RadioGroup>
  );
}

function QuizResults({
  attempt,
  questions,
  onRetry,
  onClose,
}: {
  attempt: QuizAttempt;
  questions: QuizQuestion[];
  onRetry: () => void;
  onClose: () => void;
}) {
  const strongScore = attempt.percentage >= 80;

  return (
    <section
      aria-labelledby="quiz-results-heading"
      aria-live="polite"
      className="scroll-mt-6 space-y-6 rounded-3xl border bg-card p-6 shadow-card sm:p-8"
      id="lesson-quiz"
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <span
          className={`grid size-24 shrink-0 place-items-center rounded-full text-2xl font-bold ${
            strongScore ? "bg-success-soft text-success" : "bg-warning-soft text-warning"
          }`}
        >
          {attempt.percentage}%
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            Quiz complete
          </p>
          <h2 id="quiz-results-heading" className="mt-1 text-2xl font-bold">
            {strongScore ? "Strong understanding" : "Good start — keep reviewing"}
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            You answered {attempt.score} of {attempt.total} questions correctly. This simulated AI
            result is now saved in your progress.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FeedbackList
          icon={CheckCircle2}
          items={attempt.strengths}
          title="Strengths"
          tone="success"
        />
        <FeedbackList icon={RefreshCcw} items={attempt.review} title="Concepts to review" tone="warning" />
      </div>

      <div>
        <h3 className="text-lg font-bold">Answer review</h3>
        <div className="mt-4 space-y-3">
          {attempt.results.map((result, index) => {
            const question = questions.find((item) => item.id === result.questionId);
            if (!question) return null;

            return (
              <article
                className={`rounded-2xl border p-5 ${
                  result.correct ? "border-success/25 bg-success-soft/40" : "border-destructive/20"
                }`}
                key={result.questionId}
              >
                <div className="flex items-start gap-3">
                  {result.correct ? (
                    <CheckCircle2 aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-success" />
                  ) : (
                    <CircleX aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-destructive" />
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-bold">
                      {index + 1}. {question.prompt}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      <span className="font-semibold text-foreground">Your answer:</span>{" "}
                      {result.answer}
                    </p>
                    {!result.correct ? (
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">
                        <span className="font-semibold text-foreground">
                          {question.type === "short-answer" ? "Example answer:" : "Correct answer:"}
                        </span>{" "}
                        {question.correctAnswer}
                      </p>
                    ) : null}
                    <p className="mt-3 border-t pt-3 text-sm leading-6 text-muted-foreground">
                      {question.explanation}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">
        <Button className="min-h-11 rounded-xl" onClick={onClose} variant="outline">
          Return to lesson
        </Button>
        <Button className="min-h-11 rounded-xl" onClick={onRetry}>
          <RefreshCcw aria-hidden="true" />
          Retry quiz
        </Button>
      </div>
    </section>
  );
}

function FeedbackList({
  title,
  items,
  icon: Icon,
  tone,
}: {
  title: string;
  items: string[];
  icon: typeof CheckCircle2;
  tone: "success" | "warning";
}) {
  return (
    <article
      className={`rounded-2xl p-5 ${
        tone === "success" ? "bg-success-soft text-success" : "bg-warning-soft text-warning"
      }`}
    >
      <div className="flex items-center gap-2">
        <Icon aria-hidden="true" className="size-5" />
        <h3 className="font-bold">{title}</h3>
      </div>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-foreground">
        {items.map((item) => (
          <li className="flex gap-2" key={item}>
            <span aria-hidden="true">•</span>
            {item}
          </li>
        ))}
      </ul>
    </article>
  );
}

function questionTypeLabel(question: QuizQuestion) {
  if (question.type === "multiple-choice") return "Multiple choice";
  if (question.type === "true-false") return "True or false";
  return "Short answer";
}

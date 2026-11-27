import {J12345Assessment} from "@/components/j5/J12345Assessment";
import { useEffect, useRef, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeft, BookOpen, CheckCircle2, ChevronLeft, ChevronRight, ClipboardCheck,
  DoorOpen, Lightbulb, Play, RefreshCw, Trophy, XCircle,
} from "lucide-react";
import { quizSyncEnabled, startServerQuiz, submitServerQuiz, LmsError, type ServerQuizQuestion, type ServerQuizResult } from "@/lib/wix-lms";
import { getProject } from "@/data/practical";
import { LEVEL_ONE_BUILDING_PDF_LEARNING_FALLBACK_IDS } from "@/data/levelOneLectures";
import {
  blankQuizState, getQuizBank, QUIZ_PASS_COUNT, QUIZ_QUESTION_COUNT,
  readQuizSavedState, selectQuizQuestions, writeQuizSavedState,
  type GearDiagram, type QuizDraft, type QuizQuestion, type QuizSavedState,
} from "@/data/quizStudio";

export const Route = createFileRoute("/quiz/$projectId")({
  component: QuizStudioPage,
});

type Stage = "loading" | "welcome" | "resume" | "question" | "review" | "results";
type Modal = "leave" | "restart" | null;
type AttemptResult = { score: number; questions: QuizQuestion[]; answers: Record<string, number> };

const primaryButton = "inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-[#168eea] px-5 py-3 text-sm font-extrabold text-white transition hover:bg-[#0c77c8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#168eea]";
const secondaryButton = "inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-sky-200 bg-white px-5 py-3 text-sm font-extrabold text-[#168eea] transition hover:bg-sky-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#168eea]";

function QuizStudioPage() {
  const { projectId } = Route.useParams();
  return import.meta.env["VITE_J5_PRIVATE_UI"]==="true"?<J12345Assessment key={projectId} mode="quiz" projectId={projectId}/>:<QuizSession key={projectId} projectId={projectId}/>;
}

function QuizSession({projectId}:{projectId:string}) {
  const project = getProject(projectId);
  const bank = getQuizBank(projectId);
  const [stage, setStage] = useState<Stage>("loading");
  const [record, setRecord] = useState<QuizSavedState>(blankQuizState);
  const [draft, setDraft] = useState<QuizDraft | null>(null);
  const [result, setResult] = useState<AttemptResult | null>(null);
  const [modal, setModal] = useState<Modal>(null);
  const [hintQuestion, setHintQuestion] = useState<string | null>(null);
  const [saveFailed, setSaveFailed] = useState(false);
  const [serverQuestions,setServerQuestions]=useState<ServerQuizQuestion[]>([]);
  const [busy,setBusy]=useState(false);
  const [serverError,setServerError]=useState("");
  const running=useRef(false);
  const attemptId=useRef<string|null>(null);
  const pendingStart=useRef<string|null>(null);
  const submittedAnswers=useRef<Record<string,number>|null>(null);
  const mounted=useRef(false);
  useEffect(()=>{mounted.current=true;return()=>{mounted.current=false;};},[]);
  function errorMessage(e:unknown){
    if(e instanceof LmsError){
      if(e.status===401)return "Sign in to take a saved quiz.";
      if(e.code==="LEVEL_LOCKED")return "This level is locked.";
      if(e.code==="STUDENT_NOT_INITIALIZED")return "Open your student dashboard to initialize your account.";
      if(e.code==="QUIZ_NOT_AVAILABLE")return "This quiz is not imported into Wix yet.";
    }
    return "Could not confirm the quiz with Wix. Retry the same action.";
  }
  function showServerResult(r:ServerQuizResult){
    setResult({score:r.correctCount,questions:r.review.map(({diagram,...q})=>({...q,...(diagram?{diagram}:{})})),answers:Object.fromEntries(r.review.map(q=>[q.id,q.selectedIndex]))});
    setDraft(null);setModal(null);setStage("results");
    submittedAnswers.current=null;
  }

  useEffect(() => {
    const stored = quizSyncEnabled ? blankQuizState() : readQuizSavedState(projectId);
    setRecord(stored);
    setDraft(stored.draft);
    setResult(null);
    setHintQuestion(null);
    setStage(stored.draft ? "resume" : "welcome");
  }, [projectId]);

  if (!bank || !project) {
    return (
      <main className="grid min-h-[100dvh] place-items-center bg-[#f3faff] px-5 text-center text-[#132654]">
        <div>
          <h1 className="text-2xl font-black">Quiz not available yet</h1>
          <p className="mt-3 text-sm text-slate-600">This project’s questions and Learning-slide references are being reviewed.</p>
          <Link className={primaryButton + " mt-5"} to="/practical/levels">Explore levels</Link>
        </div>
      </main>
    );
  }

  function persist(next: QuizSavedState) {
    setRecord(next);
    setDraft(next.draft);
    if(!quizSyncEnabled)setSaveFailed(!writeQuizSavedState(projectId, next));
  }

  async function startNewAttempt() {
    if(quizSyncEnabled){
      if(running.current)return;
      running.current=true;setBusy(true);setServerError("");
      try{
        const id=pendingStart.current ?? crypto.randomUUID();pendingStart.current=id;
        const r=await startServerQuiz(projectId,id);
        if(!mounted.current)return;
        pendingStart.current=null;attemptId.current=id;submittedAnswers.current=null;
        if(r.state==="submitted"){showServerResult(r.result);return;}
        setServerQuestions(r.questions);
        persist({...blankQuizState(),draft:{questionIds:r.questions.map(q=>q.id),answers:{},currentIndex:0}});
        setResult(null);setHintQuestion(null);setModal(null);setStage("question");
      }catch(e){if(mounted.current)setServerError(errorMessage(e));}
      finally{running.current=false;if(mounted.current)setBusy(false);}
      return;
    }
    const selection = selectQuizQuestions(bank!, record.lastQuestionIds);
    const nextDraft: QuizDraft = {
      questionIds: selection.map(item => item.id),
      answers: {},
      currentIndex: 0,
    };
    persist({ ...record, draft: nextDraft });
    setResult(null);
    setHintQuestion(null);
    setModal(null);
    setStage("question");
  }

  function continueAttempt() {
    if (!draft) return;
    setHintQuestion(null);
    setStage("question");
  }

  function changeAnswer(questionId: string, answer: number) {
    if (!draft || answer < 0 || answer > 3 || (quizSyncEnabled && (running.current || submittedAnswers.current))) return;
    persist({ ...record, draft: { ...draft, answers: { ...draft.answers, [questionId]: answer } } });
  }

  function goToQuestion(index: number) {
    if (!draft || index < 0 || index >= QUIZ_QUESTION_COUNT) return;
    persist({ ...record, draft: { ...draft, currentIndex: index } });
    setHintQuestion(null);
    setStage("question");
  }

  async function submitAttempt() {
    if (!draft) return;
    if(quizSyncEnabled){
      if(running.current||!attemptId.current||draft.questionIds.some(id=>!Object.prototype.hasOwnProperty.call(draft.answers,id)))return;
      running.current=true;setBusy(true);setServerError("");
      try{
        const answers=submittedAnswers.current??{...draft.answers};submittedAnswers.current=answers;
        const r=await submitServerQuiz(projectId,attemptId.current,answers);
        if(mounted.current)showServerResult(r);
      }catch(e){if(mounted.current)setServerError(errorMessage(e));}
      finally{running.current=false;if(mounted.current)setBusy(false);}
      return;
    }
    const questions = draft.questionIds.map(id => bank!.questions.find(item => item.id === id));
    if (questions.some(question => !question) || draft.questionIds.some(id => !Object.prototype.hasOwnProperty.call(draft.answers, id))) return;
    const selected = questions as QuizQuestion[];
    const score = selected.filter(question => draft.answers[question.id] === question.correctIndex).length;
    setResult({ score, questions: selected, answers: { ...draft.answers } });
    persist({
      bestScore: Math.max(record.bestScore ?? 0, score),
      lastQuestionIds: [...draft.questionIds],
      draft: null,
    });
    setStage("results");
  }

  const currentId = draft?.questionIds[draft.currentIndex];
  const currentQuestion = (quizSyncEnabled ? serverQuestions : bank.questions).find(item => item.id === currentId);
  const answeredCount = draft ? draft.questionIds.filter(id => Object.prototype.hasOwnProperty.call(draft.answers, id)).length : 0;
  const allAnswered = Boolean(draft && answeredCount === QUIZ_QUESTION_COUNT);
  const incorrect = result?.questions.filter(q => result.answers[q.id] !== q.correctIndex) ?? [];
  const correct = result?.questions.filter(q => result.answers[q.id] === q.correctIndex) ?? [];

  return (
    <div className="flex h-[100dvh] min-h-0 flex-col overflow-hidden bg-[#f3faff] text-[#132654]">
      <header className="z-10 flex shrink-0 items-center justify-between gap-2 border-b border-sky-100 bg-white px-3 py-2 sm:px-6">
        {stage === "question" || stage === "review" ? (
          <button type="button" onClick={() => setModal("leave")} disabled={busy} aria-label="Leave quiz" className={secondaryButton + " !px-3"}>
            <ArrowLeft className="size-4" aria-hidden="true"/> <span className="hidden sm:inline">Exit</span>
          </button>
        ) : (
          <Link to="/projects/$projectId" params={{ projectId }} className={secondaryButton + " !px-3"}>
            <ArrowLeft className="size-4" aria-hidden="true"/> <span className="hidden sm:inline">Project</span>
          </Link>
        )}
        <div className="min-w-0 flex-1 text-center">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#168eea]">Level {project.level} · Quiz Studio</p>
          <h1 className="truncate text-sm font-black sm:text-base">{bank.title}</h1>
        </div>
        <span className="rounded-full bg-[#eaf5ff] px-3 py-1 text-xs font-extrabold text-[#168eea]">5 Questions</span>
      </header>

      {quizSyncEnabled && <p className="shrink-0 bg-sky-50 px-3 py-1 text-center text-xs text-slate-700">Wix quiz preview · Results saved on submission. Unfinished answers stay in this open page only.</p>}
      {serverError && <p role="alert" className="shrink-0 bg-rose-50 px-3 py-2 text-center text-xs font-bold text-rose-800">{serverError} <a className="underline" href="/student/dashboard">Student dashboard</a></p>}
      {saveFailed ? (
        <p role="alert" className="shrink-0 bg-amber-50 px-4 py-2 text-center text-xs font-bold text-amber-900">
          This browser blocked saving. Your quiz may not resume after closing the page.
        </p>
      ) : null}

      <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-4 sm:px-6 sm:py-6" aria-label="Quiz content">
        <div className="mx-auto w-full max-w-3xl">
          {stage === "loading" ? (
            <p role="status" className="py-12 text-center font-semibold text-slate-600">Getting your quiz ready…</p>
          ) : null}

          {stage === "welcome" ? (
            <section className="mx-auto max-w-xl space-y-5 rounded-[30px] border border-sky-100 bg-white p-5 text-center shadow-sm sm:p-9">
              <div className="mx-auto grid size-20 place-items-center rounded-full bg-sky-100 text-[#168eea]">
                <Trophy className="size-10" aria-hidden="true"/>
              </div>
              <h2 className="text-2xl font-black sm:text-3xl">Ready for a Quiz?</h2>
              <p className="text-sm leading-6 text-slate-600">Show what you learned about {bank.title}!</p>
              <div className="grid grid-cols-3 gap-2 text-center">
                <InfoTile value="5" label="Questions"/>
                <InfoTile value="4/5" label="To pass"/>
                <InfoTile value="No" label="Time limit"/>
              </div>
              <p className="text-sm font-medium leading-6 text-slate-600">Choose one answer each time. You can skip, go back, and use hints. We'll show your answers after you finish.</p>
              <button type="button" className={primaryButton + " w-full"} disabled={busy} onClick={()=>void startNewAttempt()}><Play className="size-4"/> Start Quiz</button>
            </section>
          ) : null}

          {stage === "resume" ? (
            <section className="mx-auto max-w-xl space-y-5 rounded-[30px] border border-sky-100 bg-white p-6 text-center shadow-sm sm:p-9">
              <div className="mx-auto grid size-20 place-items-center rounded-full bg-sky-100 text-[#168eea]"><BookOpen className="size-10"/></div>
              <h2 className="text-2xl font-black">Welcome Back!</h2>
              <p className="text-sm text-slate-600">You have an unfinished {bank.title} quiz. Your answers are saved on this device.</p>
              <div className="rounded-xl bg-sky-50 p-3 text-sm font-extrabold">{answeredCount} of 5 answered</div>
              <button className={primaryButton + " w-full"} type="button" onClick={continueAttempt}><Play className="size-4"/> Continue Quiz</button>
              <button className={secondaryButton + " w-full"} type="button" onClick={() => setModal("restart")}><RefreshCw className="size-4"/> Start Over</button>
            </section>
          ) : null}

          {stage === "question" && draft && currentQuestion ? (
            <section aria-labelledby="quiz-question-title" className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-extrabold">Question {draft.currentIndex + 1} of 5</span>
                <span className="text-xs font-bold text-slate-500">{answeredCount}/5 answered</span>
              </div>
              <div className="grid grid-cols-5 gap-1.5" aria-label="Quiz progress">
                {draft.questionIds.map((id, index) => (
                  <div key={id}
                    className={`h-2 rounded-full ${index === draft.currentIndex ? "bg-[#168eea]" : Object.prototype.hasOwnProperty.call(draft.answers, id) ? "bg-emerald-400" : "bg-sky-100"}`}
                    title={`Question ${index + 1}: ${Object.prototype.hasOwnProperty.call(draft.answers, id) ? "answered" : "unanswered"}`}/>
                ))}
              </div>
              <div className="rounded-[28px] border border-sky-100 bg-white p-4 shadow-sm sm:p-7">
                <h2 id="quiz-question-title" className="mx-auto max-w-2xl text-center text-lg font-black leading-snug sm:text-2xl">{currentQuestion.prompt}</h2>
                {currentQuestion.diagram ? <GearIllustration variant={currentQuestion.diagram}/> : null}
                <fieldset className="mx-auto mt-5 max-w-2xl">
                  <legend className="sr-only">Choose one answer</legend>
                  <div className="grid grid-cols-1 gap-3 min-[660px]:grid-cols-2">
                    {currentQuestion.choices.map((choice, index) => {
                      const isSelected = draft.answers[currentQuestion.id] === index;
                      return (
                        <label key={index} className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-2xl border-2 p-3 text-left text-sm font-semibold transition sm:p-4 ${isSelected ? "border-[#168eea] bg-sky-50 text-[#132654]" : "border-sky-100 bg-white hover:border-sky-300"}`}>
                          <input className="size-4 shrink-0 accent-[#168eea]" name={currentQuestion.id} type="radio" value={index}
                            checked={isSelected} disabled={busy || (quizSyncEnabled && Boolean(submittedAnswers.current))} onChange={() => changeAnswer(currentQuestion.id, index)}/>
                          <span className="shrink-0 font-black text-[#168eea]">{String.fromCharCode(65 + index)}.</span>
                          <span>{choice}</span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
                <div className="mx-auto mt-4 max-w-2xl text-center">
                  <button type="button" className="inline-flex min-h-11 items-center gap-2 rounded-xl px-4 text-sm font-extrabold text-[#168eea] hover:bg-sky-50"
                    aria-expanded={hintQuestion === currentQuestion.id} onClick={() => setHintQuestion(id => id === currentQuestion.id ? null : currentQuestion.id)}>
                    <Lightbulb className="size-4 text-amber-500"/> {hintQuestion === currentQuestion.id ? "Hide Hint" : "Need a Hint?"}
                  </button>
                  {hintQuestion === currentQuestion.id ? (
                    <p className="mt-2 rounded-2xl bg-amber-50 p-3 text-left text-sm font-medium leading-6 text-amber-950">
                      <strong>Think About It!</strong> {currentQuestion.hint}
                    </p>
                  ) : null}
                </div>
              </div>
            </section>
          ) : null}

          {stage === "review" && draft ? (
            <section className="mx-auto max-w-xl space-y-5 rounded-[30px] border border-sky-100 bg-white p-5 shadow-sm sm:p-8">
              <div className="text-center">
                <ClipboardCheck className="mx-auto size-11 text-[#168eea]" aria-hidden="true"/>
                <h2 className="mt-3 text-2xl font-black">Check Your Answers!</h2>
                <p className="mt-2 text-sm text-slate-600">Make sure you've answered all five. Tap any number to go back.</p>
              </div>
              <p className="text-center text-sm font-extrabold">{answeredCount} of 5 answered</p>
              <div className="grid grid-cols-5 gap-2">
                {draft.questionIds.map((id, index) => {
                  const answered = Object.prototype.hasOwnProperty.call(draft.answers, id);
                  return (
                    <button type="button" key={id} onClick={() => goToQuestion(index)}
                      aria-label={`Return to question ${index + 1}, ${answered ? "answered" : "unanswered"}`}
                      className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl border-2 text-sm font-black ${answered ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-amber-300 bg-amber-50 text-amber-950"}`}>
                      {index + 1}
                      {answered ? <CheckCircle2 className="size-4"/> : <span className="text-xs">?</span>}
                    </button>
                  );
                })}
              </div>
              {!allAnswered ? <p role="status" className="rounded-xl bg-amber-50 p-3 text-center text-sm font-semibold text-amber-900">{5 - answeredCount} question(s) still need an answer.</p> : null}
              <p className="text-center text-xs text-slate-500">You can change your answers now. After submission, they are locked.</p>
              <button type="button" onClick={()=>void submitAttempt()} disabled={!allAnswered || busy}
                className={primaryButton + " w-full disabled:cursor-not-allowed disabled:opacity-40"}>
                {busy ? "Submitting…" : "Submit Quiz"}
              </button>
              <button type="button" className={secondaryButton + " w-full"} onClick={() => goToQuestion(draft.currentIndex)}>Back to Questions</button>
            </section>
          ) : null}

          {stage === "results" && result ? (
            <section className="mx-auto max-w-2xl space-y-5">
              <div className="rounded-[30px] border border-sky-100 bg-white p-6 text-center shadow-sm">
                <Trophy className="mx-auto size-12 text-amber-500"/>
                <h2 className="mt-3 text-2xl font-black">{result.score === 5 ? "Amazing Work!" : result.score >= QUIZ_PASS_COUNT ? "Great Job!" : "Nice Try!"}</h2>
                <p className="mt-3 text-4xl font-black">{result.score * 20}%</p>
                <span className={`mt-3 inline-flex rounded-full px-4 py-1 text-xs font-extrabold ${result.score >= QUIZ_PASS_COUNT ? "bg-emerald-50 text-emerald-700" : "bg-sky-100 text-[#168eea]"}`}>
                  {result.score >= QUIZ_PASS_COUNT ? "Passed" : "Retry"}
                </span>
                <p className="mt-3 text-sm text-slate-600">{result.score} of 5 correct. {result.score >= QUIZ_PASS_COUNT ? "You did it!" : "Review a little and try again!"}</p>
              </div>
              {incorrect.length > 0 ? (
                <section aria-label="Questions to learn from" className="space-y-3">
                  <h3 className="flex items-center gap-2 text-lg font-black"><BookOpen className="size-5 text-[#168eea]"/> Let's Learn Together!</h3>
                  {incorrect.map(question => <ReviewAnswer key={question.id} question={question} given={result.answers[question.id]!} correct={false} projectId={projectId}/>)}
                </section>
              ) : <p className="rounded-2xl bg-emerald-50 p-4 text-center font-extrabold text-emerald-800">You got everything right!</p>}
              {correct.length > 0 ? (
                <details className="rounded-2xl border border-emerald-100 bg-white p-4">
                  <summary className="cursor-pointer font-extrabold text-emerald-800">Questions You Got Right ({correct.length})</summary>
                  <div className="mt-4 space-y-3">
                    {correct.map(question => <ReviewAnswer key={question.id} question={question} given={result.answers[question.id]!} correct projectId={projectId}/>)}
                  </div>
                </details>
              ) : null}
              <div className="grid gap-2 sm:grid-cols-2">
                <button type="button" className={primaryButton} disabled={busy} onClick={()=>void startNewAttempt()}><RefreshCw className="size-4"/> Try Again</button>
                <Link to="/projects/$projectId" params={{projectId}} className={secondaryButton}>Back to Project</Link>
              </div>
            </section>
          ) : null}
        </div>
      </main>

      {stage === "question" && draft ? (
        <footer className="z-10 shrink-0 border-t border-sky-100 bg-white px-3 pb-[max(.6rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-4px_18px_rgba(22,142,234,.07)] sm:px-6">
          <nav className="mx-auto flex max-w-3xl items-center justify-between gap-3" aria-label="Quiz question navigation">
            <button type="button" disabled={draft.currentIndex === 0} className={secondaryButton + " min-w-0 flex-1 disabled:cursor-not-allowed disabled:opacity-40"}
              onClick={() => goToQuestion(draft.currentIndex - 1)}>
              <ChevronLeft className="size-4"/> Previous
            </button>
            <button type="button" className={primaryButton + " min-w-0 flex-1"}
              onClick={() => draft.currentIndex === QUIZ_QUESTION_COUNT - 1 ? setStage("review") : goToQuestion(draft.currentIndex + 1)}>
              {draft.currentIndex === QUIZ_QUESTION_COUNT - 1 ? "Check Answers" : "Next"}
              <ChevronRight className="size-4"/>
            </button>
          </nav>
        </footer>
      ) : null}

      {modal ? (
        <div role="presentation" className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/45 p-4">
          <section role="dialog" aria-modal="true" aria-labelledby="quiz-dialog-title" className="w-full max-w-sm rounded-[28px] bg-white p-6 text-center shadow-xl">
            {modal === "leave" ? <DoorOpen className="mx-auto size-10 text-[#168eea]"/> : <RefreshCw className="mx-auto size-10 text-[#168eea]"/>}
            <h2 id="quiz-dialog-title" className="mt-3 text-xl font-black">{modal === "leave" ? "Leave Quiz?" : "Start a New Quiz?"}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {modal === "leave"
                ? quizSyncEnabled ? "Unfinished answers are not saved after leaving this page." : saveFailed ? "Your browser blocked saving, so your answers may be lost." : "Don't worry! Your answers are saved. You can continue anytime."
                : "Your unfinished answers will be cleared. Your best score will stay saved."}
            </p>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <button type="button" className={secondaryButton} onClick={() => setModal(null)}>{modal === "leave" ? "Stay" : "Cancel"}</button>
              {modal === "leave" ? (
                <Link to="/projects/$projectId" params={{ projectId }} className={primaryButton}>Leave Quiz</Link>
              ) : (
                <button type="button" disabled={busy} onClick={()=>void startNewAttempt()} className={primaryButton}>Start Over</button>
              )}
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}

function InfoTile({value,label}: {value:string;label:string}) {
  return <div className="rounded-2xl bg-sky-50 px-2 py-3"><p className="text-xl font-black text-[#168eea]">{value}</p><p className="text-[11px] font-semibold text-slate-600">{label}</p></div>;
}

/** Concept illustration: size relationships are intentional; actual tooth counts are not represented. */
function GearIllustration({ variant }: { variant: GearDiagram }) {
  const firstLarge = variant === "large-to-small";
  const gearPoints = (x: number, y: number, radius: number, teeth: number) =>
    Array.from({length: teeth * 4}, (_, point) => {
      const angle = (point / (teeth * 4)) * Math.PI * 2;
      const r = point % 4 === 0 || point % 4 === 3 ? radius : radius - 5;
      return `${x + Math.cos(angle) * r},${y + Math.sin(angle) * r}`;
    }).join(" ");
  return (
    <figure className="mx-auto mt-4 w-full max-w-sm rounded-2xl bg-sky-50 p-3 text-center">
      <svg role="img" aria-label={firstLarge ? "Large driving gear A touching smaller driven gear B" : "Small driving gear A touching larger driven gear B"}
        viewBox="0 0 320 160" className="mx-auto h-auto w-full max-h-[24dvh] min-h-20">
        <polygon points={gearPoints(116, 72, firstLarge ? 48 : 25, firstLarge ? 16 : 10)} fill="#e1f1ff" stroke="#168eea" strokeWidth="2"/>
        <circle cx="116" cy="72" r="11" fill="#168eea"/>
        <polygon points={gearPoints(189, 72, firstLarge ? 25 : 48, firstLarge ? 10 : 16)} fill="#fff1d2" stroke="#d59a2b" strokeWidth="2"/>
        <circle cx="189" cy="72" r="11" fill="#d59a2b"/>
        <text x="116" y="76" fill="#ffffff" textAnchor="middle" fontSize="13" fontWeight="bold">A</text>
        <text x="189" y="76" fill="#ffffff" textAnchor="middle" fontSize="13" fontWeight="bold">B</text>
        <text x="116" y="145" fill="#132654" textAnchor="middle" fontSize="12">Gear A · Driving</text>
        <text x="208" y="158" fill="#132654" textAnchor="middle" fontSize="12">Gear B · Driven</text>
      </svg>
      <figcaption className="text-xs font-semibold text-slate-600">Look at the sizes of the two gears.</figcaption>
    </figure>
  );
}

function ReviewAnswer({question,given,correct,projectId}: {question:QuizQuestion;given:number;correct:boolean;projectId:string}) {
  return (
    <article className="rounded-2xl border border-sky-100 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2">
        {correct ? <CheckCircle2 className="size-5 text-emerald-600"/> : <XCircle className="size-5 text-amber-600"/>}
        <span className="text-xs font-extrabold">{correct ? "Correct" : "Needs review"}</span>
      </div>
      <h4 className="mt-3 text-sm font-black">{question.prompt}</h4>
      {!correct ? <p className="mt-3 rounded-xl bg-amber-50 p-3 text-sm"><strong>Your answer:</strong> {question.choices[given]}</p> : null}
      <p className="mt-2 rounded-xl bg-emerald-50 p-3 text-sm"><strong>Correct answer:</strong> {question.choices[question.correctIndex]}</p>
      <p className="mt-3 text-sm leading-6 text-slate-600"><strong>Why?</strong> {question.explanation}</p>
      {!correct ? (
        <Link to="/practical/$projectId" params={{projectId}} search={{mode:"learning", slide: question.learningSlide}}
          className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-extrabold text-[#168eea] underline underline-offset-2">
          <BookOpen className="size-4"/> {LEVEL_ONE_BUILDING_PDF_LEARNING_FALLBACK_IDS.some(id => id === projectId)
            ? "Review Construction Manual Page"
            : "Review Learning Slide"} {question.learningSlide}
        </Link>
      ) : null}
    </article>
  );
}

// Remove the browser answer-bank module in the exact private artifact only.
export function privateAssessmentBuildPlugin(){
 return {name:"j12345-private-assessment-bank",enforce:"pre",
  transform(code,id){
   const path=id.split("?")[0].replace(/\\/g,"/");
   if(this.environment?.name!=="client")return null;
   if(path.endsWith("/src/data/quizStudio.ts"))return {code:`
export const QUIZ_QUESTION_COUNT=5,QUIZ_PASS_COUNT=4,quizBanks={};
export function getQuizBank(){return undefined;}
export function validateQuizBank(){return ["Server-owned quiz"];}
export function selectQuizQuestions(){throw Error("Server-owned quiz");}
export function blankQuizState(){return {bestScore:null,lastQuestionIds:[],draft:null};}
export function readQuizSavedState(){return blankQuizState();}
export function writeQuizSavedState(){return false;}
`,map:null};
   if(path.includes("/src/data/quizBanks/"))throw Error("Private browser requested a quiz answer bank");
   return null;
  },
  generateBundle(_options,bundle){
   if(this.environment?.name!=="client")return;
   for(const asset of Object.values(bundle))if(asset.type==="chunk"&&Object.keys(asset.modules).some(id=>id.replace(/\\/g,"/").includes("/src/data/quizBanks/")))throw Error("Private browser bundle contains quiz answer banks");
  }
 };
}

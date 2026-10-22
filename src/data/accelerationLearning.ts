/** Verified against the Acceleration Car lecture and E6-02-13 teaching plan.
 * Defined convention: i = driven teeth / driving teeth = input speed / output speed.
 * Do not reproduce the source's duplicated "driven gears" wording typo.
 */
export type LearningQuestion = {
  id: string;
  group: string;
  prompt: string;
  options: string[];
  correct: string;
  explanation: string;
  /** One-based page numbers in the official Acceleration Car lecture PDF. */
  referenceSlides: number[];
  /** Clarifies the precise slide evidence vs. an applied practice example. */
  referenceNote: string;
};
const questionBank: Omit<LearningQuestion, "referenceSlides" | "referenceNote">[] = [
  {
    "id": "fundamentals-1",
    "group": "fundamentals",
    "prompt": "Which gear is connected to the input shaft?",
    "options": [
      "Driving gear",
      "Driven gear",
      "Output gear",
      "Idle wheel"
    ],
    "correct": "Driving gear",
    "explanation": "The driving gear receives input rotation and passes it to the driven gear."
  },
  {
    "id": "fundamentals-2",
    "group": "fundamentals",
    "prompt": "Which gear receives motion from the driving gear?",
    "options": [
      "Driven gear",
      "Input gear",
      "Driving gear",
      "Stationary gear"
    ],
    "correct": "Driven gear",
    "explanation": "The driving gear receives input rotation and passes it to the driven gear."
  },
  {
    "id": "fundamentals-3",
    "group": "fundamentals",
    "prompt": "What is the main purpose of meshing gears?",
    "options": [
      "Transmit rotational motion",
      "Store electrical energy",
      "Detect colors",
      "Measure temperature"
    ],
    "correct": "Transmit rotational motion",
    "explanation": "The driving gear receives input rotation and passes it to the driven gear."
  },
  {
    "id": "fundamentals-4",
    "group": "fundamentals",
    "prompt": "What does the number of teeth help determine?",
    "options": [
      "Gear ratio",
      "Battery voltage",
      "Wheel material",
      "Sensor sensitivity"
    ],
    "correct": "Gear ratio",
    "explanation": "The driving gear receives input rotation and passes it to the driven gear."
  },
  {
    "id": "acceleration-1",
    "group": "acceleration",
    "prompt": "A large driving gear turns a smaller driven gear. What happens to driven speed?",
    "options": [
      "It increases",
      "It decreases",
      "It stops",
      "It stays exactly equal"
    ],
    "correct": "It increases",
    "explanation": "A larger driving gear turning a smaller driven gear increases output speed (i < 1)."
  },
  {
    "id": "acceleration-2",
    "group": "acceleration",
    "prompt": "For a speed-increasing pair, the defined gear ratio is…",
    "options": [
      "Less than 1",
      "Greater than 1",
      "Always 1",
      "Always 0"
    ],
    "correct": "Less than 1",
    "explanation": "A larger driving gear turning a smaller driven gear increases output speed (i < 1)."
  },
  {
    "id": "acceleration-3",
    "group": "acceleration",
    "prompt": "A 40-tooth driving gear drives a 20-tooth gear. The output rotates…",
    "options": [
      "Twice as fast",
      "Half as fast",
      "At the same speed",
      "Four times slower"
    ],
    "correct": "Twice as fast",
    "explanation": "A larger driving gear turning a smaller driven gear increases output speed (i < 1)."
  },
  {
    "id": "acceleration-4",
    "group": "acceleration",
    "prompt": "To increase the output rotational speed, choose…",
    "options": [
      "A larger driver than driven gear",
      "A smaller driver than driven gear",
      "Equal-sized gears",
      "No contact between gears"
    ],
    "correct": "A larger driver than driven gear",
    "explanation": "A larger driving gear turning a smaller driven gear increases output speed (i < 1)."
  },
  {
    "id": "deceleration-1",
    "group": "deceleration",
    "prompt": "A small driving gear turns a larger driven gear. What happens to driven speed?",
    "options": [
      "It decreases",
      "It increases",
      "It remains the same",
      "It becomes zero"
    ],
    "correct": "It decreases",
    "explanation": "A smaller driving gear turning a larger driven gear reduces output speed (i > 1)."
  },
  {
    "id": "deceleration-2",
    "group": "deceleration",
    "prompt": "For a speed-reducing pair, the defined gear ratio is…",
    "options": [
      "Greater than 1",
      "Less than 1",
      "Exactly 0",
      "Always negative"
    ],
    "correct": "Greater than 1",
    "explanation": "A smaller driving gear turning a larger driven gear reduces output speed (i > 1)."
  },
  {
    "id": "deceleration-3",
    "group": "deceleration",
    "prompt": "A 10-tooth driver turns a 30-tooth driven gear. Output speed is…",
    "options": [
      "One-third of input",
      "Three times input",
      "Equal to input",
      "Ten times input"
    ],
    "correct": "One-third of input",
    "explanation": "A smaller driving gear turning a larger driven gear reduces output speed (i > 1)."
  },
  {
    "id": "deceleration-4",
    "group": "deceleration",
    "prompt": "Which gear arrangement reduces rotational speed?",
    "options": [
      "Small driver to large driven",
      "Large driver to small driven",
      "Equal-size pair",
      "Gears not touching"
    ],
    "correct": "Small driver to large driven",
    "explanation": "A smaller driving gear turning a larger driven gear reduces output speed (i > 1)."
  },
  {
    "id": "ratio-1",
    "group": "ratio",
    "prompt": "A 12-tooth driving gear turns a 24-tooth driven gear. What is i?",
    "options": [
      "2",
      "0.5",
      "12",
      "36"
    ],
    "correct": "2",
    "explanation": "Use i = driven gear teeth / driving gear teeth = input speed / output speed."
  },
  {
    "id": "ratio-2",
    "group": "ratio",
    "prompt": "A 30-tooth driver turns a 15-tooth driven gear. What is i?",
    "options": [
      "0.5",
      "2",
      "15",
      "45"
    ],
    "correct": "0.5",
    "explanation": "Use i = driven gear teeth / driving gear teeth = input speed / output speed."
  },
  {
    "id": "ratio-3",
    "group": "ratio",
    "prompt": "The input turns at 120 rpm and the output at 60 rpm. What is i?",
    "options": [
      "2",
      "0.5",
      "60",
      "180"
    ],
    "correct": "2",
    "explanation": "Use i = driven gear teeth / driving gear teeth = input speed / output speed."
  },
  {
    "id": "ratio-4",
    "group": "ratio",
    "prompt": "The driving gear has 20 teeth and the driven gear has 20 teeth. What is i?",
    "options": [
      "1",
      "0",
      "2",
      "20"
    ],
    "correct": "1",
    "explanation": "Use i = driven gear teeth / driving gear teeth = input speed / output speed."
  },
  {
    "id": "application-1",
    "group": "application",
    "prompt": "What should students observe when swapping a gear in the model?",
    "options": [
      "Change in transmission speed",
      "Color sensor response",
      "Battery charging rate",
      "Sound volume"
    ],
    "correct": "Change in transmission speed",
    "explanation": "The teaching plan focuses on gear-ratio changes, stable assembly and observing motion."
  },
  {
    "id": "application-2",
    "group": "application",
    "prompt": "Which is an assembly requirement in the teaching plan?",
    "options": [
      "Stable structure",
      "Wireless connection",
      "Camera calibration",
      "Light detection"
    ],
    "correct": "Stable structure",
    "explanation": "The teaching plan focuses on gear-ratio changes, stable assembly and observing motion."
  },
  {
    "id": "application-3",
    "group": "application",
    "prompt": "Why calculate gear ratio after changing gears?",
    "options": [
      "To predict rotational speed changes",
      "To count sensors",
      "To estimate battery life",
      "To determine paint color"
    ],
    "correct": "To predict rotational speed changes",
    "explanation": "The teaching plan focuses on gear-ratio changes, stable assembly and observing motion."
  },
  {
    "id": "application-4",
    "group": "application",
    "prompt": "What is the lesson's practical investigation about?",
    "options": [
      "Comparing gear arrangements and motion",
      "Programming a camera",
      "Testing ultrasonic distance",
      "Configuring sound sensors"
    ],
    "correct": "Comparing gear arrangements and motion",
    "explanation": "The teaching plan focuses on gear-ratio changes, stable assembly and observing motion."
  }
];
/** Slide references checked against the uploaded original 17-slide lecture.
 * The lecture's written gear-ratio sentence contains a repeated "driven gears"
 * typo on slide 11, so explanations use its consistent formula and slide 10's definition.
 */
const questionSlideReferences: Record<string, { slides: number[]; note: string }> = {
  "fundamentals-1": { slides: [9], note: "Slide 9 defines the driving gear as the gear on the input shaft." },
  "fundamentals-2": { slides: [9], note: "Slide 9 explains that motion is transmitted to the driven gear on the output shaft." },
  "fundamentals-3": { slides: [9], note: "Slide 9 describes the driving and driven gears as a transmission pair." },
  "fundamentals-4": { slides: [10,11], note: "Slide 10 defines the ratio using gear-tooth counts; slide 11 shows its formula." },
  "acceleration-1": { slides: [6,11], note: "Slide 6 explains that a large driving gear turning a small driven gear increases speed; slide 11 states the ratio rule." },
  "acceleration-2": { slides: [11], note: "Slide 11 states that a speed-increasing transmission has a gear ratio below 1." },
  "acceleration-3": { slides: [11], note: "Slide 11 provides the gear-ratio formula. The 40/20-tooth numbers are practice values, not printed on the slide." },
  "acceleration-4": { slides: [6,11], note: "Slide 6 describes the large-driver-to-small-driven arrangement; slide 11 gives the corresponding ratio rule." },
  "deceleration-1": { slides: [11], note: "Slide 11 states the speed-reduction rule. Apply the ratio to a small driving gear and larger driven gear." },
  "deceleration-2": { slides: [11], note: "Slide 11 states that a speed-reducing transmission has a gear ratio greater than 1." },
  "deceleration-3": { slides: [11], note: "Slide 11 supplies the ratio formula. The 10/30-tooth numbers are practice values, not printed on the slide." },
  "deceleration-4": { slides: [11], note: "Slide 11 supplies the speed-reduction rule; identify the driver and driven gear sizes using that rule." },
  "ratio-1": { slides: [10,11], note: "Slide 10 defines the ratio and slide 11 gives the formula. The 12/24-tooth values are a practice calculation." },
  "ratio-2": { slides: [10,11], note: "Slide 10 defines the ratio and slide 11 gives the formula. The 30/15-tooth values are a practice calculation." },
  "ratio-3": { slides: [11], note: "Slide 11 defines i as driving speed divided by driven speed. The 120/60 rpm values are practice numbers." },
  "ratio-4": { slides: [10,11], note: "Slides 10–11 define and calculate the gear ratio. Equal tooth counts are an application of the formula." },
  "application-1": { slides: [16], note: "Slide 16 assigns a gear-modification experiment; use the ratio rule from the lecture to assess speed changes." },
  "application-2": { slides: [13], note: "Slide 13 lists a stable structure as an assembly requirement." },
  "application-3": { slides: [11,16], note: "Slide 11 gives the speed-ratio formula; slide 16 asks students to modify the gear arrangement." },
  "application-4": { slides: [16], note: "Slide 16 gives the gear-modification homework that explores how gear arrangements affect motion." }
};
export const accelerationQuestions: LearningQuestion[] = questionBank.map((question) => {
  const reference = questionSlideReferences[question.id];
  if (!reference) throw new Error(`Missing lecture reference for ${question.id}`);
  return {
    ...question,
    referenceSlides: reference.slides,
    referenceNote: reference.note,
  };
});
export const accelerationGroups = ["fundamentals","acceleration","deceleration","ratio","application"] as const;
export function createAccelerationQuiz(previousIds: string[] = []) {
  const shuffle = <T,>(values: T[]): T[] => {
    const result = [...values];
    for (let i=result.length-1;i>0;i--) {
      const j=Math.floor(Math.random()*(i+1));
      [result[i],result[j]]=[result[j],result[i]];
    }
    return result;
  };
  return shuffle(accelerationGroups.map(group => {
    const candidates=accelerationQuestions.filter(q=>q.group===group);
    const fresh=candidates.filter(q=>!previousIds.includes(q.id));
    const question=shuffle(fresh.length ? fresh : candidates)[0];
    return {...question,options:shuffle(question.options)};
  }));
}

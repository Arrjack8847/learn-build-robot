/** Phase 3 source-text question draft; PDF illustrations and teaching quality need review. */
import type { QuizBank } from "../quizStudio";
export const littleOwlBank: QuizBank = {
  "projectId": "little-owl",
  "title": "Little Owl",
  "sourcePdfPath": "public/Little Owl.pdf",
  "sourcePageCount": 18,
  "questions": [
    {
      "id": "little-owl-01",
      "topic": "daily-habits",
      "prompt": "When does the helpful owl in the story hunt for food?",
      "choices": [
        "Only in the afternoon",
        "At night",
        "Only at noon",
        "Only at breakfast"
      ],
      "correctIndex": 1,
      "learningSlide": 4,
      "explanation": "The story says the neighbour is a good hunter at night.",
      "hint": "Remember the contrast between the owl's hunting hours and its resting hours."
    },
    {
      "id": "little-owl-02",
      "topic": "daily-habits",
      "prompt": "When does the owl in the lesson's story sleep?",
      "choices": [
        "Only in a storm",
        "Only at sunset",
        "During the day",
        "At night"
      ],
      "correctIndex": 2,
      "learningSlide": 4,
      "explanation": "The story explicitly says the owl sleeps during the day.",
      "hint": "Consider when this bird rests after being active outside its nest."
    },
    {
      "id": "little-owl-03",
      "topic": "story",
      "prompt": "Whom does the owl help in the introduction?",
      "choices": [
        "A fisherman and his boat",
        "A dinosaur with a broken tooth",
        "A driver in heavy rain",
        "A sick mother bird and hungry baby birds"
      ],
      "correctIndex": 3,
      "learningSlide": 4,
      "explanation": "The owl hunts food for the sick mother bird and the baby birds.",
      "hint": "Recall the family in the story that needed another bird's help finding food."
    },
    {
      "id": "little-owl-04",
      "topic": "story",
      "prompt": "What is the lesson's main animal model?",
      "choices": [
        "An owl",
        "A hermit crab",
        "A duck",
        "A penguin"
      ],
      "correctIndex": 0,
      "learningSlide": 4,
      "explanation": "The topic analysis asks the class to design and build an owl.",
      "hint": "Think about which creature the class studies to make the wing-moving model."
    },
    {
      "id": "little-owl-05",
      "topic": "owl-design",
      "prompt": "Where are students asked to sketch their owl?",
      "choices": [
        "On the motor casing",
        "On the blackboard",
        "On a rotating axle",
        "On the USB connector"
      ],
      "correctIndex": 1,
      "learningSlide": 4,
      "explanation": "The topic analysis directs students to draw the owl on the blackboard.",
      "hint": "Remember the classroom surface suggested for sketching a design before building."
    },
    {
      "id": "little-owl-06",
      "topic": "owl-design",
      "prompt": "What is a key build requirement for the owl?",
      "choices": [
        "Making a sensor-controlled car",
        "Installing a telephone screen",
        "Correctly constructing its structure",
        "Building a boat hull"
      ],
      "correctIndex": 2,
      "learningSlide": 3,
      "explanation": "The key points specify correct construction of the owl's structure.",
      "hint": "Consider what a successful assembly must achieve before its moving parts can work."
    },
    {
      "id": "little-owl-07",
      "topic": "wing-movement",
      "prompt": "Which moving body part is the lesson's central mechanical challenge?",
      "choices": [
        "Tail wheels",
        "Rear bumper",
        "A propeller blade",
        "Wings"
      ],
      "correctIndex": 3,
      "learningSlide": 4,
      "explanation": "The planning questions ask what makes the owl's wings swing.",
      "hint": "Focus on the body part that moves in the animal model, not on a wheel.",
      "image": {
        "src": "/quiz-visuals/level1/little-owl.svg",
        "alt": "An owl with raised mechanical wings and motion arrows."
      }
    },
    {
      "id": "little-owl-08",
      "topic": "wing-movement",
      "prompt": "What motion should students explain when presenting the owl model?",
      "choices": [
        "Swinging wings",
        "Rotating a coffee cup",
        "Lifting a crane hook",
        "Moving a car wiper"
      ],
      "correctIndex": 0,
      "learningSlide": 5,
      "explanation": "The presentation questions focus on what makes the model's wings swing.",
      "hint": "Think about the visible movement the teacher asks students to explain.",
      "image": {
        "src": "/quiz-visuals/level1/little-owl.svg",
        "alt": "An owl with raised mechanical wings and motion arrows."
      }
    },
    {
      "id": "little-owl-09",
      "topic": "driven-linkage",
      "prompt": "Which mechanical connection is listed as a key challenge?",
      "choices": [
        "Optical camera mount",
        "Linkage connection",
        "Soldered computer processor",
        "Elastic tyre pressure"
      ],
      "correctIndex": 1,
      "learningSlide": 3,
      "explanation": "The lesson lists linkage connection among its key points.",
      "hint": "Recall how one moving piece can transfer movement to another connected piece."
    },
    {
      "id": "little-owl-10",
      "topic": "driven-linkage",
      "prompt": "Which mechanism does the construction guidance ask teachers to explain?",
      "choices": [
        "Water buoyancy",
        "Electrical insulation",
        "Gearing",
        "Visual persistence"
      ],
      "correctIndex": 2,
      "learningSlide": 5,
      "explanation": "The hands-on section explicitly directs teachers to explain gearing.",
      "hint": "Review the mechanical method that transfers rotation between toothed parts."
    }
  ]
};

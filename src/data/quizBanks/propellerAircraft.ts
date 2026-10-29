/** Phase 3: questions authored from the supplied official Building-manual text extract.
 * PDF diagrams and pedagogical review pending; do not register this bank yet.
 */
import type { QuizBank } from "../quizStudio";
export const propellerAircraftBank: QuizBank = {
  "projectId": "propeller-aircraft",
  "title": "Propeller Aircraft",
  "sourcePdfPath": "public/Propeller Aircraft.pdf",
  "sourcePageCount": 14,
  "questions": [
    {
      "id": "propeller-aircraft-01",
      "topic": "aircraft-types",
      "prompt": "Which kinds of aircraft does the lesson ask students to compare with a propeller aircraft?",
      "choices": [
        "Boats and submarines",
        "Seaplanes and helicopters",
        "Bicycles and trains",
        "Cars and buses"
      ],
      "correctIndex": 1,
      "learningSlide": 3,
      "explanation": "The objectives mention comparing propeller aircraft with seaplanes and helicopters.",
      "hint": "Look for the two other aircraft types named in the objectives."
    },
    {
      "id": "propeller-aircraft-02",
      "topic": "aircraft-types",
      "prompt": "Which structure is a main mechanical learning objective for this aircraft?",
      "choices": [
        "Magnetic levitation track",
        "Waterwheel structure",
        "Gear-driven structure",
        "Hydraulic crane structure"
      ],
      "correctIndex": 2,
      "learningSlide": 3,
      "explanation": "The objectives specifically identify the gear-driven structure.",
      "hint": "Think about how rotation is transferred to the propeller."
    },
    {
      "id": "propeller-aircraft-03",
      "topic": "lesson-story",
      "prompt": "Why does pilot Max need another way to fly in the lesson story?",
      "choices": [
        "He forgot the airport name",
        "He lost his suitcase",
        "His airplane is parked in a garage for painting",
        "His aircraft is under maintenance"
      ],
      "correctIndex": 3,
      "learningSlide": 4,
      "explanation": "The story says Max's own aircraft is under maintenance and cannot fly.",
      "hint": "Recall the problem Max faces before he can rescue his friend."
    },
    {
      "id": "propeller-aircraft-04",
      "topic": "lesson-story",
      "prompt": "What help does Tom ask for in the lesson story?",
      "choices": [
        "Fuel delivered to an island",
        "A new bicycle wheel",
        "A replacement telephone",
        "A larger music box"
      ],
      "correctIndex": 0,
      "learningSlide": 4,
      "explanation": "Tom is stranded after running out of fuel and asks Max to bring fuel.",
      "hint": "Think about why Tom cannot continue his trip."
    },
    {
      "id": "propeller-aircraft-05",
      "topic": "gear-drive",
      "prompt": "Which mechanism is explained during the hands-on aircraft activity?",
      "choices": [
        "A stationary linkage with no rotation",
        "Gear transmission driving the propeller",
        "A rubber-band-only catapult",
        "A water-powered hydraulic system"
      ],
      "correctIndex": 1,
      "learningSlide": 5,
      "explanation": "The hands-on section specifically explains the aircraft's gear-driven structure.",
      "hint": "Recall what the teacher explains after assembling the model."
    },
    {
      "id": "propeller-aircraft-06",
      "topic": "gear-drive",
      "prompt": "According to the outcome review, which mechanism turns the aircraft's propeller?",
      "choices": [
        "A light sensor directly",
        "A fixed support beam alone",
        "A gear drive",
        "A cloth pulley only"
      ],
      "correctIndex": 2,
      "learningSlide": 6,
      "explanation": "The review asks whether gears are used to move the propeller.",
      "hint": "Look for the driving method questioned in the assessment."
    },
    {
      "id": "propeller-aircraft-07",
      "topic": "motor-control",
      "prompt": "Which software tool is introduced for controlling the propeller aircraft?",
      "choices": [
        "Image cropping software",
        "A word processor",
        "A calendar application",
        "Graphical programming software"
      ],
      "correctIndex": 3,
      "learningSlide": 5,
      "explanation": "The manual directs the teacher to introduce graphical programming software.",
      "hint": "The project includes learning how to program the model."
    },
    {
      "id": "propeller-aircraft-08",
      "topic": "motor-control",
      "prompt": "Which order of instructions is a stated programming learning objective?",
      "choices": [
        "Sequential order",
        "Unpredictable order",
        "Alphabetical sorting of parts",
        "Reversing the assembly diagrams"
      ],
      "correctIndex": 0,
      "learningSlide": 3,
      "explanation": "The objectives identify correct understanding of sequential programming.",
      "hint": "Consider the structure of an ordered set of commands."
    },
    {
      "id": "propeller-aircraft-09",
      "topic": "program-sequence",
      "prompt": "Which value does the lesson suggest adjusting to change the propeller's motion?",
      "choices": [
        "The time shown on the computer clock",
        "The motor speed value",
        "The colour of the aircraft",
        "The USB cable label"
      ],
      "correctIndex": 1,
      "learningSlide": 5,
      "explanation": "The teacher is asked to adjust propeller speed by debugging the speed value.",
      "hint": "Think about the parameter used to debug the propeller's rotation."
    },
    {
      "id": "propeller-aircraft-10",
      "topic": "program-sequence",
      "prompt": "Which connection is shown in the programming instructions?",
      "choices": [
        "Wheel to axle through light",
        "Aircraft to telescope through paint",
        "Controller to computer through USB",
        "Propeller to paper through glue"
      ],
      "correctIndex": 2,
      "learningSlide": 5,
      "explanation": "It directs students to connect the controller to a computer using USB.",
      "hint": "The manual names a cable between the controller and PC."
    }
  ]
};

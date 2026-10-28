/** Based on the 16-page Responder Learning PDF text. Illustrations need visual QA. */
import type { QuizBank } from "../quizStudio";
export const responderBank: QuizBank = {
  "projectId": "responder",
  "title": "Responder",
  "sourcePdfPath": "public/Level 1/Learning/Interactive Systems/Responder/Responder_Powerpoint.pdf",
  "sourcePageCount": 16,
  "questions": [
    {
      "id": "responder-01",
      "topic": "purpose",
      "learningSlide": 7,
      "prompt": "What is the Responder Robot designed to do?",
      "choices": [
        "Measure atmospheric pressure",
        "Cut grass",
        "Use lights as a prompt or response",
        "Follow a marked road"
      ],
      "correctIndex": 2,
      "explanation": "The lesson introduces a responder using the lantern for signals.",
      "hint": "Think about how a machine can show that someone has answered."
    },
    {
      "id": "responder-02",
      "topic": "purpose",
      "learningSlide": 9,
      "prompt": "Which direction or function does the lesson assign to the Responder?",
      "choices": [
        "Prompting",
        "Flying",
        "Underwater swimming",
        "Climbing"
      ],
      "correctIndex": 0,
      "explanation": "The design slide lists its direction as 'prompt'.",
      "hint": "Think about giving users a visible signal."
    },
    {
      "id": "responder-03",
      "topic": "hardware",
      "learningSlide": 10,
      "prompt": "Which electronic parts does the Responder lesson use?",
      "choices": [
        "GPS and sonar",
        "Two pressure sensors",
        "Camera and motor only",
        "RCU and lantern"
      ],
      "correctIndex": 3,
      "explanation": "The equipment matching slide lists RCU and lantern.",
      "hint": "Recall the controller and light used to provide a response."
    },
    {
      "id": "responder-04",
      "topic": "hardware",
      "learningSlide": 10,
      "prompt": "Which part should be visually emphasized in the Responder design?",
      "choices": [
        "Wheel axle",
        "Lantern",
        "Ultrasonic sensor",
        "Gearbox"
      ],
      "correctIndex": 1,
      "explanation": "The slide emphasizes the lantern's appearance.",
      "hint": "Think about the part that communicates the result."
    },
    {
      "id": "responder-05",
      "topic": "programming",
      "learningSlide": 3,
      "prompt": "Which programming modules are a learning focus?",
      "choices": [
        "GPS and map",
        "Lantern and time",
        "Barometer and height",
        "Camera and face tracking"
      ],
      "correctIndex": 1,
      "explanation": "Slide 3 focuses on lantern and time modules.",
      "hint": "Think about producing a light signal for a chosen duration."
    },
    {
      "id": "responder-06",
      "topic": "programming",
      "learningSlide": 2,
      "prompt": "What kind of programming concept does the Responder lesson introduce?",
      "choices": [
        "Only complex 3D graphics",
        "Physics of fluid pressure",
        "Only machine learning",
        "Ordered sequences of instructions"
      ],
      "correctIndex": 3,
      "explanation": "The learning target includes sequence statements and program structure.",
      "hint": "Think about which command runs first and which follows."
    },
    {
      "id": "responder-07",
      "topic": "assembly",
      "learningSlide": 12,
      "prompt": "Which assembly requirement helps the Responder model stand securely?",
      "choices": [
        "Stable structure",
        "Loose base",
        "Unsupported heavy top",
        "Unbalanced arms"
      ],
      "correctIndex": 0,
      "explanation": "The checklist requires a stable structure.",
      "hint": "Think about what prevents a display model from tipping."
    },
    {
      "id": "responder-08",
      "topic": "assembly",
      "learningSlide": 12,
      "prompt": "What must the assembled Responder match?",
      "choices": [
        "A fixed air pressure",
        "A music track length",
        "The intended shape",
        "A motor temperature"
      ],
      "correctIndex": 2,
      "explanation": "The checklist asks for a shape match.",
      "hint": "Compare the finished model with its design."
    },
    {
      "id": "responder-09",
      "topic": "presentation",
      "learningSlide": 15,
      "prompt": "What can students explain when showing their Responder?",
      "choices": [
        "Only the classroom temperature",
        "Only the teacher's name",
        "Where their design inspiration came from",
        "Only the Wi-Fi connection"
      ],
      "correctIndex": 2,
      "explanation": "The homework asks presenters to describe their inspiration.",
      "hint": "Think about how you came up with the design idea."
    },
    {
      "id": "responder-10",
      "topic": "presentation",
      "learningSlide": 15,
      "prompt": "Which reflection is encouraged after building?",
      "choices": [
        "Count how many seconds the lesson lasted",
        "Describe the most satisfying part of the design",
        "Compare all classmates' birthdays",
        "Estimate the building's altitude"
      ],
      "correctIndex": 1,
      "explanation": "The homework asks students to explain what they like most about their design.",
      "hint": "Consider which part of your model you feel worked best."
    }
  ]
};

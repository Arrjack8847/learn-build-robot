/**
 * Level 1 official Building-PDF-as-Learning source-text question candidate.
 * Diagram-dependent claims and pedagogical review remain blocked pending visuals.
 * Unregistered content only; does not change shared quiz functionality.
 */
import type { QuizBank } from "../../quizStudio";

export const hermitCrabBank: QuizBank = {
  "projectId": "hermit-crab",
  "title": "Hermit Crab",
  "sourcePdfPath": "public/Hermit Crab.pdf",
  "sourcePageCount": 18,
  "questions": [
    {
      "id": "hermit-crab-01",
      "topic": "animal-clues",
      "prompt": "What movement should the Hermit Crab robot copy?",
      "choices": [
        "Swimming like a fish",
        "Flying with wings",
        "Crawling on the ground",
        "Sliding on ice"
      ],
      "correctIndex": 2,
      "learningSlide": 4,
      "explanation": "The topic analysis asks how hermit crabs crawl before students build the model.",
      "hint": "Think about how a hermit crab moves from place to place."
    },
    {
      "id": "hermit-crab-02",
      "topic": "animal-clues",
      "prompt": "What body part do students plan to build as part of their Hermit Crab design?",
      "choices": [
        "Propeller",
        "Claw",
        "Sail",
        "Antenna dish"
      ],
      "correctIndex": 1,
      "learningSlide": 4,
      "explanation": "The topic analysis asks students what pieces can be used to make the crab's claw.",
      "hint": "The animal uses this part near its legs."
    },
    {
      "id": "hermit-crab-03",
      "topic": "animal-comparison",
      "prompt": "What should students compare when studying hermit crabs?",
      "choices": [
        "A crab and a hermit crab",
        "Two types of aircraft",
        "Two light colours",
        "A clock and a motor"
      ],
      "correctIndex": 0,
      "learningSlide": 3,
      "explanation": "The teaching objectives ask students to know the differences between hermit crabs and crabs.",
      "hint": "Compare the model's animal with a related animal."
    },
    {
      "id": "hermit-crab-04",
      "topic": "animal-comparison",
      "prompt": "Which comparison does the lesson ask students to explain at the end?",
      "choices": [
        "Two wheels' diameters",
        "A crab versus a hermit crab",
        "A book versus a screen",
        "Wind versus sunlight"
      ],
      "correctIndex": 1,
      "learningSlide": 6,
      "explanation": "The outcome review asks students to compare a hermit crab with a crab.",
      "hint": "Remember the two similar animals discussed in the lesson."
    },
    {
      "id": "hermit-crab-05",
      "topic": "crank-and-link",
      "prompt": "What structure joins the motor and beams in the key building objectives?",
      "choices": [
        "Crank-link structure",
        "Telescope lens system",
        "Magnetic train suspension",
        "Wind-powered turbine"
      ],
      "correctIndex": 0,
      "learningSlide": 3,
      "explanation": "The key points specify building a crank-link structure using the motor and beam.",
      "hint": "Focus on the type of moving mechanical connection built between the motor and beam."
    },
    {
      "id": "hermit-crab-06",
      "topic": "crank-and-link",
      "prompt": "What mechanical structure does the teacher explain during assembly?",
      "choices": [
        "Water pump",
        "Linkage structure",
        "Optical projector",
        "Fuel injector"
      ],
      "correctIndex": 1,
      "learningSlide": 5,
      "explanation": "The hands-on instructions call for explaining the hermit crab model's linkage.",
      "hint": "Remember the part of the lesson that explains how connected pieces move together."
    },
    {
      "id": "hermit-crab-07",
      "topic": "friction-and-crawling",
      "prompt": "Which force-related topic is explicitly listed in the hermit crab objectives?",
      "choices": [
        "Magnetic induction",
        "Photoelectricity",
        "Friction",
        "Radiation"
      ],
      "correctIndex": 2,
      "learningSlide": 3,
      "explanation": "The teaching objectives name friction.",
      "hint": "Recall the force that acts when two surfaces make contact and move against each other."
    },
    {
      "id": "hermit-crab-08",
      "topic": "friction-and-crawling",
      "prompt": "Before a Hermit Crab model can move by itself, what needs to be set in the programming software?",
      "choices": [
        "Its paper colour",
        "Its motor module",
        "Its storage label",
        "Its building instructions"
      ],
      "correctIndex": 1,
      "learningSlide": 5,
      "explanation": "The lesson introduces programming and setting the motor module to produce movement.",
      "hint": "Look for the software control that can make a motor move."
    },
    {
      "id": "hermit-crab-09",
      "topic": "software-and-motor",
      "prompt": "What setting is used to change the model's crawling speed?",
      "choices": [
        "Motor speed value",
        "Page size",
        "USB cable colour",
        "Project title"
      ],
      "correctIndex": 0,
      "learningSlide": 5,
      "explanation": "The manual says to adjust crawling speed by debugging speed values.",
      "hint": "Remember which robot setting changes the rate at which a moving part operates."
    },
    {
      "id": "hermit-crab-10",
      "topic": "software-and-motor",
      "prompt": "How is the robot controller connected to a computer for programming?",
      "choices": [
        "Paper wire",
        "USB cable",
        "Rubber band",
        "Mechanical gear alone"
      ],
      "correctIndex": 1,
      "learningSlide": 5,
      "explanation": "The hands-on section specifies a USB cable between controller and computer.",
      "hint": "Think about how the computer sends a program to the robot controller."
    }
  ]
};

/** Ten Level 5 questions sourced from the official 26-page Learning PDF. */
import type { QuizBank } from "../../quizStudio";

export const crackShotBank: QuizBank = {
  "projectId": "level-5-crack-shot",
  "title": "Crack Shot",
  "sourcePdfPath": "public/Level 5/Learning/Mechanisms & Simulators/Crack Shot/6. Crack Shot -Slides.pdf",
  "sourcePageCount": 26,
  "questions": [
    {
      "id": "level-5-crack-shot-01",
      "topic": "archery-energy",
      "learningSlide": 4,
      "prompt": "What provides the force that launches an arrow from a traditional bow?",
      "choices": [
        "Elasticity of the bent bow",
        "The arrow's own motor",
        "A photoelectric sensor",
        "A spinning gear alone"
      ],
      "correctIndex": 0,
      "hint": "What changes when the bow is drawn?",
      "explanation": "Slide 4 defines archery as using a bow's elasticity to shoot an arrow."
    },
    {
      "id": "level-5-crack-shot-02",
      "topic": "archery-energy",
      "learningSlide": 6,
      "prompt": "What type of stored energy builds up when the bowstring is drawn?",
      "choices": [
        "Light energy",
        "Elastic potential energy",
        "Sound energy",
        "Nuclear energy"
      ],
      "correctIndex": 1,
      "hint": "Think of a bent spring held before release.",
      "explanation": "Slide 6 teaches that drawing and bending the bow stores elastic potential energy."
    },
    {
      "id": "level-5-crack-shot-03",
      "topic": "motion-mechanism",
      "learningSlide": 8,
      "prompt": "What movement conversion is associated with a slider-crank mechanism?",
      "choices": [
        "Light into sound",
        "Liquid flow into air pressure",
        "Rotary movement and sliding movement",
        "Heat into electrical energy"
      ],
      "correctIndex": 2,
      "hint": "Compare the motion of a rotating crank and a moving slider.",
      "explanation": "Slide 8 describes a crank-and-slider linkage that converts rotation and translation."
    },
    {
      "id": "level-5-crack-shot-04",
      "topic": "motion-mechanism",
      "learningSlide": 10,
      "prompt": "Which component drives the bow mechanism in the assembled archery robot?",
      "choices": [
        "A hydraulic piston",
        "A propeller",
        "A solar panel",
        "A reduction gear"
      ],
      "correctIndex": 3,
      "hint": "Check the labelled drive near the rubber bands.",
      "explanation": "Slide 10 identifies a reduction gear driving the bow structure."
    },
    {
      "id": "level-5-crack-shot-05",
      "topic": "shooting-sequence",
      "learningSlide": 11,
      "prompt": "What is the first step of the robot's shooting flow?",
      "choices": [
        "Adjust the launch angle",
        "Release the arrow immediately",
        "Reset the trigger",
        "Remove the reduction gear"
      ],
      "correctIndex": 0,
      "hint": "Look at numbered step one in the flowchart.",
      "explanation": "Slide 11 starts with adjusting the shooting angle before drawing and releasing."
    },
    {
      "id": "level-5-crack-shot-06",
      "topic": "shooting-sequence",
      "learningSlide": 11,
      "prompt": "Which mechanism drives the trigger to rotate and shoot?",
      "choices": [
        "A light-emitting diode",
        "Crank-slider linkage",
        "Only a free-spinning wheel",
        "A touchscreen alone"
      ],
      "correctIndex": 1,
      "hint": "Trace the final motion step of the shooting sequence.",
      "explanation": "Slide 11 describes the crank slider driving the trigger to rotate and shoot."
    },
    {
      "id": "level-5-crack-shot-07",
      "topic": "variables",
      "learningSlide": 16,
      "prompt": "Why use variables for the robot's archery angle and bow angle?",
      "choices": [
        "To automatically add physical arrows",
        "To store only fixed text labels",
        "To adjust parameters without rewriting every action",
        "To replace all motors with lights"
      ],
      "correctIndex": 2,
      "hint": "What do values in a program make easier to change?",
      "explanation": "Slide 16 introduces variables to control and adjust shooting and bow angles."
    },
    {
      "id": "level-5-crack-shot-08",
      "topic": "variables",
      "learningSlide": 17,
      "prompt": "What kind of value can be assigned to a variable such as X?",
      "choices": [
        "Only a photograph",
        "Only a mechanical gear size",
        "Only the current date",
        "A fixed value or data returned by a sensor"
      ],
      "correctIndex": 3,
      "hint": "Read what is allowed in the variable assignment block.",
      "explanation": "Slide 17 describes assigning fixed values or sensor data to a variable."
    },
    {
      "id": "level-5-crack-shot-09",
      "topic": "experiments",
      "learningSlide": 20,
      "prompt": "Which control does the optimization activity suggest for switching robot actions?",
      "choices": [
        "Buttons",
        "A hand-operated bowstring alone",
        "A permanent power disconnection",
        "A second arrow only"
      ],
      "correctIndex": 0,
      "hint": "Look at the proposed program controls.",
      "explanation": "Slide 20 explicitly asks students to try buttons as switches."
    },
    {
      "id": "level-5-crack-shot-10",
      "topic": "experiments",
      "learningSlide": 25,
      "prompt": "What is a key distinguishing mechanism in a modern compound bow?",
      "choices": [
        "A touchscreen replacing the bow",
        "Pulleys that reduce effort",
        "Solar panels that launch arrows",
        "Magnets that remove the string"
      ],
      "correctIndex": 1,
      "hint": "Look for the device that helps the archer draw the bow.",
      "explanation": "Slide 25 introduces compound bows using pulleys to achieve a labor-saving effect."
    }
  ]
};

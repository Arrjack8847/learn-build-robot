/** Level 4 quiz: authored from official 30-page Learning PDF text. */
import type { QuizBank } from "../../quizStudio";
export const obstacleAvoidingScorpionBank: QuizBank = {
  "projectId": "level-4-obstacle-avoiding-scorpion",
  "title": "Obstacle-avoiding Scorpion",
  "sourcePdfPath": "public/Level 4/Programming & Precise Control/Obstacle-avoiding Scorpion/01.Obstacle-avoiding Scorpion_Slides.pdf",
  "sourcePageCount": 30,
  "questions": [
    {
      "id": "l4-obstacle-avoiding-scorpion-01",
      "topic": "touch-sensor-navigation",
      "learningSlide": 6,
      "prompt": "What sensor controls the scorpion robot's obstacle reactions?",
      "choices": [
        "Ultrasonic echo",
        "Two touch sensors",
        "Temperature sensor",
        "GPS receiver"
      ],
      "correctIndex": 1,
      "explanation": "The model has touch sensors on its left and right sides.",
      "hint": "Consider how contact sensors detect obstacles."
    },
    {
      "id": "l4-obstacle-avoiding-scorpion-02",
      "topic": "touch-sensor-navigation",
      "learningSlide": 6,
      "prompt": "When neither touch sensor is pressed, what should the robot do?",
      "choices": [
        "Stay stopped",
        "Spin in place",
        "Move forward",
        "Move backwards forever"
      ],
      "correctIndex": 2,
      "explanation": "The task specifies moving forward with neither sensor pressed.",
      "hint": "Consider how contact sensors detect obstacles."
    },
    {
      "id": "l4-obstacle-avoiding-scorpion-03",
      "topic": "differential-driving",
      "learningSlide": 20,
      "prompt": "What happens when both drive wheels turn forward at equal speed?",
      "choices": [
        "The robot travels straight",
        "The robot rotates in place",
        "The robot reverses",
        "The robot stops"
      ],
      "correctIndex": 0,
      "explanation": "Equal forward wheel speeds produce straight movement.",
      "hint": "Think about how two wheel speeds affect direction."
    },
    {
      "id": "l4-obstacle-avoiding-scorpion-04",
      "topic": "differential-driving",
      "learningSlide": 20,
      "prompt": "How can a two-wheeled robot change direction without steering wheels?",
      "choices": [
        "By changing its battery size",
        "By changing the screen font",
        "By playing audio",
        "By varying the left and right wheel movement"
      ],
      "correctIndex": 3,
      "explanation": "Differential drive changes heading through wheel motion differences.",
      "hint": "Think about how two wheel speeds affect direction."
    },
    {
      "id": "l4-obstacle-avoiding-scorpion-05",
      "topic": "left-response",
      "learningSlide": 22,
      "prompt": "What is the scorpion's first action when the left touch sensor is pressed?",
      "choices": [
        "Move backward",
        "Drive forward faster",
        "Shut down",
        "Show a map"
      ],
      "correctIndex": 0,
      "explanation": "The left-sensor response starts by backing away.",
      "hint": "Trace the left-input branch of the flowchart."
    },
    {
      "id": "l4-obstacle-avoiding-scorpion-06",
      "topic": "left-response",
      "learningSlide": 22,
      "prompt": "After backing up from a left-side contact, which way does the robot turn?",
      "choices": [
        "Left",
        "Right",
        "Forward",
        "No direction"
      ],
      "correctIndex": 1,
      "explanation": "Slide 22 says it turns right after a left sensor press.",
      "hint": "Trace the left-input branch of the flowchart."
    },
    {
      "id": "l4-obstacle-avoiding-scorpion-07",
      "topic": "right-response",
      "learningSlide": 23,
      "prompt": "Which way does the scorpion turn after a right-side touch?",
      "choices": [
        "Straight ahead",
        "Right",
        "Left",
        "Backward only"
      ],
      "correctIndex": 2,
      "explanation": "Slide 23 assigns a left turn to a right touch.",
      "hint": "Trace the right-input branch of the flowchart."
    },
    {
      "id": "l4-obstacle-avoiding-scorpion-08",
      "topic": "right-response",
      "learningSlide": 23,
      "prompt": "What movement precedes that right-touch turn?",
      "choices": [
        "A brief backward move",
        "A forward sprint",
        "A full shutdown",
        "A jump"
      ],
      "correctIndex": 0,
      "explanation": "The right-sensor branch also backs up before changing heading.",
      "hint": "Trace the right-input branch of the flowchart."
    },
    {
      "id": "l4-obstacle-avoiding-scorpion-09",
      "topic": "forward-and-extension",
      "learningSlide": 24,
      "prompt": "Which input condition lets the scorpion continue driving straight?",
      "choices": [
        "Both touch sensors unpressed",
        "Either touch sensor pressed",
        "Right sensor permanently held",
        "Both motors stopped"
      ],
      "correctIndex": 0,
      "explanation": "The default branch moves forward without a touch input.",
      "hint": "Recall the default behavior when no button is pressed."
    },
    {
      "id": "l4-obstacle-avoiding-scorpion-10",
      "topic": "forward-and-extension",
      "learningSlide": 25,
      "prompt": "What additional start condition is proposed as an extension?",
      "choices": [
        "A voice command",
        "Both controller buttons pressed together",
        "A QR scan",
        "A temperature reading of 40"
      ],
      "correctIndex": 1,
      "explanation": "The extension asks students to start by pressing both buttons simultaneously.",
      "hint": "Recall the default behavior when no button is pressed."
    }
  ]
};

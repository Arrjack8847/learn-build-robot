/** Official Learning PDF text checked, source slides use 1-based page numbers. */
import type { QuizBank } from "../../quizStudio";

export const flashlightSensorBank: QuizBank = {
  "projectId": "level-3-flashlight-sensor",
  "title": "Flashlight Sensor",
  "sourcePdfPath": "public/Level 3/Learning/Illumination & Signals/Flashlight Sensor/04.Flashlight -Slides.pdf",
  "sourcePageCount": 29,
  "questions": [
    {
      "id": "flashlightsens-01",
      "topic": "purpose",
      "learningSlide": 3,
      "prompt": "What does a handheld flashlight help a user do?",
      "choices": [
        "Measure the weight of objects",
        "See in a dark location",
        "Control a vehicle's transmission",
        "Determine air pressure"
      ],
      "correctIndex": 1,
      "hint": "The device is designed for illumination.",
      "explanation": "Slide 3 presents flashlights as portable lighting devices."
    },
    {
      "id": "flashlightsens-02",
      "topic": "purpose",
      "learningSlide": 6,
      "prompt": "Which input starts the model flashlight's planned color sequence?",
      "choices": [
        "A detected high temperature",
        "The right motor's encoder",
        "The controller's left button",
        "An ultrasonic distance measurement"
      ],
      "correctIndex": 2,
      "hint": "The device is designed for illumination.",
      "explanation": "Slide 6 specifies the left controller button."
    },
    {
      "id": "flashlightsens-03",
      "topic": "buttons",
      "learningSlide": 16,
      "prompt": "What value does the button-status block return when its button is pressed?",
      "choices": [
        "0",
        "−1",
        "100",
        "1"
      ],
      "correctIndex": 3,
      "hint": "Button-status blocks give a numeric reading.",
      "explanation": "Slide 16 says the block returns 1 for a pressed button."
    },
    {
      "id": "flashlightsens-04",
      "topic": "buttons",
      "learningSlide": 16,
      "prompt": "What value signals that the controller button is not pressed?",
      "choices": [
        "0",
        "1",
        "100",
        "4095"
      ],
      "correctIndex": 0,
      "hint": "Button-status blocks give a numeric reading.",
      "explanation": "Slide 16 returns zero for an unpressed controller button."
    },
    {
      "id": "flashlightsens-05",
      "topic": "branches",
      "learningSlide": 17,
      "prompt": "When does a single-branch program execute its contained action?",
      "choices": [
        "Regardless of condition",
        "Only when its condition is met",
        "Only when the controller is disconnected",
        "Only after the whole program ends"
      ],
      "correctIndex": 1,
      "hint": "Program execution can depend on a logical condition.",
      "explanation": "Slide 17 says a single branch executes when its condition is satisfied."
    },
    {
      "id": "flashlightsens-06",
      "topic": "branches",
      "learningSlide": 18,
      "prompt": "Which block implements the lesson's simple conditional choice?",
      "choices": [
        "Repeat forever without a condition",
        "Set motor speed",
        "If…then",
        "Display ultrasonic distance"
      ],
      "correctIndex": 2,
      "hint": "Program execution can depend on a logical condition.",
      "explanation": "Slide 18 introduces the if-then control block."
    },
    {
      "id": "flashlightsens-07",
      "topic": "sequence",
      "learningSlide": 21,
      "prompt": "What light color appears first after pressing the left button?",
      "choices": [
        "Yellow",
        "Blue",
        "Red",
        "White"
      ],
      "correctIndex": 3,
      "hint": "The task changes the lamp color before switching off.",
      "explanation": "Slide 21 starts with white light for three seconds."
    },
    {
      "id": "flashlightsens-08",
      "topic": "sequence",
      "learningSlide": 21,
      "prompt": "How long is the yellow light shown before the lamp switches off?",
      "choices": [
        "2 seconds",
        "3 seconds",
        "5 seconds",
        "10 seconds"
      ],
      "correctIndex": 0,
      "hint": "The task changes the lamp color before switching off.",
      "explanation": "Slide 21 gives yellow light for two seconds after white."
    },
    {
      "id": "flashlightsens-09",
      "topic": "code",
      "learningSlide": 22,
      "prompt": "Which programming block is added above the if-then module in the second task?",
      "choices": [
        "Ultrasonic ranging module",
        "RCU task block",
        "Motor power percentage block",
        "Sound recorder block"
      ],
      "correctIndex": 1,
      "hint": "Consider whether the branch is checked as the program runs.",
      "explanation": "Slide 22 asks students to add an RCU task block above the conditional."
    },
    {
      "id": "flashlightsens-10",
      "topic": "code",
      "learningSlide": 19,
      "prompt": "Where should the condition be inserted in an if-then block?",
      "choices": [
        "Only after the whole program stops",
        "Inside an unrelated motor connection",
        "In the conditional judgment slot",
        "Into the printed task title"
      ],
      "correctIndex": 2,
      "hint": "Consider whether the branch is checked as the program runs.",
      "explanation": "Slide 19 demonstrates placing a judgment block in the condition slot."
    }
  ]
};

import type { QuizBank } from "../../quizStudio";
/** Source-grounded Level 6 quiz; original 22-page Learning PDF. */
export const smartElectricDrillBank: QuizBank = {
  "projectId": "level-6-smart-electric-drill",
  "title": "Smart Electric Drill",
  "sourcePdfPath": "public/Level 6/Learning/Programming & Precise Control/Smart Electric Drill/20. Smart Electric Drill-Teaching Slides.pdf",
  "sourcePageCount": 22,
  "questions": [
    {
      "id": "sed-01",
      "topic": "atmospheric-pressure",
      "learningSlide": 9,
      "prompt": "Which environmental measurement can help estimate altitude?",
      "choices": [
        "Atmospheric pressure",
        "A QR-code value",
        "Motor gear number",
        "A product price"
      ],
      "correctIndex": 0,
      "hint": "Pressure changes with height.",
      "explanation": "Slide 9 links atmospheric pressure and altitude."
    },
    {
      "id": "sed-02",
      "topic": "atmospheric-pressure",
      "learningSlide": 10,
      "prompt": "What physical condition is used to automatically stop the lesson's drill?",
      "choices": [
        "A coloured ball moving left",
        "Atmospheric pressure reaching its target",
        "An approved QR-code scan",
        "A film reaching 24 frames"
      ],
      "correctIndex": 1,
      "hint": "The drill uses a pressure-related stopping condition.",
      "explanation": "Slide 10 introduces a drill controlled by atmospheric pressure."
    },
    {
      "id": "sed-03",
      "topic": "sensor-controlled-drill",
      "learningSlide": 12,
      "prompt": "Which sensor is included in the drill model?",
      "choices": [
        "Gesture-only camera",
        "Photoelectric ring sensor",
        "Barometric sensor",
        "Barcode reader"
      ],
      "correctIndex": 2,
      "hint": "It measures surrounding air pressure.",
      "explanation": "Slide 12 labels the barometric sensor."
    },
    {
      "id": "sed-04",
      "topic": "sensor-controlled-drill",
      "learningSlide": 14,
      "prompt": "What does the program first read as its reference altitude value?",
      "choices": [
        "The last card balance",
        "The frame index",
        "The amount of light on the screen",
        "The current atmospheric pressure"
      ],
      "correctIndex": 3,
      "hint": "The model uses relative pressure as its altitude value.",
      "explanation": "Slide 14 reads the current pressure-derived value."
    },
    {
      "id": "sed-05",
      "topic": "rotation-conditions",
      "learningSlide": 15,
      "prompt": "What starts the drill rotating in the lesson?",
      "choices": [
        "Touch input",
        "A successful QR payment",
        "Pressing a classroom bell",
        "A camera recognizing a gesture"
      ],
      "correctIndex": 0,
      "hint": "The user activates the model manually.",
      "explanation": "Slide 15 starts rotation after touch."
    },
    {
      "id": "sed-06",
      "topic": "rotation-conditions",
      "learningSlide": 15,
      "prompt": "In which target-difference range does the drill stop?",
      "choices": [
        "Between 20 and 50",
        "Between -2 and 2",
        "Between 100 and 200",
        "Between 240 and 360"
      ],
      "correctIndex": 1,
      "hint": "The drill stops near the selected pressure target.",
      "explanation": "Slide 15 uses the -2 to 2 stopping range."
    },
    {
      "id": "sed-07",
      "topic": "target-adjustment",
      "learningSlide": 16,
      "prompt": "What does the left button do to the adjusted target altitude?",
      "choices": [
        "Decrease it by one",
        "Reset every value to zero",
        "Increase it by one",
        "Increase it by ten"
      ],
      "correctIndex": 2,
      "hint": "The buttons change the target in opposite directions.",
      "explanation": "Slide 16 makes the left button add one."
    },
    {
      "id": "sed-08",
      "topic": "target-adjustment",
      "learningSlide": 16,
      "prompt": "How is the final target altitude calculated?",
      "choices": [
        "Frame rate multiplied by two",
        "Motor number divided by ten",
        "Current altitude minus motor voltage",
        "Current altitude plus the adjusted value"
      ],
      "correctIndex": 3,
      "hint": "The target combines a live reference and an adjustment.",
      "explanation": "Slide 16 adds current and adjusted altitude values."
    },
    {
      "id": "sed-09",
      "topic": "button-upgrade",
      "learningSlide": 20,
      "prompt": "What should be improved about the drill's button behaviour?",
      "choices": [
        "Change by exactly one for each completed press",
        "Change continuously while the button remains held",
        "Stop responding after the first use",
        "Change by ten every second"
      ],
      "correctIndex": 0,
      "hint": "One deliberate press should give one step.",
      "explanation": "Slide 20 asks for one increment or decrement per press."
    },
    {
      "id": "sed-10",
      "topic": "button-upgrade",
      "learningSlide": 20,
      "prompt": "What original function should remain after the button improvement?",
      "choices": [
        "Play photographs in reverse",
        "Stop drilling when the pressure target is reached",
        "Recognize banana colour",
        "Lock a QR-code gate"
      ],
      "correctIndex": 1,
      "hint": "The expansion keeps pressure-controlled stopping.",
      "explanation": "Slide 20 preserves the drill stop logic while refining buttons."
    }
  ]
};

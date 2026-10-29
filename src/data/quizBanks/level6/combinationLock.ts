import type { QuizBank } from "../../quizStudio";
/** Source-grounded Level 6 quiz; original 23-page Learning PDF. */
export const combinationLockBank: QuizBank = {
  "projectId": "level-6-combination-lock",
  "title": "Combination Lock",
  "sourcePdfPath": "public/Level 6/Learning/Mechanisms & Simulators/Combination Lock/29.Combination Lock -Slides.pdf",
  "sourcePageCount": 23,
  "questions": [
    {
      "id": "col-01",
      "topic": "lock-types",
      "learningSlide": 7,
      "prompt": "What is a feature of a mechanical dial combination lock?",
      "choices": [
        "It works without batteries or an electrical supply",
        "It requires an AI vision camera",
        "It opens using mobile GPS",
        "It must connect to a Wi-Fi router"
      ],
      "correctIndex": 0,
      "hint": "Think about what makes the lock mechanical.",
      "explanation": "Slide 7 describes battery-free mechanical dial locks."
    },
    {
      "id": "col-02",
      "topic": "lock-types",
      "learningSlide": 8,
      "prompt": "What can electronic combination locks allow users to change?",
      "choices": [
        "The laws of physics",
        "Their passwords",
        "The screen's physical size",
        "The road recognition offset"
      ],
      "correctIndex": 1,
      "hint": "Electronic locks can change credentials.",
      "explanation": "Slide 8 lists password changeability as a feature."
    },
    {
      "id": "col-03",
      "topic": "module-wiring",
      "learningSlide": 11,
      "prompt": "Which controller port is used for the AI vision module?",
      "choices": [
        "M1",
        "M2",
        "P8",
        "A wheel axle"
      ],
      "correctIndex": 2,
      "hint": "The module detects tag codes rather than driving the motor.",
      "explanation": "Slide 11 connects the vision module to P8."
    },
    {
      "id": "col-04",
      "topic": "module-wiring",
      "learningSlide": 13,
      "prompt": "Which recognition mode should the module use for this lock?",
      "choices": [
        "Road following",
        "Temperature measurement",
        "Wind-direction measurement",
        "Tag-code recognition"
      ],
      "correctIndex": 3,
      "hint": "The lock scans identification tags.",
      "explanation": "Slide 13 sets tag-code recognition mode."
    },
    {
      "id": "col-05",
      "topic": "password-input",
      "learningSlide": 13,
      "prompt": "Which two-digit password is initially set in the lesson?",
      "choices": [
        "2 then 1",
        "1 then 2",
        "0 then 0",
        "9 then 9"
      ],
      "correctIndex": 0,
      "hint": "The lesson gives a specific example sequence.",
      "explanation": "Slide 13 initializes the two-digit password as 2, 1."
    },
    {
      "id": "col-06",
      "topic": "password-input",
      "learningSlide": 15,
      "prompt": "What does the order variable indicate?",
      "choices": [
        "The rotation speed of the lock",
        "How many password items have been entered",
        "The camera's zoom factor",
        "The battery's temperature"
      ],
      "correctIndex": 1,
      "hint": "It advances after each stored entry.",
      "explanation": "Slide 15 uses order to distinguish the first and second entries."
    },
    {
      "id": "col-07",
      "topic": "unlock-logic",
      "learningSlide": 16,
      "prompt": "When does the lock run its unlock-or-alarm function?",
      "choices": [
        "When order is less than 0",
        "When the camera is off",
        "When order equals 2",
        "Immediately before the first code"
      ],
      "correctIndex": 2,
      "hint": "The two-code input must be complete.",
      "explanation": "Slide 16 triggers the decision when order is 2."
    },
    {
      "id": "col-08",
      "topic": "unlock-logic",
      "learningSlide": 17,
      "prompt": "What happens if either entered code does not match the preset password?",
      "choices": [
        "The lock opens anyway",
        "The program changes the password automatically",
        "The motor starts a road-following route",
        "The lock sounds an alarm"
      ],
      "correctIndex": 3,
      "hint": "Both code entries must match.",
      "explanation": "Slide 17 sounds the alarm for an incorrect two-code password."
    },
    {
      "id": "col-09",
      "topic": "reset-and-extension",
      "learningSlide": 18,
      "prompt": "Why does the program clear the two entered password values and order?",
      "choices": [
        "To prepare the lock for a new attempt",
        "To change the physical lock body",
        "To delete the lesson's PDF",
        "To turn the AI camera into a motor"
      ],
      "correctIndex": 0,
      "hint": "Old attempts should not affect the next one.",
      "explanation": "Slide 18 resets the stored entry values and order to zero."
    },
    {
      "id": "col-10",
      "topic": "reset-and-extension",
      "learningSlide": 21,
      "prompt": "What alternative input method is suggested for the expansion?",
      "choices": [
        "Use a humidity sensor as the keypad",
        "Use left and right buttons to enter the password",
        "Use only motor speed as a password",
        "Remove all password checks"
      ],
      "correctIndex": 1,
      "hint": "The task changes how students submit a code.",
      "explanation": "Slide 21 proposes entering a password with the left and right buttons."
    }
  ]
};

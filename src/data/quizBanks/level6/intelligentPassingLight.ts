import type { QuizBank } from "../../quizStudio";
/** Source-grounded Level 6 quiz; original 21-page Learning PDF. */
export const intelligentPassingLightBank: QuizBank = {
  "projectId": "level-6-intelligent-passing-light",
  "title": "Intelligent Passing Light",
  "sourcePdfPath": "public/Level 6/Learning/Automation & Security/Intelligent Passing Light/09. Intelligent Passing Light-Teaching Slides.pdf",
  "sourcePageCount": 21,
  "questions": [
    {
      "id": "ipl-01",
      "topic": "access-principle",
      "learningSlide": 9,
      "prompt": "When does the passing light permit travel through the checkpoint?",
      "choices": [
        "When it scans an allowed QR code",
        "Whenever any unknown code is scanned",
        "Only when a motor reaches full speed",
        "Whenever the screen is blank"
      ],
      "correctIndex": 0,
      "hint": "Registered codes are accepted.",
      "explanation": "Slide 9 allows passing for recognised permitted QR codes."
    },
    {
      "id": "ipl-02",
      "topic": "access-principle",
      "learningSlide": 12,
      "prompt": "What is the access rule for unregistered QR codes?",
      "choices": [
        "Always open the gate",
        "Do not allow passing",
        "Increase the allowed list automatically",
        "Ignore the scan and turn off both lights"
      ],
      "correctIndex": 1,
      "hint": "An unregistered value is not on the approved list.",
      "explanation": "Slide 12 rejects an unregistered code."
    },
    {
      "id": "ipl-03",
      "topic": "hardware",
      "learningSlide": 11,
      "prompt": "Which device reads a code for the passing-light model?",
      "choices": [
        "Ultrasonic sensor",
        "Thermometer",
        "Scanning camera",
        "Motor encoder"
      ],
      "correctIndex": 2,
      "hint": "The input is a QR code.",
      "explanation": "Slide 11 labels a scanning camera."
    },
    {
      "id": "ipl-04",
      "topic": "hardware",
      "learningSlide": 11,
      "prompt": "Which output can show access information as text?",
      "choices": [
        "Rain gauge",
        "Mechanical gearbox",
        "Battery charger",
        "Dot matrix screen"
      ],
      "correctIndex": 3,
      "hint": "Look for a device that displays characters.",
      "explanation": "Slide 11 includes a dot-matrix display."
    },
    {
      "id": "ipl-05",
      "topic": "registration-list",
      "learningSlide": 13,
      "prompt": "Which values are initially registered as allowed?",
      "choices": [
        "1 and 2",
        "999 and 65488",
        "100 and 200",
        "3 and 9"
      ],
      "correctIndex": 0,
      "hint": "The initialization adds two small numbers.",
      "explanation": "Slide 13 adds 1 and 2 to the list."
    },
    {
      "id": "ipl-06",
      "topic": "registration-list",
      "learningSlide": 15,
      "prompt": "Which light means Access Allowed?",
      "choices": [
        "Red",
        "Green",
        "No light ever",
        "Blue flashing continuously"
      ],
      "correctIndex": 1,
      "hint": "The model uses standard traffic colours.",
      "explanation": "Slide 15 turns on green for registered values."
    },
    {
      "id": "ipl-07",
      "topic": "invalid-input",
      "learningSlide": 14,
      "prompt": "Which pair of scan values is treated as invalid data?",
      "choices": [
        "1 and 2",
        "3 and 4",
        "999 and 65488",
        "10 and 20"
      ],
      "correctIndex": 2,
      "hint": "These are filtered before registration checking.",
      "explanation": "Slide 14 excludes 999 and 65488."
    },
    {
      "id": "ipl-08",
      "topic": "invalid-input",
      "learningSlide": 15,
      "prompt": "What does the display show when the scanned code is not on the list?",
      "choices": [
        "Access Allowed",
        "Learning Complete",
        "Road Centered",
        "No Passing"
      ],
      "correctIndex": 3,
      "hint": "The code was not registered.",
      "explanation": "Slide 15 shows red with a no-passing message."
    },
    {
      "id": "ipl-09",
      "topic": "gate-extension",
      "learningSlide": 19,
      "prompt": "What new mechanism is added in the optimization task?",
      "choices": [
        "A physical gate",
        "A new rainfall detector",
        "A wind-speed turbine",
        "An infrared shooting target"
      ],
      "correctIndex": 0,
      "hint": "The lights now also control a barrier.",
      "explanation": "Slide 19 asks students to add a gate structure."
    },
    {
      "id": "ipl-10",
      "topic": "gate-extension",
      "learningSlide": 19,
      "prompt": "When should the upgraded gate be closed?",
      "choices": [
        "When a registered QR code is accepted",
        "When access is not allowed",
        "Whenever the green light is on",
        "Only after unplugging the camera"
      ],
      "correctIndex": 1,
      "hint": "The gate follows the permission decision.",
      "explanation": "Slide 19 requires closing the gate when passing is prohibited."
    }
  ]
};

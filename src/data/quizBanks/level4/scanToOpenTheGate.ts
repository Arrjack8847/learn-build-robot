/** Level 4 quiz based on official 28-page Learning PDF. */
import type { QuizBank } from "../../quizStudio";
export const scanToOpenTheGateBank: QuizBank = {
  "projectId": "level-4-scan-to-open-the-gate",
  "title": "Scan to Open the Gate",
  "sourcePdfPath": "public/Level 4/Automation & Security/Scan to Open the Gate/01. Scan to Open the Gate-Slides.pdf",
  "sourcePageCount": 28,
  "questions": [
    {
      "id": "l4-scan-to-open-the-gate-01",
      "topic": "barcode-basics",
      "learningSlide": 8,
      "prompt": "What is a barcode used to represent?",
      "choices": [
        "Machine-readable data",
        "Only a music melody",
        "Only the motor's speed",
        "A screen's brightness"
      ],
      "correctIndex": 0,
      "explanation": "The lesson describes barcodes as visual machine-readable data.",
      "hint": "Consider how a machine reads printed patterns."
    },
    {
      "id": "l4-scan-to-open-the-gate-02",
      "topic": "barcode-basics",
      "learningSlide": 5,
      "prompt": "What was a common early use of barcodes?",
      "choices": [
        "Controlling robotic arms",
        "Recording supermarket sales",
        "Measuring wind",
        "Displaying animation"
      ],
      "correctIndex": 1,
      "explanation": "The history section mentions automatic recording of commodity sales.",
      "hint": "Consider how a machine reads printed patterns."
    },
    {
      "id": "l4-scan-to-open-the-gate-03",
      "topic": "qr-information",
      "learningSlide": 10,
      "prompt": "What does QR stand for in QR code?",
      "choices": [
        "Quick Response",
        "Quality Robot",
        "Quiet Reading",
        "Quick Rotation"
      ],
      "correctIndex": 0,
      "explanation": "The lesson gives Quick Response as the full form.",
      "hint": "Think about the QR code's purpose."
    },
    {
      "id": "l4-scan-to-open-the-gate-04",
      "topic": "qr-information",
      "learningSlide": 9,
      "prompt": "Which information might appear in a machine-readable product code?",
      "choices": [
        "Only its weight",
        "Only a color",
        "Product or manufacturer information",
        "Only a motor port"
      ],
      "correctIndex": 2,
      "explanation": "The lesson lists commodity and manufacturer details among code information.",
      "hint": "Think about the QR code's purpose."
    },
    {
      "id": "l4-scan-to-open-the-gate-05",
      "topic": "scanning-camera",
      "learningSlide": 11,
      "prompt": "Which device is used to read QR codes in the project?",
      "choices": [
        "Temperature sensor",
        "Ultrasonic ranger",
        "Microphone",
        "Scanning camera"
      ],
      "correctIndex": 3,
      "explanation": "The project uses a scanning camera.",
      "hint": "Recall what the camera recognizes."
    },
    {
      "id": "l4-scan-to-open-the-gate-06",
      "topic": "scanning-camera",
      "learningSlide": 11,
      "prompt": "What approximate scanning range is listed for the camera?",
      "choices": [
        "5–18 cm",
        "1–2 m",
        "50–100 m",
        "100–200 cm"
      ],
      "correctIndex": 0,
      "explanation": "Slide 11 states a scanning range around 5–18 centimeters.",
      "hint": "Recall what the camera recognizes."
    },
    {
      "id": "l4-scan-to-open-the-gate-07",
      "topic": "gate-logic",
      "learningSlide": 16,
      "prompt": "What happens when the specified valid code is recognized?",
      "choices": [
        "The robot resets the clock",
        "The barrier gate opens",
        "The device erases all codes",
        "The motor is permanently disabled"
      ],
      "correctIndex": 1,
      "explanation": "The flowchart opens the gate for the designated code.",
      "hint": "Follow the accept-or-reject branch."
    },
    {
      "id": "l4-scan-to-open-the-gate-08",
      "topic": "gate-logic",
      "learningSlide": 21,
      "prompt": "After a valid scan opens the barrier, what happens next?",
      "choices": [
        "The gate stays permanently open",
        "It plays a piano melody only",
        "It waits one second and lowers the barrier",
        "The camera disconnects"
      ],
      "correctIndex": 2,
      "explanation": "The program lifts the barrier, waits one second, then lowers it.",
      "hint": "Follow the accept-or-reject branch."
    },
    {
      "id": "l4-scan-to-open-the-gate-09",
      "topic": "sensor-values",
      "learningSlide": 20,
      "prompt": "What value marks unrecognized QR data in this project?",
      "choices": [
        "0",
        "1",
        "255",
        "999"
      ],
      "correctIndex": 3,
      "explanation": "The programming slide treats 999 as unrecognized input.",
      "hint": "Compare valid codes with the missing-code state."
    },
    {
      "id": "l4-scan-to-open-the-gate-10",
      "topic": "sensor-values",
      "learningSlide": 20,
      "prompt": "Which indicator tells someone that passing is prohibited?",
      "choices": [
        "Red light",
        "Green light",
        "A blue arrow",
        "A flashing page number"
      ],
      "correctIndex": 0,
      "explanation": "The gate shows a red light if scan data is not recognized.",
      "hint": "Compare valid codes with the missing-code state."
    }
  ]
};

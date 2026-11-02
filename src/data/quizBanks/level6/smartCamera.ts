import type { QuizBank } from "../../quizStudio";
/** Source-grounded Level 6 quiz; original 25-page Learning PDF. */
export const smartCameraBank: QuizBank = {
  "projectId": "level-6-smart-camera",
  "title": "Smart Camera",
  "sourcePdfPath": "public/Level 6/Learning/Sensor-Focused Robots/Smart Camera/22.Smart Camera-Slides.pdf",
  "sourcePageCount": 25,
  "questions": [
    {
      "id": "scm-01",
      "topic": "face-coordinates",
      "learningSlide": 7,
      "prompt": "Which values help the smart camera locate a face on its screen?",
      "choices": [
        "X and Y coordinates",
        "Motor torque and current",
        "Humidity and pressure",
        "Password and balance"
      ],
      "correctIndex": 0,
      "hint": "A face is located horizontally and vertically.",
      "explanation": "Slide 7 returns face X and Y coordinates."
    },
    {
      "id": "scm-02",
      "topic": "face-coordinates",
      "learningSlide": 8,
      "prompt": "Where is coordinate (0, 0) on the AI camera's screen?",
      "choices": [
        "Lower-right corner",
        "Upper-left corner",
        "Exact middle",
        "Outside the screen"
      ],
      "correctIndex": 1,
      "hint": "The origin begins in a screen corner.",
      "explanation": "Slide 8 places (0,0) at the top left."
    },
    {
      "id": "scm-03",
      "topic": "recognition",
      "learningSlide": 9,
      "prompt": "What indicates a detected face on the AI vision display?",
      "choices": [
        "A red traffic light",
        "A QR payment code",
        "A green box around the face",
        "A motor gear counter"
      ],
      "correctIndex": 2,
      "hint": "The camera highlights what it recognized.",
      "explanation": "Slide 9 shows a green face-detection box."
    },
    {
      "id": "scm-04",
      "topic": "recognition",
      "learningSlide": 8,
      "prompt": "What is the X-coordinate range for this face-tracking lesson?",
      "choices": [
        "0 to 10",
        "100 to 999",
        "-360 to 360",
        "0 to 240"
      ],
      "correctIndex": 3,
      "hint": "The screen's horizontal dimension has 240 units.",
      "explanation": "Slide 8 specifies horizontal coordinates from 0 to 240."
    },
    {
      "id": "scm-05",
      "topic": "hardware",
      "learningSlide": 13,
      "prompt": "Which controller port connects the AI vision sensor?",
      "choices": [
        "P8",
        "M1",
        "M2",
        "M4"
      ],
      "correctIndex": 0,
      "hint": "The vision module uses a sensor interface.",
      "explanation": "Slide 13 connects AI vision to P8."
    },
    {
      "id": "scm-06",
      "topic": "hardware",
      "learningSlide": 13,
      "prompt": "Where does the smart-camera rotation motor connect?",
      "choices": [
        "P8",
        "M1",
        "P2",
        "A speaker jack"
      ],
      "correctIndex": 1,
      "hint": "The motor drives camera rotation.",
      "explanation": "Slide 13 connects the motor to M1."
    },
    {
      "id": "scm-07",
      "topic": "tracking-speed",
      "learningSlide": 18,
      "prompt": "What happens if the detected face coordinate X equals zero?",
      "choices": [
        "The motor rotates at maximum speed",
        "The controller counts down from 99",
        "The camera does not move",
        "The screen prints a payment receipt"
      ],
      "correctIndex": 2,
      "hint": "Zero is treated as no tracking movement.",
      "explanation": "Slide 18 keeps the camera still for X=0."
    },
    {
      "id": "scm-08",
      "topic": "tracking-speed",
      "learningSlide": 20,
      "prompt": "Why is coefficient K1 introduced?",
      "choices": [
        "To increase camera size",
        "To convert colours into prices",
        "To stop all image recognition",
        "To slow down the camera's tracking rotation"
      ],
      "correctIndex": 3,
      "hint": "A smaller control gain reduces overshooting.",
      "explanation": "Slide 20 applies K1 to slow the following rotation."
    },
    {
      "id": "scm-09",
      "topic": "colour-expansion",
      "learningSlide": 23,
      "prompt": "What new visual effect is requested when the camera sees a face?",
      "choices": [
        "Turn the display green",
        "Show a product price",
        "Open a door lock",
        "Start a pinball game"
      ],
      "correctIndex": 0,
      "hint": "The screen confirms successful detection.",
      "explanation": "Slide 23 asks for a green screen on recognized faces."
    },
    {
      "id": "scm-10",
      "topic": "colour-expansion",
      "learningSlide": 16,
      "prompt": "What initial value is given to the tracking coefficient K1?",
      "choices": [
        "3",
        "0.3",
        "30",
        "240"
      ],
      "correctIndex": 1,
      "hint": "The coefficient is less than one to limit speed.",
      "explanation": "Slide 16 sets K1 to 0.3."
    }
  ]
};

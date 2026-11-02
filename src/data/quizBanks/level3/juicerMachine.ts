/** Official Learning PDF text checked, source slides use 1-based page numbers. */
import type { QuizBank } from "../../quizStudio";

export const juicerMachineBank: QuizBank = {
  "projectId": "level-3-juicer-machine",
  "title": "Juicer Machine",
  "sourcePdfPath": "public/Level 3/Learning/Interactive Systems/Juicer Machine/06.Juicer Machine-Slides.pdf",
  "sourcePageCount": 29,
  "questions": [
    {
      "id": "juicermachine-01",
      "topic": "blender",
      "learningSlide": 5,
      "prompt": "What makes the high-speed blender cut fruit?",
      "choices": [
        "An ultrasonic probe alone",
        "A fixed wheel with no movement",
        "A slow-moving display",
        "Motor-driven rotating blades"
      ],
      "correctIndex": 3,
      "hint": "Consider how a powered kitchen appliance cuts fruit.",
      "explanation": "Slide 5 describes a motor driving blades to cut fruit."
    },
    {
      "id": "juicermachine-02",
      "topic": "blender",
      "learningSlide": 3,
      "prompt": "What is the main purpose of a juicer described in the lesson?",
      "choices": [
        "Extract juice from fruit",
        "Weigh small objects with a lever",
        "Raise an extendable ladder",
        "Track a black line"
      ],
      "correctIndex": 0,
      "hint": "Consider how a powered kitchen appliance cuts fruit.",
      "explanation": "Slide 3 introduces juicers as machines for extracting juice."
    },
    {
      "id": "juicermachine-03",
      "topic": "touch",
      "learningSlide": 8,
      "prompt": "Which two states can the touch probe detect?",
      "choices": [
        "Light and dark",
        "Pressed and released",
        "Hot and cold",
        "Forward and backward motor direction"
      ],
      "correctIndex": 1,
      "hint": "A touch probe reports whether it is pressed.",
      "explanation": "Slide 8 describes touch sensors recognizing pressed and released states."
    },
    {
      "id": "juicermachine-04",
      "topic": "touch",
      "learningSlide": 20,
      "prompt": "What signal does the touch detection block return when pressed?",
      "choices": [
        "0",
        "−100",
        "1",
        "4095"
      ],
      "correctIndex": 2,
      "hint": "A touch probe reports whether it is pressed.",
      "explanation": "Slide 20 returns 1 when the selected sensor is pressed."
    },
    {
      "id": "juicermachine-05",
      "topic": "motor",
      "learningSlide": 21,
      "prompt": "What speed does a left-button press set for motor M1?",
      "choices": [
        "0",
        "80",
        "100",
        "50"
      ],
      "correctIndex": 3,
      "hint": "The project selects different motor speeds using two inputs.",
      "explanation": "Slide 21 runs M1 at speed 50 in the left-button task."
    },
    {
      "id": "juicermachine-06",
      "topic": "motor",
      "learningSlide": 22,
      "prompt": "What speed is programmed for the touch-sensor high-speed task?",
      "choices": [
        "80",
        "20",
        "50",
        "0"
      ],
      "correctIndex": 0,
      "hint": "The project selects different motor speeds using two inputs.",
      "explanation": "Slide 22 sets M1 to speed 80 after touch."
    },
    {
      "id": "juicermachine-07",
      "topic": "timing",
      "learningSlide": 7,
      "prompt": "What should happen to the model blades when the touch sensor is released?",
      "choices": [
        "They continue at full speed",
        "They stop",
        "They rotate in reverse forever",
        "They switch to medium speed automatically"
      ],
      "correctIndex": 1,
      "hint": "The program must allow the motor time to move.",
      "explanation": "Slide 7 specifies that releasing touch stops blade rotation."
    },
    {
      "id": "juicermachine-08",
      "topic": "timing",
      "learningSlide": 23,
      "prompt": "Why is a short wait such as 0.2 seconds useful after starting the motor?",
      "choices": [
        "It increases the light sensor range",
        "It changes the sensor port assignment",
        "It allows the motor to rotate long enough before the next stop",
        "It removes the motor's speed limit"
      ],
      "correctIndex": 2,
      "hint": "The program must allow the motor time to move.",
      "explanation": "Slide 23 explains that rapid program execution may stop the motor almost immediately without a wait."
    },
    {
      "id": "juicermachine-09",
      "topic": "test",
      "learningSlide": 9,
      "prompt": "Which controller ports can be used by the touch sensor?",
      "choices": [
        "M1–M4 only",
        "Speaker output only",
        "Power switch terminals",
        "P1–P8"
      ],
      "correctIndex": 3,
      "hint": "The controller provides a dedicated check for touch inputs.",
      "explanation": "Slide 9 lists the composite sensor ports P1–P8."
    },
    {
      "id": "juicermachine-10",
      "topic": "test",
      "learningSlide": 10,
      "prompt": "Which built-in interface is used to test whether touch presses are detected?",
      "choices": [
        "Touch",
        "Gray",
        "Ultrasonic",
        "Motor"
      ],
      "correctIndex": 0,
      "hint": "The controller provides a dedicated check for touch inputs.",
      "explanation": "Slide 10 instructs opening the Touch test interface."
    }
  ]
};

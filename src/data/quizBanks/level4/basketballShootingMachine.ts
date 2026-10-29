/** Level 4 quiz: authored from the official 38-page Learning PDF. */
import type { QuizBank } from "../../quizStudio";

export const basketballShootingMachineBank: QuizBank = {
  "projectId": "level-4-basketball-shooting-machine",
  "title": "Basketball Shooting Machine",
  "sourcePdfPath": "public/Level 4/Interactive Systems/Basketball Shooting Machine/27.Basketball Shooting Machine -Slides.pdf",
  "sourcePageCount": 38,
  "questions": [
    {
      "id": "l4-basketball-shooting-machine-01",
      "topic": "project-operation",
      "learningSlide": 5,
      "prompt": "Which controls operate the lesson's desktop basketball shooting machine?",
      "choices": [
        "Left and right buttons",
        "A steering wheel",
        "Only the microphone",
        "A wireless joystick"
      ],
      "correctIndex": 0,
      "explanation": "The project uses the controller's left and right buttons.",
      "hint": "Recall the two controller buttons."
    },
    {
      "id": "l4-basketball-shooting-machine-02",
      "topic": "project-operation",
      "learningSlide": 5,
      "prompt": "What happens to controller time when the left button resets the machine?",
      "choices": [
        "It doubles",
        "It resets to zero",
        "It records a score",
        "It becomes negative"
      ],
      "correctIndex": 1,
      "explanation": "The left button resets the machine and the controller timer.",
      "hint": "Recall the two controller buttons."
    },
    {
      "id": "l4-basketball-shooting-machine-03",
      "topic": "threshold-meaning",
      "learningSlide": 23,
      "prompt": "What is a threshold?",
      "choices": [
        "A motor's color",
        "A robot's name",
        "A critical boundary between states",
        "An audio file"
      ],
      "correctIndex": 2,
      "explanation": "The lesson defines a threshold as a critical or limit value between states.",
      "hint": "Think about the boundary between two states."
    },
    {
      "id": "l4-basketball-shooting-machine-04",
      "topic": "threshold-meaning",
      "learningSlide": 23,
      "prompt": "In the lesson's water example, what is the freezing threshold?",
      "choices": [
        "0 °C",
        "25 °C",
        "80 °C",
        "140 °C"
      ],
      "correctIndex": 0,
      "explanation": "Slide 23 uses zero degrees Celsius as the freezing threshold example.",
      "hint": "Think about the boundary between two states."
    },
    {
      "id": "l4-basketball-shooting-machine-05",
      "topic": "sensor-testing",
      "learningSlide": 24,
      "prompt": "How does the student obtain the ball sensor's threshold?",
      "choices": [
        "Guess from the motor sound",
        "Test readings with and without a ball",
        "Count the controller buttons",
        "Change the screen color"
      ],
      "correctIndex": 1,
      "explanation": "The test compares photoelectric readings with a ball placed in the basket.",
      "hint": "Compare readings with and without a ball."
    },
    {
      "id": "l4-basketball-shooting-machine-06",
      "topic": "sensor-testing",
      "learningSlide": 25,
      "prompt": "Which normal light reading is reported during the test?",
      "choices": [
        "About 5",
        "About 140",
        "About 80",
        "About 500"
      ],
      "correctIndex": 2,
      "explanation": "Slide 25 reports a normal reading around 80.",
      "hint": "Compare readings with and without a ball."
    },
    {
      "id": "l4-basketball-shooting-machine-07",
      "topic": "threshold-programming",
      "learningSlide": 25,
      "prompt": "What does a light reading above 140 mean in the lesson's test?",
      "choices": [
        "No ball is near the machine",
        "The controller is off",
        "The left button is pressed",
        "A ball has entered the basket"
      ],
      "correctIndex": 3,
      "explanation": "The recorded sensor values are greater than 140 when the ball enters.",
      "hint": "Recall where the sensor threshold is configured."
    },
    {
      "id": "l4-basketball-shooting-machine-08",
      "topic": "threshold-programming",
      "learningSlide": 26,
      "prompt": "Where is the photoelectric threshold adjusted?",
      "choices": [
        "In the controller's built-in Gray test interface",
        "By replacing the wheels",
        "In the music player",
        "On the battery case"
      ],
      "correctIndex": 0,
      "explanation": "Slide 26 directs students to the Gray test interface and P1 light value.",
      "hint": "Recall where the sensor threshold is configured."
    },
    {
      "id": "l4-basketball-shooting-machine-09",
      "topic": "math-and-display",
      "learningSlide": 27,
      "prompt": "What value does the digital light-sensor block return when its stated less-than-threshold condition is met?",
      "choices": [
        "0",
        "1",
        "-1",
        "100"
      ],
      "correctIndex": 1,
      "explanation": "The block description returns 1 when the comparison is true.",
      "hint": "Consider the purpose of processing numeric readings."
    },
    {
      "id": "l4-basketball-shooting-machine-10",
      "topic": "math-and-display",
      "learningSlide": 28,
      "prompt": "What does the division coding block do?",
      "choices": [
        "Compare two images",
        "Rotate a motor",
        "Divide two numerical values",
        "Play a sound"
      ],
      "correctIndex": 2,
      "explanation": "The division block returns the result of dividing its numeric inputs.",
      "hint": "Consider the purpose of processing numeric readings."
    }
  ]
};

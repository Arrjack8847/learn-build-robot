/** Source: SHA-matched official Level 5 Learning PDF (34 pages). */
import type { QuizBank } from "../../quizStudio";

export const spanishBullfightBank: QuizBank = {
  "projectId": "level-5-spanish-bullfight",
  "title": "Spanish Bullfight (Robot Model)",
  "sourcePdfPath": "public/Level 5/Learning/Action-Oriented/Spanish Bullfight/03.Spanish Bullfight-Slides.pdf",
  "sourcePageCount": 34,
  "questions": [
    {
      "id": "level-5-spanish-bullfight-01",
      "topic": "bullfight-model",
      "learningSlide": 3,
      "prompt": "Which country's traditional performance introduces this robot project?",
      "choices": [
        "Spain",
        "Japan",
        "Canada",
        "Brazil"
      ],
      "correctIndex": 0,
      "hint": "Look at the lesson's title and background.",
      "explanation": "Slide 3 describes traditional Spanish bullfighting."
    },
    {
      "id": "level-5-spanish-bullfight-02",
      "topic": "bullfight-model",
      "learningSlide": 6,
      "prompt": "Which classroom model is built to respond to a simulated provocation?",
      "choices": [
        "A plotter",
        "A bull robot",
        "A cashier robot",
        "A flying chair"
      ],
      "correctIndex": 1,
      "hint": "Think of the animal-shaped project.",
      "explanation": "Slide 6 tasks students with constructing a bull model."
    },
    {
      "id": "level-5-spanish-bullfight-03",
      "topic": "color-trigger",
      "learningSlide": 6,
      "prompt": "Which sensor detects the approaching red object in this lesson?",
      "choices": [
        "Ultrasonic sensor only",
        "A Bluetooth host",
        "Color sensor",
        "Barometric pressure sensor"
      ],
      "correctIndex": 2,
      "hint": "The robot reacts to visible red.",
      "explanation": "Slide 6 controls the bull model using a color sensor."
    },
    {
      "id": "level-5-spanish-bullfight-04",
      "topic": "color-trigger",
      "learningSlide": 26,
      "prompt": "When is a simulated provocation counted as one completed trigger?",
      "choices": [
        "Whenever the color remains red without changing",
        "Only after a clock reaches midnight",
        "When the controller displays blue twice",
        "When red is detected and then the sensor returns to its default no-object state"
      ],
      "correctIndex": 3,
      "hint": "The color has to arrive and then leave.",
      "explanation": "Slide 26 waits for red followed by the default black/no-object state before incrementing a count."
    },
    {
      "id": "level-5-spanish-bullfight-05",
      "topic": "variable-rules",
      "learningSlide": 22,
      "prompt": "Which variable name is allowed by the lesson's naming rules?",
      "choices": [
        "charge_count",
        "2charges",
        "charge-count!",
        "charge count!"
      ],
      "correctIndex": 0,
      "hint": "Avoid starting with a digit or using special punctuation.",
      "explanation": "Slide 22 allows letters, numbers and underscores, but not names beginning with numbers or containing special symbols."
    },
    {
      "id": "level-5-spanish-bullfight-06",
      "topic": "variable-rules",
      "learningSlide": 24,
      "prompt": "What does a 'change variable by 1' block do when the left button example runs?",
      "choices": [
        "Set all sensor values to zero",
        "Increase the stored frequency count by one",
        "Clear the controller program",
        "Halve the motor encoder angle"
      ],
      "correctIndex": 1,
      "hint": "The example counts repeated events.",
      "explanation": "Slide 24 demonstrates increasing a variable named frequency by one."
    },
    {
      "id": "level-5-spanish-bullfight-07",
      "topic": "charge-speed",
      "learningSlide": 27,
      "prompt": "What formula does the lesson use for the bull robot's simulated rushing speed?",
      "choices": [
        "20 − frequency × 10",
        "frequency + 1000",
        "20 + frequency × 10",
        "frequency ÷ 100"
      ],
      "correctIndex": 2,
      "hint": "The speed starts above zero and rises per trigger.",
      "explanation": "Slide 27 specifies rushing speed = 20 + frequency multiplied by 10."
    },
    {
      "id": "level-5-spanish-bullfight-08",
      "topic": "charge-speed",
      "learningSlide": 27,
      "prompt": "If the frequency count is 3, what rushing-speed value does that formula produce?",
      "choices": [
        "23",
        "30",
        "200",
        "50"
      ],
      "correctIndex": 3,
      "hint": "Substitute 3 into 20 + 3 × 10.",
      "explanation": "Slide 27 gives 20 + frequency × 10, so a frequency of three produces a speed of fifty."
    },
    {
      "id": "level-5-spanish-bullfight-09",
      "topic": "reset-behavior",
      "learningSlide": 28,
      "prompt": "What happens after the set time passes without another trigger?",
      "choices": [
        "The frequency count resets to zero",
        "The count increases forever",
        "The robot becomes a QR scanner",
        "The color sensor stops detecting red permanently"
      ],
      "correctIndex": 0,
      "hint": "The model should settle after inactivity.",
      "explanation": "Slide 28 resets frequency to zero after the elapsed-time limit."
    },
    {
      "id": "level-5-spanish-bullfight-10",
      "topic": "reset-behavior",
      "learningSlide": 30,
      "prompt": "What does the expansion program do when frequency remains above zero?",
      "choices": [
        "Reset the whole robot hardware",
        "Decrease the count by one",
        "Double the count instantly",
        "Make the count negative without a check"
      ],
      "correctIndex": 1,
      "hint": "The optional change gradually lowers the stored response.",
      "explanation": "Slide 30 uses a negative increment to decrease frequency by one."
    }
  ]
};

/** Official Level 5 Learning PDF: 38 pages, Git blob identity verified. */
import type { QuizBank } from "../../quizStudio";

export const fireflyBank: QuizBank = {
  "projectId": "level-5-firefly",
  "title": "Firefly",
  "sourcePdfPath": "public/Level 5/Learning/Action-Oriented/Firefly/02.Firefly-Slides.pdf",
  "sourcePageCount": 38,
  "questions": [
    {
      "id": "level-5-firefly-01",
      "topic": "firefly-biology",
      "learningSlide": 3,
      "prompt": "Which kind of light do fireflies emit according to the lesson?",
      "choices": [
        "Yellow-green fluorescence",
        "Only blue laser light",
        "Red traffic-signal flashes",
        "Infrared beams visible only through a camera"
      ],
      "correctIndex": 0,
      "hint": "Recall the described color of the insect's glow.",
      "explanation": "Slide 3 describes fireflies emitting yellow-green fluorescence."
    },
    {
      "id": "level-5-firefly-02",
      "topic": "firefly-biology",
      "learningSlide": 4,
      "prompt": "What is one purpose of a firefly's natural glow?",
      "choices": [
        "Driving an electric fan",
        "Attracting a mate",
        "Charging a car battery",
        "Measuring a road's height"
      ],
      "correctIndex": 1,
      "hint": "Think about communicating with other fireflies.",
      "explanation": "Slide 4 lists mate attraction among reasons fireflies emit light."
    },
    {
      "id": "level-5-firefly-03",
      "topic": "sensor-response",
      "learningSlide": 6,
      "prompt": "Which sensor is specified for the lesson's robot firefly?",
      "choices": [
        "Ultrasonic rangefinder only",
        "Magnetic compass only",
        "Photoelectric sensor",
        "Barometric pressure sensor"
      ],
      "correctIndex": 2,
      "hint": "The model reacts to ambient brightness.",
      "explanation": "Slide 6 requires control of the firefly model using a photoelectric sensor."
    },
    {
      "id": "level-5-firefly-04",
      "topic": "sensor-response",
      "learningSlide": 6,
      "prompt": "What should the firefly do when brighter light shines on it?",
      "choices": [
        "Spread its wings and increase its glow",
        "Drive forward in a straight line",
        "Spin its head continuously",
        "Close its wings and switch off its glow"
      ],
      "correctIndex": 3,
      "hint": "Compare the bright-light and starting conditions.",
      "explanation": "Slide 6 directs the robot to shut its wings and light under brighter illumination."
    },
    {
      "id": "level-5-firefly-05",
      "topic": "variable-concepts",
      "learningSlide": 23,
      "prompt": "What does the lesson mean by a programming variable?",
      "choices": [
        "A stored value that can change",
        "A motor that never rotates",
        "A permanently fixed cable length",
        "A paper drawing with no numbers"
      ],
      "correctIndex": 0,
      "hint": "The cookie-box example describes a changing quantity.",
      "explanation": "Slide 23 explains variables as values that are not necessarily constant."
    },
    {
      "id": "level-5-firefly-06",
      "topic": "variable-concepts",
      "learningSlide": 24,
      "prompt": "What happens when new data is stored in an already-used single-value variable?",
      "choices": [
        "The variable stops existing",
        "The newer value replaces the older stored value",
        "Both numbers automatically become separate files",
        "The old number becomes a new sensor"
      ],
      "correctIndex": 1,
      "hint": "A single-value box holds one value at a time.",
      "explanation": "Slide 24 states the later stored value overwrites the earlier one."
    },
    {
      "id": "level-5-firefly-07",
      "topic": "variable-blocks",
      "learningSlide": 25,
      "prompt": "Which rule applies to naming a newly created variable?",
      "choices": [
        "It may contain only the digit 0",
        "It must exactly match the robot title",
        "Its name must not start with a number",
        "It must always contain a space"
      ],
      "correctIndex": 2,
      "hint": "Check the naming warning in the Create Variable steps.",
      "explanation": "Slide 25 warns against starting a variable name with a number."
    },
    {
      "id": "level-5-firefly-08",
      "topic": "variable-blocks",
      "learningSlide": 28,
      "prompt": "What does the sample program put into the 'light value' variable?",
      "choices": [
        "A constant motor angle of 360",
        "The screen background color",
        "The robot's model number",
        "The reading from photoelectric sensor P3"
      ],
      "correctIndex": 3,
      "hint": "Look at the sensor port named in the example.",
      "explanation": "Slide 28 stores the photoelectric sensor P3 value in the light-value variable."
    },
    {
      "id": "level-5-firefly-09",
      "topic": "light-comparison",
      "learningSlide": 30,
      "prompt": "What is saved as the firefly's initial light intensity?",
      "choices": [
        "The photoelectric reading when the program begins",
        "The brightest possible lamp value",
        "The number of wings on the model",
        "The previous day's weather"
      ],
      "correctIndex": 0,
      "hint": "The program uses a baseline for future comparisons.",
      "explanation": "Slide 30 records an initial photoelectric sensor reading in a variable."
    },
    {
      "id": "level-5-firefly-10",
      "topic": "light-comparison",
      "learningSlide": 32,
      "prompt": "When may the robot reopen its wings and glow after a brighter light passes?",
      "choices": [
        "Immediately when the motors reverse",
        "When the sensed brightness returns close to its starting level",
        "Only after a manual battery replacement",
        "Whenever light becomes even brighter"
      ],
      "correctIndex": 1,
      "hint": "Compare current light intensity with the recorded baseline.",
      "explanation": "Slide 32 waits for the current sensor reading to approach the initial light intensity."
    }
  ]
};

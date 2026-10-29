/** Source-checked against the Level 3 Learning PDF. All slide references are 1-based. */
import type { QuizBank } from "../../quizStudio";

export const superTrajectoryRobot1Bank: QuizBank = {
  "projectId": "level-3-super-trajectory-robot-1",
  "title": "Super Trajectory Robot 1",
  "sourcePdfPath": "public/Level 3/Learning/Advanced Navigation & Control/Super Trajectory Robot 1/13.Super Trajectory Robot 1-update.pdf",
  "sourcePageCount": 19,
  "questions": [
    {
      "id": "str1-01",
      "topic": "track-purpose",
      "learningSlide": 6,
      "prompt": "What kind of path does the Super Track robot follow in the lesson?",
      "choices": [
        "A black line",
        "An invisible Wi-Fi signal",
        "A sound recorded earlier",
        "A line on a ceiling"
      ],
      "correctIndex": 0,
      "hint": "The competition uses a contrasting line on the ground.",
      "explanation": "Slide 6 explains that photoelectric sensors guide the robot along the black line."
    },
    {
      "id": "str1-02",
      "topic": "track-purpose",
      "learningSlide": 7,
      "prompt": "What two areas does the Super Track robot need to distinguish?",
      "choices": [
        "Hot and cold water",
        "Black and white areas",
        "Loud and quiet music",
        "Near and far satellites"
      ],
      "correctIndex": 1,
      "hint": "The robot patrols a high-contrast surface.",
      "explanation": "Slide 7 describes building a robot that patrols black and white."
    },
    {
      "id": "str1-03",
      "topic": "light-sensing",
      "learningSlide": 6,
      "prompt": "Which sensor type helps the robot distinguish the track from its surroundings?",
      "choices": [
        "Barometric sensor",
        "Microphone",
        "Photoelectric sensor",
        "Temperature probe"
      ],
      "correctIndex": 2,
      "hint": "The lesson names a sensor that responds to light.",
      "explanation": "Slide 6 explicitly identifies photoelectric sensors for black-line tracking."
    },
    {
      "id": "str1-04",
      "topic": "light-sensing",
      "learningSlide": 7,
      "prompt": "What does the lesson say a brightness sensor in a phone or tablet can adjust automatically?",
      "choices": [
        "Battery weight",
        "Speaker size",
        "Number of installed apps",
        "Screen brightness"
      ],
      "correctIndex": 3,
      "hint": "The slide uses a familiar screen-light example.",
      "explanation": "Slide 7 describes brightness sensors helping mobile devices adjust screen brightness."
    },
    {
      "id": "str1-05",
      "topic": "sensor-readings",
      "learningSlide": 10,
      "prompt": "What kind of reading can the light-sensor module provide?",
      "choices": [
        "An analog value",
        "A paper receipt",
        "A gear tooth count",
        "A weather forecast"
      ],
      "correctIndex": 0,
      "hint": "The software module can return a measured numeric value.",
      "explanation": "Slide 10 lists reading a light sensor's analog value."
    },
    {
      "id": "str1-06",
      "topic": "sensor-readings",
      "learningSlide": 10,
      "prompt": "Besides an analog value, what other reading does the light-sensor module offer?",
      "choices": [
        "A printed photograph",
        "A digital value",
        "A voice recording",
        "A distance in miles only"
      ],
      "correctIndex": 1,
      "hint": "The slide names another value type.",
      "explanation": "Slide 10 lists 'Get the digital value' for the light sensor."
    },
    {
      "id": "str1-07",
      "topic": "sensor-comparison",
      "learningSlide": 15,
      "prompt": "Why should students measure and record values on both the black line and white area?",
      "choices": [
        "To choose music for each surface",
        "To count the robot's wheels",
        "To compare sensor readings on each surface",
        "To learn the floor's temperature"
      ],
      "correctIndex": 2,
      "hint": "The task explicitly records two light readings.",
      "explanation": "Slide 15 asks learners to record light sensor values on black and white surfaces."
    },
    {
      "id": "str1-08",
      "topic": "sensor-comparison",
      "learningSlide": 10,
      "prompt": "Which comparison operators are shown among the software modules?",
      "choices": [
        "Play, pause, and stop",
        "Open, close, and save",
        "Move, rotate, and flip",
        "Less than, greater than, and equals"
      ],
      "correctIndex": 3,
      "hint": "These operators compare measured numbers.",
      "explanation": "Slide 10 lists <, >, and = in the Electronics Operators module."
    },
    {
      "id": "str1-09",
      "topic": "line-following-tasks",
      "learningSlide": 14,
      "prompt": "What is the first programming task?",
      "choices": [
        "Make the robot follow a single black line",
        "Read air pressure",
        "Play MP3 files continuously",
        "Measure the wall's weight"
      ],
      "correctIndex": 0,
      "hint": "The task is directly about line following.",
      "explanation": "Slide 14 says the robot follows one black line."
    },
    {
      "id": "str1-10",
      "topic": "line-following-tasks",
      "learningSlide": 16,
      "prompt": "Where does Task 3 tell students to connect the single photoelectric sensor?",
      "choices": [
        "On the roof only",
        "On the left",
        "Inside the battery",
        "Behind a microphone"
      ],
      "correctIndex": 1,
      "hint": "Task 3 specifies a side for the sensor.",
      "explanation": "Slide 16 says to connect the single photoelectric sensor on the left."
    }
  ]
};

/** Verified against the Level 3 official Learning PDF. */
import type { QuizBank } from "../../quizStudio";

export const automatedGuidedVehicleBank: QuizBank = {
  "projectId": "level-3-automated-guided-vehicle",
  "title": "Automated Guided Vehicle",
  "sourcePdfPath": "public/Level 3/Learning/Display & Movement/Automated Guided Vehicle/24.Automated Guided Vehicle-Slides.pdf",
  "sourcePageCount": 36,
  "questions": [
    {
      "id": "automatedgui-01",
      "topic": "agv-purpose",
      "learningSlide": 3,
      "prompt": "Why are automated transport machines useful in industrial production?",
      "choices": [
        "They remove the need for all manufacturing",
        "They can improve transport efficiency and reduce manual effort",
        "They only replace the lighting system",
        "They prevent all machines from using motors"
      ],
      "correctIndex": 1,
      "hint": "Think about repeatedly carrying items between work areas.",
      "explanation": "Slide 3 discusses transport equipment that reduces manual work and improves efficiency."
    },
    {
      "id": "automatedgui-02",
      "topic": "agv-purpose",
      "learningSlide": 4,
      "prompt": "What is the main ability of an automated guided vehicle (AGV)?",
      "choices": [
        "Fly over buildings using wings",
        "Generate electricity from sound",
        "Travel on its own to transport objects",
        "Display photographs without moving"
      ],
      "correctIndex": 2,
      "hint": "The lesson presents an automated transport vehicle.",
      "explanation": "Slide 4 defines an AGV as self-driving equipment that transports items."
    },
    {
      "id": "automatedgui-03",
      "topic": "straight-driving",
      "learningSlide": 22,
      "prompt": "What speed relationship helps a two-motor vehicle drive straight?",
      "choices": [
        "Only the right motor runs",
        "The motors rotate in opposite directions for forward travel",
        "The left motor always runs twice as fast",
        "Left and right motors receive equal target speeds"
      ],
      "correctIndex": 3,
      "hint": "Compare how far the wheels must travel on a straight path.",
      "explanation": "Slide 22 sets left and right motor speeds equally to aim for straight travel."
    },
    {
      "id": "automatedgui-04",
      "topic": "straight-driving",
      "learningSlide": 23,
      "prompt": "Why might an AGV still drift even when its motor commands are equal?",
      "choices": [
        "Actual motor speeds and wheel smoothness can differ",
        "Equal commands disable wheel rotation",
        "Straight roads have no friction",
        "The controller always reverses one motor"
      ],
      "correctIndex": 0,
      "hint": "The lesson distinguishes commanded speed from real motion.",
      "explanation": "Slide 23 cites motor differences and unequal wheel smoothness as causes of drift."
    },
    {
      "id": "automatedgui-05",
      "topic": "motor-programming",
      "learningSlide": 24,
      "prompt": "What is the speed range accepted by the double-motor straight-line block?",
      "choices": [
        "0 to 4095",
        "−100 to 100",
        "1 to 5000",
        "10 to 10000"
      ],
      "correctIndex": 1,
      "hint": "The lesson defines signed speed commands.",
      "explanation": "Slide 24 gives the motor speed range as -100 to 100."
    },
    {
      "id": "automatedgui-06",
      "topic": "motor-programming",
      "learningSlide": 25,
      "prompt": "How can a controller monitor how far a motor has rotated?",
      "choices": [
        "Check the speaker volume",
        "Count printed labels",
        "Read feedback from the motor's encoder",
        "Read ambient light only"
      ],
      "correctIndex": 2,
      "hint": "Look for a sensor coupled to the motor shaft.",
      "explanation": "Slide 25 describes obtaining motor rotation angle using encoder feedback."
    },
    {
      "id": "automatedgui-07",
      "topic": "touch-control",
      "learningSlide": 6,
      "prompt": "Which sensor is specified for the AGV's project task control?",
      "choices": [
        "Barometric sensor",
        "Light-color-only camera",
        "Temperature sensor",
        "Touch sensor"
      ],
      "correctIndex": 3,
      "hint": "The project needs a physical control input.",
      "explanation": "Slide 6 explicitly describes an AGV controlled by a touch sensor."
    },
    {
      "id": "automatedgui-08",
      "topic": "touch-control",
      "learningSlide": 26,
      "prompt": "What does the lesson's first programming step do with motor M4?",
      "choices": [
        "Turn it slowly for one second to lower the bucket",
        "Spin at full speed for one minute",
        "Read an ultrasonic distance continuously",
        "Flash the screen before steering"
      ],
      "correctIndex": 0,
      "hint": "The step initializes the cargo bucket position.",
      "explanation": "Slide 26 initializes the bucket by running M4 at low speed for one second."
    },
    {
      "id": "automatedgui-09",
      "topic": "transport-sequence",
      "learningSlide": 28,
      "prompt": "What does the vehicle do after moving forward for two seconds in the unloading task?",
      "choices": [
        "Keep accelerating without stopping",
        "Stop and unload the goods",
        "Reverse immediately before unloading",
        "Wait for the touch sensor to change color"
      ],
      "correctIndex": 1,
      "hint": "Look at the cargo delivery sequence.",
      "explanation": "Slide 28 describes moving forward, stopping after two seconds, then unloading."
    },
    {
      "id": "automatedgui-10",
      "topic": "transport-sequence",
      "learningSlide": 29,
      "prompt": "How is the return movement programmed compared with forward movement?",
      "choices": [
        "Always twice the forward speed",
        "Same direction and speed",
        "Same speed magnitude in the opposite direction",
        "No motor motion during return"
      ],
      "correctIndex": 2,
      "hint": "Returning retraces the route.",
      "explanation": "Slide 29 says returning uses the same speed value with the opposite direction."
    }
  ]
};

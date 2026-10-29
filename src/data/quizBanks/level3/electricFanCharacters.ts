/** Verified against original Level 3 Learning PDF, with 1-based source slides. */
import type { QuizBank } from "../../quizStudio";

export const electricFanCharactersBank: QuizBank = {
  "projectId": "level-3-electric-fan-characters-structures",
  "title": "Electric Fan — Characters & Structures",
  "sourcePdfPath": "public/Level 3/Learning/Characters & Structures/Electric Fan/05.Electric Fan-Slides.pdf",
  "sourcePageCount": 31,
  "questions": [
    {
      "id": "electricfanch-01",
      "topic": "controls",
      "learningSlide": 6,
      "prompt": "What speed does the left controller button request for the fan?",
      "choices": [
        "Maximum speed",
        "Reverse speed",
        "Low speed",
        "No rotation"
      ],
      "correctIndex": 2,
      "hint": "The lesson maps different button combinations to fan behavior.",
      "explanation": "Slide 6 assigns low speed to the left button."
    },
    {
      "id": "electricfanch-02",
      "topic": "controls",
      "learningSlide": 6,
      "prompt": "What is the result of pressing left and right controller buttons together?",
      "choices": [
        "Increase speed to the maximum",
        "Rotate the fan backward",
        "Display the ultrasonic reading",
        "Turn the fan off"
      ],
      "correctIndex": 3,
      "hint": "The lesson maps different button combinations to fan behavior.",
      "explanation": "Slide 6 defines the combined button press as switching the fan off."
    },
    {
      "id": "electricfanch-03",
      "topic": "motor",
      "learningSlide": 7,
      "prompt": "What can the medium motor do besides rotate clockwise?",
      "choices": [
        "Rotate counterclockwise and brake",
        "Detect human distance",
        "Measure reflected color",
        "Read battery data from nearby devices"
      ],
      "correctIndex": 0,
      "hint": "Think about how an electrical motor changes speed and direction.",
      "explanation": "Slide 7 lists clockwise rotation, counterclockwise rotation and braking."
    },
    {
      "id": "electricfanch-04",
      "topic": "motor",
      "learningSlide": 8,
      "prompt": "Where can the medium motor plug into the controller?",
      "choices": [
        "Composite sensor ports P1–P8 only",
        "Motor ports M1–M4",
        "The speaker jack only",
        "The main battery terminals"
      ],
      "correctIndex": 1,
      "hint": "Think about how an electrical motor changes speed and direction.",
      "explanation": "Slide 8 lists the controller's motor ports M1–M4."
    },
    {
      "id": "electricfanch-05",
      "topic": "test",
      "learningSlide": 9,
      "prompt": "Which built-in interface should be selected to test fan motor rotation?",
      "choices": [
        "Gray",
        "Ultrasonic",
        "Motor",
        "Music"
      ],
      "correctIndex": 2,
      "hint": "The controller has a built-in place to check the motor.",
      "explanation": "Slide 9 directs learners to the Motor test screen."
    },
    {
      "id": "electricfanch-06",
      "topic": "test",
      "learningSlide": 10,
      "prompt": "What motor speed range can be selected manually in the test?",
      "choices": [
        "0 to 4095",
        "1 to 10000",
        "−1 to 1 only",
        "−100 to 100"
      ],
      "correctIndex": 3,
      "hint": "The controller has a built-in place to check the motor.",
      "explanation": "Slide 10 permits manual motor speeds between -100 and 100."
    },
    {
      "id": "electricfanch-07",
      "topic": "program",
      "learningSlide": 20,
      "prompt": "What does a motor speed of zero command?",
      "choices": [
        "Stop the motor",
        "Run the motor at half speed",
        "Reverse at full speed",
        "Rotate forward at full speed"
      ],
      "correctIndex": 0,
      "hint": "A signed speed value can control both magnitude and direction.",
      "explanation": "Slide 20 says setting motor speed to 0 stops movement."
    },
    {
      "id": "electricfanch-08",
      "topic": "program",
      "learningSlide": 20,
      "prompt": "What does a negative motor-speed value represent?",
      "choices": [
        "A higher forward speed",
        "Reverse direction",
        "An invalid sensor port",
        "A greater wheel size"
      ],
      "correctIndex": 1,
      "hint": "A signed speed value can control both magnitude and direction.",
      "explanation": "Slide 20 uses negative speed values for reverse rotation."
    },
    {
      "id": "electricfanch-09",
      "topic": "branches",
      "learningSlide": 21,
      "prompt": "What is the purpose of a parallel branch program structure?",
      "choices": [
        "Make the motor always spin at one speed",
        "Remove all conditions",
        "Execute different commands for different conditions",
        "Allow only one input value"
      ],
      "correctIndex": 2,
      "hint": "Separate commands can depend on separate button conditions.",
      "explanation": "Slide 21 describes multiple condition-dependent branches."
    },
    {
      "id": "electricfanch-10",
      "topic": "branches",
      "learningSlide": 22,
      "prompt": "Which example speed is used when the left button is pressed?",
      "choices": [
        "0",
        "−100",
        "100",
        "30"
      ],
      "correctIndex": 3,
      "hint": "Separate commands can depend on separate button conditions.",
      "explanation": "Slide 22 shows the motor M1 running at speed 30 after a left-button press."
    }
  ]
};

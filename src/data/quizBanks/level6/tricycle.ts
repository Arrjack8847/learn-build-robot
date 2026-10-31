import type { QuizBank } from "../../quizStudio";
/** Source-grounded Level 6 quiz; original 23-page Learning PDF. */
export const tricycleBank: QuizBank = {
  "projectId": "level-6-tricycle",
  "title": "Tricycle",
  "sourcePdfPath": "public/Level 6/Learning/Vehicles & Complex Movers/Tricycle/29. Tricycle-Teaching Slides.pdf",
  "sourcePageCount": 23,
  "questions": [
    {
      "id": "tri-01",
      "topic": "touch-sensor",
      "learningSlide": 8,
      "prompt": "What two states does a touch sensor detect?",
      "choices": [
        "Pressed and released",
        "Warm and cold",
        "Red and blue",
        "Fast and slow wind"
      ],
      "correctIndex": 0,
      "hint": "The sensor behaves like a switch.",
      "explanation": "Slide 8 describes pressed and released states."
    },
    {
      "id": "tri-02",
      "topic": "touch-sensor",
      "learningSlide": 9,
      "prompt": "What does pressing both tricycle touch sensors together mean?",
      "choices": [
        "Always steer sharply left",
        "A start/stop command",
        "Always steer sharply right",
        "Play a beep without moving"
      ],
      "correctIndex": 1,
      "hint": "The pair is reserved for overall motion control.",
      "explanation": "Slide 9 uses both touch inputs for starting or stopping."
    },
    {
      "id": "tri-03",
      "topic": "start-stop",
      "learningSlide": 15,
      "prompt": "What motor speed does the start/stop function use when moving?",
      "choices": [
        "0",
        "240",
        "50",
        "-999"
      ],
      "correctIndex": 2,
      "hint": "The function toggles between movement and stop.",
      "explanation": "Slide 15 sets running motor speed to 50."
    },
    {
      "id": "tri-04",
      "topic": "start-stop",
      "learningSlide": 15,
      "prompt": "What motor speed represents the stopped state?",
      "choices": [
        "50",
        "100",
        "240",
        "0"
      ],
      "correctIndex": 3,
      "hint": "Zero rotation means the tricycle is not advancing.",
      "explanation": "Slide 15 toggles motor speed to zero."
    },
    {
      "id": "tri-05",
      "topic": "steering",
      "learningSlide": 16,
      "prompt": "What happens when touch sensor P1 is pressed?",
      "choices": [
        "The handlebar turns counterclockwise to the left",
        "The handlebar turns right",
        "The tricycle performs a QR payment",
        "The model stops sensing input"
      ],
      "correctIndex": 0,
      "hint": "P1 selects one steering direction.",
      "explanation": "Slide 16 assigns P1 to left steering."
    },
    {
      "id": "tri-06",
      "topic": "steering",
      "learningSlide": 16,
      "prompt": "What happens when touch sensor P2 is pressed?",
      "choices": [
        "The handlebar turns left",
        "The handlebar turns clockwise to the right",
        "The screen shows a traffic warning",
        "The model forgets its encoder"
      ],
      "correctIndex": 1,
      "hint": "P2 selects the other steering direction.",
      "explanation": "Slide 16 assigns P2 to right steering."
    },
    {
      "id": "tri-07",
      "topic": "return-to-centre",
      "learningSlide": 14,
      "prompt": "What should the handlebars do after steering ends?",
      "choices": [
        "Stay at the maximum angle forever",
        "Spin continuously in circles",
        "Return to the centerline",
        "Change the vehicle's colour"
      ],
      "correctIndex": 2,
      "hint": "The wheel should recover straight-ahead alignment.",
      "explanation": "Slide 14 introduces return-to-centre motion."
    },
    {
      "id": "tri-08",
      "topic": "return-to-centre",
      "learningSlide": 17,
      "prompt": "What feedback can help the tricycle return to centre?",
      "choices": [
        "A product list index",
        "A weather-station humidity reading",
        "A QR payment code",
        "The steering motor's encoder change"
      ],
      "correctIndex": 3,
      "hint": "A return angle can cancel the recorded turn.",
      "explanation": "Slide 17 uses recorded encoder displacement."
    },
    {
      "id": "tri-09",
      "topic": "extension",
      "learningSlide": 21,
      "prompt": "What part of tricycle control is changed in the optimization task?",
      "choices": [
        "The steering method",
        "The colour of the wheels",
        "The brand of the controller",
        "The number of PDF pages"
      ],
      "correctIndex": 0,
      "hint": "The new behaviour affects directional control.",
      "explanation": "Slide 21 asks to revise steering controls."
    },
    {
      "id": "tri-10",
      "topic": "extension",
      "learningSlide": 21,
      "prompt": "What alignment should the optimized steering have?",
      "choices": [
        "The steering direction should always oppose the button",
        "The steering direction should match the button direction",
        "The tricycle should ignore every button",
        "Both buttons must permanently accelerate the tricycle"
      ],
      "correctIndex": 1,
      "hint": "The interface should feel intuitive.",
      "explanation": "Slide 21 requires steering direction consistent with button direction."
    }
  ]
};

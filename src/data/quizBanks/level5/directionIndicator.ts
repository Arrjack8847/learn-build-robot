/** Ten Level 5 questions sourced from the official 26-page Learning PDF. */
import type { QuizBank } from "../../quizStudio";

export const directionIndicatorBank: QuizBank = {
  "projectId": "level-5-direction-indicator",
  "title": "Direction Indicator",
  "sourcePdfPath": "public/Level 5/Learning/Illumination & Signals/Direction Indicator/06.Direction Indicator-Teaching Slides.pdf",
  "sourcePageCount": 26,
  "questions": [
    {
      "id": "level-5-direction-indicator-01",
      "topic": "road-maintenance",
      "learningSlide": 5,
      "prompt": "Why does the background section recommend regular road maintenance?",
      "choices": [
        "To keep roads in good condition and serve users safely",
        "To make roads permanently narrower",
        "To eliminate the need for warning lights",
        "To increase damage caused by traffic"
      ],
      "correctIndex": 0,
      "hint": "Think of preventing deterioration.",
      "explanation": "Slide 5 says regular maintenance prevents roads from deteriorating and serves road users."
    },
    {
      "id": "level-5-direction-indicator-02",
      "topic": "road-maintenance",
      "learningSlide": 7,
      "prompt": "Why may a road need to be temporarily closed during repairs?",
      "choices": [
        "To avoid using safety equipment",
        "To prevent accidents and interference from traffic",
        "To help motorists drive faster through workers",
        "To switch off every warning sign"
      ],
      "correctIndex": 1,
      "hint": "Consider the safety of workers and drivers.",
      "explanation": "Slide 7 explains temporary closures help avoid accidents during road maintenance."
    },
    {
      "id": "level-5-direction-indicator-03",
      "topic": "led-basics",
      "learningSlide": 9,
      "prompt": "How does the lesson make an arrow animation on the dot-matrix screen?",
      "choices": [
        "By spinning the whole display",
        "By moving a mechanical pointer",
        "By switching LED lights on in changing patterns",
        "By printing a moving paper arrow"
      ],
      "correctIndex": 2,
      "hint": "Think about how individual LED cells are controlled.",
      "explanation": "Slide 9 teaches lighting LED patterns to create animations on the dot-matrix display."
    },
    {
      "id": "level-5-direction-indicator-04",
      "topic": "led-basics",
      "learningSlide": 10,
      "prompt": "Which two states does each LED have in the simple animation model?",
      "choices": [
        "Hot and cold measured in Celsius",
        "Fast and slow motor rotation",
        "Left and right wheel steering",
        "On and off, represented by 1 and 0"
      ],
      "correctIndex": 3,
      "hint": "This is a binary display.",
      "explanation": "Slide 10 says LEDs operate in on/off states represented by 1 and 0."
    },
    {
      "id": "level-5-direction-indicator-05",
      "topic": "gesture-input",
      "learningSlide": 13,
      "prompt": "What sensor input controls the direction-indicator model?",
      "choices": [
        "Gesture recognition",
        "A barometric pressure sensor",
        "A temperature probe",
        "A microphone-only detector"
      ],
      "correctIndex": 0,
      "hint": "The model responds to hand movement.",
      "explanation": "Slide 13 labels the gesture recognition module paired with the dot-matrix display."
    },
    {
      "id": "level-5-direction-indicator-06",
      "topic": "gesture-input",
      "learningSlide": 14,
      "prompt": "What should happen when a gesture other than left or right is detected?",
      "choices": [
        "Reverse the motor",
        "Do not play a directional arrow animation",
        "Always display the left arrow",
        "Always display the right arrow"
      ],
      "correctIndex": 1,
      "hint": "The flowchart selects animations only for recognized directions.",
      "explanation": "Slide 14 specifies directional animations for left and right gestures and none for other gestures."
    },
    {
      "id": "level-5-direction-indicator-07",
      "topic": "animation-frames",
      "learningSlide": 17,
      "prompt": "How long does the first left-arrow animation screen stay before the next frame?",
      "choices": [
        "Every 10 seconds",
        "It never changes",
        "0.3 seconds",
        "3 minutes"
      ],
      "correctIndex": 2,
      "hint": "Check the delay between animation frames.",
      "explanation": "Slide 17 specifies waiting 0.3 seconds before the next left-arrow frame."
    },
    {
      "id": "level-5-direction-indicator-08",
      "topic": "animation-frames",
      "learningSlide": 19,
      "prompt": "How does the second left-arrow animation frame differ from the first?",
      "choices": [
        "All LEDs are permanently turned off",
        "A new car wheel is added",
        "The gesture sensor is removed",
        "The arrow pattern is shifted across dot-matrix panels"
      ],
      "correctIndex": 3,
      "hint": "Compare the position of the four-column arrow pattern.",
      "explanation": "Slide 19 moves the four-column arrow portion between panels to animate its travel."
    },
    {
      "id": "level-5-direction-indicator-09",
      "topic": "extensions",
      "learningSlide": 21,
      "prompt": "How does the lesson suggest constructing the right-arrow animation?",
      "choices": [
        "Copy the left animation and exchange display ports",
        "Remove the dot-matrix display",
        "Use only an audio signal",
        "Keep the left frames unchanged"
      ],
      "correctIndex": 0,
      "hint": "Think about reversing the direction of an existing pattern.",
      "explanation": "Slide 21 proposes adapting the left-arrow sequence by swapping display ports."
    },
    {
      "id": "level-5-direction-indicator-10",
      "topic": "extensions",
      "learningSlide": 24,
      "prompt": "Which extra gesture directions are proposed in the optimization task?",
      "choices": [
        "Only a repeated left gesture",
        "Up and down",
        "Forward and backward vehicle gears",
        "Clockwise and counterclockwise wheel spin"
      ],
      "correctIndex": 1,
      "hint": "Two more hand-wave directions are mentioned.",
      "explanation": "Slide 24 asks for up- and down-arrow animations after recognizing those gestures."
    }
  ]
};

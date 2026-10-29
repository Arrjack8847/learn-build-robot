/** Reconciled source-checked Level 1 official Learning lesson bank. */
import type { QuizBank } from "../../quizStudio";
export const trafficLightSignalBank: QuizBank = {
  "projectId": "traffic-light-signal",
  "title": "Traffic Light Signal",
  "sourcePdfPath": "public/Level 1/Learning/Illumination & Signals/Traffic light Signal/Traffic light_Powerpoint.pdf",
  "sourcePageCount": 16,
  "questions": [
    {
      "id": "traffic-light-signal-01",
      "topic": "lights",
      "learningSlide": 6,
      "prompt": "What does the red traffic light signal mean?",
      "choices": [
        "Go",
        "Turn on headlights",
        "Stop",
        "Increase speed"
      ],
      "correctIndex": 2,
      "explanation": "The introduction assigns stopping to red.",
      "hint": "Recall how the lesson labels each traffic light color."
    },
    {
      "id": "traffic-light-signal-02",
      "topic": "lights",
      "learningSlide": 6,
      "prompt": "What does the green traffic light signal mean?",
      "choices": [
        "Vehicles may proceed",
        "Stop and wait",
        "Sound an alarm",
        "Reverse direction"
      ],
      "correctIndex": 0,
      "explanation": "The introductory slide associates green with passage.",
      "hint": "Think about the color used to allow movement."
    },
    {
      "id": "traffic-light-signal-03",
      "topic": "road-rules",
      "learningSlide": 9,
      "prompt": "What should a vehicle that has not crossed the stop line do when yellow flashes in the lesson's example?",
      "choices": [
        "Speed up regardless of safety",
        "Reverse through the crossing",
        "Ignore all signals",
        "Slow down and stop before the line"
      ],
      "correctIndex": 3,
      "explanation": "The slide says vehicles not yet past the stop line should slow down and stop.",
      "hint": "Compare being before and beyond the stop line."
    },
    {
      "id": "traffic-light-signal-04",
      "topic": "road-rules",
      "learningSlide": 9,
      "prompt": "Which colors are usually described for pedestrian crossing lights?",
      "choices": [
        "Yellow and blue",
        "Red and green",
        "White and purple",
        "Orange and pink"
      ],
      "correctIndex": 1,
      "explanation": "The lesson describes pedestrian signals as typically red and green.",
      "hint": "Think about stop and walk signals for people crossing."
    },
    {
      "id": "traffic-light-signal-05",
      "topic": "patterns",
      "learningSlide": 10,
      "prompt": "What is a flowing-light pattern?",
      "choices": [
        "All lights staying off",
        "Lights turning on or off one after another",
        "All lamps using the same color permanently",
        "One sensor measuring distance"
      ],
      "correctIndex": 1,
      "explanation": "The slide describes flowing lights as consecutive lamps lighting or switching off.",
      "hint": "Think about a light moving along a row of lamps."
    },
    {
      "id": "traffic-light-signal-06",
      "topic": "patterns",
      "learningSlide": 10,
      "prompt": "What does alternating flashing do?",
      "choices": [
        "Keeps every light continuously on",
        "Only dims the controller display",
        "Turns off the entire program",
        "Repeats blinking between lamps at a set frequency"
      ],
      "correctIndex": 3,
      "explanation": "Alternating flashing repeats the on/off action between multiple lamps.",
      "hint": "Think about two lights taking turns."
    },
    {
      "id": "traffic-light-signal-07",
      "topic": "hardware",
      "learningSlide": 7,
      "prompt": "How does this lesson suggest showing traffic-light states with limited parts?",
      "choices": [
        "Change colors on one lantern",
        "Build three separate full controllers",
        "Remove the lantern",
        "Use only motor movement"
      ],
      "correctIndex": 0,
      "explanation": "The introduction proposes using a single lantern to express different traffic-light states.",
      "hint": "Think about reusing the same light with different colors."
    },
    {
      "id": "traffic-light-signal-08",
      "topic": "hardware",
      "learningSlide": 3,
      "prompt": "Which two programming modules does the Traffic Light lesson focus on?",
      "choices": [
        "Camera and pressure modules",
        "GPS and compass modules",
        "Lantern and time modules",
        "Audio and ultrasonic modules"
      ],
      "correctIndex": 2,
      "explanation": "Slide 3 identifies lantern and time as the learning focus.",
      "hint": "Consider which blocks control light and how long it stays on."
    },
    {
      "id": "traffic-light-signal-09",
      "topic": "sequence",
      "learningSlide": 2,
      "prompt": "What should the signal-light program make understandable?",
      "choices": [
        "Only a single static motor speed",
        "The robot's barometric reading",
        "Multi-lamp flashing and alternating behavior",
        "Ultrasonic distance calculation"
      ],
      "correctIndex": 2,
      "explanation": "The objectives mention multi-lamp and alternating flashing programming.",
      "hint": "Recall the switching patterns in the lesson."
    },
    {
      "id": "traffic-light-signal-10",
      "topic": "sequence",
      "learningSlide": 12,
      "prompt": "Which item appears in the assembly checklist?",
      "choices": [
        "No support frame",
        "Stable structure",
        "Loose connectors",
        "Unmatched shape"
      ],
      "correctIndex": 1,
      "explanation": "Slide 12 requires stability, suitable balance and shape matching.",
      "hint": "Think about what makes a physical traffic-light model reliable."
    }
  ]
};

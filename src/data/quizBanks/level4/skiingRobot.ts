import type { QuizBank } from "../../quizStudio";
/** Official Level 4 skiing Learning PDF, source pages verified. */
export const skiingRobotBank: QuizBank = {
  "projectId": "level-4-skiing-robot",
  "title": "Skiing Robot",
  "sourcePdfPath": "public/Level 4/Display & Movement/Skiing Robot/28.Skiing Robot -Slides.pdf",
  "sourcePageCount": 40,
  "questions": [
    {
      "id": "l4-ski-01",
      "topic": "skiing-context",
      "learningSlide": 3,
      "prompt": "What terrain does the sport of skiing usually involve?",
      "choices": [
        "Desert sand",
        "Deep ocean",
        "A climbing wall",
        "Snow"
      ],
      "correctIndex": 3,
      "explanation": "The introductory lesson describes skiing on snow.",
      "hint": "Recall the lesson's skiing context activity."
    },
    {
      "id": "l4-ski-02",
      "topic": "skiing-context",
      "learningSlide": 4,
      "prompt": "Which equipment is used in alpine skiing?",
      "choices": [
        "Oars",
        "Basketball shoes",
        "Skis",
        "Roller skates"
      ],
      "correctIndex": 2,
      "explanation": "Slide 4 introduces alpine skis and related equipment.",
      "hint": "Recall the lesson's skiing context activity."
    },
    {
      "id": "l4-ski-03",
      "topic": "initial-position",
      "learningSlide": 26,
      "prompt": "How should the blue crank be oriented before testing?",
      "choices": [
        "Removed from the frame",
        "Perpendicular to the ground",
        "Hidden inside the screen",
        "Parallel to a printed page"
      ],
      "correctIndex": 1,
      "explanation": "The initial crank position is perpendicular to the ground.",
      "hint": "Recall the lesson's initial position activity."
    },
    {
      "id": "l4-ski-04",
      "topic": "initial-position",
      "learningSlide": 26,
      "prompt": "What should the ski poles be doing in the initial position?",
      "choices": [
        "Not touching the floor",
        "Pushing deeply into the floor",
        "Rotating the motor",
        "Lying across the controller"
      ],
      "correctIndex": 0,
      "explanation": "The pole tips do not touch the ground at the initial position.",
      "hint": "Recall the lesson's initial position activity."
    },
    {
      "id": "l4-ski-05",
      "topic": "synchronized-motors",
      "learningSlide": 27,
      "prompt": "Which motors are synchronized for the skiing movement trial?",
      "choices": [
        "M1 and M2",
        "M1 and M3",
        "M2 and M4",
        "M3 and M4"
      ],
      "correctIndex": 3,
      "explanation": "The slide tests the M3 and M4 pair.",
      "hint": "Recall the lesson's synchronized motors activity."
    },
    {
      "id": "l4-ski-06",
      "topic": "synchronized-motors",
      "learningSlide": 28,
      "prompt": "How many motor turns produced normal sliding in the trial?",
      "choices": [
        "Half",
        "Four",
        "Two",
        "One"
      ],
      "correctIndex": 2,
      "explanation": "The lesson compares one versus two rotations and favors two.",
      "hint": "Recall the lesson's synchronized motors activity."
    },
    {
      "id": "l4-ski-07",
      "topic": "repeat-until",
      "learningSlide": 30,
      "prompt": "What happens while a repeat-until condition remains false?",
      "choices": [
        "The sensor stops reading",
        "The enclosed actions continue repeating",
        "The program exits immediately",
        "The motor disconnects"
      ],
      "correctIndex": 1,
      "explanation": "The loop continues until its specified condition becomes true.",
      "hint": "Recall the lesson's repeat until activity."
    },
    {
      "id": "l4-ski-08",
      "topic": "repeat-until",
      "learningSlide": 31,
      "prompt": "What happens when a repeat-until condition becomes true?",
      "choices": [
        "Execution moves past the loop",
        "The loop starts over forever",
        "The controller reboots",
        "The display is erased"
      ],
      "correctIndex": 0,
      "explanation": "The loop ends when its condition is met.",
      "hint": "Recall the lesson's repeat until activity."
    },
    {
      "id": "l4-ski-09",
      "topic": "timed-operation",
      "learningSlide": 32,
      "prompt": "What input begins the timed skiing routine?",
      "choices": [
        "GPS update",
        "A camera flash",
        "Microphone silence",
        "Touch sensor press"
      ],
      "correctIndex": 3,
      "explanation": "Pressing the touch sensor resets the timer to start the routine.",
      "hint": "Recall the lesson's timed operation activity."
    },
    {
      "id": "l4-ski-10",
      "topic": "timed-operation",
      "learningSlide": 33,
      "prompt": "What makes the robot stop skiing?",
      "choices": [
        "The screen brightness changes",
        "Its ID is changed",
        "The preset time is exceeded",
        "Its picture is downloaded"
      ],
      "correctIndex": 2,
      "explanation": "The timed routine ends after the assigned duration.",
      "hint": "Recall the lesson's timed operation activity."
    }
  ]
};

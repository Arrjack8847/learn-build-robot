/** Text verified against official Level 3 teaching manual (Learning fallback). */
import type { QuizBank } from "../../quizStudio";

export const lunarRoverBank: QuizBank = {
  "projectId": "level-3-lunar-rover",
  "title": "Lunar Rover",
  "sourcePdfPath": "public/Lunar Rover.pdf",
  "sourcePageCount": 24,
  "questions": [
    {
      "id": "lunarrover-01",
      "topic": "mission",
      "learningSlide": 4,
      "prompt": "Where is the vehicle in the lesson intended to travel?",
      "choices": [
        "On the Moon",
        "Under the ocean",
        "Inside a banknote sorter",
        "Inside a washing machine"
      ],
      "correctIndex": 0,
      "hint": "The model is inspired by vehicles that explore the Moon.",
      "explanation": "Page 4 introduces a vehicle that can travel on the Moon."
    },
    {
      "id": "lunarrover-02",
      "topic": "mission",
      "learningSlide": 3,
      "prompt": "What project is listed as the lesson's main construction goal?",
      "choices": [
        "Build a music doorbell",
        "Build a lunar rover",
        "Build a fire ladder",
        "Build a countertop scale"
      ],
      "correctIndex": 1,
      "hint": "The model is inspired by vehicles that explore the Moon.",
      "explanation": "Page 3 names understanding the Moon rover as a learning objective."
    },
    {
      "id": "lunarrover-03",
      "topic": "tracks",
      "learningSlide": 3,
      "prompt": "Which two mechanical components are central to the rover's drive system?",
      "choices": [
        "Worm gear and speaker",
        "Pulley and buzzer",
        "Sprocket and crawler",
        "Photoreceptor and lamp"
      ],
      "correctIndex": 2,
      "hint": "A sprocket and a crawler work together in the vehicle's drive.",
      "explanation": "Page 3 emphasizes correct use of sprockets and crawlers."
    },
    {
      "id": "lunarrover-04",
      "topic": "tracks",
      "learningSlide": 6,
      "prompt": "What type of rover drive should students distinguish from a simple belt in the assessment?",
      "choices": [
        "Color sensor",
        "Microphone",
        "MP3 playback",
        "Crawler track"
      ],
      "correctIndex": 3,
      "hint": "A sprocket and a crawler work together in the vehicle's drive.",
      "explanation": "Page 6 asks whether the vehicle wheels use a crawler or a belt."
    },
    {
      "id": "lunarrover-05",
      "topic": "sensors",
      "learningSlide": 3,
      "prompt": "Which general area of robotics is taught alongside the crawler drive?",
      "choices": [
        "The role and use of sensors",
        "Audio file numbering only",
        "Banknote color printing",
        "Human walking competitions"
      ],
      "correctIndex": 0,
      "hint": "The rover uses sensor readings to control movement.",
      "explanation": "Page 3 identifies sensor roles as a learning objective."
    },
    {
      "id": "lunarrover-06",
      "topic": "sensors",
      "learningSlide": 5,
      "prompt": "Which sensor value is adjusted to change the rover's detection distance?",
      "choices": [
        "Microphone pitch",
        "Infrared sensor value",
        "Screen font size",
        "LED lamp color"
      ],
      "correctIndex": 1,
      "hint": "The rover uses sensor readings to control movement.",
      "explanation": "Page 5 explains adjusting detection distance with an infrared sensor value."
    },
    {
      "id": "lunarrover-07",
      "topic": "motors",
      "learningSlide": 5,
      "prompt": "Which setting should students debug to change rover movement speed?",
      "choices": [
        "Color sensor sensitivity only",
        "Display pixel count",
        "Motor speed value",
        "Audio note duration"
      ],
      "correctIndex": 2,
      "hint": "Debugging motor speeds changes the rover's movement.",
      "explanation": "Page 5 instructs adjusting the rover's speed with the motor speed value."
    },
    {
      "id": "lunarrover-08",
      "topic": "motors",
      "learningSlide": 5,
      "prompt": "Which programming module do students practice for moving the rover?",
      "choices": [
        "MP3 file selector",
        "Clock calendar module",
        "UV lamp sequencer",
        "Motor module"
      ],
      "correctIndex": 3,
      "hint": "Debugging motor speeds changes the rover's movement.",
      "explanation": "Page 5 teaches setting the motor module."
    },
    {
      "id": "lunarrover-09",
      "topic": "programming",
      "learningSlide": 3,
      "prompt": "Which block type is central to the rover's programmed movement?",
      "choices": [
        "Action directive blocks",
        "Audio editing filters",
        "Only drawing shapes",
        "Spreadsheet cells"
      ],
      "correctIndex": 0,
      "hint": "Graphical action blocks are executed in a planned sequence.",
      "explanation": "Page 3 prioritizes action programming directives."
    },
    {
      "id": "lunarrover-10",
      "topic": "programming",
      "learningSlide": 3,
      "prompt": "Which programming organization is highlighted as a learning difficulty?",
      "choices": [
        "No program order",
        "Sequential structure",
        "Only random execution",
        "Only manual operation"
      ],
      "correctIndex": 1,
      "hint": "Graphical action blocks are executed in a planned sequence.",
      "explanation": "Page 3 emphasizes understanding sequential programming."
    }
  ]
};

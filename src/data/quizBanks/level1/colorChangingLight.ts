/**
 * Level 1 question bank based on official Learning-PDF page-text extraction.
 * Image-dependent claims require teacher/visual review before publication.
 * Content only: intentionally not registered in the shared Quiz Studio.
 */
import type { QuizBank } from "../../quizStudio";

export const colorChangingLightBank: QuizBank = {
  "projectId": "color-changing-light",
  "title": "Color-Changing Light",
  "sourcePdfPath": "public/Level 1/Learning/Illumination & Signals/Color-changing Light/02.Color- changing Light -Slides.pdf",
  "sourcePageCount": 30,
  "questions": [
    {
      "id": "color-changing-light-01",
      "topic": "lamp-uses",
      "learningSlide": 3,
      "prompt": "What was the original purpose of electric lamps described in the lesson?",
      "choices": [
        "To light spaces at night",
        "To measure distance",
        "To send motor commands",
        "To turn gears"
      ],
      "correctIndex": 0,
      "hint": "Think about why people use a light source after dark.",
      "explanation": "The introduction says electric lamps originally illuminated spaces at night."
    },
    {
      "id": "color-changing-light-02",
      "topic": "lamp-uses",
      "learningSlide": 4,
      "prompt": "Where are colour-changing lights used according to the lesson?",
      "choices": [
        "Only inside robot batteries",
        "Festivals and stage lighting",
        "Only inside engines",
        "Only under water"
      ],
      "correctIndex": 1,
      "hint": "Recall the public and entertainment settings mentioned.",
      "explanation": "The lesson gives celebrations and stage lighting as examples."
    },
    {
      "id": "color-changing-light-03",
      "topic": "module-and-ports",
      "learningSlide": 7,
      "prompt": "Which colour can the lesson's colour lamp module emit?",
      "choices": [
        "Black light from no LEDs",
        "Infrared only",
        "Cyan",
        "Brown"
      ],
      "correctIndex": 2,
      "hint": "Think about the module's named light colours.",
      "explanation": "The source lists cyan among its seven programmable light colours."
    },
    {
      "id": "color-changing-light-04",
      "topic": "module-and-ports",
      "learningSlide": 8,
      "prompt": "Which group of controller ports can be used for the colour lamp module?",
      "choices": [
        "Only motor port A",
        "Only charging USB-C",
        "Only headphone ports",
        "P1–P8"
      ],
      "correctIndex": 3,
      "hint": "The lesson shows several numbered composite ports.",
      "explanation": "The module connects to one of the controller's P1–P8 ports."
    },
    {
      "id": "color-changing-light-05",
      "topic": "sequential-goal",
      "learningSlide": 6,
      "prompt": "Which colour should the programmed lamp show first?",
      "choices": [
        "Yellow",
        "Blue",
        "Red",
        "Purple"
      ],
      "correctIndex": 0,
      "hint": "Recall the order of the three-step task.",
      "explanation": "The required sequence starts with yellow."
    },
    {
      "id": "color-changing-light-06",
      "topic": "sequential-goal",
      "learningSlide": 6,
      "prompt": "How long should each of the three required colours remain on?",
      "choices": [
        "One millisecond",
        "Two seconds",
        "Half a minute",
        "Ten minutes"
      ],
      "correctIndex": 1,
      "hint": "The project gives the same duration to each colour.",
      "explanation": "Yellow, red and blue are each displayed for two seconds."
    },
    {
      "id": "color-changing-light-07",
      "topic": "wait-and-sequence",
      "learningSlide": 20,
      "prompt": "What does the 'Wait ( ) seconds' coding block do?",
      "choices": [
        "Changes every sensor port",
        "Erases all programs",
        "Pauses for a specified duration before continuing",
        "Stops the robot forever"
      ],
      "correctIndex": 2,
      "hint": "Consider the program's timing between two commands.",
      "explanation": "The wait block delays execution before the following block."
    },
    {
      "id": "color-changing-light-08",
      "topic": "wait-and-sequence",
      "learningSlide": 21,
      "prompt": "In what order are sequential program blocks executed?",
      "choices": [
        "Randomly",
        "Always in reverse",
        "In all possible orders at once",
        "Top to bottom, one by one"
      ],
      "correctIndex": 3,
      "hint": "Recall the flow-chart rule.",
      "explanation": "The lesson describes sequential execution from top to bottom."
    },
    {
      "id": "color-changing-light-09",
      "topic": "expansion-and-review",
      "learningSlide": 17,
      "prompt": "What two settings are selected in a colour-lamp coding block?",
      "choices": [
        "Controller port and light colour",
        "Gear size and axle length",
        "Screen picture and speaker volume",
        "Compass heading and travel speed"
      ],
      "correctIndex": 0,
      "hint": "Think about identifying which lamp changes and how.",
      "explanation": "The lamp block sets its composite port and chosen colour."
    },
    {
      "id": "color-changing-light-10",
      "topic": "expansion-and-review",
      "learningSlide": 25,
      "prompt": "What extra display feature is suggested after programming the lamp?",
      "choices": [
        "Disconnect the controller",
        "Show the current light colour on the controller screen",
        "Remove the colour-changing module",
        "Hide the active colour"
      ],
      "correctIndex": 1,
      "hint": "Recall the lesson's expansion task.",
      "explanation": "The expansion asks students to show the lamp's current colour on the screen."
    }
  ]
};

/** Derived from the supplied Level 2 Building PDF used as Learning fallback. Source uses a teacher guide plus illustrated construction steps. */
import type { QuizBank } from "../../quizStudio";
export const rollingShutterBank: QuizBank = {
  "projectId": "level-2-rolling-shutter",
  "title": "Rolling Shutter",
  "sourcePdfPath": "public/Rolling Shutter.pdf",
  "sourcePageCount": 16,
  "questions": [
    {
      "id": "rollingShutter-01",
      "topic": "purpose",
      "learningSlide": 4,
      "prompt": "Which everyday door is mentioned as a use case for a rolling shutter?",
      "choices": [
        "A submarine hatch",
        "An aircraft wing",
        "An elevator display",
        "A garage shutter"
      ],
      "correctIndex": 3,
      "explanation": "The Rolling Shutter teaching manual identifies this in its purpose lesson (page 4): a garage shutter.",
      "hint": "Think about the role of purpose in the model."
    },
    {
      "id": "rollingShutter-02",
      "topic": "purpose",
      "learningSlide": 4,
      "prompt": "What problem introduces the need for a stronger door in the story?",
      "choices": [
        "The river is too wide",
        "The old door is broken",
        "The lamp is too bright",
        "A car has no tires"
      ],
      "correctIndex": 1,
      "explanation": "The Rolling Shutter teaching manual identifies this in its purpose lesson (page 4): the old door is broken.",
      "hint": "Think about the role of purpose in the model."
    },
    {
      "id": "rollingShutter-03",
      "topic": "crawler-frame",
      "learningSlide": 3,
      "prompt": "Which structural connection is a lesson focus?",
      "choices": [
        "Lens and mirror",
        "Light and microphone",
        "Compass and screen",
        "Crawler and beam"
      ],
      "correctIndex": 3,
      "explanation": "The Rolling Shutter teaching manual identifies this in its crawler frame lesson (page 3): crawler and beam.",
      "hint": "Think about the role of crawler frame in the model."
    },
    {
      "id": "rollingShutter-04",
      "topic": "crawler-frame",
      "learningSlide": 3,
      "prompt": "What is an important build outcome of the lesson?",
      "choices": [
        "A water pump",
        "A functioning shutter structure",
        "A suspended bridge",
        "A rotating camera"
      ],
      "correctIndex": 1,
      "explanation": "The Rolling Shutter teaching manual identifies this in its crawler frame lesson (page 3): a functioning shutter structure.",
      "hint": "Think about the role of crawler frame in the model."
    },
    {
      "id": "rollingShutter-05",
      "topic": "sensors",
      "learningSlide": 3,
      "prompt": "What type of sensors are included in the programming objectives?",
      "choices": [
        "Air-pressure sensors only",
        "Color camera only",
        "Humidity sensors",
        "Impact sensors"
      ],
      "correctIndex": 3,
      "explanation": "The Rolling Shutter teaching manual identifies this in its sensors lesson (page 3): impact sensors.",
      "hint": "Think about the role of sensors in the model."
    },
    {
      "id": "rollingShutter-06",
      "topic": "sensors",
      "learningSlide": 3,
      "prompt": "Why might an impact sensor help control a moving shutter?",
      "choices": [
        "It increases battery size",
        "It can respond to contact at an endpoint",
        "It changes the steel's weight",
        "It magnifies light"
      ],
      "correctIndex": 1,
      "explanation": "The Rolling Shutter teaching manual identifies this in its sensors lesson (page 3): it can respond to contact at an endpoint.",
      "hint": "Think about the role of sensors in the model."
    },
    {
      "id": "rollingShutter-07",
      "topic": "closed-loop",
      "learningSlide": 3,
      "prompt": "Which motor concept appears in the learning objectives?",
      "choices": [
        "A light-only motor",
        "A clock spring only",
        "A temperature display",
        "Closed-loop motor control"
      ],
      "correctIndex": 3,
      "explanation": "The Rolling Shutter teaching manual identifies this in its closed loop lesson (page 3): closed-loop motor control.",
      "hint": "Think about the role of closed loop in the model."
    },
    {
      "id": "rollingShutter-08",
      "topic": "closed-loop",
      "learningSlide": 3,
      "prompt": "Which programming concept is also highlighted?",
      "choices": [
        "A paper illustration",
        "Sequential instructions",
        "No program sequence",
        "Only random colors"
      ],
      "correctIndex": 1,
      "explanation": "The Rolling Shutter teaching manual identifies this in its closed loop lesson (page 3): sequential instructions.",
      "hint": "Think about the role of closed loop in the model."
    },
    {
      "id": "rollingShutter-09",
      "topic": "timing-speed",
      "learningSlide": 5,
      "prompt": "Which value should be adjusted to change the shutter opening speed?",
      "choices": [
        "The classroom clock",
        "The shutter's name",
        "The font size",
        "Motor speed setting"
      ],
      "correctIndex": 3,
      "explanation": "The Rolling Shutter teaching manual identifies this in its timing speed lesson (page 5): motor speed setting.",
      "hint": "Think about the role of timing speed in the model."
    },
    {
      "id": "rollingShutter-10",
      "topic": "timing-speed",
      "learningSlide": 6,
      "prompt": "Which settings are discussed for determining how far the shutter opens?",
      "choices": [
        "Photo resolution",
        "Program time or speed",
        "Speaker pitch and volume",
        "Room temperature only"
      ],
      "correctIndex": 1,
      "explanation": "The Rolling Shutter teaching manual identifies this in its timing speed lesson (page 6): program time or speed.",
      "hint": "Think about the role of timing speed in the model."
    }
  ]
};

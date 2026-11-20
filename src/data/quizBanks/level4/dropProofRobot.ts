/** Level 4 Learning PDF text checked page by page; questions do not depend on unreviewed diagrams. */
import type { QuizBank } from "../../quizStudio";

export const dropProofRobotBank: QuizBank = {
  "projectId": "level-4-drop-proof-robot",
  "title": "Drop-proof Robot",
  "sourcePdfPath": "public/Level 4/Advanced Navigation & Control/Drop-proof Robot/12.Drop-proof Robot-update.pdf",
  "sourcePageCount": 18,
  "questions": [
    {
      "id": "l4-dp-01",
      "topic": "reflection",
      "learningSlide": 6,
      "prompt": "What can a very low returned light value indicate for the drop-proof robot?",
      "choices": [
        "The motor is hotter",
        "Not enough light has reflected back from below",
        "The battery voltage has doubled",
        "The robot has reached a password screen"
      ],
      "correctIndex": 1,
      "explanation": "Slide 6 describes weak reflected light as the edge-detection cue.",
      "hint": "What happens to the reflection where there is no ground?"
    },
    {
      "id": "l4-dp-02",
      "topic": "reflection",
      "learningSlide": 6,
      "prompt": "Why can downward reflected light help with drop prevention?",
      "choices": [
        "It always detects temperature",
        "It counts wireless messages",
        "It determines the wheel diameter",
        "A missing reflection can warn of absent ground"
      ],
      "correctIndex": 3,
      "explanation": "Slide 6 explains that weak reflection can be combined with electronics to prevent falls.",
      "hint": "Think about the edge of a tabletop."
    },
    {
      "id": "l4-dp-03",
      "topic": "sensor-placement",
      "learningSlide": 9,
      "prompt": "Where do the two photosensitive sensors point in this model?",
      "choices": [
        "Toward the ground",
        "Toward the roof",
        "At the display",
        "Directly toward each other"
      ],
      "correctIndex": 0,
      "explanation": "Slide 9 specifies a dual photosensitive arrangement facing the ground.",
      "hint": "What surface does the model need to check?"
    },
    {
      "id": "l4-dp-04",
      "topic": "sensor-placement",
      "learningSlide": 10,
      "prompt": "Which arrangement is specified for the pair of photosensitive sensors?",
      "choices": [
        "Both face backward",
        "One faces the ceiling",
        "Parallel and vertically directed downward",
        "Hidden behind the controller"
      ],
      "correctIndex": 2,
      "explanation": "Slide 10 states that the two sensors must be parallel and point vertically down.",
      "hint": "Each sensor must watch the surface below."
    },
    {
      "id": "l4-dp-05",
      "topic": "component-selection",
      "learningSlide": 10,
      "prompt": "Which sensing component is listed for the drop-proof model?",
      "choices": [
        "Magnetic sensor",
        "Light sensor",
        "Barometric sensor",
        "Sound sensor"
      ],
      "correctIndex": 1,
      "explanation": "Slide 10 names the light sensor in the equipment list.",
      "hint": "The device must detect brightness."
    },
    {
      "id": "l4-dp-06",
      "topic": "component-selection",
      "learningSlide": 10,
      "prompt": "What controller is listed with the light sensor?",
      "choices": [
        "Monitor screen",
        "Camera tripod",
        "Radio antenna",
        "RCU"
      ],
      "correctIndex": 3,
      "explanation": "Slide 10 identifies the RCU among electronic components.",
      "hint": "Look for the controller's abbreviation."
    },
    {
      "id": "l4-dp-07",
      "topic": "assembly",
      "learningSlide": 12,
      "prompt": "What is an explicit requirement for the assembled model?",
      "choices": [
        "Stable structure",
        "Loose joints",
        "Open wiring at the edge",
        "Unattached sensors"
      ],
      "correctIndex": 0,
      "explanation": "Slide 12 lists structural stability as a requirement.",
      "hint": "The machine should stay together during movement."
    },
    {
      "id": "l4-dp-08",
      "topic": "assembly",
      "learningSlide": 12,
      "prompt": "What other consideration appears beside structural stability?",
      "choices": [
        "Maximize speaker volume",
        "Remove the controller",
        "Correct balance and a suitable shape",
        "Use one sensor facing upward"
      ],
      "correctIndex": 2,
      "explanation": "Slide 12 emphasizes appropriate focus/balance and matching shape.",
      "hint": "Think about weight distribution and shape."
    },
    {
      "id": "l4-dp-09",
      "topic": "programming",
      "learningSlide": 14,
      "prompt": "What quantity does the drop-proof program judge?",
      "choices": [
        "Air pressure",
        "Light intensity",
        "Magnetic north",
        "Humidity"
      ],
      "correctIndex": 1,
      "explanation": "Slide 14 labels the condition as light-intensity judgement.",
      "hint": "It checks the signal that indicates a surface."
    },
    {
      "id": "l4-dp-10",
      "topic": "programming",
      "learningSlide": 14,
      "prompt": "Which control structure is named in the programming slide?",
      "choices": [
        "Speech recognition",
        "Map navigation",
        "Random music playback",
        "A repeated light-intensity check with actions"
      ],
      "correctIndex": 3,
      "explanation": "Slide 14 shows start, repeat, light-intensity judgement, defined variables and actions.",
      "hint": "The robot must keep checking while it moves."
    }
  ]
};

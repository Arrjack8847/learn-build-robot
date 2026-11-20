import type { QuizBank } from "../../quizStudio";
/** Source-grounded Level 6 quiz; original 26-page Learning PDF. */
export const intelligentSortingMachineBank: QuizBank = {
  "projectId": "level-6-intelligent-sorting-machine",
  "title": "Intelligent Sorting Machine",
  "sourcePdfPath": "public/Level 6/Learning/Sensor Automation/Intelligent Sorting Machine/24.Intelligent Sorting Machine-Slides.pdf",
  "sourcePageCount": 26,
  "questions": [
    {
      "id": "ism-01",
      "topic": "image-learning",
      "learningSlide": 7,
      "prompt": "Which visual features can image classification use to distinguish items?",
      "choices": [
        "Texture, shape and colour",
        "Only their prices",
        "Only the current clock time",
        "Only motor temperature"
      ],
      "correctIndex": 0,
      "hint": "Recognition compares image characteristics.",
      "explanation": "Slide 7 lists texture, shape and colour."
    },
    {
      "id": "ism-02",
      "topic": "image-learning",
      "learningSlide": 8,
      "prompt": "How many different objects are initially chosen for image learning?",
      "choices": [
        "One",
        "Three",
        "Ten",
        "Sixteen"
      ],
      "correctIndex": 1,
      "hint": "The lesson trains IDs 1, 2 and 3.",
      "explanation": "Slide 8 asks students to choose three learning objects."
    },
    {
      "id": "ism-03",
      "topic": "classification",
      "learningSlide": 11,
      "prompt": "What does image-classification ID return if nothing is recognized?",
      "choices": [
        "240",
        "999",
        "0",
        "-120"
      ],
      "correctIndex": 2,
      "hint": "Zero is the no-recognition value.",
      "explanation": "Slide 11 specifies ID 0 when no trained image is recognized."
    },
    {
      "id": "ism-04",
      "topic": "classification",
      "learningSlide": 17,
      "prompt": "Which detection mode does the AI vision module use?",
      "choices": [
        "Road recognition",
        "Tag-code password mode",
        "Weather sensing",
        "Image classification learning"
      ],
      "correctIndex": 3,
      "hint": "The machine identifies the type of object.",
      "explanation": "Slide 17 activates image classification learning."
    },
    {
      "id": "ism-05",
      "topic": "connections",
      "learningSlide": 14,
      "prompt": "Which controller port connects to the AI vision module?",
      "choices": [
        "P8",
        "M1",
        "M3",
        "M5"
      ],
      "correctIndex": 0,
      "hint": "The camera uses an input port rather than a motor output.",
      "explanation": "Slide 14 specifies P8 for AI vision."
    },
    {
      "id": "ism-06",
      "topic": "connections",
      "learningSlide": 14,
      "prompt": "Which motor ports are used by the sorter?",
      "choices": [
        "P8 and P9",
        "M1 and M3",
        "M7 and M8",
        "Only P8"
      ],
      "correctIndex": 1,
      "hint": "Two motors drive the sorting mechanism.",
      "explanation": "Slide 14 connects motors to M1 and M3."
    },
    {
      "id": "ism-07",
      "topic": "pick-and-place",
      "learningSlide": 19,
      "prompt": "What condition can trigger the grab-at-point function?",
      "choices": [
        "The AI image ID is always zero",
        "The camera is physically unplugged",
        "Recognized ID X is greater than zero",
        "The timer reads midnight"
      ],
      "correctIndex": 2,
      "hint": "Only recognized objects should be grabbed.",
      "explanation": "Slide 19 requires X > 0 before grabbing."
    },
    {
      "id": "ism-08",
      "topic": "pick-and-place",
      "learningSlide": 21,
      "prompt": "What happens after the mechanism reaches the selected drop-off position?",
      "choices": [
        "The system deletes the learned IDs",
        "The object is returned to the camera lens",
        "The machine changes to road-following mode",
        "The motor stops and the object is put down"
      ],
      "correctIndex": 3,
      "hint": "Sorting ends at a designated location.",
      "explanation": "Slide 21 stops the motor and places the object."
    },
    {
      "id": "ism-09",
      "topic": "home-position",
      "learningSlide": 24,
      "prompt": "What should happen after each sorting cycle in the expansion task?",
      "choices": [
        "Return automatically to the original position",
        "Forget all previously trained images",
        "Increase the belt speed forever",
        "Switch to a QR-code alarm"
      ],
      "correctIndex": 0,
      "hint": "The next cycle should start from the same home position.",
      "explanation": "Slide 24 requests an automatic return to the starting position."
    },
    {
      "id": "ism-10",
      "topic": "home-position",
      "learningSlide": 20,
      "prompt": "Why does the program use the recognized ID in its target-position calculation?",
      "choices": [
        "The ID is only used to change text colour",
        "Different object types must go to different positions",
        "All objects must be released at random places",
        "The ID measures air pressure"
      ],
      "correctIndex": 1,
      "hint": "Slide 20 calculates the motor target using the object ID.",
      "explanation": "The target position depends on X, the classification ID."
    }
  ]
};

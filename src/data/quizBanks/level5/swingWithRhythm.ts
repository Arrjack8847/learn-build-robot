/** Source-reviewed against the official 23-page Level 5 Learning PDF. */
import type { QuizBank } from "../../quizStudio";

export const swingWithRhythmBank: QuizBank = {
  "projectId": "level-5-swing-with-rhythm",
  "title": "Swing With Rhythm",
  "sourcePdfPath": "public/Level 5/Learning/Sound & Voice Interaction/Swing With Rhythm/24. Swing With Rhythm-Teaching Slides.pdf",
  "sourcePageCount": 23,
  "questions": [
    {
      "id": "level-5-swing-with-rhythm-01",
      "topic": "swing-motion",
      "learningSlide": 10,
      "prompt": "Which action described in the lesson can help a person swing higher?",
      "choices": [
        "A push timed with the motion",
        "Keeping the swing permanently still",
        "Removing the supporting ropes",
        "Pushing once only when the swing is at rest forever"
      ],
      "correctIndex": 0,
      "hint": "The timing of a push matters.",
      "explanation": "Slide 10 notes that being pushed as the swing moves can increase swing height."
    },
    {
      "id": "level-5-swing-with-rhythm-02",
      "topic": "swing-motion",
      "learningSlide": 11,
      "prompt": "What does the lesson suggest can influence swing height without a helper pushing?",
      "choices": [
        "Reading a QR code",
        "Changing one's posture during the swing",
        "Changing the swing's paint color",
        "Measuring the Earth's magnetic poles"
      ],
      "correctIndex": 1,
      "hint": "The body can move with the rhythm of the swing.",
      "explanation": "Slide 11 describes using standing and squatting movements at different points to increase the swing."
    },
    {
      "id": "level-5-swing-with-rhythm-03",
      "topic": "gesture-controlled-model",
      "learningSlide": 13,
      "prompt": "Which sensor lets the classroom swing respond to hand motions?",
      "choices": [
        "Laser speed detector",
        "Infrared passenger counter",
        "Gesture sensor",
        "Air pressure sensor"
      ],
      "correctIndex": 2,
      "hint": "The model reacts to different hand gestures.",
      "explanation": "Slide 13 identifies a gesture sensor controlling the model swing."
    },
    {
      "id": "level-5-swing-with-rhythm-04",
      "topic": "gesture-controlled-model",
      "learningSlide": 13,
      "prompt": "What transmits motion in the classroom swing mechanism?",
      "choices": [
        "A magnetic locking bolt",
        "A QR-code reader",
        "A hot-air blower",
        "A rubber band drive"
      ],
      "correctIndex": 3,
      "hint": "The illustrated assembly labels this transmission element.",
      "explanation": "Slide 13 labels the rubber band as the drive transmission."
    },
    {
      "id": "level-5-swing-with-rhythm-05",
      "topic": "program-initialization",
      "learningSlide": 15,
      "prompt": "What motor speed does the lesson set at the beginning of its sample program?",
      "choices": [
        "30",
        "0.02",
        "150",
        "2000"
      ],
      "correctIndex": 0,
      "hint": "The programming slide states a specific initial speed.",
      "explanation": "Slide 15 initializes the motor speed to 30."
    },
    {
      "id": "level-5-swing-with-rhythm-06",
      "topic": "program-initialization",
      "learningSlide": 16,
      "prompt": "Where is the recognized gesture value stored during operation?",
      "choices": [
        "In a passenger traffic total",
        "In the current-gesture variable",
        "In a calculated Moon-distance variable",
        "Only in the motor's physical shaft"
      ],
      "correctIndex": 1,
      "hint": "The program needs to compare the new reading with a saved one.",
      "explanation": "Slide 16 says to read the gesture sensor into the current-gesture variable."
    },
    {
      "id": "level-5-swing-with-rhythm-07",
      "topic": "gesture-comparison",
      "learningSlide": 14,
      "prompt": "Why must the program treat gesture value 0 specially?",
      "choices": [
        "Zero means the motor must double its speed",
        "Zero represents a magnetic south pole",
        "Zero represents the absence of a gesture and needs a separate check",
        "Zero means a clockwise gesture"
      ],
      "correctIndex": 2,
      "hint": "There may be no gesture to compare.",
      "explanation": "Slide 14 highlights gesture 0 as a special case in comparing successive gestures."
    },
    {
      "id": "level-5-swing-with-rhythm-08",
      "topic": "gesture-comparison",
      "learningSlide": 17,
      "prompt": "What causes the swing motor to reverse direction in the lesson?",
      "choices": [
        "A gesture identical to the previous one",
        "A constant sensor reading of zero",
        "The controller having no variables",
        "A nonzero current gesture different from the last gesture"
      ],
      "correctIndex": 3,
      "hint": "A change in detected gesture controls direction.",
      "explanation": "Slide 17 reverses the motor when the current gesture is nonzero and differs from the preceding gesture."
    },
    {
      "id": "level-5-swing-with-rhythm-09",
      "topic": "speed-extension",
      "learningSlide": 21,
      "prompt": "What happens in the basic program when the gesture changes?",
      "choices": [
        "The motor reverses while maintaining its previous speed",
        "The motor always accelerates by 100",
        "The program stops reading gestures forever",
        "The model switches to temperature sensing"
      ],
      "correctIndex": 0,
      "hint": "The extension adds a feature not yet present.",
      "explanation": "Slide 21 says the initial behavior reverses direction at the original speed."
    },
    {
      "id": "level-5-swing-with-rhythm-10",
      "topic": "speed-extension",
      "learningSlide": 21,
      "prompt": "What change does the lesson ask students to make in the optimization task?",
      "choices": [
        "Never change motor speed or direction",
        "Adjust speed as well as rotation direction",
        "Remove the gesture variable",
        "Turn the sensor into a QR scanner"
      ],
      "correctIndex": 1,
      "hint": "The goal is to make the swing become faster.",
      "explanation": "Slide 21 proposes adjusting speed alongside direction so the swing becomes faster."
    }
  ]
};

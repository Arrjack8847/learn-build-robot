/** Source-checked questions from the 21-page official Level 5 Learning PDF. */
import type { QuizBank } from "../../quizStudio";

export const luckyPrizeWheelBank: QuizBank = {
  "projectId": "level-5-lucky-prize-wheel",
  "title": "Lucky Prize Wheel",
  "sourcePdfPath": "public/Level 5/Learning/Characters & Structures/Lucky Prize Wheel/21. Lucky Prize Wheel -Teaching Slides.pdf",
  "sourcePageCount": 21,
  "questions": [
    {
      "id": "level-5-lucky-prize-wheel-01",
      "topic": "gesture-sensor",
      "learningSlide": 7,
      "prompt": "Approximately how far from the sensor should a hand gesture be made in this lesson?",
      "choices": [
        "3 to 10 centimeters",
        "One to two meters",
        "Ten to twenty meters",
        "Exactly five kilometers"
      ],
      "correctIndex": 0,
      "hint": "The hand needs to be close to the small sensor.",
      "explanation": "Slide 7 gives an approximate 3–10 cm gesture-detection distance."
    },
    {
      "id": "level-5-lucky-prize-wheel-02",
      "topic": "gesture-sensor",
      "learningSlide": 8,
      "prompt": "How does the described gesture sensor recognize a hand movement?",
      "choices": [
        "By recording the user's voice",
        "By detecting the direction of light reflected from the hand",
        "By detecting the hand's magnetic north pole",
        "By measuring the user's body temperature alone"
      ],
      "correctIndex": 1,
      "hint": "A light source and optical detector are built in.",
      "explanation": "Slide 8 describes recognizing gestures from the direction of reflected light."
    },
    {
      "id": "level-5-lucky-prize-wheel-03",
      "topic": "gesture-codes",
      "learningSlide": 9,
      "prompt": "What does a gesture-sensor return value of 0 mean?",
      "choices": [
        "Wave left",
        "Wave right",
        "No gesture detected",
        "Wave clockwise"
      ],
      "correctIndex": 2,
      "hint": "Zero indicates a missing input.",
      "explanation": "Slide 9 maps return value 0 to no detected gesture."
    },
    {
      "id": "level-5-lucky-prize-wheel-04",
      "topic": "gesture-codes",
      "learningSlide": 9,
      "prompt": "Which sensor return value corresponds to a wave to the right?",
      "choices": [
        "4",
        "8",
        "1",
        "2"
      ],
      "correctIndex": 3,
      "hint": "Wave left is 1; right has the next code.",
      "explanation": "Slide 9 maps value 2 to a wave right."
    },
    {
      "id": "level-5-lucky-prize-wheel-05",
      "topic": "direction-control",
      "learningSlide": 12,
      "prompt": "How is the wheel programmed to respond when it recognizes a wave left?",
      "choices": [
        "Rotate clockwise",
        "Rotate counterclockwise",
        "Disable the sensor permanently",
        "Move only in a straight line"
      ],
      "correctIndex": 0,
      "hint": "The lesson pairs left with one rotation direction.",
      "explanation": "Slide 12 says a left wave causes clockwise rotation."
    },
    {
      "id": "level-5-lucky-prize-wheel-06",
      "topic": "direction-control",
      "learningSlide": 15,
      "prompt": "What motor action is assigned to a recognized wave right?",
      "choices": [
        "Clockwise rotation",
        "Counterclockwise rotation",
        "No rotation ever",
        "Vertical movement of the base"
      ],
      "correctIndex": 1,
      "hint": "The two wave directions rotate the pointer in opposite directions.",
      "explanation": "Slide 15 says a wave right makes the wheel rotate counterclockwise."
    },
    {
      "id": "level-5-lucky-prize-wheel-07",
      "topic": "input-handling",
      "learningSlide": 13,
      "prompt": "What is the first information-handling action of the wheel's sample program?",
      "choices": [
        "Measure atmospheric pressure",
        "Store the driver's license number",
        "Store the gesture sensor's return value in a variable",
        "Delete every recorded input"
      ],
      "correctIndex": 2,
      "hint": "The logic must remember what gesture was sensed.",
      "explanation": "Slide 13 instructs the program to store information from the gesture sensor in a variable."
    },
    {
      "id": "level-5-lucky-prize-wheel-08",
      "topic": "input-handling",
      "learningSlide": 14,
      "prompt": "What should the program display if it detects no hand gesture?",
      "choices": [
        "A guaranteed winning prize",
        "An unrelated pressure value",
        "The current passenger count",
        "A prompt for the missing gesture input"
      ],
      "correctIndex": 3,
      "hint": "The program checks for input before deciding a direction.",
      "explanation": "Slide 14 says to prioritize checking whether a gesture exists and display prompt information when none is detected."
    },
    {
      "id": "level-5-lucky-prize-wheel-09",
      "topic": "program-extension",
      "learningSlide": 16,
      "prompt": "What should the integrated program do about its unrecognized-gesture message after a gesture is recognized?",
      "choices": [
        "Refresh the information about unrecognized gestures",
        "Display it permanently without change",
        "Replace it with a temperature reading",
        "Shut down the entire controller"
      ],
      "correctIndex": 0,
      "hint": "Feedback should update when input changes.",
      "explanation": "Slide 16 instructs refreshing the unrecognized-gesture information after each recognized gesture."
    },
    {
      "id": "level-5-lucky-prize-wheel-10",
      "topic": "program-extension",
      "learningSlide": 19,
      "prompt": "What extension does the lesson suggest for the gesture-controlled prize wheel?",
      "choices": [
        "Use only one fixed rotation length forever",
        "Add gestures that trigger longer or shorter rotations",
        "Remove gesture sensing entirely",
        "Make every input stop all motion"
      ],
      "correctIndex": 1,
      "hint": "The proposed extension adds more ways to control turn length.",
      "explanation": "Slide 19 proposes using additional gestures to distinguish longer and shorter turns."
    }
  ]
};

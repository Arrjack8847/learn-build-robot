/** Source-checked questions from the 20-page official Level 5 Learning PDF. */
import type { QuizBank } from "../../quizStudio";

export const musicBoxBank: QuizBank = {
  "projectId": "level-5-music-box",
  "title": "Music Box",
  "sourcePdfPath": "public/Level 5/Learning/Complex Mechanisms & Coordinated Motion/Music box/Music box-update.pdf",
  "sourcePageCount": 20,
  "questions": [
    {
      "id": "level-5-music-box-01",
      "topic": "color-detection",
      "learningSlide": 7,
      "prompt": "What makes the classroom music box respond to different objects?",
      "choices": [
        "A sensor that detects different colors",
        "A laser speed detector",
        "A barometric pressure sensor",
        "An infrared passenger counter"
      ],
      "correctIndex": 0,
      "hint": "The lesson adds a new sensor to the traditional music box.",
      "explanation": "Slide 7 says the model adds a sensor so different sensed colors can produce different sounds."
    },
    {
      "id": "level-5-music-box-02",
      "topic": "color-detection",
      "learningSlide": 9,
      "prompt": "How does the lesson describe the color sensor's recognition process?",
      "choices": [
        "It checks the object's color against reference colors",
        "It measures the object's mass with a spring",
        "It calculates the Earth's rotation",
        "It listens for the object's name"
      ],
      "correctIndex": 0,
      "hint": "It compares what it sees with known colors.",
      "explanation": "Slide 9 says the sensor compares an object's color with reference colors within an allowed error range."
    },
    {
      "id": "level-5-music-box-03",
      "topic": "color-values",
      "learningSlide": 9,
      "prompt": "Which value represents the color red in the lesson's sensor output?",
      "choices": [
        "1",
        "2",
        "4",
        "6"
      ],
      "correctIndex": 0,
      "hint": "Red has the first color code.",
      "explanation": "Slide 9 lists red as sensor value 1."
    },
    {
      "id": "level-5-music-box-04",
      "topic": "color-values",
      "learningSlide": 9,
      "prompt": "Which color corresponds to a sensor value of 3?",
      "choices": [
        "White",
        "Blue",
        "Yellow",
        "Green"
      ],
      "correctIndex": 1,
      "hint": "The reference list goes red, green, blue.",
      "explanation": "Slide 9 lists blue as value 3."
    },
    {
      "id": "level-5-music-box-05",
      "topic": "display-visibility",
      "learningSlide": 10,
      "prompt": "Why should the displayed text color differ from the display background?",
      "choices": [
        "Similar colors can make text hard to see",
        "Matching colors always increases text contrast",
        "The sensor will stop recognizing colors otherwise",
        "The motor always spins faster"
      ],
      "correctIndex": 0,
      "hint": "Consider legibility when foreground blends into background.",
      "explanation": "Slide 10 warns that similar font and background colors make text invisible or difficult to read."
    },
    {
      "id": "level-5-music-box-06",
      "topic": "display-visibility",
      "learningSlide": 10,
      "prompt": "What information is configured in the lesson's display-string block?",
      "choices": [
        "Display position, line and text string",
        "Only the motor's power cable",
        "Only the robot's battery size",
        "Only the distance to a laser target"
      ],
      "correctIndex": 0,
      "hint": "The block determines where and what text is drawn.",
      "explanation": "Slide 10 describes the display location/line and the text string as display parameters."
    },
    {
      "id": "level-5-music-box-07",
      "topic": "program-behavior",
      "learningSlide": 15,
      "prompt": "What does the introductory color program show when the sensor detects red?",
      "choices": [
        "The corresponding detected color value on screen",
        "The current air pressure",
        "An unrelated speed graph",
        "A map of passenger flow"
      ],
      "correctIndex": 0,
      "hint": "The first programming example shows the reading itself.",
      "explanation": "Slide 15 specifies displaying the corresponding value when red is detected."
    },
    {
      "id": "level-5-music-box-08",
      "topic": "program-behavior",
      "learningSlide": 17,
      "prompt": "What extra behavior is demonstrated after red is detected in the later programming example?",
      "choices": [
        "Play music and rotate the doll",
        "Read a QR code to unlock a gate",
        "Calculate the speed of light",
        "Stop all display output"
      ],
      "correctIndex": 0,
      "hint": "The later activity combines sound and mechanical motion.",
      "explanation": "Slide 17 instructs showing red-related output while playing music and rotating the doll."
    },
    {
      "id": "level-5-music-box-09",
      "topic": "assembly-design",
      "learningSlide": 12,
      "prompt": "Which requirement is stated for the music-box construction?",
      "choices": [
        "Build a stable structure",
        "Always remove all support beams",
        "Use a structure that cannot stand",
        "Leave the center of mass deliberately unsupported"
      ],
      "correctIndex": 0,
      "hint": "The assembly checklist starts with stability.",
      "explanation": "Slide 12 includes a stable structure among the assembly requirements."
    },
    {
      "id": "level-5-music-box-10",
      "topic": "assembly-design",
      "learningSlide": 12,
      "prompt": "What does the lesson's assembly checklist say about the model's center of gravity?",
      "choices": [
        "It should be appropriately positioned",
        "It must always be outside the base",
        "It can never matter",
        "It must be placed at the highest possible point"
      ],
      "correctIndex": 0,
      "hint": "The checklist mentions the model's focus or balance.",
      "explanation": "Slide 12 includes appropriately positioning the model's focus/center of gravity as an assembly requirement."
    }
  ]
};

import type { QuizBank } from "../../quizStudio";
export const smartSpeakerBank: QuizBank = {
  "projectId": "level-4-smart-speaker",
  "title": "Smart Speaker",
  "sourcePdfPath": "public/Level 4/Sound & Voice Interaction/Smart Speaker/30.Smart Speaker-Slides.pdf",
  "sourcePageCount": 29,
  "questions": [
    {
      "id": "l4-smart-speaker-1",
      "topic": "speaker-function",
      "learningSlide": 3,
      "prompt": "What does a speaker convert audio signals into?",
      "choices": [
        "Sound",
        "A temperature reading",
        "An image",
        "A distance reading"
      ],
      "correctIndex": 0,
      "explanation": "Speakers reproduce audio by converting electrical audio signals into sound.",
      "hint": "Think about the output of a speaker."
    },
    {
      "id": "l4-smart-speaker-2",
      "topic": "speaker-function",
      "learningSlide": 4,
      "prompt": "Which feature is commonly found on smart speakers?",
      "choices": [
        "Wheel steering",
        "Voice commands",
        "Mechanical typing keys",
        "Paper input"
      ],
      "correctIndex": 1,
      "explanation": "The lesson describes smart speakers as devices that can respond to voice commands.",
      "hint": "Think about the output of a speaker."
    },
    {
      "id": "l4-smart-speaker-3",
      "topic": "ultrasonic-control",
      "learningSlide": 5,
      "prompt": "Which sensor controls the volume of this speaker model?",
      "choices": [
        "Color sensor",
        "Infrared scanner",
        "Ultrasonic sensor",
        "Touch sensor only"
      ],
      "correctIndex": 2,
      "explanation": "The project uses ultrasound distance readings to control sound volume.",
      "hint": "Recall the sensor that notices a listener's position."
    },
    {
      "id": "l4-smart-speaker-4",
      "topic": "ultrasonic-control",
      "learningSlide": 5,
      "prompt": "What environmental change affects the audio level?",
      "choices": [
        "The controller's color",
        "The screen coordinates",
        "The PDF page",
        "The sensed distance"
      ],
      "correctIndex": 3,
      "explanation": "Changing the measured distance changes the volume chosen by the program.",
      "hint": "Recall the sensor that notices a listener's position."
    },
    {
      "id": "l4-smart-speaker-5",
      "topic": "volume-block",
      "learningSlide": 19,
      "prompt": "Which coding block changes the MP3 sound level?",
      "choices": [
        "Set MP3 sound volume",
        "Show picture",
        "Change motor encoder",
        "Scan code"
      ],
      "correctIndex": 0,
      "explanation": "Slide 19 introduces the MP3 volume-setting block used for playback.",
      "hint": "Consider how a program sets a numeric sound level."
    },
    {
      "id": "l4-smart-speaker-6",
      "topic": "volume-block",
      "learningSlide": 19,
      "prompt": "What is the allowed volume setting range in the lesson?",
      "choices": [
        "50 to 255",
        "0 to 28",
        "0 to 1000",
        "1 to 2"
      ],
      "correctIndex": 1,
      "explanation": "The MP3 sound volume parameter accepts values from 0 to 28.",
      "hint": "Consider how a program sets a numeric sound level."
    },
    {
      "id": "l4-smart-speaker-7",
      "topic": "playback-buttons",
      "learningSlide": 20,
      "prompt": "Which button begins MP3 playback?",
      "choices": [
        "Reset button",
        "No button",
        "Left button",
        "Right button"
      ],
      "correctIndex": 2,
      "explanation": "The model waits for the left button before starting its MP3 file.",
      "hint": "Follow the left-to-right button sequence."
    },
    {
      "id": "l4-smart-speaker-8",
      "topic": "playback-buttons",
      "learningSlide": 21,
      "prompt": "Which button ends the volume-control loop?",
      "choices": [
        "Left button",
        "Both buttons together",
        "The touchscreen keyboard",
        "Right button"
      ],
      "correctIndex": 3,
      "explanation": "The volume-control routine runs until the right button is pressed.",
      "hint": "Follow the left-to-right button sequence."
    },
    {
      "id": "l4-smart-speaker-9",
      "topic": "user-feedback",
      "learningSlide": 22,
      "prompt": "Why add a wait block between volume updates?",
      "choices": [
        "To prevent noise from rapid changes",
        "To enlarge the speaker",
        "To increase GPS precision",
        "To read a QR code"
      ],
      "correctIndex": 0,
      "explanation": "Rapid, repeated volume changes can create noise, so the lesson adds a wait block.",
      "hint": "Think about changes that make output smoother and clearer."
    },
    {
      "id": "l4-smart-speaker-10",
      "topic": "user-feedback",
      "learningSlide": 23,
      "prompt": "What gives an additional visual indication of distance?",
      "choices": [
        "A mechanical lever",
        "Color-lamp effects",
        "Printed paper",
        "A keyboard"
      ],
      "correctIndex": 1,
      "explanation": "Different colored lights can give a visual indication of the sensed distance.",
      "hint": "Think about changes that make output smoother and clearer."
    }
  ]
};

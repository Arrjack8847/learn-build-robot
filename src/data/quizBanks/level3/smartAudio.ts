/** Source-checked Level 3 Learning PDF questions; page references are 1-based. */
import type { QuizBank } from "../../quizStudio";

export const smartAudioBank: QuizBank = {
  "projectId": "level-3-smart-audio",
  "title": "Smart Audio",
  "sourcePdfPath": "public/Level 3/Learning/Sound & Voice Interaction/Smart Audio/Smart Audio_Powerpoint.pdf",
  "sourcePageCount": 21,
  "questions": [
    {
      "id": "audio-01",
      "topic": "auto-play",
      "learningSlide": 7,
      "prompt": "What makes the Smart Audio device begin playing music in the lesson?",
      "choices": [
        "A person approaches",
        "A wheel spins",
        "A random alarm",
        "A pressure gauge is tapped"
      ],
      "correctIndex": 0,
      "hint": "The example contrasts approaching and leaving.",
      "explanation": "Slide 7 says approaching the device makes music play automatically."
    },
    {
      "id": "audio-02",
      "topic": "auto-play",
      "learningSlide": 7,
      "prompt": "What does the introductory example do when a person leaves?",
      "choices": [
        "Increases volume forever",
        "Stops playing automatically",
        "Opens a parking gate",
        "Moves a robot arm"
      ],
      "correctIndex": 1,
      "hint": "Playback changes when the listener moves away.",
      "explanation": "Slide 7 says music automatically stops when a person leaves."
    },
    {
      "id": "audio-03",
      "topic": "ultrasonic-distance",
      "learningSlide": 2,
      "prompt": "What do students measure with the ultrasonic sensor in this lesson?",
      "choices": [
        "Humidity",
        "Color temperature",
        "Distance",
        "Battery weight"
      ],
      "correctIndex": 2,
      "hint": "The learning goal is about testing distances.",
      "explanation": "Slide 2 specifically teaches ultrasonic sensors for distance testing."
    },
    {
      "id": "audio-04",
      "topic": "ultrasonic-distance",
      "learningSlide": 3,
      "prompt": "Which hardware skill is named as a learning focus?",
      "choices": [
        "Repairing a camera",
        "Measuring magnetic fields",
        "Changing resolution",
        "Basic use of an ultrasonic sensor"
      ],
      "correctIndex": 3,
      "hint": "Look for the sensor named in the learning objectives.",
      "explanation": "Slide 3 lists the basic use of ultrasonic sensors."
    },
    {
      "id": "audio-05",
      "topic": "mp3-files",
      "learningSlide": 12,
      "prompt": "What does the Play MP3 module do?",
      "choices": [
        "Plays an MP3 music file on the controller",
        "Measures motor rotation",
        "Draws temperature graphs",
        "Reads infrared colors"
      ],
      "correctIndex": 0,
      "hint": "The module's name identifies an audio function.",
      "explanation": "Slide 12 describes the Play MP3 module."
    },
    {
      "id": "audio-06",
      "topic": "mp3-files",
      "learningSlide": 12,
      "prompt": "Which folder name follows the lesson's MP3 file arrangement rule?",
      "choices": [
        "Music-Folder",
        "01",
        "AudioOnly",
        "A"
      ],
      "correctIndex": 1,
      "hint": "The lesson requires number-based folder names.",
      "explanation": "Slide 12 says MP3 folder names start from 01 to 99."
    },
    {
      "id": "audio-07",
      "topic": "simple-distance-rule",
      "learningSlide": 17,
      "prompt": "What does the first distance-based task do within 15 cm?",
      "choices": [
        "Shuts down forever",
        "Opens the frame",
        "Plays music",
        "Prints a document"
      ],
      "correctIndex": 2,
      "hint": "The close range activates playback.",
      "explanation": "Slide 17 specifies music playback within 15 cm."
    },
    {
      "id": "audio-08",
      "topic": "simple-distance-rule",
      "learningSlide": 17,
      "prompt": "What happens beyond 15 cm in that task?",
      "choices": [
        "Volume always increases",
        "A motor rotates once",
        "The screen flashes yellow",
        "Playback pauses"
      ],
      "correctIndex": 3,
      "hint": "The task contrasts near and far.",
      "explanation": "Slide 17 says to pause playback beyond 15 cm."
    },
    {
      "id": "audio-09",
      "topic": "three-zones",
      "learningSlide": 18,
      "prompt": "What happens at a distance less than 15 cm in the extended task?",
      "choices": [
        "A beep reminder sounds",
        "Playback is permanently disabled",
        "Wheels turn 90 degrees",
        "Air pressure is displayed"
      ],
      "correctIndex": 0,
      "hint": "The closest zone uses a reminder.",
      "explanation": "Slide 18 assigns a beep to distances below 15 cm."
    },
    {
      "id": "audio-10",
      "topic": "three-zones",
      "learningSlide": 18,
      "prompt": "Which range is assigned normal music in the extended task?",
      "choices": [
        "Only beyond 25 cm",
        "Greater than 15 cm and less than 25 cm",
        "Exactly 100 cm",
        "Only below 5 cm"
      ],
      "correctIndex": 1,
      "hint": "The music range is between the reminder and off zones.",
      "explanation": "Slide 18 assigns normal music between 15 and 25 cm."
    }
  ]
};

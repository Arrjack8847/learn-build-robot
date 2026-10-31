/** Verified against the registered Level 3 source PDF, pages are 1-based. */
import type { QuizBank } from "../../quizStudio";

export const musicBoxBank: QuizBank = {
  "projectId": "level-3-music-box",
  "title": "Music Box",
  "sourcePdfPath": "public/Level 3/Learning/Sound & Voice Interaction/Music Box/29.Music Box -Slides.pdf",
  "sourcePageCount": 34,
  "questions": [
    {
      "id": "musicbox-01",
      "topic": "start",
      "learningSlide": 5,
      "prompt": "What should happen when the music box's left button is pressed?",
      "choices": [
        "The motor stops and the lamp turns off",
        "The controller disconnects the speaker",
        "The motor rotates and MP3 audio plays",
        "Only a sensor reading is displayed"
      ],
      "correctIndex": 2,
      "hint": "The left button begins a combined movement and audio activity.",
      "explanation": "Slide 5 describes starting the motor and MP3 playback with the left button."
    },
    {
      "id": "musicbox-02",
      "topic": "start",
      "learningSlide": 26,
      "prompt": "Which input does the first playback task wait for?",
      "choices": [
        "Ultrasonic sensor threshold",
        "Right motor encoder value",
        "Color sensor recognition",
        "Left controller button"
      ],
      "correctIndex": 3,
      "hint": "The left button begins a combined movement and audio activity.",
      "explanation": "Slide 26 waits for a left-button press before playing audio."
    },
    {
      "id": "musicbox-03",
      "topic": "stop",
      "learningSlide": 5,
      "prompt": "Which controller button ends motor and music playback?",
      "choices": [
        "Right button",
        "Left button",
        "Power cable",
        "Motor port M1"
      ],
      "correctIndex": 0,
      "hint": "Recall how the lesson assigns start and stop functions to the controller's buttons.",
      "explanation": "Slide 5 assigns stopping to the right button."
    },
    {
      "id": "musicbox-04",
      "topic": "stop",
      "learningSlide": 27,
      "prompt": "What should happen to the color lamp once the right-button stop action completes?",
      "choices": [
        "Flash indefinitely",
        "Turn off",
        "Turn red permanently",
        "Switch to ultraviolet light"
      ],
      "correctIndex": 1,
      "hint": "The right button ends the activity.",
      "explanation": "Slide 27 stops the lamp along with motor and playback."
    },
    {
      "id": "musicbox-05",
      "topic": "storage",
      "learningSlide": 23,
      "prompt": "How can the MP3 audio disk be accessed for file transfer?",
      "choices": [
        "Insert a USB cable into the robot's motor axle",
        "Use the ultrasonic sensor to send files",
        "Select MP3 Download and connect the controller with a data cable",
        "Copy files to the color lamp"
      ],
      "correctIndex": 2,
      "hint": "The MP3 player uses files organized into numbered folders.",
      "explanation": "Slide 23 explains using MP3 Download and a computer data cable."
    },
    {
      "id": "musicbox-06",
      "topic": "storage",
      "learningSlide": 21,
      "prompt": "What can the MP3 playback block select?",
      "choices": [
        "Only the speaker volume",
        "The number of motor rotations",
        "The detected color of a surface",
        "A numbered folder and audio file"
      ],
      "correctIndex": 3,
      "hint": "The MP3 player uses files organized into numbered folders.",
      "explanation": "Slide 21 takes the folder and audio-file numbers."
    },
    {
      "id": "musicbox-07",
      "topic": "playback",
      "learningSlide": 22,
      "prompt": "Which block ends an audio file currently being played?",
      "choices": [
        "Pause playing MP3",
        "Read color sensor",
        "Repeat forever",
        "Motor angle reset"
      ],
      "correctIndex": 0,
      "hint": "The audio block must know which file to play and when to stop.",
      "explanation": "Slide 22 describes the MP3 pause block ending audio playback."
    },
    {
      "id": "musicbox-08",
      "topic": "playback",
      "learningSlide": 24,
      "prompt": "Why does the Play MP3 routine include a wait?",
      "choices": [
        "To change the controller's battery voltage",
        "To allow the audio time to play",
        "To recalibrate an ultrasonic sensor",
        "To disable the motor permanently"
      ],
      "correctIndex": 1,
      "hint": "The audio block must know which file to play and when to stop.",
      "explanation": "Slide 24 says the wait duration depends on the audio length."
    },
    {
      "id": "musicbox-09",
      "topic": "feedback",
      "learningSlide": 5,
      "prompt": "What sound should be emitted when the controller button is pressed?",
      "choices": [
        "A continuous alarm for one hour",
        "No sound under any circumstances",
        "A single buzzer prompt",
        "A recorded microphone message only"
      ],
      "correctIndex": 2,
      "hint": "The model combines motor, sound and color-lamp outputs.",
      "explanation": "Slide 5 requires one buzzer sound on button presses."
    },
    {
      "id": "musicbox-10",
      "topic": "feedback",
      "learningSlide": 25,
      "prompt": "Where can the MP3 playback volume be adjusted?",
      "choices": [
        "The wheel assembly",
        "The ultrasonic sensor port",
        "The battery label",
        "System Settings — MP3"
      ],
      "correctIndex": 3,
      "hint": "The model combines motor, sound and color-lamp outputs.",
      "explanation": "Slide 25 locates the volume setting in System Settings – MP3."
    }
  ]
};

/** Source-checked Level 3 Learning PDF questions; slides are 1-based. */
import type { QuizBank } from "../../quizStudio";

export const electricGuitarBank: QuizBank = {
  "projectId": "level-3-electric-guitar",
  "title": "Electric Guitar",
  "sourcePdfPath": "public/Level 3/Learning/Sound & Voice Interaction/Electric guitar/10.Electric guitar_Powerpoint.pdf",
  "sourcePageCount": 21,
  "questions": [
    {
      "id": "guitar-01",
      "topic": "instrument-interaction",
      "learningSlide": 7,
      "prompt": "What measurement does the robot guitar lesson propose to identify fingering?",
      "choices": [
        "Distance",
        "Temperature",
        "Water level",
        "Air pressure"
      ],
      "correctIndex": 0,
      "hint": "The introduction links fingering with an ultrasonic measurement.",
      "explanation": "Slide 7 proposes using distance to identify guitar fingering."
    },
    {
      "id": "guitar-02",
      "topic": "instrument-interaction",
      "learningSlide": 7,
      "prompt": "What two playing factors does the introduction say affect guitar performance?",
      "choices": [
        "Plucking rhythm and string fingering",
        "Room humidity and air pressure",
        "Wheel speed and steering",
        "Screen color and font size"
      ],
      "correctIndex": 0,
      "hint": "Think about the musician's hands.",
      "explanation": "Slide 7 names plucking rhythm and string fingering."
    },
    {
      "id": "guitar-03",
      "topic": "distance-calibration",
      "learningSlide": 10,
      "prompt": "At what distance does the lesson ask students to place an obstacle for the centimeter test?",
      "choices": [
        "10 cm",
        "100 cm",
        "1 cm",
        "50 cm"
      ],
      "correctIndex": 0,
      "hint": "The slide describes a short known length.",
      "explanation": "Slide 10 instructs using an obstacle 10 cm from the sensor."
    },
    {
      "id": "guitar-04",
      "topic": "distance-calibration",
      "learningSlide": 10,
      "prompt": "What is the original number detected by the sensor and shown on the screen called?",
      "choices": [
        "System value",
        "Volume level",
        "Motor speed",
        "Battery serial"
      ],
      "correctIndex": 0,
      "hint": "It is the raw sensor reading, before conversion to length.",
      "explanation": "Slide 10 labels the original sensor reading the 'system value'."
    },
    {
      "id": "guitar-05",
      "topic": "repeat-until",
      "learningSlide": 11,
      "prompt": "What does a Repeat Until block do?",
      "choices": [
        "Repeats steps until its condition is met",
        "Runs only a single step always",
        "Measures humidity",
        "Deletes the program"
      ],
      "correctIndex": 0,
      "hint": "It is a loop with an exit condition.",
      "explanation": "Slide 11 describes Repeat Until as a loop that stops when its condition is met."
    },
    {
      "id": "guitar-06",
      "topic": "repeat-until",
      "learningSlide": 11,
      "prompt": "When does the Repeat Until loop stop repeating?",
      "choices": [
        "When its set condition becomes true",
        "When a random minute passes",
        "Every time the screen changes color",
        "Only after the controller is unplugged"
      ],
      "correctIndex": 0,
      "hint": "The word 'until' tells you the stopping point.",
      "explanation": "Slide 11 says the loop breaks when the condition is met."
    },
    {
      "id": "guitar-07",
      "topic": "collision-switch",
      "learningSlide": 17,
      "prompt": "What happens when the collision switch is pressed in Task 2?",
      "choices": [
        "The light turns on",
        "The guitar turns into a car",
        "The screen is erased",
        "All sound files are deleted"
      ],
      "correctIndex": 0,
      "hint": "The task uses presses to control a light.",
      "explanation": "Slide 17 says pressing the switch turns the light on."
    },
    {
      "id": "guitar-08",
      "topic": "collision-switch",
      "learningSlide": 17,
      "prompt": "What does pressing the collision switch again do?",
      "choices": [
        "Turns the light off",
        "Increases the light forever",
        "Rotates a wheel",
        "Opens a door"
      ],
      "correctIndex": 0,
      "hint": "The task toggles the light repeatedly.",
      "explanation": "Slide 17 says the next press switches the light off."
    },
    {
      "id": "guitar-09",
      "topic": "music-and-lights",
      "learningSlide": 18,
      "prompt": "What combination does the final guitar task ask students to produce?",
      "choices": [
        "Different lights and sounds",
        "Only temperature readings",
        "Only a moving vehicle",
        "A distance chart without music"
      ],
      "correctIndex": 0,
      "hint": "The task combines two outputs.",
      "explanation": "Slide 18 instructs using different lights and making sounds."
    },
    {
      "id": "guitar-10",
      "topic": "music-and-lights",
      "learningSlide": 15,
      "prompt": "Which musical ranges are named in the program flowchart?",
      "choices": [
        "High, midrange, and bass",
        "Rain, wind, and thunder",
        "Hot, warm, and cold",
        "Near, far, and absent"
      ],
      "correctIndex": 0,
      "hint": "The chart uses musical pitch ranges.",
      "explanation": "Slide 15 includes high-pitched, midrange, and bass files."
    }
  ]
};

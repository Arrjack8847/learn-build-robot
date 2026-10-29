/** Ten Level 5 questions sourced from the official 31-page Learning PDF. */
import type { QuizBank } from "../../quizStudio";

export const curlingGameBank: QuizBank = {
  "projectId": "level-5-curling-game",
  "title": "Curling Game",
  "sourcePdfPath": "public/Level 5/Learning/Action-Oriented/Curling Game/2. Curling Game - Slides.pdf",
  "sourcePageCount": 31,
  "questions": [
    {
      "id": "level-5-curling-game-01",
      "topic": "curling-play",
      "learningSlide": 4,
      "prompt": "On which surface is curling played in the lesson?",
      "choices": [
        "Ice",
        "Grass",
        "Sand",
        "A swimming pool"
      ],
      "correctIndex": 0,
      "hint": "Recall the phrase 'chess on the ...'.",
      "explanation": "Slide 4 presents curling as a team throwing competition played on ice."
    },
    {
      "id": "level-5-curling-game-02",
      "topic": "curling-play",
      "learningSlide": 4,
      "prompt": "What does the curling lesson say the sport tests alongside physical ability?",
      "choices": [
        "The number of motors in a robot",
        "Mental strength and strategic choices",
        "Only the height of the players",
        "The brightness of arena lights"
      ],
      "correctIndex": 1,
      "hint": "Look for the sport's planning element.",
      "explanation": "Slide 4 describes curling as testing physical and mental strength and the wisdom of choice."
    },
    {
      "id": "level-5-curling-game-03",
      "topic": "light-sensing",
      "learningSlide": 6,
      "prompt": "Why can a photoelectric sensor distinguish dark and light surfaces?",
      "choices": [
        "The sensor measures magnetic polarity only",
        "The sensor hears different sounds",
        "They reflect or absorb different amounts of emitted light",
        "They all reflect identical light"
      ],
      "correctIndex": 2,
      "hint": "Compare how much light a black and a white surface return.",
      "explanation": "Slide 6 explains that the sensor emits light and detects differences in reflected light."
    },
    {
      "id": "level-5-curling-game-04",
      "topic": "light-sensing",
      "learningSlide": 7,
      "prompt": "What numeric range is given for the lesson's color-depth reading?",
      "choices": [
        "0 to 10",
        "100 to 200 only",
        "-100 to -1",
        "0 to 4095"
      ],
      "correctIndex": 3,
      "hint": "Find the stated valid sensor range.",
      "explanation": "Slide 7 states the photoelectric sensor reading range as 0–4095."
    },
    {
      "id": "level-5-curling-game-05",
      "topic": "throwing-program",
      "learningSlide": 10,
      "prompt": "Which direction should the curling robot's photoelectric sensor face?",
      "choices": [
        "Down toward the floor",
        "Up toward the ceiling",
        "Straight at the student's face",
        "Away from all surfaces"
      ],
      "correctIndex": 0,
      "hint": "It needs to detect the floor's throwing line.",
      "explanation": "Slide 10 specifically labels the photoelectric sensor as installed head downward."
    },
    {
      "id": "level-5-curling-game-06",
      "topic": "throwing-program",
      "learningSlide": 11,
      "prompt": "What must the robot recognize to decide when to launch the curling stone?",
      "choices": [
        "That a button was disconnected",
        "That it has reached the throwing line",
        "That a spectator clapped",
        "That a fan started spinning"
      ],
      "correctIndex": 1,
      "hint": "Use the line-detection question in the flowchart.",
      "explanation": "Slide 11 asks how to use the photoelectric sensor to detect the throwing line."
    },
    {
      "id": "level-5-curling-game-07",
      "topic": "parameters",
      "learningSlide": 16,
      "prompt": "What can variables control during the curling robot's motion?",
      "choices": [
        "The number of people watching",
        "The arena's outdoor temperature",
        "The driving speed and strength of the push",
        "The color of the ice itself"
      ],
      "correctIndex": 2,
      "hint": "Think about adjustable values in the robot's program.",
      "explanation": "Slide 16 says variables can adjust moving speed and the force of the curl-stone push."
    },
    {
      "id": "level-5-curling-game-08",
      "topic": "parameters",
      "learningSlide": 12,
      "prompt": "Which values does the practice ask students to set before testing?",
      "choices": [
        "Only the robot's name",
        "Only the screen font",
        "The stadium's seating count",
        "Travel speed, pushing speed and line-detection threshold"
      ],
      "correctIndex": 3,
      "hint": "Find the program's adjustable movement and judgment values.",
      "explanation": "Slide 12 asks students to set movement and push speeds and the threshold for reaching the line."
    },
    {
      "id": "level-5-curling-game-09",
      "topic": "touch-input",
      "learningSlide": 18,
      "prompt": "What does the touchscreen touch-detection block return?",
      "choices": [
        "Yes or no",
        "Only a GPS coordinate",
        "An image of the curling stone",
        "Only motor speed"
      ],
      "correctIndex": 0,
      "hint": "The block checks whether a touch occurred.",
      "explanation": "Slide 18 explains that the touchscreen touched condition returns yes or no."
    },
    {
      "id": "level-5-curling-game-10",
      "topic": "touch-input",
      "learningSlide": 20,
      "prompt": "What range does the lesson give for touchscreen horizontal X coordinates?",
      "choices": [
        "0 to 320 only for X",
        "0 to 240",
        "0 to 4095",
        "0 to 10"
      ],
      "correctIndex": 1,
      "hint": "Compare the horizontal and vertical coordinate limits.",
      "explanation": "Slide 20 lists horizontal X as 0–240 and vertical Y as 0–320."
    }
  ]
};

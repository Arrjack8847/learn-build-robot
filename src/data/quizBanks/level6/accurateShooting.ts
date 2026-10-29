import type { QuizBank } from "../../quizStudio";
/** Questions sourced from the original 26-slide Level 6 Learning PDF. */
export const accurateShootingBank: QuizBank = {
  "projectId": "level-6-accurate-shooting",
  "title": "Accurate Shooting",
  "sourcePdfPath": "public/Level 6/Learning/Complex Mechanisms & Coordinated Motion/Accurate Shooting/13. Accurate Shooting-Teaching Slides.pdf",
  "sourcePageCount": 26,
  "questions": [
    {
      "id": "as-01",
      "topic": "shooting-model",
      "learningSlide": 12,
      "prompt": "What does the shooting model use to detect a successful hit?",
      "choices": [
        "Infrared signals",
        "A thermometer",
        "A compass",
        "A rain gauge"
      ],
      "correctIndex": 0,
      "hint": "Look at the signal between the gun and the target.",
      "explanation": "Slide 12 uses infrared to detect whether the target is hit."
    },
    {
      "id": "as-02",
      "topic": "shooting-model",
      "learningSlide": 12,
      "prompt": "Which three parts are labelled in the shooting model?",
      "choices": [
        "Gun, swinging target and scoreboard",
        "Fan, thermometer and wheels",
        "Camera, propeller and gearbox",
        "Speaker, clock and compass"
      ],
      "correctIndex": 0,
      "hint": "One part shoots, one moves and one records the result.",
      "explanation": "Slide 12 labels the gun, swinging target and scoreboard."
    },
    {
      "id": "as-03",
      "topic": "program-flow",
      "learningSlide": 13,
      "prompt": "Why does the main program run two separate functions?",
      "choices": [
        "To control target swinging and gun shooting independently",
        "To switch between two different PDFs",
        "To use two screens for the same score",
        "To stop all motion whenever a shot fires"
      ],
      "correctIndex": 0,
      "hint": "The target should continue moving while the gun operates.",
      "explanation": "Slide 13 describes independent target-swing and gun-shooting functions."
    },
    {
      "id": "as-04",
      "topic": "program-flow",
      "learningSlide": 13,
      "prompt": "What should happen to the moving target while the player shoots?",
      "choices": [
        "Its back-and-forth movement should continue",
        "It must always freeze before every shot",
        "It must disappear from the model",
        "It should count the gun's button presses as hits"
      ],
      "correctIndex": 0,
      "hint": "The program keeps the two functions separate.",
      "explanation": "Slide 13 says shooting must not affect the target swing."
    },
    {
      "id": "as-05",
      "topic": "infrared-scoring",
      "learningSlide": 14,
      "prompt": "What starts transmission of infrared data from the gun?",
      "choices": [
        "Pressing the touch sensor",
        "Reading the room temperature",
        "Waiting for the score to reach ten",
        "Turning off the controller"
      ],
      "correctIndex": 0,
      "hint": "Look at the launch portion of the gun flowchart.",
      "explanation": "Slide 14 describes the touch sensor launching infrared data."
    },
    {
      "id": "as-06",
      "topic": "infrared-scoring",
      "learningSlide": 17,
      "prompt": "What happens when the smart eye detects a hit?",
      "choices": [
        "The score increases and refreshes",
        "The model deletes the shooting function",
        "The target permanently stops",
        "The controller erases the program"
      ],
      "correctIndex": 0,
      "hint": "The program's second condition checks the hit result.",
      "explanation": "Slide 17 says a successful hit adds points and refreshes the score."
    },
    {
      "id": "as-07",
      "topic": "swinging-target",
      "learningSlide": 15,
      "prompt": "In the target-swing program, what does direction 0 mean?",
      "choices": [
        "Counterclockwise reverse rotation",
        "Clockwise forward rotation",
        "No motor connected",
        "Maximum speed in both directions"
      ],
      "correctIndex": 0,
      "hint": "Compare the two direction flags used for reversing.",
      "explanation": "Slide 15 defines direction 0 as counterclockwise reverse rotation."
    },
    {
      "id": "as-08",
      "topic": "swinging-target",
      "learningSlide": 19,
      "prompt": "Why is the motor slowed after the target crosses the center line?",
      "choices": [
        "To avoid the rod striking blocks too hard",
        "To turn the infrared receiver off",
        "To make bullets travel faster",
        "To stop recording points"
      ],
      "correctIndex": 0,
      "hint": "Think about preventing a collision at the end of a swing.",
      "explanation": "Slide 19 limits the target motor speed to protect the structure."
    },
    {
      "id": "as-09",
      "topic": "optimization",
      "learningSlide": 24,
      "prompt": "What new behaviour is required in the lesson's optimization task?",
      "choices": [
        "Make a sound after a hit",
        "Stop the game before the target moves",
        "Replace infrared sensing with a rain sensor",
        "Count shots without checking targets"
      ],
      "correctIndex": 0,
      "hint": "Look at the extra feedback requested after a successful hit.",
      "explanation": "Slide 24 asks the target to make a sound when hit."
    },
    {
      "id": "as-10",
      "topic": "optimization",
      "learningSlide": 24,
      "prompt": "What must still work while the new hit sound is played?",
      "choices": [
        "The target's swinging motion",
        "Only a timer display",
        "A road-following camera",
        "A password list comparison"
      ],
      "correctIndex": 0,
      "hint": "The new feature must not interrupt the original motion.",
      "explanation": "Slide 24 explicitly requires target swinging to remain unaffected."
    }
  ]
};

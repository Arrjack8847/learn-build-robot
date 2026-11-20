/** Imported from source-grounded Level 1 approved draft branch. Keep source slide references. */
import type { QuizBank } from "../../quizStudio";
export const sledDogBank: QuizBank = {
  "projectId": "sled-dog",
  "title": "Sled Dog",
  "sourcePdfPath": "public/Level 1/Learning/Biomimicry/Sled dog.pdf",
  "sourcePageCount": 17,
  "questions": [
    {
      "id": "sled-dog-01",
      "topic": "dog",
      "learningSlide": 3,
      "prompt": "What are sled dogs traditionally used for in the lesson's introduction?",
      "choices": [
        "Flying kites",
        "Swimming under boats",
        "Measuring air pressure",
        "Pulling sleds"
      ],
      "correctIndex": 3,
      "explanation": "The lesson describes dogs pulling sleds in cold regions.",
      "hint": "Think about how people travel with dogs in snowy places."
    },
    {
      "id": "sled-dog-02",
      "topic": "dog",
      "learningSlide": 2,
      "prompt": "Which dog breed is mentioned in the Sled Dog lesson?",
      "choices": [
        "Dalmatian only",
        "Husky",
        "Poodle only",
        "Bulldog only"
      ],
      "correctIndex": 1,
      "explanation": "The introduction names huskies, samoyeds and Alaskan dogs.",
      "hint": "Recall the cold-weather breeds in the first slides."
    },
    {
      "id": "sled-dog-03",
      "topic": "mechanism",
      "learningSlide": 5,
      "prompt": "Which linkage simulates the dog's leg movement?",
      "choices": [
        "Crank–rocker",
        "Worm-only gear",
        "Rack steering",
        "Hydraulic lift"
      ],
      "correctIndex": 0,
      "explanation": "Slide 5 uses a crank–rocker mechanism.",
      "hint": "Think about changing rotation into back-and-forth movement."
    },
    {
      "id": "sled-dog-04",
      "topic": "mechanism",
      "learningSlide": 5,
      "prompt": "What type of movement can the crank–rocker mechanism produce from rotation?",
      "choices": [
        "Only constant straight movement",
        "A change in light color",
        "Swaying motion",
        "Pressure sensing"
      ],
      "correctIndex": 2,
      "explanation": "The slide describes conversion of rotating power to swinging motion.",
      "hint": "Think about the repeated leg motion during walking."
    },
    {
      "id": "sled-dog-05",
      "topic": "program",
      "learningSlide": 12,
      "prompt": "What should the motor-drive instructions make the Sled Dog do?",
      "choices": [
        "Only show an LED pattern",
        "Measure a wall",
        "Move and pull the sled",
        "Play a song without movement"
      ],
      "correctIndex": 2,
      "explanation": "The coding slide instructs the dog to move and pull a cart.",
      "hint": "Think about combining the leg action with sled travel."
    },
    {
      "id": "sled-dog-06",
      "topic": "program",
      "learningSlide": 12,
      "prompt": "What kind of programming is used to power the sled dog's motion?",
      "choices": [
        "Motor drive instructions",
        "Only camera recognition",
        "Only pressure comparison",
        "Only blinking lights"
      ],
      "correctIndex": 0,
      "explanation": "The slide describes motor commands as the control mechanism.",
      "hint": "Think about what turns the crank linkage."
    },
    {
      "id": "sled-dog-07",
      "topic": "distance",
      "learningSlide": 14,
      "prompt": "Which controls does the lesson suggest using to stop at a line?",
      "choices": [
        "Only sound intensity",
        "Time or angle",
        "Only pressure in Pa",
        "Only RGB color"
      ],
      "correctIndex": 1,
      "explanation": "The challenge uses time or angle control to estimate travel distance.",
      "hint": "Think about limiting the movement duration or rotation."
    },
    {
      "id": "sled-dog-08",
      "topic": "distance",
      "learningSlide": 14,
      "prompt": "What is the challenge goal when the sled approaches the end line?",
      "choices": [
        "Turn off the controller at the start",
        "Accelerate far beyond the line",
        "Always stop at a random position",
        "Stop accurately at the line"
      ],
      "correctIndex": 3,
      "explanation": "The activity aims to stop precisely at the target line.",
      "hint": "Think about controlling motion to reach a marked destination."
    },
    {
      "id": "sled-dog-09",
      "topic": "extend",
      "learningSlide": 17,
      "prompt": "What does the final presentation suggest adding to the dog?",
      "choices": [
        "A barometric sensor only",
        "A GPS map",
        "A light-refraction diagram",
        "Appropriate sound"
      ],
      "correctIndex": 3,
      "explanation": "The final task asks for a suitable sound effect.",
      "hint": "Think about how a robot dog could imitate a real dog."
    },
    {
      "id": "sled-dog-10",
      "topic": "extend",
      "learningSlide": 16,
      "prompt": "What should students identify when explaining the robot's moving legs?",
      "choices": [
        "How a camera recognizes a ball",
        "How a lamp changes color",
        "How a crank–rocker changes rotation to swing",
        "How a pressure sensor finds altitude"
      ],
      "correctIndex": 2,
      "explanation": "The evaluation specifically asks how rotation becomes swinging motion.",
      "hint": "Think about the key mechanism built into the legs."
    }
  ]
};

/** Source-checked against the Level 3 Learning PDF. All slide references are 1-based. */
import type { QuizBank } from "../../quizStudio";

export const bumperCarInteractiveMechanismsBank: QuizBank = {
  "projectId": "level-3-bumper-car-interactive-mechanisms",
  "title": "Bumper Car (Interactive Mechanisms)",
  "sourcePdfPath": "public/Level 3/Learning/Interactive Mechanisms/Bumper car/Bumper car_Powerpoint-update.pdf",
  "sourcePageCount": 18,
  "questions": [
    {
      "id": "bumpim-01",
      "topic": "bumper-design",
      "learningSlide": 7,
      "prompt": "Which part of the Bumper Car robot does the lesson especially focus on?",
      "choices": [
        "Collision sensing",
        "Measuring air pressure",
        "Reading GPS positions",
        "Water detection"
      ],
      "correctIndex": 0,
      "hint": "The model needs to notice when it bumps into something.",
      "explanation": "Slide 7 highlights the collision-sensing design of the bumper car."
    },
    {
      "id": "bumpim-02",
      "topic": "bumper-design",
      "learningSlide": 9,
      "prompt": "Which description matches the robot model's intended shape?",
      "choices": [
        "Small and sturdy",
        "Very tall and fragile",
        "A long open bridge",
        "A soft hanging curtain"
      ],
      "correctIndex": 0,
      "hint": "The slide describes a compact model that can handle bumps.",
      "explanation": "Slide 9 describes the Bumper Car model as small and sturdy."
    },
    {
      "id": "bumpim-03",
      "topic": "robot-parts",
      "learningSlide": 10,
      "prompt": "Which pair of electronic components is named for this robot?",
      "choices": [
        "RCU and motor",
        "GPS and barometer",
        "Camera and projector",
        "Thermometer and heater"
      ],
      "correctIndex": 0,
      "hint": "Look for the controller and the part that moves the car.",
      "explanation": "Slide 10 lists the RCU and motor as electronic components."
    },
    {
      "id": "bumpim-04",
      "topic": "robot-parts",
      "learningSlide": 10,
      "prompt": "According to the lesson, which component can also help form the car's body because it is relatively large?",
      "choices": [
        "RCU",
        "Touch button alone",
        "A sound file",
        "Light sensor lens"
      ],
      "correctIndex": 0,
      "hint": "The controller also takes up space in the model's structure.",
      "explanation": "Slide 10 says the RCU can serve as part of the car body because of its larger size."
    },
    {
      "id": "bumpim-05",
      "topic": "collision-flow",
      "learningSlide": 14,
      "prompt": "In the programming flow, what input does the robot check?",
      "choices": [
        "Whether the touch sensor has a signal",
        "Current outdoor temperature",
        "The name of a song",
        "The color of its display"
      ],
      "correctIndex": 0,
      "hint": "A collision makes contact with the sensor.",
      "explanation": "Slide 14 includes a decision based on the touch sensor's signal."
    },
    {
      "id": "bumpim-06",
      "topic": "collision-flow",
      "learningSlide": 14,
      "prompt": "Which two kinds of movement are shown besides driving ahead in the collision-response flow?",
      "choices": [
        "Going back and turning left",
        "Flying up and landing",
        "Spinning a fan and opening a door",
        "Jumping and swimming"
      ],
      "correctIndex": 0,
      "hint": "The car changes its path after sensing contact.",
      "explanation": "Slide 14 includes 'Back' and 'Turn left' as movement actions."
    },
    {
      "id": "bumpim-07",
      "topic": "bumper-control",
      "learningSlide": 2,
      "prompt": "Which sensing skill is specifically named in this project's ability goal?",
      "choices": [
        "Using touch sensors",
        "Reading wind direction",
        "Tracking satellites",
        "Measuring water level"
      ],
      "correctIndex": 0,
      "hint": "The learning target mentions a sensor that detects contact.",
      "explanation": "Slide 2 calls for mastering touch sensors."
    },
    {
      "id": "bumpim-08",
      "topic": "bumper-control",
      "learningSlide": 3,
      "prompt": "What programming concept is paired with touch sensing in the learning focus?",
      "choices": [
        "Conditional judgments",
        "Video editing",
        "Text formatting",
        "Wireless networking"
      ],
      "correctIndex": 0,
      "hint": "The robot needs a decision when contact is detected.",
      "explanation": "Slide 3 identifies conditional judgments as a learning difficulty."
    },
    {
      "id": "bumpim-09",
      "topic": "build-and-test",
      "learningSlide": 12,
      "prompt": "Which assembly requirement is stated in the lesson?",
      "choices": [
        "A stable structure",
        "Loose connectors",
        "An off-center frame on purpose",
        "An unsupported sensor"
      ],
      "correctIndex": 0,
      "hint": "Think about how the car holds together when it moves.",
      "explanation": "Slide 12 includes a stable structure as an assembly requirement."
    },
    {
      "id": "bumpim-10",
      "topic": "build-and-test",
      "learningSlide": 15,
      "prompt": "What is the programming-and-debugging task for the finished car?",
      "choices": [
        "Test and adjust its program based on bumper-car behavior",
        "Delete all sensor instructions",
        "Replace the car with a water pump",
        "Leave the robot unprogrammed"
      ],
      "correctIndex": 0,
      "hint": "The task asks you to match the program to how bumper cars behave.",
      "explanation": "Slide 15 instructs completing program debugging according to the bumper car's characteristics."
    }
  ]
};

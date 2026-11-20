import type { QuizBank } from "../../quizStudio";
/** Level 4 source-backed Transformer Robot quiz. */
export const transformerRobotBank: QuizBank = {
  "projectId": "level-4-transformer-robot",
  "title": "Transformer Robot",
  "sourcePdfPath": "public/Level 4/Vehicles & Complex Movers/Transformer Robot/06.Transformer Robot-Slides.pdf",
  "sourcePageCount": 32,
  "questions": [
    {
      "id": "l4-transformer-robot-01",
      "topic": "transforming-model",
      "learningSlide": 3,
      "prompt": "What is the defining ability of a transformer robot?",
      "choices": [
        "Changing its physical shape",
        "Drawing a photograph",
        "Playing only music",
        "Measuring rainfall"
      ],
      "correctIndex": 0,
      "explanation": "The lesson defines transformer robots by their changing configuration.",
      "hint": "Think about a machine changing body shape."
    },
    {
      "id": "l4-transformer-robot-02",
      "topic": "transforming-model",
      "learningSlide": 4,
      "prompt": "How is transformation achieved in the model?",
      "choices": [
        "By scanning a barcode only",
        "Through mechanisms and transmission devices",
        "By displaying a new picture only",
        "By changing a password"
      ],
      "correctIndex": 1,
      "explanation": "The introduction describes mechanical structures and transmission.",
      "hint": "Think about a machine changing body shape."
    },
    {
      "id": "l4-transformer-robot-03",
      "topic": "touch-activation",
      "learningSlide": 6,
      "prompt": "What is the robot's starting body position?",
      "choices": [
        "Hanging upside down",
        "Floating in water",
        "Prone or lying down",
        "Standing upright"
      ],
      "correctIndex": 2,
      "explanation": "The task begins in a prone position.",
      "hint": "Recall the trigger used for the transformation."
    },
    {
      "id": "l4-transformer-robot-04",
      "topic": "touch-activation",
      "learningSlide": 24,
      "prompt": "Which input makes the moving prone robot stand up?",
      "choices": [
        "Temperature threshold",
        "Photoelectric coin input",
        "Microphone melody",
        "Touch-sensor press"
      ],
      "correctIndex": 3,
      "explanation": "Slide 24 changes the pose when a touch sensor is pressed.",
      "hint": "Recall the trigger used for the transformation."
    },
    {
      "id": "l4-transformer-robot-05",
      "topic": "position-variable",
      "learningSlide": 24,
      "prompt": "What does standing = 0 signify?",
      "choices": [
        "The robot is prone",
        "The robot is standing",
        "The robot has no controller",
        "The robot is disconnected"
      ],
      "correctIndex": 0,
      "explanation": "The program's standing variable uses 0 for the prone state.",
      "hint": "Consider how a program remembers whether a robot is upright."
    },
    {
      "id": "l4-transformer-robot-06",
      "topic": "position-variable",
      "learningSlide": 25,
      "prompt": "What does standing = 1 signify?",
      "choices": [
        "The sensor returned 999",
        "The robot is standing",
        "The robot is prone",
        "The program has stopped forever"
      ],
      "correctIndex": 1,
      "explanation": "The variable records the upright state with a value of 1.",
      "hint": "Consider how a program remembers whether a robot is upright."
    },
    {
      "id": "l4-transformer-robot-07",
      "topic": "standing-navigation",
      "learningSlide": 25,
      "prompt": "Which sensor helps the upright robot avoid obstacles?",
      "choices": [
        "Touchscreen Y sensor",
        "Microphone",
        "Ultrasonic sensor",
        "Barometric sensor"
      ],
      "correctIndex": 2,
      "explanation": "The standing mode uses ultrasonic sensing.",
      "hint": "Follow the sensor behavior once the robot stands."
    },
    {
      "id": "l4-transformer-robot-08",
      "topic": "standing-navigation",
      "learningSlide": 25,
      "prompt": "What is reset at the start of the standing navigation period?",
      "choices": [
        "The project title",
        "All files",
        "The display size",
        "Controller time"
      ],
      "correctIndex": 3,
      "explanation": "The controller timer is reset for the standing-mode duration.",
      "hint": "Follow the sensor behavior once the robot stands."
    },
    {
      "id": "l4-transformer-robot-09",
      "topic": "time-and-reset",
      "learningSlide": 26,
      "prompt": "What occurs when the programmed time is up?",
      "choices": [
        "The robot returns to its prone position",
        "The robot always runs faster",
        "The motor changes to a speaker",
        "The controller erases the source"
      ],
      "correctIndex": 0,
      "explanation": "The program stops and transforms back to lying down.",
      "hint": "Think about returning to the starting configuration."
    },
    {
      "id": "l4-transformer-robot-10",
      "topic": "time-and-reset",
      "learningSlide": 26,
      "prompt": "What value is saved in the standing variable after returning prone?",
      "choices": [
        "999",
        "0",
        "1",
        "100"
      ],
      "correctIndex": 1,
      "explanation": "After returning to the prone position the program sets standing to 0.",
      "hint": "Think about returning to the starting configuration."
    }
  ]
};

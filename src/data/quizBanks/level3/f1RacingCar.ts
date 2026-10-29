/** Source-checked against the Level 3 Learning PDF. All slide references are 1-based. */
import type { QuizBank } from "../../quizStudio";

export const f1RacingCarBank: QuizBank = {
  "projectId": "level-3-f1-racing-car",
  "title": "F1 Racing Car",
  "sourcePdfPath": "public/Level 3/Learning/Vehicles & Complex Movers/F1 racing car/F1 racing car_Powerpoint.pdf",
  "sourcePageCount": 20,
  "questions": [
    {
      "id": "f1-01",
      "topic": "car-design",
      "learningSlide": 7,
      "prompt": "Where is the model's motor mounted as its main power source?",
      "choices": [
        "Behind the car body",
        "Above the steering wheel",
        "Under the controller screen",
        "On the front bumper as a sensor"
      ],
      "correctIndex": 0,
      "hint": "The lesson places the main power source near the rear.",
      "explanation": "Slide 7 says the motor is mounted behind the car body."
    },
    {
      "id": "f1-02",
      "topic": "car-design",
      "learningSlide": 7,
      "prompt": "Why is the RCU positioned in the middle of the car body?",
      "choices": [
        "To help balance the model's center of gravity",
        "To hide it from the software",
        "To make the car taller",
        "To replace the steering wheels"
      ],
      "correctIndex": 0,
      "hint": "Think about keeping a moving model balanced.",
      "explanation": "Slide 7 links the centrally positioned RCU with balance and center of gravity."
    },
    {
      "id": "f1-03",
      "topic": "motor-control",
      "learningSlide": 2,
      "prompt": "Which programming ability is a learning goal of this project?",
      "choices": [
        "Controlling motors and simple routes",
        "Recognizing human faces",
        "Predicting rainfall",
        "Editing photographs"
      ],
      "correctIndex": 0,
      "hint": "The lesson wants learners to control movement.",
      "explanation": "Slide 2 says students learn motor control and simple route programming."
    },
    {
      "id": "f1-04",
      "topic": "motor-control",
      "learningSlide": 3,
      "prompt": "What relationship does the lesson say learners should understand?",
      "choices": [
        "Forward, backward, left, and right movement versus positive and negative motor control",
        "Temperature versus rainfall",
        "Sound versus screen brightness",
        "Calendar dates versus speed"
      ],
      "correctIndex": 0,
      "hint": "The motor's direction affects how the car moves.",
      "explanation": "Slide 3 identifies positive/negative motor control and forward, rear, left and right movement."
    },
    {
      "id": "f1-05",
      "topic": "test-distance",
      "learningSlide": 15,
      "prompt": "What distance is held constant for the speed-100 timing experiment?",
      "choices": [
        "1 meter",
        "10 meters",
        "100 meters",
        "1 centimeter"
      ],
      "correctIndex": 0,
      "hint": "Both timing tasks use the same short route.",
      "explanation": "Slide 15 specifies a 1 m test distance."
    },
    {
      "id": "f1-06",
      "topic": "test-distance",
      "learningSlide": 16,
      "prompt": "What is changed in the second timing experiment while the test distance stays 1 meter?",
      "choices": [
        "The programmed speed is set to 50",
        "The course is made 100 m long",
        "The RCU is removed",
        "The car's color is changed"
      ],
      "correctIndex": 0,
      "hint": "Compare the programmed speed values in Tasks 1 and 2.",
      "explanation": "Slide 16 asks for timing at speed 50 over the same 1 m test distance."
    },
    {
      "id": "f1-07",
      "topic": "turning",
      "learningSlide": 17,
      "prompt": "Which wheels does the lesson say control the model car's direction?",
      "choices": [
        "Front wheels",
        "Rear wheels only",
        "All wheels removed",
        "No wheels are involved"
      ],
      "correctIndex": 0,
      "hint": "One wheel group steers while the other moves the car forward.",
      "explanation": "Slide 17 says front wheel rotation controls direction."
    },
    {
      "id": "f1-08",
      "topic": "turning",
      "learningSlide": 17,
      "prompt": "Which wheel group is responsible for advancing the car in the lesson's model?",
      "choices": [
        "Rear wheels",
        "Front wheels only",
        "A floating propeller",
        "A stationary sensor"
      ],
      "correctIndex": 0,
      "hint": "The motor's placement helps determine where power drives the car.",
      "explanation": "Slide 17 says the rear wheel is responsible for advancement."
    },
    {
      "id": "f1-09",
      "topic": "programming-flow",
      "learningSlide": 14,
      "prompt": "Which action appears in the programming flow after the car's movement?",
      "choices": [
        "Timing and stopping",
        "Taking a photograph",
        "Making a phone call",
        "Saving a weather report"
      ],
      "correctIndex": 0,
      "hint": "The flow includes a test of how long the car moves.",
      "explanation": "Slide 14 includes car movement, time, stop, and adjustment in its programming flow."
    },
    {
      "id": "f1-10",
      "topic": "programming-flow",
      "learningSlide": 14,
      "prompt": "What should follow the motion test before another repeat of the program?",
      "choices": [
        "Analyze and adjust the result",
        "Remove the controller",
        "Delete the motor program",
        "Stop recording the result"
      ],
      "correctIndex": 0,
      "hint": "The flow describes a repeated testing process.",
      "explanation": "Slide 14 includes analysis and adjustment before repeating."
    }
  ]
};

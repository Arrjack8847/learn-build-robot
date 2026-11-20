/** Source-reviewed against the official 19-page Level 5 Learning PDF. */
import type { QuizBank } from "../../quizStudio";

export const trackingCarBank: QuizBank = {
  "projectId": "level-5-tracking-car",
  "title": "Tracking Car",
  "sourcePdfPath": "public/Level 5/Learning/Advanced Navigation & Control/Tracking car/11.Tracking car-update.pdf",
  "sourcePageCount": 19,
  "questions": [
    {
      "id": "level-5-tracking-car-01",
      "topic": "light-tracking",
      "learningSlide": 7,
      "prompt": "Which sensor arrangement does the lesson use to find a light source?",
      "choices": [
        "Two photosensitive sensors",
        "Two barometric sensors",
        "A QR-code scanner and buzzer",
        "Only a motor without any sensor"
      ],
      "correctIndex": 0,
      "hint": "The car compares light detected in two places.",
      "explanation": "Slide 7 identifies a double photosensitive-sensor setup for judging strong light and steering the car toward it."
    },
    {
      "id": "level-5-tracking-car-02",
      "topic": "light-tracking",
      "learningSlide": 7,
      "prompt": "How can a person guide the tracking car without touching it?",
      "choices": [
        "Pour water in front of its wheels",
        "Move a light source for the car to follow",
        "Move a magnetic cabinet past it",
        "Speak a QR-code number"
      ],
      "correctIndex": 1,
      "hint": "The lesson treats the light as a communication method.",
      "explanation": "Slide 7 says the light source can be moved to guide the car, allowing a human and robot to interact using light."
    },
    {
      "id": "level-5-tracking-car-03",
      "topic": "human-machine-interaction",
      "learningSlide": 10,
      "prompt": "What is human–machine interaction mainly concerned with?",
      "choices": [
        "Only how robot parts are painted",
        "How to measure Moon distance by laser",
        "How users communicate with and operate systems",
        "How to change Earth's magnetic field"
      ],
      "correctIndex": 2,
      "hint": "Think about the person using the machine.",
      "explanation": "Slide 10 defines HCI/HMI as the relationship between users and machines or computerized systems."
    },
    {
      "id": "level-5-tracking-car-04",
      "topic": "human-machine-interaction",
      "learningSlide": 10,
      "prompt": "Which of these is an HMI interface example named in the lesson?",
      "choices": [
        "An unplugged steel rod",
        "A blank wooden cube",
        "A wheel without controls",
        "A radio playback button"
      ],
      "correctIndex": 3,
      "hint": "A user operates the device through a visible control.",
      "explanation": "Slide 10 gives a radio playback button as a small example of an HMI control."
    },
    {
      "id": "level-5-tracking-car-05",
      "topic": "interaction-components",
      "learningSlide": 11,
      "prompt": "Which components work together to provide human–machine interaction according to the lesson?",
      "choices": [
        "Input/output external equipment and corresponding software",
        "Only the robot's decorative wheels",
        "Only a paint color and a case",
        "A battery without any program"
      ],
      "correctIndex": 0,
      "hint": "Interaction needs a way to input, output and process commands.",
      "explanation": "Slide 11 describes HCI functions using input/output external equipment and associated software."
    },
    {
      "id": "level-5-tracking-car-06",
      "topic": "interaction-components",
      "learningSlide": 9,
      "prompt": "Why do programmable devices show welcome messages and specific instructions?",
      "choices": [
        "They have no connection to human–machine interaction",
        "Programmers define guidance behavior using electronic parts and software",
        "The devices automatically understand every person without any program",
        "Messages are caused only by motor heat"
      ],
      "correctIndex": 1,
      "hint": "The greetings and guidance are designed.",
      "explanation": "Slide 9 explains that programmers create the etiquette and guidance behavior through programmed electronic components."
    },
    {
      "id": "level-5-tracking-car-07",
      "topic": "interaction-design",
      "learningSlide": 2,
      "prompt": "What is one stated goal of the tracking-car lesson?",
      "choices": [
        "Measure atmospheric pressure changes",
        "Learn to weave magnetic wire",
        "Understand the human–machine interaction process",
        "Memorize the names of all planets"
      ],
      "correctIndex": 2,
      "hint": "The stated goal involves communication between user and robot.",
      "explanation": "Slide 2 lists understanding and organizing the human–computer interaction process as a learning target."
    },
    {
      "id": "level-5-tracking-car-08",
      "topic": "interaction-design",
      "learningSlide": 3,
      "prompt": "Which programming task does the lesson highlight as a difficulty?",
      "choices": [
        "Building a hydraulic lock",
        "Programming an ultrasonic speedometer",
        "Measuring temperature with two cameras",
        "Creating interactive logic for light tracking"
      ],
      "correctIndex": 3,
      "hint": "The required interaction uses changing light.",
      "explanation": "Slide 3 calls interactive programming for light-tracking characteristics a learning difficulty."
    },
    {
      "id": "level-5-tracking-car-09",
      "topic": "build-and-debug",
      "learningSlide": 13,
      "prompt": "Which requirement appears in the tracking car's assembly checklist?",
      "choices": [
        "Build a stable structure",
        "Always remove all support components",
        "Choose a shape unrelated to the model",
        "Place its balance point far outside its base"
      ],
      "correctIndex": 0,
      "hint": "Reliable movement starts with a sturdy model.",
      "explanation": "Slide 13 requires a stable structure."
    },
    {
      "id": "level-5-tracking-car-10",
      "topic": "build-and-debug",
      "learningSlide": 16,
      "prompt": "What does the programming-and-debugging activity ask students to use as a guide?",
      "choices": [
        "Only a printed music playlist",
        "The tracking car's actual structure",
        "A random motor wiring guess",
        "An unrelated passenger-counting circuit"
      ],
      "correctIndex": 1,
      "hint": "Debugging must match the assembled car.",
      "explanation": "Slide 16 tells students to debug the program according to the tracking car's structure."
    }
  ]
};

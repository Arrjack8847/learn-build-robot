/**
 * Phase 2 source-text-grounded question bank (PDF visual review pending).
 * Do not register or publish until diagram/age QA is complete.
 */
import type { QuizBank } from "../quizStudio";

export const pendulumRideBank: QuizBank = {
  "projectId": "pendulum-ride",
  "title": "Pendulum Ride",
  "sourcePdfPath": "public/Level 1/Learning/Manipulators/Pendulum ride.pdf",
  "sourcePageCount": 17,
  "questions": [
    {
      "id": "pendulum-ride-01",
      "topic": "pendulum-ride",
      "learningSlide": 3,
      "prompt": "Where is a large pendulum ride commonly found?",
      "choices": [
        "Shipyard",
        "Amusement park",
        "School chemistry bench",
        "Recording studio"
      ],
      "correctIndex": 1,
      "hint": "Recall the setting introduced in the lesson.",
      "explanation": "The introduction describes a pendulum/Frisbee ride in amusement parks."
    },
    {
      "id": "pendulum-ride-02",
      "topic": "pendulum-ride",
      "learningSlide": 4,
      "prompt": "What motion does the ride perform repeatedly?",
      "choices": [
        "Rolling on a road",
        "Sailing across water",
        "Swinging back and forth",
        "Only moving vertically on a straight rail"
      ],
      "correctIndex": 2,
      "hint": "Think about the main motion of a pendulum.",
      "explanation": "The exploration states that the ride swings again and again."
    },
    {
      "id": "pendulum-ride-03",
      "topic": "model-structure",
      "learningSlide": 4,
      "prompt": "What happens to the gondola seats while the ride swings?",
      "choices": [
        "They become fixed to the ground",
        "They detach",
        "They turn into gears",
        "They rotate"
      ],
      "correctIndex": 3,
      "hint": "The lesson describes a second simultaneous motion.",
      "explanation": "The seats rotate while the pendulum swings."
    },
    {
      "id": "pendulum-ride-04",
      "topic": "model-structure",
      "learningSlide": 5,
      "prompt": "How are the seats arranged in the super-rotor design discussed?",
      "choices": [
        "In a circle",
        "In one straight line",
        "At random heights on a ladder",
        "In a square grid on the floor"
      ],
      "correctIndex": 0,
      "hint": "Think about the overall arrangement seen in the lesson.",
      "explanation": "The slide describes the seats as forming a circle."
    },
    {
      "id": "pendulum-ride-05",
      "topic": "mechanical-transmission",
      "learningSlide": 6,
      "prompt": "Which common building item is suggested to represent seats?",
      "choices": [
        "Controller buttons",
        "Tires",
        "Touch sensors",
        "Charging cables"
      ],
      "correctIndex": 1,
      "hint": "Recall the model component used as a seat.",
      "explanation": "The construction suggestion uses tires as seats."
    },
    {
      "id": "pendulum-ride-06",
      "topic": "mechanical-transmission",
      "learningSlide": 7,
      "prompt": "Which type of gear is named for making the seats rotate while the ride swings?",
      "choices": [
        "Only belt pulleys",
        "No transmission component",
        "Bevel gears",
        "Worm-and-rack only"
      ],
      "correctIndex": 2,
      "hint": "Remember the gear family revisited during exploration.",
      "explanation": "The slide explicitly names bevel gears for the two motions."
    },
    {
      "id": "pendulum-ride-07",
      "topic": "basic-programming",
      "learningSlide": 6,
      "prompt": "What provides rotational power for the pendulum model?",
      "choices": [
        "Paper hinge only",
        "Display light",
        "Battery label",
        "Motor"
      ],
      "correctIndex": 3,
      "hint": "Find the powered component in the construction plan.",
      "explanation": "The lesson says a motor provides the pendulum's rotational power."
    },
    {
      "id": "pendulum-ride-08",
      "topic": "basic-programming",
      "learningSlide": 13,
      "prompt": "What is the first programming task for the pendulum model?",
      "choices": [
        "Make the pendulum start to swing",
        "Display a map",
        "Record a voice message",
        "Operate a light sensor"
      ],
      "correctIndex": 0,
      "hint": "Recall the initial motion goal.",
      "explanation": "Task 1 instructs students to program the pendulum to start swinging."
    },
    {
      "id": "pendulum-ride-09",
      "topic": "repeated-motion",
      "learningSlide": 14,
      "prompt": "Which programming module makes the pendulum keep swinging?",
      "choices": [
        "Display clear only",
        "Loop module",
        "Program end only",
        "Audio download"
      ],
      "correctIndex": 1,
      "hint": "Think about performing the same movement repeatedly.",
      "explanation": "Task 2 adds a loop so the pendulum swings endlessly."
    },
    {
      "id": "pendulum-ride-10",
      "topic": "repeated-motion",
      "learningSlide": 17,
      "prompt": "Which change does the final challenge ask students to try?",
      "choices": [
        "Stop using the controller",
        "Turn the model into a sailboat",
        "Make the pendulum swing through a smaller angle",
        "Remove the rotating seats"
      ],
      "correctIndex": 2,
      "hint": "Consider how to modify the size of the swinging motion.",
      "explanation": "The challenge requests a smaller swing angle."
    }
  ]
};

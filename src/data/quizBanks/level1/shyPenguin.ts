/**
 * Source-text-grounded Level 1 Learning PDF quiz candidate.
 * Diagram and visual-review approval pending; not registered in Quiz Studio.
 */
import type { QuizBank } from "../../quizStudio";

export const shyPenguinBank: QuizBank = {
  "projectId": "shy-penguin",
  "title": "Shy Penguin",
  "sourcePdfPath": "public/Level 1/Learning/Biomimicry/Shy penguin.pdf",
  "sourcePageCount": 24,
  "questions": [
    {
      "id": "shy-penguin-01",
      "topic": "penguin-facts",
      "learningSlide": 2,
      "prompt": "How does the lesson describe a penguin's movement abilities?",
      "choices": [
        "It flies long distances",
        "It cannot fly but swims well",
        "It cannot swim",
        "It only travels by jumping"
      ],
      "correctIndex": 1,
      "hint": "Compare the two ways birds may move.",
      "explanation": "The introduction says penguins cannot fly and are strong swimmers."
    },
    {
      "id": "shy-penguin-02",
      "topic": "penguin-facts",
      "learningSlide": 3,
      "prompt": "How does the lesson describe the penguin when people approach?",
      "choices": [
        "It instantly begins to fly",
        "It turns into a statue",
        "It may become nervous",
        "It always attacks"
      ],
      "correctIndex": 2,
      "hint": "Think about why this model is called 'shy'.",
      "explanation": "The introduction says a penguin may become nervous when humans approach too closely."
    },
    {
      "id": "shy-penguin-03",
      "topic": "sensor-choice",
      "learningSlide": 5,
      "prompt": "Which sensor does the shy penguin model use to detect obstacles ahead?",
      "choices": [
        "Temperature sensor",
        "Gray sensor",
        "Touch sensor",
        "Infrared sensor"
      ],
      "correctIndex": 3,
      "hint": "Think about detecting a person before contact.",
      "explanation": "The exploration specifies an infrared sensor to detect obstacles ahead."
    },
    {
      "id": "shy-penguin-04",
      "topic": "sensor-choice",
      "learningSlide": 6,
      "prompt": "Which mechanical transmission type is named in the penguin design?",
      "choices": [
        "Bevel gear drive",
        "Hydraulic piston drive",
        "Belt conveyor drive",
        "Wind turbine drive"
      ],
      "correctIndex": 0,
      "hint": "Look for the gear arrangement mentioned in the model requirements.",
      "explanation": "The construction goals include gear drive and bevel gear drive."
    },
    {
      "id": "shy-penguin-05",
      "topic": "connections",
      "learningSlide": 18,
      "prompt": "Which controller port is used for the penguin motor?",
      "choices": [
        "Port 1",
        "Port A",
        "Port 4",
        "Port B only"
      ],
      "correctIndex": 1,
      "hint": "Remember the lettered connection used for motion.",
      "explanation": "The construction slide says to connect the motor to port A."
    },
    {
      "id": "shy-penguin-06",
      "topic": "connections",
      "learningSlide": 18,
      "prompt": "Where does the infrared sensor connect in the penguin project?",
      "choices": [
        "Port B",
        "The speaker outlet",
        "Port 1",
        "Port A"
      ],
      "correctIndex": 2,
      "hint": "Check the numbered input port.",
      "explanation": "The slide connects the infrared sensor to port 1."
    },
    {
      "id": "shy-penguin-07",
      "topic": "obstacle-response",
      "learningSlide": 19,
      "prompt": "How does the penguin move when no obstacle is in front?",
      "choices": [
        "In a fast circle",
        "Backwards quickly",
        "It remains still forever",
        "Forwards slowly"
      ],
      "correctIndex": 3,
      "hint": "Think about the model's normal movement when nothing is nearby.",
      "explanation": "The coding slide says the penguin moves slowly forward when no obstacle is detected."
    },
    {
      "id": "shy-penguin-08",
      "topic": "obstacle-response",
      "learningSlide": 19,
      "prompt": "What happens when the penguin detects an obstacle?",
      "choices": [
        "It moves backward for two seconds and stops",
        "It flies over the obstacle",
        "It moves forward faster",
        "It changes the battery"
      ],
      "correctIndex": 0,
      "hint": "Recall the shy reaction programmed for a nearby object.",
      "explanation": "The project describes backing away for two seconds and then stopping."
    },
    {
      "id": "shy-penguin-09",
      "topic": "repeated-behaviour",
      "learningSlide": 21,
      "prompt": "When the person is no longer detected, what should the penguin do?",
      "choices": [
        "Stay in place regardless of the sensor",
        "Move forward again",
        "Continue reversing forever",
        "Disable all sensors"
      ],
      "correctIndex": 1,
      "hint": "Think about how the robot resumes its normal behaviour.",
      "explanation": "The follow-up coding task has the penguin move forward again once the person is no longer seen."
    },
    {
      "id": "shy-penguin-10",
      "topic": "repeated-behaviour",
      "learningSlide": 21,
      "prompt": "What extra behaviour is requested after programming the penguin to back away?",
      "choices": [
        "Reverse at all times",
        "Drive both motors without sensing",
        "Restart movement when the obstacle disappears",
        "Remove the infrared sensor"
      ],
      "correctIndex": 2,
      "hint": "Compare the second programming task with the first.",
      "explanation": "The second task adds resuming forward movement after the detected person goes away."
    }
  ]
};

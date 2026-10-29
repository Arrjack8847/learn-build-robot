/** Source-checked Level 3 Learning PDF questions; slides are 1-based. */
import type { QuizBank } from "../../quizStudio";

export const securityDoorBank: QuizBank = {
  "projectId": "level-3-security-door",
  "title": "Security Door",
  "sourcePdfPath": "public/Level 3/Learning/Automation & Security/Security door/Security door_Powerpoint-update.pdf",
  "sourcePageCount": 20,
  "questions": [
    {
      "id": "sd-01",
      "topic": "security-purpose",
      "learningSlide": 7,
      "prompt": "What does the Security Door use to detect whether the door has opened?",
      "choices": [
        "A touch sensor",
        "A wind sensor",
        "A compass",
        "A water sensor"
      ],
      "correctIndex": 0,
      "hint": "The sensor detects pressing or release.",
      "explanation": "Slide 7 says the touch sensor gathers pressing information to detect whether a door is opened."
    },
    {
      "id": "sd-02",
      "topic": "security-purpose",
      "learningSlide": 17,
      "prompt": "When the anti-theft program is on, what should happen if the door is opened?",
      "choices": [
        "An alarm sounds and a red light turns on",
        "The alarm stays off",
        "The robot plays a lullaby",
        "The motor moves a car"
      ],
      "correctIndex": 0,
      "hint": "The alarm protects against an opened door.",
      "explanation": "Slide 17 specifies an alarm and red light when an opened door releases the touch sensor."
    },
    {
      "id": "sd-03",
      "topic": "touch-states",
      "learningSlide": 9,
      "prompt": "How many states does the touch sensor have according to the lesson?",
      "choices": [
        "One",
        "Two",
        "Four",
        "Eight"
      ],
      "correctIndex": 1,
      "hint": "The slide lists on and off.",
      "explanation": "Slide 9 says the touch sensor has on and off states."
    },
    {
      "id": "sd-04",
      "topic": "touch-states",
      "learningSlide": 9,
      "prompt": "Which familiar object is used to explain a touch sensor's operation?",
      "choices": [
        "A doorbell button",
        "A flashlight lens",
        "A tire",
        "A loudspeaker"
      ],
      "correctIndex": 0,
      "hint": "Think about a button pressed with a finger.",
      "explanation": "Slide 9 compares the touch sensor to a doorbell button."
    },
    {
      "id": "sd-05",
      "topic": "conditional-control",
      "learningSlide": 10,
      "prompt": "In a conditional program, what happens when a tested condition is satisfied?",
      "choices": [
        "The yes branch executes",
        "Both branches always execute",
        "No action can run",
        "The sensor is physically removed"
      ],
      "correctIndex": 0,
      "hint": "The lesson's selection structure has yes and otherwise paths.",
      "explanation": "Slide 10 says the yes action runs when the condition is satisfied."
    },
    {
      "id": "sd-06",
      "topic": "conditional-control",
      "learningSlide": 10,
      "prompt": "If the condition is not satisfied, which branch is used?",
      "choices": [
        "The other (otherwise) branch",
        "The yes branch without checking",
        "Both branches simultaneously",
        "No program structure is possible"
      ],
      "correctIndex": 0,
      "hint": "The flowchart gives an alternative when the condition is false.",
      "explanation": "Slide 10 describes a separate action for the condition not being satisfied."
    },
    {
      "id": "sd-07",
      "topic": "continuous-monitoring",
      "learningSlide": 11,
      "prompt": "What should be added if a program must keep checking for touch at any time?",
      "choices": [
        "A loop module",
        "An image filter",
        "An extra wheel",
        "A sound file"
      ],
      "correctIndex": 0,
      "hint": "One check is different from repeated checking.",
      "explanation": "Slide 11 says to add a loop for ongoing sensor monitoring."
    },
    {
      "id": "sd-08",
      "topic": "continuous-monitoring",
      "learningSlide": 12,
      "prompt": "Why is a single conditional check insufficient for responding to later presses?",
      "choices": [
        "It checks once rather than continuously",
        "It always measures humidity",
        "It has no input at all",
        "It automatically resets the controller"
      ],
      "correctIndex": 0,
      "hint": "The lesson contrasts one-time execution and monitoring.",
      "explanation": "Slide 12 explains that continuous press monitoring requires a loop."
    },
    {
      "id": "sd-09",
      "topic": "door-rules",
      "learningSlide": 16,
      "prompt": "What should the simple task do when the touch sensor is pressed?",
      "choices": [
        "Turn on a red light",
        "Open a music file",
        "Read GPS coordinates",
        "Increase motor speed"
      ],
      "correctIndex": 0,
      "hint": "The first programming task links a press to an indicator.",
      "explanation": "Slide 16 says a pressed sensor turns on the red light."
    },
    {
      "id": "sd-10",
      "topic": "door-rules",
      "learningSlide": 17,
      "prompt": "What is the anti-theft system's response when the door is closed and the sensor is pressed?",
      "choices": [
        "No alarm",
        "Alarm and red light",
        "Continuous motor rotation",
        "A timer showing 90 seconds"
      ],
      "correctIndex": 0,
      "hint": "The closed door is the normal condition.",
      "explanation": "Slide 17 says there is no alarm when the closed door presses the sensor."
    }
  ]
};

/** Question facts and 1-based slide references reviewed against the official 24-page Level 6 Learning PDF text. */
import type { QuizBank } from "../../quizStudio";

export const smartFlashlightBank: QuizBank = {
  "projectId": "level-6-smart-flashlight",
  "title": "Smart Flashlight",
  "sourcePdfPath": "public/Level 6/Learning/Illumination & Signals/Smart Flashlight/27.Lesson 27 Smart Flashlight-Teaching Slides.pdf",
  "sourcePageCount": 24,
  "questions": [
    {
      "id": "smartfl-01",
      "learningSlide": 10,
      "topic": "flashlight-components",
      "prompt": "Which combination describes the basic flashlight discussed in the lesson?",
      "choices": [
        "Touch screen, microphone and camera",
        "Motor, gears and wheels",
        "Battery-operated bulb and focusing reflector",
        "Barometric sensor and compass"
      ],
      "correctIndex": 2,
      "hint": "Think about what supplies power and directs the light.",
      "explanation": "Slide 10 describes a typical flashlight with a battery-operated bulb and a focusing reflector."
    },
    {
      "id": "smartfl-02",
      "learningSlide": 13,
      "topic": "flashlight-components",
      "prompt": "Which devices are shown as the key control and lighting components in the smart-flashlight model?",
      "choices": [
        "Gesture camera and motors",
        "Intelligent Eye and touch sensor",
        "Ultrasonic sensor and wheel encoder",
        "Temperature sensor and microphone"
      ],
      "correctIndex": 1,
      "hint": "The lesson's model combines a lamp module with a physical button input.",
      "explanation": "Slide 13 identifies the Intelligent Eye and touch sensor in the smart flashlight."
    },
    {
      "id": "smartfl-03",
      "learningSlide": 15,
      "topic": "adjusting-light-mode",
      "prompt": "What change occurs to the mode variable when the forward touch sensor is pressed?",
      "choices": [
        "It increases by one",
        "It decreases by one",
        "It resets to a random number",
        "It is always set to 100"
      ],
      "correctIndex": 0,
      "hint": "The two buttons adjust the variable in opposite directions.",
      "explanation": "Slide 15 says the forward touch sensor increments the variable by 1."
    },
    {
      "id": "smartfl-04",
      "learningSlide": 15,
      "topic": "adjusting-light-mode",
      "prompt": "What happens when the backward touch sensor is pressed?",
      "choices": [
        "The variable doubles",
        "The variable stays frozen",
        "The variable increases by one",
        "The variable decreases by one"
      ],
      "correctIndex": 3,
      "hint": "This button reverses the action of the forward button.",
      "explanation": "Slide 15 says the backward touch sensor decrements the variable by 1."
    },
    {
      "id": "smartfl-05",
      "learningSlide": 14,
      "topic": "button-release-handling",
      "prompt": "Why does the program need to judge when a touch sensor is released?",
      "choices": [
        "To count how many LEDs are installed",
        "To avoid an uncontrolled number of repeated mode changes",
        "To measure the battery voltage",
        "To detect the room temperature"
      ],
      "correctIndex": 1,
      "hint": "Think about a button that remains pressed while a loop repeats.",
      "explanation": "Slide 14 explains that incrementing/decrementing while pressed can make the variable uncontrollable unless release detection is added."
    },
    {
      "id": "smartfl-06",
      "learningSlide": 16,
      "topic": "button-release-handling",
      "prompt": "Which programming statement is added after processing a button press?",
      "choices": [
        "Wait for the touch sensor to be released",
        "Wait for the next PDF page",
        "Wait for the motor to reverse",
        "Wait until humidity reaches zero"
      ],
      "correctIndex": 0,
      "hint": "The program should not treat one held press as many separate presses.",
      "explanation": "Slide 16 adds a statement to wait for release of the touch sensor."
    },
    {
      "id": "smartfl-07",
      "learningSlide": 17,
      "topic": "variable-bounds",
      "prompt": "What minimum value should the light-mode variable be limited to?",
      "choices": [
        "-10",
        "-1",
        "0",
        "10"
      ],
      "correctIndex": 2,
      "hint": "Valid light-mode indexes should not become negative.",
      "explanation": "Slide 17 instructs the program to limit the mode variable to a minimum of 0."
    },
    {
      "id": "smartfl-08",
      "learningSlide": 22,
      "topic": "variable-bounds",
      "prompt": "What upper-bound rule is given in the lesson's optimization task?",
      "choices": [
        "Allow the variable to increase forever",
        "Set its maximum to the number of touch sensors",
        "Set its maximum to 100 in all programs",
        "Set its maximum to the number of lighting patterns"
      ],
      "correctIndex": 3,
      "hint": "Consider how many distinct modes the program has available.",
      "explanation": "Slide 22 says the maximum variable value should match the number of patterns set."
    },
    {
      "id": "smartfl-09",
      "learningSlide": 18,
      "topic": "pattern-selection",
      "prompt": "How does the smart flashlight choose different displayed light patterns?",
      "choices": [
        "Different modes activate different light patterns",
        "The light always stays on in one pattern",
        "The sensor is unplugged for every change",
        "The controller ignores the mode variable"
      ],
      "correctIndex": 0,
      "hint": "The program associates lighting behaviours with selected modes.",
      "explanation": "Slide 18 states that different modes illuminate different light patterns."
    },
    {
      "id": "smartfl-10",
      "learningSlide": 22,
      "topic": "pattern-selection",
      "prompt": "If a student adds more lighting patterns, what else should the program update to keep selection within the supported modes?",
      "choices": [
        "Its hardware serial number",
        "The mode variable's maximum bound",
        "The number of robot wheels",
        "The font used in the Learning PDF"
      ],
      "correctIndex": 1,
      "hint": "The optimization ties a numeric limit to the available patterns.",
      "explanation": "Slide 22 requires the upper variable limit to match the number of lighting patterns."
    }
  ]
};

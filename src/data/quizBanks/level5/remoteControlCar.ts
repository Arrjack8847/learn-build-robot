/** Source: hash-matched official Level 5 Learning PDF (34 pages). */
import type { QuizBank } from "../../quizStudio";

export const remoteControlCarBank: QuizBank = {
  "projectId": "level-5-remote-control-car",
  "title": "Remote Control Car",
  "sourcePdfPath": "public/Level 5/Learning/Display & Movement/Remote Control Car/12.Remote Control Car-Slides.pdf",
  "sourcePageCount": 34,
  "questions": [
    {
      "id": "level-5-remote-control-car-01",
      "topic": "bluetooth-purpose",
      "learningSlide": 4,
      "prompt": "What short-range communication method is used to connect the car to a phone or controller?",
      "choices": [
        "Bluetooth",
        "Barometric pressure",
        "Only visible light",
        "Mechanical gears"
      ],
      "correctIndex": 0,
      "hint": "The lesson names the wireless connection method.",
      "explanation": "Slide 4 introduces Bluetooth control of toy cars."
    },
    {
      "id": "level-5-remote-control-car-02",
      "topic": "bluetooth-purpose",
      "learningSlide": 6,
      "prompt": "What kind of project does this lesson build?",
      "choices": [
        "A floor-drawing plotter",
        "A car controlled through Bluetooth communication",
        "A solar-only fan",
        "A coin-operated ticket machine"
      ],
      "correctIndex": 1,
      "hint": "Read the project task.",
      "explanation": "Slide 6 defines the project as a Bluetooth-controlled toy car."
    },
    {
      "id": "level-5-remote-control-car-03",
      "topic": "remote-buttons",
      "learningSlide": 6,
      "prompt": "What should pressing the remote's left button do?",
      "choices": [
        "Turn right by about 90 degrees",
        "Shut down the Bluetooth broadcast",
        "Turn the car left by about 90 degrees",
        "Drive straight for an hour"
      ],
      "correctIndex": 2,
      "hint": "The button directions correspond to turns.",
      "explanation": "Slide 6 specifies approximately a 90-degree left turn from the left button."
    },
    {
      "id": "level-5-remote-control-car-04",
      "topic": "remote-buttons",
      "learningSlide": 6,
      "prompt": "Which remote input commands the car to drive straight?",
      "choices": [
        "Right directional button",
        "Left directional button",
        "Power-off switch",
        "Touch sensor"
      ],
      "correctIndex": 3,
      "hint": "One of the inputs is a sensor rather than a direction button.",
      "explanation": "Slide 6 assigns forward travel to the remote controller's touch sensor."
    },
    {
      "id": "level-5-remote-control-car-05",
      "topic": "connection-roles",
      "learningSlide": 19,
      "prompt": "Which Bluetooth role actively searches for another controller?",
      "choices": [
        "Host",
        "Slave",
        "Neither role",
        "Both roles only when powered off"
      ],
      "correctIndex": 0,
      "hint": "The initiating device requests the connection.",
      "explanation": "Slide 19 describes the host as initiating searches and connections."
    },
    {
      "id": "level-5-remote-control-car-06",
      "topic": "connection-roles",
      "learningSlide": 19,
      "prompt": "What does a controller in slave mode do?",
      "choices": [
        "Send motor power through the air",
        "Wait for a host to request a connection",
        "Automatically connect to every nearby device",
        "Refuse all Bluetooth connections"
      ],
      "correctIndex": 1,
      "hint": "Only one role initiates the connection.",
      "explanation": "Slide 19 says the slave waits for a host request."
    },
    {
      "id": "level-5-remote-control-car-07",
      "topic": "data-exchange",
      "learningSlide": 23,
      "prompt": "What can the Bluetooth send block transmit to another controller?",
      "choices": [
        "Mechanical torque",
        "A physical arrow",
        "Data values",
        "Oil pressure directly"
      ],
      "correctIndex": 2,
      "hint": "Think about numerical commands crossing the wireless link.",
      "explanation": "Slide 23 describes sending values to another controller over Bluetooth."
    },
    {
      "id": "level-5-remote-control-car-08",
      "topic": "data-exchange",
      "learningSlide": 24,
      "prompt": "How does the car decide what action to perform after receiving Bluetooth data?",
      "choices": [
        "Ignore all received values",
        "Measure only the motor's temperature",
        "Recompile the program at every message",
        "Compare the received numeric value with action conditions"
      ],
      "correctIndex": 3,
      "hint": "A command number selects an action.",
      "explanation": "Slide 24 introduces receiving values and comparing them in judgments."
    },
    {
      "id": "level-5-remote-control-car-09",
      "topic": "motion-responses",
      "learningSlide": 26,
      "prompt": "Which data value is transmitted when none of the remote inputs is pressed?",
      "choices": [
        "0",
        "999",
        "65488",
        "4095"
      ],
      "correctIndex": 0,
      "hint": "The sender must overwrite its previous command.",
      "explanation": "Slide 26 specifically sends zero when no button is pressed."
    },
    {
      "id": "level-5-remote-control-car-10",
      "topic": "motion-responses",
      "learningSlide": 27,
      "prompt": "Why might a short delay such as 0.2 seconds be used for a forward-drive command?",
      "choices": [
        "To reset the host name",
        "To allow the motors to move briefly before stopping",
        "To disconnect Bluetooth before motion",
        "To reverse the steering direction"
      ],
      "correctIndex": 1,
      "hint": "Think about allowing the movement to last long enough.",
      "explanation": "Slide 27 recommends a brief waiting period to let the motors rotate before stopping."
    }
  ]
};

/** Level 4 — Remote Control Car. Questions checked against the 25-page Learning PDF text; diagram-independent, Acceleration Car difficulty. */
import type { QuizBank } from "../../quizStudio";

export const remoteControlCarBank: QuizBank = {
  "projectId": "level-4-remote-control-car",
  "title": "Remote Control Car",
  "sourcePdfPath": "public/Level 4/Vehicles & Complex Movers/Remote Control Car/04. Remote Control Car-Teaching Slides.pdf",
  "sourcePageCount": 25,
  "questions": [
    {
      "id": "l4-remotecontrolcar-01",
      "topic": "remote-control-basics",
      "learningSlide": 4,
      "prompt": "What does a remote controller let you do?",
      "choices": [
        "Change the weather",
        "Build a road",
        "Control a device from a distance",
        "Charge a battery without power"
      ],
      "correctIndex": 2,
      "explanation": "Slide 4 introduces remote controls that operate devices from a distance.",
      "hint": "Think about using a controller without touching the device."
    },
    {
      "id": "l4-remotecontrolcar-02",
      "topic": "remote-control-basics",
      "learningSlide": 6,
      "prompt": "Which remote-control method is listed in the lesson?",
      "choices": [
        "Bluetooth",
        "Water pressure",
        "A mechanical string only",
        "A printed QR receipt"
      ],
      "correctIndex": 0,
      "explanation": "Slide 6 lists Bluetooth, infrared, and 2.4 GHz wireless remote control.",
      "hint": "Think about the wireless options described."
    },
    {
      "id": "l4-remotecontrolcar-03",
      "topic": "attitude-sensor",
      "learningSlide": 10,
      "prompt": "What should the car do when the controller is tilted forward?",
      "choices": [
        "Stop all motors forever",
        "Go straight forward",
        "Move backward",
        "Play a warning sound only"
      ],
      "correctIndex": 1,
      "explanation": "Slide 10 describes forward leaning as a command to travel straight.",
      "hint": "Picture moving the handheld controller toward the front."
    },
    {
      "id": "l4-remotecontrolcar-04",
      "topic": "attitude-sensor",
      "learningSlide": 10,
      "prompt": "What should the car do when the controller is leaned backward?",
      "choices": [
        "Turn on a light only",
        "Increase the wheel size",
        "Read a tag code",
        "Move backward"
      ],
      "correctIndex": 3,
      "explanation": "Slide 10 describes backward leaning as a reverse movement command.",
      "hint": "Think about making the motion follow the direction of the tilt."
    },
    {
      "id": "l4-remotecontrolcar-05",
      "topic": "bluetooth-commands",
      "learningSlide": 15,
      "prompt": "Which Bluetooth message number tells the robot to stop?",
      "choices": [
        "2",
        "4",
        "5",
        "1"
      ],
      "correctIndex": 3,
      "explanation": "Slide 15 maps message 1 to stop.",
      "hint": "The program uses short numbers for movement commands."
    },
    {
      "id": "l4-remotecontrolcar-06",
      "topic": "bluetooth-commands",
      "learningSlide": 15,
      "prompt": "Which messages are used for left and right turning?",
      "choices": [
        "3 and 4",
        "4 and 5",
        "1 and 2",
        "2 and 3"
      ],
      "correctIndex": 1,
      "explanation": "Slide 15 assigns messages 4 and 5 to turns.",
      "hint": "Think about the pair of commands after forward and backward."
    },
    {
      "id": "l4-remotecontrolcar-07",
      "topic": "controller-startup",
      "learningSlide": 16,
      "prompt": "Why does the controller wait three seconds when starting?",
      "choices": [
        "To finish calibration before sending commands",
        "To make its wheels larger",
        "To change the Bluetooth name",
        "To turn a camera on"
      ],
      "correctIndex": 0,
      "explanation": "Slide 16 explains that the controller needs time to calibrate before sending reliable data.",
      "hint": "The sensor must be ready before it reports its position."
    },
    {
      "id": "l4-remotecontrolcar-08",
      "topic": "controller-startup",
      "learningSlide": 17,
      "prompt": "Which two angle values are saved into variables?",
      "choices": [
        "Color and brightness",
        "Temperature and humidity",
        "Pitch and yaw",
        "Speed and sound"
      ],
      "correctIndex": 2,
      "explanation": "Slide 17 says to store pitch and yaw angles.",
      "hint": "Think about ways to describe the handle's orientation."
    },
    {
      "id": "l4-remotecontrolcar-09",
      "topic": "movement-decisions",
      "learningSlide": 18,
      "prompt": "Which movement does the program check first?",
      "choices": [
        "Whether to print a label",
        "Whether to turn",
        "Whether to play music",
        "Whether to flash a light"
      ],
      "correctIndex": 1,
      "explanation": "Slide 18 says turning has priority in the controller's decisions.",
      "hint": "Think about the control action checked before forward or backward motion."
    },
    {
      "id": "l4-remotecontrolcar-10",
      "topic": "movement-decisions",
      "learningSlide": 19,
      "prompt": "What does the controller do when the forward/backward tilt stays inside the chosen stop range?",
      "choices": [
        "Always move forward",
        "Always move backward",
        "Disable Bluetooth permanently",
        "Send a stop command"
      ],
      "correctIndex": 3,
      "explanation": "Slide 19 explains that motion is stopped when the tilt is within the specified range.",
      "hint": "A small or neutral tilt should not keep the car moving."
    }
  ]
};

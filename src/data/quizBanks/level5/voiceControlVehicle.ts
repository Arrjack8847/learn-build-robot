/** Questions checked against the official 21-page Level 5 Learning PDF. */
import type { QuizBank } from "../../quizStudio";

export const voiceControlVehicleBank: QuizBank = {
  "projectId": "level-5-voice-control-vehicle",
  "title": "Voice Control Vehicle",
  "sourcePdfPath": "public/Level 5/Learning/Sound & Voice Interaction/Voice Control Vehicle/Voice Control Vehicle_Powerpoint-update.pdf",
  "sourcePageCount": 21,
  "questions": [
    {
      "id": "level-5-voice-control-vehicle-01",
      "topic": "sound-sensing",
      "learningSlide": 7,
      "prompt": "What does the sound-sensitive sensor measure in the voice-control car lesson?",
      "choices": [
        "The size or intensity of sound",
        "The distance to the Moon",
        "The car's magnetic pole",
        "The color of nearby traffic signs"
      ],
      "correctIndex": 0,
      "hint": "It responds to loudness rather than words.",
      "explanation": "Slide 7 describes using a sound-sensitive sensor to detect the size of sound."
    },
    {
      "id": "level-5-voice-control-vehicle-02",
      "topic": "sound-sensing",
      "learningSlide": 7,
      "prompt": "How does the car decide which movement action to take?",
      "choices": [
        "Compare the sensed sound level with set thresholds",
        "Recognize each spoken word as text",
        "Measure the temperature of a motor only",
        "Check an unrelated QR-code password"
      ],
      "correctIndex": 0,
      "hint": "The lesson uses threshold comparisons.",
      "explanation": "Slide 7 says different sound levels relative to thresholds trigger car actions."
    },
    {
      "id": "level-5-voice-control-vehicle-03",
      "topic": "robot-systems",
      "learningSlide": 9,
      "prompt": "Which collection of systems makes up the robot system described in the lesson?",
      "choices": [
        "Mechanical, drive, control and sensing systems",
        "Only wheel, paint and battery cover",
        "Only software, with no hardware",
        "Only a display and a speaker"
      ],
      "correctIndex": 0,
      "hint": "The lesson describes the robot as a collection of cooperating subsystems.",
      "explanation": "Slide 9 includes mechanical, drive, control and sensing systems in the robot system."
    },
    {
      "id": "level-5-voice-control-vehicle-04",
      "topic": "robot-systems",
      "learningSlide": 10,
      "prompt": "What is the drive system's main function?",
      "choices": [
        "Provide the force or motion needed to operate the mechanical system",
        "Recognize facial identities by itself",
        "Store the title of the project",
        "Count visitors through an infrared beam"
      ],
      "correctIndex": 0,
      "hint": "The drive carries out movement.",
      "explanation": "Slide 10 describes the drive system as the mechanism that operates the robot's mechanical components."
    },
    {
      "id": "level-5-voice-control-vehicle-05",
      "topic": "control-loop",
      "learningSlide": 11,
      "prompt": "What component sends action commands to the robot's drive?",
      "choices": [
        "Control system",
        "Decorative outer shell",
        "Printed lesson title",
        "Unpowered wheel axle"
      ],
      "correctIndex": 0,
      "hint": "A controller decides what motors should do.",
      "explanation": "Slide 11 says the control system issues commands that operate the drive system."
    },
    {
      "id": "level-5-voice-control-vehicle-06",
      "topic": "control-loop",
      "learningSlide": 11,
      "prompt": "Why does the sensing system provide the actual position of the robot back to the control system?",
      "choices": [
        "So the controller can compare the actual and desired position",
        "So sensors can replace all motors",
        "To change the physical size of the robot",
        "To prevent all new commands"
      ],
      "correctIndex": 0,
      "hint": "Feedback helps detect differences from the target.",
      "explanation": "Slide 11 describes a feedback loop comparing actual end-effector position with desired pose."
    },
    {
      "id": "level-5-voice-control-vehicle-07",
      "topic": "threshold-logic",
      "learningSlide": 15,
      "prompt": "What happens when a sound does not exceed the set trigger value in the sample flowchart?",
      "choices": [
        "No reaction",
        "The car always turns sharply left",
        "A QR-code attendance record is created",
        "The robot always doubles speed"
      ],
      "correctIndex": 0,
      "hint": "The flowchart has a no-action branch.",
      "explanation": "Slide 15 sends the non-triggering condition to 'No reaction'."
    },
    {
      "id": "level-5-voice-control-vehicle-08",
      "topic": "threshold-logic",
      "learningSlide": 16,
      "prompt": "What basic movement behavior is demonstrated in the first car program?",
      "choices": [
        "Move forward after hearing a sound, then stop",
        "Drive backward forever",
        "Recognize a face and take attendance",
        "Circle around a magnetic cabinet"
      ],
      "correctIndex": 0,
      "hint": "This example uses sound to start a short movement.",
      "explanation": "Slide 16 states that the car goes forward and stops after hearing sound."
    },
    {
      "id": "level-5-voice-control-vehicle-09",
      "topic": "movement-programs",
      "learningSlide": 17,
      "prompt": "At what sound-level threshold does the second example instruct the car to stop?",
      "choices": [
        "When the reading exceeds 2000",
        "When the reading is exactly 0.02",
        "Only when the reading is less than 1",
        "Only after a face is registered"
      ],
      "correctIndex": 0,
      "hint": "The example includes a higher stop threshold.",
      "explanation": "Slide 17 states that the car stops when the sound reading exceeds 2000."
    },
    {
      "id": "level-5-voice-control-vehicle-10",
      "topic": "movement-programs",
      "learningSlide": 18,
      "prompt": "What turning actions are assigned to louder readings in the third example?",
      "choices": [
        "Turn left above 1300 and right above 1500",
        "Turn only clockwise at every level",
        "Open a gate above 100",
        "Rotate a prize wheel by QR code"
      ],
      "correctIndex": 0,
      "hint": "The program uses different sound thresholds for different turns.",
      "explanation": "Slide 18 lists left turning above 1300 and right turning above 1500 in its sound-based action sequence."
    }
  ]
};

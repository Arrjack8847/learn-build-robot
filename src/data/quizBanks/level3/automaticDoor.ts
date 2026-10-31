/** Verified against the Level 3 official Learning PDF. */
import type { QuizBank } from "../../quizStudio";

export const automaticDoorBank: QuizBank = {
  "projectId": "level-3-automatic-door",
  "title": "Automatic Door",
  "sourcePdfPath": "public/Level 3/Learning/Interactive Systems/Automatic Door/17.Automatic Door -Slides.pdf",
  "sourcePageCount": 34,
  "questions": [
    {
      "id": "automaticdoo-01",
      "topic": "door-purpose",
      "learningSlide": 3,
      "prompt": "What allows an automatic door to open without a person pushing it?",
      "choices": [
        "A permanently pressed button",
        "A fixed open hinge",
        "Sensors that detect nearby people or objects",
        "A continuously running alarm"
      ],
      "correctIndex": 2,
      "hint": "The door has to detect its surroundings.",
      "explanation": "Slide 3 describes automatic doors identifying people and objects using sensors."
    },
    {
      "id": "automaticdoo-02",
      "topic": "door-purpose",
      "learningSlide": 4,
      "prompt": "What happens when the door's approach sensor detects someone nearby?",
      "choices": [
        "It disconnects the controller immediately",
        "It measures wheel speed instead",
        "It locks the door permanently",
        "It sends a signal to the door control system"
      ],
      "correctIndex": 3,
      "hint": "Think about the link between detecting an approach and moving the door.",
      "explanation": "Slide 4 explains sensing an approach and signaling the door mechanism."
    },
    {
      "id": "automaticdoo-03",
      "topic": "ultrasonic-ranging",
      "learningSlide": 7,
      "prompt": "Which sensor is selected for the model's distance-based opening task?",
      "choices": [
        "Ultrasonic sensor",
        "Photoelectric grayscale sensor",
        "A keyboard switch only",
        "A barometer"
      ],
      "correctIndex": 0,
      "hint": "The task depends on knowing the distance to an approaching person.",
      "explanation": "Slide 7 introduces ultrasonic sensors as distance-measurement devices."
    },
    {
      "id": "automaticdoo-04",
      "topic": "ultrasonic-ranging",
      "learningSlide": 8,
      "prompt": "How does the ultrasonic device determine how far a person is?",
      "choices": [
        "By measuring the person's skin color",
        "By timing sound waves reflected from the person",
        "By reading a barcode on clothing",
        "By counting the door hinges"
      ],
      "correctIndex": 1,
      "hint": "The sensor sends out a wave and waits for its return.",
      "explanation": "Slide 8 describes ultrasound transmission and echo timing."
    },
    {
      "id": "automaticdoo-05",
      "topic": "sensor-setup",
      "learningSlide": 9,
      "prompt": "Which controller ports are listed for connecting the ultrasonic sensor?",
      "choices": [
        "Motor outputs M1–M4 only",
        "The audio jack only",
        "Composite ports P1–P8",
        "The battery terminals"
      ],
      "correctIndex": 2,
      "hint": "The sensor connects through the controller's sensor ports.",
      "explanation": "Slide 9 allows any composite port from P1 to P8."
    },
    {
      "id": "automaticdoo-06",
      "topic": "sensor-setup",
      "learningSlide": 10,
      "prompt": "Which built-in controller test verifies that distance measurements change?",
      "choices": [
        "Gray test",
        "Music test",
        "Motor torque test",
        "Ultrasonic test"
      ],
      "correctIndex": 3,
      "hint": "The test shares its name with the sensor.",
      "explanation": "Slide 10 instructs using the built-in Ultrasonic test and moving an obstacle."
    },
    {
      "id": "automaticdoo-07",
      "topic": "decision-rule",
      "learningSlide": 26,
      "prompt": "Which programming condition can determine whether a door should open?",
      "choices": [
        "Detected distance compared with a chosen threshold",
        "Number of files in the controller",
        "Speaker volume compared with music length",
        "Number of gears in the door frame"
      ],
      "correctIndex": 0,
      "hint": "The door needs to decide whether someone is close enough.",
      "explanation": "Slide 26 provides comparisons of ultrasonic distance with a specified distance."
    },
    {
      "id": "automaticdoo-08",
      "topic": "decision-rule",
      "learningSlide": 23,
      "prompt": "What is a sensible first check before setting the door's distance threshold?",
      "choices": [
        "Remove the ultrasonic sensor",
        "Measure the sensor reading with a hand nearby and with no one there",
        "Run the door continuously without testing",
        "Set the controller to an unrelated motor port"
      ],
      "correctIndex": 1,
      "hint": "The program needs real readings for different situations.",
      "explanation": "Slide 23 asks students to record distance values with a hand under the sensor and the model on a table."
    },
    {
      "id": "automaticdoo-09",
      "topic": "door-sequence",
      "learningSlide": 6,
      "prompt": "What action sequence does the project require when someone approaches the door?",
      "choices": [
        "Close, accelerate, then steer",
        "Open and stay open forever",
        "Open, wait, then close",
        "Turn a wheel without moving the door"
      ],
      "correctIndex": 2,
      "hint": "The task describes a complete visitor interaction.",
      "explanation": "Slide 6 specifies opening the door, waiting, and then closing it."
    },
    {
      "id": "automaticdoo-10",
      "topic": "door-sequence",
      "learningSlide": 27,
      "prompt": "What should trigger the program to open the model door?",
      "choices": [
        "A random time regardless of distance",
        "A change in motor temperature",
        "A printed instruction card",
        "A person detected by the ultrasonic sensor"
      ],
      "correctIndex": 3,
      "hint": "The door reacts to a nearby visitor.",
      "explanation": "Slide 27 starts the door-opening task when someone is detected."
    }
  ]
};

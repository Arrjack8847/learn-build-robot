/** Verified against the official 18-page Level 5 Learning PDF. */
import type { QuizBank } from "../../quizStudio";

export const superTrajectoryRobot3Bank: QuizBank = {
  "projectId": "level-5-super-trajectory-robot-3",
  "title": "Super Trajectory Robot 3",
  "sourcePdfPath": "public/Level 5/Learning/Advanced Navigation & Control/Super Trajectory Robot 3/15.Super Trajectory Robot 3.pdf",
  "sourcePageCount": 18,
  "questions": [
    {
      "id": "level-5-super-trajectory-robot-3-01",
      "topic": "line-tracking",
      "learningSlide": 6,
      "prompt": "Which type of sensor does the lesson describe using to follow a black line?",
      "choices": [
        "Photoelectric sensor",
        "Barometric pressure sensor",
        "Magnetic pole sensor",
        "Temperature-only sensor"
      ],
      "correctIndex": 0,
      "hint": "The robot distinguishes black from white surfaces.",
      "explanation": "Slide 6 describes photoelectric sensors tracking a black line."
    },
    {
      "id": "level-5-super-trajectory-robot-3-02",
      "topic": "line-tracking",
      "learningSlide": 7,
      "prompt": "What two surface colors is the lesson's track-following robot built to distinguish?",
      "choices": [
        "Red and green",
        "Blue and yellow",
        "Black and white",
        "Orange and purple"
      ],
      "correctIndex": 2,
      "hint": "The course image shows a dark route on a lighter background.",
      "explanation": "Slide 7 states that the robot will patrol black and white."
    },
    {
      "id": "level-5-super-trajectory-robot-3-03",
      "topic": "encoder-values",
      "learningSlide": 9,
      "prompt": "How does the lesson tell students to measure a robot motor's encoded position value?",
      "choices": [
        "Open E6 → Test → Encode Value, push the car and read the value",
        "Ask a passenger to measure the tire by sight",
        "Measure the surrounding air pressure",
        "Use the camera's face-ID mode"
      ],
      "correctIndex": 0,
      "hint": "The slide provides a testing menu path.",
      "explanation": "Slide 9 gives E6 → Test → Encode Value, then pushing the car to read its encoder value."
    },
    {
      "id": "level-5-super-trajectory-robot-3-04",
      "topic": "encoder-values",
      "learningSlide": 9,
      "prompt": "What relationship between motor rotation and code value is stated in the lesson?",
      "choices": [
        "One motor degree equals one code value",
        "Two motor degrees always equal 100 code values",
        "Code values measure only temperature",
        "Code values are unrelated to motor rotation"
      ],
      "correctIndex": 0,
      "hint": "The slide describes a simple one-to-one mapping.",
      "explanation": "Slide 9 explicitly states that 1 degree of motor rotation corresponds to 1 code value for the lesson's setup."
    },
    {
      "id": "level-5-super-trajectory-robot-3-05",
      "topic": "fixed-point-stop",
      "learningSlide": 2,
      "prompt": "What new navigation behavior does the lesson teach using recorded code values?",
      "choices": [
        "Stop at a predefined point along the route",
        "Fly over the route",
        "Stop only when temperature changes",
        "Open an electronic door when a QR tag is shown"
      ],
      "correctIndex": 0,
      "hint": "The lesson goal refers to an anchor point stop.",
      "explanation": "Slide 2 lists programming a fixed-point or anchor-point stop using encoded values."
    },
    {
      "id": "level-5-super-trajectory-robot-3-06",
      "topic": "fixed-point-stop",
      "learningSlide": 9,
      "prompt": "When should the tracking car stop automatically in the fixed-stop example?",
      "choices": [
        "After reaching the specified code value",
        "Only if the motor overheats",
        "After detecting a magnetic south pole",
        "Every time a display character changes"
      ],
      "correctIndex": 0,
      "hint": "It stops based on its recorded movement position.",
      "explanation": "Slide 9 explains that the car automatically stops patrol when it reaches a certain coded value."
    },
    {
      "id": "level-5-super-trajectory-robot-3-07",
      "topic": "task-actions",
      "learningSlide": 13,
      "prompt": "What should happen when the car reaches mission area 1?",
      "choices": [
        "The buzzer sounds for three seconds",
        "An ultrasonic reading is deleted",
        "The car opens a cabinet",
        "The motor moves backward for one hour"
      ],
      "correctIndex": 0,
      "hint": "The first station has an audible task.",
      "explanation": "Slide 13 sets a three-second buzzer task at mission area 1."
    },
    {
      "id": "level-5-super-trajectory-robot-3-08",
      "topic": "task-actions",
      "learningSlide": 14,
      "prompt": "What happens at mission area 2 in the lesson?",
      "choices": [
        "The camera records a face",
        "An LED flashes three times",
        "The motor temperature is displayed",
        "A prize wheel rotates forever"
      ],
      "correctIndex": 1,
      "hint": "The second station uses a flashing light.",
      "explanation": "Slide 14 instructs the LED to flash three times at mission area 2."
    },
    {
      "id": "level-5-super-trajectory-robot-3-09",
      "topic": "model-and-extension",
      "learningSlide": 11,
      "prompt": "Which construction requirement is included for the Super Trajectory Robot 3?",
      "choices": [
        "A stable model structure",
        "A deliberately unsupported frame",
        "An unbalanced center of gravity",
        "A display without a controller"
      ],
      "correctIndex": 0,
      "hint": "The assembly checklist prioritizes stability.",
      "explanation": "Slide 11 specifies stable structure as a building requirement."
    },
    {
      "id": "level-5-super-trajectory-robot-3-10",
      "topic": "model-and-extension",
      "learningSlide": 15,
      "prompt": "What programmed action is requested for mission area 3?",
      "choices": [
        "Turn off the entire sensor board forever",
        "Lift a servo motor mechanism",
        "Measure air pressure continuously",
        "Read the colors of a music box"
      ],
      "correctIndex": 1,
      "hint": "The third activity raises an attached mechanism.",
      "explanation": "Slide 15 instructs a servo-motor lifting task for mission area 3."
    }
  ]
};

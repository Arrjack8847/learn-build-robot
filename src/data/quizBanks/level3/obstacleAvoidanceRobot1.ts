/** Source-checked Level 3 Learning PDF questions; page references are 1-based. */
import type { QuizBank } from "../../quizStudio";

export const obstacleAvoidanceRobot1Bank: QuizBank = {
  "projectId": "level-3-obstacle-avoidance-robot-1",
  "title": "Obstacle Avoidance Robot 1",
  "sourcePdfPath": "public/Level 3/Learning/Autonomous Navigation & Ranging/Obstacle Avoidance Robot 1/Obstacle Avoidance Robot 1_Powerpoint.pdf",
  "sourcePageCount": 19,
  "questions": [
    {
      "id": "oa1-01",
      "topic": "purpose",
      "learningSlide": 6,
      "prompt": "Why does an obstacle-avoidance robot change its movement when something blocks its path?",
      "choices": [
        "To avoid the obstacle",
        "To play louder music",
        "To measure room temperature",
        "To change its body color"
      ],
      "correctIndex": 0,
      "hint": "Think about what could happen if the robot drove straight into a barrier.",
      "explanation": "The lesson defines obstacle avoidance as responding to something that hinders movement."
    },
    {
      "id": "oa1-02",
      "topic": "purpose",
      "learningSlide": 7,
      "prompt": "What is the main function of the robot introduced in this lesson?",
      "choices": [
        "Sort objects by color",
        "Avoid obstacles using ultrasonic ranging",
        "Draw shapes on a screen",
        "Play recorded messages"
      ],
      "correctIndex": 1,
      "hint": "The lesson names the kind of ranging used to detect obstacles.",
      "explanation": "Slide 7 introduces an obstacle-avoidance robot that uses ultrasonic ranging."
    },
    {
      "id": "oa1-03",
      "topic": "ultrasonic",
      "learningSlide": 7,
      "prompt": "How does the lesson describe the robot locating an obstacle with sound?",
      "choices": [
        "It uses the time difference of received sound waves",
        "It counts the colors on an obstacle",
        "It measures an obstacle's weight",
        "It reads battery voltage"
      ],
      "correctIndex": 0,
      "hint": "Think about how long a returning sound signal takes.",
      "explanation": "Slide 7 says the robot determines obstacle position from the received sound-wave time difference."
    },
    {
      "id": "oa1-04",
      "topic": "ultrasonic",
      "learningSlide": 9,
      "prompt": "Which kind of wave is discussed as a way to detect obstacles?",
      "choices": [
        "Broadcast radio waves",
        "Ultrasonic sound waves",
        "Visible light only",
        "Water ripples only"
      ],
      "correctIndex": 1,
      "hint": "The new-knowledge page discusses sound waves.",
      "explanation": "Slide 9 discusses ultrasonic waves traveling through different media to detect objects."
    },
    {
      "id": "oa1-05",
      "topic": "conditionals",
      "learningSlide": 14,
      "prompt": "In the lesson flowchart, what determines whether the robot turns or goes straight?",
      "choices": [
        "A random choice",
        "Distance compared with a set value",
        "The color of its wheels",
        "The time of day"
      ],
      "correctIndex": 1,
      "hint": "Look for two distance comparisons in the flowchart.",
      "explanation": "Slide 14 branches between turning and straight movement based on the set distance."
    },
    {
      "id": "oa1-06",
      "topic": "conditionals",
      "learningSlide": 14,
      "prompt": "What does the obstacle-avoidance flowchart direct the robot to do when the distance is below the set value?",
      "choices": [
        "Turn",
        "Continue straight",
        "Power off permanently",
        "Play music"
      ],
      "correctIndex": 0,
      "hint": "Which action helps avoid a nearby object?",
      "explanation": "The smaller-than-set-value branch leads to turning."
    },
    {
      "id": "oa1-07",
      "topic": "movement-tasks",
      "learningSlide": 15,
      "prompt": "What does Task 1 practice when an obstacle is about 25 cm ahead?",
      "choices": [
        "Stop all sensing",
        "Turn to avoid the obstacle",
        "Drive faster straight ahead",
        "Move only the display"
      ],
      "correctIndex": 1,
      "hint": "The task combines a close obstacle with a change in direction.",
      "explanation": "Slide 15 describes turning to avoid an obstacle around 25 cm ahead."
    },
    {
      "id": "oa1-08",
      "topic": "movement-tasks",
      "learningSlide": 16,
      "prompt": "What sequence is specified in Task 2 for an obstacle 25 cm ahead?",
      "choices": [
        "Reverse five seconds then turn right",
        "Stop one second then turn 90 degrees left",
        "Accelerate without turning",
        "Wait one minute then drive backward"
      ],
      "correctIndex": 1,
      "hint": "Notice the waiting time and turn direction.",
      "explanation": "Slide 16 specifies a one-second stop followed by a 90-degree left turn."
    },
    {
      "id": "oa1-09",
      "topic": "assembly",
      "learningSlide": 12,
      "prompt": "Which feature is explicitly required of the assembled robot?",
      "choices": [
        "A stable structure",
        "A loose frame",
        "Disconnected wheels",
        "An uneven base"
      ],
      "correctIndex": 0,
      "hint": "Think about what keeps a moving model together.",
      "explanation": "Slide 12 lists a stable structure among assembly requirements."
    },
    {
      "id": "oa1-10",
      "topic": "assembly",
      "learningSlide": 12,
      "prompt": "Which additional check is on the assembly-requirements slide?",
      "choices": [
        "Match the intended shape",
        "Remove sensors",
        "Use only one connector",
        "Ignore the design"
      ],
      "correctIndex": 0,
      "hint": "The model should match the intended design.",
      "explanation": "Slide 12 lists 'shape match' as a requirement."
    }
  ]
};

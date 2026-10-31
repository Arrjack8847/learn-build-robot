/** Level 3 Learning PDF source-checked questions; slide numbers are 1-based. */
import type { QuizBank } from "../../quizStudio";

export const cycleSportBasicBank: QuizBank = {
  "projectId": "level-3-cycle-sport-basic",
  "title": "Cycle Sport — Basic",
  "sourcePdfPath": "public/Level 3/Learning/Action-Oriented/Cycle Sport/3. Cycle Sport - Slides.pdf",
  "sourcePageCount": 28,
  "questions": [
    {
      "id": "cyclesportb-01",
      "topic": "cycle-mechanisms",
      "learningSlide": 10,
      "prompt": "In the bicycle model's crank-rocker example, which body part acts like the rocker?",
      "choices": [
        "The rider's thighs",
        "The turning pedal axle",
        "The fixed bicycle frame",
        "The rear wheel rim"
      ],
      "correctIndex": 0,
      "hint": "Compare the moving link with the parts that swing back and forth.",
      "explanation": "Slide 10 explains the bicycle example and identifies the thighs as rockers."
    },
    {
      "id": "cyclesportb-02",
      "topic": "cycle-mechanisms",
      "learningSlide": 11,
      "prompt": "What makes a hinged four-bar linkage a double-crank mechanism?",
      "choices": [
        "One link is a rocker",
        "Both moving links are cranks",
        "Neither link rotates completely",
        "All links are fixed"
      ],
      "correctIndex": 1,
      "hint": "Look at how many links can rotate as cranks.",
      "explanation": "Slide 11 defines the double-crank as a four-bar linkage with two cranks."
    },
    {
      "id": "cyclesportb-03",
      "topic": "cycle-transmission",
      "learningSlide": 12,
      "prompt": "What does a belt drive use to pass rotational movement from one pulley to another?",
      "choices": [
        "A chain of rigid teeth",
        "A sliding metal rack",
        "A tensioned flexible belt",
        "A magnetic wheel clutch"
      ],
      "correctIndex": 2,
      "hint": "Think about a flexible connector between two rotating pulleys.",
      "explanation": "Slide 12 defines belt drive as using a tensioned flexible belt to transmit motion or power."
    },
    {
      "id": "cyclesportb-04",
      "topic": "cycle-transmission",
      "learningSlide": 14,
      "prompt": "What connects the pulley to the rear wheel bushing in the lesson's bicycle model?",
      "choices": [
        "A toothed gear rack",
        "A steel chain",
        "A threaded shaft",
        "A rubber band"
      ],
      "correctIndex": 3,
      "hint": "The model uses a simple friction transmission.",
      "explanation": "Slide 14 specifically directs students to use a rubber band between pulley and rear-wheel bushing."
    },
    {
      "id": "cyclesportb-05",
      "topic": "cycle-wheel-control",
      "learningSlide": 14,
      "prompt": "Which component controls the bicycle robot's front-wheel steering?",
      "choices": [
        "A medium-sized motor",
        "The rear wheel bushing",
        "The belt's rubber band",
        "A fixed stand"
      ],
      "correctIndex": 0,
      "hint": "Separate the steering mechanism from the wheel's driving mechanism.",
      "explanation": "Slide 14 says a medium-sized motor drives front-wheel steering."
    },
    {
      "id": "cyclesportb-06",
      "topic": "cycle-wheel-control",
      "learningSlide": 2,
      "prompt": "Which combination does the lesson intend for moving and steering the bicycle robot?",
      "choices": [
        "Belt drive for turning and speaker for movement",
        "Belt drive for movement and medium motor for turning",
        "Ultrasonic sensor for movement and belt for braking",
        "Display controller for movement and brake pad for steering"
      ],
      "correctIndex": 1,
      "hint": "The learning objectives distinguish propulsion from direction changes.",
      "explanation": "Slide 2 assigns belt-drive propulsion and a medium motor to turning."
    },
    {
      "id": "cyclesportb-07",
      "topic": "cycle-dead-center",
      "learningSlide": 19,
      "prompt": "Why can a crank stall at the dead-center position?",
      "choices": [
        "The belt is always too loose to move",
        "The motor always reverses direction at this point",
        "The applied force is aligned with its axis and produces no turning force",
        "The wheels permanently lose traction"
      ],
      "correctIndex": 2,
      "hint": "Consider whether the force produces a turning effect around the pivot.",
      "explanation": "Slide 19 defines dead center as a position where force acts along the crank axis and cannot turn it."
    },
    {
      "id": "cyclesportb-08",
      "topic": "cycle-dead-center",
      "learningSlide": 20,
      "prompt": "Which change is listed to help a mechanism pass dead center smoothly?",
      "choices": [
        "Remove the crank's pivot",
        "Lock both cranks in place",
        "Disconnect the driven link",
        "Install a flywheel on the crankshaft"
      ],
      "correctIndex": 3,
      "hint": "Look for a method that helps motion continue through a difficult crank position.",
      "explanation": "Slide 20 lists a flywheel on the crankshaft as one solution, alongside offsetting mechanism groups."
    },
    {
      "id": "cyclesportb-09",
      "topic": "cycle-testing",
      "learningSlide": 15,
      "prompt": "What should students check after programming the rear wheel to rotate?",
      "choices": [
        "Whether the robot's riding posture is smooth",
        "Whether the display plays music",
        "Whether the wheel changes color",
        "Whether the robot changes its battery type"
      ],
      "correctIndex": 0,
      "hint": "The task asks for an observation about the riding motion.",
      "explanation": "Slide 15 asks learners to observe whether the riding posture is smooth."
    },
    {
      "id": "cyclesportb-10",
      "topic": "cycle-testing",
      "learningSlide": 22,
      "prompt": "What is a proposed balance improvement during bicycle robot optimization?",
      "choices": [
        "Remove the rear-wheel support",
        "Use the controller as a trailer to help maintain balance",
        "Place both wheels on one side",
        "Make the crank mechanism fixed"
      ],
      "correctIndex": 1,
      "hint": "The optimization discussion considers the role of an existing heavy component.",
      "explanation": "Slide 22 asks whether the controller can act as a trailer to maintain balance."
    }
  ]
};

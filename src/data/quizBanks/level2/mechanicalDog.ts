/** Verified against public/Level 2/Learning/Characters & Structures/Mechanical dog/Mechanical dog_PowerPoint-R.pdf (22 pages); slide numbers are 1-based. */
import type { QuizBank } from "../../quizStudio";
export const mechanicalDogBank: QuizBank = {
  "projectId": "level-2-mechanical-dog",
  "title": "Mechanical dog",
  "sourcePdfPath": "public/Level 2/Learning/Characters & Structures/Mechanical dog/Mechanical dog_PowerPoint-R.pdf",
  "sourcePageCount": 22,
  "questions": [
    {
      "id": "md01",
      "topic": "bionic-design",
      "learningSlide": 6,
      "prompt": "Which animal feature does the Mechanical Dog model imitate?",
      "choices": [
        "A pair of wings",
        "A fish tail",
        "A spinning propeller",
        "A four-legged body"
      ],
      "correctIndex": 3,
      "explanation": "The lesson describes a four-legged bionic animal robot.",
      "hint": "Think about the animal that inspired the robot."
    },
    {
      "id": "md02",
      "topic": "bionic-design",
      "learningSlide": 6,
      "prompt": "Which group of body parts matches the Mechanical Dog described in the lesson?",
      "choices": [
        "Four legs, a head, and a body",
        "Two wheels and a handlebar",
        "Two wings and a beak",
        "One propeller and a mast"
      ],
      "correctIndex": 0,
      "explanation": "Slide 6 identifies four legs, a head, and a body.",
      "hint": "Picture the complete animal-shaped model."
    },
    {
      "id": "md03",
      "topic": "robot-safety",
      "learningSlide": 9,
      "prompt": "According to the lesson's first robot law, what must a robot avoid?",
      "choices": [
        "Carrying a battery",
        "Harming people",
        "Moving its legs",
        "Using a controller"
      ],
      "correctIndex": 1,
      "explanation": "The lesson's first fictional robotics law prioritizes avoiding harm to humans.",
      "hint": "Which choice is about human safety?"
    },
    {
      "id": "md04",
      "topic": "robot-safety",
      "learningSlide": 9,
      "prompt": "A command would cause a robot to injure a person. Which law takes priority in the lesson?",
      "choices": [
        "The third law",
        "No law applies",
        "The first law",
        "The second law"
      ],
      "correctIndex": 2,
      "explanation": "The second law's obedience requirement is limited by the first law's safety requirement.",
      "hint": "Remember how the lesson orders its three laws."
    },
    {
      "id": "md05",
      "topic": "obedience",
      "learningSlide": 9,
      "prompt": "Under the lesson's second robot law, when should the robot obey a person's order?",
      "choices": [
        "Even if the order harms a person",
        "Only when it has no battery",
        "Only after it stops walking",
        "When it does not conflict with the first law"
      ],
      "correctIndex": 3,
      "explanation": "The second law makes obedience conditional on the first law.",
      "hint": "Which higher-priority rule limits obedience?"
    },
    {
      "id": "md06",
      "topic": "obedience",
      "learningSlide": 9,
      "prompt": "If an instruction is safe for people, which lesson law addresses following it?",
      "choices": [
        "The second law",
        "The first law only",
        "The third law only",
        "The law of gravity"
      ],
      "correctIndex": 0,
      "explanation": "The second law concerns obeying human commands when compatible with the first.",
      "hint": "Think about the law dealing with instructions."
    },
    {
      "id": "md07",
      "topic": "self-protection",
      "learningSlide": 9,
      "prompt": "What limits a robot's self-protection under the third law in the lesson?",
      "choices": [
        "It must avoid using motors",
        "It cannot violate the first two laws",
        "It must stop people from working",
        "It must ignore every command"
      ],
      "correctIndex": 1,
      "explanation": "The third fictional law protects the robot only while respecting the first two.",
      "hint": "The lesson gives human safety higher priority."
    },
    {
      "id": "md08",
      "topic": "self-protection",
      "learningSlide": 9,
      "prompt": "If protecting itself would endanger a person, what follows from the lesson's law order?",
      "choices": [
        "The robot must ignore the first law",
        "Its leg count decides",
        "Human safety takes priority",
        "Self-protection always comes first"
      ],
      "correctIndex": 2,
      "explanation": "The third law cannot override the first law.",
      "hint": "Compare the first and third laws."
    },
    {
      "id": "md09",
      "topic": "assembly",
      "learningSlide": 18,
      "prompt": "Which is an explicit Mechanical Dog assembly requirement?",
      "choices": [
        "A deliberately loose frame",
        "An uneven center of mass",
        "A mismatched model shape",
        "A stable structure"
      ],
      "correctIndex": 3,
      "explanation": "Slide 18 lists stability as an assembly requirement.",
      "hint": "Think about a robot that can stand without collapsing."
    },
    {
      "id": "md10",
      "topic": "assembly",
      "learningSlide": 20,
      "prompt": "What improvement does the lesson ask students to consider after building the Mechanical Dog?",
      "choices": [
        "How to make its four feet active",
        "How to remove all four legs",
        "How to add a boat sail",
        "How to make the head into a wheel"
      ],
      "correctIndex": 0,
      "explanation": "The review asks whether all four feet can move and how to improve that.",
      "hint": "Look at the question about the dog's feet."
    }
  ]
};

/** Phase 3 source-text question draft; PDF illustrations and teaching quality need review. */
import type { QuizBank } from "../quizStudio";
export const pocketPistolBank: QuizBank = {
  "projectId": "pocket-pistol",
  "title": "Pocket Pistol",
  "sourcePdfPath": "public/Pocket Pistol.pdf",
  "sourcePageCount": 14,
  "questions": [
    {
      "id": "pocket-pistol-01",
      "topic": "hazard-awareness",
      "prompt": "Which safety topic is a teaching objective of this lesson?",
      "choices": [
        "Water safety for swimming",
        "Electric bicycle charging",
        "Sun exposure",
        "Dangers of weapons"
      ],
      "correctIndex": 3,
      "learningSlide": 3,
      "explanation": "The teaching objectives include knowing the dangers of weapons.",
      "hint": "Recall the risk-awareness topic listed with the lesson's science objectives."
    },
    {
      "id": "pocket-pistol-02",
      "topic": "hazard-awareness",
      "prompt": "Which attitude best reflects the lesson's danger-awareness objective?",
      "choices": [
        "Treat projectile devices as potentially hazardous",
        "Assume all weapons are harmless",
        "Ignore the risk of injuries",
        "Encourage aiming at people"
      ],
      "correctIndex": 0,
      "learningSlide": 3,
      "explanation": "Recognizing weapons' danger includes awareness of possible injuries.",
      "hint": "Think about how classroom models involving stretched objects should be handled safely."
    },
    {
      "id": "pocket-pistol-03",
      "topic": "story",
      "prompt": "What large animal causes trouble in the fictional Wanchuang Forest story?",
      "choices": [
        "Crab",
        "Dinosaur",
        "Owl",
        "Penguin"
      ],
      "correctIndex": 1,
      "learningSlide": 4,
      "explanation": "The story begins with a dinosaur destroying plants in the forest.",
      "hint": "Remember the large animal that appears in the opening forest story."
    },
    {
      "id": "pocket-pistol-04",
      "topic": "story",
      "prompt": "Why are the smaller forest animals upset with the dinosaur?",
      "choices": [
        "It brings them food",
        "It offers them a ride",
        "It destroys flowers and trees",
        "It repairs their homes"
      ],
      "correctIndex": 2,
      "learningSlide": 4,
      "explanation": "The story describes the dinosaur damaging flowers and trees and ignoring objections.",
      "hint": "Consider what happened to the trees and plants before the animals complained."
    },
    {
      "id": "pocket-pistol-05",
      "topic": "forces",
      "prompt": "Which pair of physics concepts is explicitly taught?",
      "choices": [
        "Magnetism and electricity",
        "Reflection and refraction",
        "Buoyancy and pressure",
        "Tension and elasticity"
      ],
      "correctIndex": 3,
      "learningSlide": 3,
      "explanation": "The objectives name the physical ideas of tension and elasticity.",
      "hint": "Recall the two physical properties studied when an elastic material is stretched.",
      "image": {
        "src": "/quiz-visuals/level1/pocket-pistol.svg",
        "alt": "Stretched elastic band held between two fixed supports, without any weapon."
      }
    },
    {
      "id": "pocket-pistol-06",
      "topic": "forces",
      "prompt": "What material is used to discuss tension and elasticity?",
      "choices": [
        "Rubber band",
        "Wooden block",
        "Glass panel",
        "Copper plate"
      ],
      "correctIndex": 0,
      "learningSlide": 4,
      "explanation": "The topic-analysis section specifically discusses rubber-band tension and elasticity.",
      "hint": "Think about the flexible material discussed during the explanation of stored force.",
      "image": {
        "src": "/quiz-visuals/level1/pocket-pistol.svg",
        "alt": "Stretched elastic band held between two fixed supports, without any weapon."
      }
    },
    {
      "id": "pocket-pistol-07",
      "topic": "elastic-materials",
      "prompt": "What general type of physical structure is named in the hands-on lesson?",
      "choices": [
        "Wind-powered structure",
        "Elastic structure",
        "Hydraulic structure",
        "Optical structure"
      ],
      "correctIndex": 1,
      "learningSlide": 5,
      "explanation": "The teacher is asked to explain an elastic structure during hands-on learning.",
      "hint": "Review how a stretched material behaves when tension is changed or released."
    },
    {
      "id": "pocket-pistol-08",
      "topic": "elastic-materials",
      "prompt": "Which property of the rubber band is revisited in the outcome discussion?",
      "choices": [
        "Magnetism",
        "Light emission",
        "Elasticity",
        "Electrical conductivity"
      ],
      "correctIndex": 2,
      "learningSlide": 5,
      "explanation": "The assessment refers to elasticity and tension of a rubber band.",
      "hint": "Recall the property the teacher discusses in the final science review."
    },
    {
      "id": "pocket-pistol-09",
      "topic": "design-reflection",
      "prompt": "What is part of the lesson's design-planning activity?",
      "choices": [
        "Practicing with live firearms",
        "Increasing projectile range",
        "Choosing real-world targets",
        "Deciding the model's overall shape and parts"
      ],
      "correctIndex": 3,
      "learningSlide": 4,
      "explanation": "The topic analysis asks students to design the model shape and identify parts.",
      "hint": "Think about the planning stage of a classroom model before parts are assembled."
    },
    {
      "id": "pocket-pistol-10",
      "topic": "design-reflection",
      "prompt": "Which set of topics best describes the stated learning objectives?",
      "choices": [
        "Elasticity, tension and weapon danger",
        "Computer networks, motors and light sensors",
        "Ocean currents, sails and water pumps",
        "Bird migration, feathers and habitats"
      ],
      "correctIndex": 0,
      "learningSlide": 3,
      "explanation": "The manual combines tension/elasticity concepts with awareness of weapon danger.",
      "hint": "Remember the two physics topics and the separate safety objective of this lesson."
    }
  ]
};

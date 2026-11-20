/**
 * Beginner quiz based on verified text extracted from official Pocket Pistol.pdf,
 * pages 3–5 (PDF page numbers start at 1). The manual primarily contains
 * construction diagrams after page 5; no weapon-operation quiz is included.
 * The project remains a Construction Manual in Learning Studio, not a separate lecture.
 * Original visual diagrams and browser QA still require independent verification.
 */
import type { QuizBank } from "../../quizStudio";

export const pocketPistolBank: QuizBank = {
  "projectId": "pocket-pistol",
  "title": "Pocket Pistol — Safety & Elasticity",
  "sourcePdfPath": "public/Pocket Pistol.pdf",
  "sourcePageCount": 14,
  "questions": [
    {
      "id": "pocket-pistol-01",
      "topic": "weapon-hazards",
      "prompt": "Why does the Pocket Pistol lesson say students should learn about the dangers of weapons?",
      "choices": [
        "Weapons are always made of metal",
        "Weapons can seriously hurt people",
        "Weapons are only dangerous outdoors",
        "Weapons can only cause damage when noisy"
      ],
      "correctIndex": 1,
      "learningSlide": 3,
      "explanation": "The manual explicitly names understanding weapon dangers as a learning objective. Real weapons can cause serious injuries.",
      "hint": "Consider why people need to be careful around objects that can cause injuries."
    },
    {
      "id": "pocket-pistol-02",
      "topic": "weapon-hazards",
      "prompt": "If you find an object that might be a real gun, what is the safest response?",
      "choices": [
        "Pick it up to check whether it is real",
        "Take it home so nobody else finds it",
        "Ask a friend to examine it closely",
        "Leave it alone, move away, and tell a trusted adult"
      ],
      "correctIndex": 3,
      "learningSlide": 3,
      "explanation": "Do not handle a suspected firearm. Moving away and informing a trusted adult is the safer response to the danger the lesson asks students to recognize.",
      "hint": "Think about how to protect yourself without taking responsibility for an unknown object."
    },
    {
      "id": "pocket-pistol-03",
      "topic": "peaceful-problem-solving",
      "prompt": "In the lesson's story, a dinosaur damages plants and the animals become angry. What is a safer response than making a weapon?",
      "choices": [
        "Confront the dinosaur alone",
        "Collect objects to throw at the dinosaur",
        "Keep a safe distance and seek help to solve the problem",
        "Start a fight with the dinosaur"
      ],
      "correctIndex": 2,
      "learningSlide": 4,
      "explanation": "The story asks students how to respond to the dinosaur's destruction. A peaceful response that keeps everyone safe fits the lesson's stated objective of recognizing weapon dangers.",
      "hint": "Think about what the animals are trying to protect and how they can avoid getting hurt."
    },
    {
      "id": "pocket-pistol-04",
      "topic": "peaceful-problem-solving",
      "prompt": "When people disagree, which choice best follows the safety lesson rather than the animals' idea of using a weapon?",
      "choices": [
        "Talk through the problem or ask a responsible adult for help",
        "Threaten someone until they agree",
        "Choose a stronger weapon",
        "Try to scare the other person with a weapon"
      ],
      "correctIndex": 0,
      "learningSlide": 4,
      "explanation": "The manual pairs the dinosaur conflict story with a lesson about the danger of weapons. Talking and seeking help are safer alternatives to threats or violence.",
      "hint": "Think about ways people can settle disagreements without creating a risk of injury."
    },
    {
      "id": "pocket-pistol-05",
      "topic": "elasticity",
      "prompt": "Which material does the Pocket Pistol lesson specifically use when discussing elasticity?",
      "choices": [
        "Metal axle",
        "Rigid plastic beam",
        "Electrical cable",
        "Rubber band"
      ],
      "correctIndex": 3,
      "learningSlide": 4,
      "explanation": "The topic-analysis text explicitly asks students to discuss the elasticity of a rubber band.",
      "hint": "The topic-analysis section names a flexible material whose shape can change."
    },
    {
      "id": "pocket-pistol-06",
      "topic": "elasticity",
      "prompt": "What does elasticity mean for an ordinary rubber band stretched gently within its normal range?",
      "choices": [
        "It becomes permanently longer every time",
        "It tends to return toward its original shape when released",
        "It turns into a rigid material",
        "It loses all ability to change shape"
      ],
      "correctIndex": 1,
      "learningSlide": 3,
      "explanation": "Elasticity is a material's tendency to recover its previous shape after a force is removed. The lesson identifies elasticity as a key physics concept.",
      "hint": "Think about what makes a material elastic rather than permanently changed."
    },
    {
      "id": "pocket-pistol-07",
      "topic": "tension",
      "prompt": "Which type of force is called tension in a stretched band?",
      "choices": [
        "A pulling force along the band",
        "A pushing force squeezing the band shorter",
        "A magnetic attraction from nearby metal",
        "A force caused only by air resistance"
      ],
      "correctIndex": 0,
      "learningSlide": 3,
      "explanation": "Tension is a pulling force transmitted through a taut material. The manual lists tension as a core lesson concept.",
      "hint": "Compare a material being pulled with one being squeezed."
    },
    {
      "id": "pocket-pistol-08",
      "topic": "tension",
      "prompt": "How are tension and elasticity different?",
      "choices": [
        "Tension describes colour; elasticity describes weight",
        "Tension describes heat; elasticity describes sound",
        "Tension is a pulling force; elasticity is the ability to recover shape",
        "Tension and elasticity both mean the material is rigid"
      ],
      "correctIndex": 2,
      "learningSlide": 4,
      "explanation": "Tension refers to a pulling force. Elasticity describes how a material such as a rubber band returns toward its former shape after stretching.",
      "hint": "One term names a force, while the other describes how a material responds after deformation."
    },
    {
      "id": "pocket-pistol-09",
      "topic": "safe-inquiry",
      "prompt": "Why does the Pocket Pistol teaching plan say students work under a teacher's guidance?",
      "choices": [
        "To skip safety discussions",
        "To learn the science while recognizing and avoiding hazards",
        "To compete over who can take more risks",
        "To handle dangerous equipment without rules"
      ],
      "correctIndex": 1,
      "learningSlide": 3,
      "explanation": "The teaching objectives explicitly describe work under a teacher's guidance and include recognizing the danger of weapons.",
      "hint": "Think about why supervision matters during a classroom activity involving potentially dangerous ideas."
    },
    {
      "id": "pocket-pistol-10",
      "topic": "safe-inquiry",
      "prompt": "Which question lets students explore the lesson's elasticity concept without investigating weapon operation?",
      "choices": [
        "How far can the model send an object?",
        "Which design makes an object launch fastest?",
        "How should a launcher be aimed for distance?",
        "Does an elastic material return toward its original shape after a gentle stretch?"
      ],
      "correctIndex": 3,
      "learningSlide": 5,
      "explanation": "The lesson focuses on elasticity as well as weapon dangers. Observing how a classroom-safe elastic material changes and recovers its shape assesses that concept without testing a weapon.",
      "hint": "Choose an observation about the material itself rather than what a weapon can do."
    }
  ]
};

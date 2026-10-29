/** Verified against the Level 3 official Learning PDF. */
import type { QuizBank } from "../../quizStudio";

export const bloodBankCentrifugeBank: QuizBank = {
  "projectId": "level-3-blood-bank-centrifuge",
  "title": "Blood Bank Centrifuge",
  "sourcePdfPath": "public/Level 3/Learning/Manipulators/Blood bank Centrifuge.pdf",
  "sourcePageCount": 28,
  "questions": [
    {
      "id": "bloodbankcen-01",
      "topic": "blood-components",
      "learningSlide": 4,
      "prompt": "Which group contains components that blood banks may separate?",
      "choices": [
        "Only water and air",
        "Only oxygen and carbon dioxide",
        "Only blood vessel walls",
        "Plasma, red cells, white cells and platelets"
      ],
      "correctIndex": 3,
      "hint": "The lesson lists multiple parts found in a blood sample.",
      "explanation": "Slide 4 names red cells, white cells, plasma and platelets among blood components."
    },
    {
      "id": "bloodbankcen-02",
      "topic": "blood-components",
      "learningSlide": 5,
      "prompt": "Why can blood components be separated by spinning a sample?",
      "choices": [
        "Their sedimentation rates differ",
        "Every component has identical motion",
        "Spinning turns all components into gas",
        "Spinning removes the need for a container"
      ],
      "correctIndex": 0,
      "hint": "Think about how different components settle differently.",
      "explanation": "Slide 5 says blood components sediment at different rates and centrifugation accelerates separation."
    },
    {
      "id": "bloodbankcen-03",
      "topic": "centrifugation",
      "learningSlide": 5,
      "prompt": "What does a centrifuge do to speed up separation?",
      "choices": [
        "Keep the sample completely motionless",
        "Spin the sample at high speed",
        "Vibrate only the display screen",
        "Move the sample sideways by hand"
      ],
      "correctIndex": 1,
      "hint": "The equipment uses continuous rotation.",
      "explanation": "Slide 5 describes high-speed spinning to accelerate sedimentation."
    },
    {
      "id": "bloodbankcen-04",
      "topic": "centrifugation",
      "learningSlide": 6,
      "prompt": "Which familiar appliance is compared with centrifugal effects in the lesson?",
      "choices": [
        "A microwave oven",
        "An electric kettle",
        "A washing machine",
        "A refrigerator compressor"
      ],
      "correctIndex": 2,
      "hint": "The example uses rotating motion to move material.",
      "explanation": "Slide 6 compares centrifuge rotation to the behavior of a washing machine."
    },
    {
      "id": "bloodbankcen-05",
      "topic": "gear-acceleration",
      "learningSlide": 7,
      "prompt": "If a large gear drives a smaller gear, how does the smaller gear rotate?",
      "choices": [
        "Slower than the large gear",
        "At exactly the same speed",
        "It cannot rotate at all",
        "Faster than the large gear"
      ],
      "correctIndex": 3,
      "hint": "Compare how many times the smaller gear must turn to match tooth movement.",
      "explanation": "Slide 7 explains acceleration when a large gear drives a small gear."
    },
    {
      "id": "bloodbankcen-06",
      "topic": "gear-acceleration",
      "learningSlide": 8,
      "prompt": "What is a first-stage gear acceleration in this lesson?",
      "choices": [
        "One large driving gear meshing with one smaller gear",
        "Two gears locked so neither turns",
        "Two equal gears always on separate shafts",
        "A belt with no pulleys"
      ],
      "correctIndex": 0,
      "hint": "The lesson names a basic large-to-small pair.",
      "explanation": "Slide 8 calls the large-driving-small gear arrangement first-stage acceleration."
    },
    {
      "id": "bloodbankcen-07",
      "topic": "two-stage-gears",
      "learningSlide": 27,
      "prompt": "How many large and small gears are generally required for the lesson's second-stage acceleration?",
      "choices": [
        "One large and no small",
        "Two large and two small",
        "Three large and one small",
        "Four equal-size gears only"
      ],
      "correctIndex": 1,
      "hint": "Think about adding another accelerating gear stage.",
      "explanation": "Slide 27 identifies two large and two small gears for two-stage acceleration."
    },
    {
      "id": "bloodbankcen-08",
      "topic": "two-stage-gears",
      "learningSlide": 27,
      "prompt": "Which direction must each acceleration gear pair transmit power?",
      "choices": [
        "From the smaller gear to the larger gear",
        "Between gears that never touch",
        "From the larger gear to the smaller gear",
        "Only through stationary gears"
      ],
      "correctIndex": 2,
      "hint": "Each stage should increase the driven gear's rotational speed.",
      "explanation": "Slide 27 specifies the large gear driving the small gear."
    },
    {
      "id": "bloodbankcen-09",
      "topic": "motor-control",
      "learningSlide": 25,
      "prompt": "Which range is allowed for motor power commands in the lesson?",
      "choices": [
        "0 to 4095",
        "100 to 1000",
        "−500 to 500",
        "−100 to 100"
      ],
      "correctIndex": 3,
      "hint": "The signed command range is limited.",
      "explanation": "Slide 25 says the programmed motor values must lie between -100 and 100."
    },
    {
      "id": "bloodbankcen-10",
      "topic": "motor-control",
      "learningSlide": 25,
      "prompt": "What do the positive and negative signs in the motor command control?",
      "choices": [
        "Motor rotation direction",
        "How many blood cells are present",
        "The color of the housing",
        "How much light a probe receives"
      ],
      "correctIndex": 0,
      "hint": "The command can reverse the motor.",
      "explanation": "Slide 25 prompts learners to understand positive and negative motor values."
    }
  ]
};

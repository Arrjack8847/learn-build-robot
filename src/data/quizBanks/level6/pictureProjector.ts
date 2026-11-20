import type { QuizBank } from "../../quizStudio";
/** Source-grounded Level 6 quiz; original 25-page Learning PDF. */
export const pictureProjectorBank: QuizBank = {
  "projectId": "level-6-picture-projector",
  "title": "Picture Projector",
  "sourcePdfPath": "public/Level 6/Learning/Action-Oriented/Picture Projector/28. Picture Projector-Teaching Slides.pdf",
  "sourcePageCount": 25,
  "questions": [
    {
      "id": "pic-01",
      "topic": "frames",
      "learningSlide": 6,
      "prompt": "What minimum frame rate is introduced for making animation look continuous?",
      "choices": [
        "24 images per second",
        "One image per minute",
        "Two images per hour",
        "240 images per millisecond"
      ],
      "correctIndex": 0,
      "hint": "Film displays many still pictures quickly.",
      "explanation": "Slide 6 describes animation at 24 frames per second."
    },
    {
      "id": "pic-02",
      "topic": "frames",
      "learningSlide": 10,
      "prompt": "What is one frame in a movie or animation?",
      "choices": [
        "A button on a motor",
        "A single still image",
        "A stored password",
        "An infrared sensor value"
      ],
      "correctIndex": 1,
      "hint": "Continuous projection combines individual still pictures.",
      "explanation": "Slide 10 defines a frame as a still picture."
    },
    {
      "id": "pic-03",
      "topic": "infrared-remote",
      "learningSlide": 12,
      "prompt": "How does the model's remote tell the projector to change pictures?",
      "choices": [
        "By measuring humidity",
        "By pushing the picture physically",
        "By sending an infrared signal",
        "By reading a road marking"
      ],
      "correctIndex": 2,
      "hint": "The smart eye transmits the command.",
      "explanation": "Slide 12 uses infrared remote-control signals."
    },
    {
      "id": "pic-04",
      "topic": "infrared-remote",
      "learningSlide": 14,
      "prompt": "What does the remote send when its touch sensor is pressed?",
      "choices": [
        "A new QR payment card",
        "A motor temperature reading",
        "A random weather forecast",
        "A corresponding infrared command"
      ],
      "correctIndex": 3,
      "hint": "The remote turns button input into a signal.",
      "explanation": "Slide 14 sends an infrared signal on touch input."
    },
    {
      "id": "pic-05",
      "topic": "signal-mapping",
      "learningSlide": 18,
      "prompt": "What does infrared signal 1 mean?",
      "choices": [
        "Advance to the next image",
        "Move to the previous image",
        "Turn off the motor forever",
        "Clear all saved pictures"
      ],
      "correctIndex": 0,
      "hint": "A higher sequence number means forward playback.",
      "explanation": "Slide 18 increments the picture index on signal 1."
    },
    {
      "id": "pic-06",
      "topic": "signal-mapping",
      "learningSlide": 18,
      "prompt": "What does infrared signal 2 mean?",
      "choices": [
        "Advance to the next image",
        "Go to the previous image",
        "Duplicate every photo",
        "Open a combination lock"
      ],
      "correctIndex": 1,
      "hint": "The second signal reverses the sequence.",
      "explanation": "Slide 18 decrements the picture index on signal 2."
    },
    {
      "id": "pic-07",
      "topic": "image-index",
      "learningSlide": 16,
      "prompt": "Where are the projected picture file names stored?",
      "choices": [
        "Only in the motor angle",
        "Only as temperature values",
        "In a list",
        "In a distance sensor"
      ],
      "correctIndex": 2,
      "hint": "The program looks up a picture by list position.",
      "explanation": "Slide 16 saves image file names in a list."
    },
    {
      "id": "pic-08",
      "topic": "image-index",
      "learningSlide": 19,
      "prompt": "Why must the image number be limited during playback?",
      "choices": [
        "The projector can display only one colour",
        "Every image is always number zero",
        "Infrared signals cannot contain numbers",
        "It must stay within the list's valid indices"
      ],
      "correctIndex": 3,
      "hint": "Going below zero or beyond the list causes invalid lookup.",
      "explanation": "Slide 19 limits indices to valid list positions."
    },
    {
      "id": "pic-09",
      "topic": "optimization",
      "learningSlide": 23,
      "prompt": "What new content is requested in the projector optimization task?",
      "choices": [
        "Add one or two additional pictures",
        "Use only a single fixed picture",
        "Remove the remote sensors",
        "Change to a rain gauge"
      ],
      "correctIndex": 0,
      "hint": "The same controls should work with extra images.",
      "explanation": "Slide 23 requests one or two more pictures."
    },
    {
      "id": "pic-10",
      "topic": "optimization",
      "learningSlide": 23,
      "prompt": "What original feature must still work after adding pictures?",
      "choices": [
        "Only a permanent screen blank",
        "Forward and reverse button-controlled playback",
        "A temperature alarm",
        "A motorized delivery belt"
      ],
      "correctIndex": 1,
      "hint": "The expansion retains normal infrared navigation.",
      "explanation": "Slide 23 requires the same switching function for new pictures."
    }
  ]
};

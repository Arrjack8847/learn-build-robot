import type { QuizBank } from "../../quizStudio";
/** Source-grounded Level 6 quiz; original 36-page Learning PDF. */
export const productSearchBank: QuizBank = {
  "projectId": "level-6-product-search",
  "title": "Product Search",
  "sourcePdfPath": "public/Level 6/Learning/Mechanisms & Simulators/Product Search/15.Product Search -Slides.pdf",
  "sourcePageCount": 36,
  "questions": [
    {
      "id": "prs-01",
      "topic": "scanner-model",
      "learningSlide": 6,
      "prompt": "Which product does the red block represent in the scanner project?",
      "choices": [
        "Chocolate",
        "Potato chips",
        "A bank card",
        "A QR-code gate"
      ],
      "correctIndex": 0,
      "hint": "Two colours stand for two products.",
      "explanation": "Slide 6 maps red to chocolate and green to potato chips."
    },
    {
      "id": "prs-02",
      "topic": "scanner-model",
      "learningSlide": 6,
      "prompt": "What happens when the scanner switch is pressed?",
      "choices": [
        "The machine starts a road-following routine",
        "The product is identified and its information queried",
        "All product names are deleted",
        "The screen must remain blank"
      ],
      "correctIndex": 1,
      "hint": "The switch begins the lookup.",
      "explanation": "Slide 6 says a press triggers identification, lookup and a buzzer."
    },
    {
      "id": "prs-03",
      "topic": "lists",
      "learningSlide": 21,
      "prompt": "Why use a list instead of many individual variables?",
      "choices": [
        "A list can hold only one value",
        "A list is a type of motor",
        "A list holds several related data items",
        "Lists can only store colours"
      ],
      "correctIndex": 2,
      "hint": "Lists group multiple values.",
      "explanation": "Slide 21 compares lists to cabinets with many storage slots."
    },
    {
      "id": "prs-04",
      "topic": "lists",
      "learningSlide": 28,
      "prompt": "Which three lists store the products' information?",
      "choices": [
        "Speed, Direction and Pressure",
        "Humidity, Rain and Wind",
        "Red, Yellow and Green Lights",
        "Product Number, Product Name and Product Price"
      ],
      "correctIndex": 3,
      "hint": "A product record contains identity and cost.",
      "explanation": "Slide 28 creates number, name and price lists."
    },
    {
      "id": "prs-05",
      "topic": "indexing",
      "learningSlide": 24,
      "prompt": "In what order do values appear when added to a list?",
      "choices": [
        "In the sequence they were added",
        "Always alphabetically",
        "Always from highest price to lowest",
        "Only in reverse order"
      ],
      "correctIndex": 0,
      "hint": "Insertion order determines item positions.",
      "explanation": "Slide 24 stores items in their addition order."
    },
    {
      "id": "prs-06",
      "topic": "indexing",
      "learningSlide": 25,
      "prompt": "What is the purpose of the item-of-list block?",
      "choices": [
        "Measure how many motors are connected",
        "Retrieve data at a specified list position",
        "Change the PDF's title",
        "Turn on a temperature sensor"
      ],
      "correctIndex": 1,
      "hint": "Lookups specify a list and an item number.",
      "explanation": "Slide 25 reads a selected list item."
    },
    {
      "id": "prs-07",
      "topic": "query-flow",
      "learningSlide": 27,
      "prompt": "What should the screen display after recognizing a product?",
      "choices": [
        "Only the battery status",
        "Only a random colour value",
        "Its number, name and price",
        "Only the current time"
      ],
      "correctIndex": 2,
      "hint": "The model provides useful product details.",
      "explanation": "Slide 27 displays product number, name and price."
    },
    {
      "id": "prs-08",
      "topic": "query-flow",
      "learningSlide": 30,
      "prompt": "What sound behaviour follows a successful product lookup?",
      "choices": [
        "The speaker must always be muted",
        "An alarm sounds only on a rainy day",
        "The motor produces a long countdown",
        "The buzzer sounds"
      ],
      "correctIndex": 3,
      "hint": "The scanner gives an audible confirmation.",
      "explanation": "Slide 30 plays the buzzer after retrieving product information."
    },
    {
      "id": "prs-09",
      "topic": "extension",
      "learningSlide": 31,
      "prompt": "What is the goal of the product-search expansion?",
      "choices": [
        "Make more products searchable",
        "Delete the three lists",
        "Replace product names with motor angles",
        "Disable the touch sensor"
      ],
      "correctIndex": 0,
      "hint": "The catalogue is meant to grow.",
      "explanation": "Slide 31 asks for more searchable products."
    },
    {
      "id": "prs-10",
      "topic": "extension",
      "learningSlide": 32,
      "prompt": "Why must the program avoid a list item that does not exist?",
      "choices": [
        "It automatically creates a new product",
        "An invalid index causes an error",
        "It changes the sensor's physical size",
        "It makes every price zero"
      ],
      "correctIndex": 1,
      "hint": "Lookups must stay inside the saved list.",
      "explanation": "Slide 32 warns that missing list items cause errors."
    }
  ]
};

# RoboPath Academy

Build a polished, responsive frontend-only web application for teaching robotics. Use “RoboLearn” as a temporary name and keep the name easy to replace later.

This is a student learning application with two main learning categories:

Theory

Robot Practical

Important scope rules:

Build the student-facing frontend only.

Do not build a trainer or admin portal.

Do not add authentication, registration or class codes.

Do not connect Supabase, Firebase or any database.

Do not use real APIs or AI services.

Do not create backend functions.

Use realistic mock data throughout the application.

Simulate AI quiz generation and practical grading entirely in the frontend.

All students will eventually see the same learning content.

Keep the code ready for real data and AI integration later.

Technology:

React

TypeScript

Vite

Tailwind CSS

shadcn/ui

Lucide icons

React Router

Use localStorage only to preserve demo progress between refreshes.

Visual direction:

Create a modern educational interface with a subtle robotics-lab feeling. It should feel professional, motivating and easy for students to understand—not childish and not overly futuristic.

Use:

Warm white or very light grey background

Deep navy navigation

Electric blue as the primary accent

Lime green only for progress, success and completion

Clear typography such as Inter or Geist

Large readable cards

Subtle circuit-grid or technical-line details

Soft shadows and medium-rounded corners

Smooth but restrained animations

Excellent desktop, tablet and mobile layouts

A desktop sidebar and a compact mobile bottom navigation

Strong accessibility, keyboard focus states and touch-friendly controls

Avoid:

Purple gradients

Excessive glassmorphism

Marketing-style hero sections

Crowded dashboards

Cartoon robot illustrations

Unnecessary charts or decorative elements

Create these frontend routes:

/ — Student dashboard

/theory — Theory catalogue

/theory/:id — Theory lesson

/practical — Robot practical catalogue

/practical/:id — Practical project workspace

/progress — Student progress

Global navigation:

Home

Theory

Robot Practical

Progress

Do not show Trainer, Admin, Classes, Messages or Settings links.

STUDENT DASHBOARD

The dashboard should immediately show useful learning information instead of a large promotional hero.

Include:

Friendly greeting such as “Good morning, Alex”

Short message: “Ready to continue building?”

Overall course progress

Number of completed theory lessons

Number of completed practical projects

Average quiz score

A prominent “Continue learning” card

Two main category cards:

Theory

Robot Practical

Recent AI feedback or recent results

Clearly show that the content is currently demonstration content

The Theory category card should communicate:

“Understand the ideas behind robotics, electronics, sensors and programming.”

The Robot Practical category card should communicate:

“Follow guided steps to assemble, test and understand robot projects.”

THEORY CATALOGUE

Use realistic fake theory modules:

Introduction to Robotics

Safety in the Robotics Lab

Basic Electronic Components

Sensors and Actuators

Motors and Movement

Programming Fundamentals

Each theory card should show:

Module icon

Module number

Title

Short description

Estimated duration

Difficulty

Number of lessons

Progress

Status: Not Started, In Progress or Completed

Start or Continue button

THEORY LESSON PAGE

Create a focused reading experience containing:

Breadcrumb navigation

Lesson title and progress

Learning objectives

Short realistic placeholder lesson content

Important concept callout

Simple example

Previous and next lesson controls

Mark lesson as completed button

“Generate AI Quiz” button

The lesson layout should be easy to read and should not feel like a blog article. Include a compact lesson contents panel on desktop and a collapsible version on mobile.

SIMULATED AI QUIZ

When the student selects “Generate AI Quiz”:

Show a short generation/loading animation.

Display five mock questions based on the current lesson.

Include multiple-choice, true/false and one short-answer question.

Allow the student to move between questions.

Show the current question number and quiz progress.

Prevent submission until required questions are answered.

After submission, display:

Total score

Correct and incorrect answers

Explanation for each answer

Strengths

Concepts to review

Retry quiz button

Return to lesson button

Multiple-choice scoring should be calculated using normal frontend logic. Short-answer feedback can use a predefined simulated AI response.

ROBOT PRACTICAL CATALOGUE

Use generic fake projects because the real robot platform has not been confirmed:

Your First Moving Robot

Sensor Reaction Robot

Obstacle Detection Robot

Autonomous Navigation Challenge

Each practical project card should show:

Project number

Project title

Short description

Difficulty

Estimated build time

Number of building steps

Progress

Status

Start or Continue button

Do not include platform-specific Arduino, LEGO, micro:bit or ESP32 wiring details. Keep all technical instructions clearly marked as demonstration content.

PRACTICAL PROJECT WORKSPACE

Include:

Project title and objective

Difficulty and estimated time

Required placeholder components

Safety note

Related theory modules

Numbered step-by-step building instructions

Previous and next step navigation

Checklist for each completed step

A visual progress indicator

A “Need help?” troubleshooting panel

A final submission section

Create approximately six mock construction steps. Each step should include:

Step number

Instruction title

Short description

Important warning or tip when relevant

Completion checkbox

The student should be able to complete steps individually and return later using localStorage.

PRACTICAL SUBMISSION AND SIMULATED AI GRADING

At the end of the project, create a frontend-only submission area where the student can:

Choose a photo or video from their device

Preview the selected file locally

Write a short explanation of how the robot works

Select “Grade My Project”

Do not upload the file anywhere.

After selecting “Grade My Project”:

Show a simulated AI analysis state.

Display a mock grade out of 100.

Show scores for:

Assembly completion: 30 points

Components and connections: 25 points

Functionality: 25 points

Student explanation: 20 points

Show:

What was done well

Possible issues

Suggested improvements

Recommended theory to review

Include “Try Again” and “View Progress” buttons.

Clearly structure the code so this simulated grading can later be replaced by a real multimodal AI API.

PROGRESS PAGE

Include:

Overall learning progress

Theory completion percentage

Practical completion percentage

Average quiz result

Average practical grade

Completed theory modules

Completed practical projects

Recent quiz attempts

Recent AI grading results

Continue-learning recommendations

Do not add leaderboards, classroom comparisons, social features or certificates yet.

MOCK DATA AND STATE

Place all mock content in clean, separate data files. Create reusable TypeScript types for:

TheoryModule

TheoryLesson

PracticalProject

PracticalStep

QuizQuestion

QuizAttempt

PracticalGrade

StudentProgress

Use a simple React context or similarly clean frontend state system. Save only demo progress, completed steps and quiz results in localStorage.

QUALITY REQUIREMENTS

Every navigation item and button must work.

Do not leave dead buttons.

Include useful empty, loading, completion and error states.

Use semantic HTML and accessible labels.

Ensure good contrast.

Make the interface fully responsive.

Keep components reusable and well organized.

Do not place the entire application in one oversized component.

Do not add functionality outside this specification.

Populate the application with enough mock content to make every screen feel complete and testable.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/16df507d-6ee3-492d-a859-5f0c3527e1a1).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

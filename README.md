# HireMind – AI-Powered Interview Preparation Platform

**Practice smarter. Interview better. Get hired.**

HireMind is an AI-powered interview preparation platform designed to help students, fresh graduates, and job seekers prepare for technical and HR interviews through mock interviews, personalized feedback, resume analysis, coding practice, and progress tracking.

## Problem Statement

Students and job seekers often struggle to prepare effectively for interviews because they may not have access to affordable mock interviews, personalized feedback, or a structured way to identify and improve their weaknesses. Generic interview questions and subjective feedback can make preparation less effective.

## Proposed Solution

HireMind aims to provide an integrated platform where users can practise interviews, review their performance, analyse resumes, and strengthen their coding and communication skills.

## Key Features

- **Mock Interviews:** Configure interview practice according to role, experience level, interview type, and difficulty.
- **Adaptive Questioning:** Adjust subsequent questions based on previous answers, where supported by the implemented interview logic.
- **Answer Evaluation:** Provide structured feedback across multiple evaluation dimensions.
- **Resume Analysis:** Analyse resume content and identify relevant skills and potential areas for improvement.
- **Coding Practice:** Practise programming problems to improve problem-solving skills.
- **Progress Tracking:** Review interview reports and performance history where data is available.
- **Voice Practice:** Support voice-based interaction where implemented.

*Feature availability may depend on the current implementation and whether an external AI provider is configured.*

## Technology Stack

- **Frontend:** Next.js, React, TypeScript
- **Backend:** Next.js server routes/API handlers
- **Database Access:** Prisma ORM
- **AI Integration:** Configurable AI provider integration, with demo/fallback behaviour where implemented
- **Development Tools:** Visual Studio Code, Git, GitHub

## Getting Started

### Prerequisites

Install the following before running the project:

- Node.js compatible with the project's Next.js version
- npm
- Git (optional, for cloning the repository)

### Installation

Clone the repository:

```bash
git clone https://github.com/Prav-een11/HireMind.git
cd HireMind
```

Install dependencies:

```bash
npm install
```

Configure the required environment variables in a local `.env` file according to the project's environment-variable configuration. **Do not commit API keys, passwords, or other secrets to GitHub.**

If the project requires database setup, follow the Prisma schema and the project's existing database configuration before starting the application.

### Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Use the scripts defined in `package.json` for any additional setup, testing, or production build commands.

## Project Status

HireMind is under active development as a student mini project. Some features may be available in demo mode, while external AI integration, document parsing, coding execution, or other functionality may require further implementation and testing.

## Future Improvements

- Improve resume text extraction and document handling.
- Enhance the quality and relevance of interview questions.
- Expand coding practice with realistic interview-style problems.
- Validate AI-generated feedback against human evaluations.
- Improve reliability, accessibility, testing, and performance.

## Repository

[GitHub – HireMind](https://github.com/Prav-een11/HireMind)

---

**Note:** This README describes the intended project and its development direction. Verify each feature and setup step against the current code before presenting it as fully implemented.

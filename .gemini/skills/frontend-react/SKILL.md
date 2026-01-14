---
name: stayeasy-frontend
description: Develops the Web User Interface for StayEasy. Use when the user requests UI components, pages (Dashboard, Calendar), forms, or client-side logic using React and TypeScript.
compatibility: Requires Node.js 20+.
metadata:
  role: Frontend Developer
  stack: React, TypeScript, Vite, TailwindCSS
---

# Frontend Developer Instructions

You are the **Frontend Lead** for "StayEasy" (Esteban). Your goal is to build a responsive and type-safe UI for hotel receptionists.

## 1. Principles & Rules

- **Type Mirroring:** Your TypeScript interfaces in `src/types` MUST match the Backend DTOs exactly.
- **Atomic Design:** Build small, reusable components (Buttons, Cards, Inputs).
- **UX First:** Operations like Check-in must be efficient (< 3 clicks).
- **Mocking:** If the backend is not ready, use Mock Service Worker (MSW) or dummy data to continue development.

## 2. Tech Stack

- **Core:** React 18, TypeScript, Vite.
- **Styling:** TailwindCSS.
- **State:** React Hooks (`useState`, `useEffect`).
- **Testing:** Jest, React Testing Library.

## 3. Workflow

When asked to build a view:

1.  **Define Types:** Create the `interface` for the data.
2.  **Test Component:** Write a test that checks if the component renders.
3.  **Implement:** Build the component using Tailwind classes.
4.  **Integrate:** Connect it to a mock service or real API.

## 4. References

For the list of required views and components, consult the plan:
[Frontend Implementation Plan](references/02_frontend_web_ui.md)
[Original document](references/StayEasyDoc.pdf)

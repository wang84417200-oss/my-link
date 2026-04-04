# GEMINI Project Context: my-link

This project, `my-link`, is a monorepo-style workspace currently containing a personal profile application built with Next.js.

## Project Overview

The primary application is located in the `my-profile/` directory. It is a modern web application leveraging the latest web technologies for a fast, responsive, and type-safe development experience.

### Core Technologies
- **Framework:** [Next.js 16.2](https://nextjs.org/) (using the App Router)
- **Library:** [React 19](https://react.dev/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Linting:** [ESLint 9](https://eslint.org/)

## Building and Running

All application-specific commands should be executed from within the `my-profile/` directory.

### Commands

| Task | Command | Description |
| :--- | :--- | :--- |
| **Development** | `npm run dev` | Starts the Next.js development server with Turbopack. |
| **Build** | `npm run build` | Creates an optimized production build. |
| **Start** | `npm run start` | Runs the compiled production application. |
| **Lint** | `npm run lint` | Runs ESLint to check for code quality and style issues. |

## Development Conventions

- **App Router:** The project uses the Next.js App Router (`my-profile/app/`). New pages and layouts should be added here following the Next.js file-based routing conventions.
- **TypeScript:** Strict type checking is enabled. Ensure all new components and functions are properly typed.
- **Path Aliases:** The project uses the `@/*` alias to refer to the `my-profile/` root, as configured in `tsconfig.json`.
- **Styling:** Tailwind CSS 4 is used for styling. Utility classes should be used directly in components.
- **Components:** Functional components with React Hooks are preferred.

## Key Directories (within `my-profile/`)

- `app/`: Contains the application routes, layouts, and global styles.
- `public/`: Static assets such as images and SVGs.
- `.next/`: Build output and cache (auto-generated).

## Instructions for Gemini CLI

- When asked to modify the application, focus on the `my-profile/` directory.
- Always verify changes by running `npm run lint` within the `my-profile/` directory.
- If adding new dependencies, use `npm install` within the `my-profile/` directory.

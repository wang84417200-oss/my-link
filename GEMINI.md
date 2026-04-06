# MyLink Project Guide

This file serves as a guide for `Gemini CLI` to understand the project structure, technical stack, UI/UX design, and development conventions.

## 1. Project Overview
`MyLink` is a multi-link profile service that helps creators and individuals consolidate various links into a single page for effective personal branding. For detailed product requirements, refer to `@docs/PRD.md`.

- **Core Tech Stack** (See `@package.json` for details):
  - **Framework**: Next.js 16.1.7 (App Router, Turbopack)
  - **Library**: React 19.0.0
  - **Language**: TypeScript
  - **Styling**: Tailwind CSS 4.2.1, shadcn/ui
  - **Backend**: Firebase (Authentication, Firestore) - *Planned*
  - **Icons**: Remix Icon (@remixicon/react)

## 2. Key Features & UI/UX Design
### 2.1 Core Features (Based on `@docs/PRD.md`)
- **Authentication**: Google Social Login via Firebase Auth.
- **Profile Management**: Inline editing of `displayName` (URL slug), `username` (real name), and bio.
- **Link Management**: Create, edit (inline), and delete links with automatic favicon integration via Google API.
- **Analytics**: Display cumulative click counts for individual links.

### 2.2 UI/UX Design Principles (Based on `@docs/Wireframe.md`)
- **Layout**: All screens (Public and Dashboard) are optimized for mobile with a `max-w-md` (approx. 448px) width constraint, centered on the screen (`mx-auto`).
- **Inline Editing**: Use pencil icons next to text areas to trigger immediate editing without page navigation.
- **Components**: Leverage `shadcn/ui` (e.g., `@components/ui/button.tsx`).

## 3. Development & Build Commands
- `npm run dev`: Run local development server with Turbopack.
- `npm run build`: Create production build.
- `npm run start`: Start production server.
- `npm run lint`: Lint code using ESLint (`@eslint.config.mjs`).
- `npm run format`: Format code using Prettier (`@.prettierrc`).
- `npm run typecheck`: Run TypeScript type checks (`@tsconfig.json`).

## 4. Development Conventions
- **Project Structure**:
  - `@app/`: Next.js App Router pages and layouts.
  - `@components/`: UI and business logic components.
  - `@lib/`: Utility functions (`@lib/utils.ts`) and configurations.
  - `@hooks/`: Custom React Hooks.
  - `@public/`: Static assets.
- **Styling**: Based on Tailwind CSS 4. Use the `cn` utility from `@lib/utils.ts` for class merging. Global styles are in `@app/globals.css`.
- **Icons**: Prefer icons from `@remixicon/react`.
- **Firebase Design**: User documents must include `username` and `displayName`. Links are managed as a sub-collection under the user document.

## 5. Special Notes
- Profile image uploads are not supported; the Google account avatar is used by default.
- Changing `displayName` updates the public URL slug, so duplication checks are critical.
- Refer to `@docs/UserScenario.md` for detailed user scenarios.

## 6. Language & Documentation Policy
- **공통 지침**: 모든 대화, 구현 계획(Implementation Plan), 태스크(Task), 워크스루(Walkthrough) 및 문서는 반드시 **한국어**로 작성합니다.
- **코드**: 변수명, 함수명, 주석 등 코드 내 요소는 영어를 기본으로 하되, 필요에 따라 한국어 주석을 병행할 수 있습니다.
- **커밋 메시지**: 상세하게 한국어로 작성합니다.

# Decisions

## Backend

**Python + FastAPI**
Chosen for fast development, automatic API docs, and strong typing with Pydantic. Fits the local-first model well.

**SQLite**
No server setup required. Keeps all user data local by default. Will use Alembic for migrations.

---

## Frontend

**React + TypeScript + Vite**
Vite for fast dev server and build. TypeScript for type safety across a growing codebase.

**ESLint over Oxlint**
Better ecosystem support for React and TypeScript. More mature plugin system.

**Tailwind CSS**
Utility-first keeps styling co-located with components. Faster to build consistent UI.

**shadcn/ui**
Unstyled-by-default components that fit into our own design system without fighting defaults.

---

## Architecture

**Local-first**
All user data (interviews, answers, progress, recordings) stays on the machine. External AI providers are opt-in and clearly separated.

**Provider abstraction for AI**
The app does not depend on one AI provider. Abstracted behind a common interface so providers can be swapped.
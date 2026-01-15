# 🏗️ Project Structure & Architecture

This document explains the folder structure and architectural decisions of this project.
By clearly separating routing, server logic, and UI responsibilities, the codebase stays organized, easy to read, and easier to maintain or extend.

## 🗂️ High-Level Structure

```bash
app/
├── app.css           # Global styles (Tailwind CSS)
├── constants/        # Domain constants (e.g. paths, status labels)
├── features/         # Feature-specific UI logic (components, custom hooks)
├── root.tsx          # App entry point
├── routes/           # Route files (includes loader/action logic)
├── routes.ts         # Path definitions for navigation
├── schemas/          # Zod validation schemas
├── server/           # Mock server-side logic
├── setup-tests.ts    # Test setup (e.g. import testing utilities)
├── types/            # Shared TypeScript type definitions
└── utils/            # Utility functions (e.g. date formatter, route labels)
```

Each directory has a **single responsibility**, which makes the code easier to understand and work with.

## 🧭 Routes (`app/routes`)

```bash
routes/
├── index.tsx
├── todos.tsx              # Layout for /todos/*
├── todos._index.tsx       # Todo list page
├── todos.new.tsx          # Create todo page
├── todos.$id.tsx          # Todo detail page
├── todos.test.tsx
├── todos._index.test.tsx
├── todos.new.test.tsx
└── todos.$id.test.tsx
```

### 🧪 Route Tests

Each major route has a corresponding test file:

```bash
routes/
├── todos.test.tsx              # Tests loader and UI for TodoLayout
├── todos._index.test.tsx       # Tests loader and UI for the todo list
├── todos.new.test.tsx          # Tests form submission, action logic, and UI
├── todos.$id.test.tsx          # Tests loader, update/delete actions, and UI
```

- Route tests cover:
  - `loader` behavior (success and error scenarios)
  - `action` responses (redirects and errors)
  - UI rendering based on fetched or mutated data

- Testing is done using **Vitest** + **React Testing Library**

💡 By testing routes in isolation, each route’s logic can be verified independently without relying on the entire app.

#### 🧪 Why Test Routes?

Testing `loader` and `action` functions helps ensure:

- SSR hydration behaves as expected
- Form submissions work correctly
- UI displays correctly based on the data

### ✍️ Design Principles

- Each route functions as an **HTTP handler**
- `loader` and `action` handle:
  - Data fetching
  - Mutations
  - Redirects
  - Error handling

- UI logic inside route components is kept minimal

💡 This follows a **Remix-like “server-first” routing model**.

## 🧠 Server Logic (`app/server`)

```bash
server/
└── todos/
    ├── create-task.ts              # Create new task
    ├── update-task.ts              # Update task
    ├── delete-task-by-id.ts        # Delete task
    ├── get-task-by-id.ts           # Get task detail
    ├── get-task-list.ts            # Get task list
    ├── create-task.test.ts         # Unit tests for each server function
    ├── update-task.test.ts
    ├── delete-task-by-id.test.ts
    ├── get-task-by-id.test.ts
```

- Each file defines **mock server logic** that simulates API behavior.
- These functions are called from route `loader` / `action` to handle data.
- Unit tests are implemented per function to ensure reliability.

### ✍️ Design Principles

- Business logic is **separated from route components**
- Each function:
  - Has a single, clear responsibility
  - Is easy to unit test

🧪 Routes call server functions instead of embedding logic directly, which keeps route files clean and testable.

## 🎯 Features (`app/features`)

```bash
features/
└── todos/
    ├── components/
    │   └── todo-form.tsx        # Shared form component for both creating and editing tasks
    └── hooks/
        ├── use-new-todo.ts       # Logic for the new task page (form control and submission)
        ├── use-todo-detail.ts    # Logic for the detail page (form control, delete/update handling)
        └── use-todos-index.ts    # Logic for the list page (data rendering and sorting)
```

### 🎨 Purpose

- **Separate and encapsulate UI logic by feature**
- Custom hooks manage:
  - Form state
  - Submission logic
  - UI state (loading, success, errors)

This prevents route components from becoming too complex and improves reusability.

## 🧰 Utilities (`app/utils`)

```bash
utils/
├── format-date.ts           # Formats date strings
├── format-date.test.ts      # Unit test for date formatting
├── task-status.ts           # Utility for task status labels and colors
├── task-status.test.ts
├── route-labels.ts          # Returns screen titles based on route paths
├── route-labels.test.ts     # Unit test for route-label logic
├── test-router-args.ts      # Helper for testing loader/action logic
```

- Contains pure utility functions used across the app
- Includes UI-focused helpers such as mapping paths to header titles
- All utility functions are unit tested for reliability

## 🔠 Validation & Types

### Schemas (`app/schemas`)

```bash
schemas/
└── task.ts
```

- Defines type-safe validation using **Zod**

### Types (`app/types`)

```bash
types/
└── tasks.ts
```

- `app/types` defines **application-specific domain types** related to business logic, such as the `Task` type.
- These shared domain types are used across both server and client code, ensuring a consistent data model and improving maintainability.

## 🧱 UI Components (Storybook)

```bash
stories/
├── button/
│ ├── index.tsx              # Main UI component
│ ├── index.stories.tsx      # Storybook stories for visual testing
│ ├── constants.ts           # Variants, colors, and size definitions
│ ├── types.ts               # Component prop types
│ └── logics.ts              # Internal UI behaviors (e.g., click handling)
├── modal/
│ ├── index.tsx              # Modal component
│ └── index.stories.tsx      # Storybook stories for the modal
├── input/                    # Text input component
├── select/                   # Select / dropdown component
├── textarea/                 # Multiline text input component
├── toast/                    # Toast / notification UI
├── loading/                  # Loading indicators (spinner, skeleton, etc.)
├── status-label/             # Status or badge-style labels
└── suspense/                 # Fallback UI for Suspense boundaries
```

### 🎨 Design Principles

- Purely presentational UI components (no business logic)
- Organized by role, inspired by Atomic Design principles
- Built entirely with Tailwind CSS, without using external UI libraries (e.g., Mantine, MUI)
- Developed and tested in isolation with Storybook

## ✅ Key Design Decisions

- **Server logic first**
  Business logic is placed in server modules instead of UI components.

- **Slim routes**
  Routes focus solely on HTTP concerns.

- **Feature-based UI structure**
  UI logic is grouped by feature/domain rather than by technical layer.

- **Type safety and testing**
  TypeScript + unit tests help maintain quality and prevent regressions.

## 🤔 Why This Structure?

This structure is designed so that even as the app grows, the code won’t become difficult to understand or maintain.
It also encourages **clear separation of concerns and easier extensibility**.
Even for a small app, it helps follow real-world best practices and provides a solid foundation for future growth.

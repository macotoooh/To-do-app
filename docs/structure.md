# 🏗️ Project Structure & Architecture

This document explains the folder structure and architectural decisions of this project.
By clearly separating routing, server logic, and UI responsibilities, the codebase stays organized, easy to read, and easier to maintain or extend.

## 🗂️ High-Level Structure

```
app/
├── routes/        # Routing, loaders, actions (HTTP layer)
├── server/        # Server-side business logic
├── features/      # Feature-specific UI logic and hooks
├── utils/         # Shared utility functions
├── schemas/       # Validation schemas (Zod)
├── types/         # Shared TypeScript type definitions
├── constants/     # Domain constants
└── root.tsx       # App entry point
```

Each directory has a **single responsibility**, which makes the code easier to understand and work with.

## 🧭 Routes (`app/routes`)

```
routes/
├── index.tsx
├── todos.tsx              # Layout for /todos/*
├── todos._index.tsx       # Todo list page
├── todos.new.tsx          # Create todo page
├── todos.$id.tsx          # Todo detail page
├── todos.test.ts
├── todos._index.test.ts
├── todos.new.test.ts
└── todos.$id.test.ts
```

### 🧪 Route Tests

Each major route has a corresponding test file:

```
routes/
├── todos.test.ts              # Tests loader and UI for TodoLayout
├── todos._index.test.ts       # Tests loader and UI for the todo list
├── todos.new.test.ts          # Tests form submission, action logic, and UI
├── todos.$id.test.ts          # Tests loader, update/delete actions, and UI
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

```
server/
└── todos/
    ├── create-task.ts
    ├── update-task.ts
    ├── delete-task-by-id.ts
    ├── get-task-by-id.ts
    ├── get-task-list.ts
    └── *.test.ts
```

### ✍️ Design Principles

- Business logic is **separated from route components**
- Each function:
  - Has a single, clear responsibility
  - Is easy to unit test

🧪 Routes call server functions instead of embedding logic directly, which keeps route files clean and testable.

## 🎯 Features (`app/features`)

```
features/
└── todos/
    ├── components/
    │   └── todo-form.tsx         // Reusable form component for both create and edit
    └── hooks/
        ├── use-new-todo.ts       // Logic for new todo page (form handling, submission)
        ├── use-todo-detail.ts    // Logic for detail page (delete, update handling)
        └── use-todos-index.ts    // Logic for index page (data rendering, sorting)

```

### 🎨 Purpose

- Encapsulate **feature-specific UI logic**
- Custom hooks such as `useTodoDetail` and `useTodosIndex` handle:
  - Form state
  - Submission logic
  - UI state (loading, success, errors)

This prevents route components from becoming too complex and improves reusability.

## 🧰 Utilities (`app/utils`)

```
utils/
├── format-date.ts           // Formats date strings
├── format-date.test.ts      // Unit test for date formatting
├── task-status.ts           // Utility for task status labels and colors
├── task-status.test.ts
├── route-labels.ts          // Returns screen titles based on route paths
├── route-labels.test.ts     // Unit test for route-label logic
├── test-router-args.ts      // Helper for testing loader/action logic
```

- Contains pure utility functions used across the app
- Includes UI-focused helpers such as mapping paths to header titles
- All utility functions are unit tested for reliability

## 🔠 Validation & Types

### Schemas (`app/schemas`)

```
schemas/
└── task.ts
```

- Defines type-safe validation using **Zod**

### Types (`app/types`)

```
types/
└── tasks.ts
```

- Shared domain types used across server and UI code

## 🧱 UI Components (Storybook)

```
stories/
├── button
├── input
├── select
├── textarea
├── modal
├── toast
├── loading
├── status-label
└── suspense
```

### 🎨 Design Principles

- UI components dedicated to rendering and visuals
- Do not include business logic (data processing or domain rules)
- Can be developed and tested individually in **Storybook**

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

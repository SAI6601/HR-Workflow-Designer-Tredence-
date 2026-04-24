# HR Workflow Designer Module

A fully functional prototype of an **HR Workflow Designer** built with React, TypeScript, React Flow, and Tailwind CSS. Design, visualize, and simulate HR workflows with an intuitive drag-and-drop canvas.

![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white)

---

## ✨ Features

### Core Canvas
- **Drag-and-drop** node placement from sidebar onto canvas
- **Connect nodes** with animated smooth-step edges
- **Select, edit, and delete** nodes and edges
- **Auto-validation** with visual error indicators on nodes
- **MiniMap** and **zoom controls** for navigation
- **Snap-to-grid** for clean layouts

### Node Types
| Node | Purpose | Color |
|------|---------|-------|
| **Start** | Workflow entry point | 🟢 Emerald |
| **Task** | Human tasks (e.g., collect documents) | 🔵 Blue |
| **Approval** | Manager/HR approval steps | 🟡 Amber |
| **Automated Step** | System-triggered actions | 🟣 Violet |
| **End** | Workflow completion | 🔴 Rose |

### Node Configuration
- Dynamic form panel on the right when a node is selected
- Type-specific fields (title, assignee, due date, approver role, etc.)
- Key-value metadata/custom field editors
- Automated step: fetches actions from mock API with dynamic parameters

### Simulation / Testing
- Serialize the entire workflow graph
- Validate structure (cycles, orphans, missing connections)
- Mock `/simulate` API with step-by-step execution
- Animated timeline showing each step's status

### Bonus Features
- ✅ **Export/Import** workflow as JSON
- ✅ **Undo/Redo** (Ctrl+Z / Ctrl+Shift+Z)
- ✅ **MiniMap** with color-coded nodes
- ✅ **Visual validation** errors on nodes (red/amber badges)

---

## 🏗️ Architecture

```
src/
├── api/                    # Mock API layer (getAutomations, simulateWorkflow)
│   └── mockApi.ts
├── components/
│   ├── canvas/             # React Flow canvas wrapper
│   │   └── WorkflowCanvas.tsx
│   ├── nodes/              # Custom React Flow node components
│   │   ├── BaseNode.tsx    # Shared node wrapper
│   │   ├── StartNode.tsx
│   │   ├── TaskNode.tsx
│   │   ├── ApprovalNode.tsx
│   │   ├── AutomatedStepNode.tsx
│   │   ├── EndNode.tsx
│   │   └── nodeTypes.ts    # Node type registry
│   └── panels/
│       ├── NodePalette.tsx         # Left sidebar (draggable nodes + toolbar)
│       ├── NodeFormPanel.tsx       # Right sidebar (dynamic config forms)
│       ├── SimulationPanel.tsx     # Modal for workflow testing
│       └── forms/                  # Per-node-type form components
│           ├── StartNodeForm.tsx
│           ├── TaskNodeForm.tsx
│           ├── ApprovalNodeForm.tsx
│           ├── AutomatedStepForm.tsx
│           └── EndNodeForm.tsx
├── hooks/
│   ├── useWorkflowStore.tsx  # Central state (React Context)
│   └── useAutomations.ts     # Fetch mock automations
├── types/
│   └── workflow.ts           # All TypeScript types/interfaces
├── utils/
│   ├── validation.ts         # Graph validation (cycles, constraints)
│   └── serialization.ts      # Export/import JSON
├── App.tsx                   # Root layout
├── main.tsx                  # Entry point
└── index.css                 # Full design system
```

### Design Decisions

1. **React Context for state** — Chosen over Redux/Zustand for simplicity. A single `WorkflowProvider` manages nodes, edges, history, and validation. Suitable for this prototype's scope.

2. **Discriminated unions** — Every node data type carries a `type` discriminant field (`'start' | 'task' | 'approval' | 'automated' | 'end'`). This enables exhaustive type narrowing in forms and validation.

3. **Mock API as async functions** — Instead of JSON Server or MSW, the mock API uses simple `async` functions with `setTimeout` to simulate latency. This keeps the setup zero-dependency.

4. **CSS over Tailwind utility classes** — While Tailwind is included, the styling uses semantic CSS classes for maintainability and component-level encapsulation. Tailwind's `@import` provides the reset and base styles.

5. **Node types defined outside components** — React Flow requires `nodeTypes` to be stable across renders. The registry is defined in a separate file to prevent infinite re-renders.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm

### Install & Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Usage

1. **Drag nodes** from the left sidebar onto the canvas
2. **Connect nodes** by dragging from a source handle to a target handle
3. **Click a node** to open its configuration form on the right
4. **Edit properties** in the form panel (title, assignee, actions, etc.)
5. **Validate** using the "Validate" button in the toolbar
6. **Simulate** using the "Simulate" button to test the workflow
7. **Export/Import** workflows as JSON files
8. **Undo/Redo** with Ctrl+Z / Ctrl+Shift+Z

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 19.x | UI framework |
| TypeScript | 5.x | Type safety |
| Vite | 8.x | Build tool & dev server |
| React Flow | 12.x (`@xyflow/react`) | Workflow canvas |
| Tailwind CSS | 4.x | Base styles & utilities |

---

## 📝 Assumptions

- No backend persistence — all data lives in memory
- No authentication or authorization required
- Mock API uses `setTimeout` to simulate network latency
- Targets modern browsers (Chrome, Firefox, Edge)
- Single-user editing (no real-time collaboration)

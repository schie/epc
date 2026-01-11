# EPC Examples

A lightweight React + Vite shell for trying `@schie/epc` in the browser. Today it serves as a simple landing page with links to the API docs and repository. Expand it with EPC encoding demos as the library grows.

## Prerequisites

- Node.js 20+
- Root repo dependencies installed (`npm install` at the project root)

## Getting Started

From the repository root:

```bash
npm run examples:install   # installs ./examples deps
npm run examples:dev       # starts Vite on http://localhost:5173
```

You can also run the scripts directly inside `examples/` with `npm install && npm run dev`.

### Available Scripts

| Command           | Description                                           |
| ----------------- | ----------------------------------------------------- |
| `npm run dev`     | Start the Vite dev server with hot reloading          |
| `npm run build`   | Type-check (`tsc -b`) and produce a production bundle |
| `npm run preview` | Serve the production build locally                    |
| `npm run lint`    | Run the example app’s ESLint config                   |

## Project Tour

- `examples/src/App.tsx` – top-level layout and links.
- `examples/src/main.tsx` – entry point for the Vite app.

## Creating a New Example

1. Add a new React component under `examples/src`.
2. Import EPC helpers from `@schie/epc` and render the output you want to showcase.
3. Update `examples/src/App.tsx` to include the new component.
4. Restart `npm run dev` (or let Vite hot reload) and verify the output.

## Troubleshooting

- If the page is blank, check the dev console for runtime errors.
- If API calls fail, confirm you are running `npm run examples:install` at least once.

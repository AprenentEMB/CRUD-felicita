# Felicita — Frontend

React + TypeScript single-page application for the Felicita birthday reminder app.

## Tech

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) with SWC compiler
- Plain CSS (no UI library)

## Features

- Register and login with JWT authentication, session persisted via `localStorage`
- Add, view, and delete birthday entries
- Upcoming birthday labels: Today, This Week, Closest, Next Month
- Multilingual UI: Catalan (`ca`), Spanish (`es`), English (`en`)
- Language preference synced to the user account on the backend

## Project Structure

```
src/
├── App.tsx       # Main component — all state, logic, and UI
├── App.css       # Component styles
├── index.css     # Global styles
└── main.tsx      # React entry point
```

## Setup

```bash
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:3000
```

```bash
npm run dev      # development server (http://localhost:5173)
npm run build    # production build
npm run preview  # preview production build
npm run lint     # ESLint
```

## API Connection

All requests go through a single `apiRequest()` helper in `App.tsx` that:
- Automatically attaches the JWT token as `Authorization: Bearer <token>`
- Points to `VITE_API_URL` (falls back to `http://localhost:3000`)

The backend repo is in `../../back-end/`.

## License

[MIT](../../LICENSE)

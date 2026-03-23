# Felicita — Birthday Reminder App

A full-stack birthday reminder application with user authentication, multilingual support, and a clean single-page interface.

**Stack:** Node.js · Express · MongoDB · React · TypeScript · Vite

---

## Features

- User registration and login with JWT authentication
- Add, view, and delete birthday entries
- Upcoming birthday labels (Today, This Week, Closest)
- Multilingual UI: Catalan, Spanish, and English
- Language preference synced to user account
- Session persistence via localStorage

---

## Project Structure

```
CRUD/
├── back-end/          # Express REST API
│   ├── index.js
│   ├── middlewares/
│   │   └── auth.js
│   ├── models/
│   │   ├── user.js
│   │   └── birthdays.js
│   └── routes/
│       ├── auth.js
│       └── birthdays.js
│
└── front-end/
    └── felicita/      # React + TypeScript SPA
        └── src/
            ├── App.tsx
            └── main.tsx
```

---

## Backend

### Tech

- [Express.js](https://expressjs.com/) — HTTP server
- [MongoDB](https://www.mongodb.com/) + [Mongoose](https://mongoosejs.com/) — database and ODM
- [JWT](https://jwt.io/) — stateless authentication
- [bcryptjs](https://github.com/dcodeIO/bcrypt.js) — password hashing

### API Endpoints

| Method | Path | Auth Required | Description |
|--------|------|:---:|-------------|
| GET | `/` | — | Health check |
| POST | `/api/auth/register` | — | Register a new user |
| POST | `/api/auth/login` | — | Login and receive JWT |
| GET | `/api/auth/me` | Yes | Get current user |
| PATCH | `/api/auth/me/language` | Yes | Update language preference |
| POST | `/api/birthdays` | Yes | Create a birthday entry |
| GET | `/api/birthdays` | Yes | List all user birthdays |
| DELETE | `/api/birthdays/:id` | Yes | Delete a birthday entry |

Authentication is passed via the `Authorization: Bearer <token>` header or `x-auth-token`.

### Models

**User**
- `username` — String, unique, required
- `email` — String, unique, required
- `password` — String, hashed with bcrypt, required
- `language` — Enum `"ca" | "es" | "en"`, default `"ca"`

**Birthday**
- `name` — String, required
- `date` — Date, required
- `notes` — String, optional
- `userId` — Reference to User, required
- `createdAt` / `updatedAt` — auto-generated timestamps

### Setup

```bash
cd back-end
npm install
```

Create a `.env` file:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

```bash
npm run dev    # development (nodemon)
npm start      # production
```

---

## Frontend

### Tech

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) with SWC compiler
- CSS for styling (no external UI library)

### Features

The entire app lives in a single `App.tsx` component and communicates with the backend via a lightweight `apiRequest()` helper that automatically attaches the JWT token.

- Auth flow: togglable register / login forms
- Birthday form: name, date, and optional notes
- Birthday list: sorted by upcoming date, with proximity labels
- Header: language selector + logout button
- All state persisted across page refreshes via `localStorage`

### Internationalization

Supports three languages switchable at runtime:

| Code | Language |
|------|----------|
| `ca` | Catalan |
| `es` | Spanish |
| `en` | English |

Translation keys are defined inline in `App.tsx` and the active language is synced to the user's account on the backend.

### Setup

```bash
cd front-end/felicita
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:3000
```

```bash
npm run dev      # development server
npm run build    # production build
npm run preview  # preview production build
```

---

## Running Locally

1. Start the backend (port 3000 by default)
2. Start the frontend dev server (Vite defaults to port 5173)
3. Open [http://localhost:5173](http://localhost:5173)

---

## License

[MIT](./LICENSE)
# CRUD-felicita

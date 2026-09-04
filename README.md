# QuestApp Frontend

React single-page application for **QuestApp** — a social feed where users register, log in, create posts, like posts, and leave comments.

| Document | Language |
|----------|----------|
| [README.md](./README.md) | English |
| [README_TR.md](./README_TR.md) | Türkçe |
| [README_DE.md](./README_DE.md) | Deutsch |
| [architecture-uml.md](./architecture-uml.md) | Architecture & UML |

## Features

- User registration and login (JWT stored in `localStorage`)
- Home feed with all posts
- Create posts (authenticated)
- Like / unlike posts
- Expandable comments and add-comment form
- User profile with post, comment, and like counts

## Tech stack

| Technology | Version / notes |
|------------|-----------------|
| React | 19 |
| Create React App | `react-scripts` 5 |
| React Router | 7 |
| Material UI | 7 (`@mui/material`, `@mui/icons-material`) |
| HTTP | Native `fetch` (relative URLs) |
| Backend proxy | `http://localhost:8080` |

## Prerequisites

- Node.js 18+ and npm
- QuestApp backend running on **port 8080** (Spring Boot API)

## Getting started

```bash
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000). API calls are proxied to `http://localhost:8080` via the `proxy` field in `package.json`.

### Other scripts

| Command | Description |
|---------|-------------|
| `npm start` | Development server |
| `npm test` | Jest / Testing Library |
| `npm run build` | Production build → `build/` |
| `npm run eject` | Eject CRA config (irreversible) |

## Project structure

```
src/
├── App.js                 # Router, auth gate for /auth
├── index.js               # Entry point
└── components/
    ├── Auth/Auth.js       # Register & login
    ├── Home/Home.js       # Feed + PostForm
    ├── Navbar/Navbar.js   # Navigation & logout
    ├── Post/Post.js       # Post card, likes, comments
    ├── Post/PostForm.js   # Create post
    ├── Comment/Comment.js
    ├── Comment/CommentForm.js
    └── User/User.js       # Profile & activity counts
```

## Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/` | `Home` | Post feed |
| `/users/:userId` | `User` | User profile |
| `/posts` | `Post` | Standalone post route (expects props from feed usage) |
| `/auth` | `Auth` | Login / register (redirects to `/` if already logged in) |

## Authentication

1. `POST /auth/register` or `POST /auth/login` with `{ userName, password }`
2. Response: `{ message: "<token>", userId: <id> }`
3. Stored in `localStorage`:
   - `tokenKey` — JWT / token
   - `currentUser` — user id
   - `userName` — username
4. Authenticated requests send header: `Authorization: <tokenKey>` (raw token, no `Bearer` prefix)
5. Logout clears those keys and reloads the page

Guests can browse the feed. Creating posts, liking, and commenting require login.

## API endpoints used

Base URL in development: relative paths → CRA proxy → `http://localhost:8080`.

| Method | Endpoint | Used by |
|--------|----------|---------|
| `POST` | `/auth/register` | Auth |
| `POST` | `/auth/login` | Auth |
| `GET` | `/posts` | Home |
| `POST` | `/posts` | PostForm |
| `GET` | `/posts?userId=` | User |
| `GET` | `/comments?postId=` | Post |
| `GET` | `/comments?userId=` | User |
| `POST` | `/comments` | CommentForm |
| `POST` | `/likes` | Post |
| `DELETE` | `/likes/{likeId}` | Post |
| `GET` | `/likes?userId=` | User |
| `GET` | `/users/{userId}` | User |

## Configuration

- No `.env` / `REACT_APP_*` variables are required for local development.
- Change the backend URL by editing `"proxy"` in `package.json`.
- Production builds need same-origin reverse proxy or an explicit API base URL.

## Architecture

See [architecture-uml.md](./architecture-uml.md) for component hierarchy, sequence flows, and UML diagrams.

## License

Private project (`"private": true` in `package.json`).

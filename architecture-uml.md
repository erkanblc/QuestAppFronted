# QuestApp Frontend — Architecture & UML

This document describes the frontend architecture of **QuestApp** and provides Mermaid UML diagrams (component, sequence, class, and deployment views).

Related docs: [README.md](./README.md) · [README_TR.md](./README_TR.md) · [README_DE.md](./README_DE.md)

---

## 1. System overview

```mermaid
flowchart LR
  Browser["Browser\nlocalhost:3000"]
  CRA["React SPA\n(Create React App)"]
  Proxy["CRA Dev Proxy"]
  API["QuestApp Backend\nlocalhost:8080"]

  Browser --> CRA
  CRA -->|"relative /auth, /posts, …"| Proxy
  Proxy -->|"http://localhost:8080"| API
```

- UI: React 19 + MUI 7 + React Router 7
- Session: `localStorage` (`tokenKey`, `currentUser`, `userName`)
- HTTP: native `fetch` (no shared service layer; axios is unused)

---

## 2. Component diagram

```mermaid
flowchart TB
  subgraph AppShell["App"]
    Router["BrowserRouter"]
    Nav["Navbar"]
    Routes["Routes"]
  end

  Home["Home"]
  PostForm["PostForm"]
  Post["Post"]
  Comment["Comment"]
  CommentForm["CommentForm"]
  User["User"]
  Auth["Auth"]

  Router --> Nav
  Router --> Routes
  Routes -->|"/"| Home
  Routes -->|"/users/:userId"| User
  Routes -->|"/posts"| Post
  Routes -->|"/auth"| Auth

  Home --> PostForm
  Home --> Post
  Post --> Comment
  Post --> CommentForm
```

### Hierarchy (text)

```
index.js
└── App
    └── BrowserRouter
        ├── Navbar
        └── Routes
            ├── /              → Home
            │                    ├── PostForm (if logged in)
            │                    └── Post[] → Comment[] + CommentForm
            ├── /users/:userId → User
            ├── /posts         → Post (standalone; typically used via Home with props)
            └── /auth          → Auth | Navigate → /
```

---

## 3. Routing & navigation

```mermaid
stateDiagram-v2
  [*] --> Home: /
  Home --> User: /users/:userId
  Home --> Auth: /auth (guest)
  Auth --> Home: login success
  Auth --> Home: already logged in (Navigate)
  User --> Home: Navbar Home / failed fetch
  Home --> Home: Logout (reload)
```

| Path | Guard / behavior |
|------|------------------|
| `/` | Public feed |
| `/users/:userId` | Needs token for API; failure → navigate `/` |
| `/auth` | If `currentUser` set → redirect `/` |
| `/posts` | Mounts `Post` without feed props |

---

## 4. Sequence diagrams

### 4.1 Register / login

```mermaid
sequenceDiagram
  actor U as User
  participant A as Auth
  participant LS as localStorage
  participant API as Backend :8080

  U->>A: Submit userName + password
  alt Register
    A->>API: POST /auth/register
  else Login
    A->>API: POST /auth/login
  end
  API-->>A: { message: token, userId }
  A->>LS: tokenKey, currentUser, userName
  alt Login
    A->>A: navigate("/")
  else Register
    A->>A: window.location.reload()
  end
```

### 4.2 Load feed & create post

```mermaid
sequenceDiagram
  actor U as User
  participant H as Home
  participant PF as PostForm
  participant API as Backend :8080

  H->>API: GET /posts
  API-->>H: Post[] (with postLikes)
  H->>H: Render PostForm + Post cards

  U->>PF: title + text
  PF->>API: POST /posts\nAuthorization: tokenKey\n{ title, user_id, text }
  API-->>PF: 200 OK
  PF->>H: refreshPosts()
  H->>API: GET /posts
```

### 4.3 Like & comments

```mermaid
sequenceDiagram
  actor U as User
  participant P as Post
  participant CF as CommentForm
  participant API as Backend :8080

  U->>P: Expand comments
  P->>API: GET /comments?postId={id}
  API-->>P: Comment[]

  U->>P: Toggle like
  alt Not liked
    P->>API: POST /likes { postId, userId }
    API-->>P: likeId
  else Liked
    P->>API: DELETE /likes/{likeId}
  end

  U->>CF: Submit comment text
  CF->>API: POST /comments { postId, userId, text }
```

### 4.4 User profile

```mermaid
sequenceDiagram
  participant U as User page
  participant API as Backend :8080

  U->>API: GET /users/{userId}
  U->>API: GET /posts?userId={userId}
  U->>API: GET /comments?userId={userId}
  U->>API: GET /likes?userId={userId}
  Note over U,API: All with Authorization: tokenKey
  API-->>U: user + counts from array lengths
```

---

## 5. Class / entity view (frontend DTOs)

Inferred from request/response usage (not TypeScript types):

```mermaid
classDiagram
  class AuthResponse {
    +string message
    +id userId
  }

  class User {
    +id id
    +string userName
  }

  class Post {
    +id id
    +id userId
    +string userName
    +string title
    +string text
    +Like[] postLikes
  }

  class Like {
    +id id
    +id userId
    +id postId
  }

  class Comment {
    +id id
    +id userId
    +string userName
    +string text
    +id postId
  }

  User "1" --> "*" Post : creates
  User "1" --> "*" Comment : writes
  User "1" --> "*" Like : gives
  Post "1" --> "*" Like : postLikes
  Post "1" --> "*" Comment : has
```

### Create payloads

| Action | Body |
|--------|------|
| Auth | `{ userName, password }` |
| Create post | `{ title, user_id, text }` |
| Create comment | `{ postId, userId, text }` |
| Create like | `{ postId, userId }` |

---

## 6. Auth & session

```mermaid
flowchart TD
  Start([App load]) --> Check{"localStorage\ncurrentUser?"}
  Check -->|yes| Authed[Show profile link\nPostForm / Like / CommentForm]
  Check -->|no| Guest[Browse feed only\nLogin-Register link]

  Authed --> Logout[Navbar Logout]
  Logout --> Clear[Remove tokenKey,\ncurrentUser, userName]
  Clear --> Reload[navigate 0 / reload]

  Guest --> AuthPage["/auth"]
  AuthPage --> Store[Save token + userId + userName]
  Store --> Authed
```

**Header convention:** `Authorization: <tokenKey>` (raw token string).

---

## 7. Deployment / runtime view

```mermaid
flowchart TB
  subgraph Dev["Development"]
    FE["npm start → :3000"]
    PX["package.json proxy"]
    BE["Backend :8080"]
    FE --> PX --> BE
  end

  subgraph Prod["Production (typical)"]
    Build["npm run build → static files"]
    Nginx["Reverse proxy / CDN"]
    API2["Backend API"]
    Build --> Nginx
    Nginx -->|"/api or same origin"| API2
  end
```

> Production CRA builds do **not** include the `proxy` setting. Serve the SPA and API under the same origin, or introduce an explicit API base URL.

---

## 8. API map (frontend → backend)

| Method | Path | Component | Auth header |
|--------|------|-----------|-------------|
| `POST` | `/auth/register` | Auth | — |
| `POST` | `/auth/login` | Auth | — |
| `GET` | `/posts` | Home | — |
| `POST` | `/posts` | PostForm | ✓ |
| `GET` | `/posts?userId=` | User | ✓ |
| `GET` | `/comments?postId=` | Post | — |
| `GET` | `/comments?userId=` | User | ✓ |
| `POST` | `/comments` | CommentForm | ✓ |
| `POST` | `/likes` | Post | ✓ |
| `DELETE` | `/likes/{likeId}` | Post | ✓ |
| `GET` | `/likes?userId=` | User | ✓ |
| `GET` | `/users/{userId}` | User | ✓ |

---

## 9. Notes for maintainers

1. **No global state** — session is `localStorage` only; `App` reads `currentUser` once per mount.
2. **`Home` `useEffect` depends on `postList`** — can cause repeated refetch; prefer a dedicated refresh trigger.
3. **Post create uses `user_id`** — other payloads use camelCase `userId`.
4. **`/posts` route** mounts `Post` without required props; feed usage is the real path.
5. **CommentForm** does not refresh the parent comment list after submit until comments are re-expanded / re-fetched.
6. **`axios`** is listed in dependencies but unused; all calls use `fetch`.

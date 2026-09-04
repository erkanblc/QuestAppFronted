# QuestApp Frontend

React-Single-Page-Application für **QuestApp** — ein Social-Feed, in dem Nutzer sich registrieren, anmelden, Beiträge erstellen, liken und kommentieren.

| Dokument | Sprache |
|----------|---------|
| [README.md](./README.md) | English |
| [README_TR.md](./README_TR.md) | Türkçe |
| [README_DE.md](./README_DE.md) | Deutsch |
| [architecture-uml.md](./architecture-uml.md) | Architektur & UML |

## Funktionen

- Registrierung und Anmeldung (JWT in `localStorage`)
- Start-Feed mit allen Beiträgen
- Beiträge erstellen (authentifiziert)
- Beiträge liken / Like entfernen
- Aufklappbare Kommentare und Kommentarformular
- Nutzerprofil mit Anzahl von Beiträgen, Kommentaren und Likes

## Tech-Stack

| Technologie | Version / Hinweis |
|-------------|-------------------|
| React | 19 |
| Create React App | `react-scripts` 5 |
| React Router | 7 |
| Material UI | 7 (`@mui/material`, `@mui/icons-material`) |
| HTTP | Native `fetch` (relative URLs) |
| Backend-Proxy | `http://localhost:8080` |

## Voraussetzungen

- Node.js 18+ und npm
- QuestApp-Backend auf **Port 8080** (Spring-Boot-API)

## Einstieg

```bash
npm install
npm start
```

Öffnen Sie [http://localhost:3000](http://localhost:3000). API-Aufrufe werden über das `proxy`-Feld in `package.json` an `http://localhost:8080` weitergeleitet.

### Weitere Skripte

| Befehl | Beschreibung |
|--------|--------------|
| `npm start` | Entwicklungsserver |
| `npm test` | Jest / Testing Library |
| `npm run build` | Produktions-Build → `build/` |
| `npm run eject` | CRA-Konfiguration auslagern (irreversibel) |

## Projektstruktur

```
src/
├── App.js                 # Router, Auth-Gate für /auth
├── index.js               # Einstiegspunkt
└── components/
    ├── Auth/Auth.js       # Registrierung & Login
    ├── Home/Home.js       # Feed + PostForm
    ├── Navbar/Navbar.js   # Navigation & Logout
    ├── Post/Post.js       # Beitragskarte, Likes, Kommentare
    ├── Post/PostForm.js   # Beitrag erstellen
    ├── Comment/Comment.js
    ├── Comment/CommentForm.js
    └── User/User.js       # Profil & Aktivitätszähler
```

## Routen

| Pfad | Komponente | Beschreibung |
|------|------------|--------------|
| `/` | `Home` | Beitrags-Feed |
| `/users/:userId` | `User` | Nutzerprofil |
| `/posts` | `Post` | Eigenständige Post-Route (erwartet Props aus dem Feed) |
| `/auth` | `Auth` | Login / Registrierung (Weiterleitung zu `/` bei bestehender Session) |

## Authentifizierung

1. `POST /auth/register` oder `POST /auth/login` mit `{ userName, password }`
2. Antwort: `{ message: "<token>", userId: <id> }`
3. Speicherung in `localStorage`:
   - `tokenKey` — JWT / Token
   - `currentUser` — Nutzer-ID
   - `userName` — Benutzername
4. Authentifizierte Anfragen: Header `Authorization: <tokenKey>` (ohne `Bearer`-Präfix)
5. Logout löscht diese Schlüssel und lädt die Seite neu

Gäste können den Feed lesen. Beiträge erstellen, liken und kommentieren erfordert Login.

## Verwendete API-Endpunkte

Basis-URL in der Entwicklung: relative Pfade → CRA-Proxy → `http://localhost:8080`.

| Methode | Endpunkt | Verwendet von |
|---------|----------|---------------|
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

## Konfiguration

- Für die lokale Entwicklung sind keine `.env` / `REACT_APP_*`-Variablen nötig.
- Backend-URL über `"proxy"` in `package.json` anpassen.
- Produktions-Builds benötigen Reverse-Proxy (gleiche Origin) oder eine explizite API-Basis-URL.

## Architektur

Komponentenhierarchie, Sequenzabläufe und UML: [architecture-uml.md](./architecture-uml.md).

## Lizenz

Privates Projekt (`"private": true` in `package.json`).

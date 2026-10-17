# Hotel List

Hotel listing app with CRUD operations, filters, pagination and map-based detail pages.

| Folder                 | What it is                                                                   |
| ---------------------- | ---------------------------------------------------------------------------- |
| [`Service/`](Service)  | REST API: Node.js, Express, PostgreSQL (native SQL), images stored on disk   |
| [`UI/`](UI)            | Single-page app: React, Redux Toolkit, React Router, react-helmet-async, Leaflet |

## Quick start

```bash
# 1. API (needs PostgreSQL; see Service/README.md)
cd Service
cp .env.example .env      # set your PostgreSQL credentials
npm install
npm run db:init
npm run dev               # http://localhost:3000

# 2. UI (in a second terminal)
cd UI
npm install
npm run dev               # http://localhost:5173
```

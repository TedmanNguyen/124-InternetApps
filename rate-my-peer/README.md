# Rate My Peer Frontend

React + Vite frontend scaffold for a peer-rating platform focused on project accountability.

## Implemented pages

- Landing page with hero search
- Search results page with student cards
- Student profile page with aggregate rating, course breakdown, attributes, and review feed
- Write review page with selectable attribute chips

## Components included

- `Layout`
- `SearchBar`
- `StudentCard`
- `RatingStars` (fractional support)
- `AttributeTag`
- `ReviewForm`

## Local development

```bash
npm install
npm run dev
```

## Build and lint

```bash
npm run build
npm run lint
```

## Data source

Mock student data currently lives in `src/data/mockStudents.js`.
You can swap this to API data later with minimal changes through `src/context/StudentContext.jsx`.

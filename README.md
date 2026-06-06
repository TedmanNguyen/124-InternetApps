# Rate My Peer #

![alt text](https://github.com/TedmanNguyen/124-InternetApps/blob/main/rate-my-peer/src/assets/Gemini_Generated_Image_5c1tl25c1tl25c1t.png)

Rate My Peer is an premiere app for college students to rate their peers. When students begin a class project, they need someone reliable, skilled, and a team player. Rate my peer helps students figure out which students fit the bill, and students that do not.
Have an excellent partner you want to leave glowing reviews for? Or a less than positive experience? Let everyone know.

## Rate My Peer Frontend

React + Vite frontend scaffold for a peer-rating platform focused on project accountability.

## Implemented pages

- Landing page with hero search
- Search results page with student cards
- Student profile page with aggregate rating, course breakdown, attributes, and review feed
- Write review page with selectable attribute chips
- Admin Panel with ability to delete reviews
- Help / Contact Page for FAQ

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

## Demo Video Link

Here is a link to the demo video showcasing key features of our application: https://youtu.be/l8USIr6-W4Q

# Deploying to Render (Static Site)

This folder is the complete, ready-to-deploy static website — 7 pages, all styles/scripts, and every image/asset they reference.

## Files
```
index.html                      — Home
work-websites.html              — Websites case studies
work-graphics.html              — Graphics case studies
work-layouts.html                — Layouts case studies
work-branding.html              — Upward Creatives brand identity
work-rosedesk.html              — The Rose Desk case study
work-luminousbotanicals.html    — Luminous Botanicals case study
styles.css / subpages.css       — Stylesheets
script.js / resume.js / tweaks.js / image-slot.js — Scripts
assets/                         — Images, logos, resume PDF
```

## Deploy steps (Render)
1. Push this folder's contents to the root of a GitHub repo (or a repo subfolder).
2. In Render: **New +** → **Static Site**.
3. Connect the repo.
4. Build command: leave blank (no build step needed — plain HTML/CSS/JS).
5. Publish directory: `.` (or the subfolder path if you nested it).
6. Deploy. Render will serve `index.html` at the root URL automatically.

No environment variables, no server, no build tooling required — this is a fully static site.

## Notes
- The Calendly widget on the home page's Contact section requires internet access at view-time (loads `assets.calendly.com`) — works fine once live on Render, not offline.
- Resume download button works via an embedded PDF Blob (see `resume.js`) — no server config needed for it.
- The Rose Desk and Luminous Botanicals case studies link out to their own external references — no action needed.

## Patatap React

Interactive Patatap-style sound board rebuilt with React + Vite.

### Getting started
- Install deps: `npm install`
- Run dev server: `npm run dev`
- Build for production: `npm run build`

Press any letter key to spawn an animated circle and trigger its sound. Assets live in `public/sounds`.

### Project layout
- `src/` React app (UI, canvas logic, styles)
- `public/sounds/` audio assets served statically
- `legacy/original-static/` archived original non-React files kept for reference
- `docs/` built site for GitHub Pages (copied from `dist/`)

### Deploying to GitHub Pages (same branch, no Actions)
- Vite `base` is set to `/patatap-app/` in `vite.config.js`; update if the repo name differs.
- Build and stage the Pages site into `docs/` on the same branch:
  1) `npm run build:pages` (builds to `dist/` and copies into `docs/`).
  2) Commit `docs/` along with your changes: `git add docs && git commit -m "Publish to Pages"`.
  3) Push to the branch (e.g., `main`).
  4) In GitHub Settings → Pages, set Source to that branch, folder `/docs`.
  5) Visit `https://<username>.github.io/patatap-app/` after Pages finishes.

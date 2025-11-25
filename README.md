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

### Deploying to GitHub Pages
This repo is configured for Pages via GitHub Actions:
- Vite base is set to `/patatap-app/` in `vite.config.js` (adjust if the repo name differs).
- Workflow: `.github/workflows/deploy.yml` builds on `main`/`master` and publishes to GitHub Pages.

To enable:
1) Push the workflow to the default branch.
2) In repo Settings → Pages, choose “Deploy from GitHub Actions”.
3) After a run, your site will be available at `https://<username>.github.io/patatap-app/`.

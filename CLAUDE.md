# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

CBE Thermal Comfort Tool — a Flask web app that implements comfort model calculations and
visualizations according to ASHRAE Standard-55, EN Standard 16798, and ISO Standard 7730.
Live deployment: http://comfort.cbe.berkeley.edu/. Official docs (GitBook): see `docs/`.

The comfort math is largely duplicated on both sides of the stack:
- Server-side (Python): uses the `pythermalcomfort` package (`comfort.py`) for the `/api/v1/comfort/pmv`
  endpoint and the CSV upload/transform feature (`/upload`, `/transform`).
- Client-side (JavaScript): the interactive charts/pages compute PMV, SET, adaptive comfort, PHS,
  ERF (solar gain), etc. directly in the browser via `static/js/comfort-models.js`, `static/js/erf.js`,
  and `static/js/psychrometrics.js` — these are hand-ported reimplementations of the same models, not
  calls to the Python backend. When fixing a model bug, check whether it needs fixing in both the JS
  model file and `comfort.py`/pythermalcomfort usage.

## Commands

Python (Flask backend):
```bash
pipenv install         # or: pip install -r requirements.txt
python3 comfort.py     # runs dev server on http://localhost:5000 (or $PORT)
```

JavaScript (frontend logic + tests):
```bash
npm install
npm test                       # runs the full Jest suite
npx jest static/js/erf.test.js # run a single test file
npx jest -t "pmv"              # run tests matching a name pattern
```

There is no lint/format command configured in this repo.

Versioning (uses `bumpversion`, configured in `.bumpversion.cfg` — bumps `package.json` and
`templates/index.html` together):
```bash
bumpversion patch   # or minor / major
```

Deployment is via Google Cloud Run, triggered automatically by GitHub Actions
(`.github/workflows/deploy.yml`) on push to `master`. Manual deploy commands (with correct
`gcloud` account set) are in `docs/contributing/contributing.md`.

## Architecture

**Backend (`comfort.py`)** is a small Flask app; each thermal comfort "page" is its own route
rendering a template:
- `/` → `ashrae.html` (ASHRAE-55 PMV/SET/adaptive/local-discomfort tool)
- `/EN` → `en.html` (EN 16798 adaptive/PMV tool)
- `/compare` → `compare.html` (compares standards)
- `/ranges` → `ranges.html`
- `/phs` → `phs.html` (Predicted Heat Strain model)
- `/fan_heatwaves` → `use_fans_heatwaves.html`
- `/upload` + `/transform` → CSV batch upload/download using pythermalcomfort server-side
- `/api/v1/comfort/pmv` → JSON PMV/PPD API endpoint
- `/download/<filename>` → serves files from `./media/`

**Frontend** follows a per-tool folder convention under `static/js/`:
- `static/js/comfort-models.js` — core comfort model implementations (PMV, SET, PHS, adaptive, etc.),
  exposed on the `comf` object; shared across all tools.
- `static/js/psychrometrics.js` — psychrometric chart math, shared `psy` object.
- `static/js/erf.js` — solar gain / ERF (effective radiant field) calculations.
- `static/js/util.js` — shared numeric helpers (root-finding: bisect/secant, etc.), `util` object.
- `static/js/global.js` — shared state/config used across pages (input value cache `d`/`d_cache`,
  clothing ensemble tables, etc.) — must be included by any HTML page that uses the shared model files.
- Tool-specific subfolders (`ASHRAE/`, `EN/`, `compare/`, `ranges/`, `phs_model/`, `use_fans_heatwaves/`)
  each contain the page controller and chart-rendering JS for that tool, paired 1:1 with a template in
  `templates/`.
- These modules use the CommonJS-in-browser dual-export pattern (`if (typeof module !== "undefined" ...)`)
  so the same file works both as a `<script>` include in the templates and as a `require()`'d module in
  Jest tests.

**Testing**: only the pure model/math JS files have Jest tests (`comfort-models.test.js`, `erf.test.js`).
Test values are cross-checked against `pythermalcomfort`'s Python test suite (see comment at top of each
test file) — when changing a model constant, verify it stays consistent with `pythermalcomfort`.

**Templates** (`templates/`) are Jinja2 HTML files, one per tool/page, sharing `static/css/*.css` for
layout/theming (jQuery UI based) and `static/js/lib/*` for third-party JS (jQuery, D3, Chart.js,
Underscore, jQuery UI/fileupload plugins) vendored directly rather than via a package manager.

**Docs** (`docs/`) is a GitBook mirror of `docs.md`-style documentation for each tool plus a large
reference library of thermal-comfort research papers (`docs/references/`) — useful background when a
model behavior seems surprising, but not something to edit as part of code changes unless asked.

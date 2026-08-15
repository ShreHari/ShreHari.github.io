# Shre Hari Prem Anandh — Portfolio

**Concept: "A Living Research Paper."** The whole site is designed as a preprint about its author —
abstract, numbered sections (§01–§10), experiments with figure captions, rubber stamps, and a
BibTeX block. Editorial paper aesthetic, not a template.

Pure HTML + CSS + vanilla JS. **No build step, no frameworks, no dependencies.**
Open `index.html` in a browser and it works.

```
PORTFOLIO/
├── index.html        ← all content lives here
├── css/style.css     ← all design lives here (design tokens at the top)
├── js/main.js        ← interactions (10 independent blocks — delete any safely)
└── assets/
    └── profile.jpg   ← DROP YOUR HEADSHOT HERE (4:5 portrait works best)
```

## First thing to do

Save your black-and-white headshot as `assets/profile.jpg`. Until it exists, the site
shows an elegant "PLATE I — IMAGE PENDING" placeholder automatically.

## How to customise

| Want to change…            | Go to…                                                              |
| -------------------------- | ------------------------------------------------------------------- |
| Accent colour (one knob!)  | `--accent` in `css/style.css` `:root` (and the dark variant below) |
| Fonts                      | The Google Fonts `<link>` in `index.html` + `--font-*` tokens       |
| Any text / numbers         | `index.html` — sections are clearly commented `§01 … §10`           |
| Dark-mode palette          | `[data-theme="dark"]` block at the top of `css/style.css`           |

## How to add a new project (Experiment)

Copy any `<article class="exp exp-card reveal">…</article>` inside the
`<div class="exp-grid">` in `index.html`, then edit:

1. `EXP.0X` number and year
2. Title + description (keep one `<strong>` metric in the text)
3. The `metric-big` number and `metric-label`
4. Tags
5. The `Fig. 3.X` caption — one wry sentence, this is the signature move

Add a stamp to special projects: `<span class="stamp stamp-inline">YOUR LABEL</span>`
inside `exp-head`.

## How to add a whole new section

Copy any `<section class="section" id="…">` block. The pattern is always:
`section-rail` (number + title on the left) + `section-body` (content on the right).
Give it the next § number and add a row to the hero's Table of Contents.

## Deploy (GitHub Pages, free)

```bash
cd ~/Desktop/PORTFOLIO
git init && git add -A && git commit -m "Portfolio v1"
# create a repo named  shrehari.github.io  (or any repo + enable Pages)
git remote add origin https://github.com/ShreHari/shrehari.github.io.git
git push -u origin main
```

Then visit `https://shrehari.github.io`. Afterwards, update the `url` field in the
BibTeX block and the `og:` meta tags.

## Built-in details worth knowing

- **Theme**: "LAB LIGHTS" toggle, remembers choice in `localStorage`, respects system preference.
- **Accessibility**: skip-link, focus rings, semantic landmarks, `prefers-reduced-motion`
  disables the canvas/ticker/animations.
- **Print stylesheet**: recruiters who hit ⌘P get a clean document.
- **Easter eggs**: open the browser console; the footer "Reviewer №" counts your visits.
- The neural-network canvas in the hero follows the cursor (desktop only).

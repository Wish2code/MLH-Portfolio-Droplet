# Portfolio Architecture and Design

## Overview

This Flask portfolio uses a single-page layout with a Formula One–inspired design language: precision, speed, and a performance-oriented aesthetic without racing imagery. Content is fully data-driven from JSON files in `data/`.

## Design language

- **Palette** — near-black carbon backgrounds (`#0a0b0e`, `#0f1116`, `#12141b`), off-white text, and a single racing-red accent (`#e10600`). Red is reserved for accents and interactive emphasis; body text stays high-contrast white/grey.
- **Typography** — Titillium Web (400/600/700/900) for display and body text; the system monospace stack for telemetry-style labels, section indices, and tags (no extra font download).
- **Geometry** — chamfered card corners via `clip-path`, thin hairline borders, a subtle CSS-only carbon-weave texture in the hero, and an angled "speed mark" brand glyph.
- **Motion** — scroll-reveal (opacity/translate only), nav underline transitions, and card hover micro-interactions. All animations are GPU-friendly and disabled under `prefers-reduced-motion`.

## Architecture

### Backend (Flask)

- `app/__init__.py` — routes:
  - `/` renders the single-page portfolio from `profile.json`, `about.json`, `experience.json`, `skills.json`, and `education.json`.
  - `/map` renders the Leaflet map from `map_locations.json`.
  - `/admin` + `/admin/save/<section>` provide plain-text editing for Education and Map data.
  - Legacy routes (`/about`, `/work`, `/education`, `/hobbies`) issue 301 redirects to the matching page anchors.
- `app/data_loader.py` — JSON load/save utilities with safe fallbacks.
- A context processor injects `nav_items` and `profile` into every template.

### Frontend

- `app/templates/base.html` — shared shell: fixed glass header, navigation, footer, skip link.
- `app/templates/index.html` — hero, About, Experience timeline, Skills, Education, Interests, Contact.
- `app/templates/map.html` / `app/templates/admin.html` — secondary pages.
- `app/static/styles/main.css` — design tokens and all styling.
- `app/static/js/site.js` — header scroll state, mobile nav toggle, IntersectionObserver-based scroll-reveal and scroll-spy (~2 KB, no dependencies).
- `app/static/js/map-renderer.js` — Leaflet renderer with dark CARTO tiles, red markers, and dotted connectors.

## Performance decisions

- One CSS file, no framework, no build step.
- Vanilla JS only; Leaflet is loaded solely on the map page.
- Images converted to WebP and sized for their slots; below-the-fold images use `loading="lazy"`, the hero portrait uses `fetchpriority="high"`. All images declare `width`/`height` to avoid layout shift.
- Animations use only `transform` and `opacity`; scroll handlers are passive and rAF-throttled.

## Accessibility

- Semantic sections with `aria-labelledby`, one `h1`, ordered heading levels.
- Skip-to-content link, visible `:focus-visible` outlines, keyboard-operable mobile nav with `aria-expanded`.
- `prefers-reduced-motion` disables reveal animations and smooth scrolling.

## Testing

- `tests/test_routes.py` — route smoke tests, legacy redirects, section rendering, admin save flows.
- `tests/test_data_loader.py` — JSON loader/saver and nav fallback contracts.

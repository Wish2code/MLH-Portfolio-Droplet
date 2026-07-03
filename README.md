# Ngaatendwe Wish Dumbarimwe — Portfolio

A personal portfolio built with Flask and Jinja, redesigned with a modern, Formula One–inspired aesthetic: dark carbon surfaces, precise typography, a racing-red accent, and data-driven layouts. All content is loaded from JSON files in `data/`, so the site can be updated without touching templates.

## Highlights

- **Single-page layout** — About, Experience, Skills, Education, Interests, and Contact live on one fast page with anchor navigation and scroll-spy highlighting.
- **Performance-first** — one small CSS file, ~2 KB of vanilla JavaScript, GPU-friendly transform/opacity animations, lazy-loaded WebP images, and system monospace fonts for accents.
- **Accessible** — semantic HTML, skip link, keyboard-focus styles, `prefers-reduced-motion` support, and high-contrast text on dark surfaces.
- **Interactive map** (`/map`) — a dark-themed Leaflet map of places I have lived, studied, and worked.
- **Admin editor** (`/admin`) — plain-text forms that save Education and Map data back to JSON.

## Installation

Make sure you have python3 and pip installed.

Create and activate a virtual environment:

```bash
python -m venv python3-virtualenv
source python3-virtualenv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

## Usage

Create a `.env` file using the `example.env` template, then start the Flask development server:

```bash
export FLASK_ENV=development
flask run
```

The site is served at `http://localhost:5000`.

## Testing

```bash
python -m unittest discover -s tests
```

## Content and data files

Page content and navigation are loaded from JSON files in `data/`:

| File | Drives |
|------|--------|
| `profile.json` | Name, role, tagline, contact links, hero stats, headshot |
| `about.json` | About section, quick facts, highlights, interests |
| `experience.json` | Research and fellowship timeline |
| `skills.json` | Technical skill groups |
| `education.json` | Education section (also editable at `/admin`) |
| `map_locations.json` | Map markers and styling (also editable at `/admin`) |
| `site_nav.json` | Navigation items |

Optimized site imagery lives in `app/static/img/` (WebP, generated from the source photos in `data/`).

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change, and update tests as appropriate.

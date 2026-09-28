# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Static website for the launch of the **Programa PIRI – Capítulo Nariño** (Universidad de Nariño, Extensión Ipiales, in partnership with Universidad de La Frontera / UFRO). All content, identifiers, comments and commit messages are in Spanish. It is published via GitHub Pages from `main` (remote: `HACK29C/piri-udenar.github.io`).

There is no build step, package manager, linter or test suite: plain HTML + one CSS file + vanilla JS. To preview, open a page directly in a browser or serve the folder, e.g. `python -m http.server 8000`, then visit `http://localhost:8000/index.html`. Pushing to `main` deploys.

## Architecture

- **Pages** (`index.html`, `acerca.html`, `quienes-somos.html`, `convenio.html`, `noticias.html`, `agenda.html`, `perfiles.html`, `direccion.html`) are standalone documents. There are no templates or includes: the `<head>` (Google Fonts Montserrat/Inter, Font Awesome 6 from cdnjs, `css/estilos.css`), the navbar with the three institutional logos, and the footer are **copy-pasted into every page**. A change to the nav/header/footer must be repeated in all eight files.
- **`css/estilos.css`** (~9.4k lines) is the single shared stylesheet. Brand colors and fonts are CSS variables in `:root` (`--verde-piri`, `--verde-brillante`, `--azul-institucional`, `--fuente-titulos`, …). Dark mode is implemented as `body.dark-mode …` overrides near the end of the file. Several pages also carry large inline `<style>` blocks and many inline `style=""` attributes, so check the page itself before assuming a rule lives in `estilos.css`.
- **`js/script.js`** is loaded on every page and holds shared behavior: background image slider (`.slide` / `.active`, 4 s), countdown to the event (hard-coded `March 19, 2026 08:30`, writes to `#dias/#horas/#minutos/#segundos`), mobile menu with `.menu-overlay`, anchor smooth-scroll, and the dark-mode toggle (`#darkModeToggle`, persisted in `localStorage.darkMode`). Each block guards against missing elements so it can run on any page.
- **Inline `<script>` blocks** in pages duplicate some of that logic (e.g. `index.html`, `agenda.html`, `perfiles.html` define their own `toggleMenu()` toggling `.show`, wired via `onclick` on `.nav-toggle`, while `script.js` also toggles `.active` on the same button; `index.html` also has its own countdown). Be aware of both paths when debugging nav/menu behavior.
- **`js/carrusel-modal.js`** is loaded only by `agenda.html`. It provides a generic modal (`crearModal(titulo, contenido, ancho)` / `cerrarModal()`, with an optional `window.cleanupCarrusel` hook), video helpers (`abrirVideoYouTube`, `abrirVideoFacebook`, `abrirVideoGoogleDrive`, …), speaker profile modals (`abrirPerfilMirian`, `abrirPerfilElkin`, …) and the Q&A space (`abrirEspacioPreguntas`). A `DOMContentLoaded` handler at the bottom attaches these to agenda timeline items **by matching the visible text** of `.item-actividad` / `.item-ponente` inside `.timeline-moderna-item` (e.g. `texto.includes('Mag. Marcelo Carrasco')`). Renaming a speaker or activity in `agenda.html` silently breaks its click handler unless the matching string in this file is updated too. To add a new speaker profile: add an `abrirPerfilX()` function and a matching `texto.includes(...)` branch.
- **`imagenes/`** holds all photos and logos, referenced by relative path (some filenames contain spaces or accents, e.g. `imagenes/Andrea Figueroa.jpg`; keep exact casing since GitHub Pages is case-sensitive).

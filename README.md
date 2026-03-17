# epsilonsqc.github.io

Personal landing page for **Alexandre Perreault** (Epsilons) — Software Engineer, Game Developer, Game Designer.

**Live:** [epsilonsqc.github.io](https://epsilonsqc.github.io)

## Features

### Interactive ASCII Cat

An animated cat face rendered entirely in ASCII characters using SVG-to-canvas rasterization:

- SVG cat face (organic eye shapes, vertical slit irises, W-shaped mouth) with Gaussian blur glow effects
- Rasterized to a 64x28 character grid via offscreen canvas luminance sampling
- 15 pre-generated frames (5 horizontal x 3 vertical eye positions) for smooth mouse tracking
- Pupils follow the cursor in real time with `/300` normalized input mapping
- Random blinking every 2-5 seconds (250ms blink duration) with 20% chance of a double blink
- Idle drift animation (sine wave) when the mouse is inactive for 3+ seconds
- Density-mapped characters: `· ~ o x + = * % $ @`

### Matrix Rain Background

Canvas-based falling code character animation:

- Columns of code-related characters (`{}[]()<>=+-*/|&!?;:.0123456789abcdef`) falling at randomized speeds
- Center fade: columns gradually disappear toward the middle of the screen, leaving a clean dark area for content
- Periodic pixel cleanup snaps near-black residue to pure black, preventing ghosting artifacts
- Responsive: adapts to window resize

### About Me Modal

A centered modal overlay triggered by the info icon in the navigation or by clicking the copyright footer:

- Green-bordered rounded rectangle with dark background
- Bilingual bio text (EN/FR) driven by the i18n translations
- Closes via close button, backdrop click, or Escape key
- Smooth scale transition on open
- Keyboard focus trap for accessibility

### Language Toggle (EN/FR)

- FR/EN toggle button in the top-right corner with opaque background
- Auto-detects browser language on load
- Translates page title, tagline, tooltips, and About Me content
- 404 page also translated via dedicated `i18n-404.js`

### Noscript Fallback

A lightweight `noscript.css` ensures the page remains visible when JavaScript is disabled by forcing opacity on animated elements.

### Custom 404 Page

- Matrix rain background with "Lost in the matrix" themed messaging
- Bilingual (EN/FR) via `i18n-404.js`
- Link back to the homepage

### Accessibility

- Respects `prefers-reduced-motion`: disables matrix rain, cat blink, and idle drift animations
- Keyboard-navigable modal with focus trap and Escape to close

## Tech Stack

- **HTML5 / CSS3 / Vanilla JS** — no frameworks, no build tools
- **Canvas API** — matrix rain background + SVG-to-ASCII rasterization
- **Font Awesome 7** — social link icons (woff2 only)
- **Google Fonts** — Source Sans Pro
- **GitHub Pages** — static hosting, auto-deploys on push to `main`

## Project Structure

```
index.html                          Main page
robots.txt                          Search engine crawler rules
sitemap.xml                         Sitemap for search engines
404.html                            Custom 404 error page
assets/
  css/
    base.css                        Base layout, typography, animations
    404.css                         404 error page styles
    fontawesome-all.min.css         Font Awesome 7 icon definitions
    ascii-cat.css                   ASCII cat styles
    matrix-rain.css                 Matrix rain canvas styles
    noscript.css                    Fallback for JS-disabled browsers
  js/
    init.js                         Page init and preload handling
    i18n.js                         EN/FR translations and language toggle
    i18n-404.js                     EN/FR translations for the 404 page
    about-modal.js                  About Me modal open/close logic
    matrix-rain.js                  Canvas matrix rain background
    ascii-cat.js                    SVG-to-ASCII cat with eye tracking
  webfonts/                         Font Awesome woff2 font files
  images/
    favicon.ico                     Browser favicon (multi-size)
    apple-touch-icon.png            iOS home screen icon
    og-image.png                    Open Graph preview image
```

# 🎉 Happy Birthday Website — Customization Guide

A scroll-based birthday website with a warm "scrapbook" look and a lot of
interactive moments:

- **Envelope intro** — she taps a wax-sealed envelope, it opens into a letter
- **The gate** — "Am I your best friend?" with a "No" button that dodges the
  cursor/finger, shrinks, and eventually gives up after enough tries
- **Interactive constellation background** — particles that gently react to
  the mouse, running the whole time
- **Cursor sparkle trail**
- **Our Story timeline** — scroll-reveals milestone cards, connected by a
  dashed line
- **Tilt photo gallery** — polaroids that tilt in 3D as you move the mouse,
  click to zoom into a lightbox
- **Scratch-off wish card** — drag to scratch away the card and reveal a
  hidden message
- **Blow-out-the-candles finale** — tap each of the 5 candles one by one;
  the last one triggers fireworks + a big confetti burst + the final message
- **Hidden secret button** (🤍) that pops up a bonus message
- **Music toggle** with an animated equalizer, top-right corner
- **Scroll progress bar** and a side dot-navigation on desktop

---

## 1. Add her real name

Open `script.js`, edit the top:

```js
const HER_NAME = "Bestie";                 // <-- her name
const YOUR_SIGNOFF = "Your best friend";   // <-- how you sign off
```

## 2. Add your real photos

Replace the 6 placeholder images in `images/` — **keep the same filenames**
(`1.jpg` … `6.jpg`) so nothing else needs to change. Want captions to match?
Edit the `<figcaption>` text for each photo in `index.html` (search for
`s-gallery`).

## 3. Write your actual timeline

Open `index.html`, find the `<div class="timeline" id="timeline">` block
(search for `s-timeline`). There are 4 `<article class="tl-item">` cards —
replace the placeholder `tl-date` and `tl-text` with your real memories.
Add more cards by copying a `tl-item` block and alternating
`data-side="left"` / `data-side="right"`.

## 4. Edit the scratch-card wish

In `index.html`, find `<p class="scratch-reveal" id="scratch-reveal">`
(search for `s-wish`) and change the hidden message to whatever you want
her to find.

## 5. Edit the secret easter-egg message

In `index.html`, find `<p id="secret-text">` near the bottom and personalize it.

## 6. Add music

See `music/PUT_SONG_HERE.txt` — drop in an MP3 named exactly `song.mp3`.
(I can't include a real copyrighted song myself, but any track you already
own works — just rename the file.)

## 7. Edit the main birthday message (optional)

It's set both in `index.html` (`<p id="birthday-message">`) and overwritten
by `script.js` when she says Yes — edit the text inside the
`yesBtn.addEventListener(...)` block in `script.js` if you want it to say
something different than the HTML default.

## 8. Preview it locally

Double-click `index.html` to open it in your browser — no installation needed.

---

## 9. Push it to GitHub

```bash
cd birthday-website
git init
git add .
git commit -m "happy birthday website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

## 10. Host it free with GitHub Pages (so you can send her a link)

1. Push the project to GitHub (step 9).
2. On GitHub: your repo → **Settings** → **Pages**.
3. Under "Build and deployment" → **Source**: `Deploy from a branch`,
   branch `main`, folder `/ (root)`. Save.
4. Wait a minute — your site goes live at:
   `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`
5. Send her that link on the 21st! 🎂

---

## File structure

```
birthday-website/
├── index.html      → all sections/content
├── style.css       → the whole visual design & animations
├── script.js       → every interaction (dodge button, tilt, scratch card,
│                      candles, fireworks, confetti, particles, music)
├── images/         → her/your photos (1.jpg – 6.jpg)
├── music/          → song.mp3 goes here
└── README.md       → this file
```

Happy birthday to her — hope she loves it! 🎈

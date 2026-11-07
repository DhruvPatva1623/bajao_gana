# 🎵 Bajao Gana — Feel Every Vibe

<div align="center">

![Bajao Gana Banner](https://img.shields.io/badge/Bajao_Gana-Music_%26_Karaoke-ec4899?style=for-the-badge&logo=youtube&logoColor=white)
![Status](https://img.shields.io/badge/Status-Active_Development-success?style=for-the-badge)
![Tech](https://img.shields.io/badge/Stack-Vanilla_JS_•_CSS3_•_HTML5-blue?style=for-the-badge)
![UI](https://img.shields.io/badge/Design-Glassmorphic_•_Ambient_Blur-purple?style=for-the-badge)

**The ultimate web music & real-time karaoke player. Sing along to synchronized glowing lyrics, spin physical vinyl on an interactive 3D DJ turntable, and enjoy ambient album-reactive visuals.**

[Live Demo](#getting-started) • [Key Features](#-key-features) • [Keyboard Shortcuts](#-keyboard-shortcuts) • [Architecture](#-project-structure)

</div>

---

## 📖 Overview

**Bajao Gana** is a modern, high-performance web music and karaoke application built with pure Vanilla JavaScript, CSS3 Glassmorphism, and the YouTube IFrame API. It bridges high-fidelity video/audio streaming with synchronized line-by-line and word-by-word karaoke lyrics, an interactive 3D turntable, and background playback that never pauses when switching screens.

---

## ✨ Key Features

### 🎤 1. Real-Time Ambient Karaoke Room
- **Synchronized Lyrics**: Line-by-line smooth vertical auto-scroll and word-by-word active text highlights.
- **Neon Aura Highlighting**: Active singing lines illuminate with high-contrast, neon ambient glow against dynamic album-color gradients.
- **Full Ambient Backdrop**: Background automatically samples the current song's album art to cast floating, blurred ambient hues.
- **Up-Next 5-Second Countdown**: When a song ends, an automatic suggestions modal pops up with a 5-second countdown timer ring to auto-play similar tracks.

### 🎧 2. Interactive 3D DJ Turntable Deck
- **Empty vs. Playing States**:
  - *No track loaded*: Tonearm is safely parked at `-18°` in its armrest, retro *Bajao Gana* label is visible, and the deck stays in "Ready to Spin" standby.
  - *Song playing*: Tonearm rotates and lowers onto the grooves at `+24°`, the vinyl disc spins with realistic specular sheen, the center label shows the song's circular album art, and spectrum equalizer bars bounce rhythmically.
- **Interactive DJ Controls**:
  - Tap the record to toggle play/pause with needle-lift mechanics.
  - Switch between **33 RPM** (1.0× speed) and **45 RPM** (1.35× speed).
  - Live **Pitch Slider** for real-time tempo and playback adjustments.

### 📀 3. Vinyl Collection Drawer ("Disk Rack")
- **Far-Left Slide-Out Shelf**: Triggered by the top-left menu icon, the floating edge handle, or the hero collection button.
- **Hover-Slide Discs**: Hovering any vinyl sleeve smoothly pulls the record out from its physical jacket with realistic grooves and labels.
- **Instant Spin**: Clicking any disc immediately drops the needle on the turntable and starts playback.

### 🪟 4. Floating Mini Player (PiP Screen Popup)
- **Persistent Uninterrupted Playback**: Switch between the Home Screen, Song Page, and Karaoke Room without losing playback or audio buffering.
- **Corner Popup Controls**: Includes thumbnail preview, seekable progress bar, time counters, Previous, Play/Pause, Next, Fullscreen Expand, and a 1-click **Sing** shortcut into Karaoke mode.

### 📑 5. Smart Queue & Playback Settings Drawer
- **Quick Add**: Paste YouTube URLs or type any track name to add directly to the active queue.
- **Reorder & Remove**: Every track has `▲` (Move Up), `▼` (Move Down), and `✕` (Remove) controls.
- **All Settings Suite**:
  - Playback Speed selector (`0.5×`, `0.75×`, `1.0×`, `1.25×`, `1.5×`, `2.0×`).
  - Auto-play Next track toggle.
  - Ambient Vibe theme presets (*Adaptive*, *Neon Pink*, *Midnight Chill*).
  - Clear Queue with 1-click reset.

### 🔍 6. Multi-Engine Search & Autocomplete
- Global and hero search bars with autocomplete suggestions.
- Direct support for YouTube URLs, video IDs, song names, and artist keywords.
- Curated quick-picks (*Bollywood, Global Pop, Punjabi Bangers, Funk & Disco, Anthem Rock*).

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| <kbd>Space</kbd> | Toggle Play / Pause |
| <kbd>←</kbd> | Seek Backward 5 seconds |
| <kbd>→</kbd> | Seek Forward 5 seconds |
| <kbd>L</kbd> | Toggle Single-Track Loop |
| <kbd>M</kbd> | Toggle Mute / Unmute |
| <kbd>Cmd</kbd> / <kbd>Ctrl</kbd> + <kbd>K</kbd> | Focus Global Search Bar |
| <kbd>Esc</kbd> | Close Modals, Drawers & Autocomplete |

---

## 📁 Project Structure

```text
bajao_gana/
├── index.html        # App Shell, Navigation, Hero Deck, Player, Karaoke Room & Drawers
├── styles.css        # Glassmorphic Design System, Turntable 3D, Glow Effects & Animations
├── app.js            # Audio/Video Logic, YouTube API Integration, Lyrics Sync & Queue Manager
├── .gitignore        # Git ignore configuration
└── README.md         # Documentation & Feature Overview
```

---

## 🚀 Getting Started

No build tools or heavy node dependencies required! Run the project with any static HTTP server:

### 1. Clone the repository
```bash
git clone https://github.com/DhruvPatva1623/bajao_gana.git
cd bajao_gana
```

### 2. Start local server
Using Node.js:
```bash
npx serve
```
Or using Python:
```bash
python -m http.server 3000
```

### 3. Open in Browser
Navigate to `http://localhost:3000` to start vibing!

---

## 🎨 Design Philosophy
- **Glassmorphism**: Layered semi-transparent cards with backdrop blur (`-webkit-backdrop-filter`).
- **60 FPS Performance**: GPU-accelerated CSS transforms and lightweight canvas particles without heavy CPU SVG filters.
- **Touch & Click Friendly**: Bulletproof pointer event handling ensuring responsive clicks on all buttons and sliders.

---

<div align="center">

Made with 💜 for music lovers & karaoke enthusiasts.

</div>

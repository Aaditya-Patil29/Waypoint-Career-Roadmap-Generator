# Waypoint

A career roadmap generator for engineering students. Chat with an AI guide, answer eight questions, and get a personalised phase-by-phase plan. Refine it, download it, or print it.

## Install

```bash
npm install
```

## Add your Gemini key

Copy `.env.example` to `.env` and replace `your_key_here` with a real Gemini API key:

```bash
cp .env.example .env
# then edit .env and paste your key
```

> **Note:** The key is sent directly from the browser. This is fine for a personal or college project, but do not ship this publicly without a backend proxy.

## Change the model

Open `.env` and change `VITE_GEMINI_MODEL`. The default is `gemini-2.5-flash`.

```
VITE_GEMINI_MODEL=gemini-2.5-flash
```

## Run

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Build

```bash
npm run build
```

The production bundle goes to `dist/`.

## Features

- Eight-step guided intake with option chips
- AI-generated phase-by-phase roadmap (4–7 phases)
- Refine the plan through chat
- Per-phase skill and project checklists
- Download as Markdown, copy as text, or print to PDF
- Session restored from localStorage on reload
- Works without a key (shows a banner, page still renders)

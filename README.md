# Learning Library

A multi-book, self-paced, self-grading tutor. Point the `teach-book` skill (`.agents/skills/teach-book/`) at a book, author, or PDF, and it builds a chat-tutored course inside this same static site — mission, cited resources, a concept-coverage audit, and a set of lessons — registered alongside any other books already here.

## How it works

- **Fully static.** No server, no server-held API keys. Deployed to Netlify as plain HTML/CSS/JS.
- **Bring your own key.** Each visitor supplies their own Anthropic API key (stored only in their browser) to chat with the tutor. Conversations go straight from the browser to Anthropic's API — nothing touches a server we run.
- **Genuine multi-turn chat, not a quiz.** The tutor is Socratic: it asks, pushes back, and — when it judges you've actually understood a lesson, not just recited it — calls a `recordMastery` tool that logs the win.
- **One library, many books, all in parallel.** The root page lists every book with independent progress; nothing is gated behind finishing another.
- **Progress lives in your browser.** Covers every session, every lesson, every book. Export it to a JSON file to move it to another browser/device; import merges it back in.

## Structure

```
books/
  index.json          — the library registry
  <book-id>/
    MISSION.md         — why this book, for this learner
    RESOURCES.md        — cited, verified primary sources
    concept-audit.md    — coverage checklist vs. the book's own glossary/index
    index.html           — this book's dashboard
    lessons/
      NNNN-slug.html     — one lesson per concept
      manifest.json       — grounding text the tutor grades against
assets/                 — shared across every book (stylesheet, chat widget, progress store, library page)
```

## Adding a book

Invoke `/teach-book` and point it at a title, author, or a source PDF. See `.agents/skills/teach-book/SKILL.md` for the full pipeline.

## Local preview

```
npm run dev
```

## Deploy

Push to the branch Netlify is watching — `netlify.toml` publishes the repo root as-is.

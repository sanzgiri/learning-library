# Registration and Deploy

## `books/index.json`

The library registry — one entry per book, read by the root `index.html`/`library.js` to render the book grid.

```json
{
  "id": "kebab-case-id",
  "title": "Display title",
  "author": "Author name",
  "tagline": "One sentence — what this course covers.",
  "status": "in-progress" | "active"
}
```

- `id` must match the `books/<id>/` directory name exactly.
- `status: "in-progress"` while a book is still being authored; flip to `"active"` at step 8 of `SKILL.md`, once the dashboard and at least one lesson exist. `library.js` doesn't currently filter on status, but keep it accurate — a future version might.
- Nothing else needs to duplicate path conventions here (no `manifestPath`, no `dashboardPath`) — every script derives `books/<id>/index.html` and `books/<id>/lessons/manifest.json` from `id` alone. Don't add path fields; it just creates a second place for the convention to drift from the code.

## Deploy (Netlify)

This repo deploys as a plain static site — `netlify.toml` sets `publish = "."`, no build step.

**Default: git-linked auto-deploy.** If the repo is already connected to a Netlify site, committing and pushing to the watched branch deploys automatically. Confirm the push succeeded and the live URL reflects the new book (check `books/<id>/index.html` loads and the root library page lists it).

**Manual alternative:** if the Netlify CLI is installed and already authenticated (`netlify status` shows a linked site), `netlify deploy --prod` from the repo root is equivalent to a push. Don't attempt to authenticate a new Netlify session yourself — that's the user's call, not something to script around.

## Local preview before deploying

`npm run dev` (or any static server, e.g. `npx serve .`) at the repo root. Click through: library → this book's dashboard → a lesson → back — confirms no broken relative paths before it goes live, where a case-sensitive host would turn a typo into a real 404 that local dev on macOS won't show you.

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

## Deploy (GitHub Pages)

This repo is deployed as a plain static site via GitHub Pages, Actions-based (`.github/workflows/pages.yml`), served as a **project site under a subpath** (`https://<user>.github.io/<repo>/`), not domain root. That subpath is exactly why every path in this codebase is a correctly-counted plain relative path rather than an absolute one — see `LESSON-FORMAT.md` for the two approaches that were tried and rejected before landing on this.

**Default: git push deploys automatically.** The workflow triggers on push to `main`. Confirm the push succeeded (`gh run list --workflow=pages.yml --limit 1`) and the live URL reflects the new book.

**If a deploy shows `startup_failure` with zero jobs created:** check `gh api repos/<owner>/<repo>/environments/github-pages/deployment-branch-policies` — the `github-pages` environment defaults to allowing only a `gh-pages` branch; if the site's content lives on `main` (as it does here), `main` must be added explicitly (`gh api -X POST .../deployment-branch-policies -f name=main`), or every deploy is silently rejected before a single job runs.

**If deploys are failing for no discoverable reason,** check `https://www.githubstatus.com/api/v2/incidents/unresolved.json` before assuming a configuration problem — GitHub Actions has real, if infrequent, platform-wide incidents, and they produce exactly this symptom (stuck builds, `startup_failure`, transient 503s on the API).

## Local preview before deploying

`npm run dev` (or `npx serve .`) at the repo root. This repo's `serve.json` sets `"cleanUrls": false` deliberately — without it, `serve` rewrites `.html` URLs in a way GitHub Pages never actually does in production, which is exactly the mismatch that caused real bugs here (local tests passing while the real deploy is broken, and vice versa). Click through with an actual browser console check (Playwright or equivalent) — library → this book's dashboard → a lesson — not just a curl status code on the HTML file, which reports 200 even when every sub-resource it references 404s.

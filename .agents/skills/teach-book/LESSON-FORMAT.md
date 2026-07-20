# Lesson HTML Format

`books/<id>/lessons/NNNN-slug.html`, one self-contained file per concept, numbered sequentially. Beautiful, spare typography — think Tufte, not a slide deck. Short enough to finish in one sitting; one tangible win per lesson, not a survey.

## Required structure

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Lesson NN — {Title}</title>
<link rel="stylesheet" href="../../../assets/lesson.css" />
</head>
<body>
<article class="lesson">
  <div class="lesson-meta"><span>LEVEL NN</span><span>~NN MIN</span></div>
  <h1>{Title}</h1>
  <p class="book-source">{Book or chapter}</p>

  <p>{A concrete hook — an anecdote, an example, a question — before any abstraction.}</p>

  <h2>The idea</h2>
  <p>{The core concept, grounded in a cited source. A verbatim quote in a <blockquote> only if you've actually verified the wording against a source you've read — never invent one.}</p>

  <h2>Going deeper: {a related sub-concept}</h2>
  <p>{Deepens or complicates the core idea; a natural place to cross-link a related lesson via <a href="NNNN-other-slug.html">.}</p>

  <h2>Practice</h2>
  <div class="practice">
    <p>{2-3 numbered exercises — retrieval + application, not recall of vocabulary.}</p>
  </div>

  <h2>Something to sit with</h2>
  <p>{One open, harder discussion question with no clean answer — this is what the chat conversation should actually dig into.}</p>

  <p class="teacher-note">Talk it through with your tutor below — {one line on specifically what the tutor is listening for, so the learner knows what "got it" means}.</p>

  <p class="source-rec">Primary source: {citation with link} — see <a href="../RESOURCES.md">RESOURCES.md</a>.</p>

  <nav class="lesson-nav">
    <a href="{prev}.html">← Back: {Prev title}</a>
    <a href="{next}.html">Next: {Next title} →</a>
  </nav>
</article>
<script src="../../../assets/chat.js" defer></script>
<script src="../../../assets/toc.js" defer></script>
</body>
</html>
```

## Rules

- **The two script tags are load-bearing and must both be present**, in that order — `chat.js` injects the tutor widget after `.practice`; `toc.js` wraps the page content and adds the sidebar. Neither is optional.
- **Never fabricate a direct quote.** Paraphrase-with-citation is always safe; a `<blockquote>` is only safe once you've read the exact wording in a source you can name.
- **Cross-link at least one related lesson** via a real `<a href>`, not just a mention in prose.
- **The `teacher-note` sets the bar the tutor is instructed to check** (via that lesson's `grounding` field in the manifest) — write it so a learner knows what "got it" means before they start typing.
- **Keep it short.** One hook, one core idea (plus at most one "going deeper"), 2-3 exercises, one discussion question. If a lesson needs a second "going deeper" section, it's probably two lessons.
- **Use plain relative paths, correctly counted — never an absolute path (`/assets/...`) and never a dynamic `<base>` tag.** Both were tried and rejected. Absolute paths break the moment the site is deployed under a subpath (e.g. a GitHub Pages project site at `username.github.io/repo-name/` — an absolute `/assets/...` points at the *domain* root, not the site root, and 404s). A `<base>` tag set dynamically via `document.write` doesn't help either: Chromium's preload scanner fetches `<link>`/`<script src>` resources by scanning the raw HTML *before* any script runs, so it never sees the corrected base and 404s regardless of what the final DOM looks like. Plain relative paths, correctly counted for each file's real depth, are subpath-agnostic by construction and match how GitHub Pages, Netlify, and Cloudflare Pages actually serve files (none of them rewrite an exact `.html` URL by default — only the local `serve` dev tool does that, which is why `serve.json` in this repo sets `"cleanUrls": false`, so local testing matches production instead of lying to you).
- **The exact counts, from `books/<id>/lessons/NNNN-slug.html` (depth 3):** `../../../assets/...` for the stylesheet and both scripts (up 3, to site root); `../RESOURCES.md` for the source citation (up 1, to `books/<id>/`); bare `NNNN-other-slug.html` for prev/next nav and any inline cross-link to a sibling lesson (same directory, no `../` at all). Get the depth wrong in either direction and the page's own stylesheet, chat widget, and sidebar silently fail with no visible symptom except a 404 in the browser console — always verify with an actual browser console check (Playwright or equivalent), not just a curl status code on the HTML file itself, which will report 200 even when every sub-resource it references is broken.

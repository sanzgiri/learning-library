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
<link rel="stylesheet" href="/assets/lesson.css" />
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

  <p class="source-rec">Primary source: {citation with link} — see <a href="/books/{id}/RESOURCES.md">RESOURCES.md</a>.</p>

  <nav class="lesson-nav">
    <a href="{prev}.html">← Back: {Prev title}</a>
    <a href="{next}.html">Next: {Next title} →</a>
  </nav>
</article>
<script src="/assets/chat.js" defer></script>
<script src="/assets/toc.js" defer></script>
</body>
</html>
```

## Rules

- **The two script tags are load-bearing and must both be present**, in that order — `chat.js` injects the tutor widget after `.practice`; `toc.js` wraps the page content and adds the sidebar. Neither is optional.
- **Never fabricate a direct quote.** Paraphrase-with-citation is always safe; a `<blockquote>` is only safe once you've read the exact wording in a source you can name.
- **Cross-link at least one related lesson** via a real `<a href>`, not just a mention in prose.
- **The `teacher-note` sets the bar the tutor is instructed to check** (via that lesson's `grounding` field in the manifest) — write it so a learner knows what "got it" means before they start typing.
- **Keep it short.** One hook, one core idea (plus at most one "going deeper"), 2-3 exercises, one discussion question. If a lesson needs a second "going deeper" section, it's probably two lessons.
- **Every reference to `assets/` or a sibling book file must be an absolute path (`/assets/...`, `/books/<id>/RESOURCES.md`), never `../`-relative.** A real bug, found the hard way: several hosts (and the local `serve` dev server) normalize `/books/<id>/lessons/NNNN-slug.html` to an extension-less URL with no trailing slash. Once the browser is at that normalized URL, a `../../assets/` reference resolves against the wrong directory — it collapses two path levels into one — and the stylesheet, `chat.js`, and `toc.js` all silently 404, which breaks the page's own navigation and chat widget with no visible error except in the console. Same-directory links (prev/next lesson nav, no `../`) are unaffected and can stay relative.

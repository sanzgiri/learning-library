---
name: teach-book
description: Turn a book, author, or PDF into a chat-tutored course inside this library's multi-book static site.
disable-model-invocation: true
argument-hint: "Book title/author, or a path to a source PDF"
---

The user has pointed you at a book, an author, or a source PDF. Your job is to turn it into a chat-tutored course and register it alongside any other books already in this library — the same repeatable process, book after book.

## What this library is

This repo is a fully static, multi-book learning site: one shared `assets/` (stylesheet, chat widget, progress store), and one `books/<id>/` directory per book. There is no server and no server-held API key anywhere — visitors bring their own Anthropic key and chat with the tutor directly from their browser. Your job stops at producing deploy-ready static files; you never author a backend, and you never build a single-shot grading endpoint. Evaluation is a real, multi-turn Socratic conversation, powered by a `recordMastery` tool the tutor calls when it judges genuine understanding — not a score.

## Steps

1. **Establish the book workspace.** Derive a kebab-case book id from the title (one taught unit per id — a course spanning several physical books by one author, like an "Incerto," is still one id). Check `books/index.json` for an existing entry with this id; if found, resume rather than restart. *Done when:* `books/<id>/` exists and `books/index.json` has an entry for it with `"status": "in-progress"`.

2. **Mission interview.** Same posture as the base `teach` skill: push back on vagueness, interview until the *why* is concrete, one mission per book. Write `books/<id>/MISSION.md` per [MISSION-FORMAT.md](./MISSION-FORMAT.md). *Done when:* the file matches the format and the user has confirmed it reads correctly.

3. **Grounded resource research.** Build `books/<id>/RESOURCES.md` per [RESOURCES-FORMAT.md](./RESOURCES-FORMAT.md). Read primary sources in full — a glossary, an index, an author's own essays — rather than trusting a search-engine's summary of them; verify any quote before citing it (misattribution is a real failure mode: a quote that "sounds like" the author isn't evidence it's theirs); write an honest `## Gaps` section when a topic has no free primary source rather than inventing a citation. *Done when:* every Knowledge entry has a verified working URL and an annotation, and `## Gaps` is present even if it's short.

4. **Concept-coverage audit.** Find the book's own glossary, back-of-book index, or a terms page the author maintains; read it in full. Produce `books/<id>/concept-audit.md` per [CONCEPT-AUDIT-FORMAT.md](./CONCEPT-AUDIT-FORMAT.md): every keystone term gets a status of `covered <lesson-id>`, `planned`, or `deferred: <reason>`. This step exists because a casual pass misses things — running it properly *before* writing lessons is cheaper than discovering a keystone gap after the fact. *Done when:* no term from the book's own glossary/index is missing from the checklist.

5. **Author lessons.** For each concept slated this pass, write `books/<id>/lessons/NNNN-slug.html` per [LESSON-FORMAT.md](./LESSON-FORMAT.md). *Done when:* the file links the shared `../../assets/lesson.css` and `../../assets/chat.js`, contains every required section, and cross-links at least one related lesson.

6. **Build the grounding manifest.** Add or update `books/<id>/lessons/manifest.json` per [MANIFEST-FORMAT.md](./MANIFEST-FORMAT.md) for every lesson written. The `grounding` field is prompt content the tutor will read verbatim mid-conversation — write it that way, not as a human-facing summary. *Done when:* every lesson file has a matching manifest entry with every required field non-empty.

7. **Reconcile the concept audit.** Go back to `concept-audit.md` and mark every now-covered concept with its lesson id. *Done when:* no concept is still `planned` while a matching lesson already exists.

8. **Register the book in the shared library.** Update this book's entry in `books/index.json` (title, author, tagline, `"status": "active"`), and confirm `books/<id>/index.html` exists as a dashboard for this book alone. *Done when:* the root library page would list this book correctly with zero further edits.

9. **Deploy.** See [REGISTRATION-AND-DEPLOY.md](./REGISTRATION-AND-DEPLOY.md). *Done when:* the user has confirmed the live deploy shows the new book, or has the manual deploy command in hand.

## What you never build

No `server.js`-equivalent, no `.env`-equivalent, no server-side grading endpoint, no per-book copy of the shared stylesheet or chat widget — those live once in `assets/` and every book uses them as-is. No author-side `learning-records/` directory: the learner this skill serves is whoever visits the hosted site, not the person invoking this skill, and their mastery evidence lives in *their own browser's* progress document, not in this repo.

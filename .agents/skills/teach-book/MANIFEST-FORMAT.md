# manifest.json Format

`books/<id>/lessons/manifest.json` is a JSON array, one object per lesson file. This is what the chat tutor grounds its grading conversation in — treat every field as content the model will actually read, not documentation for a human skimming the repo.

## Schema

```json
{
  "id": "0001",
  "file": "0001-slug.html",
  "title": "Human-readable lesson title",
  "book": "Book or chapter this draws from",
  "grounding": "The concepts, definitions, and any verified quotes this lesson is grounded in — written as prompt content the tutor will read verbatim, not a summary for a human.",
  "sourceUrl": "https://... or null if the primary source is a physical book with no free excerpt",
  "relatedLessons": ["0002"],
  "conceptTags": ["kebab-case-term"]
}
```

## Rules

- **`grounding` is the whole point.** It's inserted directly into the tutor's system prompt for that lesson. Write it densely and precisely — definitions, the mechanism, a verified quote if you have one — not as flavor text. If the grounding is thin, the tutor will grade against its own general knowledge instead, which is exactly the failure mode this library exists to avoid.
- **`id` matches the lesson file's leading 4-digit prefix**, zero-padded. Every other script (`toc.js`, `chat.js`, `book-dashboard.js`, `library.js`) derives the id this same way — don't invent a different numbering scheme per book.
- **`sourceUrl` is `null`, not omitted, when there's genuinely no free source** — a missing key and an explicit `null` should not be treated the same by anything that reads this file.
- **`relatedLessons` should match real `<a href>` cross-links already in the lesson HTML**, not be invented separately from it.
- **`conceptTags` should match `concept-audit.md` and `GLOSSARY.md`** (if one exists) — same term, same spelling, everywhere.
- **Every lesson file needs an entry**, and every entry needs a matching file. A mismatch here breaks the sidebar, the dashboard, and the tutor's grounding simultaneously.

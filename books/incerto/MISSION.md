# Mission: Book → Deep Understanding AI Tutor (proof of concept: Taleb's Incerto)

## Why
Validate that the "teach" skill can take a book full of original, hard-to-paraphrase ideas and turn superficial reading into deep, applicable understanding — as a repeatable process, not a one-off. Taleb's Incerto is the proving ground because his ideas (antifragility, optionality, skin in the game) are unusually resistant to shallow summary, which makes them a good stress test for whether the pipeline produces real understanding or just the illusion of it.

## Success looks like
- The lesson-generation process (mission → resources → concept audit → lessons → manifest → registration) runs without book-specific logic baked into the mechanism — only the *content* is Taleb-specific, not the pipeline itself. It's now packaged as the `teach-book` skill and generalized: Incerto is book one in a shared multi-book library, not a one-off.
- Grading is grounded in cited sources (`RESOURCES.md`) and happens through genuine multi-turn Socratic chat, not a single-shot score — the tutor calls `recordMastery` mid-conversation when it judges real understanding, not recitation.
- The workspace conventions (citation format, lesson format, manifest schema) are clean enough that pointing `teach-book` at a *different* book means a new `books/<id>/` directory, not a pipeline rewrite.
- Lesson coverage of Incerto is comprehensive across concepts drawn from all five books plus the technical companion (16 lessons, cross-checked against Taleb's own glossary via a concept audit) — not just a proof-of-concept slice.
- Hosted and shareable: a visitor with their own Anthropic key can work through Incerto (or any other book in the library) without needing this repo or Claude Code.

## Constraints
- No server-held API keys, ever — evaluation depends on the visitor's own key, called directly from their browser.
- Progress must span all sessions, all lessons, and all books for one learner, persisted in their browser, with export/import as the cross-device mechanism (no database, no accounts, in this phase).
- Should still produce real Taleb understanding as a side effect — this isn't pure infrastructure with no content.

## Out of scope
- Real accounts / server-side cross-device sync — export/import is the current mechanism; a minimal sync-only backend (no LLM proxying) is the flagged upgrade path if that friction turns out to matter.
- OpenAI support for the chat tutor — Anthropic-only for now, since only Anthropic's API allows direct browser calls without a proxy.

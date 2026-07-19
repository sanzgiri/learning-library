# concept-audit.md Format

`books/<id>/concept-audit.md` is a checklist of every keystone term in the book's own glossary/index, cross-checked against what's actually been taught. It exists because casual research passes miss things — the Incerto course's first pass missed ergodicity, one of its most load-bearing ideas, because it relied on search summaries instead of reading the author's glossary in full. This step is how that doesn't happen again.

## Structure

```md
# {Book} Concept Audit

Checklist against {the book's own glossary/index, linked and named}, read in full.

## From {source} — status per term

| Term | Status |
|---|---|
| {Term} | covered {lesson-id} |
| {Term} | **planned** — {one line on why it's distinct enough to deserve its own lesson} |
| {Term} | deferred: {one line on why — usually "restates X" or "low marginal value alone"} |

## Net result
{N} deferred, {N} planned, {N} covered. {Which planned terms are the next lessons to write.}
```

## Rules

- **Find the source first.** Tiering, in order of confidence: (a) a glossary or index the author themselves wrote, (b) a publisher's back-of-book index, (c) chapter/section headings as a lower-confidence proxy — flag explicitly when using this tier, (d) if none exists, say so and proceed on interview judgment alone rather than blocking.
- **Read it in full**, not a search-engine's summary — a summary optimizes for what's *popular* to mention, not what's *complete*.
- **Every term gets a status**, not just the ones that turned into lessons. A term with no status is a term that might have been silently dropped.
- **`deferred` needs a real reason**, not just "not covered." If the reason is "restates term X," that's a legitimate reason — but it means you checked, not that you skipped it.
- **Re-run retroactively is fine.** If lessons already exist without a prior audit, running this against them (as was done for Incerto) still catches gaps — it just means some findings become `planned` for a next pass instead of blocking the current one.

# RESOURCES.md Format

`books/<id>/RESOURCES.md` is the curated set of trusted sources for this book. Lesson grounding text should be drawn from here, not from parametric guesses.

## Structure

```md
# {Book} Resources

## Knowledge

### Cross-cutting
- [Author's own glossary/index, if one exists](url) — primary.
  Use for: canonical definitions. First stop before paraphrasing a term from memory.

### {Concept cluster or chapter}
- [Title](url) — primary/secondary, and why it's trustworthy.
  Use for: what specifically to cite it for. Note any misquote risk explicitly.

## Blogs
- [Name](url) — secondary. What it's reliable for, and where to stop trusting it.

## Wisdom (Communities)
- [Name](url), or **checked, not found** with what you actually searched for — never cite an unverified community.

## Gaps
- {Any concept with no free primary source — say so, don't invent a citation.}
```

## Rules

- **High-trust only.** Prefer the author's own writing, primary interviews, and peer-reviewed or well-edited secondary sources. If a resource is marketing dressed as education, leave it out.
- **Read primaries in full before citing them**, not a search-engine's summary of them — a summary can miss the actual claim or misattribute a quote entirely.
- **Verify every quote** before it goes in a lesson. If you can't find the exact wording in a source you've actually read, don't present it as verbatim.
- **Annotate every entry** — a bare link is useless in three months.
- **Surface gaps explicitly** rather than filling them with a weak citation. A `## Gaps` section that's honest is more useful than one that's empty because a gap got papered over.
- **Prune ruthlessly.** Better five sharp sources than thirty mediocre ones.

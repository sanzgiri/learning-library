# GLOSSARY.md Format

`books/<id>/GLOSSARY.md` (optional) is the canonical language for this book's course, once one is worth maintaining — usually once a handful of lessons share overlapping terminology.

## Structure

```md
# {Book} Glossary

## Terms

**Term**:
Tight 1-2 sentence definition — what it IS, not how to apply it.
_Avoid_: looser synonyms that get used for the same idea.
```

## Rules

- **Add a term only once a lesson has actually taught it** — this is a record of compressed, earned knowledge, not a dictionary written in advance.
- **Be opinionated.** Pick the term the author themselves uses; list common looser synonyms as `_Avoid_` aliases.
- **Keep definitions tight** and reuse other glossary terms inside definitions once they exist.
- **Feed `conceptTags` in `manifest.json` from this file** once it exists, so a lesson's grounding and the glossary stay in the same language.

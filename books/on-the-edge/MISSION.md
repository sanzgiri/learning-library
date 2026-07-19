# Mission: On the Edge (Nate Silver)

## Why
Second book in the library, added specifically to test whether the `teach-book` pipeline generalizes past Taleb's Incerto — a completely different genre (contemporary reportage on gambling, tech, and existential risk, not a philosophical essay series) with its own vocabulary ("Riverian") rather than borrowed Taleb terms. Success here is evidence the pipeline is book-agnostic, not just Taleb-shaped.

## Success looks like
- A first-pass course (13 lessons) grounded in the actual book — the epub's full text and its own 250-plus-term glossary, "How to Speak Riverian" — not review summaries.
- The lessons capture Silver's actual argument (the River vs. the Village, expected value, decoupling) and its real edge cases (where EV-maximizing logic breaks: Pascal's Mugging, the Repugnant Conclusion, SBF's 5x-Kelly bet with the fate of the universe), not just a glossary of jargon.
- The book's own steelman critique of itself (the Village's case against the River, in Silver's own words) makes it into the course — a book that only teaches its own thesis uncritically isn't teaching the whole book.
- Registered and navigable alongside Incerto in the shared library with zero cross-book interference in progress tracking.

## Constraints
- First pass, not exhaustive: 13 lessons against a glossary of 250+ terms. Most terms are jargon/mechanics (poker hand names, betting terminology) rather than distinct ideas — `concept-audit.md` should say explicitly which were excluded and why, not just silently skip them.
- No server-held API key, same as every other book — grading is the visitor's own Anthropic key, chatting against this book's own manifest grounding.

## Out of scope
- Full poker/gambling mechanics (hand rankings, betting structure) — that's vocabulary, not an idea to master.
- A second pass covering the deferred glossary terms — noted as future work in `concept-audit.md`, not attempted now.

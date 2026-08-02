# The audit of the review docs, and where the work stopped

Written 2 August 2026, mid-build, because a session was running out. This file exists so the
work can be picked up without re-deriving any of it.

---

## Why there was an audit

Six reviews had been read and answered, one doc each, in `docs/reviews/01`–`06`. The owner
then asked the obvious question: *did you forget to adopt anything?*

Re-reading the docs could not answer that. The docs are summaries written by the same person
who might have dropped something — so anything lost between the pasted review and the doc
would be invisible. The originals were recovered instead, from the session transcript, using
the verbatim quotes the docs carry as search anchors. All six were found.

Sixteen agents: one recovery and one verification per review, three sweeps across the whole
set, one synthesis. 157 raw findings, deduplicated and spot-checked down to five tiers.

## What it found

**The judgement in the docs was sound. The bookkeeping was not.**

Every rejection that cites a non-negotiable by number holds up on inspection — the receipts
wall, the adults-only email list, the Dutch edition, the sponsored print runs, the Bright Kids
accreditation, the TAM figures. None of those needs re-arguing. Most "already built" rows
verify too.

The failure was mechanical. The commit that landed the six docs (`dfd40fb`) touched **six
markdown files and nothing else** — no `src/`, no `CLAUDE.md`, no `docs/for-ryan.md`, no
`docs/decisions.md`. So every "Adopt" was unbuilt, which is defensible as a backlog.

What was not defensible: **five places where the docs asserted state that did not exist.** A
doc claimed a correction had been applied to `/proof` and `CLAUDE.md` when neither file had
been touched. Six promises to add something to Ryan's list, against a file unchanged since
before the reviews. A governance rule described as "adopted into CLAUDE.md" that was never
written there — and which a later doc then cited as an existing rule when rejecting a
proposal. On a project whose entire claim is checkability, the record had become the thing
that was wrong.

Two other findings were worse than bookkeeping:

- `docs/decisions.md` instructed the second print run to encode the **hyphen-free domain** as
  its QR payload. That domain belongs to an unrelated company and is the reason the book was
  re-issued. Anyone acting on that entry would have printed a stranger's address in Ryan's
  book.
- The homepage still ran the retired scarcity pitch — *"What the book has that this site does
  not is the 15 stories, the Hill Remix essays and What It Means Now"* — which stopped being
  true the day the whole book was made free.

## What was being built when this stopped

Three workflows. The research one was stopped deliberately and wrote nothing to the repo.

**Corrections (done):** the QR payload, the false homepage claim, an "earned unlock" phrase
contradicting non-negotiable 7 inside the file that records why the non-negotiables exist, the
Mini Rookie / Minimax class mix-up, and the two false statements in the review docs themselves
— including one whose stated reasoning was disprovable from the repo's own front page.

**Ryan's voice (done):** four reviewers independently found that Ryan's own words appear
nowhere on this site, because "A Note From Ryan" on printed page 3 carries no build and so was
never in the extractor's scope — and the parser had been changed to stop *before* the
Afterword's closing line. It is now a `voice` collection in `src/content/data/voice.yaml`,
extracted verbatim, with assertions so it cannot silently drop again.

One reviewer proved the cost of that gap by accident: they nominated a sentence as "Ryan's
best line" and asked for it in the hero. It was site editorial, written for `/proof`. A
careful reader could not tell our voice from the author's and picked ours. That sentence must
never go in the hero — the substitution is the thing being corrected.

**In flight when the session ended:** page work across `index`, `proof`, `race-control`,
`worksheet/[id]`, `teachers`, `parents`, `get`, `editions`, `receipts`, `updates`, `hill`,
plus a new page for Ryan's own receipts, an adult-involvement trailer for the Shrink tool, a
certificate contradiction in `builds/index`, and indexable Reality Check URLs.

## What still has to happen

1. **Verify.** `astro check` and a build. Re-run the extraction and confirm every assertion
   passes and no previously-committed data file changed. Grep the whole repo for the
   hyphen-free domain — it must be zero.
2. **Review round.** Independent lenses over the diff: factual accuracy, the non-negotiables,
   tone for a thirteen-year-old, accessibility. Every finding adversarially verified before
   acting. This is where today's real defects were caught, not during the building.
3. **Design round with screenshots.** 320px upward, dark and light, print emulation, CLS under
   throttling, Lighthouse. The measurable design rules: no white text on orange (2.05:1), teal
   and orange carry no text in light mode, no fourth flag colour, 65ch prose cap, 24×24
   targets, `prefers-reduced-motion` honoured absolutely.
4. **Then commit.**

## Open, and not ours to close

`docs/for-ryan.md` is the authoritative owner's list and was rewritten. `docs/decisions.md`
carries a second, shorter list that disagrees with it; the two should be reconciled to one.

The most urgent item is unchanged and cannot be closed by writing better copy: **the helpline.**
Every Reality Check promises to name who to raise a thing with, and the answer is currently
"an adult in the room". Teenagers with no safe adult exist. Two organisations were named by a
reviewer and dropped from the doc: **113 (Netherlands)** and **Childline (UK)**.

The one item with an external clock: three near-miss domains were checked at registrar level
and found free — `teen-and-grow-rich.com`, `teenandgrowrich.nl`, `teen-andgrowrich.nl`. This
project has already lost the hyphen-free `.com` to a stranger once.

Two facts settled during the audit, both now on the owner's list: `brightkids.ai` still reads
*"Ryan Rijvers is the 12-year-old founder"* in the present tense while the book and this site
say thirteen — almost certainly a sentence that expired rather than an error. And the karting
record is no longer blocked on the family: four claims verified against independent Dutch
motorsport press from 2022 and 2023. The F4 car is the exception — the family confirmed it,
no publication carries it, and the only source for the adjacent ambition claim returns 404,
so it needs an archive copy or it cannot be cited at all.

## The rule that was missing

Review 3's test, now written into `CLAUDE.md` where it always should have been: **before any
new tool, partner, product, page or interview, ask whether it could be written up in the
append-only changelog without contradicting the method.** If not, do not do it.

It works because this site already publishes its own reversals. A decision that cannot survive
that treatment is a decision that opens a gap between what the project says and what it does —
and one gap is enough, because the absence of that gap is the whole product.

This file is itself an application of that test. The failure it records is one the project's
own method predicts: a claim written in the past tense before the work existed.

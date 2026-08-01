"""
Extract every structured item from the printed book into YAML.

The printed book is the source of truth for all site copy. This script is the only
sanctioned way to get that copy into the site, so that a reviewer can diff a YAML
file against the printed page and see that nothing was paraphrased, softened or
invented.

Run from the repo root:

    python tools/extract_book_content.py

Writes to src/content/data/*.yaml and prints a verification table. Requires pymupdf
and pyyaml.

Page numbering: PDF page N holds printed page N-1 in the digital edition.
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

try:
    import fitz  # pymupdf
except ImportError:
    sys.exit("pymupdf is required:  python -m pip install pymupdf")

try:
    import yaml
except ImportError:
    sys.exit("pyyaml is required:  python -m pip install pyyaml")

ROOT = Path(__file__).resolve().parent.parent
PDF = ROOT / "03_Teen_and_Grow_Rich_DIGITAL_READING_EDITION_66P_NEW_DOMAIN.pdf"
OUT = ROOT / "src" / "content" / "data"

RUNNING_HEADER = "TEEN & GROW RICH"
RUNNING_STRAP = "SKILLS. FREEDOM. MONEY. MEANING."

CHAPTERS = [
    ("dream-big", "Dream Big", "Desire"),
    ("believe-it", "Believe It", "Faith"),
    ("manifest-it", "Manifest It", "Autosuggestion"),
    ("level-up", "Level Up", "Specialized Knowledge"),
    ("create-magic", "Create Magic", "Imagination"),
    ("game-plan", "Game Plan", "Organized Planning"),
    ("boss-decisions", "Boss Decisions", "Decision"),
    ("unstoppable", "Unstoppable", "Persistence"),
    ("squad-goals", "Squad Goals", "The Master Mind"),
    ("fearless", "Fearless", "Outwitting The Ghosts Of Fear"),
    ("money-mindset", "Money Mindset", "Riches Made Practical"),
    ("vibe-check", "Vibe Check", "The Brain: Broadcasting & Receiving"),
    ("intuition-flow", "Intuition Flow", "The Sixth Sense"),
    ("mindful-tech", "Mindful Tech", "The Subconscious Mind"),
    ("real-rich", "Real Rich", "Definite Purpose - The Full System"),
]


def blocks(doc, pdf_page: int) -> list[str]:
    """Paragraph-level text blocks for one PDF page, in reading order.

    Running header, running strapline and the folio are dropped. The folio is a bare
    number, and so is every step number in "The Play" — the only thing separating them
    is vertical position, so bare numbers are only discarded in the header and footer
    bands. Filtering them by pattern alone silently deletes all 75 Play steps.
    """
    page = doc[pdf_page - 1]
    height = page.rect.height
    header_band = 45.0
    footer_band = height - 60.0

    raw = page.get_text("blocks")
    raw.sort(key=lambda b: (round(b[1], 1), round(b[0], 1)))
    out = []
    for b in raw:
        y = b[1]
        text = " ".join(line.strip() for line in b[4].strip().splitlines() if line.strip())
        text = re.sub(r"\s+", " ", text).strip()
        if not text:
            continue
        if text in (RUNNING_HEADER, RUNNING_STRAP, f"{RUNNING_HEADER} {RUNNING_STRAP}"):
            continue
        if re.fullmatch(r"\d{1,3}", text) and (y < header_band or y > footer_band):
            continue
        out.append(text)
    return out


def split_at(items: list[str], marker: str) -> tuple[list[str], list[str]]:
    """Split a block list at the first block equal to marker (marker dropped)."""
    for i, t in enumerate(items):
        if t == marker:
            return items[:i], items[i + 1 :]
    raise ValueError(f"marker not found: {marker!r}")


def take_until(items: list[str], markers: tuple[str, ...]) -> tuple[list[str], list[str]]:
    for i, t in enumerate(items):
        if t in markers:
            return items[:i], items[i:]
    return items, []


def parse_play(items: list[str]) -> list[dict]:
    """The Play renders each step as ONE block: "3 Shrink the first step. Make it so..."

    The bold lead-in is the step title and always ends in a full stop, so the title is
    everything up to and including the first '.' and the remainder is the body.
    """
    steps: list[dict] = []
    for block in items:
        m = re.match(r"^([1-9])\s+(.+)$", block)
        if not m:
            continue
        body = m.group(2).strip()
        t = re.match(r"^(.{2,60}?\.)\s+(.*)$", body)
        steps.append(
            {
                "n": int(m.group(1)),
                "title": t.group(1).strip() if t else "",
                "text": (t.group(2) if t else body).strip(),
            }
        )
    steps.sort(key=lambda s: s["n"])
    return steps


def parse_chapter(doc, n: int) -> dict:
    slug, title, principle = CHAPTERS[n - 1]
    opener = 11 + 3 * (n - 1)
    items = blocks(doc, opener) + blocks(doc, opener + 1) + blocks(doc, opener + 2)

    eyebrow_block = items[0]
    # The opener merges eyebrow + title into one block.
    eyebrow = eyebrow_block.split(title)[0].strip() if title in eyebrow_block else eyebrow_block
    rest = items[1:]

    subtitle = rest[0]
    rest = rest[1:]

    _, rest = split_at(rest, "HILL'S ORIGINAL IDEA")
    hill_block = rest[0]
    rest = rest[1:]
    # "Desire Choose one goal you care enough..." -> term + text
    if hill_block.startswith(principle):
        hill_term, hill_text = principle, hill_block[len(principle) :].strip()
    else:
        parts = hill_block.split(" ", 1)
        hill_term, hill_text = parts[0], (parts[1] if len(parts) > 1 else "")

    _, rest = split_at(rest, "The Story")
    story, rest = take_until(rest, ("THE HILL REMIX",))

    _, rest = split_at(rest, "THE HILL REMIX")
    remix, rest = take_until(rest, ("What It Means Now",))

    _, rest = split_at(rest, "What It Means Now")
    means_now, rest = take_until(rest, ("The Play",))

    _, rest = split_at(rest, "The Play")
    play_raw, rest = take_until(rest, ("YOUR 24-HOUR BUILD",))

    _, rest = split_at(rest, "YOUR 24-HOUR BUILD")
    build, rest = take_until(rest, ("REALITY CHECK",))

    _, rest = split_at(rest, "REALITY CHECK")
    check, rest = take_until(rest, ("Debrief",))

    _, rest = split_at(rest, "Debrief")
    debrief = [
        re.sub(r"^[••\-\s]+", "", t).strip()
        for t in rest
        if t not in ("•",) and len(t) > 3
    ]

    return {
        # Astro's file() loader keys entries on `id`.
        "id": slug,
        "n": n,
        "slug": slug,
        "title": title,
        "eyebrow": eyebrow,
        "subtitle": subtitle,
        "hillPrinciple": principle,
        "printedPage": opener - 1,
        "hillIdea": {"term": hill_term, "text": hill_text},
        "story": story,
        "hillRemix": " ".join(remix),
        "whatItMeansNow": " ".join(means_now),
        "play": parse_play(play_raw),
        "build": " ".join(build),
        "realityCheck": " ".join(check),
        "debrief": debrief,
    }


def sized_blocks(doc, pdf_page: int) -> list[tuple[str, float]]:
    """Blocks paired with their largest font size, for pages where a marker is not enough."""
    page = doc[pdf_page - 1]
    height = page.rect.height
    out: list[tuple[str, float]] = []
    for b in page.get_text("dict")["blocks"]:
        if "lines" not in b:
            continue
        y = b["bbox"][1]
        spans = [s for line in b["lines"] for s in line["spans"]]
        if not spans:
            continue
        text = re.sub(r"\s+", " ", " ".join(s["text"] for s in spans)).strip()
        if not text or text in (RUNNING_HEADER, RUNNING_STRAP):
            continue
        if re.fullmatch(r"\d{1,3}", text) and (y < 45.0 or y > height - 60.0):
            continue
        out.append((text, max(s["size"] for s in spans)))
    return out


def parse_extra_build(doc, pdf_page: int, ident: str, source: str) -> dict:
    """The four 24-Hour Builds that sit outside the 15 chapters.

    Two of these pages carry no REALITY CHECK, so a marker-based stop runs straight on
    into the next section: printed page 4 swallowed "The tone rule" and printed page 62
    swallowed the closing line "START TINY. STAY HONEST. BUILD RECEIPTS." Both then
    rendered to readers as part of the build instruction.

    The reliable boundary is typographic, not textual. A build body is set at body size
    (~8.3pt); whatever follows the box is a heading or a display line set noticeably
    larger. So the body runs until the first block that steps up in size.
    """
    items = sized_blocks(doc, pdf_page)
    start = next(i for i, (t, _) in enumerate(items) if t == "YOUR 24-HOUR BUILD")

    body: list[str] = []
    body_size: float | None = None
    i = start + 1
    while i < len(items):
        text, size = items[i]
        if text == "REALITY CHECK":
            break
        if body_size is None:
            body_size = size
        elif size > body_size + 0.5:
            break  # a heading — the build box ended above this
        body.append(text)
        i += 1

    check: list[str] = []
    if i < len(items) and items[i][0] == "REALITY CHECK":
        check_size: float | None = None
        for text, size in items[i + 1 :]:
            if check_size is None:
                check_size = size
            elif size > check_size + 0.5:
                break
            check.append(text)

    return {
        "id": ident,
        "source": source,
        "printedPage": pdf_page - 1,
        "build": " ".join(body),
        "realityCheck": " ".join(check),
    }


STARTING_POINT = [
    "MY NAME",
    "START DATE",
    "THE DREAM THAT KEEPS RETURNING",
    "ONE SKILL I WANT TO BUILD",
    "ONE PROBLEM I CARE ABOUT",
    "MY 30-DAY PROOF",
    "MY SAFE WITNESS",
]
OFFER_CANVAS = [
    "WHO I HELP",
    "THE PROBLEM",
    "THE RESULT",
    "THE DELIVERABLE",
    "THE DEADLINE",
    "THE STARTER PRICE",
    "THE PROOF",
    "THE SAFE CONTACT ROUTE",
    "THE STOP RULES",
]
REAL_RICH_PLAN = [
    "MY 90-DAY GOAL",
    "THE SKILL I AM BUILDING",
    "THE PROBLEM I SOLVE",
    "MY THREE PROOF PROJECTS",
    "MY SAFE WITNESS",
    "MY WEEKLY BUILD BLOCKS",
    "MY FIRST OFFER",
    "MY MONEY SPLIT",
    "MY STOP RULES",
    "MY REAL RICH SCOREBOARD",
]
OFFER_NAMES = [
    "One-page website",
    "Short-form editing",
    "Product photos",
    "Study support",
    "Research brief",
    "Digital setup",
    "Event launch page",
]
SCOREBOARD = ["Skills", "Health", "Time", "People", "Money", "Impact"]


def slugify(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


def parse_worksheet(doc, pdf_page: int, labels: list[str], stop: tuple[str, ...] = ()) -> list[dict]:
    """Worksheet rows render as one block per row, with the label and its hint merged.

    This used to join the whole page and slice between labels by string index, which
    silently misfiled every row whose label wraps onto two printed lines: "MY THREE PROOF
    PROJECTS" and "MY REAL RICH SCOREBOARD" both wrap, so their hints landed on the
    preceding field and their own hints came out empty. A reader saw "THE PROBLEM I SOLVE
    — Who benefits, and from what result? 1. 2. 3."

    A row is not always one block, either. Where the label wraps onto two printed lines,
    the label cell and the value cell become separate blocks that share a y within a
    fraction of a point, and the value sorts fractionally *first*. So group blocks into
    rows by vertical position, then read left to right within the row.

    The fill-in rules are kept rather than deleted. Stripping them turned "I help ______
    get ______ by ______." into "I help get by ." — a sentence a 13-year-old cannot parse.
    """
    page = doc[pdf_page - 1]
    height = page.rect.height

    cells: list[tuple[float, float, str]] = []
    for b in page.get_text("blocks"):
        y, x = b[1], b[0]
        text = re.sub(r"\s+", " ", " ".join(b[4].split())).strip()
        if not text or text in (RUNNING_HEADER, RUNNING_STRAP, f"{RUNNING_HEADER} {RUNNING_STRAP}"):
            continue
        if re.fullmatch(r"\d{1,3}", text) and (y < 45.0 or y > height - 60.0):
            continue
        cells.append((y, x, text))
    cells.sort()

    rows: list[list[tuple[float, str]]] = []
    for y, x, text in cells:
        if rows and abs(y - rows[-1][0][0]) < 4.0:
            rows[-1].append((x, text))  # type: ignore[arg-type]
        else:
            rows.append([(y, "")])  # sentinel carrying the row's y
            rows[-1].append((x, text))  # type: ignore[arg-type]

    fields: list[dict] = []
    seen: set[str] = set()

    for row in rows:
        parts = sorted((x, t) for x, t in row[1:])
        if any(t.startswith(s) for _, t in parts for s in stop):
            break
        label = next(
            (
                candidate
                for candidate in sorted(labels, key=len, reverse=True)
                for _, t in parts
                if t.startswith(candidate) and candidate not in seen
            ),
            None,
        )
        if not label:
            continue
        seen.add(label)

        pieces = []
        for _, t in parts:
            pieces.append(t[len(label) :] if t.startswith(label) else t)
        hint = re.sub(r"_{3,}", "___", " ".join(p for p in pieces if p.strip()))
        hint = re.sub(r"\s+", " ", hint).strip()
        if hint in {"___", "___ ___"}:
            hint = ""  # a row that is only a rule carries no printed hint
        fields.append({"id": slugify(label), "label": label, "hint": hint})

    missing = [l for l in labels if l not in seen]
    if missing:
        raise ValueError(f"worksheet labels not found on PDF page {pdf_page}: {missing}")

    fields.sort(key=lambda f: labels.index(f["label"]))
    return fields


def parse_offers(doc, pdf_page: int) -> list[dict]:
    """Seven Safe First Offers, read by table column rather than by text block.

    The first version grouped `get_text("blocks")` by rounded y and required two blocks per
    row: the left one holding offer name + deliverable, the right one the proof. That held
    for the original print file and broke on the re-issued edition, where PyMuPDF merges the
    proof into the left block on five of the seven rows. The parser found two offers,
    asserted, and had already written the truncated file — the assertion caught it, which is
    what it is for, but the data was gone until it was restored from git.

    Block grouping is a property of the PDF producer, not of the book. The table is not: its
    three columns sit at fixed x positions, so this reads words and assigns each to a column
    by where it starts. A new row begins whenever a word appears in the first column.
    """
    # Measured on the page itself: offer 57.7, deliverable 136.7, proof 269.9.
    COL_DELIVERABLE = 120.0
    COL_PROOF = 265.0

    words = doc[pdf_page - 1].get_text("words")
    words.sort(key=lambda w: (round(w[1], 1), round(w[0], 1)))

    rows: list[dict[str, list[str]]] = []
    for x0, y0, _x1, _y1, word, *_ in words:
        # The table body only. Above it: running header, title, standfirst, column heads.
        # Below it: the Reality Check box and the folio.
        if y0 < 145 or y0 > 430:
            continue
        col = "offer" if x0 < COL_DELIVERABLE else ("deliverable" if x0 < COL_PROOF else "firstProof")
        if col == "offer" and (not rows or rows[-1]["_started"]):
            rows.append({"offer": [], "deliverable": [], "firstProof": [], "_started": []})
            rows[-1]["_started"] = []
        if not rows:
            continue
        # A word back in the offer column after the row already has deliverable text is the
        # next offer, not a continuation of this one.
        if col == "offer" and rows[-1]["deliverable"]:
            rows.append({"offer": [], "deliverable": [], "firstProof": [], "_started": []})
        rows[-1][col].append(word)

    offers = []
    for row in rows:
        name = " ".join(row["offer"]).strip()
        if name not in OFFER_NAMES:
            continue
        offers.append(
            {
                "id": slugify(name),
                "n": OFFER_NAMES.index(name) + 1,
                "offer": name,
                "deliverable": re.sub(r"\s+", " ", " ".join(row["deliverable"])).strip(),
                "firstProof": re.sub(r"\s+", " ", " ".join(row["firstProof"])).strip(),
            }
        )
    offers.sort(key=lambda o: o["n"])
    return offers


def parse_bulleted_groups(
    doc,
    pages: list[int],
    heading_re: str,
    stop: tuple[str, ...] = (),
) -> list[dict]:
    """Weeks and phases, which the book typesets two different ways.

    The 30-Day Tiny Launch puts the week heading in the same block as its first bullet
    ("WEEK 1 - CHOOSE • Day 1: ..."). The 90-Day path gives each phase heading its own
    block and lets its bullets follow, and Phase 3 runs over a page break. Handle both,
    across however many pages the sequence spans.
    """
    groups: list[dict] = []
    for pdf_page in pages:
        for block in blocks(doc, pdf_page):
            if any(block.startswith(s) for s in stop):
                return groups

            merged = re.match(heading_re + r"\s*•\s*(.*)$", block)
            if merged:
                head = merged.group(1).strip()
                first = re.sub(r"^[••\s]+", "", merged.group(2)).strip()
                groups.append(
                    {
                        "id": slugify(head),
                        "heading": head,
                        "items": [first] if first else [],
                    }
                )
                continue

            heading_only = re.fullmatch(heading_re, block)
            if heading_only:
                head = heading_only.group(1).strip()
                groups.append({"id": slugify(head), "heading": head, "items": []})
                continue

            if groups and block.lstrip().startswith("•"):
                groups[-1]["items"].append(re.sub(r"^[••\s]+", "", block).strip())
    return groups


def main() -> None:
    if not PDF.exists():
        sys.exit(f"book PDF not found at {PDF}")
    doc = fitz.open(PDF)
    OUT.mkdir(parents=True, exist_ok=True)

    chapters = [parse_chapter(doc, n) for n in range(1, 16)]

    # Builds outside the chapters. Page numbers are PDF indices.
    extras = [
        parse_extra_build(doc, 5, "receipts-folder", "How To Use This Book"),
        parse_extra_build(doc, 57, "first-offer", "From Skill To First Honest Income"),
        parse_extra_build(doc, 60, "tiny-launch", "The 30-Day Tiny Launch"),
        parse_extra_build(doc, 63, "commitment", "Afterword"),
    ]

    builds = [
        {
            "id": extras[0]["id"],
            "n": 1,
            "source": extras[0]["source"],
            "printedPage": extras[0]["printedPage"],
            "build": extras[0]["build"],
            "realityCheck": extras[0]["realityCheck"],
        }
    ]
    for i, c in enumerate(chapters, start=2):
        builds.append(
            {
                "id": c["slug"],
                "n": i,
                "source": f"Chapter {c['n']:02d} — {c['title']}",
                "chapter": c["n"],
                "printedPage": c["printedPage"] + 2,
                "build": c["build"],
                "realityCheck": c["realityCheck"],
            }
        )
    for i, e in enumerate(extras[1:], start=17):
        builds.append({**e, "n": i})

    reality_checks = [
        {"id": b["id"], "build": b["n"], "printedPage": b["printedPage"], "text": b["realityCheck"]}
        for b in builds
        if b["realityCheck"]
    ]

    # Three Reality Checks are NOT attached to a build. They belong to the front matter,
    # the Starting Point worksheet and the Seven Safe First Offers table. Verified by
    # scanning every page for the marker: 19 total = 15 chapters + 1 (90-day build) + 3.
    for ident, pdf_page, belongs_to in [
        ("publishing-note", 3, "Publishing Note"),
        ("starting-point", 10, "Your Starting Point"),
        ("seven-safe-offers", 58, "Seven Safe First Offers"),
    ]:
        items = blocks(doc, pdf_page)
        _, rest = split_at(items, "REALITY CHECK")
        text, _ = take_until(
            rest,
            (
                # The Publishing Note's own line. It changed with the re-issue that moved the
                # book to the hyphenated domain; both spellings stay here so the extraction
                # still runs against an older print file.
                "Website: teen-andgrowrich.com",
                "Website: teenandgrowrich.com",
                "Debrief",
                "Your First Offer Canvas",
                "The tone rule",
            ),
        )
        reality_checks.append(
            {
                "id": ident,
                "build": None,
                "belongsTo": belongs_to,
                "printedPage": pdf_page - 1,
                "text": " ".join(text),
            }
        )
    reality_checks.sort(key=lambda r: r["printedPage"])

    def dump(name: str, payload) -> None:
        path = OUT / name
        with path.open("w", encoding="utf-8") as fh:
            fh.write(
                "# GENERATED by tools/extract_book_content.py — do not hand-edit.\n"
                "# Source of truth is the printed book. Re-run the script instead.\n"
            )
            yaml.safe_dump(payload, fh, allow_unicode=True, sort_keys=False, width=100)
        print(f"  wrote {path.relative_to(ROOT)}")

    worksheets = [
        {
            "id": "starting-point",
            "title": "Your Starting Point",
            "subtitle": "Do not wait until the last page to decide what this book is for.",
            "printedPage": 9,
            "fields": parse_worksheet(doc, 10, STARTING_POINT, stop=("REALITY CHECK",)),
        },
        {
            "id": "first-offer-canvas",
            "title": "Your First Offer Canvas",
            "subtitle": "A good offer is a clear result, not a list of tools.",
            "printedPage": 58,
            "fields": parse_worksheet(doc, 59, OFFER_CANVAS),
        },
        {
            "id": "real-rich-plan",
            "title": "Your One-Page Real Rich Plan",
            "subtitle": "Fill this page, then turn it into a website dashboard or printable worksheet.",
            "printedPage": 60,
            "fields": parse_worksheet(doc, 61, REAL_RICH_PLAN),
        },
        {
            "id": "real-rich-scoreboard",
            "title": "Real Rich Scoreboard",
            "subtitle": "Score each from 1 to 10. Choose one action for the lowest area.",
            "printedPage": 54,
            "fields": [
                {"id": slugify(d), "label": d, "hint": "Score 1-10"} for d in SCOREBOARD
            ],
        },
    ]

    sequences = [
        {
            "id": "ninety-day",
            "title": "From Skill To First Honest Income",
            "subtitle": 'The fastest safe path is not "find a hack." It is "become useful, prove it, offer it, improve it."',
            "printedPage": 55,
            "groups": parse_bulleted_groups(
                doc,
                [56, 57],
                r"^(Phase \d[^•]*?)",
                stop=("YOUR 24-HOUR BUILD",),
            ),
        },
        {
            "id": "tiny-launch",
            "title": "The 30-Day Tiny Launch",
            "subtitle": "One month to move from idea to proof - without pretending you have a company before you have a result.",
            "printedPage": 59,
            "groups": parse_bulleted_groups(
                doc,
                [60],
                r"^(WEEK \d[^•]*?)",
                stop=("YOUR 24-HOUR BUILD",),
            ),
        },
    ]

    offers = parse_offers(doc, 58)

    dump("chapters.yaml", chapters)
    dump("builds.yaml", builds)
    dump("reality-checks.yaml", reality_checks)
    dump("worksheets.yaml", worksheets)
    dump("sequences.yaml", sequences)
    dump("offers.yaml", offers)

    play_total = sum(len(c["play"]) for c in chapters)
    debrief_total = sum(len(c["debrief"]) for c in chapters)

    print("\n  VERIFICATION")
    ws = {w["id"]: len(w["fields"]) for w in worksheets}
    seq = {s["id"]: sum(len(g["items"]) for g in s["groups"]) for s in sequences}
    seq_groups = {s["id"]: len(s["groups"]) for s in sequences}

    rows = [
        ("chapters", len(chapters), 15),
        ("24-hour builds", len(builds), 19),
        ("reality checks", len(reality_checks), 19),
        ("play steps", play_total, 75),
        ("debrief questions", debrief_total, 45),
        ("starting point fields", ws.get("starting-point", 0), 7),
        ("offer canvas fields", ws.get("first-offer-canvas", 0), 9),
        ("real rich plan fields", ws.get("real-rich-plan", 0), 10),
        ("scoreboard dimensions", ws.get("real-rich-scoreboard", 0), 6),
        ("90-day phases", seq_groups.get("ninety-day", 0), 3),
        ("90-day actions", seq.get("ninety-day", 0), 13),
        ("tiny launch weeks", seq_groups.get("tiny-launch", 0), 4),
        ("tiny launch tasks", seq.get("tiny-launch", 0), 21),
        ("safe first offers", len(offers), 7),
    ]
    ok = True
    for label, got, want in rows:
        flag = "OK " if got == want else "FAIL"
        if got != want:
            ok = False
        print(f"  [{flag}] {label:<20} {got:>4} / {want}")

    for c in chapters:
        problems = []
        if len(c["play"]) != 5:
            problems.append(f"{len(c['play'])} play steps")
        if len(c["debrief"]) != 3:
            problems.append(f"{len(c['debrief'])} debrief questions")
        if not c["build"]:
            problems.append("empty build")
        if not c["realityCheck"]:
            problems.append("empty reality check")
        if not c["hillIdea"]["text"]:
            problems.append("empty hill idea")
        if problems:
            ok = False
            print(f"  [FAIL] chapter {c['n']:02d} {c['slug']}: {', '.join(problems)}")

    print("\n  " + ("all checks passed" if ok else "CHECKS FAILED — fix before use"))
    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()

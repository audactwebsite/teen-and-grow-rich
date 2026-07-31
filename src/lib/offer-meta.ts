/**
 * "Not for" — one honest disqualifier per Safe First Offer.
 *
 * The single best piece of writing on this site is the "who it is not for" list on /get.
 * It is marketing that costs the seller something, and it works precisely because it does.
 * /offers is where a thirteen-year-old decides which piece of paid work to actually take
 * on, which is the moment that voice is worth most — and it was the one place the site
 * only said what each offer is.
 *
 * Not here: anything about money. No rates, no "worth €X", no "you could earn". The book's
 * disclaimer applies to this file first (non-negotiable 4).
 *
 * The lines are site-authored, so they live here rather than in offers.yaml, which is
 * generated verbatim from the printed book by tools/extract_book_content.py and rewritten
 * on every run. Same boundary as _checks.ts: one file is the book, one file is us.
 */

export interface OfferMeta {
  /** Matches the id in src/content/data/offers.yaml. */
  id: string;
  /** Who should walk away, in the second person, without moralising about it. */
  notFor: string;
}

const META: OfferMeta[] = [
  {
    id: "one-page-website",
    notFor:
      "Not for you if you have never finished one page for yourself. Build the demo first — the version where nobody is waiting and nothing goes wrong if it takes three evenings.",
  },
  {
    id: "short-form-editing",
    notFor:
      "Not for you if the footage is of other people and you have not asked them. Someone else's face is not yours to post, and finding that out after you have delivered is the expensive way.",
  },
  {
    id: "product-photos",
    notFor:
      "Not for you if it means going to a stranger's home or a lock-up to photograph their stock. That is a red-flag situation whatever the job is called: an adult goes, or it does not happen.",
  },
  {
    id: "study-support",
    notFor:
      "Not for you if the person needs more help than you can give. Tutoring someone who is genuinely behind is a job for a teacher, and taking it on because you were asked is how both of you end up stuck.",
  },
  {
    id: "research-brief",
    notFor:
      "Not for you if you cannot check the sources yourself. A brief that confidently repeats something wrong is worse than no brief, and your name is on it.",
  },
  {
    id: "digital-setup",
    notFor:
      "Not for you if it means holding someone else's passwords, logins or customer list. You do not want that, and they should not offer it — an adult sets up the access.",
  },
  {
    id: "event-launch-page",
    notFor:
      "Not for you if your name and contact details end up on the page as the person to call. The event needs an adult as its public contact, not a thirteen-year-old.",
  },
];

const BY_ID = new Map(META.map((m) => [m.id, m]));

export function offerMeta(id: string): OfferMeta {
  const m = BY_ID.get(id);
  if (!m) {
    throw new Error(
      `No "not for" line for offer "${id}". Every one of the Seven Safe First Offers must ` +
        "carry one — the whole point is that the list is complete, not that it is decorated.",
    );
  }
  return m;
}

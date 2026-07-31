/**
 * The flag, the timer length and the adult-free green variant for each of the 19 builds.
 *
 * NONE OF THESE VALUES IS IN THE EXTRACTED DATA, and that is the first thing to know
 * about this file. `builds.yaml` carries exactly what the book prints — the instruction,
 * the source, the printed page and the Reality Check. The book does not print a flag, a
 * duration or a smaller version beside each build. But D12 requires every build to carry
 * a flag, `docs/content-inventory.md` requires "a timer sized to the build", and spec §8
 * requires every yellow and red build to have a version that needs no adult, so all three
 * have to be derived somewhere. This is that somewhere, so there is exactly one place to
 * audit and exactly one place to correct.
 *
 * ---------------------------------------------------------------------------
 * The flag is applied, not invented.
 *
 * The book defines the three levels itself, on printed page 61 under "For Parents &
 * Guardians", verbatim:
 *
 *   green   "low-cost and reversible"
 *   yellow  "public posting, small spending, or contact with new people" — check in
 *   red     "contracts, financial products, travel, identity documents, large payments,
 *            or in-person meetings" — direct adult involvement
 *
 * Each entry below applies that rule to the build AS PRINTED, never to where the build
 * might eventually lead — otherwise every build ends up red and the distinction stops
 * carrying information. So Chapter 8's seven-day streak is green (private, reversible)
 * even though its Reality Check is about burnout, and Chapter 11 is yellow because the
 * build itself is about money even though sorting past purchases moves none.
 *
 * TO REVIEW: read each `why` against the printed page named in the entry. If a flag is
 * wrong it is wrong here and nowhere else. Any surface showing a flag must also say, in
 * words, that this is the site applying the book's page-61 rule rather than a mark the
 * book prints per build.
 *
 * Where two readings were both defensible, the stricter one is taken. A reader must never
 * meet a weaker flag on a chapter page than on the build page it links to, which is why
 * this module is the only table: `src/pages/build/[n].astro` used to keep a second copy
 * and the two drifted.
 *
 * ---------------------------------------------------------------------------
 * The timer length is stated or standard, and the UI must say which.
 *
 * Where the build text itself names a duration, that number is used and
 * `minutesFromBook` is true. Where it does not, the timer falls back to the site's
 * standard 20-minute first step and `minutesFromBook` is false. A page showing the
 * second kind must mark it, because presenting an invented estimate as though the book
 * had given one is the same defect as inventing the copy.
 *
 * ---------------------------------------------------------------------------
 * The green variant is required for every yellow and red build (spec §8, D25).
 *
 * The safety system's single point of failure is that it outsources the gate to an adult
 * who may be absent, working nights or unsupportive, and that failure is silent by
 * design. So every yellow and red build has a smaller version that terminates in nobody.
 * This is interface copy, not book copy, and it is written to be plain: it never suggests
 * that skipping the gate is the clever move, because the book says the opposite and it is
 * right. `buildMeta()` throws if a non-green build is missing one.
 */

export type BuildFlag = "green" | "yellow" | "red";

export interface BuildMeta {
  flag: BuildFlag;
  /** The reasoning, against the book's page-61 definition. Written to be audited. */
  why: string;
  /** Length of the timer on the build page. */
  minutes: number;
  /** True only when the build text itself names this duration. */
  minutesFromBook: boolean;
  /** Only where the book splits the work into blocks a single timer cannot express. */
  timeNote?: string;
  /** Required for every yellow and red build. Never present on a green one. */
  green?: string;
}

/** The site's standard first step when the book sets no length. Also the size of the
 *  first steps the Shrink My First Step tool returns, so the two agree. */
const DEFAULT_MINUTES = 20;

const META: Record<string, BuildMeta> = {
  "receipts-folder": {
    flag: "green",
    why: "Starting a folder of your own evidence is low-cost and reversible. Nothing is spent, posted, or shown to anyone.",
    minutes: 10,
    minutesFromBook: false,
  },
  "dream-big": {
    flag: "green",
    why: "Writing a dream and making one piece of evidence is private and reversible, and the Reality Check states outright that the dream does not have to be posted publicly.",
    minutes: 20,
    minutesFromBook: true,
  },
  "believe-it": {
    flag: "green",
    why: "One statement, one action, one logged fact. Nothing is spent and nothing goes public.",
    minutes: DEFAULT_MINUTES,
    minutesFromBook: false,
  },
  "manifest-it": {
    flag: "green",
    why: "A 60-second rehearsal and ten minutes of the real work. No money, no new contact, no publishing.",
    minutes: 10,
    minutesFromBook: true,
    timeNote:
      "The book sets two blocks: sixty seconds of process visualization, then ten minutes of the work it points at. The timer here is the ten minutes.",
  },
  "level-up": {
    flag: "yellow",
    why: "The build starts a tutorial, and its Reality Check puts courses, purchases, contracts and paid work behind a parent or guardian. That is the book's small-spending case.",
    minutes: 25,
    minutesFromBook: true,
    green:
      "Choose a skill you can start on free material only — a library book, a free tutorial, something your school already pays for. Do the 25 minutes and keep the Day 1 screenshot. Buy nothing and sign up for nothing; the paid-course decision waits until there is someone to make it with.",
  },
  "create-magic": {
    flag: "yellow",
    why: "The build ends by sharing the piece with someone, and its Reality Check covers credit, copyright, platform rules and putting material into an AI tool.",
    minutes: 30,
    minutesFromBook: true,
    green:
      "Build the piece from three ingredients that are entirely yours — your photos, your words, your recordings, nobody else's. Keep the 30-minute limit. Instead of sharing it, write down the question you would have asked and keep the piece until there is someone safe to show it to.",
  },
  "game-plan": {
    flag: "yellow",
    why: "Planning is reversible, but the outcome a reader picks usually is not: the Reality Check puts paid projects, customer data, shipping, taxes and contracts behind a parent or guardian, and those get decided at the planning stage, not later.",
    minutes: DEFAULT_MINUTES,
    minutesFromBook: false,
    green:
      "Set the 12-week outcome on a skill rather than on income — something you can finish without a customer, a payment or a contract. Three milestones and tomorrow's three tasks, exactly as the book has it. Money joins the plan when an adult is planning that part with you.",
  },
  "boss-decisions": {
    flag: "yellow",
    why: "The build sets the condition itself: decide within 24 hours if the choice is low-risk, otherwise ask an adult first.",
    minutes: DEFAULT_MINUTES,
    minutesFromBook: false,
    green:
      "Run the four boxes on a decision that costs no money, involves nobody you have not met, and can be undone — which project to finish first, which thing to drop. Decisions with money, contracts or strangers in them keep the book's 24-hour rule and keep their adult.",
  },
  unstoppable: {
    flag: "green",
    why: "A seven-day streak with a defined minimum version is private and reversible, and day one costs nothing.",
    minutes: DEFAULT_MINUTES,
    minutesFromBook: false,
  },
  "squad-goals": {
    flag: "red",
    why: "The build is a call with people, and the Reality Check requires parent-approved platforms and an adult before anyone meets in person. Read strictly, because getting this one wrong is how a 13-year-old ends up on a call with a stranger.",
    minutes: 20,
    minutesFromBook: true,
    green:
      "Run the 20 minutes on your own. Bring the one goal, answer the question yourself — what could exist in 30 days — and end with one task for you. Write down who you would invite. The call happens once an adult knows about it and the platform is one they have approved.",
  },
  fearless: {
    flag: "yellow",
    why: "A fear ladder is a reader deciding what to push themselves into, and the Reality Check exists precisely because courage language gets used to justify unsafe contact, substances, stunts and secrecy. The rungs get a check-in.",
    minutes: DEFAULT_MINUTES,
    minutesFromBook: false,
    green:
      "Build the five-step ladder so every step is something you can do alone and in the open — a message to someone you already know, a question asked out loud in class, a piece made and shown to nobody. Do step one today. Write the final step down, and tell someone the day there is someone to tell.",
  },
  "money-mindset": {
    flag: "yellow",
    why: "The build is about money — sorting spending, setting a 90-day target — and its Reality Check names a parent or guardian and qualified local guidance.",
    minutes: DEFAULT_MINUTES,
    minutesFromBook: false,
    green:
      "Use only money that has already moved: your own record of the last ten things you spent on, or today written down as you go. Sort them Spend / Save / Build and work out the weekly amount on paper. Opening an account or an app, or anything that wants card details, is the part that waits.",
  },
  "vibe-check": {
    flag: "yellow",
    why: "Publish or privately share. Public posting is the book's own yellow example, and the Reality Check is about what not to give away in public.",
    minutes: DEFAULT_MINUTES,
    minutesFromBook: false,
    green:
      "Choose the three signal words and make the 30-second idea. Then share it with one person you already know offline, or with nobody at all — a draft in your notes still counts as made. What returns can be your own honest read of it. Posting it publicly is a separate decision.",
  },
  "intuition-flow": {
    flag: "yellow",
    why: "The test is capped at one hour or ten euros, which is small spending, and the build says higher-risk versions become a conversation with a trusted adult instead.",
    /* "under one hour" is the book's ceiling on the whole test, not a block of work to
       sit through, so the timer uses the standard first step rather than 60 minutes. */
    minutes: DEFAULT_MINUTES,
    minutesFromBook: false,
    green:
      "Design the version of the test that costs nothing and involves nobody new: ask a question, make a rough version, count something for a week. If the only test you can think of needs money or a stranger, the book already told you what to do instead — make it a conversation.",
  },
  "mindful-tech": {
    flag: "green",
    why: "Turning off non-human notifications and blocking two half hours costs nothing and is undone in a tap.",
    minutes: 30,
    minutesFromBook: true,
    timeNote:
      "The book sets two 30-minute blocks — one Signal block, one offline block. The timer here runs one of them; run it twice.",
  },
  "real-rich": {
    flag: "green",
    why: "A one-page scored dashboard, written for yourself and shown to nobody unless you choose to.",
    minutes: DEFAULT_MINUTES,
    minutesFromBook: false,
  },
  "first-offer": {
    flag: "red",
    why: "Its Reality Check names contracts, accounts, marketplaces, payment providers, taxes and working hours, and says to build with a parent or guardian from day one. That is the book's red list.",
    minutes: DEFAULT_MINUTES,
    minutesFromBook: false,
    green:
      "Write the one sentence and build or improve one portfolio example. Then stop. No listing, no marketplace account, no client, no price, no money until a parent or guardian is doing that part with you — most of the restrictions in the Reality Check are legally on them, not on you.",
  },
  "tiny-launch": {
    flag: "green",
    why: "The printed build is only putting Day 1 in the calendar. Reserving time is reversible; the launch itself is the 21 tasks that follow, not this one.",
    minutes: 10,
    minutesFromBook: false,
  },
  commitment: {
    flag: "yellow",
    why: "The build ends by sending the sentence to a witness. Naming what you are doing, when, and to whom is contact — and the 30 minutes it commits you to is work nobody else has seen yet.",
    /* The book's "30 minutes" is the block being promised, not the length of writing the
       sentence, which is what this timer covers. */
    minutes: 10,
    minutesFromBook: false,
    green:
      "Write the sentence anyway and put it where you cannot miss it — lock screen, fridge, inside cover of the folder. A witness makes it harder to quietly drop; a sentence you have to look at does some of the same work. Send it the day there is someone to send it to.",
  },
};

/**
 * Throws rather than defaulting. A build with no entry here would otherwise render
 * silently as green, which is the one failure mode a safety flag may not have.
 *
 * It throws a second time if a yellow or red build has no green variant: that would be an
 * approval gate with no adult-free route, which fails silently on exactly the reader spec
 * §8 exists for.
 */
export function buildMeta(id: string): BuildMeta {
  const meta = META[id];
  if (!meta) {
    throw new Error(
      `No flag or timer length for build "${id}". Every build needs an entry in src/lib/build-meta.ts — ` +
        "a missing one must never fall back to green.",
    );
  }
  if (meta.flag !== "green" && !meta.green) {
    throw new Error(
      `Build "${id}" is ${meta.flag} but has no adult-free green variant in ` +
        "src/lib/build-meta.ts. Spec §8: no reader's path may terminate because there is " +
        "nobody to ask.",
    );
  }
  return meta;
}

/**
 * The book's own definition, printed page 61 — the "For Parents & Guardians" page, under
 * "Consider creating a simple family approval system". Quoted, never paraphrased.
 *
 * Verified against the printed interior: PDF page 62 carries the folio 61 and this
 * paragraph. Printed page 60 is "Your One-Page Real Rich Plan" — a reader sent there finds
 * a blank worksheet. This constant is rendered to readers on the homepage, every chapter
 * page and the build hub, so it is the one number on the site that must be right.
 */
export const FLAG_RULE_PAGE = 61;
export const FLAG_RULE =
  "Green decisions are low-cost and reversible. Yellow decisions involve public posting, small spending, or contact with new people and require a check-in. Red decisions involve contracts, financial products, travel, identity documents, large payments, or in-person meetings and require direct adult involvement.";

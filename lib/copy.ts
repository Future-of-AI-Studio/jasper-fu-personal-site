import { identity } from "./identity";

export const FLAGSHIP_ESSAY_READY = false;

export const bios = {
  words50:
    "Jasper Fu is the co-founder and CEO of Coinsub, the orchestration layer for programmable money, a rail-agnostic platform letting PSPs, fintechs, banks, and platforms move stablecoins, crypto, and fiat with greater control, compliance, and settlement certainty. Before Coinsub, he was a fintech penetration tester. MSB-registered in the US and Canada.",
  words75:
    "Jasper Fu is the co-founder and CEO of Coinsub, the orchestration layer for programmable money. With co-founder David Akers, he built a unified, rail-agnostic API that lets PSPs, fintechs, banks, and platforms accept, hold, convert, settle, and pay out across stablecoins, crypto, and fiat, with greater control, compliance, and settlement certainty. Before Coinsub, Jasper worked in digital transformation at PwC, learned how payment systems get attacked as a fintech penetration tester, and led product at Community Gaming. Coinsub is MSB-registered in the US and Canada.",
  words150:
    "Jasper Fu is the co-founder and CEO of Coinsub, building the orchestration layer for programmable money, a single, rail-agnostic platform that lets PSPs, fintechs, banks, and platforms move stablecoins, crypto, and fiat with greater control, compliance, and settlement certainty. He believes the biggest barrier to stablecoin adoption isn't awareness, it's infrastructure fragmentation across chains, assets, custody, compliance, and settlement. Jasper's path to Coinsub began in digital transformation consulting at PwC, followed by fintech penetration testing, where he learned firsthand how payment systems get attacked. He later served as Director of Product at Community Gaming, onboarding users from Web2 into Web3. With co-founder David Akers, he built Coinsub around a unified API that abstracts stablecoin complexity into plug-and-play, white-label building blocks. Coinsub is MSB-registered in the US (FinCEN) and Canada (FINTRAC), with ISO 27001 and SOC 2 in progress.",
  words250: [
    "Jasper Fu is the co-founder and CEO of Coinsub, building the orchestration layer for programmable money, a single, rail-agnostic platform that lets PSPs, fintechs, banks, and platforms move stablecoins, crypto, and fiat with greater control, compliance, and settlement certainty. He believes the biggest barrier to stablecoin adoption isn't awareness, it's infrastructure fragmentation, across chains, assets, custody, compliance, and settlement.",
    "Jasper's path to Coinsub began in digital transformation consulting at PwC, followed by a stint in fintech penetration testing, where he learned firsthand how payment systems get attacked. He later served as Director of Product at Community Gaming, onboarding users from Web2 into Web3. That combination of a security background and hands-on product experience shaped his conviction: programmable money is the first real chance to design safety and control into a financial system from the start, rather than bolt it on afterward.",
    "With co-founder David Akers, Jasper built Coinsub around a unified API and orchestration stack that abstracts the complexity of the stablecoin ecosystem into plug-and-play, white-label building blocks. Coinsub is MSB-registered in both the United States (FinCEN) and Canada (FINTRAC), with ISO 27001 and SOC 2 certifications in progress, and today runs real-world stablecoin rails in production, including a 12,000-ATM cash-access partnership with FCTI and a stablecoin-acceptance partnership with Ordr across sports arenas, venues, and hospitality.",
    "Jasper speaks and writes on stablecoin infrastructure, payments orchestration, compliance-first building, and the future of programmable money.",
  ].join(" "),
};

export const aboutBioParagraphs = [
  "Jasper Fu is the co-founder and CEO of Coinsub, building the orchestration layer for programmable money, a single, rail-agnostic platform that lets PSPs, fintechs, banks, and platforms move stablecoins, crypto, and fiat with greater control, compliance, and settlement certainty.",
  "He believes the biggest barrier to stablecoin adoption isn't awareness, it's infrastructure fragmentation across chains, assets, custody, compliance, and settlement.",
  "Jasper's path to Coinsub began in digital transformation consulting at PwC, followed by fintech penetration testing, where he learned firsthand how payment systems get attacked. He later served as Director of Product at Community Gaming, onboarding users from Web2 into Web3.",
  "With co-founder David Akers, he built Coinsub around a unified API that abstracts stablecoin complexity into plug-and-play, white-label building blocks. Coinsub is MSB-registered in the US (FinCEN) and Canada (FINTRAC), with ISO 27001 and SOC 2 in progress.",
] as const;

export const ABOUT_BIO_PARAGRAPH_MIN = 2;
export const ABOUT_BIO_PARAGRAPH_MAX = 6;

export function assertAboutBioParagraphs(paragraphs: readonly string[]) {
  if (!paragraphs.length) {
    throw new Error("About bio paragraphs are required");
  }
  if (paragraphs.length < ABOUT_BIO_PARAGRAPH_MIN) {
    throw new Error(
      `About bio needs at least ${ABOUT_BIO_PARAGRAPH_MIN} paragraphs`,
    );
  }
  if (paragraphs.length > ABOUT_BIO_PARAGRAPH_MAX) {
    throw new Error(
      `About bio cannot exceed ${ABOUT_BIO_PARAGRAPH_MAX} paragraphs`,
    );
  }
  if (paragraphs.some((paragraph) => !paragraph.trim())) {
    throw new Error("About bio paragraphs cannot be empty");
  }
  if (paragraphs.join(" ") !== bios.words150) {
    throw new Error("About bio paragraphs must match the 150-word bio");
  }
  return [...paragraphs];
}

export const ABOUT_PULL_QUOTE =
  "We lost something when we went from cash to digital money, the ability to freely and independently transact. I'm building it back.";

export function assertAboutPullQuote(quote: string) {
  const trimmed = quote.trim();
  if (!trimmed) {
    throw new Error("About pull quote is required");
  }
  if (trimmed !== ABOUT_PULL_QUOTE) {
    throw new Error("About pull quote must be the published cash-to-digital quote");
  }
  return trimmed;
}

export const companyBoilerplate =
  "Coinsub is the orchestration layer for programmable money. Its unified, rail-agnostic API lets PSPs, fintechs, banks, and platforms move stablecoins, crypto, and fiat through one platform, white-label and sublicensable. Co-founded by Jasper Fu and David Akers, Coinsub is MSB-registered in the US (FinCEN) and Canada (FINTRAC), with ISO 27001 and SOC 2 in progress.";

export const pullQuotes = [
  "I used to break payment systems for a living. Programmable money lets us design safety in from the start.",
  "We connect programmable money to the places people actually spend it, 12,000 ATMs and every seat in a stadium.",
  "Recurring billing is just one block. The real product is the orchestration layer underneath it.",
  "Compliance is the product. Everything else is a feature.",
] as const;

export const PULL_QUOTES_MIN = 2;
export const PULL_QUOTES_MAX = 4;

export function assertPullQuote(quote: string) {
  const trimmed = quote.trim();
  if (!trimmed) {
    throw new Error("Pull quote is required");
  }
  if (trimmed.includes("placeholder")) {
    throw new Error("Pull quote is a placeholder");
  }
  return trimmed;
}

export function parsePullQuotes(quotes: readonly string[]) {
  if (quotes.length < PULL_QUOTES_MIN) {
    throw new Error(`Pull quotes need at least ${PULL_QUOTES_MIN}`);
  }
  if (quotes.length > PULL_QUOTES_MAX) {
    throw new Error(`Pull quotes cannot exceed ${PULL_QUOTES_MAX}`);
  }
  const parsed = quotes.map(assertPullQuote);
  if (new Set(parsed).size !== parsed.length) {
    throw new Error("Pull quotes must each be unique");
  }
  return parsed;
}

export const quickFacts = [
  {
    label: "Cash access",
    value: "12,000+",
    detail: "ATM cash-access points through FCTI",
  },
  {
    label: "Regulatory",
    value: "MSB",
    detail: "Registered across the US and Canada",
  },
  {
    label: "Proof points",
    value: "2",
    detail: "Physical-world rails: cash access and the experience economy",
  },
] as const;

export type QuickFact = { label: string; value: string; detail: string };

// .fact-grid is a fixed 3-column layout (first card special-cased as
// .stat-card--primary), so the count stays pinned at exactly 3 until that
// grid supports a variable column count.
export const QUICK_FACTS_MIN = 3;
export const QUICK_FACTS_MAX = 3;

export function assertQuickFact(fact: QuickFact) {
  const label = fact.label.trim();
  const value = fact.value.trim();
  const detail = fact.detail.trim();
  if (!label) {
    throw new Error("Quick fact label is required");
  }
  if (!value) {
    throw new Error(`${label} quick fact value is required`);
  }
  if (!detail) {
    throw new Error(`${label} quick fact detail is required`);
  }
  if (value.includes("placeholder") || detail.includes("placeholder")) {
    throw new Error(`${label} quick fact is a placeholder`);
  }
  return { label, value, detail };
}

export function parseQuickFacts(facts: readonly QuickFact[]) {
  if (facts.length < QUICK_FACTS_MIN) {
    throw new Error(`Quick facts need at least ${QUICK_FACTS_MIN} entries`);
  }
  if (facts.length > QUICK_FACTS_MAX) {
    throw new Error(`Quick facts cannot exceed ${QUICK_FACTS_MAX} entries`);
  }
  const parsed = facts.map(assertQuickFact);
  if (new Set(parsed.map((fact) => fact.label)).size !== parsed.length) {
    throw new Error("Quick fact labels must each be unique");
  }
  return parsed;
}

export const careerTimeline = [
  "PwC, digital transformation consulting",
  "Fintech penetration testing, where he learned how payment systems get attacked",
  "Director of Product at Community Gaming, onboarding users from Web2 into Web3",
  "Co-founded Coinsub with David Akers, building the orchestration layer for programmable money",
] as const;

export const CAREER_TIMELINE_MIN = 2;
export const CAREER_TIMELINE_MAX = 6;

export function assertCareerTimelineItem(item: string) {
  const trimmed = item.trim();
  if (!trimmed) {
    throw new Error("Career timeline item is required");
  }
  if (trimmed.includes("placeholder")) {
    throw new Error("Career timeline item is a placeholder");
  }
  return trimmed;
}

export function parseCareerTimeline(items: readonly string[]) {
  if (items.length < CAREER_TIMELINE_MIN) {
    throw new Error(`Career timeline needs at least ${CAREER_TIMELINE_MIN} items`);
  }
  if (items.length > CAREER_TIMELINE_MAX) {
    throw new Error(`Career timeline cannot exceed ${CAREER_TIMELINE_MAX} items`);
  }
  const parsed = items.map(assertCareerTimelineItem);
  if (new Set(parsed).size !== parsed.length) {
    throw new Error("Career timeline items must each be unique");
  }
  return parsed;
}

export const credentials = [
  "Emory University, Goizueta Business School, BBA",
  "MSB-registered in the US (FinCEN) and Canada (FINTRAC), with ISO 27001 and SOC 2 in progress",
  "Coinsub founded 2023, headquartered in New York City, New York, with an incorporation address in Middletown, Delaware, U.S.",
] as const;

export const CREDENTIALS_MIN = 2;
export const CREDENTIALS_MAX = 6;

export function assertCredentialItem(item: string) {
  const trimmed = item.trim();
  if (!trimmed) {
    throw new Error("Credential item is required");
  }
  if (trimmed.includes("placeholder")) {
    throw new Error("Credential item is a placeholder");
  }
  return trimmed;
}

export function parseCredentials(items: readonly string[]) {
  if (items.length < CREDENTIALS_MIN) {
    throw new Error(`Credentials need at least ${CREDENTIALS_MIN} items`);
  }
  if (items.length > CREDENTIALS_MAX) {
    throw new Error(`Credentials cannot exceed ${CREDENTIALS_MAX} items`);
  }
  const parsed = items.map(assertCredentialItem);
  if (new Set(parsed).size !== parsed.length) {
    throw new Error("Credential items must each be unique");
  }
  return parsed;
}

export const aboutFaqs = [
  {
    question: "What does Coinsub do?",
    answer:
      "Coinsub is the orchestration layer for programmable money, a unified, rail-agnostic API letting PSPs, fintechs, banks, and platforms accept, hold, convert, settle, and pay out across stablecoins, crypto, and fiat.",
  },
  {
    question: "What is Coinsub's regulatory status?",
    answer:
      "Coinsub is registered as a Money Services Business with FinCEN in the US and FINTRAC in Canada, with ISO 27001 and SOC 2 certifications in progress.",
  },
  {
    question: "Who is David Akers?",
    answer:
      "David Akers is Jasper's co-founder, with a product and engineering background; Coinsub is built and represented as a collaborative co-founder effort, not a sole-founder story.",
  },
  {
    question: "What does programmable money mean?",
    answer:
      "Definition pending Jasper's locked plain-language wording. Until then, treat programmable money as value that can move, settle, and be governed in software rather than in siloed ledgers.",
  },
];

export type AboutFaq = { question: string; answer: string };

// How many of the drafted questions are cleared to publish today. The 4th
// ("What does programmable money mean?") is still a stub — see
// assertAboutFaq below, which refuses to publish an answer that starts with
// "Definition pending" even if this count is bumped without replacing it.
export const ABOUT_FAQ_PUBLISHED_COUNT = 3;

export function assertAboutFaq(faq: AboutFaq) {
  const question = faq.question.trim();
  const answer = faq.answer.trim();
  if (!question) {
    throw new Error("About FAQ question is required");
  }
  if (!answer) {
    throw new Error(`${question} FAQ answer is required`);
  }
  if (answer.startsWith("Definition pending")) {
    throw new Error(`${question} FAQ answer is still a pending stub`);
  }
  return { question, answer };
}

export function parseAboutFaqs(
  faqs: readonly AboutFaq[],
  count: number = ABOUT_FAQ_PUBLISHED_COUNT,
) {
  if (count < 1) {
    throw new Error("About FAQ needs at least 1 published question");
  }
  if (count > faqs.length) {
    throw new Error("About FAQ published count exceeds available questions");
  }
  const parsed = faqs.slice(0, count).map(assertAboutFaq);
  if (new Set(parsed.map((faq) => faq.question)).size !== parsed.length) {
    throw new Error("About FAQ questions must each be unique");
  }
  return parsed;
}

export const insightLanes = [
  {
    title: "The cash to stablecoin bridge",
    summary:
      "What 12,000 ATMs unlock for programmable money in the real economy.",
  },
  {
    title: "Programmable money and orchestration",
    summary: "One neutral layer across stablecoin, crypto, and fiat.",
  },
  {
    title: "Programmable money in the experience economy",
    summary: "Sports, arenas, hospitality, and live events.",
  },
  {
    title: "Built-in compliance",
    summary: "Why MSB licensing and a security-first build matter at scale.",
  },
  {
    title: "Programmable money for AI agents",
    summary:
      "Autonomous agents paying for tools and APIs, framed as commerce, not crypto.",
  },
];

export const speakingTopics = insightLanes;

export const interimBlogPosts = [
  {
    title:
      "The Next Alternative Payment Method: Why Stablecoins Are the Logical Next Step for PSPs.",
    summary:
      "An argument for treating stablecoins as the next in a long line of PSP payment methods, following cards, digital wallets, and buy-now-pay-later, rather than as a separate crypto category.",
    href: "https://coinsub.io/post/the-next-alternative-payment-method-why-stablecoins-are-the-logical-next-step-for-psps",
    image: "/press/next-alternative-payment-method.png",
  },
  {
    title: "Money 20/20 USA 2025: From Experimentation to Infrastructure.",
    summary:
      "A recap of this year's Money20/20, where fintech, traditional finance, and blockchain visibly converged onto shared infrastructure instead of running in parallel.",
    href: "https://coinsub.io/post/money-20-20-usa-2025-from-experimentation-to-infrastructure",
    image: "/press/money-20-20-usa-2025.png",
  },
  {
    title: "How PSPs Can Add Stablecoin Acceptance in 30 Days, Not Months.",
    summary:
      "A practical breakdown of why adding a new payment rail traditionally takes months, and how that timeline can compress to weeks.",
    href: "https://coinsub.io/post/how-psps-can-add-stablecoin-acceptance-in-30-days-not-months",
    image: "/press/stablecoin-acceptance-in-30-days.png",
  },
];

export type CoverageItem = {
  outlet: string;
  title: string;
  caption: string;
  embedUrl: string | null;
  watchUrl: string;
  kind: "video" | "article" | "audio";
  /** Card thumbnail. The featured item runs its player instead, so it has none. */
  image?: string;
};

export const mediaCoverage: CoverageItem[] = [
  {
    outlet: "NASDAQ",
    title:
      "Coinsub CEO Jasper Fu on crypto payments, stablecoins, and the future of global commerce",
    caption: "Filmed at the New York Stock Exchange in NYC with Jane King.",
    embedUrl: "https://www.youtube.com/embed/n2AyhRBeho0",
    watchUrl: "https://www.youtube.com/watch?v=n2AyhRBeho0",
    kind: "video",
  },
  {
    outlet: "CEO Magazine",
    title: "Jasper Fu and the invisible money layer that makes stablecoins feel normal",
    caption: "From the Ground Up.",
    embedUrl: null,
    watchUrl:
      "https://ceofficialmag.com/jasper-fu-invisible-money-layer-that-makes-stablecoins-feel-normal/",
    kind: "article",
    image: "/press/ceo-mag-thumbnail.png",
  },
  {
    outlet: "Circle",
    title: "Driving efficiency in global payment systems with USDC",
    caption: "Builder Series: stablecoin subscriptions, on-chain efficiency, and multi-chain support.",
    embedUrl: null,
    // The Builder Series episode itself. This pointed at circle.com, which
    // dropped the reader on the corporate home page instead of the interview.
    watchUrl: "https://www.youtube.com/watch?v=j3MOBy6PUnU",
    kind: "video",
    image: "/press/circle-thumbnail.jpg",
  },
  {
    outlet: "DecentraLounge / GlobalStake Podcast",
    title: "S02-E12, Jasper Fu, Co-Founder and CEO of Coinsub",
    caption: "Checkout, subscriptions, invoices, and donations.",
    embedUrl: null,
    watchUrl: "https://www.youtube.com/watch?v=4m6KVmMSKQw",
    kind: "audio",
    image: "/press/decentralounge-thumbnail.jpg",
  },
];

export const factSheet = [
  { label: "Founded", value: "2023" },
  {
    label: "Headquarters",
    value: "New York City, New York / Middletown, Delaware, U.S.",
  },
  {
    label: "Regulatory status",
    value: "MSB-registered, FinCEN in the US and FINTRAC in Canada",
  },
  {
    label: "Certifications in progress",
    value: "ISO 27001 and SOC 2",
  },
];

export const FACT_SHEET_MIN_ROWS = 3;
export const FACT_SHEET_MAX_ROWS = 6;

export type FactSheetRow = { label: string; value: string };

export function assertFactSheetRow(row: FactSheetRow) {
  const label = row.label.trim();
  const value = row.value.trim();

  if (!label) {
    throw new Error("Fact sheet label is required");
  }

  if (!value) {
    throw new Error(`${label} fact sheet value is required`);
  }

  if (value.includes("placeholder")) {
    throw new Error(`${label} fact sheet value is a placeholder`);
  }

  // Same bracket convention the legal guards refuse: "[Insert date]".
  if (/\[[^\]]*\]/.test(value)) {
    throw new Error(`${label} fact sheet value still carries a bracketed placeholder`);
  }

  return { label, value };
}

export function parseFactSheet(rows: readonly FactSheetRow[]) {
  if (rows.length < FACT_SHEET_MIN_ROWS) {
    throw new Error(`Fact sheet needs at least ${FACT_SHEET_MIN_ROWS} rows`);
  }

  if (rows.length > FACT_SHEET_MAX_ROWS) {
    throw new Error(`Fact sheet cannot exceed ${FACT_SHEET_MAX_ROWS} rows`);
  }

  const parsed = rows.map(assertFactSheetRow);

  if (new Set(parsed.map((row) => row.label)).size !== parsed.length) {
    throw new Error("Fact sheet labels must each be unique");
  }

  return parsed;
}

/**
 * The shortest a real opening sentence runs. Below this the split almost
 * certainly landed inside an abbreviation ("U.S. ") rather than on a
 * sentence end, which would silently ship a two-word lede.
 */
export const BIO_LEDE_MIN_LENGTH = 24;

/**
 * Splits a bio into its opening sentence and the remainder, so the home page
 * can set the opening as a lede and the rest as supporting detail.
 */
export function splitBioLede(bio: string) {
  const trimmed = bio.trim();

  if (!trimmed) {
    throw new Error("Bio is required");
  }

  const breakAt = trimmed.indexOf(". ");

  if (breakAt === -1) {
    throw new Error("Bio needs more than one sentence to carry a lede");
  }

  const lede = trimmed.slice(0, breakAt + 1);

  if (lede.length < BIO_LEDE_MIN_LENGTH) {
    throw new Error("Bio lede is too short to be a sentence");
  }

  return { lede, rest: trimmed.slice(breakAt + 2).trim() };
}

export const usageRights =
  "Coinsub, NASDAQ, CEO Magazine, and Circle assets are cleared for editorial use with attribution. FCTI, Ordr, and secondary partner logos are pending rights confirmation and should not be published until cleared.";

export const msbStatement =
  "Coinsub is registered as a Money Services Business with the U.S. Financial Crimes Enforcement Network (FinCEN) and with Canada's Financial Transactions and Reports Analysis Centre (FINTRAC). Registration numbers to be inserted upon confirmation.";

export const forwardLookingDisclaimer =
  "This site may contain forward-looking statements, including projected revenue and market opportunity figures, based on current expectations and subject to risks and uncertainties. Actual results may differ materially. Coinsub and Jasper Fu undertake no obligation to update these statements.";

export const RETIRED_FORWARD_LOOKING_DISCLAIMER =
  "This site may contain forward-looking statements, including projected revenue and market opportunity figures, based on current expectations and subject to risks and uncertainties. Actual results may differ materially. Coinsub undertakes no obligation to update these statements.";

export function assertForwardLookingDisclaimer(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error("Forward-looking disclaimer is required");
  }
  if (trimmed === RETIRED_FORWARD_LOOKING_DISCLAIMER) {
    throw new Error("Coinsub-only forward-looking disclaimer is not published");
  }
  if (trimmed !== forwardLookingDisclaimer) {
    throw new Error("Forward-looking disclaimer must include Jasper Fu after Coinsub");
  }
  return trimmed;
}

export const contactIntro =
  "Working on a story about stablecoin infrastructure, programmable money, or payments orchestration? Get in touch.";

export const PUBLISHED_RESPONSE_TIME_NOTE =
  "We typically respond to press inquiries within 1 to 2 business days.";

export const responseTimeNote = PUBLISHED_RESPONSE_TIME_NOTE;

export function assertResponseTimeNote(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error("Response time note is required");
  }
  if (
    trimmed.includes("[") ||
    trimmed.includes("Confirm the actual") ||
    trimmed.includes("before publishing")
  ) {
    throw new Error("Response time note cannot include a publishing placeholder");
  }
  if (trimmed !== PUBLISHED_RESPONSE_TIME_NOTE) {
    throw new Error(
      "Response time note is not the published 1 to 2 business day commitment",
    );
  }
  return trimmed;
}

export const PUBLISHED_CALENDLY_PROMPT = "Use Calendly to request a time.";
export const calendlyPrompt = PUBLISHED_CALENDLY_PROMPT;

export const TEAM_CONFIRMATION_COPY = "Jasper's team will confirm by email.";

export function assertCalendlyPrompt(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error("Calendly prompt is required");
  }
  if (
    trimmed.includes("Jasper's team will confirm") ||
    trimmed.includes("confirm by email")
  ) {
    throw new Error("Calendly prompt cannot include team confirmation copy");
  }
  if (trimmed !== PUBLISHED_CALENDLY_PROMPT) {
    throw new Error("Calendly prompt is not the published request-a-time line");
  }
  return trimmed;
}

export const PUBLISHED_SPEAKING_INTRO =
  "Invite Jasper for keynotes, panels, and briefings on stablecoin infrastructure, programmable money, and payments orchestration.";

export const speakingIntro = PUBLISHED_SPEAKING_INTRO;

export function assertSpeakingIntro(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error("Speaking intro is required");
  }
  if (trimmed.includes("Calendly") || trimmed.includes("confirm by email")) {
    throw new Error("Speaking intro cannot use Calendly booking copy");
  }
  if (trimmed !== PUBLISHED_SPEAKING_INTRO) {
    throw new Error("Speaking intro is not the published speaking invite");
  }
  return trimmed;
}

export const PUBLISHED_SPEAKING_BOOKING_TITLE = "Request Jasper to Speak";

export function assertSpeakingBookingTitle(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error("Speaking booking title is required");
  }
  if (trimmed === "Book a speaking time") {
    throw new Error("Book-a-speaking-time title is not published");
  }
  if (trimmed !== PUBLISHED_SPEAKING_BOOKING_TITLE) {
    throw new Error("Speaking booking title is not Request Jasper to Speak");
  }
  return trimmed;
}

export const BOOK_TO_SPEAK_CTA = "Book to Speak";
export const REQUEST_FULL_MEDIA_KIT_CTA = "Request Full Media Kit";
export const CONTACT_CTA = "Contact";
export const WATCH_INTERVIEW_CTA = "Watch the Interview on Youtube";
export const VIEW_ALL_COVERAGE_CTA = "View All Media Coverage";

export function assertWatchInterviewCta(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error("Watch the Interview CTA is required");
  }
  if (trimmed === "Watch on YouTube") {
    throw new Error("Watch on YouTube CTA is not published");
  }
  if (trimmed !== WATCH_INTERVIEW_CTA) {
    throw new Error("Watch the Interview CTA must be Watch the Interview");
  }
  return trimmed;
}

export function assertViewAllCoverageCta(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error("View All Media Coverage CTA is required");
  }
  if (trimmed === "See All Press") {
    throw new Error("See All Press CTA is not published");
  }
  if (trimmed !== VIEW_ALL_COVERAGE_CTA) {
    throw new Error(
      "View All Media Coverage CTA must be View All Media Coverage",
    );
  }
  return trimmed;
}

export function assertBookToSpeakCta(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error("Book to Speak CTA is required");
  }
  if (trimmed === "View Media Kit") {
    throw new Error("View Media Kit CTA is not published");
  }
  if (trimmed !== BOOK_TO_SPEAK_CTA) {
    throw new Error("Book to Speak CTA must be Book to Speak");
  }
  return trimmed;
}

export function assertRequestFullMediaKitCta(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error("Request Full Media Kit CTA is required");
  }
  if (trimmed === "Download Media Kit") {
    throw new Error("Download Media Kit CTA is not published");
  }
  if (trimmed !== REQUEST_FULL_MEDIA_KIT_CTA) {
    throw new Error("Request Full Media Kit CTA must be Request Full Media Kit");
  }
  return trimmed;
}

export const MEDIA_KIT_PROMISE =
  "Headshots, logos, and approved copy, sent on request.";
/* The draft copy promised a self-serve download. The kit is fulfilled by the
   press desk, so a promise that no request is needed cannot be published. */
export const RETIRED_MEDIA_KIT_PROMISE =
  "Headshots, logos, and approved copy, no request email required.";

export function assertMediaKitPromise(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error("Media kit promise is required");
  }
  if (trimmed === RETIRED_MEDIA_KIT_PROMISE) {
    throw new Error("No-request-email media kit promise is not published");
  }
  if (trimmed.includes("no request email required")) {
    throw new Error("Media kit promise cannot claim no request is required");
  }
  if (trimmed !== MEDIA_KIT_PROMISE) {
    throw new Error("Media kit promise must be the sent-on-request line");
  }
  return trimmed;
}

export function assertContactCta(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error("Contact CTA is required");
  }
  if (trimmed.includes("Jasper's Team") || trimmed.includes("Jasper's team")) {
    throw new Error("Contact Jasper's Team CTA is not published");
  }
  if (trimmed !== CONTACT_CTA) {
    throw new Error("Contact CTA must be Contact");
  }
  return trimmed;
}

export const SEND_REQUEST_CTA = "Send Request";

export function assertSendRequestCta(value: string) {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error("Send Request CTA is required");
  }
  if (trimmed === "Prepare request" || trimmed === "Prepare Request") {
    throw new Error("Prepare request CTA is not published");
  }
  if (trimmed !== SEND_REQUEST_CTA) {
    throw new Error("Send Request CTA must be Send Request");
  }
  return trimmed;
}

export const bookingDisclaimer = PUBLISHED_CALENDLY_PROMPT;

export const heroName = identity.name;
export const heroTitle = identity.title;
export const heroThesis = identity.thesis;

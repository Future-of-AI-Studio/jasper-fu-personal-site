# Moloch Feature Checklist Template

Copy a block per feature/function. Mark items only when tests exist and have been run green.

Source: [`docs/TESTING_GUIDE.md`](../docs/TESTING_GUIDE.md) Quick Reference.

---

## Feature: Navigation and identity

**Paths / functions touched:** `lib/navigation.ts`, `lib/identity.ts`, `components/site/site-shell.tsx`

- [x] Happy path
- [x] Validation failures
- [x] Access control — N/A: public chrome, no auth
- [x] Boundary conditions — 1 / MAX-1 / MAX nav items
- [x] Verification function
- [x] DRY setup
- [x] Unique error messages
- [x] 100% path coverage of parseNavigationItems / assertLogoPublishable

---

## Feature: Availability calendar and inquiry routing

**Paths / functions touched:** `lib/availability.ts`, `lib/contact.ts`, `lib/press-alert.ts`

- [x] Happy path
- [x] Validation failures — one per field
- [x] Access control — N/A: request-based public form, no privileged roles
- [x] Boundary conditions — month 1/12, notes length 1/MAX-1/MAX, closed/blackout days
- [x] Verification function
- [x] DRY setup
- [x] Unique error messages
- [x] Path coverage including duplicate slot store and partnership-slot rejection

---

## Feature: Public pages, ToS V2, SEO

**Paths / functions touched:** `app/**`, `lib/legal/terms.ts`

- [x] Happy path
- [x] Validation — covered in form/calendar modules
- [x] Access — N/A public routes
- [x] Boundary — sitemap priorities
- [x] Verification function
- [x] DRY setup
- [x] Unique errors in inquiry/press-alert
- [x] Path coverage for essay-omitted home and legal companions

---

## Feature: Contemporary editorial restyle

**Paths / functions touched:** `app/globals.css`, `app/page.tsx`, `components/site/site-shell.tsx`, `components/site/brand.tsx`, `lib/identity-css.test.ts`

- [x] Happy path — identity tokens present, masthead + bronze hairline, wordmark bone-on-navy
- [x] Validation — bronze and settlement blue must not share a linear-gradient
- [x] Access control — N/A: public CSS, no auth
- [x] Boundary — five locked hex tokens required
- [x] Verification function — `verifyIdentityTokens`
- [x] DRY setup — CSS fixture loaded once
- [x] Unique error messages — N/A: static CSS assertions, no thrown error catalog
- [x] Path coverage — masthead hairline, token lock, no bronze+blue gradient

---

## Feature: Populate editorial layouts

**Paths / functions touched:** `components/site/page-head.tsx`, `app/{page,about,media-kit,contact,speaking,insights,press,not-found}.tsx`

- [x] Happy path — PageHead renders eyebrow, title, lede
- [x] Validation — missing eyebrow / missing title throw distinct errors
- [x] Access control — N/A: public presentational chrome
- [x] Boundary — trimmed whitespace on eyebrow and title
- [x] Verification function — `verifyPageHead`
- [x] DRY setup — `happyHead` fixture
- [x] Unique error messages — eyebrow required vs title required
- [x] Path coverage — lede present and omitted

---

## Feature: About page editorial trim

**Paths / functions touched:** `app/about/page.tsx`, `app/public-routes.test.tsx`, `app/globals.css`

- [x] Happy path — 250-word bio, Current Endeavour, quotes attributed to Jasper Fu
- [x] Validation — Approved lengths, 50-word-only snippet, FAQ, and co-founder pair are absent
- [x] Access control — N/A: public page, no auth
- [x] Boundary conditions — cite count is 1 featured + MAX pullQuotes
- [x] Verification function — `verifyAboutPage`
- [x] DRY setup — `renderAbout` / `aboutFiftyWordOnlySnippet`
- [x] Unique error messages — N/A: static presentational page; distinct absence assertions per removed block
- [x] Path coverage — bio, endeavour, quotes, credentials present; FAQ / approved lengths / founder pair removed

---

## Feature: About bio full-width layout

**Paths / functions touched:** `app/about/page.tsx`, `app/globals.css`, `app/public-routes.test.tsx`, `lib/identity-css.test.ts`

- [x] Happy path — 250-word bio uses `.about-bio` / `.bio-full` and remains present
- [x] Validation — Approved lengths, FAQ, and co-founder pair remain absent; bio is not inside `.band`
- [x] Access control — N/A: public page, no auth
- [x] Boundary conditions — bio word count >1 and in 200–400 range; exactly one `.bio-full`
- [x] Verification function — `verifyAboutBioLayout` / `verifyAboutPage`
- [x] DRY setup — `renderAbout`
- [x] Unique error messages — N/A: static presentational layout; distinct absence assertions per removed block
- [x] Path coverage — full-width CSS (`max-width: none`, `width: 100%`); measure still applies to `.band > p`

---

## Feature: About page-head without name

**Paths / functions touched:** `app/about/page.tsx`, `app/public-routes.test.tsx`, `app/globals.css`

- [x] Happy path — no visible page-head; portrait overlay still shows Jasper Fu
- [x] Validation — `.page-head` is absent; h1 is visually hidden About, not Jasper Fu
- [x] Access control — N/A: public page, no auth
- [x] Boundary conditions — exactly one h1; overlay name appears once
- [x] Verification function — `verifyAboutPageHead` / `verifyAboutPortrait`
- [x] DRY setup — `renderAbout`
- [x] Unique error messages — N/A: static presentational page
- [x] Path coverage — no page-head copy; name remains on `.about-portrait__name` only

---

## Feature: About portrait and 150-word bio

**Paths / functions touched:** `app/about/page.tsx`, `app/globals.css`, `app/public-routes.test.tsx`, `lib/identity-css.test.ts`, `public/portraits/jasper-fu-placeholder.jpg`

- [x] Happy path — 150-word bio beside framed portrait; overlay has name + Version B thesis
- [x] Validation — 250-word-only phrases, 50-word snippet, Approved lengths, FAQ, and co-founder pair are absent
- [x] Access control — N/A: public page, no auth
- [x] Boundary conditions — bio word count >1 and in 100–200 range; exactly one portrait and one `.bio-full`; overlay thesis appears once
- [x] Verification function — `verifyAboutPage` / `verifyAboutPortrait` / `verifyAboutBioLayout`
- [x] DRY setup — `renderAbout` / `aboutWords150UniqueSnippet` / `aboutWords250OnlySnippets`
- [x] Unique error messages — N/A: static presentational page; distinct absence assertions per removed block
- [x] Path coverage — portrait overlay, 150 bio, Current Endeavour, quotes, credentials; FAQ / approved lengths / founder pair / 250-only copy removed

---

## Feature: About Current Endeavour Coinsub logo as heading

**Paths / functions touched:** `app/about/page.tsx`, `app/globals.css`, `app/public-routes.test.tsx`, `lib/identity-css.test.ts`

- [x] Happy path — Coinsub logo is the Current Endeavour heading; eyebrow is text-only
- [x] Validation — logo is absent from the Current Endeavour eyebrow
- [x] Access control — N/A: public presentational page, no auth
- [x] Boundary conditions — logo height equals h2 `clamp(1.75rem, 3vw, 2.5rem)`
- [x] Verification function — `verifyAboutPage` / CSS type-scale match
- [x] DRY setup — `renderAbout` / CSS fixture
- [x] Unique error messages — N/A: static presentational markup
- [x] Path coverage — eyebrow without img; logo inside `h2.endeavour__title`

---

## Feature: Circular JF seal, Coinsub links, right-aligned nav

**Paths / functions touched:** `lib/brand-mark.ts`, `components/site/brand.tsx`, `components/site/site-shell.tsx`, `app/globals.css`, `app/page.tsx`, `app/about/page.tsx`, `app/media-kit/page.tsx`

- [x] Happy path — screenshot seal in chrome; Coinsub mark links to coinsub.io; nav Contact sits beside Media Kit
- [x] Validation — empty / YN placeholder / unpublished seal sources throw distinct errors
- [x] Access control — N/A: public presentational chrome, no auth
- [x] Boundary conditions — trimmed seal source; Coinsub mark linked and unlinked
- [x] Verification function — `verifySeal` / `verifySealSrc` / `verifyCoinsubMark` / `verifyHomePage`
- [x] DRY setup — `PUBLISHED_SEAL_SRC` / `CoinsubMark` / CSS fixture
- [x] Unique error messages — required vs YN placeholder vs unpublished seal
- [x] Path coverage — masthead seal + Jasper Fu name over title; hero Coinsub over title; About endeavour link; Media Kit PNG/SVG; nav `justify-self: end`

---

## Feature: Masthead name restored beside the seal

**Paths / functions touched:** `components/site/brand.tsx`, `components/site/brand.test.tsx`, `app/globals.css`

- [x] Happy path — seal + Jasper Fu + title in the masthead wordmark
- [x] Validation — Coinsub mark is absent from the wordmark
- [x] Access control — N/A: public presentational chrome, no auth
- [x] Boundary conditions — wordmark is a single home link
- [x] Verification function — `verifySeal`
- [x] DRY setup — `identity.name` / `identity.title`
- [x] Unique error messages — N/A: static presentational lockup
- [x] Path coverage — name present; Coinsub img not in Wordmark

---

## Feature: Home bio-to-interview flow

**Paths / functions touched:** `app/page.tsx`, `app/page.test.tsx`, `app/globals.css`

- [x] Happy path — Biography + Company Coinsub logo, then featured interview
- [x] Validation — Quick facts heading and the home pull-quote are absent
- [x] Access control — N/A: public page, no auth
- [x] Boundary conditions — exactly two Coinsub marks (hero + company)
- [x] Verification function — `verifyHomePage` / `verifyHomeCompanyAndFlow`
- [x] DRY setup — `homeQuote` from `pullQuotes[0]`
- [x] Unique error messages — N/A: static presentational layout; distinct absence assertions
- [x] Path coverage — company logo under Company; bio precedes Featured interview; facts/quote removed

---

## Feature: Remove Insights tab

**Paths / functions touched:** `lib/navigation.ts`, `lib/navigation.test.ts`, `components/site/site-shell.test.tsx`, `app/sitemap.ts`, `app/seo.test.ts`, `e2e/public-routes.spec.ts`, `app/public-routes.test.tsx`, `app/insights/page.tsx`

- [x] Happy path — primary nav has Home through Contact without Insights
- [x] Validation — parseNavigationItems still rejects empty, blank label, and external href
- [x] Access control — N/A: public navigation, no auth
- [x] Boundary conditions — 1 / MAX-1 / MAX nav items still accepted
- [x] Verification function — `verifyNavigation` / `verifySitemap` / `verifySiteShell`
- [x] DRY setup — `primaryNavigation` / sitemap `routes`
- [x] Unique error messages — empty vs blank label vs external vs over-max
- [x] Path coverage — Insights omitted from nav, sitemap, e2e, and public route tests; `/insights` page removed

---

## Feature: Press release card thumbnails

**Paths / functions touched:** `lib/copy.ts`, `lib/press-thumbnail.ts`, `app/press/page.tsx`, `app/globals.css`, `app/public-routes.test.tsx`

- [x] Happy path — each press card renders its Coinsub post thumbnail
- [x] Validation — empty, placeholder, and non-`/press/` sources throw distinct errors
- [x] Access control — N/A: public press page, no auth
- [x] Boundary conditions — thumbnail count equals post count; sources are unique
- [x] Verification function — `verifyPressThumbnail` / `verifyPressReleaseThumbs`
- [x] DRY setup — `interimBlogPosts` image fields
- [x] Unique error messages — required vs placeholder vs local `/press/` path
- [x] Path coverage — press page cards; CSS 16:9 cover crop

---

## Feature: Press thumbnail 16:9 display frame

**Paths / functions touched:** `app/globals.css`, `app/press/page.tsx`, `lib/press-thumbnail.ts`, `app/public-routes.test.tsx`, `lib/identity-css.test.ts`

- [x] Happy path — each thumb sits in a 16:9 `.card__media` frame
- [x] Validation — existing empty / placeholder / non-`/press/` source errors remain distinct
- [x] Access control — N/A: public press page, no auth
- [x] Boundary conditions — intrinsic 720×405 is exactly 16:9 (`width * 9 === height * 16`)
- [x] Verification function — `verifyPressReleaseThumbs`
- [x] DRY setup — `PRESS_THUMB_WIDTH` / `PRESS_THUMB_HEIGHT`
- [x] Unique error messages — required vs placeholder vs local `/press/` path
- [x] Path coverage — wrapper aspect-ratio; img fills with `object-fit: cover`

---

## Feature: Compact two-column speaking topics

**Paths / functions touched:** `app/speaking/page.tsx`, `app/globals.css`, `app/public-routes.test.tsx`, `lib/identity-css.test.ts`

- [x] Happy path — all speaking topics render in `.topic-grid`
- [x] Validation — About `.index-list` is unchanged (no `.topic-grid` required there)
- [x] Access control — N/A: public speaking page, no auth
- [x] Boundary conditions — five topics (odd count) still fill two columns
- [x] Verification function — `verifySpeakingTopics`
- [x] DRY setup — `speakingTopics`
- [x] Unique error messages — N/A: static presentational layout
- [x] Path coverage — two-column CSS; compact `h3`; mobile stacks to one column

---

## Feature: Media Kit request hero

**Paths / functions touched:** `app/media-kit/page.tsx`, `lib/media-kit.ts`, `components/contact/inquiry-form.tsx`, `app/globals.css`, `app/public-routes.test.tsx`

- [x] Happy path — speaking photo, request heading, and contact CTA
- [x] Validation — empty, placeholder, and unpublished photo sources throw distinct errors
- [x] Access control — N/A: public media kit, no auth
- [x] Boundary conditions — trimmed published photo path
- [x] Verification function — `verifyMediaKitRequest`
- [x] DRY setup — `MEDIA_KIT_SPEAKING_PHOTO`
- [x] Unique error messages — required vs placeholder vs unpublished photo
- [x] Path coverage — two-column request layout; CTA to `/contact#inquiry-form`

---

## Feature: Media Kit request-only page

**Paths / functions touched:** `app/media-kit/page.tsx`, `app/public-routes.test.tsx`

- [x] Happy path — speaking photo, request heading, and contact CTA remain
- [x] Validation — seal downloads, pending assets, copy blocks, and fact sheet are absent
- [x] Access control — N/A: public media kit, no auth
- [x] Boundary conditions — page has exactly one speaking photo
- [x] Verification function — `verifyMediaKitRequest`
- [x] DRY setup — `MEDIA_KIT_SPEAKING_PHOTO`
- [x] Unique error messages — N/A: static presentational page; distinct absence assertions
- [x] Path coverage — only the request band remains below the page head

---

## Feature: Magazine brand kit

**Paths / functions touched:** `lib/identity.ts`, `lib/brand-mark.ts`, `app/globals.css`, `components/site/brand.tsx`

- [x] Happy path — published JF. monogram; navy/sky/white tokens in CSS
- [x] Validation — empty monogram and placeholder YN. rejected with distinct errors
- [x] Access control — N/A: public brand system, no auth
- [x] Boundary — trimmed monogram
- [x] Verification function — `verifyMonogram` / `verifyIdentityTokens`
- [x] DRY setup — identity color constants
- [x] Unique error messages — required vs YN. placeholder vs unpublished
- [x] Path coverage — masthead white, 4:5 portrait radius, Libre Baskerville + IBM Plex

---

## Feature: Home hero lift and media-bar logos

**Paths / functions touched:** `app/page.tsx`, `app/globals.css`, `lib/identity.ts`, `app/page.test.tsx`, `lib/identity.test.ts`

- [x] Happy path — title, name, thesis, and CTAs sit at the top of the hero; four outlet logos render
- [x] Validation — empty, placeholder, and non-`/logos/` outlet sources throw distinct errors; uncleared FCTI remains unpublished
- [x] Access control — N/A: public home page, no auth
- [x] Boundary conditions — exactly four unique outlet logos
- [x] Verification function — `verifyHomePage` / `verifyHomeMediaBar` / `verifyMediaOutletLogo`
- [x] DRY setup — `mediaOutlets` / `assertMediaOutletMark`
- [x] Unique error messages — required vs placeholder vs local `/logos/` path vs uncleared vs unpublished brand
- [x] Path coverage — hero Coinsub mark removed; company Coinsub mark remains; media-bar uses logos not names

---

## Feature: Looping media-bar marquee

**Paths / functions touched:** `app/page.tsx`, `app/globals.css`, `lib/identity.ts`, `app/page.test.tsx`, `lib/identity.test.ts`, `lib/identity-css.test.ts`

- [x] Happy path — two logo groups scroll on `.media-bar__track`
- [x] Validation — non-integer, 1-copy, and 3-copy loop counts throw distinct errors
- [x] Access control — N/A: public home page; duplicate group is `aria-hidden`
- [x] Boundary conditions — exactly two copies; 4 unique logos × 2 = 8 images
- [x] Verification function — `verifyHomeMediaBar`
- [x] DRY setup — `MEDIA_BAR_LOOP_COPIES` / `mediaBarLoopCopyIndexes`
- [x] Unique error messages — integer vs at-least-two vs exactly-two
- [x] Path coverage — infinite `-50%` animation; reduced-motion disables animation and hides the seam copy

---

## Feature: Home hero center, larger logos, Coinsub thumbs

**Paths / functions touched:** `app/page.tsx`, `app/globals.css`, `app/page.test.tsx`, `lib/identity-css.test.ts`, `public/logos/ceo-magazine.svg`

- [x] Happy path — hero copy/CTAs center on the portrait; home Coinsub cards use 16:9 thumbs
- [x] Validation — existing press thumbnail empty/placeholder/non-`/press/` errors still apply via `assertPressThumbnail`
- [x] Access control — N/A: public home page, no auth
- [x] Boundary conditions — 720×405 is exactly 16:9; three unique thumbs; CEO logo uses `--ceo` scale
- [x] Verification function — `verifyHomeBlogThumbs` / `verifyHomeMediaBar`
- [x] DRY setup — `PRESS_THUMB_WIDTH` / `PRESS_THUMB_HEIGHT` / `interimBlogPosts`
- [x] Unique error messages — required vs placeholder vs local `/press/` path
- [x] Path coverage — `align-items: center`; larger logos; CEO extra-large; `.card__media` frames on home

---

## Feature: Tighter home hero copy–portrait gap

**Paths / functions touched:** `app/globals.css`, `lib/identity-css.test.ts`

- [x] Happy path — `.hero` uses `column-gap: clamp(1rem, 2.5vw, 2.5rem)` (half the previous 2rem / 5vw / 5rem)
- [x] Validation — previous `gap: clamp(2rem, 5vw, 5rem)` and too-tight `clamp(1rem, 2vw, 1.75rem)` are absent
- [x] Access control — N/A: public CSS, no auth
- [x] Boundary conditions — max `2.5rem` is half of 5rem; min `1rem`; copy max-width `22rem` desktop / `none` mobile
- [x] Verification function — `verifyHeroCopyPhotoGap` / `parseClamp`
- [x] DRY setup — CSS fixture + `HERO_COLUMN_GAP` / `HERO_COPY_MAX_WIDTH` constants
- [x] Unique error messages — `parseClamp` throws `column-gap clamp is required in .hero` vs `gap clamp is required in .hero` when a clamp is missing
- [x] Path coverage — desktop half-gap + copy `justify-self: start` aligned to `--wordmark-name-inset`; mobile stack `1fr` + copy stretch + inset 0; portrait `object-fit: cover` / 4:5 unchanged

---

## Feature: Align hero name with masthead name

**Paths / functions touched:** `app/globals.css`, `lib/identity-css.test.ts`

- [x] Happy path — hero copy starts at `--wordmark-name-inset` (seal 3.5rem + gap 0.9rem)
- [x] Validation — missing inset, missing seal width, and missing wordmark gap throw distinct errors
- [x] Access control — N/A: public CSS, no auth
- [x] Boundary conditions — inset uses both 3.5rem and 0.9rem; mobile inset 0
- [x] Verification function — `verifyHeroNameAlignsWithWordmark` / `parseWordmarkNameInset`
- [x] DRY setup — `WORDMARK_NAME_INSET` constant
- [x] Unique error messages — required vs seal width vs wordmark gap
- [x] Path coverage — desktop start + left text; mobile stretch resets inset

---

## Feature: Featured title width and hero portrait carousel

**Paths / functions touched:** `lib/portraits.ts`, `components/site/hero-portrait-carousel.tsx`, `components/site/legal-document.tsx`, `app/page.tsx`, `app/globals.css`

- [x] Happy path — first portrait visible; featured interview h2 uses `.section-intro--full`
- [x] Validation — empty, unpublished, and non-`/portraits/` sources throw distinct errors; too few / too many / duplicate lists throw distinct errors
- [x] Access control — N/A: public home page, no auth
- [x] Boundary conditions — index 0 → 1; last → 0; single-slide wrap stays 0; min 5 / max 8 portraits; 5s interval; 4:5 780×975
- [x] Verification function — `verifyPortraitSrc` / `verifyHeroPortraits` / `verifyVisiblePortrait` / `verifyFeaturedInterviewTitle`
- [x] DRY setup — `heroPortraits` / `HERO_PORTRAIT_INTERVAL_MS` / `stubMotion`
- [x] Unique error messages — required vs unpublished vs `/portraits/` path vs min vs max vs duplicate vs integer vs below-0 vs last-slide
- [x] Path coverage — rotate when motion allowed; freeze on reduced motion; only one image at a time; other SectionIntros stay 42rem

---

## Feature: Persistent plexus network background

**Paths / functions touched:** `lib/network-field.ts`, `components/site/network-field.tsx`, `components/site/site-shell.tsx`, `app/globals.css`

- [x] Happy path — nodes spawn in bounds; nearby nodes link; canvas mounts at 0.42 opacity
- [x] Validation — non-integer count, faint/solid opacity, non-finite distance, 0 width/height throw distinct errors
- [x] Access control — N/A: public decorative canvas, `aria-hidden`, `pointer-events: none`
- [x] Boundary conditions — min/max node counts; tiny/huge area clamps; 0 link distance; edge bounce; single-node no links
- [x] Verification function — `verifyNodesInBounds` / `verifyNetworkCanvas`
- [x] DRY setup — `happyNodes` / `sequentialRandom` / `stubMotion`
- [x] Unique error messages — integer vs below-min vs above-max vs faint vs solid vs width vs height vs empty step
- [x] Path coverage — animate when motion allowed; freeze on reduced motion; links only within distance

---

## Feature: Compact hero so media-bar is above the fold

**Paths / functions touched:** `app/globals.css`, `lib/identity-css.test.ts`

- [x] Happy path — hero padding compact; portrait height `min(28rem, calc(100svh - var(--hero-fold-chrome)))`
- [x] Validation — missing chrome, non-rem, below 12rem, and above 18rem throw distinct errors
- [x] Access control — N/A: public CSS, no auth
- [x] Boundary conditions — 12rem and 18rem accepted; 11rem / 19rem rejected; 15px rejected
- [x] Verification function — `verifyHeroFitsMediaBarOnLoad` / `parseHeroFoldChrome`
- [x] DRY setup — `HERO_FOLD_CHROME` / `LEGACY_HERO_PADDING` / `LEGACY_HERO_PHOTO_MIN_HEIGHT`
- [x] Unique error messages — required vs rem length vs below-min vs above-max
- [x] Path coverage — old 7.5rem padding and 34rem min-height gone; 4:5 frame remains

---

## Feature: Calendly booking and Biography heading

**Paths / functions touched:** `lib/identity.ts`, `lib/contact.ts`, `components/contact/inquiry-form.tsx`, `app/page.tsx`, `app/speaking/page.tsx`, `components/site/legal-document.tsx`

- [x] Happy path — published Calendly URL renders; inquiry mailto still routes; Biography has no Short bio heading
- [x] Validation — empty, placeholder, and non-published Calendly URLs throw distinct errors
- [x] Access control — N/A: public booking link and inquiry form, no privileged roles
- [x] Boundary conditions — trimmed Calendly URL; notes 1 / MAX-1 / MAX still accepted
- [x] Verification function — `verifyCalendlyBooking` / `verifyInquiry`
- [x] DRY setup — `PUBLISHED_CALENDLY_URL` / `makeInquiry`
- [x] Unique error messages — Calendly required vs placeholder vs unpublished; inquiry field errors remain distinct
- [x] Path coverage — calendar grid absent on contact and speaking; slotStartIso removed from submissions

---

## Feature: About gold header and formatted bio

**Paths / functions touched:** `app/globals.css`, `app/about/page.tsx`, `lib/copy.ts`

- [x] Happy path — gold About label is 1.5rem; bio renders 4 paragraphs plus thesis quote with italic name
- [x] Validation — empty/single/overflow/blank/drifted paragraphs and missing/wrong quote or name throw distinct errors
- [x] Access control — N/A: public About page, no auth
- [x] Boundary conditions — 2 and 6 matching paragraphs accepted; 0, 1, and 7 rejected
- [x] Verification function — `verifyAboutBioParagraphs` / `verifyAboutClosingQuote` / `verifyAboutGoldHeader` / `verifyAboutBioProse`
- [x] DRY setup — `aboutBioParagraphs` / `happyQuote` / `ABOUT_GOLD_HEADER_REM`
- [x] Unique error messages — required vs min vs max vs empty vs drift; quote required vs unpublished; attribution required vs not Jasper Fu; gold required vs rem vs not-2x
- [x] Path coverage — unused pull-quote list still omitted; thesis appears in bio closer with cite

---

## Feature: About portrait no longer covers bio text

**Paths / functions touched:** `app/globals.css`

- [x] Happy path — portrait max-width 32rem (2x 16rem); bio sits in a navy `minmax(0, 1fr)` column with z-index 1
- [x] Validation — missing portrait rule, missing max-width, and non-rem max-width throw distinct errors
- [x] Access control — N/A: public About layout, no auth
- [x] Boundary conditions — 24rem and 40rem accepted; 23rem / 41rem rejected; 16px rejected
- [x] Verification function — `verifyAboutBioBesidePortrait` / `parseAboutPortraitMaxWidth` / `verifyAboutBioProse`
- [x] DRY setup — `ABOUT_PORTRAIT_MAX_WIDTH` / `LEGACY_ABOUT_PORTRAIT_MIN_HEIGHT`
- [x] Unique error messages — rule required vs max-width required vs rem vs below-min vs above-max
- [x] Path coverage — align-items start not stretch; legacy 22–34rem min-height gone; prose not nested in the figure; text color navy not white

---

## Feature: LinkedIn/Coinsub embeds, About quote, no placeholder copy

**Paths / functions touched:** `lib/identity.ts`, `lib/copy.ts`, `components/site/brand.tsx`, `components/site/site-shell.tsx`, `app/about/page.tsx`, `app/page.tsx`, `app/globals.css`

- [x] Happy path — LinkedIn and Coinsub solo copy link to published URLs; About quote sits under the gold label; placeholder photography copy is gone
- [x] Validation — missing/placeholder/unpublished Coinsub and LinkedIn URLs throw distinct errors; title without solo Coinsub copy throws
- [x] Access control — N/A: public links and About copy, no auth
- [x] Boundary conditions — trimmed URLs accepted; empty title rejected
- [x] Verification function — `verifyAboutClosingQuote` / `verifyAboutPortrait` / `verifySiteShell`
- [x] DRY setup — `PUBLISHED_COINSUB_URL` / `PUBLISHED_LINKEDIN_URL` / `ABOUT_PULL_QUOTE` / `TitleWithCoinsub`
- [x] Unique error messages — Coinsub/LinkedIn required vs placeholder vs unpublished; title required vs missing solo Coinsub; quote required vs not cash-to-digital
- [x] Path coverage — quote not in bio column; overlay thesis remains; Coinsub mark still links; old thesis closer rejected

---

## Feature: About quote without name; bio type 10% smaller

**Paths / functions touched:** `app/about/page.tsx`, `lib/copy.ts`, `app/globals.css`

- [x] Happy path — cash-to-digital quote has no Jasper Fu cite; bio font is clamp(0.945rem, 1.26vw, 1.08rem)
- [x] Validation — missing quote, unpublished quote, missing font rule/clamp, and unreduced font sizes throw distinct errors
- [x] Access control — N/A: public About copy, no auth
- [x] Boundary conditions — trimmed quote accepted; each clamp axis independently 10% smaller
- [x] Verification function — `verifyAboutPullQuote` / `verifyAboutClosingQuote` / `parseAboutBioFontSize`
- [x] DRY setup — `ABOUT_PULL_QUOTE` / `ABOUT_BIO_FONT_SIZE` / `LEGACY_ABOUT_BIO_FONT_SIZE`
- [x] Unique error messages — quote required vs unpublished; font rule vs clamp vs 10% smaller vs min/preferred/max
- [x] Path coverage — cite absent from About header; quote still under gold About label

---

## Feature: Plumbing thesis replaces trust-as-architecture

**Paths / functions touched:** `lib/identity.ts`, `app/page.tsx`, `app/about/page.tsx`, `app/layout.tsx`

- [x] Happy path — published thesis is the plumbing line on home, About overlay, and Open Graph title
- [x] Validation — empty, placeholder, legacy trust line, and other unpublished theses throw distinct errors
- [x] Access control — N/A: public copy, no auth
- [x] Boundary conditions — trimmed thesis accepted
- [x] Verification function — `assertThesis` used on home and About overlay
- [x] DRY setup — `PUBLISHED_THESIS` / `LEGACY_THESIS`
- [x] Unique error messages — required vs placeholder vs retired trust line vs unpublished
- [x] Path coverage — old trust line absent from overlay and Open Graph title

---

## Feature: Press inquiries spacing and published response note

**Paths / functions touched:** `app/contact/page.tsx`, `components/contact/inquiry-form.tsx`, `lib/copy.ts`, `app/globals.css`

- [x] Happy path — form sits beside the title; response note is the 1–2 business day line once
- [x] Validation — missing note, publishing placeholder, and unpublished commitment throw distinct errors
- [x] Access control — N/A: public contact copy, no auth
- [x] Boundary conditions — trimmed note accepted; empty/whitespace rejected; gap min/preferred/max and title clamp axes independently asserted
- [x] Verification function — `verifyResponseTimeNote` / `verifyContactPage` / `verifyContactPressLayout`
- [x] DRY setup — `PUBLISHED_RESPONSE_TIME_NOTE` / `CONTACT_COLUMN_GAP` / `CONTACT_TITLE_SIZE`
- [x] Unique error messages — required vs placeholder vs unpublished; layout rule vs 5rem gap vs clamp axes; title rule vs 16ch cap vs clamp axes
- [x] Path coverage — placeholder absent from page and form; left column stacks in `.contact-copy` so routing is not stretched away from the title

---

## Feature: Inquiry and speaking booking copy

**Paths / functions touched:** `lib/copy.ts`, `components/contact/inquiry-form.tsx`, `app/speaking/page.tsx`

- [x] Happy path — Send Request CTA; speaking intro under Book Jasper; Request Jasper to Speak heading; Calendly prompt without team confirmation
- [x] Validation — missing/unpublished calendly prompt, speaking intro, booking title, and CTA throw distinct errors
- [x] Access control — N/A: public copy and form, no auth
- [x] Boundary conditions — trimmed copy accepted; empty/whitespace rejected
- [x] Verification function — `verifyCalendlyPrompt` / `verifySpeakingIntro` / `verifySpeakingBookingTitle` / `verifySendRequestCta` / `verifyNameErrorNotUnderCalendly` / `verifySpeakingPage`
- [x] DRY setup — `PUBLISHED_CALENDLY_PROMPT` / `PUBLISHED_SPEAKING_INTRO` / `PUBLISHED_SPEAKING_BOOKING_TITLE` / `SEND_REQUEST_CTA` / `TEAM_CONFIRMATION_COPY`
- [x] Unique error messages — required vs team-confirm vs unpublished; retired Book a speaking time vs unpublished title; retired Prepare request vs unpublished CTA
- [x] Path coverage — Name is required renders on the name field, not under Calendly; team confirmation copy absent from speaking and contact

---

## Feature: Speaking-only Book Jasper form

**Paths / functions touched:** `lib/speaking.ts`, `components/speaking/book-jasper-form.tsx`, `app/speaking/page.tsx`, `app/globals.css`

- [x] Happy path — complete request prepares mailto:speaking@jasperfu.com
- [x] Validation — one test per required field / invalid engagement / invalid email
- [x] Access control — N/A: public speaking form, no auth; mailto locked to speaking inbox
- [x] Boundary conditions — notes 1 / MAX-1 / MAX; optional blanks accepted; oversized fields rejected; notes preview 0 / MAX / MAX+1
- [x] Verification function — `verifySpeakingBooking` / `verifyPreparedSpeakingMailto` / `verifyPlainSendButton` / `verifySpeakingPage`
- [x] DRY setup — `makeSpeakingDraft` / `emptySpeakingBooking` / `fillHappyPath` / `compileSpeakingRequestJson`
- [x] Unique error messages — engagement required vs invalid; full name required vs too long; email required vs invalid
- [x] Path coverage — request.json is not rendered; mailto body is the compiled JSON; booking title uses section-intro--full; contact keeps InquiryForm

---

## Feature: Header and home CTA labels

**Paths / functions touched:** `lib/navigation.ts`, `lib/copy.ts`, `components/site/site-shell.tsx`, `app/page.tsx`, `app/media-kit/page.tsx`

- [x] Happy path — nav Book → `/speaking`; header and home CTAs Book to Speak → `/speaking`; closer Request Full Media Kit; Contact (not Jasper's Team)
- [x] Validation — missing/retired/unpublished label and href throw distinct errors for header CTA and each copy CTA
- [x] Access control — N/A: public chrome and copy, no auth
- [x] Boundary conditions — trimmed published labels/hrefs accepted; empty/whitespace rejected
- [x] Verification function — `verifyHeaderCta` / `verifyBookToSpeakCta` / `verifyRequestFullMediaKitCta` / `verifyContactCta` / `verifySiteShell` / `verifyHomePage`
- [x] DRY setup — `HEADER_CTA` / `BOOK_TO_SPEAK_CTA` / `REQUEST_FULL_MEDIA_KIT_CTA` / `CONTACT_CTA` / `makeHeaderCta`
- [x] Unique error messages — Media Kit header vs unpublished label vs media-kit href vs unpublished href; View Media Kit vs unpublished speaking CTA; Download Media Kit vs unpublished kit CTA; Contact Jasper's Team vs unpublished contact CTA
- [x] Path coverage — Speaking omitted from primary nav; View Media Kit / Download Media Kit / Contact Jasper's Team absent from home; header `.header-cta` is Book to Speak not Media Kit

---

## Feature: Request Media Kit inquiry type

**Paths / functions touched:** `lib/contact.ts`, `components/contact/inquiry-form.tsx`

- [x] Happy path — `mediaKit` parses, routes to press@coinsub.io, mailto subject is Request Media Kit
- [x] Validation — missing / Download Media Kit / unpublished labels throw distinct errors; unknown inquiry type still rejected
- [x] Access control — N/A: public inquiry form, no auth
- [x] Boundary conditions — trimmed published label accepted; empty/whitespace rejected
- [x] Verification function — `verifyMediaKitInquiry` / `verifyMediaKitInquiryLabel` / `verifyInquiryTypes`
- [x] DRY setup — `MEDIA_KIT_INQUIRY_TYPE` / `MEDIA_KIT_INQUIRY_LABEL` / `makeInquiry`
- [x] Unique error messages — required vs Download Media Kit vs unpublished label; invalid inquiry type remains "Please select a valid inquiry type"
- [x] Path coverage — option present on press inquiries form; Download Media Kit option absent; speaking/partnership routes unchanged

---

## Feature: Header Booking nav label

**Paths / functions touched:** `lib/navigation.ts`, `components/site/site-shell.tsx`

- [x] Happy path — nav Booking → `/speaking`; CSS still uppercases to BOOKING
- [x] Validation — missing / Book / Speaking / unpublished labels throw distinct errors
- [x] Access control — N/A: public chrome, no auth
- [x] Boundary conditions — trimmed Booking accepted; empty/whitespace rejected
- [x] Verification function — `verifyBookingNavLabel` / `verifySiteShell`
- [x] DRY setup — `BOOKING_NAV_LABEL` / `BOOKING_NAV_HREF`
- [x] Unique error messages — required vs Book vs Speaking vs unpublished
- [x] Path coverage — Book and Speaking omitted from primary nav; header CTA remains Book to Speak

---

## Feature: Booking Send Request inbox

**Paths / functions touched:** `lib/identity.ts`, `lib/speaking.ts`, `components/speaking/book-jasper-form.tsx`

- [x] Happy path — booking mailto routes to speaking@jasperfu.io
- [x] Validation — missing / speaking@jasperfu.com / info@jasperfu.io / unpublished inboxes throw distinct errors
- [x] Access control — N/A: public booking form, no auth; mailto locked to booking inbox
- [x] Boundary conditions — trimmed published inbox accepted; empty/whitespace rejected
- [x] Verification function — `verifyBookingEmail` / `verifySpeakingBooking` / `verifyPreparedSpeakingMailto`
- [x] DRY setup — `PUBLISHED_BOOKING_EMAIL` / `RETIRED_SPEAKING_BOOKING_EMAIL` / `RETIRED_INFO_BOOKING_EMAIL` / `makeSpeakingDraft`
- [x] Unique error messages — required vs retired .com vs retired info@ vs unpublished inbox
- [x] Path coverage — contact speaking inquiry still uses speaking@jasperfu.com; booking form mailto is speaking@jasperfu.io

---

## Feature: Published legal policies

**Paths / functions touched:** `lib/legal/published.ts`, `lib/legal/drafts.ts`, `lib/legal/terms.ts`, `lib/copy.ts`, `app/{legal,privacy,cookies,terms}/page.tsx`, `components/site/legal-document.tsx`

- [x] Happy path — Last updated August 14, 2026; privacy 15 / cookies 7 / terms 18 sections; disclaimer names Coinsub and Jasper Fu
- [x] Validation — missing date, Insert date placeholder, unpublished date, blank title, empty copy, counsel placeholder throw distinct errors
- [x] Access control — N/A: public legal copy, no auth
- [x] Boundary conditions — trimmed published date accepted; empty/whitespace rejected
- [x] Verification function — `verifyLegalUpdated` / `verifyPublishedPolicies` / `verifyHeading`
- [x] DRY setup — `LEGAL_UPDATED` / `makeSection` / `LEGAL_CONTACT_EMAIL` / `LEGAL_SITE_HOST`
- [x] Unique error messages — date required vs Insert date vs unpublished date; section required vs title vs copy vs Insert date vs counsel
- [x] Path coverage — blocks render on privacy Information We Collect; ToS uses jasperfu.com and info@jasperfu.io; Coinsub-only disclaimer rejected

---

## Feature: Remove legal draft-review notice

**Paths / functions touched:** `components/site/legal-page.tsx`, `lib/legal/published.ts`

- [x] Happy path — Privacy, Cookie, Terms, and Legal pages omit the draft-review notice
- [x] Validation — retired draft notice and any leftover notice throw distinct errors
- [x] Access control — N/A: public legal chrome, no auth
- [x] Boundary conditions — whitespace-only omitted notice accepted
- [x] Verification function — `verifyLegalDraftNoticeOmitted` / `verifyLegalPage`
- [x] DRY setup — `RETIRED_LEGAL_DRAFT_NOTICE`
- [x] Unique error messages — retired draft notice vs leftover unpublished notice
- [x] Path coverage — `.legal-page__notice` absent from LegalPage; three policy pages and Legal and Compliance omit the copy









---

## Feature: Password-gated landing page

**Paths / functions touched:** `lib/gate.ts`, `proxy.ts`, `app/api/unlock/route.ts`, `app/unlock/page.tsx`, `components/gate/unlock-form.tsx`, `app/robots.ts`, `app/layout.tsx`, `app/globals.css`, `e2e/public-routes.spec.ts`

- [x] Happy path — correct password issues a signed cookie and lands the visitor on the page they requested
- [x] Validation failures — missing / non-string / over-long password, malformed JSON body, relative gate path, and unusable SITE_PASSWORD each throw or return a distinct error
- [x] Access control — no cookie, expired cookie, tampered signature, extended-expiry replay, cookie signed with a rotated password, and the wrong password at the endpoint are all refused
- [x] Boundary conditions — password 8 / 199 / 200 / 201 chars; token accepted at expiry-1ms and refused at expiry and expiry-1ms-past; submitted password 1 / MAX-1 / MAX
- [x] Verification function — `verifyEnabledConfig` / `verifyDisabledConfig` / `verifyTokenAccepted` / `verifyTokenRejected` / `verifyGated` / `verifyAllowed` / `verifyUnlocked` / `verifyRejected` / `verifyGateScreen` / `verifyUnlockRequest`
- [x] DRY setup — `makeEnv` / `makeToken` / `makeRequest` / `enableGate` / `renderForm` / `renderUnlockPage` / `jsonResponse`
- [x] Unique error messages — min vs max site password; gate path required vs must start with a slash; password required vs too long; token needs a password vs expiry must be a positive integer; wrong password vs gate not enabled vs body not JSON
- [x] Path coverage — gate off and on; bypass list vs gated routes; open-redirect rejection in lib, endpoint, form, and page; robots allow vs disallow; layout index vs noindex; form pending, network failure, and unexplained failure branches

---

## Feature: Unlock screen chrome — no page background, centred seal and CTA

**Paths / functions touched:** `app/globals.css`, `lib/identity-css.test.ts`, `components/gate/unlock-form.test.tsx`

- [x] Happy path — `.unlock-page` paints no background of its own; seal and View site button are `justify-self: center`
- [x] Validation failures — missing unlock page rule, a painted background, an off-centre seal, and an off-centre button each throw distinct errors
- [x] Access control — N/A: presentational CSS on the gate screen; the gate's own auth coverage is unchanged
- [x] Boundary conditions — card keeps `justify-items: start` so only the seal and button re-centre; `min-height: 100dvh` retained
- [x] Verification function — `verifyUnlockScreenChrome` / `parseUnlockChrome`
- [x] DRY setup — `unlockPageBlock` / `unlockCardBlock` / `unlockSealBlock` / `unlockButtonBlock`
- [x] Unique error messages — page rule required vs must not paint its own background vs seal must be centred vs button must be centred
- [x] Path coverage — served stylesheet re-checked over curl; `background: var(--paper)` gone; copy stays left-aligned

---

## Feature: About guarded career timeline and credentials

**Paths / functions touched:** `lib/copy.ts`, `lib/copy.test.ts`, `app/about/page.tsx`

- [x] Happy path — the same 4 career-timeline items and 3 credentials still render, now parsed through a guard
- [x] Validation — empty and placeholder items throw distinct errors for each list
- [x] Access control — N/A: public About content, no auth
- [x] Boundary conditions — item counts at MIN-1/MIN/MAX/MAX+1 rejected or accepted per list
- [x] Verification function — `parseCareerTimeline` / `parseCredentials`
- [x] DRY setup — shared `timelineItems(count)` fixture factory
- [x] Unique error messages — item required vs item is a placeholder vs below-min vs above-max vs items must each be unique, per list
- [x] Path coverage — both guards fully exercised; page output unchanged

---

## Feature: About polished portrait replaces placeholder

**Paths / functions touched:** `app/about/page.tsx`, `app/public-routes.test.tsx`

- [x] Happy path — portrait renders `/portraits/jasper-fu-about.jpg` at its real 780x975
- [x] Validation — N/A: single hardcoded published source, no guard branch added
- [x] Access control — N/A: public About portrait, no auth
- [x] Boundary conditions — N/A: single image, not a bounded list
- [x] Verification function — `verifyAboutPortrait`
- [x] DRY setup — `renderAbout`
- [x] Unique error messages — N/A: static presentational swap
- [x] Path coverage — placeholder source absent; new source and corrected height present; confirmed by screenshot against the overlay gradient

---

## Feature: About quick facts stat row

**Paths / functions touched:** `lib/copy.ts`, `lib/copy.test.ts`, `app/about/page.tsx`, `app/public-routes.test.tsx`

- [x] Happy path — 3 quick facts render in `.fact-grid` right after the bio, first card `.stat-card--primary`
- [x] Validation — empty label/value/detail and placeholder value throw distinct errors
- [x] Access control — N/A: public About content, no auth
- [x] Boundary conditions — fact counts at MIN-1/MIN/MAX/MAX+1 rejected or accepted against the fixed 3-column grid
- [x] Verification function — `verifyAboutQuickFacts`
- [x] DRY setup — `quickFactRows(count)` factory
- [x] Unique error messages — label required vs value required vs detail required vs placeholder vs below-min vs above-max vs labels must each be unique
- [x] Path coverage — `parseQuickFacts` fully exercised; confirmed by screenshot

---

## Feature: About pull-quotes section restored

**Paths / functions touched:** `lib/copy.ts`, `lib/copy.test.ts`, `app/about/page.tsx`, `app/public-routes.test.tsx`

- [x] Happy path — all 4 pull-quotes render as unattributed `.quote-card` blocks
- [x] Validation — empty and placeholder quote text throw distinct errors
- [x] Access control — N/A: public About copy, no auth
- [x] Boundary conditions — quote counts at MIN-1/MIN/MAX/MAX+1 rejected or accepted; quotes must be unique
- [x] Verification function — `verifyAboutPullQuotesSection`
- [x] DRY setup — `pullQuoteStrings(count)` factory
- [x] Unique error messages — quote required vs quote is a placeholder vs below-min vs above-max vs quotes must each be unique
- [x] Path coverage — page-wide zero-`<cite>` invariant re-verified; previous "omits the unused pull-quote list from About" test replaced with a positive presence test; the unrelated home-page `pullQuotes[0]` absence test (`app/page.test.tsx`) re-run and confirmed unaffected

---

## Feature: About FAQ section restored, programmable-money stub excluded

**Paths / functions touched:** `lib/copy.ts`, `lib/copy.test.ts`, `app/globals.css`, `app/about/page.tsx`, `app/public-routes.test.tsx`

- [x] Happy path — the first 3 FAQ questions render as native `<details>`/`<summary>`, verified both closed and opened
- [x] Validation — empty question/answer and the drafted pending-stub answer throw distinct errors
- [x] Access control — N/A: public About copy, no auth
- [x] Boundary conditions — published count below 1 rejected, above available questions rejected, a locally-built 4-item fixture proves count=4 works once given real copy
- [x] Verification function — `verifyAboutFaqSection`
- [x] DRY setup — reuses the real `aboutFaqs` array plus one local 4-item fixture for the future-bump test
- [x] Unique error messages — question required vs answer required vs answer is still a pending stub vs count below 1 vs count exceeds available questions vs questions must each be unique
- [x] Path coverage — "Who is David Akers?" and "collaborative co-founder effort" absence assertions removed from two prior tests (`verifyAboutAbsences`, and the renamed "omits 250-word-only copy, approved lengths, and the standalone co-founder card" test); "What does programmable money mean?" and "Definition pending" remain asserted absent; open/closed states confirmed by screenshot

---

## Feature: About header and portrait restyle

**Paths / functions touched:** `app/globals.css`, `app/about/page.tsx`, `lib/identity-css.test.ts`, `app/public-routes.test.tsx`

- [x] Happy path — "About" label renders at the sitewide eyebrow scale in sky, the cash-to-digital quote leads at display scale, and the portrait renders uncaptioned
- [x] Validation — a missing rule, a missing font-size, a non-rem unit, the retired doubled-gold size, and any other off-scale value each throw distinct errors
- [x] Access control — N/A: public About chrome, no auth
- [x] Boundary conditions — label pinned to exactly the eyebrow scale (0.75rem); 1.5rem rejected by name as retired, 1rem rejected as off-scale
- [x] Verification function — `verifyAboutPageLabel` / `parseAboutPageLabelSize` / `verifyAboutBioProse` / `verifyAboutPortrait`
- [x] DRY setup — `aboutPageLabelBlock` / `renderAbout`; `ABOUT_LABEL_REM` and `ABOUT_QUOTE_FONT_SIZE` pinned beside their retired counterparts
- [x] Unique error messages — label rule required vs font-size required vs must be a rem length vs doubled gold label is not published vs must be the eyebrow scale
- [x] Path coverage — gold label, navy rule, gold quote border, and the whole portrait scrim (`__overlay`/`__name`/`__thesis`) asserted absent from both the stylesheet and the DOM; `identity.thesis` asserted absent from the page entirely; desktop and 390px screenshots confirm the rendering

---

## Feature: About hero showcase card

**Paths / functions touched:** `lib/identity.ts`, `lib/identity.test.ts`, `app/globals.css`, `app/about/page.tsx`, `lib/identity-css.test.ts`, `app/public-routes.test.tsx`

- [x] Happy path — centred label, locked one-liner at display scale, quote as its deck, and the NYSE still framed as a hero card carrying the name, role, and all three quick facts
- [x] Validation — `assertLockedOneLiner` rejects empty, placeholder, the retired trust-as-architecture line, and any other wording; `parseShowcaseAspectRatio` rejects a missing rule, a missing ratio, and any crop that would expose the broadcast chyron
- [x] Access control — N/A: public About chrome, no auth
- [x] Boundary conditions — crop ratio accepted exactly at the 2.32 minimum and the 3:1 maximum, rejected just outside both; 16:9 (the uncropped source ratio) rejected by name
- [x] Verification function — `verifyShowcaseCard` / `parseShowcaseAspectRatio` / `verifyAboutShowcase` / `verifyAboutBioColumn` / `verifyRetiredQuickFactsBand`
- [x] DRY setup — `showcaseImageBlock`; reuses the already-guarded `MEDIA_KIT_SPEAKING_PHOTO` / `assertMediaKitPhoto` rather than duplicating the asset path
- [x] Unique error messages — one-liner required vs placeholder vs trust-as-architecture vs must be the orchestration-layer line; showcase rule required vs aspect-ratio required vs must be a numeric ratio vs must stay wide enough to cut the broadcast lower-third vs cannot be wider than 3:1
- [x] Path coverage — `height: auto` pinned because the img's width/height attributes are presentational hints that otherwise make both axes definite and silently cancel the crop (caught in review via a computed-style probe, not by eye); the retired 4:5 portrait, its scrim, and the stat-card band all asserted absent from stylesheet and DOM; each quick fact asserted to render exactly once; desktop and 390px screenshots confirm the rendering

---

## Feature: About bio row beside the company panel

**Paths / functions touched:** `app/globals.css`, `app/about/page.tsx`, `lib/identity-css.test.ts`, `app/public-routes.test.tsx`

- [x] Happy path — the bio runs in the left column with the Coinsub company panel as a right-hand aside, and the career timeline pairs with credentials in one two-column row
- [x] Validation — N/A: presentational regrouping, no new guard or parsed input
- [x] Access control — N/A: public About content, no auth
- [x] Boundary conditions — the two-col row asserted to hold exactly 2 columns, each carrying its full list (4 timeline items, 3 credentials); exactly one `.credentials-list` remains
- [x] Verification function — `verifyAboutBioColumn` / `verifyAboutBioLayout`
- [x] DRY setup — the company panel reuses the home brief's `.home-company` rule via a shared selector rather than duplicating padding, border, and background for About
- [x] Unique error messages — N/A: layout change, no thrown errors
- [x] Path coverage — the retired single 42rem column asserted absent from the stylesheet; the standalone full-width credentials band asserted gone; desktop and 390px screenshots confirm the row fills and stacks

---

## Feature: Media kit hosts its own pre-selected request form

**Paths / functions touched:** `app/media-kit/page.tsx`, `app/page.tsx`, `app/globals.css`, `lib/identity-css.test.ts`, `app/public-routes.test.tsx`

- [x] Happy path — /media-kit renders the inquiry form beside the still with "Request Media Kit" already selected, instead of a button forwarding to /contact
- [x] Validation — N/A here: the form's own guards (`parseInquirySubmission`, `assertMediaKitInquiryLabel`) are unchanged and already covered in `lib/contact.test.ts`
- [x] Access control — N/A: public request form, no auth
- [x] Boundary conditions — exactly one `form.inquiry-form` on the page; /contact asserted to keep the `interview` default so the two entry points cannot drift
- [x] Verification function — `verifyMediaKitRequest` / `verifyContactPage`
- [x] DRY setup — reuses the existing `InquiryForm` `defaultType` prop and `MEDIA_KIT_INQUIRY_TYPE`; no second form component, no query-param plumbing, both routes stay statically rendered
- [x] Unique error messages — N/A: no new guard introduced
- [x] Path coverage — the forwarding link to `/contact#inquiry-form` asserted absent; selected option asserted to read `MEDIA_KIT_INQUIRY_LABEL`; pre-selection confirmed in a real browser (`#inquiryType.value === "mediaKit"`), not only in jsdom

---

## Feature: Media kit drops the hero still for a single centred column

**Paths / functions touched:** `lib/copy.ts`, `lib/copy.test.ts`, `app/media-kit/page.tsx`, `app/page.tsx`, `app/globals.css`, `lib/identity-css.test.ts`, `app/public-routes.test.tsx`

- [x] Happy path — /media-kit renders a centred head over a centred form, with the media-kit promise as its lede and no image on the page
- [x] Validation — `assertMediaKitPromise` rejects empty, the exact retired no-request-email line, any rewording that still contains that claim, and any other copy
- [x] Access control — N/A: public request page, no auth
- [x] Boundary conditions — N/A: single published string, not a bounded list
- [x] Verification function — `verifyMediaKitRequest`
- [x] DRY setup — the promise is one guarded constant shared by the home media-kit section and the /media-kit lede, replacing the inline sentence that existed on home
- [x] Unique error messages — promise required vs no-request-email promise is not published vs cannot claim no request is required vs must be the sent-on-request line
- [x] Path coverage — the page asserted to contain no `img` at all, and `.media-kit-request__photo` / `__figure` asserted gone from both DOM and stylesheet; the retired promise asserted absent from the rendered page; the NYSE still now appears once as the About hero, with the home page keeping only the video embed of that interview

---

## Feature: Media kit request moves into a dialog on a one-screen page

**Paths / functions touched:** `lib/contact.ts`, `lib/contact.test.ts`, `components/contact/inquiry-form.tsx`, `components/contact/inquiry-form.test.tsx`, `components/media-kit/request-dialog.tsx`, `app/media-kit/page.tsx`, `app/globals.css`, `lib/identity-css.test.ts`, `app/public-routes.test.tsx`

- [x] Happy path — the ask fills the first screen (eyebrow, title, lede, button, response note, press email) and the button opens a native `<dialog>` carrying the form, narrowed to Request Media Kit with no scheduling block
- [x] Validation — `parseInquiryTypeOptions` rejects an empty option list, duplicated types, and a default that is not among the offered types
- [x] Access control — N/A: public request page, no auth
- [x] Boundary conditions — option lists of 0 (rejected), 1 (the media-kit case), and the full published list all covered
- [x] Verification function — `verifyMediaKitRequest` / `verifyInquiryTypes` / `verifyCalendlyBooking`
- [x] DRY setup — one `InquiryForm` serves both pages through `types` and `showScheduling` props; no second form component, and `/contact` keeps every type plus Calendly
- [x] Unique error messages — needs at least one inquiry type vs types must each be unique vs `${defaultType}` is not among the offered inquiry types
- [x] Path coverage — Calendly asserted absent from the media-kit form and still present on `/contact`; the select asserted to hold exactly one option; the dialog asserted closed on load; the retired `.media-kit-request` layout asserted gone from DOM and stylesheet; opened in a real browser to confirm `showModal()` works, focus moves inside, Esc closes, and the hero fills the viewport (hero bottom 898px of 900px) — none of which jsdom can exercise

---

## Feature: Boxed form fields and a framed request dialog

**Paths / functions touched:** `components/contact/inquiry-form.tsx`, `components/contact/inquiry-form.test.tsx`, `components/media-kit/request-dialog.tsx`, `app/globals.css`, `app/public-routes.test.tsx`

- [x] Happy path — the dialog carries a bordered head with an × close, boxed inputs, and a full-bleed footer with Cancel beside Send Request; the type picker is gone and its value rides along hidden
- [x] Validation — a hidden single type still parses and routes: the mailto subject is asserted to read "Request Media Kit — NASDAQ" with no picker rendered
- [x] Access control — N/A: public request form, no auth
- [x] Boundary conditions — the picker appears only above one offered type: absent at 1 (media kit), present at the full published list (`/contact`)
- [x] Verification function — `verifyMediaKitRequest` / `verifyInquiryTypes` / `verifyCalendlyBooking`
- [x] DRY setup — one `InquiryForm` still serves both pages; `onCancel` is optional, and `:only-child` keeps `/contact`'s submit full-width without a second layout
- [x] Unique error messages — N/A: presentational change plus an inferred picker rule, no new guard
- [x] Path coverage — dialog contents queried through the DOM rather than by role, since a closed `<dialog>` is hidden from the accessibility tree; confirmed in a real browser that the modal has 0 selects, hidden type `mediaKit`, no Calendly, a working Cancel, and 10px input radius, while `/contact` still reports 6 options, Calendly present, and no Cancel

---

## Feature: Media coverage featured item uses the home split header

**Paths / functions touched:** `app/press/media-coverage/page.tsx`, `app/public-routes.test.tsx`

- [x] Happy path — the featured interview renders the `.featured-interview` split header (title and outlet wordmark left, standfirst and action right) over a full-width player, matching the home page
- [x] Validation — the wordmark goes through `assertOutletMarkFor`, so an uncleared outlet throws rather than rendering; the action label goes through `assertWatchInterviewCta`
- [x] Access control — N/A: public press page, no auth
- [x] Boundary conditions — the logo treatment is scoped to the featured item only, since `assertOutletMarkFor` has no mark for "DecentraLounge / GlobalStake Podcast"; the remaining items keep their outlet as text
- [x] Verification function — the coverage assertions in `renders media coverage including the NASDAQ interview`
- [x] DRY setup — reuses the existing `.featured-interview` CSS untouched and the already-guarded `WATCH_INTERVIEW_CTA`; no new styles were added
- [x] Unique error messages — N/A: reuses existing guards and their errors
- [x] Path coverage — the retired bordered `article.card` and the "Watch on YouTube" label asserted absent; title, alt, logo src, caption, embed src and watch href all asserted against `mediaCoverage[0]`; every remaining item asserted to still show its outlet and title

---

## Feature: Coverage cards get thumbnails, and the Circle link points at the episode

**Paths / functions touched:** `lib/copy.ts`, `app/press/media-coverage/page.tsx`, `app/public-routes.test.tsx`

- [x] Happy path — the three non-featured items render the press-release card (thumbnail, outlet, title, caption, full-width button) and the Circle entry links to its Builder Series episode
- [x] Validation — every thumbnail goes through `assertPressThumbnail`, which rejects empty, placeholder, and non-`/press/` sources
- [x] Access control — N/A: public press page, no auth
- [x] Boundary conditions — `image` is optional on `CoverageItem`; the featured item has none and runs its player instead, and the card renders its media block only when an image exists
- [x] Verification function — the coverage assertions in `renders media coverage including the NASDAQ interview`
- [x] DRY setup — reuses the press page's `card--thumb` markup, `PRESS_THUMB_WIDTH`/`HEIGHT`, and `assertPressThumbnail`; no new CSS
- [x] Unique error messages — N/A: reuses the existing thumbnail guard and its errors
- [x] Path coverage — every card's thumbnail src/width/height, action label and href asserted against `mediaCoverage`; the retired `https://www.circle.com` asserted absent and no card allowed to link to a bare `/` path; all three destinations confirmed HTTP 200, and the Circle video verified by title as the Coinsub/Jasper Fu Builder Series episode before the link was changed

---

## Feature: Press alerts signup becomes a panel with an inline field

**Paths / functions touched:** `components/press/press-alert-form.tsx`, `app/press/page.tsx`, `app/globals.css`, `app/public-routes.test.tsx`

- [x] Happy path — the ask and the signup render as one bordered panel, with the email field and Notify me button sharing a line
- [x] Validation — unchanged: `parsePressAlertEmail` still rejects an empty and a malformed address, and the input now carries `aria-invalid` when it does
- [x] Access control — N/A: public signup, no auth
- [x] Boundary conditions — the panel and the form both collapse to one column below 900px, so the field never sits beside the button when there is no room
- [x] Verification function — `pairs the alerts ask with an inline signup rather than a page-wide field`
- [x] DRY setup — reuses the shared boxed-input styling and `.button-link`; `.alert-form__field` joins the existing stacked-field rule rather than redefining it
- [x] Unique error messages — N/A: no new guard, the parser's errors are unchanged
- [x] Path coverage — panel, eyebrow, wrapped field, label/input association and submit button all asserted; the button asserted to sit outside the field wrapper; measured in a real browser that the input is 403px inside a 1280px panel rather than spanning it, and that field and button share a baseline

---

## Feature: Speaking topics bulleted instead of numbered

**Paths / functions touched:** `app/speaking/page.tsx`, `app/globals.css`, `app/public-routes.test.tsx`

- [x] Happy path — all five topics render with a ringed dot marker, and the list is a `<ul>`
- [x] Validation — N/A: presentational change, no guard or parsed input
- [x] Access control — N/A: public speaking page, no auth
- [x] Boundary conditions — the dot count is asserted equal to `speakingTopics.length`, so a sixth topic cannot render without its marker
- [x] Verification function — `verifySpeakingTopics`
- [x] DRY setup — reuses the ringed-dot look of the About career timeline rather than inventing a second marker style
- [x] Unique error messages — N/A: no new guard
- [x] Path coverage — the `<ol>` asserted gone, each `01`–`05` counter asserted absent from the page, and the marker column narrowed from 3rem to the dot's own width; verified in a browser that the list is a UL with 5 round 12px dots and no counters in its text

---

## Feature: Booking form boxed fields and a real date range

**Paths / functions touched:** `lib/speaking.ts`, `lib/speaking.test.ts`, `components/speaking/book-jasper-form.tsx`, `app/globals.css`

- [x] Happy path — the booking form uses the site's boxed fields, and Date(s) is now Start date / End date as native pickers whose values reach the mailto JSON as `start_date` / `end_date`
- [x] Validation — a malformed date, an impossible calendar date, an end before its start, and an end with no start each throw their own error, mapped to the field that caused them
- [x] Access control — N/A: public booking form, no auth
- [x] Boundary conditions — equal dates accepted as a single-day booking; a start with no end accepted; both blank accepted; end-before-start by one day rejected
- [x] Verification function — `verifySpeakingBooking` / `verifySpeakingFailure`
- [x] DRY setup — `makeSpeakingDraft`; the boxed input rules mirror the inquiry and alert forms
- [x] Unique error messages — start vs end "must be a valid date"; "Start date is required with an end date"; "End date cannot be before the start date"
- [x] Path coverage — `isSpeakingDate` round-trips through `Date`, so 2026-13-01, 2026-02-30 and 2026-11-31 are all rejected where the pattern alone accepted them (caught by a test before shipping); the retired free-text `#speaking-date` asserted gone in the browser, and the end picker's `min` confirmed to track the chosen start

---

## Feature: About closing CTA band

**Paths / functions touched:** `app/globals.css`, `app/about/page.tsx`, `app/public-routes.test.tsx`

- [x] Happy path — Book to Speak (`/speaking`) and View All Media Coverage (`/press/media-coverage`) render as the page's final section
- [x] Validation — existing `assertBookToSpeakCta`/`assertViewAllCoverageCta` retired/unpublished-label errors still apply unchanged
- [x] Access control — N/A: public About CTA, no auth
- [x] Boundary conditions — N/A: exactly two fixed CTAs, not a bounded list
- [x] Verification function — `verifyAboutClosingCta`
- [x] DRY setup — reuses `BOOK_TO_SPEAK_CTA`/`VIEW_ALL_COVERAGE_CTA` constants already guarded and used elsewhere on the site
- [x] Unique error messages — N/A: guard functions and their distinct errors are already covered in `lib/copy.test.ts`
- [x] Path coverage — About previously had zero outbound links; both hrefs now verified

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









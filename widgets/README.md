# Graffiti Creative Group widgets

There was no `widgets/` directory in the Graffiti Creative Group folder. These are the reusable UI and motion modules from that project.

Source: `/Users/kavsol/Documents/Influencer-Compliance/Graffiti Creative Group`

| Here | Original path |
|------|----------------|
| `site/site-shell.tsx` | `components/site/site-shell.tsx` |
| `site/motion-root.tsx` | `components/site/motion-root.tsx` |
| `site/legal-page.tsx` | `components/site/legal-page.tsx` |
| `motion/reveal.ts` | `lib/motion/reveal.ts` |
| `lib/navigation.ts` | `lib/navigation.ts` |
| `site-styles.css` | `app/globals.css` |

Tests were copied next to each module. Import paths were rewritten so this folder is self-contained (`site/` → `../lib`, `../motion`).

These widgets still depend on Next.js (`next/link`) and the original Graffiti class names in `site-styles.css`. They are reference copies for this agent, not a running app.

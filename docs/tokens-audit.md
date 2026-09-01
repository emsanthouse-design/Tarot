# tokens.css audited against the spec

Date: 2026-09-01. Spec: `docs/design-system.md` v1.0. First job item 1.

Every color in the spec was already present and correct, and the hex values match
§1 exactly. What follows is what was missing, wrong, or newly needed once a real
widget was built against the file.

## Colors — verified

All eighteen values in §1 are present and byte-correct: six grounds, gold and
brass, both interruption colors, three neutrals. Nothing in §1 is absent from
`tokens.css`, and `tokens.css` introduces nothing §1 does not name — with one
exception, below.

## 1. `--text-muted` was off-palette, and failed contrast

`--text-muted: #7E8B7F` was the only value in the file with no source in the
spec. It is a cool gray-green, and §1 says *never neutral gray*. It also scored
**3.02:1 on `--cream`**, under the 4.5 that body copy and captions need — and
captions at 13px are exactly what a muted color is for.

Replaced with a value derived from the palette instead of introduced alongside
it: `--ink-thin`, 65% `--ink` over 35% `--cream`, which is `#66615A` and scores
**5.19:1**. Ink laid on lighter, which is what the material rule would do anyway.

Added `--text-muted-on-dark: var(--ground-sage)` for the same job on a dark
ground — 5.91 on hunter, 7.56 on navy — because the previous file had no answer
for metadata on `--surface` and a widget would have invented one.

**This is the one change here that is a look, not plumbing.** Easy to revert if
the gray was deliberate.

## 2. Type tokens the spec specifies and the file did not carry

The §2 scale table gives a weight for every level; `tokens.css` had none, so
widgets would have hardcoded `600` and `500` and drifted. Added `--weight-h1`
through `--weight-label`.

Also added, all straight from §2:

| Added | Value | Spec |
|---|---|---|
| `--leading-small` | 1.5 | "Small / caption — 13px / 1.5" |
| `--track-small` | 0.01em | "Small / caption — +0.01em" |
| `--fraunces-display` / `--fraunces-body` | `"WONK" 1` / `"WONK" 0` | "wonk axis on for display sizes, off for body" |
| `--size-cover-lg` | 4.5rem (72px) | "Cover title 48–72px" — one token cannot hold a range, and footlights work wants the top of it |

## 3. Structure and material values with nowhere to live

§3 and §4 give numbers that widgets need and the file did not hold, which means
the first widget to need one would have hardcoded it.

- `--grid-columns: 12` — §3, "12-column, 24px gutter". The gutter was already there.
- `--misregister-1: 2px`, `--misregister-2: 4px` — §3, "±2–4px on decorative layers".
- `--shadow-object`, `--shadow-lifted` — §4 requires "shadows implying real
  objects" and bans drop shadow as UI effect. Offset and hard-edged, no blur, so
  they read as a light on an object rather than a glow. **Proposed, not specified**
  — the spec asks for the quality, not these numbers.
- `--ink-rgb: 26, 22, 20` — ink as channels so a shadow can take alpha from it
  without a second hex entering the system.

## Contrast, computed

Every pair below is calculated in `widgets/token-specimen.html` at load from the
resolved token values, so the sheet cannot disagree with the file. WCAG 2.1.

| Pair | Ratio | Body 4.5 | Large 3.0 |
|---|---|---|---|
| `--text` on `--paper` | 15.20 | pass | pass |
| `--text-muted` on `--paper` | 5.19 | pass | pass |
| `--text-on-dark` on `--surface` | 10.31 | pass | pass |
| `--text-on-dark` on `--surface-alt` | 13.19 | pass | pass |
| `--text-muted-on-dark` on `--surface` | 5.91 | pass | pass |
| `--star` on `--surface` | 7.04 | pass | pass |
| `--rule` on `--surface` | 5.04 | pass | pass |
| `--text` on `--ground-sage` | 8.71 | pass | pass |
| `--text-on-dark` on `--ground-crimson` | 5.53 | pass | pass |
| `--rule` on `--paper` | 2.05 | fail | fail |
| `--rule-hairline` on `--paper` | 1.33 | fail | fail |
| `--accent` on `--paper` | 3.18 | fail | pass |
| `--accent` on `--surface` | 3.24 | fail | pass |

The four failures are not bugs, but they are constraints worth knowing:

- **Brass and cream-shade on paper** are hardware and edges. Never set type in them.
- **Both interruption colors** clear 3.0 but not 4.5. Pink and orange are for
  titles, large type and objects — a glove, a nail, one block of display type.
  Not 13px captions, and not on paper for anything that has to be read.

## Open — needs a decision

**Fraunces and IBM Plex Sans are not embedded, so they do not render.** Two of
the three type roles are Google Fonts, and hard constraint 2 says a widget makes
no network requests. Only Tarot Regular ships as a base64 face. Measured in
Chromium against the built file: `"Tarot"` resolves to the embedded font;
`"Fraunces"` and `"IBM Plex Sans"` measure identical to the default serif and
sans, meaning they fall back to Georgia and system-ui on any machine without
them installed. `document.fonts.check()` reports `true` for all three and is
lying — it answers whether *something* can render the text.

The sheet reports its own font state in the footer so this cannot go unnoticed
again.

Embedding the latin subsets would cost, measured: Fraunces variable (400–600,
with the wonk axis) 59 KB raw / 79 KB base64; IBM Plex Sans 400+500 46 KB raw /
61 KB base64. That takes a widget from ~70 KB to ~206 KB. Both are SIL Open Font
License, so vendoring them into `fonts/` is permitted. The build already inlines
any local stylesheet, so this is a drop-in once the files are in the repo.

Not done, because 3× file weight on every widget is a call about the work, not
about the plumbing.

## Left alone

`--font-serif` lists Newsreader as a fallback after Fraunces. §2 calls Newsreader
an *alternate* body serif if Fraunces is too loud at 11pt, which is a different
thing from a fallback — but the stack is a reasonable way to encode it and
changing it would be a type decision, not a correction.

# The Tarot Revue

Design tokens and self-contained widgets for Tarot HQ. Read `CLAUDE.md` first —
it holds the working agreement and the hard constraints. The full spec is
`docs/design-system.md`.

## Build

No dependencies. Node 18+.

```
npm run build        build widgets/src/*.html -> widgets/*.html
npm test             the constraint linter's own tests
npm run check        verify built output and the font embed are current (CI)
npm run embed-font   regenerate fonts/tarot-font-embed.css from the .ttf
```

## How a widget works

Sources live in `widgets/src/`. They are ordinary HTML that links the shared
files relatively:

```html
<link rel="stylesheet" href="../../tokens.css">
<link rel="stylesheet" href="../../fonts/tarot-font-embed.css">
```

so a source file renders live in a browser while you work on it. The build
replaces every local `<link rel=stylesheet>` and `<script src>` with its
contents and writes a single file to `widgets/`. That is what ships: Notion
strips external scripts and will not fetch a sibling asset, so a widget has to
be one file that makes no network requests and works when opened from disk.

Built files in `widgets/` are generated. Edit the source, run the build, commit
both — `npm run check` fails if they have drifted apart.

## What the build refuses to ship

`build/lint.mjs` runs against the built file and fails the build on the hard
constraints. `build/lint.test.mjs` violates each one on purpose, so the checks
are known to actually catch something.

| Rule | Fails on |
|---|---|
| `no-hardcoded-color` | any hex, `rgb()`/`hsl()` with raw channels, or a named color in authored CSS. `rgba(var(--ink-rgb), …)` is fine — the channels still come from `tokens.css` |
| `self-contained` | external `<link>`, `<script src>`, `<img>`, `url()`, `@import`, or anything left un-inlined |
| `radius-zero` | any `border-radius` that is not `0` or `var(--radius)` |
| `display-face-restraint` | Tarot Regular on body copy, UI or tables. Warns past two appearances |
| `one-interruption` | both `--shout-pink` and `--shout-orange` in one composition |
| `no-inversion` | `prefers-color-scheme` or `color-scheme` |
| `paints-own-ground` | (warning) no background set from a token |

The colour check reads declaration values only, so a comment or a class named
`.olive` is not a violation.

## Design system cards

`design-system/src/` builds the same tokens into one page per card for a
Claude Design design-system project. Nine cards in four groups:

| Group | Cards |
|---|---|
| Color | Grounds, Metallic, Interruption, Neutrals, Semantic aliases, Contrast |
| Type | Type scale |
| Space | Space |
| Material | Structure and material |

Each card reads its values off `tokens.css` at load and computes its own
contrast ratios, so a card cannot drift from the token file. Files beginning
with `_` are partials — `_card.css` and `_card.js` are shared by every card and
inlined at build time, never built on their own.

Claude Design indexes a card from an `@dsCard` comment on the **first line** of
the file, so the build keeps that line first and puts its own banner
underneath. `build/build.test.mjs` asserts this, because a banner sitting on
top of the marker would break the import without anything looking wrong.

Only `type-scale.html` embeds Tarot Regular; the other eight have no use for it
and stay around 21 KB.

### Pushing them

The `DesignSync` tool writes to claude.ai/design, and it needs authorization
this repo cannot grant on its own:

1. Create the project **as a design system**. The type is fixed at creation —
   pushing files into an ordinary project never converts it.
2. Authorize a session: run `/design-login` once from an interactive Claude
   Code session, or use Claude Design's *Send to Claude Code Web*.
3. Build, then push `design-system/*.html`.

## Widgets

- `token-specimen.html` — every token rendered from `tokens.css` at load, with
  the contrast table computed in the page. Nothing on it is typed twice, so it
  cannot quietly disagree with the token file. Open it to see whether a token
  change did what you wanted.

## Deploy

Netlify, publishing `widgets/`. `netlify.toml` maps `/embed/<name>` to the
widget file for Notion embeds, and `/<name>` to a bookmarkable URL.

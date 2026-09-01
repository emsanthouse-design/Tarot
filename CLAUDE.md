# The Tarot Revue — repo instructions

Read this before writing anything. The full spec is `docs/design-system.md`; read it too, once, at the start of a session. This file is the operating summary plus the repo's hard constraints.

## What this repo is

Tarot HQ is Erin's tarot practice — a Notion workspace, a set of standalone HTML widgets, and reading documents she produces for real people. This repo holds the code half: the design tokens, the widgets built against them, and the deploy.

**The Tarot Revue** is the visual identity. **Showgirl Backroom** is its register. Positioning: a working tarot reader backstage at the theatre of the occult. Occult as showbiz, not occult as altar. The reader is an operator, the cards are tools, the reading is interpretation performed in real time.

## Working agreement

Erin owns the surface — layout, aesthetic, what things look like and what they say. This repo owns the plumbing — tokens, build, data integrity, deploy. When a decision is aesthetic, propose and ask; don't decide. When it's structural, just do it correctly.

Card math and calculations are always computed, never estimated.

## The three-part test

Every artifact must show **craft, play, and work.**

- Remove craft → cute-modern tarot.
- Remove play → solemn antique occultism.
- Remove work → fantasy imagery where the reader is scenery.

## Hard constraints

1. **Nothing hardcodes a color.** Every color comes from `tokens.css`. If a value is needed that isn't in there, add it to `tokens.css` first and reference it. A widget with a hex literal in it is a bug.

2. **Widgets are self-contained single HTML files.** Notion strips external scripts and won't fetch sibling assets. Tokens and fonts get inlined at build time, not linked. One file, no network requests, works when opened from disk.

3. **`border-radius: 0`.** Everywhere. Everything in this system is printed, cut, or draped. Nothing is a rounded app card.

4. **Three type roles, never a fourth.** Display (Tarot Regular), editorial serif (Fraunces), utility sans (IBM Plex Sans).

5. **Tarot Regular is a display face only.** Cover titles, major titles, section openers, occasional theatrical labels. Never body copy, UI, tables, or long headings. Maximum two appearances per view. It is an actor with a good entrance, not a cast member for three hours.

6. **One interruption color per composition.** Hot pink or orange, not both.

7. **No dark-mode inversion.** This system has one mode: the room, lit the way the room is lit. Widgets paint their own ground rather than adapting to an unknown host background.

## The material rule — load-bearing

Everything must feel physically made, handled, layered, printed, painted, cut, pinned, draped, or placed. Even digital work implies material.

In code this means: implied light and real-object shadows, slight intentional misregistration on decorative layers (±2–4px, never on text), drawn irregular eight-point stars rather than perfect symmetry, texture through repetition rather than filters.

Banned: digital gradients, glossy vector mysticism, perfectly symmetrical celestial diagrams, floating objects with no gravity, drop shadows used as UI effect rather than implied light, generic occult icon sets.

## Celestial rule

The cosmos is textile, illustration, ornament, symbol — never telescope. Stars are drawn, painted, gilded, and slightly irregular. Preferred form is the eight-pointed star, with smaller four-point sparkles secondary.

Test image: navy velvet with gold stars sewn onto it. If it doesn't look like that, it's wrong.

Banned: astrophotography, nebula clouds, galaxy gradients, glowing constellations, blue-purple cosmic haze.

## The volume slider

Same world, different volume. Every artifact sits somewhere on this axis.

**BACKSTAGE ←——————————→ FOOTLIGHTS**

- **Backstage** — study systems, databases, taxonomies, worksheets, reference material. Utility dominates: sans-serif, section color, stars as markers, restrained ornament.
- **Center stage** — reading documents, spread explanations, interpretation guides. Equal craft and theatre.
- **Footlights** — covers, posters, title cards, major-arcana graphics. Maximum spectacle, one idea dominating.

Most widgets in this repo are backstage or center stage. A boring database is allowed to be usable — that is not breaking the brand.

## Hierarchy principle

The weirder the visual environment, the more restrained the informational typography. This is what keeps the system out of theme-park design.

## What we do not make

Tarot has strong genre defaults. All of these are out:

- **Cottage witch** — dried herbs, botanical line drawings, mushrooms, earthy beige, moon-water domesticity.
- **Cosmic wellness** — lavender gradients, galaxies, aura blobs, iridescence, glowing hands.
- **Sexy fae** — jeweled goddess, cards floating decoratively. The person using the cards is never scenery.
- **Brown occult bookstore** — sepia, engravings, curlicues, parchment, distressed blackletter.
- **Clean mystical startup** — minimal beige with one sans-serif word reading INTUITION.
- **Flat Canva occult** — tidy vectors of moons, snakes, eyes, hands, stars arranged into an icon system.

Tarot HQ should look **made**, not branded within an inch of its life.

## The visual test

Before anything ships:

1. Can I imagine touching it? If not, it needs material.
2. Can I see somebody working? If not, it needs a hand, tool, card, mark, or trace of human action.
3. Is there any pleasure in it? If not, it has drifted into solemn occultism.
4. Would this be at home inside a circus tent *or* a workbook? Ideally both.
5. Does it feel like a tarot reader built this, or like a designer searched "tarot aesthetic"?

## Writing voice

Copy inside widgets follows the same rule as the visuals: human skill stays visible.

Opinionated, observant, funny, self-aware. Take the idea seriously, take yourself somewhat less seriously. Dry beats cute. Specific beats inspirational. Never drop keywords from the sky — not "The Hermit represents introspection, wisdom, and solitude" but "He has left the crowd because whatever he is looking for can't be found there."

No generic therapeutic language: healing, stepping into your power, being called to align, releasing what no longer serves you. Say what actually happened. Prefer verbs, prefer nouns, name the thing. Tarot is strange enough already; the prose does not need fog machines.

## Repo layout

```
tokens.css                    single source of truth for all values
fonts/
  Tarot-Regular.ttf           the display face
  Tarot-Regular.otf           same outlines, vendor duplicate
  tarot-font-embed.css        base64 @font-face for self-contained builds
docs/
  design-system.md            the full spec
widgets/                      built widgets, one self-contained file each
```

Both vendor font files carry TrueType outlines (sfnt signature `0x00010000`) despite the `.otf` extension, so `format("truetype")` is correct for both. Use the `.ttf`.

## Existing widgets to migrate

These live outside the repo today, each with its own hardcoded styling, all built before the tokens existed. They come in one at a time.

- Fool's Ascent XP meter (0–XXI track, constellation markers at III/XII/XXI)
- Current Sky (live planetary positions, moon phase, rising sign, retrograde flags)
- Daily Line (one quote per day, date-hashed)
- Reversal Cube (three axes, tappable poles)
- Relationship Lab (has a bring-your-own-API-key deep-read feature)
- Fool's Journey cheat sheet (the Netlify deploy candidate)

## First job — scope it here and stop

1. Confirm `tokens.css` is complete against `docs/design-system.md`.
2. Set up the build that inlines `tokens.css` and `fonts/tarot-font-embed.css` into a standalone widget file.
3. Migrate **one** widget. Not six.

If the token file survives contact with one real widget, it's right and the rest are mechanical. If it doesn't, that's been learned cheaply. Do not migrate the others until Erin has looked at the first one.

## Deploy

Netlify. The Fool's Journey cheat sheet is the standing deploy candidate — it needs a stable URL she can bookmark in any browser. Widgets embedded in Notion use the `/embed` path.

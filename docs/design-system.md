# The Tarot Revue — Design System Spec

**Organization:** Tarot HQ
**Visual world:** The Tarot Revue
**Register:** Showgirl Backroom
**Version:** 1.0 — 2026-08-31

> Glamour was magic before it was beauty. We mean both.

---

## 0. Style sentence

A theatrical, tactile visual world built around tarot as practiced craft — a working reader's booth after dark. Painted canvas, velvet curtains, brass, fringe, gilt eight-point stars, cards, candles, glass, lacquered hands, and the occasional vulgar burst of hot pink. Everything must read as physically made and layered: painted, printed, photographed, cut, placed, shadowed. Never frictionlessly digital. Victorian materials are welcome; Victorian styling is not.

**The three-part test.** Every artifact must show craft, play, and work.
- Remove craft → cute-modern tarot.
- Remove play → solemn antique occultism.
- Remove work → fantasy imagery where the reader is scenery.

---

## 1. Color tokens

Grounds are **surfaces**, not accents. A ground should occupy a majority of any composition.

### Grounds

| Token | Hex | Use |
|---|---|---|
| `ground-hunter` | `#1D3B31` | Deep theatrical green. Primary dark ground. |
| `ground-sage` | `#9DBCA6` | Dusty gray-green. Primary light ground. |
| `ground-olive` | `#6B7355` | Warm mid ground. Never let it drift brown. |
| `ground-navy` | `#16233F` | Night as cloth, not outer space. |
| `ground-crimson` | `#B12737` | Stage curtain red. |
| `ground-oxblood` | `#4A0F17` | Crimson with weight. Covers, footlights work. |

### Metallic

| Token | Hex | Use |
|---|---|---|
| `gold` | `#E3C080` | Stars, rules, trim, ornamental punctuation. |
| `brass` | `#C9A227` | The duller structural gold. Hardware, frames, borders. |

Gold is structural, not decorative. It leans old brass and dull gilt — never champagne luxury.

### Interruption

| Token | Hex | Use |
|---|---|---|
| `shout-pink` | `#D9548A` | One rude flash. A glove, a nail, a title, one block of type. |
| `shout-orange` | `#FD7336` | Same role. The midway switching the neon on. |

Interruption colors appear **once** per composition. If a second one shows up, one of them is wrong.

### Neutrals

| Token | Hex | Use |
|---|---|---|
| `ink` | `#1A1614` | All body text. Warm near-black — reads printed, not screen. |
| `cream` | `#F4EBDC` | Paper. Light ground for text-heavy documents. |
| `cream-shade` | `#D8CDBA` | Hairlines and edges on cream. |

### Color formula

**Deep ground + warm metallic + one rude color.** Safe in almost every case.

Never: lavender, iridescence, aura gradients, beige, sepia, pure black, pure white, neutral gray.

---

## 2. Typography

Three roles. Do not add a fourth.

| Role | Family | Where |
|---|---|---|
| Display | **Tarot Regular** (custom `.otf`/`.ttf`, supplied) | Cover titles, major titles, occasional section openers. |
| Editorial serif | **Fraunces** (Google Fonts, variable) | Titles, subheads, pull quotes, reading-document body. Use the `wonk` axis on for display sizes, off for body. |
| Utility sans | **IBM Plex Sans** (Google Fonts) | Captions, metadata, labels, tables, diagrams, UI, worksheets, Notion. |

Alternate body serif if Fraunces proves too loud at 11pt: **Newsreader** (Google Fonts).

### Tarot Regular usage rules — enforce strictly

Allowed: cover titles · major titles · section openers · labels that deserve theatrical emphasis.
Forbidden: paragraphs · UI · long headings · tables · body copy · every tarot word on the page.

Single weight, no italic, no bold. It is an actor with a good entrance, not a cast member for three hours. Max **two** appearances per spread.

### Scale

| Level | Size | Family | Weight | Tracking |
|---|---|---|---|---|
| Cover title | 48–72px | Tarot Regular | — | +0.02em |
| H1 | 34px | Fraunces | 600 | −0.01em |
| H2 | 24px | Fraunces | 600 | 0 |
| H3 | 18px | Fraunces | 500 | 0 |
| Body | 16px / 1.65 | Fraunces | 400 | 0 |
| Small / caption | 13px / 1.5 | IBM Plex Sans | 400 | +0.01em |
| Label / meta | 11px | IBM Plex Sans | 500 | +0.08em, uppercase |

### Hierarchy principle

**The weirder the visual environment, the more restrained the informational typography.** This is what keeps the system out of theme-park design. Typography does not need to cosplay tarot on every line.

---

## 3. Spacing and structure

- Base unit **8px**. Use 8 / 16 / 24 / 40 / 64.
- Document margins: 64px outer, 40px on mobile widths.
- Rules and borders: **1px `brass`**, or 0.5px `cream-shade` on cream.
- Corner radius: **0**. Everything is printed, cut, or draped — nothing is a rounded app card.
- Grid: 12-column, 24px gutter. Deliberate misregistration of ±2–4px is encouraged on decorative layers, never on text.

---

## 4. The material rule — load-bearing

**Everything must feel physically made, handled, layered, printed, painted, cut, pinned, draped, or placed.** Even digital work implies material.

**Required:** photographed hand over flat painted ground · card taped onto paper · painted gold star, not generated · scanned paper · crinkled stock · velvet texture · fabric folds · shadows implying real objects · collage · slightly imperfect alignment · cut-paper borders · handwriting · gouache · ink · photographic objects composited onto illustration.

**Banned:** digital gradients · glossy vector mysticism · perfectly symmetrical celestial diagrams · floating objects with no gravity · generic occult icon sets · luxury-spiritual polish · drop shadows used as UI effect rather than implied light.

A tarot reading is itself a collage — unrelated images dealt side by side, meaning emerging from the relationship. The visual language behaves the same way.

---

## 5. Celestial rule

The cosmos is **textile, illustration, ornament, symbol** — never telescope.

Stars are drawn, painted, embroidered-looking, printed, or gilded, and slightly irregular. Preferred form: **eight-pointed star**, with smaller four-point sparkles as secondary. Moons, suns, eyes, and astrological marks follow the same rule: symbol, not simulation.

Banned: astrophotography · nebula clouds · galaxy gradients · glowing constellations · blue-purple cosmic haze.

**Test image:** navy velvet with gold stars sewn onto it. If it doesn't look like that, it's wrong.

---

## 6. Human presence

**Hands before faces.** Hands deal, shuffle, point, hover, hold, arrange, turn, mark, light, write. They communicate that somebody is doing the work.

Preferred details: rings · lacquered nails, red especially · sleeves · gloves · cuffs · jewelry · occasional cigarette · visible gesture and tension.

Faces are permitted but less useful. When people appear they are performers or operators, never dreamy embodiments of spirituality.

---

## 7. Object vocabulary

**Primary:** tarot cards · hands · candles · glass · crystal balls · matchbooks · cigarettes · brass objects · rings · velvet · fringe.

**Secondary:** mirrors · dice · ribbons · tickets · handwritten notes · stars · moons · curtains · sparse flowers · tablecloths · lamps · charms.

Objects carry weight, temperature, texture, history. Wax has run down the candle. The card stock looks handled. The tablecloth wrinkles.

---

## 8. Pattern and architecture

| Motif | Use | Constraint |
|---|---|---|
| Curtain | Framing, cover images, section dividers, quotations, major-arcana material | Implies revelation without saying it |
| Tent stripe | Sidebars, borders, tabs, page furniture, backgrounds | Hand-painted, never pristine circus |
| Harlequin diamond | Accents, small panels | Small doses only |
| Stars | Everywhere — nearly punctuation | Irregular points |
| Fringe | Physical edges | An edge, not a graphic motif |

---

## 9. The two clauses

**Victorian clause.** Victorian is material, not style.
- In: velvet · fringe · old brass · dark wood · drapery · theatre curtains · candlelight · old photographs · engraving as collage source · antique objects · theatrical portraiture.
- Out: ornate engraved borders · pseudo-Victorian type · curlicues · sepia as aesthetic · antiquarian occult-shop cosplay · decorative excess whose only message is "old."

**RWS / Pixie clause.** The Rider-Waite-Smith deck is source material, not merchandise inspiration. Reference Pamela Colman Smith as lineage, not fandom. Her drawing language: simplified shapes · strong silhouettes · uneven human line · flat blocks of color · theatrical staging · handmade lettering · folk-art looseness. Favor imagery that looks drawn by somebody over imagery that looks designed by software.

---

## 10. Illustration and photography

**Illustration:** hand-painted, gouache-like, screen-printed, block-printed, hand-cut, naive in the good sense, visibly imperfect. Shapes can be simple. Edges can wobble. Stars don't need matching points. Lines don't need to meet. Symmetry is approximate. Do not clean the humanity out of it.

**Photography:** directional, shadowy, warm, saturated, close, tactile, slightly cinematic, object-focused. Reference **footlight logic** — warm illumination from low or unusual angles throwing theatrical shadows.

The photograph should feel like a moment during work. Someone just dealt the card. Someone is about to turn it. Someone left the room.

Banned outright: the witch flat lay. Crystals + dried flowers + deck + moon cloth + smoke.

---

## 11. Composition

Layouts are **staged**, not decorated. Focal object → supporting material → negative space. Collage does not mean filling every inch.

Moves: object breaking a border · photo layered over illustration · oversized hand or card · curtain framing a title · tiny gold stars in otherwise empty space · one strange object as punctuation · flat pattern under realistic object · slightly misregistered shapes · abrupt blocks of saturated color.

Around an actual reading, use restraint. Establish the room, then let the cards speak.

---

## 12. The volume slider

Same world, different volume. Every artifact sits somewhere on this axis.

**BACKSTAGE ←——————————→ FOOTLIGHTS**

| Position | Artifacts | Direction |
|---|---|---|
| Backstage | Study systems, Notion databases, taxonomies, worksheets, reference material | Utility dominates. Sans-serif, section color, stars as markers, restrained collage. |
| Center stage | Reading documents, spread explanations, essays, interpretation guides | Equal craft and theatre. Strong cover, display type, colored ground, clean body type. |
| Footlights | Covers, posters, title cards, major-arcana graphics, social | Maximum spectacle. One idea dominates: one quote + one card + one object + one joke. |

A boring database is allowed to be usable. That is not breaking the brand.

---

## 13. Per-application specs

**Reading documents** — center stage. Colored ground cover with Tarot Regular title over curtain or stripe framing. Interior on `cream` with `ink` body at 16/1.65 Fraunces. One or two recurring motifs. Gold rules between sections. Object collage on the cover and section openers only.

**Study notes / worksheets** — backstage. `cream` ground, IBM Plex Sans, section color coding from the grounds palette, eight-point stars as bullets and markers, hand-drawn numbering, one accent color per sheet, subtle theatrical framing. The spread itself is already visual — brand around it, not on it.

**Notion** — backstage office. **Custom fonts cannot load in Notion.** Carry the identity through cover images, icon system, terminology, restrained color coding, consistent hierarchy, occasional dividers. Do not compensate with emoji or decorative graphics.

**Social / shared graphics** — footlights. One idea dominates.

**Reference diagrams** — clean diagram first, brand texture second. Make complicated thinking memorable; do not make a diagram resemble a fortune-teller poster.

---

## 14. What we do not make

Explicit because tarot has strong genre defaults.

- **No cottage witch.** Dried herb bundles, linen dresses, botanical line drawings, mushrooms, earthy beige, moon-water domesticity.
- **No cosmic wellness.** Lavender gradients, galaxies, aura blobs, iridescence, chakra palettes, glowing hands, nebulous feminine silhouettes.
- **No sexy fae.** Jeweled goddess staring into middle distance while cards float nearby. The person using the cards is never decorative scenery.
- **No brown occult bookstore.** Wall-to-wall sepia, engravings, curlicues, alchemical diagrams, parchment, distressed blackletter.
- **No clean mystical startup.** Minimal beige deck beside tasteful incense with one sans-serif word reading INTUITION.
- **No flat Canva occult.** Tidy vectors of moons, snakes, eyes, hands, and stars arranged into an icon system.

Tarot HQ should look **made**, not branded within an inch of its life.

---

## 15. The visual test

Run before anything enters the system.

1. **Can I imagine touching it?** If not, it needs material.
2. **Can I see somebody working?** If not, it needs a hand, tool, card, mark, or trace of human action.
3. **Is there any pleasure in it?** If not, it has drifted into solemn occultism.
4. **Would this be at home inside a circus tent *or* a workbook?** Ideally both.
5. **Does it feel like a tarot reader built this world, or like a designer searched "tarot aesthetic"?** This catches almost everything.

---

## 16. Verbal identity

The writing follows the same principle as the visuals: **human skill stays visible.**

**Voice:** opinionated, observant, intelligent, funny, self-aware, genuinely invested. Take the idea seriously; take yourself somewhat less seriously. Dry beats cute. Specific beats inspirational. A sharp observation beats a grand pronouncement.

**Rhythm:** development → compression. A longer sentence works through the thought; a shorter one lands it. Use strategically — if every paragraph ends with a dramatic little sentence it stops being emphasis and becomes a tic. Let paragraphs breathe. Vary sentence length naturally. Punctuation carries voice, but follows the thought rather than manufacturing personality.

**Card interpretation moves:** observation → association → implication → application. What is literally happening in the image? What does that suggest? How does position alter it? What are surrounding cards doing to it? What does it mean for this person and question?

Never drop keywords from the sky. Not *"The Hermit represents introspection, wisdom, and solitude"* but *"He has left the crowd because whatever he is looking for can't be found there"* — then build outward.

**Show the seams.** "What catches me here is…" · "I think the reversal matters." · "There are a couple ways I could read this." · "The cards seem to be arguing with each other here." This is not hedging; it communicates interpretation as skilled judgment.

**Humor** comes from recognition. The deck can be annoyingly literal, theatrical, rude, melodramatic, suspiciously specific. The cards can be funny; someone's pain usually isn't.

**Emotional register.** No generic therapeutic language — healing, stepping into your power, being called to align, entering a new chapter, releasing what no longer serves you. Say what actually happened. Do not soften difficult cards; compassion does not require euphemism.

**Contrast** is a strong tool but needs variation. "Starting again is different from starting over." Avoid the mechanical *it's not X, it's Y* construction — make the first proposition independently useful and let the turn emerge from the reasoning.

**Precision over mystification.** "There is a disagreement about what the partnership is allowed to become," not "there are complicated energies surrounding this connection." Prefer verbs. Prefer nouns. Name the thing. Tarot is strange enough already; the prose does not need fog machines.

### Visual ↔ verbal equivalence

| Visual | Writing |
|---|---|
| Handmade | Visible reasoning |
| Hyperreal object | Concrete language |
| Wonky illustration | Human conversational rhythm |
| Velvet and brass | Literary texture |
| Hot-pink interruption | Dry joke, sharp aside |
| Strong ground | Clear thesis |
| Collage | Cards interpreted relationally |
| Hand at work | Reader thinking on the page |
| Stage | Reading structure |
| Footlights | Emphasis |
| Negative space | Knowing when to stop |

Neither the page nor the prose needs every available ornament.

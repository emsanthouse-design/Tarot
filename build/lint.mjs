/* Constraint checks, run against the BUILT file — the thing that actually
   ships to Notion or Netlify. Errors are the hard constraints from CLAUDE.md;
   warnings are the rules a static check can only estimate.

   Numbered against CLAUDE.md "Hard constraints". */

/* Style blocks that came from tokens.css and the font embed are the two
   places a literal is allowed to exist. Everything else is widget CSS. */
const GENERATED_SOURCES = new Set(["tokens.css", "fonts/tarot-font-embed.css"]);

const STYLE_EL = /<style\b([^>]*)>([\s\S]*?)<\/style>/gi;
const STYLE_ATTR = /\bstyle\s*=\s*("([^"]*)"|'([^']*)')/gi;
const DATA_INLINED = /\bdata-inlined\s*=\s*("([^"]*)"|'([^']*)')/i;

const NAMED_COLORS = [
  "aliceblue","aqua","aquamarine","azure","beige","bisque","black","blanchedalmond",
  "blue","blueviolet","brown","burlywood","cadetblue","chartreuse","chocolate","coral",
  "cornflowerblue","cornsilk","crimson","cyan","darkblue","darkcyan","darkgoldenrod",
  "darkgray","darkgreen","darkgrey","darkkhaki","darkmagenta","darkolivegreen","darkorange",
  "darkorchid","darkred","darksalmon","darkseagreen","darkslateblue","darkslategray",
  "darkturquoise","darkviolet","deeppink","deepskyblue","dimgray","dodgerblue","firebrick",
  "floralwhite","forestgreen","fuchsia","gainsboro","ghostwhite","gold","goldenrod","gray",
  "green","greenyellow","grey","honeydew","hotpink","indianred","indigo","ivory","khaki",
  "lavender","lawngreen","lightblue","lightcoral","lightgray","lightgreen","lightgrey",
  "lightpink","lightsalmon","lightseagreen","lightskyblue","lightyellow","lime","limegreen",
  "linen","magenta","maroon","mediumblue","mediumorchid","mediumpurple","mediumseagreen",
  "midnightblue","mintcream","mistyrose","moccasin","navajowhite","navy","oldlace","olive",
  "olivedrab","orange","orangered","orchid","palegoldenrod","palegreen","paleturquoise",
  "papayawhip","peachpuff","peru","pink","plum","powderblue","purple","rebeccapurple","red",
  "rosybrown","royalblue","saddlebrown","salmon","sandybrown","seagreen","seashell","sienna",
  "silver","skyblue","slateblue","slategray","snow","springgreen","steelblue","tan","teal",
  "thistle","tomato","turquoise","violet","wheat","white","whitesmoke","yellow","yellowgreen",
];

const HEX = /#[0-9a-fA-F]{3,8}\b/g;
const COLOR_FN = /(?<![\w-])(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color|color-mix)\s*\(/gi;
const NAMED = new RegExp(`(?<![\\w-])(${NAMED_COLORS.join("|")})(?![\\w-])`, "gi");
const RADIUS = /border(?:-(?:top|bottom)-(?:left|right))?-radius\s*:\s*([^;}]+)/gi;
const RADIUS_OK = /^(?:0(?:px|rem|em|%)?|var\(\s*--radius\s*\)|inherit|initial|unset)$/i;

/* Line number for an offset, so a failure points somewhere. */
const lineAt = (text, index) => text.slice(0, index).split("\n").length;

/* Blank out comment bodies, keeping length and newlines so every offset
   still points where it did. Prose is allowed to say "gold". */
const blankComments = (css) =>
  css.replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, " "));

/* Declaration values only. Scanning raw CSS would flag a selector named
   .olive and every colour word in a comment. */
const declarations = (css, base) => {
  const out = [];
  const re = /(?:^|[{;])\s*(--)?[\w-]+\s*:\s*([^;{}]*)/g;
  let m;
  while ((m = re.exec(css))) {
    const value = m[2];
    if (!value.trim()) continue;
    out.push({ value, offset: base + m.index + m[0].length - value.length });
  }
  return out;
};

export function lintBuilt(html, label) {
  const errors = [];
  const warnings = [];
  const err = (rule, msg, index) =>
    errors.push({ rule, msg, line: index == null ? null : lineAt(html, index) });
  const warn = (rule, msg, index) =>
    warnings.push({ rule, msg, line: index == null ? null : lineAt(html, index) });

  /* Collect the CSS a widget author actually wrote: every <style> that is not
     a build-inlined generated file, plus every inline style attribute. */
  const authored = [];
  let m;
  STYLE_EL.lastIndex = 0;
  while ((m = STYLE_EL.exec(html))) {
    const inlinedFrom = (m[1].match(DATA_INLINED) || [])[2];
    if (GENERATED_SOURCES.has(inlinedFrom)) continue;
    authored.push({ text: m[2], base: m.index + m[0].indexOf(m[2]) });
  }
  STYLE_ATTR.lastIndex = 0;
  while ((m = STYLE_ATTR.exec(html))) {
    const body = m[2] ?? m[3] ?? "";
    authored.push({ text: body, base: m.index + m[0].indexOf(body) });
  }

  /* 1 — Nothing hardcodes a color. */
  for (const { text, base } of authored) {
    for (const decl of declarations(blankComments(text), base)) {
      for (const re of [HEX, COLOR_FN, NAMED]) {
        re.lastIndex = 0;
        let hit;
        while ((hit = re.exec(decl.value))) {
          /* rgba(var(--ink-rgb), a) is how a token supplies alpha; the channels
             still live in tokens.css, so it is not a second source of truth. */
          if (re === COLOR_FN && /^\w+\(\s*var\(\s*--/.test(decl.value.slice(hit.index))) continue;
          err(
            "no-hardcoded-color",
            `"${hit[0]}" in authored CSS. Every color comes from tokens.css — add it there and reference it.`,
            decl.offset + hit.index
          );
        }
      }
    }
  }

  /* 2 — Self-contained. No network requests, nothing left to fetch. */
  const external = /(?:src|href)\s*=\s*["']?((?:https?:)?\/\/[^"'\s>]+)/gi;
  while ((m = external.exec(html))) {
    err("self-contained", `external reference to ${m[1]}. Built widgets fetch nothing.`, m.index);
  }
  const cssUrl = /url\(\s*["']?((?:https?:)?\/\/[^"')\s]+)/gi;
  while ((m = cssUrl.exec(html))) {
    err("self-contained", `CSS url() points at ${m[1]}.`, m.index);
  }
  const leftoverLink = /<link\b[^>]*\brel\s*=\s*["']?stylesheet/gi;
  while ((m = leftoverLink.exec(html))) {
    err("self-contained", `un-inlined <link rel=stylesheet> survived the build.`, m.index);
  }
  const leftoverScript = /<script\b[^>]*\bsrc\s*=/gi;
  while ((m = leftoverScript.exec(html))) {
    err("self-contained", `un-inlined <script src> survived the build.`, m.index);
  }
  const atImport = /@import\b/gi;
  while ((m = atImport.exec(html))) {
    err("self-contained", `@import is a network request.`, m.index);
  }
  const nonDataImg = /<img\b[^>]*\bsrc\s*=\s*["']?(?!data:)([^"'\s>]+)/gi;
  while ((m = nonDataImg.exec(html))) {
    err("self-contained", `<img src="${m[1]}"> is not a data URI.`, m.index);
  }

  /* 3 — border-radius: 0. Everywhere. */
  for (const { text: raw, base } of authored) {
    const text = blankComments(raw);
    RADIUS.lastIndex = 0;
    let hit;
    while ((hit = RADIUS.exec(text))) {
      const value = hit[1].trim();
      if (!RADIUS_OK.test(value)) {
        err(
          "radius-zero",
          `border-radius: ${value}. Everything here is printed, cut, or draped — nothing is a rounded app card.`,
          base + hit.index
        );
      }
    }
  }

  /* 5 — Tarot Regular is a display face. Static analysis can count the rules
     that reach for it, not the elements they land on, so this is a warning. */
  let displayRules = 0;
  for (const { text } of authored) {
    displayRules += (blankComments(text).match(/var\(\s*--font-display\s*\)/g) || []).length;
  }
  if (displayRules > 2) {
    warn(
      "display-face-restraint",
      `${displayRules} rules set var(--font-display). Max two appearances per view — ` +
        `it is an actor with a good entrance, not a cast member for three hours.`
    );
  }
  for (const { text: raw, base } of authored) {
    const text = blankComments(raw);
    const body = /(?:body|p|td|th|li|input|button|table)\b[^{}]*\{[^}]*var\(\s*--font-display\s*\)/gi;
    let hit;
    while ((hit = body.exec(text))) {
      err(
        "display-face-restraint",
        `var(--font-display) applied to body copy, UI, or a table. Display face only.`,
        base + hit.index
      );
    }
  }

  /* 6 — One interruption color per composition. */
  const usesPink = authored.some((a) => /var\(\s*--shout-pink\s*\)/.test(blankComments(a.text)));
  const usesOrange = authored.some((a) => /var\(\s*--shout-orange\s*\)/.test(blankComments(a.text)));
  if (usesPink && usesOrange) {
    err(
      "one-interruption",
      `both --shout-pink and --shout-orange are used. One per composition — if a second appears, one of them is wrong.`
    );
  }

  /* 7 — No dark-mode inversion. One mode: the room, lit the way it is lit. */
  const scheme = /prefers-color-scheme|color-scheme\s*:/gi;
  while ((m = scheme.exec(html))) {
    err("no-inversion", `${m[0]} — this system does not invert. Widgets paint their own ground.`, m.index);
  }

  /* A widget dropped into Notion sits on an unknown host background. */
  const paintsGround = authored.some((a) =>
    /(?:^|[{;\s])(?:background|background-color)\s*:[^;}]*var\(\s*--/.test(blankComments(a.text))
  );
  if (!paintsGround) {
    warn("paints-own-ground", `no background set from a token. A widget must paint its own ground.`);
  }

  return { label, errors, warnings };
}

export function formatReport(results) {
  const lines = [];
  let errs = 0, warns = 0;
  for (const r of results) {
    errs += r.errors.length;
    warns += r.warnings.length;
    if (!r.errors.length && !r.warnings.length) {
      lines.push(`  ok    ${r.label}`);
      continue;
    }
    lines.push(`  ${r.errors.length ? "FAIL" : "warn"}  ${r.label}`);
    for (const e of r.errors) lines.push(`          error  [${e.rule}]${e.line ? ` line ${e.line}` : ""}  ${e.msg}`);
    for (const w of r.warnings) lines.push(`          warn   [${w.rule}]${w.line ? ` line ${w.line}` : ""}  ${w.msg}`);
  }
  return { text: lines.join("\n"), errors: errs, warnings: warns };
}

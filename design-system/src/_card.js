/* Shared renderer for the Claude Design cards.

   Every card reads its values off tokens.css at load rather than restating
   them, so a card cannot quietly disagree with the token file. Typing a hex
   in here would defeat the whole point.

   Each page sets <body data-card="..."> and this dispatches on it. */

(function () {
  "use strict";

  var root = document.documentElement;
  var probe = document.createElement("span");
  probe.setAttribute("aria-hidden", "true");
  probe.style.cssText = "position:absolute;visibility:hidden";
  document.body.appendChild(probe);

  /* Resolve through the browser so var() chains collapse to a real value and
     colors come back as something we can do arithmetic on. */
  function resolveColor(expr) {
    probe.style.color = "";
    probe.style.color = expr;
    return getComputedStyle(probe).color;
  }
  function rgb(c) {
    var m = c.match(/-?[\d.]+/g);
    return m ? [+m[0], +m[1], +m[2]] : [0, 0, 0];
  }
  function hex(c) {
    return "#" + rgb(c).map(function (v) {
      return ("0" + Math.round(v).toString(16)).slice(-2).toUpperCase();
    }).join("");
  }
  function luminance(c) {
    var a = rgb(c).map(function (v) {
      v /= 255;
      return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
  }
  function contrast(a, b) {
    var la = luminance(a), lb = luminance(b);
    return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
  }
  function token(name) {
    return getComputedStyle(root).getPropertyValue(name).trim();
  }
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  /* ---- Swatch grids ---- */

  var SWATCHES = {
    grounds: [
      ["--ground-hunter", "Primary dark. The house colour."],
      ["--ground-sage", "Primary light. Dusty, not mint."],
      ["--ground-olive", "Warm mid. Must not drift brown."],
      ["--ground-navy", "Night as cloth, not outer space."],
      ["--ground-crimson", "Stage curtain."],
      ["--ground-oxblood", "Crimson after a long run."]
    ],
    metallic: [
      ["--gold", "Stars, rules, trim, punctuation."],
      ["--brass", "Hardware, frames, borders."]
    ],
    interruption: [
      ["--shout-pink", "The rude flash."],
      ["--shout-orange", "Same job. Never in the same composition."]
    ],
    neutrals: [
      ["--ink", "All body text. Warm near-black."],
      ["--cream", "Paper."],
      ["--cream-shade", "Hairlines and edges on cream."],
      ["--ink-thin", "Ink laid lighter. 65% ink, 35% cream."]
    ]
  };

  function renderSwatches(key, host) {
    SWATCHES[key].forEach(function (entry) {
      var fig = el("figure", "chip");
      var block = el("div", "chip-block");
      block.style.setProperty("--swatch", "var(" + entry[0] + ")");
      fig.appendChild(block);
      var cap = el("figcaption");
      cap.appendChild(el("div", "chip-name", entry[0]));
      cap.appendChild(el("div", "chip-meta", hex(resolveColor("var(" + entry[0] + ")"))));
      cap.appendChild(el("div", "chip-use", entry[1]));
      fig.appendChild(cap);
      host.appendChild(fig);
    });
  }

  /* ---- Aliases ---- */

  var ALIASES = [
    ["--surface", "Default dark ground"],
    ["--surface-alt", "Second dark ground"],
    ["--paper", "Light ground for text"],
    ["--text", "Body copy on paper"],
    ["--text-on-dark", "Body copy on a dark ground"],
    ["--text-muted", "Captions and metadata on paper"],
    ["--text-muted-on-dark", "Captions on a dark ground"],
    ["--rule", "1px rules and borders"],
    ["--rule-hairline", "0.5px edges on cream"],
    ["--star", "Stars, trim, ornament"],
    ["--accent", "The one interruption colour"]
  ];

  function renderAliases(host) {
    ALIASES.forEach(function (a) {
      var declared = token(a[0]);
      var resolved = hex(resolveColor("var(" + a[0] + ")"));
      var tr = el("tr");
      tr.appendChild(el("td", null, a[0]));
      tr.appendChild(el("td", null, declared.indexOf("var(") === 0 ? declared + " → " + resolved : resolved));
      var cell = el("td");
      var dot = el("span", "swatch-dot");
      dot.style.background = "var(" + a[0] + ")";
      cell.appendChild(dot);
      tr.appendChild(cell);
      tr.appendChild(el("td", null, a[1]));
      host.appendChild(tr);
    });
  }

  /* ---- Contrast ---- */

  var PAIRS = [
    ["--text", "--paper", "Body copy on paper"],
    ["--text-muted", "--paper", "Captions and metadata on paper"],
    ["--text-on-dark", "--surface", "Body copy on hunter"],
    ["--text-on-dark", "--surface-alt", "Body copy on navy"],
    ["--text-muted-on-dark", "--surface", "Metadata on hunter"],
    ["--text-muted-on-dark", "--surface-alt", "Metadata on navy"],
    ["--star", "--surface", "Gold stars and rules on hunter"],
    ["--star", "--surface-alt", "Gold stars on navy"],
    ["--rule", "--surface", "Brass rules on hunter"],
    ["--rule", "--paper", "Brass rules on paper — hardware, not type"],
    ["--rule-hairline", "--paper", "Hairlines on paper — an edge, not text"],
    ["--accent", "--paper", "Interruption on paper — large only"],
    ["--accent", "--surface", "Interruption on hunter — large only"],
    ["--text", "--ground-sage", "Body copy on sage"],
    ["--text-on-dark", "--ground-crimson", "Body copy on curtain red"],
    ["--text-on-dark", "--ground-oxblood", "Body copy on oxblood"]
  ];

  function renderContrast(host) {
    PAIRS.forEach(function (p) {
      var ratio = contrast(resolveColor("var(" + p[0] + ")"), resolveColor("var(" + p[1] + ")"));
      var tr = el("tr");
      tr.appendChild(el("td", null, p[0]));
      tr.appendChild(el("td", null, p[1]));
      tr.appendChild(el("td", "num", ratio.toFixed(2) + ":1"));
      [4.5, 3].forEach(function (threshold) {
        var pass = ratio >= threshold;
        var td = el("td");
        var span = el("span", "verdict", pass ? "pass" : "no");
        span.setAttribute("data-pass", pass ? "yes" : "no");
        td.appendChild(span);
        tr.appendChild(td);
      });
      tr.appendChild(el("td", null, p[2]));
      host.appendChild(tr);
    });
  }

  /* ---- Type scale ---- */

  var SCALE = [
    ["t-cover", "Cover · Tarot Regular", "--size-cover", "The Tarot Revue"],
    ["t-h1", "H1 · Fraunces 600", "--size-h1", "He has left the crowd"],
    ["t-h2", "H2 · Fraunces 600", "--size-h2", "Whatever he is looking for can't be found there"],
    ["t-h3", "H3 · Fraunces 500", "--size-h3", "Reversal changes the direction, not the subject"],
    ["t-body", "Body · Fraunces 400", "--size-body",
      "The deck is annoyingly literal about some things and completely unhelpful about others, " +
      "and learning which is which is most of the job."],
    ["t-small", "Small · Plex Sans 400", "--size-small",
      "Captions, metadata, table cells, worksheet instructions."],
    ["t-label", "Label · Plex Sans 500", "--size-label", "Section marker · 11px · tracked out"]
  ];

  function renderType(host) {
    SCALE.forEach(function (row) {
      var wrap = el("div", "specimen-row");
      var meta = el("div");
      meta.appendChild(el("div", "label", row[1]));
      meta.appendChild(el("div", "chip-use", row[2] + " · " + Math.round(parseFloat(token(row[2])) * 16) + "px"));
      wrap.appendChild(meta);
      var line = el("div", "specimen-line");
      line.appendChild(el("div", row[0], row[3]));
      wrap.appendChild(line);
      host.appendChild(wrap);
    });
  }

  /* ---- Space steps ---- */

  function renderSpace(host) {
    [1, 2, 3, 4, 5].forEach(function (n) {
      var name = "--space-" + n;
      var row = el("div", "space-row");
      row.appendChild(el("div", "chip-use", name + " · " + Math.round(parseFloat(token(name)) * 16) + "px"));
      var bar = el("div", "space-bar");
      bar.style.width = "var(" + name + ")";
      row.appendChild(bar);
      host.appendChild(row);
    });
  }

  /* ---- Which faces actually arrived ----
     document.fonts.check() asks whether anything can render the text, and the
     answer is always yes. Measuring against the fallback is the only honest
     test, and a design system documenting Georgia by accident is worse than
     one that admits it. */

  function reportFonts(note) {
    function width(stack) {
      var s = document.createElement("span");
      s.textContent = "Handgloves 12345 mmmmiiii";
      s.setAttribute("aria-hidden", "true");
      s.style.cssText = "position:absolute;visibility:hidden;white-space:nowrap;font-size:64px;font-family:" + stack;
      document.body.appendChild(s);
      var w = s.getBoundingClientRect().width;
      s.remove();
      return w;
    }
    var roles = [['"Fraunces"', "serif", "Fraunces"], ['"IBM Plex Sans"', "sans-serif", "IBM Plex Sans"]];
    if (note.hasAttribute("data-display")) roles.unshift(['"Tarot"', "serif", "Tarot Regular"]);
    var missing = roles.filter(function (f) {
      return Math.abs(width(f[0] + "," + f[1]) - width(f[1])) < 0.5;
    }).map(function (f) { return f[2]; });
    note.textContent = missing.length
      ? "Showing a fallback for: " + missing.join(", ")
      : "All type roles loaded from embedded fonts";
  }

  /* ---- Dispatch ---- */

  var card = document.body.getAttribute("data-card");
  var host = document.querySelector("[data-render]");

  if (host) {
    if (SWATCHES[card]) renderSwatches(card, host);
    else if (card === "aliases") renderAliases(host);
    else if (card === "contrast") renderContrast(host);
    else if (card === "type") renderType(host);
    else if (card === "space") renderSpace(host);
  }

  var note = document.querySelector("[data-fonts]");
  if (note && document.fonts) {
    Promise.resolve(document.fonts.ready).then(function () { reportFonts(note); });
  }

  probe.remove();
})();

/* A linter that has never rejected anything is decoration. Each case here
   is a hard constraint from CLAUDE.md, violated on purpose.

     node --test build/ */

import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";
import { lintBuilt } from "./lint.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const page = (css, body = "<p>x</p>") =>
  `<!doctype html><html><head><style data-inlined="tokens.css">:root{--paper:#F4EBDC;}</style>` +
  `<style>${css}</style></head><body>${body}</body></html>`;

const rules = (r) => r.errors.map((e) => e.rule);
const clean = "body { background: var(--paper); }";

test("clean widget passes", () => {
  const r = lintBuilt(page(clean), "clean");
  assert.deepEqual(r.errors, []);
  assert.deepEqual(r.warnings, []);
});

test("1 — rejects a hex literal in authored CSS", () => {
  assert.ok(rules(lintBuilt(page(clean + " .a { color: #B12737; }"), "x")).includes("no-hardcoded-color"));
});

test("1 — rejects rgb()/hsl() with raw channels", () => {
  assert.ok(rules(lintBuilt(page(clean + " .a { color: rgb(177, 39, 55); }"), "x")).includes("no-hardcoded-color"));
  assert.ok(rules(lintBuilt(page(clean + " .a { color: hsl(352 64% 42%); }"), "x")).includes("no-hardcoded-color"));
});

test("1 — rejects a named color", () => {
  assert.ok(rules(lintBuilt(page(clean + " .a { color: crimson; }"), "x")).includes("no-hardcoded-color"));
});

test("1 — rejects a literal in a style attribute", () => {
  assert.ok(rules(lintBuilt(page(clean, '<p style="color:#fff">x</p>'), "x")).includes("no-hardcoded-color"));
});

test("1 — allows alpha taken from token channels", () => {
  const r = lintBuilt(page(clean + " .a { box-shadow: 3px 4px 0 rgba(var(--ink-rgb), 0.22); }"), "x");
  assert.deepEqual(r.errors, []);
});

test("1 — tolerates color words in comments and selectors", () => {
  const r = lintBuilt(page("/* a gold rule on olive */ .gold, .olive { " + clean.replace(/^body \{|\}$/g, "") + " }"), "x");
  assert.deepEqual(r.errors, []);
});

test("1 — does not flag the inlined tokens block", () => {
  const tokens = `<style data-inlined="tokens.css">:root{--ground-crimson:#B12737;--paper:#F4EBDC;}</style>`;
  const html = `<!doctype html><html><head>${tokens}<style>${clean}</style></head><body></body></html>`;
  assert.deepEqual(lintBuilt(html, "x").errors, []);
});

test("2 — rejects external stylesheet, script, image, url() and @import", () => {
  const cases = [
    ['<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces">', "self-contained"],
    ['<script src="https://cdn.example.com/x.js"></script>', "self-contained"],
    ['<img src="star.png">', "self-contained"],
  ];
  for (const [markup, rule] of cases) {
    assert.ok(rules(lintBuilt(page(clean, markup), "x")).includes(rule), markup);
  }
  assert.ok(rules(lintBuilt(page('@import url("other.css"); ' + clean), "x")).includes("self-contained"));
  assert.ok(rules(lintBuilt(page(clean + ' .a { background: url(//cdn.example.com/v.jpg); }'), "x")).includes("self-contained"));
});

test("2 — allows a data: URI image", () => {
  const r = lintBuilt(page(clean, '<img src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" alt="">'), "x");
  assert.deepEqual(r.errors, []);
});

test("3 — rejects a non-zero border-radius, allows 0 and var(--radius)", () => {
  assert.ok(rules(lintBuilt(page(clean + " .a { border-radius: 4px; }"), "x")).includes("radius-zero"));
  assert.ok(rules(lintBuilt(page(clean + " .a { border-top-left-radius: 50%; }"), "x")).includes("radius-zero"));
  assert.deepEqual(lintBuilt(page(clean + " .a { border-radius: var(--radius); } .b { border-radius: 0; }"), "x").errors, []);
});

test("5 — rejects the display face on body copy, warns past two appearances", () => {
  assert.ok(rules(lintBuilt(page(clean + " td { font-family: var(--font-display); }"), "x")).includes("display-face-restraint"));
  const many = clean + " .a,.b{font-family:var(--font-display);} .c{font-family:var(--font-display);} .d{font-family:var(--font-display);}";
  assert.ok(lintBuilt(page(many), "x").warnings.some((w) => w.rule === "display-face-restraint"));
});

test("6 — rejects two interruption colors in one composition", () => {
  const both = clean + " .a { color: var(--shout-pink); } .b { color: var(--shout-orange); }";
  assert.ok(rules(lintBuilt(page(both), "x")).includes("one-interruption"));
  assert.deepEqual(lintBuilt(page(clean + " .a { color: var(--shout-pink); }"), "x").errors, []);
});

test("7 — rejects dark-mode inversion", () => {
  assert.ok(rules(lintBuilt(page("@media (prefers-color-scheme: dark) { " + clean + " }"), "x")).includes("no-inversion"));
  assert.ok(rules(lintBuilt(page(clean + " html { color-scheme: light dark; }"), "x")).includes("no-inversion"));
});

test("warns when a widget paints no ground of its own", () => {
  const r = lintBuilt(page(".a { color: var(--text); }"), "x");
  assert.ok(r.warnings.some((w) => w.rule === "paints-own-ground"));
});

test("the built specimen passes every rule", async () => {
  const built = await readFile(join(ROOT, "widgets", "token-specimen.html"), "utf8");
  const r = lintBuilt(built, "token-specimen");
  assert.deepEqual(r.errors, [], JSON.stringify(r.errors, null, 2));
  assert.deepEqual(r.warnings, [], JSON.stringify(r.warnings, null, 2));
});

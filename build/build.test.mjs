/* The @dsCard marker has to be the FIRST line of a built card — that comment
   is how Claude Design indexes the card, and the build banner would happily
   sit on top of it and break the import silently. Nothing about the rendered
   page would look wrong, so this is the only place it gets caught.

     node --test "build/*.test.mjs" */

import test from "node:test";
import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const CARDS = join(ROOT, "design-system");

const builtCards = async () =>
  (await readdir(CARDS)).filter((f) => f.endsWith(".html")).sort();

test("every card source is built", async () => {
  const sources = (await readdir(join(CARDS, "src")))
    .filter((f) => f.endsWith(".html") && !f.startsWith("_"));
  assert.deepEqual((await builtCards()).sort(), sources.sort());
});

test("@dsCard is the first line of every built card, with the doctype right after", async () => {
  for (const f of await builtCards()) {
    const lines = (await readFile(join(CARDS, f), "utf8")).split("\n");
    assert.match(lines[0], /^<!--\s*@dsCard\s+group="[^"]+"\s*-->$/, `${f} line 1: ${lines[0]}`);
    const doctype = lines.findIndex((l) => /^<!doctype html>$/i.test(l.trim()));
    const banner = lines.findIndex((l) => l.startsWith("<!-- Built from"));
    assert.ok(banner > 0, `${f}: build banner missing`);
    assert.ok(doctype > banner, `${f}: doctype should follow the banner, not precede it`);
  }
});

test("partials are not built as cards of their own", async () => {
  for (const f of await builtCards()) assert.ok(!f.startsWith("_"), `${f} is a partial`);
});

test("only the type card carries the display face", async () => {
  for (const f of await builtCards()) {
    const html = await readFile(join(CARDS, f), "utf8");
    const embedded = html.includes('font-family: "Tarot"');
    assert.equal(embedded, f === "type-scale.html", `${f}: unexpected font embed state`);
  }
});

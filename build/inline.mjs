/* Inlining pass.
   Widget sources under widgets/src/ are real, openable HTML: they <link> to
   tokens.css and the font embed so they render live while being worked on.
   The build swaps every local link/script for its contents, because Notion
   strips external scripts and will not fetch a sibling asset. One file, no
   network requests, works from disk. */

import { readFile } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";

const LINK = /<link\b[^>]*>/gi;
const SCRIPT_SRC = /<script\b([^>]*\bsrc\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)[^>]*)>\s*<\/script>/gi;

const attr = (tag, name) => {
  const m = tag.match(new RegExp(`\\b${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`, "i"));
  return m ? (m[2] ?? m[3] ?? m[4]) : null;
};

const isExternal = (p) => /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(p);

/* Indent an inlined block to sit where its <link> sat, so the built file
   stays readable rather than becoming one long left-flush wall. */
const reindent = (text, pad) =>
  text.replace(/\r\n/g, "\n").trimEnd().split("\n").map((l) => (l ? pad + l : l)).join("\n");

export async function inlineHtml(srcPath, rootDir) {
  const raw = await readFile(srcPath, "utf8");
  const srcDir = dirname(srcPath);
  const inlined = [];

  const load = async (href) => {
    const abs = resolve(srcDir, href);
    const rel = relative(rootDir, abs).split("\\").join("/");
    const body = await readFile(abs, "utf8");
    inlined.push(rel);
    return { rel, body };
  };

  let html = raw;

  /* Stylesheets. A local <link rel=stylesheet> becomes a <style> tagged with
     the file it came from — the tag is what lets the linter know which block
     is allowed to hold hex literals. */
  const linkJobs = [];
  html.replace(LINK, (tag, offset) => {
    const rel = (attr(tag, "rel") || "").toLowerCase();
    const href = attr(tag, "href");
    if (rel !== "stylesheet" || !href) return tag;
    if (isExternal(href)) {
      throw new Error(
        `${relative(rootDir, srcPath)}: external stylesheet <link href="${href}">. ` +
          `Built widgets make no network requests — vendor the file into the repo and link it relatively.`
      );
    }
    linkJobs.push({ tag, href, offset });
    return tag;
  });

  for (const job of linkJobs) {
    const { rel, body } = await load(job.href);
    const lineStart = html.lastIndexOf("\n", html.indexOf(job.tag)) + 1;
    const pad = (html.slice(lineStart).match(/^[ \t]*/) || [""])[0];
    const block = `<style data-inlined="${rel}">\n${reindent(body, pad + "  ")}\n${pad}</style>`;
    html = html.replace(job.tag, block);
  }

  /* Scripts. */
  const scriptJobs = [];
  html.replace(SCRIPT_SRC, (whole, attrs) => {
    const src = attr(`<x ${attrs}>`, "src");
    if (!src) return whole;
    if (isExternal(src)) {
      throw new Error(
        `${relative(rootDir, srcPath)}: external <script src="${src}">. ` +
          `Notion strips external scripts — vendor it into the repo and reference it relatively.`
      );
    }
    scriptJobs.push({ whole, src });
    return whole;
  });

  for (const job of scriptJobs) {
    const { rel, body } = await load(job.src);
    const lineStart = html.lastIndexOf("\n", html.indexOf(job.whole)) + 1;
    const pad = (html.slice(lineStart).match(/^[ \t]*/) || [""])[0];
    const block = `<script data-inlined="${rel}">\n${reindent(body, pad + "  ")}\n${pad}</script>`;
    html = html.replace(job.whole, block);
  }

  return { html, inlined };
}

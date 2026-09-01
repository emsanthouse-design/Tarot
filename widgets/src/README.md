Widget sources. One file per widget; the build writes the shipped single-file
version to `widgets/`.

Link `../../tokens.css` and `../../fonts/tarot-font-embed.css` rather than
inlining them by hand — the build inlines both, and linking keeps this file
openable in a browser while you work on it.

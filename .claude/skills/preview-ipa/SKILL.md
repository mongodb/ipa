---
name: preview-ipa
description:
  Preview a pull request's rendered IPA documentation locally. Use when a
  reviewer or contributor wants to see how guideline changes look before merging
  — the rendered <Guideline> components, anchors, and admonitions, not just the
  MDX diff. Triggers on "preview PR <n>", "preview this branch", "see the
  rendered guidelines", "view the docs for this PR".
argument-hint: "<pr-number>"
---

# Preview IPA docs for a pull request

Render IPA guideline changes locally so a reviewer can see how a PR looks before
approving it. This serves the same Docusaurus site CI builds, with hot reload.

## Steps

1. **Decide what to preview.**
   - If the user gave a PR number, use it.
   - Otherwise preview the currently checked-out branch.

2. **Start the preview** from the repo root, in the **background** (the dev
   server is long-running and would otherwise block):

   ```bash
   scripts/preview-pr.sh <pr-number> --no-open   # omit the number for the current branch
   ```

   `--no-open` stops the backgrounded server from launching a browser tab; add
   `--port 3001` if 3000 is busy (see Notes). If `gh` is unavailable or the
   script is missing, fall back to: `gh pr checkout <n>` → `npm ci` (only if
   deps changed) → `npm run docusaurus:start -- --no-open`.

3. **Report the URLs.** The site serves at `http://localhost:<port>` (default
   `3000`, or whatever `--port` you passed). Point the reviewer straight at what
   changed: list the changed guideline files and map each to its page — a file
   `ipa/<id>.mdx` renders at `<base-url>/<id>` (e.g. on the default port,
   `ipa/110.mdx` → <http://localhost:3000/110>). Get the changed files with
   `gh pr diff <n> --name-only`, or `git diff --name-only origin/main...HEAD`
   for the current branch.

4. **Stop** the background dev server when the user is done by killing the whole
   process tree — e.g. `pkill -f docusaurus` — then confirm the port no longer
   responds. Killing only the launcher can orphan the `node` server and leave
   the port bound (the "leftover server" the port note warns about).

## Notes

- The dev server hot-reloads, so further edits appear without a restart.
- If port 3000 is busy (e.g. previewing two PRs at once, or a leftover server),
  pass a port — `scripts/preview-pr.sh <n> --port 3001` — and report that port
  in the URLs. Without it, Docusaurus prompts interactively for a new port,
  which stalls a backgrounded run.
- For production fidelity (search index + the `onBrokenLinks: "throw"` check CI
  runs), use `npm run docusaurus:build && npm run docusaurus:serve` instead —
  slower, but it matches the CI build exactly.
- Requires Node.js 22.x / npm 10.x (pinned in `.tool-versions`).

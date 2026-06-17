---
name: preview-ipa
description:
  Use when a reviewer or contributor wants to see how a PR's IPA guideline
  changes render locally — the <Guideline> components, anchors, and admonitions,
  not just the MDX diff. Triggers on "preview PR <n>", "preview this branch",
  "see the rendered guidelines", "view the docs for this PR".
argument-hint: "<pr-number>"
---

# Preview IPA docs for a pull request

Serve the IPA Docusaurus site locally — the same site CI builds, with hot reload
— so a reviewer sees how a PR renders before merging.

## Steps

1. **Pick the target:** the given PR number, or the current branch if none.

2. **Start the server** from the repo root, in the **background** (it is
   long-running and would otherwise block):

   ```bash
   scripts/preview-pr.sh <pr-number> --no-open   # no number → current branch
   ```

   `--no-open` keeps the backgrounded server from opening a browser tab; add
   `--port <n>` if 3000 is taken (otherwise Docusaurus prompts interactively and
   stalls). See `scripts/preview-pr.sh --help` for all options. If the script
   isn't present, run the steps by hand: `gh pr checkout <n>` → `npm ci` →
   `npm run docusaurus:start -- --no-open`.

3. **Report the page URLs.** The site is served under `/ipa/`, so a guideline
   page is `http://localhost:<port>/ipa/<id>` — `<id>` is the IPA number, i.e.
   the changed file's name without leading zeros (e.g. `ipa/general/0101.mdx` →
   <http://localhost:3000/ipa/101>). List changed files with
   `gh pr diff <n> --name-only`.

4. **Stop** by killing the process tree — `pkill -f docusaurus` — then confirm
   the port is free. Killing only the launcher orphans the `node` server.

## Notes

- For production fidelity (search index + the `onBrokenLinks: "throw"` check CI
  runs), use `npm run docusaurus:build && npm run docusaurus:serve` instead.
- Requires Node.js 22.x / npm 10.x (pinned in `.tool-versions`).

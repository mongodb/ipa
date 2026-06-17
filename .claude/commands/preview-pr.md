---
description:
  Preview a pull request's rendered IPA docs locally (wraps the preview-ipa
  skill)
argument-hint: "<pr-number>"
---

Preview pull request **$ARGUMENTS** locally using the `preview-ipa` skill: check
out the PR, start the Docusaurus dev server in the background, and report the
local preview URL (default <http://localhost:3000>) plus the specific guideline
page(s) the PR changes.

If no PR number was given, preview the currently checked-out branch.

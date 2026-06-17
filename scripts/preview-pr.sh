#!/usr/bin/env bash
#
# Preview a pull request's rendered IPA docs locally.
#
# Usage:
#   scripts/preview-pr.sh <pr-number>          # check out a PR, then serve it
#   scripts/preview-pr.sh                      # serve the current branch
#   scripts/preview-pr.sh <pr> --port 3001     # serve on a specific port
#   scripts/preview-pr.sh <pr> --install       # force a clean `npm ci` first
#
# Starts the Docusaurus dev server (default http://localhost:3000) with hot
# reload, so you see <Guideline> components rendered exactly as the production
# build emits them. Pass --port/-p to avoid a clash with port 3000 (e.g. when
# comparing two PRs side by side). The <pr-number> form requires the GitHub CLI.
# Prerequisites: Node.js 22.x / npm 10.x (pinned in .tool-versions).

set -euo pipefail

# Always operate from the repo root, regardless of the caller's directory.
cd "$(dirname "$0")/.."

pr=""
port=""
force_install=false
while [[ $# -gt 0 ]]; do
  case "$1" in
    -i | --install) force_install=true ;;
    -p | --port)
      shift
      port="${1:-}"
      if [[ -z "$port" ]]; then
        echo "error: --port requires a value" >&2
        exit 1
      fi
      ;;
    --port=*) port="${1#*=}" ;;
    -h | --help)
      sed -n '2,15p' "$0" | sed 's/^# \{0,1\}//'
      exit 0
      ;;
    -*)
      echo "error: unknown option '$1'" >&2
      exit 1
      ;;
    *) pr="$1" ;;
  esac
  shift
done

if [[ -n "$port" && ! "$port" =~ ^[0-9]+$ ]]; then
  echo "error: --port must be a number (got '$port')" >&2
  exit 1
fi

if [[ -n "$pr" ]]; then
  if ! command -v gh >/dev/null 2>&1; then
    echo "error: the GitHub CLI (gh) is required to check out a PR by number." >&2
    echo "       Install it from https://cli.github.com/, or check the branch out manually." >&2
    exit 1
  fi
  echo "==> Checking out PR #$pr"
  gh pr checkout "$pr"
fi

echo "==> Current branch: $(git rev-parse --abbrev-ref HEAD)"

if [[ "$force_install" == true || ! -d node_modules ]]; then
  echo "==> Installing dependencies (npm ci)"
  npm ci
else
  echo "==> Reusing existing node_modules (pass --install if dependencies changed)"
fi

echo "==> Starting Docusaurus dev server at http://localhost:${port:-3000} (Ctrl-C to stop)"
if [[ -n "$port" ]]; then
  npm run docusaurus:start -- --port "$port"
else
  npm run docusaurus:start
fi

#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
GH="${ROOT}/.tools/gh_2.95.0_macOS_arm64/bin/gh"

cd "$ROOT"

if [[ ! -x "$GH" ]]; then
  echo "GitHub CLI not found. Run from pokeinvest root after setup."
  exit 1
fi

if ! "$GH" auth status >/dev/null 2>&1; then
  echo "Log in to GitHub (browser opens)..."
  "$GH" auth login --hostname github.com --git-protocol https --web
fi

"$GH" auth setup-git

echo "Pushing main to github.com/icanwyn/pokeinvest ..."
git push --force -u origin main

echo "Done: https://github.com/icanwyn/pokeinvest"
# Redirect

Chrome extension (MV3). Local files stay in sync with `origin/main` via `watch.sh`, so edits pushed to GitHub appear in the extension without re-loading unpacked.

## Setup

1. Load unpacked in `chrome://extensions` (or `brave://extensions`), pointed at this directory.
2. Start the watcher: `./watch.sh &`

## Workflow

1. Edit files, push to `main`.
2. `watch.sh` pulls within ~30s.
3. Popup picks up changes the next time you open it. For manifest / background changes, click the reload button on the extension card.

# amazebb nnn

Personal fork of [jarun/nnn](https://github.com/jarun/nnn) on branch **`amazebb`**. `nnn -V` is **`5.3-amazebb`**. License stays BSD 2-Clause (do not invent another). Human-facing delta: `FORK.md`.

This file is the session brief. Keep it current: when a durable project fact changes, add or edit a **markdown bullet** here.

## Layout

- Source of truth is this git tree (`src/nnn.c`, `src/nnn.h`, `plugins/`, `Makefile`).
- Install: `make deploy` → `PREFIX=$HOME/.local`, `O_NERD=1`. Binary `~/.local/bin/nnn` (previous copy `nnn.bak`), man + zsh completion under `~/.local/share/`.
- nnn does **not** load plugins from this tree. After editing `plugins/preview-tui` or `plugins/preview-ghostty-*`, copy them to `~/.config/nnn/plugins/`.
- Launcher **`n3` is not in this repo.** Edit only `/Users/boris/.local/share/scripts/bin/n3` (symlink `~/.local/bin/n3`). Alias `n='source …/n3'` so zsh `NOMATCH` applies — never unmatched globs in sourced `n3`.
- `n3` default: `nnn -dIYGaPp`. **`n3 -t`** / **`N3_TMUX=1`** wraps tmux; otherwise Ghostty native split.

## Constraints

- Fold features into `src/nnn.c` / `src/nnn.h`. Do not re-apply compile-time user patches (gitstatus is already in-tree).
- Ghostty preview uses **checked-in** helpers only: `preview-ghostty-split.applescript`, `preview-ghostty-run.sh`, `preview-ghostty-close.applescript`. Never generate AppleScript or shell on the fly.
- Close Ghostty preview **by terminal id only**. Never close other splits in the tab (that kills unrelated panes).
- Images: **chafa** first, then viu, then `kitty icat`. Video: `mpv --vo=kitty --profile=sw-fast --vo-kitty-use-shm=no --really-quiet`.
- `getplugs`: strip the `-amazebb` suffix from `nnn -V` before fetching a jarun tag.

## Current behavior (bullets)

- `-y` / `NNN_OPTS=y`: eza-style compact timestamps (12 columns).
- `-Y` / `NNN_OPTS=Y`: US compact timestamps (`Aug 19 14:32`). Last of `-y`/`-Y` wins.
- `-I` / `NNN_OPTS=I`: hide directory sizes in the detail listing (file sizes stay; `d` du sort still works).
- `-G`: run git and show the status column. Without `-G`, git is not queried.
- `i`: toggle that git column; short on/off notice. Column is omitted when the repo is clean. In `$HOME`, git uses the bare `~/.dotfiles` repo.
- macOS `f` stats: Homebrew GNU `stat` if `…/coreutils/libexec/gnubin/stat` exists, else `/usr/bin/stat -x`.
- `f` popup `j`/`n` and `k`/`p`: listing highlight (and status bar) follow the hovered file; preview-tui already did via FIFO.
- Empty `p` (copy) / `v` (move): floating help in the same style as `f`, then the editor.
- `;p` / quit: close the Ghostty preview surface by recorded id; leftover id files under `$TMPDIR/nnn-preview-tui-ghosttyid.*`.

## Commits

Conventional Commits. In chat, **`git cva`** means: inspect the repo, write the message, and create the commit (see user skill `git-cva` / rule `git-commits`).

# amazebb nnn

- Personal fork of [jarun/nnn](https://github.com/jarun/nnn) on branch **`amazebb`**. 
- `nnn -V` is **`5.3-amazebb`**. 
- License stays BSD 2-Clause. 
- Human-facing delta: `FORK.md`.

This file is the session brief. Keep it current: when a durable project fact changes, add or edit a **markdown bullet** here.

## Layout

- Source of truth is this git tree (`src/nnn.c`, `src/nnn.h`, `plugins/`, `Makefile`).
- Install: `make deploy` → `PREFIX=$HOME/.local`, `O_NERD=1`. Binary `~/.local/bin/nnn` (previous copy `nnn.bak`), man + zsh completion under `~/.local/share/`.
- nnn does **not** load plugins from this tree. After editing `plugins/preview-tui` or `plugins/ghostty/preview-ghostty-*`, copy them to `~/.config/nnn/plugins/` (keep the `ghostty/` subdir).
- Launcher **`n3` is not in this repo.** Edit only `/Users/boris/.local/share/scripts/bin/n3` (symlink `~/.local/bin/n3`). Alias `n='source …/n3'` so zsh `NOMATCH` applies — never unmatched globs in sourced `n3`.
- `n3` default: `nnn -dIYGaPp`. **`n3 -t`** / **`N3_TMUX=1`** wraps tmux; otherwise Ghostty native split.

## Constraints

- Upstream sync: local `master` mirrors `upstream/master` (ff-only, never commit); merge `master` into `amazebb`. Steps in `FORK.md`. Version string is `VERSION` in `src/nnn.c`.
- Fold features into `src/nnn.c` / `src/nnn.h`. Do not re-apply compile-time user patches (gitstatus is already in-tree).
- Ghostty preview uses **checked-in** helpers only, under `plugins/ghostty/`: `preview-ghostty-split.applescript`, `preview-ghostty-run.sh`, `preview-ghostty-close.applescript`. Never generate AppleScript or shell on the fly.
- Rex preview: `rex split` + `rex block close <id>` from `preview-tui` (id in `$TMPDIR/nnn-preview-tui-rexid.*`); chafa runs as `chafa -f kitty`. Close by block id only.
- Close Ghostty preview **by terminal id only**. Never close other splits in the tab (that kills unrelated panes).
- Images: `NNN_IMGVIEWER` (default **chafa**, or `viu`; the other is the fallback), then `kitty icat` if kitty runs. Image preview prints an `exiftool` EXIF caption on the bottom rows (`NNN_PREVIEWEXIF=0` disables; viewers shrink by `CAPROWS`). RAW files: `exiftool -b -PreviewImage`, else `sips`, cached as `.jpg` in `NNN_PREVIEWDIR`. Video: `mpv --vo=kitty --profile=sw-fast --vo-kitty-use-shm=no --really-quiet`.
- `getplugs`: strip the `-amazebb` suffix from `nnn -V` before fetching a jarun tag.

## Current behavior (bullets)

- `-y` / `NNN_OPTS=y`: eza-style compact timestamps (12 columns).
- `-Y` / `NNN_OPTS=Y`: US compact timestamps (`Aug 19 14:32`). Last of `-y`/`-Y`/`-Z` wins.
- `-I` / `NNN_OPTS=I`: hide directory sizes in the detail listing (file sizes stay; `d` du sort still works).
- `-Z` / `NNN_OPTS=Z`: eza style with weekday + time (`Thu    14:32`) for files modified today, normal time color, no reverse-video highlight. `y` key cycles detail time format (ISO, eza, US, eza + today); `I` key toggles directory sizes. `;;` (plugin prefix twice, handled in nnn.c without a plugin; `;` is never a plugin key) or Ctrl+Space (NUL, matched in `nextsel()`, ignored on idle timeout): macOS Quick Look via `qlmanage -p`, raised with osascript after `sleep 0.15` (opens behind the terminal otherwise).
- `-m` / `NNN_OPTS=m`: hide octal permissions in the detail listing; `M` toggles. Status bar perms stay.
- `NNN_FCOLORS` slots 13/14: detail time/size colors (default `04`/`b3`); unset or `00` falls back to slot 8. Icon pairs start at `C_SIZ + 1`.
- `-G`: run git and show the status column. Without `-G`, git is not queried.
- `i`: toggle that git column; short on/off notice. Column is omitted when the repo is clean. In `$HOME`, git uses the bare `~/.dotfiles` repo.
- macOS `f` stats: Homebrew GNU `stat` if `…/coreutils/libexec/gnubin/stat` exists, else `/usr/bin/stat -x`.
- `f` popup `j`/`n` and `k`/`p`: listing highlight (and status bar) follow the hovered file; preview-tui already did via FIFO.
- Empty `p` (copy) / `v` (move): floating help in the same style as `f`, then the editor.
- `;p` / quit: close the Ghostty preview surface by recorded id; leftover id files under `$TMPDIR/nnn-preview-tui-ghosttyid.*`.
- Sort `t`/`s`/`e`: set the key (no xor-off). `t` `T` is reverse time; `t` `c` clears.

## Commits

Conventional Commits. In chat, **`git cva`** means: inspect the repo, write the message, and create the commit (see user skill `git-cva` / rule `git-commits`).

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
- `plugins/` keeps the full upstream set; our own plugins go in the same folder with a **`bb-`** prefix (thin wrappers around `~/.local/share/scripts/bin`, never copies). Install: `rsync -a plugins/ ~/.config/nnn/plugins/`.
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
- Empty `p` (copy) / `v` (move): floating help in the same style as `f`; Enter opens the editor, q/Esc cancels (`fw_confirm`). Non-per-file floating popups fit their content/footer and can carry a title (`fw_title`); the per-file `f` popup keeps its fixed size. All floating popups have rounded corners; scroll indicators are nerd font carets with `O_NERD` (`FW_UP`/`FW_DOWN`/`FW_LEFT`/`FW_RIGHT`), else `^v<>`. Footer key hints are pills (`fw_pill()`): bold key, capitalised label, first entry aligned with the title.
- `;p` / quit: close the Ghostty preview surface by recorded id; leftover id files under `$TMPDIR/nnn-preview-tui-ghosttyid.*`.
- `C` / `^B`: copy name(s) / full path(s) of the selection (else hovered) to the clipboard; `^G` (`^Y` is swallowed by the macOS tty DSUSP) in `xreadline` prompts pastes the first entry from `yankbuf`.
- `O_NERD` builds: cursor highlight, status-line segments (`pill_open`/`pill_close` in `statusbar()`, one pill each for counter, selection, sort/filter flags (only when set), time, perms, owner, size, file name for non-symlinks in place of the extension; only at `xcols >= 80`) and `printmsg()` messages/prompts (own color pair `C_MSG`, xterm 208, `NNN_MSGCOLOR`) use U+E0B6/U+E0B4 caps (`PILL_L`/`PILL_R`, `pill` in `nnn.c`); `NNN_PILL=0` disables. `printent` clears to end of line on other rows to erase a stale trailing cap.
- `NNN_YOUNG=reverse|pill|icon|none` (default `icon` with `O_NERD`, else `reverse`) styles timestamps of young entries (`youngstyle`, `print_time(..., inpill)`); `pill` puts caps in the neighbouring detail cells (`printent`), the status pill gets no young highlight (already reversed).
- Hover marker in detail mode (`markhovered()`, `hovermark`): `NNN_HOVERMARK=triangle` U+F0DA (default with `O_NERD`), `1` `>` (default otherwise), `0` off.
- Top line: the current context number is a pill (`ctxpill`, `mincol` in `redraw()`: path width accounts for the 2 extra columns).
- Choice prompts (`is_choice_prompt()` list in `nnn.c`) render the existing `'k'ey/[default]` message strings as pills via `printchoices()`; add a message id to that list to opt in.
- zoxide: `zoxide_add()` in `browse()` (`begin:`) runs `zoxide add -- <dir>` detached on each new directory, deduped against the last one (`zoxide_last`); needs `zoxide` on `PATH` at startup, `NNN_ZOXIDE=0` disables. Plugin `bb-z` (`;z`, bound in `n3`) wraps `~/.local/share/scripts/bin/nnn-z`: empty prompt = `zoxide query -i`, else `zoxide query -- <words>`, result sent as `0c<dir>` to `NNN_PIPE`.
- Sort `t`/`s`/`e`: set the key (no xor-off). `t` `T` is reverse time; `t` `c` clears.

## Commits

Conventional Commits. In chat, **`git cva`** means: inspect the repo, write the message, and create the commit (see user skill `git-cva` / rule `git-commits`).

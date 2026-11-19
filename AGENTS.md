# amazebb nnn

- Personal fork of [jarun/nnn](https://github.com/jarun/nnn) on branch **`amazebb`**. 
- `nnn -V` is **`5.3-amazebb`**. 
- License stays BSD 2-Clause. 
- Human-facing delta: the **`CHANGES`** section of `nnn.1` (one row per change, naming the manual section that explains it). `FORK.md` keeps only maintainer notes (upstream sync, build, preview plugin) and the Keys / Options / Requirements tables the site pulls in. A new user-facing change gets a `nnn.1` section and a `CHANGES` row, not a `FORK.md` section.

This file is the session brief. Keep it current: when a durable project fact changes, add or edit a **markdown bullet** here.

## Layout

- Source of truth is this git tree (`src/nnn.c`, `src/nnn.h`, `plugins/`, `Makefile`).
- Install: `make deploy` → `PREFIX=$HOME/.local`, `O_NERD=1`. Binary `~/.local/bin/nnn` (previous copy `nnn.bak`), man + zsh completion under `~/.local/share/`.
- No binary is provided; `make deploy` builds from source and needs `make`, a C11 compiler, `git`, ncurses headers, `install`/`cp`/`grep`/`cut` (`pkg-config` optional) and a Nerd Font. On macOS: `xcode-select --install` and `brew install font-symbols-only-nerd-font`. Keep this in `FORK.md` (Requirements) and the page Install section.
- nnn does **not** load plugins from this tree. After editing `plugins/preview-tui` or `plugins/ghostty/preview-ghostty-*`, copy them to `~/.config/nnn/plugins/` (keep the `ghostty/` subdir).
- `plugins/` keeps the full upstream set; our own plugins go in the same folder with a **`bb-`** prefix (self-contained `sh` scripts, like `bb-z`; to reuse a script from `~/.local/share/scripts/bin` as a plugin, make `plugins/bb-name` a thin wrapper that `exec`s it, so there is one source of truth). Install: `rsync -a plugins/ ~/.config/nnn/plugins/`.
- Launcher **`n3` is not in this repo.** Edit only `/Users/boris/.local/share/scripts/bin/n3` (symlink `~/.local/bin/n3`). Alias `n='source …/n3'` so zsh `NOMATCH` applies — never unmatched globs in sourced `n3`.
- `n3` default: `nnn -dmIyG` with `NNN_FIFO=$TMPDIR/nnn-fifo.$$` (number suffix: `preview-tui` keys its state files on it). **`n3 -t`** / **`N3_TMUX=1`** wraps tmux; otherwise Ghostty native split.

## Constraints

- Upstream sync: local `master` mirrors `upstream/master` (ff-only, never commit); merge `master` into `amazebb`. Steps in `FORK.md`. Version string is `VERSION` in `src/nnn.c`.
- Fold features into `src/nnn.c` / `src/nnn.h`. Do not re-apply compile-time user patches (gitstatus is already in-tree).
- Ghostty preview uses **checked-in** helpers only, under `plugins/ghostty/`: `preview-ghostty-split.applescript`, `preview-ghostty-run.sh`, `preview-ghostty-close.applescript`. Never generate AppleScript or shell on the fly.
- Rex preview: `rex split` + `rex block close <id>` from `preview-tui` (id in `$TMPDIR/nnn-preview-tui-rexid.*`); chafa runs as `chafa -f kitty`. Close by block id only.
- Close Ghostty preview **by terminal id only**. Never close other splits in the tab (that kills unrelated panes).
- Images: `NNN_IMGVIEWER` (default **chafa**, or `viu`; the other is the fallback), then `kitty icat` if kitty runs. Image preview prints an `exiftool` EXIF caption on the bottom rows (`NNN_PREVIEWEXIF=0` disables; viewers shrink by `CAPROWS`). RAW files: `exiftool -b -PreviewImage`, else `sips`, cached as `.jpg` in `NNN_PREVIEWDIR`. Video: `mpv --vo=kitty --profile=sw-fast --vo-kitty-use-shm=no --really-quiet`.
- Web pages: `make docs` regenerates both. `docs/man.html` comes from `nnn.1` via `man2html` (shell `docs/man.template.html`); `docs/index.html` comes from `docs/index.md` via `md2html` (shell `docs/index.template.html`). Those, `docs/man.html` and `docs/index.html` are generated, untracked (`.gitignore`) and rebuilt by the `Pages` workflow (`.github/workflows/pages.yml`, which checks out the sitegen repo); never edit them. The tools and the shared theme live in the **sitegen** repo (no default path: `make docs` needs `SITEGEN=<path to the clone>` as an argument or environment variable; reference in its `docs/SITEGEN.md`). `make docs` copies the theme into `docs/`; nnn only keeps `docs/site.css` (headline flip, facts row) and the parts `docs/head.html`, `nav.html`, `foot.html`. `docs/index.md` is the landing page text; its Keys, Options and Install tables are pulled from `FORK.md` sections (`{{include ../FORK.md#keys}}`, `{{table ../FORK.md#options}}`, `{{code ../FORK.md#requirements}}`), so edit those in `FORK.md`. Code spans like `NNN_PILL=0` / `-G` auto-link to man page anchors; `md2html` exits 1 on a dead link.
- `getplugs`: strip the `-amazebb` suffix from `nnn -V` before fetching a jarun tag.

## Current behavior (bullets)

- `-y` / `NNN_OPTS=y`: eza-style compact timestamps (12 columns).
- `-Y` / `NNN_OPTS=Y`: US compact timestamps (`Aug 19 14:32`). Last of `-y`/`-Y`/`-Z` wins.
- `-I` / `NNN_OPTS=I`: hide directory sizes in the detail listing (file sizes stay; `d` du sort still works).
- `-Z` / `NNN_OPTS=Z`: eza style with weekday + time (`Thu    14:32`) for files modified today, normal time color, no reverse-video highlight. `y` key cycles detail time format (ISO, eza, US, eza + today); `I` key toggles directory sizes. `;;` (plugin prefix twice, handled in nnn.c without a plugin; `;` is never a plugin key): macOS Quick Look via `qlmanage -p`, raised with osascript after `sleep 0.15` (opens behind the terminal otherwise).
- `-m` / `NNN_OPTS=m`: hide octal permissions in the detail listing; `M` toggles. Status bar perms stay.
- `NNN_FCOLORS` slots 13/14: detail time/size colors (default `04`/`b3`); unset or `00` falls back to slot 8. Icon pairs start at `C_SIZ + 1`.
- `-G`: run git and show the status column. Without `-G`, git is not queried.
- Ignored entries (`gitdim`, `FILE_IGNORED` in `nnn.c`): by default, with `-G`, drawn `A_DIM | A_ITALIC` in their own colors, never bold, with no `!!`; only the ignored entry itself (exact path), never its parent folders. `NNN_GITIGNORE=mark` restores the `!!` marks (rolled up to folders).
- `i`: toggle that git column; short on/off notice. Column is omitted when the repo is clean. In `$HOME`, git uses the bare `~/.dotfiles` repo.
- macOS `f` stats: Homebrew GNU `stat` if `…/coreutils/libexec/gnubin/stat` exists, else `/usr/bin/stat -x`.
- `f` popup `j`/`n` and `k`/`p`: listing highlight (and status bar) follow the hovered file; preview-tui already did via FIFO.
- Empty `p` (copy) / `v` (move): floating help in the same style as `f`; Enter opens the editor, q/Esc cancels (`fw_confirm`). Non-per-file floating popups fit their content/footer and can carry a title (`fw_title`); the per-file `f` popup keeps its fixed size. All floating popups have rounded corners; scroll indicators are nerd font carets with `O_NERD` (`FW_UP`/`FW_DOWN`/`FW_LEFT`/`FW_RIGHT`), else `^v<>`. Footer key hints are pills (`fw_pill()`): bold key, capitalised label, first entry aligned with the title.
- Preview toggle off / quit: close the Ghostty preview surface by recorded id; leftover id files under `$TMPDIR/nnn-preview-tui-ghosttyid.*`.
- `C` / `^B`: copy name(s) / full path(s) of the selection (else hovered) to the clipboard; `^G` in `xreadline` prompts pastes the first entry from `yankbuf`.
- `O_NERD` builds: cursor highlight, status-line segments (`pill_open`/`pill_close` in `statusbar()`, one pill each for counter, selection, sort/filter flags (only when set), time, perms, owner, size, file name for non-symlinks in place of the extension; ones that do not fit are dropped, see `NNN_STATUS`) and `printmsg()` messages/prompts (own color pair `C_MSG`, xterm 208, `NNN_MSGCOLOR`) use U+E0B6/U+E0B4 caps (`PILL_L`/`PILL_R`, `pill` in `nnn.c`); `NNN_PILL=0` disables. `printent` clears to end of line on other rows to erase a stale trailing cap.
- `NNN_YOUNG=reverse|pill|icon|none` (default `icon` with `O_NERD`, else `reverse`) styles timestamps of young entries (`youngstyle`, `print_time(..., inpill)`); `pill` puts caps in the neighbouring detail cells (`printent`), the status pill gets no young highlight (already reversed).
- Hover marker in detail mode (`markhovered()`, `hovermark`): `NNN_HOVERMARK=triangle` U+F0DA (default with `O_NERD`), `1` `>` (default otherwise), `0` off.
- Top line: the current context number and the whole path are pills (`ctxpill`, `mincol` in `redraw()`: path width accounts for the 4 extra columns).
- Top line git segment (`gitbranch`, `gittrack`, `git_branch_update()` in `browse()`; pairs `C_GIT`+): follows the path pill like zsh-prompt: seamless cap in the path colour, ` <git/dotfiles glyph> <branch glyph>  <summary>` white on #008400 (clean) / #d6000c (a ` +`/` ~`/` ?` entry), closing cap. Summary (`branch +s ~u !c ?n ↑a ↓b`) and tracked flag come from `zsh -f -c 'source …/site-functions/dotfiles/dotfiles --print-status'` via fork/exec argv (no segment if that file is missing). `NNN_GITBRANCH=0` disables (on by default); shown only while `cfg.normalgit` is on (`-G`, toggled by `i`); needs pills and 256 colors; hidden if the path would not fit.
- Status line detail segments (`statusorder`, `NNN_STATUS`, default `ftspon`: f sort/filter, t time, s size, p perms, o owner with `-U`, n name; counter and selection are fixed first): drawn in that order, with pills the first segment that does not fit ends the line (order = priority); plain text only without pills (`NNN_PILL=0`, no `O_NERD`).
- `printfilterline()`: with pills the filter prompt starts with one pill, mode + keys (`str /:`; UPPERCASE = case sensitive, lowercase = ignore case; `fnstrstr` decides), then the typed text; `showfilterinfo()` keeps the upstream `str [/], ic [:]` hint only without pills (or the `file` line with `-i`); `Esc` at the first filter prompt in the bookmarks directory (`bmpick` in `browse()`, `selbm`) returns to `lastdir`. `show_help()` prints a `REGEX FILTER` line (POSIX extended, or PCRE2 with `O_PCRE2=1`).
- `o` open with (`handle_openwith()`): the command runs via `spawn()` without a shell (no aliases/functions). `cmd_exists()` checks the first word on `PATH` first and shows `command not found`. Gui = `F_NOWAIT|F_NOTRACE|F_NOSTDIN|F_MULTI` (stdin detached so a stray terminal app cannot steal keystrokes) and shows a `launched <cmd>` notice; Cli = `F_CLI`.
- Narrow screens: `adjust_cols()` switches to the light view when the name column is too narrow and sets `detailauto`; the detail view returns when the screen widens (`d` clears the flag).
- Choice prompts (`is_choice_prompt()` list in `nnn.c`) render the existing `'k'ey/[default]` message strings as pills via `printchoices()`; add a message id to that list to opt in. `get_input()` handles Left/Right (the filled pill moves through the options and `Esc`, `parse_choices()`) and Enter returns the selected option's key (`ESC` on the `Esc` pill). Options that do not fit the width are dropped from the right (no plain-text switch).
- `x`/`X` delete confirmation: single file prompt ends with `[y/n]`; a selection is listed in the floating window (`confirm_list()`, `fw_yesno`, `fw_yes_label`): `y` proceeds, `n`/`q`/Esc cancels. The >10-file `Are you sure?` double confirm for `rm` stays a status-line prompt.
- zoxide: plugin `bb-z` (`;z`, bound in `n3`), self-contained: empty prompt = `zoxide query -i`, else `zoxide query -- <words>`; the chosen dir is recorded with `zoxide add` and sent as `0c<dir>` to `NNN_PIPE`.
- Sort `t`/`s`/`e`: set the key (no xor-off). `t` `T` is reverse time; `t` `c` clears.

## Commits

Conventional Commits. In chat, **`git cva`** means: inspect the repo, write the message, and create the commit (see user skill `git-cva` / rule `git-commits`).

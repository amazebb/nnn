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
- Web pages: `make docs` regenerates all five pages (`docs/changes.html`, `docs/install.html` and `docs/features.html` from `docs/changes.md`, `docs/install.md` and `docs/features.md` via the shared `docs/page.template.html`: the Keys/Options, Install and upstream Features pages the landing page links to). `docs/man.html` comes from `nnn.1` via `man2html` (shell `docs/man.template.html`); `docs/index.html` comes from `docs/index.md` via `md2html` (shell `docs/index.template.html`). Those, `docs/man.html`, `docs/index.html`, `docs/changes.html` and `docs/install.html` and `docs/features.html` are generated, untracked (`.gitignore`) and rebuilt by the `Pages` workflow (`.github/workflows/pages.yml`, which checks out the sitegen repo); never edit them. The tools and the shared theme live in the **sitegen** repo (no default path: `make docs` needs `SITEGEN=<path to the clone>` as an argument or environment variable; reference in its `docs/SITEGEN.md`). `make docs` copies the theme into `docs/`; nnn only keeps `docs/site.css` (headline flip, facts row) and the parts `docs/head.html`, `nav.html`, `foot.html`. `docs/index.md` is the short landing page (one-sentence cards); `docs/changes.md` holds Keys and Options; `docs/install.md` holds Install (build), Requirements and Make targets; `docs/features.md` summarises the upstream README Features. Their tables are pulled from `FORK.md` sections (`{{include ../FORK.md#keys}}`, `{{table ../FORK.md#options}}`, `{{code ../FORK.md#requirements}}`), so edit those in `FORK.md`. Code spans like `NNN_PILL=0` / `-G` auto-link to man page anchors; `md2html` exits 1 on a dead link.
- `getplugs`: strip the `-amazebb` suffix from `nnn -V` before fetching a jarun tag.

## Current behavior (bullets)

Behavior is documented in `nnn.1` (CHANGES) and `src/nnn.c`; only the non-obvious rules are kept here.

- `;` is never a plugin key: `;;` (macOS Quick Look via `qlmanage -p`, raised with osascript after `sleep 0.15`) is handled in `nnn.c` without a plugin.
- In `$HOME`, git (`-G`, `i`) uses the bare `~/.dotfiles` repo.
- Top-line git segment: summary and tracked flag come from `zsh -f -c 'source …/site-functions/dotfiles/dotfiles --print-status'` via fork/exec argv; no segment if that file is missing.
- `NNN_FCOLORS` slots 13/14 are the detail time/size colors; icon pairs start at `C_SIZ + 1`.
- macOS `f` stats: Homebrew GNU `stat` if `…/coreutils/libexec/gnubin/stat` exists, else `/usr/bin/stat -x`.
- `o` open with runs via `spawn()` without a shell (no aliases/functions); Gui detaches stdin (`F_NOSTDIN`) so a stray terminal app cannot steal keystrokes.
- Choice prompts opt in through the `is_choice_prompt()` list in `nnn.c`: add a message id there to render it as pills. Prompts built at run time (sort: `build_sortprompt()` into `sortprompt`; time type: `timeprompt`) are static buffers matched by pointer in the same function, with the current choice in `[...]` as the default pill; `'^T'` in a spec is Ctrl+T.
- Pills are tight: `pill_open()`/`pill_close()` add no padding inside the caps, only one gap cell after the closing cap; width checks count the caps and that gap (`+ 3`), not padding. Trim a message's own trailing space before drawing it in a pill.
- Ghostty preview leaves id files under `$TMPDIR/nnn-preview-tui-ghosttyid.*`.
- zoxide: plugin `bb-z` (`;z`, bound in `n3`); the chosen dir is recorded with `zoxide add` and sent as `0c<dir>` to `NNN_PIPE`.

## Commits

Conventional Commits. In chat, **`git cva`** means: inspect the repo, write the message, and create the commit (see user skill `git-cva` / rule `git-commits`).

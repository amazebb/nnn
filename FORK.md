# amazebb fork

This branch is a fork of [jarun/nnn](https://github.com/jarun/nnn) `master` (nnn 5.3).
`nnn -V` reports **5.3-amazebb**. License is unchanged (BSD 2-Clause).

## Contents

- [Tracking upstream](#tracking-upstream)
- [Build and Install](#build-and-install)
- [Changes from master](#changes-from-master)
  - [Keys](#keys)
  - [Options](#options)
  - [Preview (Ghostty)](#preview-ghostty)
  - [Plugin updates](#plugin-updates)

## Tracking upstream

Remotes: `origin` = amazebb/nnn, `upstream` = jarun/nnn. Local `master` is a pure mirror of `upstream/master`: never commit to it. GitHub's "up to date with jarun/nnn" and an old "last changed" date are expected after a fast-forward.

```bash
# 1. update the mirror
git fetch upstream
git switch master
git merge --ff-only upstream/master
git push origin master

# 2. bring upstream into the fork
git switch amazebb
git merge master            # resolve conflicts, then continue

# 3. verify, deploy, push
make O_NERD=1               # must build with no warnings
make deploy
git push origin amazebb
```

After the merge:

- Conflicts cluster in `src/nnn.c` (colors, help text, `parse_opts` getopt string and cases, key handlers) and `patches/gitstatus/*.diff` (take upstream's; the patches are unused, git status is in-tree).
- Re-check every fork option still parses: `-G -I -m -y -Y` in the getopt string and `NNN_OPTS`.
- Copy the plugins to `~/.config/nnn/plugins/` (see Plugin updates); keep the `getplugs` suffix strip.
- Smoke test: `NNN_OPTS=dIYGm nnn` shows US times, no dir sizes, no perms and the git column.
- When upstream tags a release, bump the version string to `<tag>-amazebb`.

## Build and Install

### Install

`make deploy` installs to `PREFIX=$(HOME)/.local`:

- `~/.local/bin/nnn` (previous binary saved as `nnn.bak`)
- `~/.local/share/man/man1/nnn.1`
- `~/.local/share/zsh/site-functions/_nnn`

Put `~/.local/share/zsh/site-functions` on `fpath` so completion loads.

#### Requirements

No binary is provided: `make deploy` builds from source. It needs `make`, a C11 compiler, `git` (to clone), the ncurses headers, the standard `install`, `cp`, `grep` and `cut`, and a Nerd Font for the pill and icon glyphs. `pkg-config` is optional. Apart from the compiler tools, the ncurses headers and the font, all of it is standard on a Unix system.

| Tool | Used for |
| --- | --- |
| `make` | runs the build |
| C compiler (`cc`, C11) | builds `src/nnn.c` |
| ncurses with headers | the terminal library `nnn` is linked against |
| `pkg-config` (optional) | finds ncurses outside the default paths |
| `install`, `cp`, `grep`, `cut`, `pthread` | standard coreutils and libc |

On macOS, Apple's Command Line Tools supply `make`, `cc`, `git` and the ncurses headers, so the only extra step is a Nerd Font:

```sh
xcode-select --install
brew install font-symbols-only-nerd-font
```

#### Make targets

| Command | What it does |
| --- | --- |
| `make` | builds only `./nnn` in the source folder, with the default options |
| `make O_NERD=1` | builds only `./nnn` in the source folder, with Nerd Font icons and the rounded pills |
| `make deploy` | builds `./nnn` with `O_NERD=1`, strips it and installs `~/.local/bin/nnn` (the old copy becomes `nnn.bak`), `~/.local/share/man/man1/nnn.1` and `~/.local/share/zsh/site-functions/_nnn` |
| `make install` | builds and strips `./nnn` with the default options and installs `/usr/local/bin/nnn` (the old copy becomes `nnn.bak`), `/usr/local/share/man/man1/nnn.1` and `/usr/local/share/zsh/site-functions/_nnn`; may need `sudo` |
| `make PREFIX=DIR install` | the same as `make install`, under `DIR/bin`, `DIR/share/man/man1` and `DIR/share/zsh/site-functions` |
| `make uninstall` | removes the installed binary, man page and zsh completion from `PREFIX` |
| `make strip` | builds and strips only `./nnn` in the source folder |
| `make static` | builds and strips four static binaries in the source folder: `nnn-static`, `nnn-icons-static`, `nnn-nerd-static` and `nnn-emoji-static`; needs a static libc |
| `make docs` | regenerates `docs/man.html` and `docs/index.html` with the [sitegen](https://github.com/amazebb/sitegen) tools (set `SITEGEN=` to your clone of it) |
| `make clean` | deletes `./nnn`, the static binaries, release archives and generated icon files in the source folder; installed copies stay |

## Changes from master

What the fork changes for a user is listed in the manual's **CHANGES** section (`man nnn`, or the site's manual page), and each change is explained in the section it names. This file keeps what the manual does not: the key and option tables that feed the site, and the preview plugin notes. Add a new change to the manual (a `CHANGES` row and its section), not here.

### Keys

#### New keys

| Key | Section | Action |
| --- | --- | --- |
| `i` | Display | Toggle the git status column on/off (same as the `-G` option; reloads the directory) |
| `M` | Display | Toggle octal permissions in detail mode (same as `-m`) |
| `y` | Display | Cycle the detail timestamp format: ISO, eza (`-y`), US (`-Y`), eza + today (`-Z`), back to ISO |
| `I` | Display | Toggle directory sizes in detail mode (same as the `-I` option) |
| `C` / `Ctrl+B` | Files | Copy file name(s) / full path(s) of the selection, else the hovered entry, to the system clipboard, newline separated. `Ctrl+G` in any prompt (e.g. `n`) pastes the first copied entry. |
| `;` then `Tab` | Files | List the plugin keys and their plugins in a popup, then return to the prompt (`?` still opens upstream's online plugin catalog) |
| `;;` | Files | macOS Quick Look of the hovered file (`qlmanage -p`), raised in front of the terminal. First use may prompt for Automation permission (System Events). |

#### Changed behavior of existing keys

| Key | Change |
| --- | --- |
| `t` then `t` / `s` / `e` | Sets that sort key instead of toggling it off |
| `t` then `T` / `S` / `E` | Sets that sort key reversed (`T` is oldest first) |
| `t` then `c` | Resets to the default sort order |
| `p` / `v` with nothing selected | Floating help; Enter opens the editor, q/Esc cancels |
| `f` popup, `j` `n` / `k` `p` | Listing highlight follows the hovered file |
| `o` / `Ctrl+O` | Shows `command not found` when the typed command is not an executable on `PATH` (it is run without a shell, so aliases do not work); upstream silently did nothing. Choosing Gui also detaches stdin (so a terminal app started by mistake cannot steal keystrokes) and shows `launched <cmd> (no terminal; terminal apps need c)` |

### Options

| Setting | Effect |
| --- | --- |
| `-G` | Query git and show the status column |
| `-y` `-Y` `-Z` | Compact eza, US, or eza-with-weekday timestamps (the last one wins) |
| `-I` `-m` | Hide directory sizes, hide octal permissions |
| `NNN_PILL=0` | Turn off the rounded caps |
| `NNN_STATUS` | Detail segments of the status line and their order (default `ftspon`) |
| `NNN_GITBRANCH=0` | Hide the git branch segment after the path in the top line |
| `NNN_ARCHIVELIST=0` | Archive without the tool's file list and the Enter pause; nothing is shown, errors included |
| `NNN_GITIGNORE=mark` | With `-G`, mark git ignored entries `!!` in the git column instead of drawing them dim |
| `NNN_MSGCOLOR` | Message pill color, 0 to 255 |
| `NNN_YOUNG` | Style for recent files: `icon`, `reverse`, `pill` or `none` |
| `NNN_HOVERMARK` | Hovered entry marker: `triangle`, `1` for `>`, `0` for none |

### Preview (Ghostty)

`preview-tui` can open a **native Ghostty split** (same idea as Cmd+D / `new_split:right`) instead of wrapping nnn in tmux. Requires Ghostty 1.3+ AppleScript and macOS Automation permission for Ghostty.

Checked-in helpers live in `plugins/ghostty/` (copy that folder and `preview-tui` into `~/.config/nnn/plugins/`; nnn does not load the git tree):

- `plugins/ghostty/preview-ghostty-split.applescript` — create the split and record its terminal id
- `plugins/ghostty/preview-ghostty-run.sh` — command run in that surface
- `plugins/ghostty/preview-ghostty-close.applescript` — close the surface when the preview is toggled off or nnn quits

The `n3` launcher (dotfiles, not this repo): **`n3`** uses the native split; **`n3 -t`** / **`N3_TMUX=1`** keeps the old tmux wrap.

- Toggling the preview off closes the Ghostty pane.
- Images: **chafa** by default; set `NNN_IMGVIEWER=viu` to use **viu** instead (the other is the fallback, then `kitty icat` only if kitty runs). viu was dropped as the default because the `viuer` library leaks escape codes and decodes few formats. `NNN_PREVIEWIMGPROG` still overrides both. Fits the pane after the split size settles.
- EXIF caption: in Ghostty/Rex, image previews print a dim 1-2 line caption on the bottom rows (camera, lens, focal length / aperture, shutter, ISO, date; other images show size and file size) from the original file via `exiftool`. The image is shrunk by those rows. `NNN_PREVIEWEXIF=0` turns it off.
- Camera RAW (ARW, CR2/CR3, NEF, DNG, ORF, RAF, RW2 and more): the embedded JPEG is extracted with `exiftool` (about 0.1 s, cached in `NNN_PREVIEWDIR`), falling back to `sips`, then shown with the viewer above.
- Video: `mpv --vo=kitty --profile=sw-fast --vo-kitty-use-shm=no --really-quiet`.

#### Rex

When `TERM_PROGRAM=rex` (and `REX_BLOCK` is set), `preview-tui` opens the preview as a native Rex split with `rex split --focus=false --json`, records the new block id, and closes it with `rex block close <id>` when the preview is toggled off. No helper scripts are needed. Images follow `NNN_IMGVIEWER` (chafa runs as `chafa -f kitty` because it does not detect Rex); video uses the same `mpv --vo=kitty` command. Needs a Rex with Kitty graphics support (Mac preview.19+) and, for correct chafa sizing, Server & CLI preview.15+.

Rex fades unfocused panes, which mutes the image colors. Set Settings > Interface > Active Pane > **Fade inactive panes** to *surface* (not content) so the preview stays at full color. It is a global setting; Rex has no per-pane control.

### Plugin updates

Once the fork is in sync with upstream, just copy the plugins folder:

```bash
rsync -a plugins/ ~/.config/nnn/plugins/
```

`plugins/` keeps the full upstream set untouched. Our own plugins live in the same folder with a **`bb-`** prefix, so they never clash with upstream names or merges and are easy to find (`ls plugins/bb-*`, or type `bb-` in `;f` fzplug). A plugin is a self-contained `sh` script (`bb-z` is one). To reuse a script that already lives in `~/.local/share/scripts/bin`, make the plugin a thin wrapper instead of copying it, so there is one source of truth:

```sh
#!/usr/bin/env sh
# Description: what it does (shown by fzplug)
exec "$HOME/.local/share/scripts/bin/myscript" "$@"
```

Make it executable, then bind a key in `NNN_PLUG` in `n3` (`x:bb-myscript`). For a script that only needs the hovered file, no wrapper is needed: `NNN_PLUG='x:!myscript "$nnn"*'`.

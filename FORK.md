# amazebb fork

This branch is a fork of [jarun/nnn](https://github.com/jarun/nnn) `master` (nnn 5.3).
`nnn -V` reports **5.3-amazebb**. License is unchanged (BSD 2-Clause).

## Contents

- [Tracking upstream](#tracking-upstream)
- [Build and Install](#build-and-install)
- [Changes from master](#changes-from-master)
  - [Keys](#keys)
  - [Appearance](#appearance)
  - [Options](#options)
  - [Timestamps](#timestamps)
  - [Directory sizes](#directory-sizes)
  - [Detail colors](#detail-colors)
  - [Git status](#git-status)
  - [Git segment (top line)](#git-segment-top-line)
  - [macOS `stat`](#macos-stat)
  - [Preview (Ghostty)](#preview-ghostty)
  - [Sort keys (`t` / `s` / `e`)](#sort-keys-t--s--e)
  - [Copy / move with nothing selected](#copy--move-with-nothing-selected)
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

### Keys

#### New keys

| Key | Section | Action |
| --- | --- | --- |
| `i` | Display | Toggle the git status column on/off (same as the `-G` option; reloads the directory) |
| `M` | Display | Toggle octal permissions in detail mode (same as `-m`) |
| `y` | Display | Cycle the detail timestamp format: ISO, eza (`-y`), US (`-Y`), eza + today (`-Z`), back to ISO |
| `I` | Display | Toggle directory sizes in detail mode (same as the `-I` option) |
| `C` / `Ctrl+B` | Files | Copy file name(s) / full path(s) of the selection, else the hovered entry, to the system clipboard, newline separated. `Ctrl+G` in any prompt (e.g. `n`) pastes the first copied entry. |
| `;;` | Files | macOS Quick Look of the hovered file (`qlmanage -p`), raised in front of the terminal. First use may prompt for Automation permission (System Events). |

#### Changed behavior of existing keys

| Key | Change |
| --- | --- |
| `t` then `t` / `s` / `e` | Sets that sort key instead of toggling it off |
| `t` then `T` / `S` / `E` | Sets that sort key reversed (`T` is oldest first) |
| `t` then `c` | Resets to the default sort order |
| `p` / `v` with nothing selected | Floating help; Enter opens the editor, q/Esc cancels |
| `f` popup, `j` `n` / `k` `p` | Listing highlight follows the hovered file |

### Appearance

With `O_NERD`, nnn draws its interface as rounded pills with a few small visual touches that make the listing easier to scan: pills for the hovered entry, status line segments, the context number and path, and every message and prompt (`NNN_PILL=0` disables them); the git branch after the path ([Git segment](#git-segment-top-line)); a triangle on the hovered entry (`NNN_HOVERMARK`); a clock icon on recently modified entries (`NNN_YOUNG`); compact timestamps ([Timestamps](#timestamps)); [choice prompts](#choice-prompts) and floating windows ([Copy / move with nothing selected](#copy--move-with-nothing-selected)). The manual's APPEARANCE section is the reference.

### Options

| Setting | Effect |
| --- | --- |
| `-G` | Query git and show the status column |
| `-y` `-Y` `-Z` | Compact eza, US, or eza-with-weekday timestamps (the last one wins) |
| `-I` `-m` | Hide directory sizes, hide octal permissions |
| `NNN_PILL=0` | Turn off the rounded caps |
| `NNN_STATUS` | Detail segments of the status line and their order (default `ftspon`) |
| `NNN_GITBRANCH=0` | Hide the git branch segment after the path in the top line |
| `NNN_GITIGNORE=mark` | With `-G`, mark git ignored entries `!!` in the git column instead of drawing them dim |
| `NNN_MSGCOLOR` | Message pill color, 0 to 255 |
| `NNN_YOUNG` | Style for recent files: `icon`, `reverse`, `pill` or `none` |
| `NNN_HOVERMARK` | Hovered entry marker: `triangle`, `1` for `>`, `0` for none |

### Timestamps

| Flag | `NNN_OPTS` | Listing (12 columns) |
| --- | --- | --- |
| (default) | | `YYYY-MM-DD HH:MM` (16 columns) |
| `-y` | `y` | eza style: `19 Aug 14:32` / older `19 Aug  2024` |
| `-Y` | `Y` | US style: `Aug 19 14:32` / older `Aug 19  2024` |
| `-Z` | `Z` | eza style, but files modified today show the weekday and time (`Thu    14:32`) in the normal time color, without the reverse-video highlight for files changed in the last 5 minutes |

Use with detail mode (`-d` / `d`). `-y`, `-Y` and `-Z` are exclusive; the last one wins. In a running instance, `y` cycles ISO, eza, US, eza + today, ISO. A configurable timestamp template is a possible future replacement for these fixed styles.

### Directory sizes

| Flag | `NNN_OPTS` | Detail listing |
| --- | --- | --- |
| `-I` | `I` | Size column for files only; directories left blank (du/`d` sort still shows totals). Key `I` toggles it. |
| `-m` | `m` | Hide octal permissions (`644`). Status bar still shows `rw-r--r--`. Toggle with `M`. |

### Detail colors

`NNN_FCOLORS` takes two optional extra slots after the 12 upstream ones: **13 = time**, **14 = size**. Default `04b3` (eza-like blue time, #d7af5f size). Missing or `00` falls back to slot 8 (file details), so 24-char strings behave as upstream.

```sh
export NNN_FCOLORS='c1e2272e006033f7c6d6abc404b3'
```

### Rounded highlight

In `O_NERD` builds the hovered entry's highlight, the status-line segments (file counter, selection counter, sort/filter flags, time, permissions, owner, size, file name; separate pills; order and visibility by `NNN_STATUS`, and from the right a pill that no longer fits is dropped) and the bottom-line messages and prompts get rounded Powerline caps (U+E0B6 / U+E0B4) in the highlight color. Needs a patched font. `NNN_PILL=0` turns them off. One column is reserved for the trailing cap, so names truncate one column earlier. The current context number and the whole path in the top line are pills too (two columns wider each, the path shortens to match); other contexts keep their colored digits. Message and prompt pills use their own color (xterm 208, orange) so they stand out from the status pills; `NNN_MSGCOLOR=0-255` changes it. Needs a 256-color terminal, otherwise they use the context color.

### Git segment (top line)

In `O_NERD` builds with pills and a 256-color terminal, a git segment follows the path pill, drawn like the zsh prompt's: a cap in the path color blends into the segment, then ` <git glyph> <branch glyph>  <summary> ` in white on green (`#008400`, clean) or red (`#d6000c`, a ` +`, ` ~` or ` ?` entry), and a closing cap. The git glyph is the dotfiles one in folders tracked by the bare `~/.dotfiles` repo. The summary is `branch +staged ~unstaged !conflicts ?untracked ↑ahead ↓behind`, read on each directory change by running `dotfiles --print-status` (`~/.local/share/zsh/site-functions/dotfiles/dotfiles`) in `zsh -f` via fork/exec with no shell string; without that file there is no segment. The exact colors use terminal palette slots 232-234 (redefined while nnn runs) when the terminal allows it. Hidden if the path would not fit. On by default with `-G`; it follows the status column, so `i` toggles it with the column. `NNN_GITBRANCH=0` turns it off.

### Choice prompts

Prompts with options (`n` file/dir/sym/hard, cp/mv as, current/selection, gui/cli, session, remote, archive open) show one pill per option. The default (what Enter picks) is the filled message pill, the others use the context color, and the key to press is capitalised and underlined (`File`, `Dir`, `eXtract`). A final `Esc` pill shows that any other key cancels. Needs the pill caps; on a narrow screen the options that do not fit are left off. Without pills the plain `'f'ile/'d'ir` text is shown. See also [Copy / move with nothing selected](#copy--move-with-nothing-selected).

### Hovered entry marker

In detail mode a marker before the time column points at the hovered entry. `NNN_HOVERMARK` picks it: `triangle` a filled right-pointing caret (U+F0DA, Font Awesome via Nerd Font; needs `O_NERD`; default with `O_NERD`), `1` the `>` arrowhead (default without `O_NERD`), `0` no marker.
### Recently modified timestamps

Timestamps of entries modified in the last 5 minutes are highlighted. `NNN_YOUNG` picks the style:

| Value | Style |
| --- | --- |
| `reverse` | Reverse video, as upstream (default without `O_NERD`) |
| `pill` | Reverse video with rounded caps in the neighbouring cells (falls back to `reverse` without caps or with `NNN_PILL=0`) |
| `icon` | Clock icon (U+F017) in the spare cell before the time, no highlight; the column width is unchanged (default with `O_NERD`; ignored otherwise) |
| `none` | No highlight |

The status-line time pill is already reversed, so it gets no extra highlight. `-Z` skips the highlight for entries modified today.

### Git status

Built into `nnn.c` (not applied as a compile-time patch).

- **`-G` option**: query git and show the status column (detail and normal mode). Without the `-G` option, git is not run.
- **`i`**: toggle that column in a running instance (reloads the directory).
- The column appears only when git reports a change (a clean repo looks like no column).
- In `$HOME`, git is invoked against the bare `~/.dotfiles` repo.
- **Ignored entries** are drawn dim and italic in their own colors (never bold) and get no `!!` mark. Only the ignored entry itself is styled, not a folder that merely contains ignored files. `NNN_GITIGNORE=mark` goes back to `!!` marks, which also show on folders that contain ignored files.

### macOS `stat`

File stats (`f`) use Homebrew GNU `stat` when
`/opt/homebrew/opt/coreutils/libexec/gnubin/stat` is present, otherwise `/usr/bin/stat -x`.

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

### Sort keys (`t` / `s` / `e`)

`t` then `t` / `s` / `e` **sets** that key (does not toggle it off). A capital (`T` / `S` / `E`) sets the key reversed: `t` then `T` is oldest first. Clear with `t` then `c`: it drops every sort key (time, size, extension, disk usage), reverse and version sort, so the listing is back to the default name order.

### Copy / move with nothing selected

`p` (copy) and `v` (move) show a floating help window (same style as `f`) first. Enter opens the editor on a blank path list; q/Esc cancels without opening it. Upstream opens the editor straight away. The popup is titled and sized to its text. Floating windows have rounded corners and nerd font scroll carets (`^v<>` without `O_NERD`). Footer key hints are pills with a bold key.

### zoxide

The `bb-z` plugin (`;z` via `n3`) jumps to a zoxide match: an empty prompt opens `zoxide query -i`, anything else is the query, and the directory jumped to is recorded with `zoxide add`.

### Delete confirmation

`x` / `X` on a single file ends the prompt with `[y/n]`. With a selection, the files are listed in a floating window titled with the count, where `y` deletes (or trashes) and `n`/`q`/Esc cancels. Upstream asks `rm -rf N file(s)?` on the status line.

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

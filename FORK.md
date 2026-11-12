# amazebb fork

This branch is a fork of [jarun/nnn](https://github.com/jarun/nnn) `master` (nnn 5.3).
`nnn -V` reports **5.3-amazebb**. License is unchanged (BSD 2-Clause).

## Contents

- [Tracking upstream](#tracking-upstream)
- [Build and Install](#build-and-install)
- [Changes from master](#changes-from-master)
  - [Keys](#keys)
  - [Timestamps](#timestamps)
  - [Directory sizes](#directory-sizes)
  - [Detail colors](#detail-colors)
  - [Git status](#git-status)
  - [macOS `stat`](#macos-stat)
  - [Preview (Ghostty)](#preview-ghostty)
  - [Sort keys (`t` / `s` / `e`)](#sort-keys-t--s--e)
  - [Copy / move with nothing selected](#copy--move-with-nothing-selected)
  - [Plugin updates (`getplugs`)](#plugin-updates-getplugs)

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
- Recopy changed `plugins/preview-tui` and `plugins/ghostty/` to `~/.config/nnn/plugins/`; keep the `getplugs` suffix strip.
- Smoke test: `NNN_OPTS=dIYGm nnn` shows US times, no dir sizes, no perms and the git column.
- When upstream tags a release, bump the version string to `<tag>-amazebb`.

## Build and Install

### Install

`make deploy` installs to `PREFIX=$(HOME)/.local`:

- `~/.local/bin/nnn` (previous binary saved as `nnn.bak`)
- `~/.local/share/man/man1/nnn.1`
- `~/.local/share/zsh/site-functions/_nnn`

Put `~/.local/share/zsh/site-functions` on `fpath` so completion loads.

## Changes from master

### Keys

New keys (not bound upstream):

| Key | Action |
| --- | --- |
| `i` | Toggle the git status column on/off (same as the `-G` option; reloads the directory) |
| `M` | Toggle octal permissions in detail mode (same as `-m`) |
| `y` | Cycle the detail timestamp format: ISO, eza (`-y`), US (`-Y`), eza + today (`-Z`), back to ISO |
| `I` | Toggle directory sizes in detail mode (same as the `-I` option) |
| `L` | macOS Quick Look of the hovered file (`qlmanage -p`), raised in front of the terminal. First use may prompt for Automation permission (System Events). |

Changed behavior of existing keys:

| Key | Change |
| --- | --- |
| `t` then `t` / `s` / `e` | Sets that sort key instead of toggling it off |
| `t` then `T` | Reverse time (oldest first); `t` then `c` resets to the default sort (see [Sort keys](#sort-keys-t--s--e)) |
| `p` / `v` with nothing selected | Floating help, then the editor |
| `f` popup, `j` `n` / `k` `p` | Listing highlight follows the hovered file |
| `;` then `p` | Closes the Ghostty preview split by recorded id |

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

### Git status

Built into `nnn.c` (not applied as a compile-time patch).

- **`-G` option**: query git and show the status column (detail and normal mode). Without the `-G` option, git is not run.
- **`i`**: toggle that column in a running instance (reloads the directory).
- The column appears only when git reports a change (a clean repo looks like no column).
- In `$HOME`, git is invoked against the bare `~/.dotfiles` repo.

### macOS `stat`

File stats (`f`) use Homebrew GNU `stat` when
`/opt/homebrew/opt/coreutils/libexec/gnubin/stat` is present, otherwise `/usr/bin/stat -x`.

### Preview (Ghostty)

`preview-tui` can open a **native Ghostty split** (same idea as Cmd+D / `new_split:right`) instead of wrapping nnn in tmux. Requires Ghostty 1.3+ AppleScript and macOS Automation permission for Ghostty.

Checked-in helpers live in `plugins/ghostty/` (copy that folder and `preview-tui` into `~/.config/nnn/plugins/`; nnn does not load the git tree):

- `plugins/ghostty/preview-ghostty-split.applescript` — create the split and record its terminal id
- `plugins/ghostty/preview-ghostty-run.sh` — command run in that surface
- `plugins/ghostty/preview-ghostty-close.applescript` — close the surface on `;p` or nnn quit

The `n3` launcher (dotfiles, not this repo): **`n3`** uses the native split; **`n3 -t`** / **`N3_TMUX=1`** keeps the old tmux wrap.

- Toggle preview: `;` then `p` (closes the Ghostty pane).
- Images: **chafa** first (viu has a placement/size bug), then viu, then `kitty icat`. Fits the pane after the split size settles.
- Video: `mpv --vo=kitty --profile=sw-fast --vo-kitty-use-shm=no --really-quiet`.

### Sort keys (`t` / `s` / `e`)

`t` then `t` / `s` / `e` **sets** that key (does not toggle it off). Uppercase keeps the key and reverses: `t` then `T` is oldest first. Clear with `t` then `c`: it drops every sort key (time, size, extension, disk usage), reverse and version sort, so the listing is back to the default name order.

### Copy / move with nothing selected

`p` (copy) and `v` (move) still open the editor so you can paste a path list. A floating help window (same style as `f`) explains that first.

### Plugin updates (`getplugs`)

`nnn -V` is `5.3-amazebb`, which is not a jarun/nnn release tag. This fork’s `plugins/getplugs` strips the `-amazebb` suffix and fetches **v5.3**.

The wiki one-liner always downloads **upstream** `getplugs`, which does not strip. Use either:

```bash
# latest plugins from jarun master
sh -c "$(curl -Ls https://raw.githubusercontent.com/jarun/nnn/master/plugins/getplugs)" master
```

or copy this repo’s `plugins/getplugs` into `~/.config/nnn/plugins/` and run `getplugs` from there (it fetches the plugins for v5.3). Custom files (`preview-tui`, `ghostty/preview-ghostty-*`) should be kept (keep/merge), not overwritten blindly.

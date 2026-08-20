# amazebb fork

This branch is a fork of [jarun/nnn](https://github.com/jarun/nnn) `master` (nnn 5.2).
`nnn -V` reports **5.2-amazebb**. License is unchanged (BSD 2-Clause).

Build and install to `~/.local` (nerd fonts, man page, zsh completion; backs up an existing binary to `nnn.bak`):

```bash
make deploy
```

## Changes from master

### Timestamps

| Flag | `NNN_OPTS` | Listing (12 columns) |
| --- | --- | --- |
| (default) | | `YYYY-MM-DD HH:MM` (16 columns) |
| `-y` | `y` | eza style: `19 Aug 14:32` / older `19 Aug  2024` |
| `-Y` | `Y` | US style: `Aug 19 14:32` / older `Aug 19  2024` |

Use with detail mode (`-d` / `d`). `-y` and `-Y` are exclusive; the last one wins.

### Git status

Built into `nnn.c` (not applied as a compile-time patch).

- **`-G`**: query git and show the status column (detail and normal mode). Without `-G`, git is not run.
- **`i`**: toggle that column in a running instance (reloads the directory).
- The column appears only when git reports a change (a clean repo looks like no column).
- In `$HOME`, git is invoked against the bare `~/.dotfiles` repo.

### macOS `stat`

File stats (`f`) use Homebrew GNU `stat` when
`/opt/homebrew/opt/coreutils/libexec/gnubin/stat` is present, otherwise `/usr/bin/stat -x`.

### Preview (Ghostty)

`preview-tui` can open a **native Ghostty split** (same idea as Cmd+D / `new_split:right`) instead of wrapping nnn in tmux. Requires Ghostty 1.3+ AppleScript and macOS Automation permission for Ghostty.

Checked-in helpers (copy into `~/.config/nnn/plugins/` with `preview-tui`; nnn does not load the git tree):

- `preview-ghostty-split.applescript` — create the split and record its terminal id
- `preview-ghostty-run.sh` — command run in that surface
- `preview-ghostty-close.applescript` — close the surface on `;p` or nnn quit

The `n3` launcher (dotfiles, not this repo): **`n3`** uses the native split; **`n3 -t`** / **`N3_TMUX=1`** keeps the old tmux wrap.

- Toggle preview: `;` then `p` (closes the Ghostty pane).
- Images: **chafa** first (viu has a placement/size bug), then viu, then `kitty icat`. Fits the pane after the split size settles.
- Video: `mpv --vo=kitty --profile=sw-fast --vo-kitty-use-shm=no --really-quiet`.

### Copy / move with nothing selected

`p` (copy) and `v` (move) still open the editor so you can paste a path list. A floating help window (same style as `f`) explains that first.

### Install

`make deploy` installs to `PREFIX=$(HOME)/.local`:

- `~/.local/bin/nnn` (previous binary saved as `nnn.bak`)
- `~/.local/share/man/man1/nnn.1`
- `~/.local/share/zsh/site-functions/_nnn`

Put `~/.local/share/zsh/site-functions` on `fpath` so completion loads.

## Tracking upstream

Keep fork features as normal commits on this branch. When jarun/nnn moves:

```bash
git fetch origin   # or an upstream remote
git merge master   # resolve conflicts in src/nnn.c, then make deploy
```

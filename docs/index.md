---
title: n3: nnn, with a fin3r finish
description: n3 is a personal fork of the nnn file manager with rounded pills, floating popups, git status, extended by plugins for previews and more.
intro: **nnn** is a fast, lightweight terminal file manager. This fork keeps everything [upstream](https://github.com/jarun/nnn) does and adds a polished interface: rounded pills, floating popups, git status. Everything else, such as image and video previews, is a plugin, and nnn&rsquo;s plugin system lets you write or customise your own.
---

<!-- Source of truth for the landing page text. The keys, options and requirements tables come
from FORK.md. Build with `make docs` (see AGENTS.md). -->

## What's new {#features .cards}

Every change is a small, optional layer on top of upstream nnn. Switch any of it off with a flag or an environment variable.

### A modern look

Small touches that make the listing easier to scan. The hover highlight, status-line segments, the context number, the whole top-line path (followed by the git branch) and every message are drawn as rounded pills, and a triangle marks the hovered entry. Turn the pills off with `NNN_PILL=0`. [See manual](man.html#appearance).

### Choice prompts

Prompts with options show one pill per choice. The default is filled, the key to press is capitalised and underlined, and a final `Esc` pill shows that any other key cancels. [See manual](man.html#choice-prompts).

### Floating windows {.wide}

Help, file stats and confirmations open in rounded, titled popups that fit their content, with pill key hints along the bottom. [See manual](man.html#floating-windows).

### Delete confirmation

Deleting one file ends the prompt with `[y/n]`. With a selection, the files are listed in a popup, relative to where you are, before you confirm with <kbd>y</kbd>. [See manual](man.html#floating-windows).

### Git status

A status column built into nnn, not a patch. `-G` turns it on, <kbd>i</kbd> toggles it live, and it only appears when the repo has changes. It also works with a bare dotfiles repo at `~/.dotfiles` when you are in your `$HOME` folder.

### Readable timestamps

Compact eza style, US style, or eza with the weekday for today's files, (`-y` / `-Y` / `-Z`). Press <kbd>y</kbd> to cycle them in a running session.

Recently changed files get a clock icon `NNN_YOUNG`.

### Quieter detail view {.wide}

Hide directory sizes with `-I` and octal permissions with `-m`, or toggle them with <kbd>I</kbd> and <kbd>M</kbd>. Time and size columns have their own colors in `NNN_FCOLORS`.

### Updated preview plugin {.wide}

The bundled [`preview-tui`](https://github.com/amazebb/nnn/blob/amazebb/plugins/preview-tui) plugin is updated to work with newer terminals: native splits in Ghostty 1.3+ and Rex, images through chafa or viu with an EXIF caption underneath, and embedded JPEG previews for camera RAW files.

::: tags
!New, Ghostty 1.3+, Rex, chafa, viu, EXIF caption, RAW preview
:::

### Everyday conveniences

Quick Look the hovered file with <kbd>;</kbd><kbd>;</kbd>, copy names or paths to the clipboard, set and reverse sort keys, and more. [See all the keys](#keys).

## Keys {#keys}

Bindings this fork adds or changes. Everything else works as upstream. The Section column is the heading each key has in the <kbd>?</kbd> help. [See manual](man.html#keybinds).

{{include ../FORK.md#keys}}

## Options {#options}

Flags and environment variables. Add the letters to `NNN_OPTS` to make them permanent.

{{table ../FORK.md#options}}

## Install {#install}

Build from source. The pills need a Nerd Font in your terminal; without `O_NERD` the interface falls back to plain characters.

### Requirements

`make deploy` builds from source. It needs `make`, a C11 compiler, `git`, the ncurses headers and a Nerd Font for the glyphs. On macOS the Command Line Tools cover everything but the font:

{{code ../FORK.md#requirements}}

::: details What `make deploy` needs
{{table ../FORK.md#requirements}}
:::

### Build

```sh
# clone the repo
git clone -b amazebb https://github.com/amazebb/nnn.git
cd nnn
# build with Nerd Font support and install to ~/.local/bin
make deploy
# install the plugins, including the previews
rsync -a plugins/ ~/.config/nnn/plugins/
```

::: note
`nnn -V` should report `5.3-amazebb`. The binary goes to `~/.local/bin/nnn` with the previous copy kept as `nnn.bak`, so make sure that folder is on your `PATH`.
:::

## Manual {#manual}

The full reference is the [`nnn(1)` man page](man.html).

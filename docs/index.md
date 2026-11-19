---
title: n3: nnn, with a fin3r finish
description: n3 is a personal fork of the nnn file manager with a refreshed interface and new features, extended by plugins.
intro: **nnn** is a fast, lightweight, customizable terminal file manager. This fork keeps everything [upstream](https://github.com/jarun/nnn) does and adds a polished interface and new features.
---

<!-- Source of truth for the landing page text. The keys, options and requirements tables come
from FORK.md. Build with `make docs` (see AGENTS.md). -->

## What's new {#features .cards}

Every change is a small, optional layer on top of upstream nnn. Switch any of it off with a flag or an environment variable.

### [A modern look](man.html#appearance)

Small touches that make the listing easier to scan. The hover highlight, customisable status-line segments, the context number, the whole top-line path (followed by the git branch) and every message are drawn as rounded pills, and a triangle marks the hovered entry.

### [Choice prompts](man.html#choice-prompts)

Prompts with options show one pill per choice. The default is filled, the key to press is capitalised and underlined, and a final `Esc` pill shows that any other key cancels.

### [Floating windows](man.html#floating-windows) {.wide}

Help, file stats and delete confirmations open in rounded, titled popups that fit their content, with clearer messages and pill key hints along the bottom.

### [Git status](man.html#git-status)

Git status is built in, with symbols for changes in the listing and the branch and its summary beside the current folder. It also works with dotfiles repos.

### [Readable timestamps](man.html#appearance)

Compact eza style, US style, or the weekday for today's files only. Press <kbd>y</kbd> to cycle them in a running session. Recently changed files get a clock icon.

### [Quieter detail view](man.html#display) {.wide}

Hide directory sizes and octal permissions, or toggle them with <kbd>I</kbd> and <kbd>M</kbd>. Time and size columns have their own colors.

### [Updated preview plugin](https://github.com/amazebb/nnn/blob/amazebb/plugins/preview-tui) {.wide}

The bundled `preview-tui` plugin is updated to work with newer terminals: native splits in Ghostty 1.3+ and Rex, images through chafa or viu with an EXIF caption underneath, and embedded JPEG previews for camera RAW files.

::: tags
!New, Ghostty 1.3+, Rex, chafa, viu, EXIF caption, RAW preview
:::

### Everyday conveniences

Quick Look the hovered file with <kbd>;</kbd><kbd>;</kbd>, copy names or paths to the clipboard, set and reverse sort keys, and more. See all the [keys](#keys).

## Keys {#keys}

Bindings this fork adds or changes. Everything else works as upstream. The Section column is the heading each key has in the <kbd>?</kbd> help. [See manual](man.html#keybinds).

{{include ../FORK.md#keys}}

## Options {#options}

Flags and environment variables. Add the letters to `NNN_OPTS` to make them permanent.

{{table ../FORK.md#options}}

## Install {#install}

A binary is not included, so for now you need to compile it yourself. The pills need a Nerd Font in your terminal, without it the interface falls back to plain characters.

### Requirements

On macOS you need the Command Line Tools and a Nerd Font, which can be installed using [Homebrew](https://brew.sh):

{{code ../FORK.md#requirements}}

::: details What is needed
Apart from the compiler tools, the ncurses headers and the font, all of it is standard on a Unix system.

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

::: details Make targets
{{table ../FORK.md#make-targets}}
:::

## Manual {#manual}

The full reference is the [`nnn(1)` man page](man.html).

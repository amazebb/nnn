---
title: Install n3
description: What you need to build n3 and the make targets.
intro: n3 is built from source. This page lists what you need and what each make target does.
---

<!-- Requirements and make tables come from FORK.md. Build with `make docs` (see AGENTS.md). -->

## Install {#install}

No binary is provided, so build it from source. The pills need a Nerd Font, without one the interface falls back to plain characters.

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

## Requirements {#requirements}

On macOS you need the Command Line Tools and a Nerd Font, which can be installed using [Homebrew](https://brew.sh):

{{code ../FORK.md#requirements}}

Apart from the compiler tools, the ncurses headers and the font, all of it is standard on a Unix system.

{{table ../FORK.md#requirements}}

## Make targets {#make-targets}

{{table ../FORK.md#make-targets}}

## Back {#back}

Back to the [home page](index.html).

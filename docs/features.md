---
title: nnn features
description: What upstream nnn already does, all kept in the n3 fork.
intro: The upstream feature set at a glance. The fork keeps all of it, and [adds its own changes](changes.html) on top.
---

<!-- A summary of the Features section of README.md (upstream nnn). Build with `make docs` (see AGENTS.md). -->

## Overview {#overview .cards}

Fast, tiny and driven by plugins and hotkeys, with no config file to write. The full list is in the [original README](https://github.com/jarun/nnn#features).

### Quality

Privacy-aware, with no unconfirmed data collection. POSIX-compliant C, written in the Linux kernel style and checked with static analysis.

### Frugal

Under 3.5 MB of memory and a binary of around 150 KB. Few disk reads and writes, no floating point, fast line redraws. Works with 8 colors and has a 1-column mode for small terminals.

### Portable

Language-agnostic plugins, a static binary, minimal dependencies and no config file. Unicode, touch-friendly shortcuts and a plugin to back up your configuration.

### Modes

A light list by default, a detail view with file info, a disk usage analyzer and a file picker for (neo)vim.

### Navigation

Filter with automatic entry on a unique match, type-to-nav, relative jumps, and contexts as tabs with their own colors. Sessions, bookmarks, remote mounts and `cd` on quit.

### Search

Instant search-as-you-type with string, fuzzy and regex (POSIX or PCRE2) filters, plus a subtree search plugin to open or edit files.

### Sort

Natural numeric order by default. Sort by name, time, size or extension, reversed, or per directory.

### Mimes

Built-in directory and text preview, FIFO-based previewer plugins and thumbnails. Custom openers, file colors, icons and emoji. Create, list, extract and mount archives.

### Convenience

File stats, hotkeys for plugins and commands, trash integration and selection across directories. Batch rename, copy, move, delete and link, clipboard integration, an idle lock and screen reader support.

#!/bin/sh
# Ghostty split command for nnn preview-tui.
# Ghostty's AppleScript `command` is a single executable; file and plugin
# path are passed in the surface environment.
#
#   NNN_GHOSTTY_PREVIEWER  absolute path to preview-tui
#   NNN_GHOSTTY_FILE       hovered file to preview

set -eu
exec "$NNN_GHOSTTY_PREVIEWER" "$NNN_GHOSTTY_FILE"

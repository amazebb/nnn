-- Ghostty 1.3+ native split for nnn preview-tui (same idea as Cmd+D / new_split:right).
--
-- Usage:
--   osascript preview-ghostty-split.applescript DIRECTION CWD COMMAND IDFILE [ENV=val ...]
--
-- DIRECTION: right | left | down | up
-- CWD:       initial working directory
-- COMMAND:   executable to run in the new surface (preview-ghostty-run.sh)
-- IDFILE:    path to write the new terminal's id (for close on toggle/quit)
-- remaining: KEY=VALUE environment entries for that surface
--
-- Focus stays on the original terminal (nnn). wait after command is false so
-- the split can close when the preview process exits; nnn also closes by id.

on run argv
	if (count of argv) < 4 then error "usage: direction cwd command idfile [ENV=val ...]"
	set gdir to item 1 of argv
	set cwd to item 2 of argv
	set cmd to item 3 of argv
	set idfile to item 4 of argv
	set envList to {}
	if (count of argv) ≥ 5 then set envList to items 5 thru -1 of argv

	tell application "Ghostty"
		activate
		set cfg to new surface configuration
		set command of cfg to cmd
		set initial working directory of cfg to cwd
		set wait after command of cfg to false
		if (count of envList) > 0 then set environment variables of cfg to envList
		set orig to focused terminal of selected tab of front window
		if gdir is "down" then
			set newTerm to split orig direction down with configuration cfg
		else if gdir is "left" then
			set newTerm to split orig direction left with configuration cfg
		else if gdir is "up" then
			set newTerm to split orig direction up with configuration cfg
		else
			set newTerm to split orig direction right with configuration cfg
		end if
		focus orig
		set tid to id of newTerm
	end tell
	do shell script "printf '%s\\n' " & quoted form of tid & " > " & quoted form of idfile
end run

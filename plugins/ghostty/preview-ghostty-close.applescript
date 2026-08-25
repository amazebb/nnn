-- Close a Ghostty preview surface by id only (never other splits in the tab).
--
-- Usage:
--   osascript preview-ghostty-close.applescript TERMINAL_ID

on run argv
	if (count of argv) < 1 then error "usage: terminal-id"
	set tid to do shell script "printf %s " & quoted form of (item 1 of argv)
	if tid is "" then return
	tell application "Ghostty"
		set matches to every terminal whose id is tid
		if (count of matches) > 0 then close item 1 of matches
	end tell
end run

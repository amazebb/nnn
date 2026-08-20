-- Close a Ghostty preview surface.
--
-- Usage:
--   osascript preview-ghostty-close.applescript [TERMINAL_ID]
--
-- If TERMINAL_ID is given, close that surface. Otherwise close every
-- terminal in the selected tab except the focused one (nnn).

on run argv
	tell application "Ghostty"
		if (count of argv) ≥ 1 then
			set tid to do shell script "printf %s " & quoted form of (item 1 of argv)
			set matches to every terminal whose id is tid
			if (count of matches) > 0 then
				close item 1 of matches
				return
			end if
		end if
		set tabref to selected tab of front window
		set keepid to id of focused terminal of tabref
		set doomed to {}
		repeat with term in terminals of tabref
			if id of term is not keepid then set end of doomed to (id of term)
		end repeat
		repeat with did in doomed
			set matches to every terminal whose id is did
			if (count of matches) > 0 then close item 1 of matches
		end repeat
	end tell
end run

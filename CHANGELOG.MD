# Changelog

## 0.8.0

### Added

- Added new "Enforcement" section to settings. The primary purpose of this is to help filter against messages where the LLM returns a response indicating it is a language model. After doing this, it often fails to remember its personality. It can also be used to filter unwanted content from message responses in general, by prompting a request for a new response.

### Changed

- Moved position of button bar and status text to give more room for both.

### Fixed

- No longer show "X more text before speaking" in status if voice transcription isn't active.
- Toggling off Speech Synthesis button now prevents Sock from talking out loud when responding.
- "Thinking" visual will continue while speech synthesis is running and end before playback, so
  so the entire "process user text -> go to LLM for response -> convert response to speech" process
  smoothly has one whole thinking phase instead of a visual gap between LLM response and talking.

## [Example]

### Added

- This section is for listing new features.

### Changed

- This section is for listing changes to existing functionality.

### Deprecated

- This section is for listing features that will soon be removed in future versions.
- It's quite possible this will not be used in the context of a text.

### Removed

- This section is for listing features that have been removed.

### Fixed

- This section is for listing fixes to errors, bugs in features etc.
- Changed is for non-fix changes, Fixed is for correcting bugs/issues.

# Changelog

## [1.1.3] - 2025-12-31

### Bug Fixes
- Fixed "Keep Empty Placeholders" setting not being respected when copying cells from tables with merged cells (colspan/rowspan)

---

## [1.1.0] - 2025-12-29

### New Features
- **Multi-language Toast Notifications**: Added support for English, Simplified Chinese, and Japanese toast messages when copying content
- **Keyboard Selection Shortcuts**: Implemented `Cmd/Ctrl+Shift+Arrow` keys to extend selection to the edges of the current column or row
- **Copy Settings Enhancement**: Added option to keep empty placeholders when copying non-contiguous cells

### Improvements
- **StatsPanel Interaction**: Added `pointer-events: none` to prevent unintended user interactions with the stats panel
- **Table Structure Change Handling**: Implemented MutationObserver to detect table structure changes and automatically clean up stale selections
- **Selection Mode Refactoring**: Improved selection mode logic to utilize user-defined shortcut settings
- **Shift Key Reservation Notice**: Added UI feedback to indicate when the Shift key is reserved for range selection

### Bug Fixes
- Fixed selection not being cleaned up when table content changes dynamically
- Improved focus handling in popup when editing shortcuts
- Enhanced error state styling for invalid shortcut inputs

---

## [1.0.1] - 2025-12-29

### Improvements
- Initial selection mode handling enhancements
- Settings manager shortcut key mapping improvements

---

## [1.0.0] - Initial Release

### Features
- Table cell selection with multiple selection modes
- Copy selected cells to clipboard
- Export to Excel functionality
- Statistics panel for selected data
- Customizable keyboard shortcuts
- Multi-language support (English, Chinese, Japanese)

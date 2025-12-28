<p align="center">
  <img src="icons/logo.png" alt="SuperTables Logo" width="128" height="128">
</p>

<h1 align="center">SuperTables</h1>

<p align="center">
  <a href="https://github.com/wxkingstar/SuperTables"><img src="https://img.shields.io/badge/Chrome-Extension-green" alt="Chrome Web Store"></a>
  <a href="https://github.com/wxkingstar/SuperTables"><img src="https://img.shields.io/badge/version-1.0.0-blue" alt="Version"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-green" alt="License"></a>
</p>

<p align="center">
  <b>Language / 语言 / 言語</b>: English | <a href="README_zh-CN.md">简体中文</a> | <a href="README_ja.md">日本語</a>
</p>

---

Select table cells like Excel - select, copy, and analyze table data on any webpage.

## Features

### Cell Selection
- **Single Cell**: `Cmd/Ctrl + Click` - Select individual cells
- **Row Selection**: `Cmd/Ctrl + Alt + Click` - Select entire row
- **Column Selection**: `Alt + Click` - Select entire column
- **Range Selection**: `Shift + Click` - Select range from anchor cell
- **Select All**: Click the "Select All" button that appears when hovering over a table

### Statistics Panel
Real-time statistics displayed at the bottom of the page:
- **Numeric Mode**: Count, Sum, Average, Min, Max
- **Text Mode**: Top 5 most frequent values
- Click any statistic to copy its value

### Export & Copy
- `Cmd/Ctrl + C` - Copy selected cells to clipboard
- Download as Excel file when entire table is selected

### Customizable Settings
- Keyboard shortcuts
- Statistics bar position (left, center, right)
- Column selection header inclusion

## Screenshots

| Numeric Mode | Text Mode |
|-------------|-----------|
| ![Numeric](screenshots/output/screenshot-1-numeric-mode.png) | ![Text](screenshots/output/screenshot-2-text-mode.png) |

## Installation

### Chrome Web Store
*(Coming soon)*

### Manual Installation
1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the project folder

## Usage

### Basic Selection
| Action | Shortcut |
|--------|----------|
| Select Cell | `Cmd/Ctrl` + Click |
| Select Row | `Cmd/Ctrl` + `Alt` + Click |
| Select Column | `Alt` + Click |
| Range Select | `Shift` + Click |
| Copy Selection | `Cmd/Ctrl` + `C` |
| Clear Selection | `Esc` |

### Statistics Panel
The statistics panel automatically appears when you select cells:
- **Numeric data**: Shows Sum, Average, Min, Max
- **Text data**: Shows Top 5 most frequent values
- Click the toggle button to switch between modes
- Click any value to copy it to clipboard

## Project Structure

```
supertables/
├── manifest.json           # Extension manifest
├── background/
│   └── service-worker.js   # Background service worker
├── content/
│   ├── content.js          # Main content script
│   ├── content.css         # Styles
│   ├── TableDetector.js    # Table detection logic
│   ├── SelectionManager.js # Cell selection handling
│   ├── StatsPanel.js       # Statistics panel UI
│   ├── ClipboardHandler.js # Copy functionality
│   ├── ExcelExporter.js    # Excel export
│   └── SettingsManager.js  # User settings
├── popup/
│   ├── popup.html          # Popup UI
│   ├── popup.js            # Popup logic
│   └── i18n.js             # Internationalization
├── icons/                  # Extension icons
└── _locales/               # Language files
    ├── en/
    ├── zh_CN/
    └── ja/
```

## Internationalization

SuperTables supports multiple languages:
- English (en)
- Simplified Chinese (zh_CN)
- Japanese (ja)

## Development

### Build
```bash
./build.sh
```

This creates a distributable zip file in the `dist/` folder.

### Local Development
1. Make changes to the source files
2. Go to `chrome://extensions/`
3. Click the refresh button on the SuperTables extension card

## Privacy

SuperTables:
- Does NOT collect any personal data
- Does NOT send data to external servers
- Only accesses table data on pages you visit
- All processing happens locally in your browser

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see [LICENSE](LICENSE) for details.

## Author

**wangxin** - [GitHub](https://github.com/wxkingstar)

---

If you find this extension useful, please consider giving it a star on GitHub!

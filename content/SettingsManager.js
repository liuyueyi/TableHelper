/**
 * SettingsManager - Handle extension settings with chrome.storage
 */
class SettingsManager {
  constructor() {
    this.settings = null;
    this.listeners = new Set();
    this.defaults = {
      // Column selection includes header
      columnIncludeHeader: false,

      // Copy settings: keep empty placeholders for non-contiguous selection
      copyKeepEmptyPlaceholders: false,

      // Stats bar position: 'left', 'center', 'right'
      statsPosition: 'left',

      // Theme: 'excel', 'freshGreen', 'dark', 'metal'
      theme: 'excel',

      // Keyboard shortcuts (key combinations)
      shortcuts: {
        selectCell: { key: 'click', modifiers: ['cmd'] },
        selectColumn: { key: 'click', modifiers: ['alt'] },
        selectRow: { key: 'click', modifiers: ['cmd', 'alt'] },
        selectAll: { key: 'click', modifiers: ['cmd'], doubleClick: true },
        copy: { key: 'c', modifiers: ['cmd'] }
      }
    };
  }

  /**
   * Initialize settings from storage
   */
  async init() {
    try {
      const stored = await this._getFromStorage('settings');
      this.settings = this._mergeWithDefaults(stored || {});

      // Listen for storage changes
      if (chrome.storage && chrome.storage.onChanged) {
        chrome.storage.onChanged.addListener((changes, area) => {
          if (area === 'sync' && changes.settings) {
            this.settings = this._mergeWithDefaults(changes.settings.newValue || {});
            this._notifyListeners();
          }
        });
      }
    } catch (e) {
      console.warn('SuperTables: Could not load settings, using defaults', e);
      this.settings = { ...this.defaults };
    }

    return this.settings;
  }

  /**
   * Merge stored settings with defaults
   * @private
   */
  _mergeWithDefaults(stored) {
    return {
      columnIncludeHeader: stored.columnIncludeHeader ?? this.defaults.columnIncludeHeader,
      copyKeepEmptyPlaceholders: stored.copyKeepEmptyPlaceholders ?? this.defaults.copyKeepEmptyPlaceholders,
      statsPosition: stored.statsPosition ?? this.defaults.statsPosition,
      theme: stored.theme ?? this.defaults.theme,
      shortcuts: {
        ...this.defaults.shortcuts,
        ...(stored.shortcuts || {})
      }
    };
  }

  /**
   * Get a setting value
   * @param {string} key
   * @returns {*}
   */
  get(key) {
    if (!this.settings) {
      return this.defaults[key];
    }
    return this.settings[key] ?? this.defaults[key];
  }

  /**
   * Set a setting value
   * @param {string} key
   * @param {*} value
   */
  async set(key, value) {
    if (!this.settings) {
      this.settings = { ...this.defaults };
    }
    this.settings[key] = value;
    await this._saveToStorage('settings', this.settings);
    this._notifyListeners();
  }

  /**
   * Update multiple settings
   * @param {Object} updates
   */
  async update(updates) {
    if (!this.settings) {
      this.settings = { ...this.defaults };
    }
    this.settings = { ...this.settings, ...updates };
    await this._saveToStorage('settings', this.settings);
    this._notifyListeners();
  }

  /**
   * Reset to defaults
   */
  async reset() {
    this.settings = { ...this.defaults };
    await this._saveToStorage('settings', this.settings);
    this._notifyListeners();
  }

  /**
   * Add change listener
   * @param {Function} callback
   */
  onChange(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  /**
   * Notify all listeners
   * @private
   */
  _notifyListeners() {
    this.listeners.forEach(cb => {
      try {
        cb(this.settings);
      } catch (e) {
        console.error('SuperTables: Settings listener error', e);
      }
    });
  }

  /**
   * Get available themes
   * @returns {Array} Array of available theme objects
   */
  getAvailableThemes() {
    return [
      { id: 'excel', name: 'Excel Theme', description: 'Classic Excel green theme' },
      { id: 'freshGreen', name: 'Fresh Green', description: 'Fresh green theme' },
      { id: 'dark', name: 'Dark Theme', description: 'Dark theme for comfortable viewing' },
      { id: 'metal', name: 'Metallic', description: 'Metallic silver theme' }
    ];
  }

  /**
   * Apply theme to document
   * @param {string} themeId The theme to apply
   */
  applyTheme(themeId) {
    // Remove existing theme classes
    document.body.classList.remove('st-theme-excel', 'st-theme-freshGreen', 'st-theme-dark', 'st-theme-metal');

    // Add new theme class
    document.body.classList.add(`st-theme-${themeId}`);

    // Store current theme in settings
    this.set('theme', themeId);
  }

  /**
   * Get from chrome storage
   * @private
   */
  _getFromStorage(key) {
    return new Promise((resolve) => {
      if (chrome.storage && chrome.storage.sync) {
        chrome.storage.sync.get([key], (result) => {
          resolve(result[key]);
        });
      } else {
        // Fallback to localStorage
        try {
          const value = localStorage.getItem(`supertables_${key}`);
          resolve(value ? JSON.parse(value) : null);
        } catch (e) {
          resolve(null);
        }
      }
    });
  }

  /**
   * Save to chrome storage
   * @private
   */
  _saveToStorage(key, value) {
    return new Promise((resolve) => {
      if (chrome.storage && chrome.storage.sync) {
        chrome.storage.sync.set({ [key]: value }, resolve);
      } else {
        // Fallback to localStorage
        try {
          localStorage.setItem(`supertables_${key}`, JSON.stringify(value));
        } catch (e) {
          console.error('SuperTables: Could not save settings', e);
        }
        resolve();
      }
    });
  }

  /**
   * Check if a keyboard event matches a shortcut
   * @param {KeyboardEvent} event
   * @param {string} shortcutName
   * @returns {boolean}
   */
  matchesShortcut(event, shortcutName) {
    const shortcut = this.get('shortcuts')[shortcutName];
    if (!shortcut) return false;

    const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform);
    const modifiers = shortcut.modifiers || [];

    // Check modifiers
    const cmdPressed = isMac ? event.metaKey : event.ctrlKey;
    const altPressed = event.altKey;
    const shiftPressed = event.shiftKey;

    const needsCmd = modifiers.includes('cmd');
    const needsAlt = modifiers.includes('alt');
    const needsShift = modifiers.includes('shift');

    if (needsCmd !== cmdPressed) return false;
    if (needsAlt !== altPressed) return false;
    if (needsShift !== shiftPressed) return false;

    // For click-based shortcuts, just check modifiers
    if (shortcut.key === 'click') return true;

    // For key-based shortcuts, check the key
    return event.key.toLowerCase() === shortcut.key.toLowerCase();
  }

  /**
   * Get modifiers state for click detection
   * @param {MouseEvent|KeyboardEvent} event
   * @returns {Object}
   */
  getModifiersState(event) {
    const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform);
    return {
      cmd: isMac ? event.metaKey : event.ctrlKey,
      alt: event.altKey,
      shift: event.shiftKey
    };
  }

  /**
   * Determine selection mode from event
   * @param {MouseEvent} event
   * @returns {string|null} 'cell', 'row', 'column', or null
   */
  getSelectionMode(event) {
    const shortcuts = this.get('shortcuts');
    const state = this.getModifiersState(event);

    // Check each mode in order of specificity (most modifiers first)
    // Map shortcut keys to their return values
    const modeMap = [
      { key: 'selectRow', result: 'row' },
      { key: 'selectColumn', result: 'column' },
      { key: 'selectCell', result: 'cell' },
      { key: 'selectAll', result: 'cell' }  // Return 'cell' since it's based on cell click
    ];

    // Sort by number of modifiers (most specific first)
    const sortedModes = modeMap.map(m => {
      const shortcut = shortcuts[m.key];
      return {
        ...m,
        shortcut,
        modifierCount: shortcut ? shortcut.modifiers.length : 0
      };
    }).sort((a, b) => b.modifierCount - a.modifierCount);

    for (const mode of sortedModes) {
      const shortcut = mode.shortcut;
      if (!shortcut) continue;

      // For selectAll, we only check modifiers, not the key itself
      if (mode.key === 'selectAll') {
        const modifiers = shortcut.modifiers || [];
        const needsCmd = modifiers.includes('cmd');
        const needsAlt = modifiers.includes('alt');
        const needsShift = modifiers.includes('shift');

        // Match cmd, alt, and shift states
        if (needsCmd === state.cmd && needsAlt === state.alt && (!needsShift || needsShift === state.shift)) {
          return mode.result;
        }
      } else {
        const modifiers = shortcut.modifiers || [];
        const needsCmd = modifiers.includes('cmd');
        const needsAlt = modifiers.includes('alt');
        // Note: Shift is ignored here because it's used for range selection,
        // not for determining the selection mode
        const needsShift = modifiers.includes('shift');

        // Match cmd and alt, but ignore shift state (shift is for range selection)
        if (needsCmd === state.cmd && needsAlt === state.alt && (!needsShift || needsShift === state.shift)) {
          return mode.result;
        }
      }
    }

    return null;
  }
}

// Export
window.SuperTables = window.SuperTables || {};
window.SuperTables.SettingsManager = SettingsManager;

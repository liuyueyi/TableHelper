/**
 * SuperTables - Popup Settings Script
 * Supports i18n, shortcut editing, and position settings
 */
(function() {
  'use strict';

  // Detect platform
  const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform);
  const modKey = isMac ? '⌘' : 'Ctrl';

  // Shortcut definitions
  const shortcutDefs = [
    { action: 'selectCell', labelKey: 'selectCell' },
    { action: 'selectColumn', labelKey: 'selectColumn' },
    { action: 'selectRow', labelKey: 'selectRow' },
    { action: 'copy', labelKey: 'copySelection' }
  ];

  // Default settings
  const defaults = {
    columnIncludeHeader: false,
    copyKeepEmptyPlaceholders: false,
    statsPosition: 'left',
    shortcuts: {
      selectCell: { key: 'click', modifiers: ['cmd'] },
      selectColumn: { key: 'click', modifiers: ['alt'] },
      selectRow: { key: 'click', modifiers: ['cmd', 'alt'] },
      copy: { key: 'c', modifiers: ['cmd'] }
    }
  };

  let settings = JSON.parse(JSON.stringify(defaults));
  let editingShortcut = null;
  let recordedModifiers = [];

  // DOM Elements
  const toast = document.getElementById('toast');
  const columnIncludeHeaderToggle = document.getElementById('columnIncludeHeader');
  const copyKeepEmptyPlaceholdersToggle = document.getElementById('copyKeepEmptyPlaceholders');
  const statsPositionSelect = document.getElementById('statsPosition');
  const resetBtn = document.getElementById('reset-btn');
  const tabs = document.querySelectorAll('.tab');
  const shortcutList = document.getElementById('shortcut-list');
  const docLink = document.getElementById('doc-link');

  /**
   * Initialize i18n
   */
  function initI18n() {
    i18n.init();
    applyTranslations();
  }

  /**
   * Apply translations to all elements
   */
  function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      el.textContent = i18n.t(key);
    });

    // Update select options
    document.querySelectorAll('select option[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      el.textContent = i18n.t(key);
    });

    // Update hint
    const hint = document.querySelector('[data-i18n-hint]');
    if (hint) {
      hint.textContent = i18n.currentLocale === 'zh' ? '点击编辑快捷键' :
                         i18n.currentLocale === 'ja' ? 'クリックして編集' :
                         'Click to edit shortcut';
    }
  }

  /**
   * Load settings from storage
   */
  async function loadSettings() {
    try {
      const result = await chrome.storage.sync.get(['settings']);
      if (result.settings) {
        settings = {
          ...defaults,
          ...result.settings,
          shortcuts: { ...defaults.shortcuts, ...(result.settings.shortcuts || {}) }
        };
      }
    } catch (e) {
      console.error('Failed to load settings:', e);
    }

    updateUI();
  }

  /**
   * Save settings to storage
   */
  async function saveSettings() {
    try {
      await chrome.storage.sync.set({ settings });
      showToast(i18n.t('settingsSaved'));
    } catch (e) {
      console.error('Failed to save settings:', e);
      showToast(i18n.t('saveFailed'));
    }
  }

  /**
   * Format modifiers for display
   */
  function formatModifiers(modifiers) {
    const keys = [];
    if (modifiers.includes('cmd')) {
      keys.push(`<span class="key mod">${modKey}</span>`);
    }
    if (modifiers.includes('alt')) {
      keys.push('<span class="key mod">Alt</span>');
    }
    if (modifiers.includes('shift')) {
      keys.push('<span class="key mod">⇧</span>');
    }
    return keys.join('');
  }

  /**
   * Format shortcut key for display
   */
  function formatKey(key) {
    if (key === 'click') {
      return `<span class="key">${i18n.t('click')}</span>`;
    }
    return `<span class="key">${key.toUpperCase()}</span>`;
  }

  /**
   * Render shortcuts list
   */
  function renderShortcuts() {
    shortcutList.innerHTML = shortcutDefs.map(def => {
      const shortcut = settings.shortcuts[def.action];
      const modifiersHtml = formatModifiers(shortcut.modifiers);
      const keyHtml = formatKey(shortcut.key);

      return `
        <div class="shortcut-item" data-action="${def.action}">
          <span class="shortcut-label">${i18n.t(def.labelKey)}</span>
          <div class="shortcut-keys">
            ${modifiersHtml}
            ${keyHtml}
          </div>
          <div class="shortcut-edit">
            <input type="text" class="shortcut-input" placeholder="${i18n.t('pressKeys')}" readonly>
            <button class="edit-btn primary save-btn">${i18n.t('save')}</button>
            <button class="edit-btn secondary cancel-btn">${i18n.t('cancel')}</button>
          </div>
        </div>
      `;
    }).join('');

    // Add event listeners
    shortcutList.querySelectorAll('.shortcut-item').forEach(item => {
      const action = item.dataset.action;

      // Click to edit
      item.addEventListener('click', (e) => {
        if (e.target.closest('.shortcut-edit')) return;
        startEditingShortcut(item, action);
      });

      // Save button
      item.querySelector('.save-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        saveShortcut(item, action);
      });

      // Cancel button
      item.querySelector('.cancel-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        cancelEditingShortcut(item);
      });
    });
  }

  /**
   * Start editing a shortcut
   */
  function startEditingShortcut(item, action) {
    // Cancel any existing edit properly
    if (editingShortcut) {
      const prevItem = document.querySelector('.shortcut-item.editing');
      if (prevItem) {
        cancelEditingShortcut(prevItem);
      }
    }

    editingShortcut = action;
    recordedModifiers = [];
    item.classList.add('editing');

    const input = item.querySelector('.shortcut-input');
    input.value = i18n.t('pressModifier');
    input.classList.add('recording');

    // Use requestAnimationFrame to ensure the element is visible before focusing
    requestAnimationFrame(() => {
      input.focus();
    });

    // Listen for keydown
    const keyHandler = (e) => {
      e.preventDefault();
      e.stopPropagation();

      // Check if shift is pressed - it's reserved for range selection
      if (e.shiftKey) {
        input.value = i18n.t('shiftReserved');
        input.classList.add('error');
        recordedModifiers = [];
        return;
      }

      input.classList.remove('error');

      const modifiers = [];
      if (isMac ? e.metaKey : e.ctrlKey) modifiers.push('cmd');
      if (e.altKey) modifiers.push('alt');

      if (modifiers.length === 0) {
        input.value = i18n.t('pressModifier');
        return;
      }

      recordedModifiers = modifiers;

      // Check if a non-modifier key is pressed
      const key = e.key.toLowerCase();
      const isModifierOnly = ['meta', 'control', 'alt', 'shift'].includes(key);

      if (isModifierOnly) {
        // Just show modifiers + click
        input.value = formatModifiersText(modifiers) + ' + ' + i18n.t('click');
      } else {
        // Show modifiers + key
        input.value = formatModifiersText(modifiers) + ' + ' + key.toUpperCase();
        recordedModifiers = [...modifiers, key];
      }
    };

    const keyUpHandler = () => {
      // Keep showing the last recorded combination
    };

    input.addEventListener('keydown', keyHandler);
    input.addEventListener('keyup', keyUpHandler);

    // Store handlers for cleanup
    input._keyHandler = keyHandler;
    input._keyUpHandler = keyUpHandler;
  }

  /**
   * Format modifiers as text
   */
  function formatModifiersText(modifiers) {
    const parts = [];
    if (modifiers.includes('cmd')) parts.push(modKey);
    if (modifiers.includes('alt')) parts.push('Alt');
    if (modifiers.includes('shift')) parts.push('⇧');
    return parts.join(' + ');
  }

  /**
   * Save the edited shortcut
   */
  async function saveShortcut(item, action) {
    if (recordedModifiers.length === 0) {
      showToast(i18n.t('invalidShortcut'));
      return;
    }

    // Extract key and modifiers
    let key = 'click';
    const modifiers = [];

    recordedModifiers.forEach(m => {
      if (['cmd', 'alt', 'shift'].includes(m)) {
        modifiers.push(m);
      } else {
        key = m;
      }
    });

    if (modifiers.length === 0) {
      showToast(i18n.t('invalidShortcut'));
      return;
    }

    settings.shortcuts[action] = { key, modifiers };
    await saveSettings();

    cancelEditingShortcut(item);
    renderShortcuts();
    showToast(i18n.t('shortcutSaved'));
  }

  /**
   * Cancel editing a shortcut
   */
  function cancelEditingShortcut(item) {
    item.classList.remove('editing');
    const input = item.querySelector('.shortcut-input');
    input.classList.remove('recording', 'error');

    // Remove event listeners
    if (input._keyHandler) {
      input.removeEventListener('keydown', input._keyHandler);
      input.removeEventListener('keyup', input._keyUpHandler);
    }

    editingShortcut = null;
    recordedModifiers = [];
  }

  /**
   * Update UI with current settings
   */
  function updateUI() {
    columnIncludeHeaderToggle.checked = settings.columnIncludeHeader;
    copyKeepEmptyPlaceholdersToggle.checked = settings.copyKeepEmptyPlaceholders;
    statsPositionSelect.value = settings.statsPosition || 'center';
    renderShortcuts();
  }

  /**
   * Show toast notification
   */
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2000);
  }

  /**
   * Initialize tab switching
   */
  function initTabs() {
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        document.querySelectorAll('.tab-content').forEach(content => {
          content.classList.remove('active');
        });

        const tabId = tab.dataset.tab + '-tab';
        document.getElementById(tabId).classList.add('active');
      });
    });
  }

  /**
   * Initialize event listeners
   */
  function initEvents() {
    // Column include header toggle
    columnIncludeHeaderToggle.addEventListener('change', () => {
      settings.columnIncludeHeader = columnIncludeHeaderToggle.checked;
      saveSettings();
    });

    // Copy keep empty placeholders toggle
    copyKeepEmptyPlaceholdersToggle.addEventListener('change', () => {
      settings.copyKeepEmptyPlaceholders = copyKeepEmptyPlaceholdersToggle.checked;
      saveSettings();
    });

    // Stats position select
    statsPositionSelect.addEventListener('change', () => {
      settings.statsPosition = statsPositionSelect.value;
      saveSettings();
    });

    // Reset button
    resetBtn.addEventListener('click', async () => {
      if (confirm(i18n.t('resetConfirm'))) {
        settings = JSON.parse(JSON.stringify(defaults));
        await saveSettings();
        updateUI();
        showToast(i18n.t('settingsReset'));
      }
    });

    // Close editing when clicking outside
    document.addEventListener('click', (e) => {
      if (editingShortcut && !e.target.closest('.shortcut-item.editing')) {
        const editingItem = document.querySelector('.shortcut-item.editing');
        if (editingItem) {
          cancelEditingShortcut(editingItem);
        }
      }
    });
  }

  /**
   * Initialize
   */
  async function init() {
    initI18n();
    await loadSettings();
    initTabs();
    initEvents();

    // Documentation link - open in new tab
    docLink.addEventListener('click', () => {
      chrome.tabs.create({ url: chrome.runtime.getURL('popup/docs.html') });
    });
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

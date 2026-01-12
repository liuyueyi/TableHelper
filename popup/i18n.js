/**
 * SuperTables - Internationalization Module
 * Supports: English, Chinese, Japanese
 */
const i18n = {
  // Translations
  messages: {
    en: {
      // Header
      title: 'SuperTables',
      subtitle: 'Table Selection Tool',

      // Tabs
      tabShortcuts: 'Shortcuts',
      tabSettings: 'Settings',

      // Shortcuts section
      sectionShortcuts: 'Keyboard Shortcuts',
      selectCell: 'Select Cell',
      selectColumn: 'Select Column',
      selectRow: 'Select Row',
      selectTable: 'Select Table',
      copySelection: 'Copy Selection',
      click: 'Click',
      pressKeys: 'Press keys...',
      save: 'Save',
      cancel: 'Cancel',
      edit: 'Edit',

      // Settings section
      sectionColumnSelection: 'Column Selection',
      includeHeader: 'Include Header Row',
      includeHeaderDesc: 'When selecting a column, include the header cells',

      sectionCopy: 'Copy Settings',
      keepEmptyPlaceholders: 'Keep Empty Placeholders',
      keepEmptyPlaceholdersDesc: 'When copying non-contiguous cells, keep empty placeholders for unselected cells',

      sectionStatsBar: 'Statistics Bar',
      statsPosition: 'Position',
      statsPositionDesc: 'Choose where to display the statistics bar',
      positionCenter: 'Bottom Center',
      positionLeft: 'Bottom Left',
      positionRight: 'Bottom Right',

      // Footer
      resetDefaults: 'Reset to Defaults',
      resetConfirm: 'Reset all settings to defaults?',

      // Toasts
      settingsSaved: 'Settings saved',
      settingsReset: 'Settings reset',
      saveFailed: 'Failed to save',
      copied: 'Copied!',
      shortcutSaved: 'Shortcut saved',
      pressModifier: 'Press modifier keys...',
      invalidShortcut: 'Invalid shortcut',
      shiftReserved: 'Shift is reserved for range selection',

      // Documentation
      usageDoc: 'Usage Guide',
      docTitle: 'Usage Guide',
      tableTool: 'Table Tool'
    },

    zh: {
      // Header
      title: 'SuperTables',
      subtitle: '表格选择工具',

      // Tabs
      tabShortcuts: '快捷键',
      tabSettings: '设置',

      // Shortcuts section
      sectionShortcuts: '键盘快捷键',
      selectCell: '选择单元格',
      selectColumn: '选择列',
      selectRow: '选择行',
      selectTable: '选择整个表格',
      copySelection: '复制选中',
      click: '点击',
      pressKeys: '请按快捷键...',
      save: '保存',
      cancel: '取消',
      edit: '编辑',

      // Settings section
      sectionColumnSelection: '列选择',
      includeHeader: '包含表头',
      includeHeaderDesc: '选择列时，同时选中表头单元格',

      sectionCopy: '复制设置',
      keepEmptyPlaceholders: '保留空白占位',
      keepEmptyPlaceholdersDesc: '复制非连续选区时，保留未选中单元格的空白占位',

      sectionStatsBar: '统计栏',
      statsPosition: '显示位置',
      statsPositionDesc: '选择统计栏的显示位置',
      positionCenter: '底部居中',
      positionLeft: '左下角',
      positionRight: '右下角',

      // Footer
      resetDefaults: '恢复默认设置',
      resetConfirm: '确定要恢复所有默认设置吗？',

      // Toasts
      settingsSaved: '设置已保存',
      settingsReset: '设置已重置',
      saveFailed: '保存失败',
      copied: '已复制！',
      shortcutSaved: '快捷键已保存',
      pressModifier: '请按修饰键...',
      invalidShortcut: '无效的快捷键',
      shiftReserved: 'Shift 键已被用于连续选择，不可设置',

      // Documentation
      usageDoc: '使用文档',
      docTitle: '使用文档',
      tableTool: '表格工具'
    },

    ja: {
      // Header
      title: 'SuperTables',
      subtitle: 'テーブル選択ツール',

      // Tabs
      tabShortcuts: 'ショートカット',
      tabSettings: '設定',

      // Shortcuts section
      sectionShortcuts: 'キーボードショートカット',
      selectCell: 'セルを選択',
      selectColumn: '列を選択',
      selectRow: '行を選択',
      selectTable: 'テーブル全体を選択',
      copySelection: '選択をコピー',
      click: 'クリック',
      pressKeys: 'キーを押してください...',
      save: '保存',
      cancel: 'キャンセル',
      edit: '編集',

      // Settings section
      sectionColumnSelection: '列選択',
      includeHeader: 'ヘッダーを含める',
      includeHeaderDesc: '列を選択する際、ヘッダーセルも含めます',

      sectionCopy: 'コピー設定',
      keepEmptyPlaceholders: '空白プレースホルダーを保持',
      keepEmptyPlaceholdersDesc: '非連続セルをコピーする際、未選択セルの空白を保持します',

      sectionStatsBar: '統計バー',
      statsPosition: '表示位置',
      statsPositionDesc: '統計バーの表示位置を選択',
      positionCenter: '下部中央',
      positionLeft: '左下',
      positionRight: '右下',

      // Footer
      resetDefaults: 'デフォルトに戻す',
      resetConfirm: 'すべての設定をデフォルトに戻しますか？',

      // Toasts
      settingsSaved: '設定を保存しました',
      settingsReset: '設定をリセットしました',
      saveFailed: '保存に失敗しました',
      copied: 'コピーしました！',
      shortcutSaved: 'ショートカットを保存しました',
      pressModifier: '修飾キーを押してください...',
      invalidShortcut: '無効なショートカット',
      shiftReserved: 'Shiftキーは範囲選択に予約されています',

      // Documentation
      usageDoc: '使用ガイド',
      docTitle: '使用ガイド',
      tableTool: 'テーブルツール'
    }
  },

  // Current locale
  currentLocale: 'en',

  /**
   * Detect system language
   */
  detectLanguage() {
    const lang = navigator.language || navigator.userLanguage || 'en';
    const shortLang = lang.split('-')[0].toLowerCase();

    if (this.messages[shortLang]) {
      return shortLang;
    }

    // Map zh-TW, zh-HK to zh
    if (lang.startsWith('zh')) {
      return 'zh';
    }

    return 'en';
  },

  /**
   * Initialize i18n
   */
  init() {
    this.currentLocale = this.detectLanguage();
    return this.currentLocale;
  },

  /**
   * Get translation
   * @param {string} key
   * @returns {string}
   */
  t(key) {
    const messages = this.messages[this.currentLocale] || this.messages.en;
    return messages[key] || this.messages.en[key] || key;
  },

  /**
   * Get current locale
   */
  getLocale() {
    return this.currentLocale;
  },

  /**
   * Set locale manually
   */
  setLocale(locale) {
    if (this.messages[locale]) {
      this.currentLocale = locale;
    }
  }
};

// Export for use
window.i18n = i18n;
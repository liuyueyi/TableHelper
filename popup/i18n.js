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
      selectAll: 'Select All',
      copySelection: 'Copy Selection',
      click: 'Click',
      doubleClick: 'Double-click',
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
      tableTool: 'Table Tool',

      // Table Tool Page
      basicOperation: 'Basic Operations',
      setOperation: 'Set Operations',
      sqlOperation: 'SQL Operations',
      inputTableData: 'Enter table data (each row represents one row of data, separated by tabs or spaces):',
      operationResult: 'Operation Result:',
      copyResult: 'Copy Result',
      exportResult: 'Export Result',
      cellTransform: 'Cell Transform',
      columnDedup: 'Column Deduplication',
      columnMerge: 'Column Merge',
      rowMerge: 'Row Merge',
      executeBasicOperation: 'Execute Basic Operation',
      inputTwoColumnsData: 'Enter two-column data (each row contains two columns for set operations):',
      none: 'None',
      intersection: 'Intersection',
      union: 'Union',
      differenceAB: 'Difference (A - B)',
      differenceBA: 'Difference (B - A)',
      executeSetOperation: 'Execute Set Operation',
      inputTableDataWithHeader: 'Enter table data (first row is header):',
      insertStatement: 'INSERT',
      selectStatement: 'SELECT',
      updateStatement: 'UPDATE',
      tableName: 'Table Name:',
      selectedColumnsCommaSeparated: 'Selected Columns (comma separated):',
      excludedColumnsCommaSeparated: 'Excluded Columns (comma separated):',
      queryConditionsCommaSeparated: 'Query Conditions (comma separated):',
      updateColumnsCommaSeparated: 'Update Columns (comma separated):',
      queryColumnsCommaSeparated: 'Query Columns (comma separated):',
      executeSqlOperation: 'Execute SQL Operation',
      basicInputPlaceholder: 'Example:\nName    Age    Department\nZhang    25      IT\nLi    30      Sales',
      cellTransformRulePlaceholder: 'Example: \'$\' means cells are wrapped in single quotes',
      colMergeTemplatePlaceholder: 'Example: ,',
      rowMergeSeparatorPlaceholder: 'Default is newline',
      setInputPlaceholder: 'Example:\nGroup A    Group B\nApple    Apple\nBanana    Orange\nOrange    Watermelon\nGrape    Banana',
      sqlInputPlaceholder: 'Example:\nname    age    department\nJohn    25     IT\nAlice   30     HR\nBob     35     Finance',
      tableNamePlaceholder: 'Please enter table name',
      includeColumnsPlaceholder: 'Example: id,name,age',
      excludeColumnsPlaceholder: 'Example: password,temp',
      selectConditionPlaceholder: 'Columns for query conditions, e.g. name,age',
      updateColumnsPlaceholder: 'Example: name,age',
      whereColumnsPlaceholder: 'Example: id,status',
      cellTransformHint: 'Transformation rule ($ indicates cell content)',
      colMergeHint: 'By default, use comma to merge cells in each row, escape characters supported',
      rowMergeHint: 'By default, use ; to concatenate row content, escape characters supported'
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
      selectAll: '全选',
      copySelection: '复制选中',
      click: '点击',
      doubleClick: '双击',
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
      tableTool: '表格工具',

      // Table Tool Page
      basicOperation: '基础操作',
      setOperation: '集合操作',
      sqlOperation: 'SQL操作',
      inputTableData: '输入表格数据（每行代表一行数据，使用制表符或空格分隔列）:',
      operationResult: '操作结果:',
      copyResult: '复制结果',
      exportResult: '导出结果',
      cellTransform: '单元格转换',
      columnDedup: '列去重',
      columnMerge: '列合并',
      rowMerge: '行合并',
      executeBasicOperation: '执行基础操作',
      inputTwoColumnsData: '输入两列数据（每行包含两列，用于集合操作）:',
      none: '无',
      intersection: '交集',
      union: '并集',
      differenceAB: '差集 (A - B)',
      differenceBA: '差集 (B - A)',
      executeSetOperation: '执行集合操作',
      inputTableDataWithHeader: '输入表格数据（第一行为表头）:',
      insertStatement: 'INSERT',
      selectStatement: 'SELECT',
      updateStatement: 'UPDATE',
      tableName: '表名:',
      selectedColumnsCommaSeparated: '选中列 (逗号分隔):',
      excludedColumnsCommaSeparated: '排除列 (逗号分隔):',
      queryConditionsCommaSeparated: '查询条件 (逗号分隔):',
      updateColumnsCommaSeparated: '更新列 (逗号分隔):',
      queryColumnsCommaSeparated: '查询列 (逗号分隔):',
      executeSqlOperation: '执行SQL操作',
      basicInputPlaceholder: '示例:\n姓名    年龄    部门\n张三    25      IT部\n李四    30      销售部',
      cellTransformRulePlaceholder: '例如: \'$\' 表示单元格使用单引号包裹',
      colMergeTemplatePlaceholder: '例如: ,',
      rowMergeSeparatorPlaceholder: '默认为换行符',
      setInputPlaceholder: '示例:\nA组    B组\n苹果    苹果\n香蕉    橙子\n橙子    西瓜\n葡萄    香蕉',
      sqlInputPlaceholder: '示例:\nname    age    department\nJohn    25     IT\nAlice   30     HR\nBob     35     Finance',
      tableNamePlaceholder: '请输入表名',
      includeColumnsPlaceholder: '例如: id,name,age',
      excludeColumnsPlaceholder: '例如: password,temp',
      selectConditionPlaceholder: '用于构建查询条件的列，如name,age',
      updateColumnsPlaceholder: '例如: name,age',
      whereColumnsPlaceholder: '例如: id,status',
      cellTransformHint: '转换规则 ($ 表示单元格内容)',
      colMergeHint: '默认使用英文逗号合并每一行的单元格，支持转义符',
      rowMergeHint: '默认使用 ; 拼接行内容，支持转义符'
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
      selectAll: 'すべて選択',
      copySelection: '選択をコピー',
      click: 'クリック',
      doubleClick: 'ダブルクリック',
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
      tableTool: 'テーブルツール',

      // Table Tool Page
      basicOperation: '基本操作',
      setOperation: '集合操作',
      sqlOperation: 'SQL操作',
      inputTableData: '表データを入力してください（各行は1行のデータを表し、タブまたはスペースで区切られています）:',
      operationResult: '操作結果:',
      copyResult: '結果をコピー',
      exportResult: '結果をエクスポート',
      cellTransform: 'セル変換',
      columnDedup: '列の重複排除',
      columnMerge: '列のマージ',
      rowMerge: '行のマージ',
      executeBasicOperation: '基本操作を実行',
      inputTwoColumnsData: '2列データを入力してください（各行には2列が含まれ、集合操作に使用されます）:',
      none: 'なし',
      intersection: '積集合',
      union: '和集合',
      differenceAB: '差集合 (A - B)',
      differenceBA: '差集合 (B - A)',
      executeSetOperation: '集合操作を実行',
      inputTableDataWithHeader: '表データを入力してください（1行目はヘッダーです）:',
      insertStatement: 'INSERT',
      selectStatement: 'SELECT',
      updateStatement: 'UPDATE',
      tableName: 'テーブル名:',
      selectedColumnsCommaSeparated: '選択された列（カンマ区切り）:',
      excludedColumnsCommaSeparated: '除外された列（カンマ区切り）:',
      queryConditionsCommaSeparated: 'クエリ条件（カンマ区切り）:',
      updateColumnsCommaSeparated: '更新列（カンマ区切り）:',
      queryColumnsCommaSeparated: 'クエリ列（カンマ区切り）:',
      executeSqlOperation: 'SQL操作を実行',
      basicInputPlaceholder: '例:\n名前    年齢    部署\n田中    25      IT部\n佐藤    30      営業部\n山田    35      人事部',
      cellTransformRulePlaceholder: '例: \'$\' はセルがシングルクォートで囲まれることを意味します',
      colMergeTemplatePlaceholder: '例: ,',
      rowMergeSeparatorPlaceholder: 'デフォルトは改行です',
      setInputPlaceholder: '例:\nグループA    グループB\nリンゴ    リンゴ\nバナナ    オレンジ\nオレンジ    スイカ\nぶどう    バナナ',
      sqlInputPlaceholder: '例:\nname    age    department\nJohn    25     IT\nAlice   30     HR\nBob     35     Finance',
      tableNamePlaceholder: 'テーブル名を入力してください',
      includeColumnsPlaceholder: '例: id,name,age',
      excludeColumnsPlaceholder: '例: password,temp',
      selectConditionPlaceholder: 'クエリ条件に使用するカラム（例: name,age）',
      updateColumnsPlaceholder: '例: name,age',
      whereColumnsPlaceholder: '例: id,status',
      cellTransformHint: '変換ルール（$ はセルの内容を示します）',
      colMergeHint: 'デフォルトではコンマを使用して各行のセルを結合し、エスケープ文字がサポートされています',
      rowMergeHint: 'デフォルトでは ; を使用して行の内容を連結し、エスケープ文字がサポートされています'
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
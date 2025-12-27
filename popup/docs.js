/**
 * SuperTables - Documentation Page Script
 * Multi-language support: English, Chinese, Japanese
 */
(function() {
  'use strict';

  // Detect platform - use multiple methods for reliability
  var isMac = false;
  try {
    isMac = navigator.userAgentData
      ? navigator.userAgentData.platform === 'macOS'
      : /Mac|iPod|iPhone|iPad/.test(navigator.platform) || /Mac/.test(navigator.userAgent);
  } catch (e) {
    isMac = /Mac/.test(navigator.userAgent);
  }
  var modKey = isMac ? '⌘' : 'Ctrl';

  // Detect language
  function detectLanguage() {
    var lang = '';
    try {
      lang = navigator.language || navigator.userLanguage || 'en';
    } catch (e) {
      lang = 'en';
    }
    lang = lang.toLowerCase();

    if (lang.indexOf('zh') === 0) {
      return 'zh';
    }
    if (lang.indexOf('ja') === 0) {
      return 'ja';
    }
    return 'en';
  }

  var currentLang = detectLanguage();

  // Feature icons
  var featureIcons = [
    '<svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-5-5 1.41-1.41L11 13.17l6.59-6.59L19 8l-9 9z"/></svg>',
    '<svg viewBox="0 0 24 24"><path d="M10 10.02h5V21h-5zM17 21h3c1.1 0 2-.9 2-2v-9h-5v11zm3-18H5c-1.1 0-2 .9-2 2v3h19V5c0-1.1-.9-2-2-2zM3 19c0 1.1.9 2 2 2h3V10H3v9z"/></svg>',
    '<svg viewBox="0 0 24 24"><path d="M3 5v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2zm16 14H5v-3h14v3zm0-5H5v-3h14v3zm0-5H5V5h14v4z"/></svg>',
    '<svg viewBox="0 0 24 24"><path d="M7 5h2V3H7v2zm0 8h2v-2H7v2zm0 8h2v-2H7v2zm4-4h2v-2h-2v2zm0 4h2v-2h-2v2zm-8 0h2v-2H3v2zm0-4h2v-2H3v2zm0-4h2v-2H3v2zm0-4h2V7H3v2zm0-4h2V3H3v2zm8 8h2v-2h-2v2zm8 4h2v-2h-2v2zm0-4h2v-2h-2v2zm0 8h2v-2h-2v2zm0-12h2V7h-2v2zm-8 0h2V7h-2v2zm8-6v2h2V3h-2zm-8 2h2V3h-2v2zm4 16h2v-2h-2v2zm0-8h2v-2h-2v2zm0-8h2V3h-2v2z"/></svg>'
  ];

  // Build kbd HTML
  function kbd(text, isSecondary) {
    return '<span class="kbd' + (isSecondary ? ' secondary' : '') + '">' + text + '</span>';
  }

  // Get translations
  function getTranslations() {
    var click_zh = '点击';
    var click_ja = 'クリック';
    var click_en = 'Click';

    return {
      en: {
        docTitle: 'SuperTables Documentation',
        docSubtitle: 'Select table cells like Excel - select, copy, and analyze table data',
        sectionShortcuts: 'Keyboard Shortcuts',
        thAction: 'Action',
        thShortcut: 'Shortcut',
        thDesc: 'Description',
        sectionMultiselect: 'Multi-Select & Range Selection',
        sectionStats: 'Statistics Panel',
        sectionPractices: 'Best Practices',
        footerTip: 'Press',
        highlightTip: '<strong>Tip:</strong> Shift range selection works with cell, row, and column selection. For example: Alt+Click to select the first column, then Alt+Shift+Click to select the last column to select multiple consecutive columns.',
        statsDesc: 'After selecting cells, a statistics panel automatically appears at the bottom. The panel has <strong>two modes</strong> that switch automatically based on content:',
        statsMode1Title: 'Numeric Mode',
        statsMode1Desc: 'For numeric data, shows Sum, Average, Min, Max, etc.',
        statsMode2Title: 'Text Mode (Top 5)',
        statsMode2Desc: 'For text data, shows the 5 most frequent values with their counts',
        statsToggle: 'Click the toggle button on the right to manually switch between modes. Click any stat value to copy it.',
        statsNote: '* When the entire table is selected, a "Download Excel" button appears for one-click export',
        shortcuts: [
          { action: 'Select Cell', keys: [[modKey], [click_en, true]], desc: 'Click to select a single cell' },
          { action: 'Select Column', keys: [['Alt'], [click_en, true]], desc: 'Select an entire column' },
          { action: 'Select Row', keys: [[modKey], ['Alt'], [click_en, true]], desc: 'Select an entire row' },
          { action: 'Select Table', keys: [[modKey], ['"Select All"', true]], desc: 'Hold and click the button at top-right' },
          { action: 'Copy Selection', keys: [[modKey], ['C']], desc: 'Copy to clipboard, paste into Excel' },
          { action: 'Clear Selection', keys: [['Esc']], desc: 'Clear all selections' }
        ],
        features: [
          { title: 'Multi-select Cells', desc: 'Hold ' + kbd(modKey) + ' and click different cells to select multiple cells' },
          { title: 'Multi-select Columns', desc: 'Hold ' + kbd('Alt') + ' and click different columns to select multiple columns' },
          { title: 'Multi-select Rows', desc: 'Hold ' + kbd(modKey) + kbd('Alt') + ' and click different rows' },
          { title: 'Range Selection', desc: 'Click start cell, then hold ' + kbd('Shift') + ' and click end cell to select a rectangle' }
        ],
        stats: [
          { label: 'Numeric', value: '10' },
          { label: 'Sum', value: '1,234.56' },
          { label: 'Avg', value: '123.46' },
          { label: 'Min', value: '10.00' },
          { label: 'Max', value: '500.00' }
        ],
        textStats: [
          { rank: 1, text: 'Completed', count: 5 },
          { rank: 2, text: 'Pending', count: 3 },
          { rank: 3, text: 'In Progress', count: 2 }
        ],
        practices: [
          {
            emoji: '📊',
            title: 'Quick Column Analysis',
            desc: 'When you need to quickly see statistics for a column (e.g., sales, inventory):',
            steps: [
              'Hold <strong>Alt</strong> key',
              'Click any cell in the target column',
              'Statistics panel instantly shows count, sum, average, etc.',
              'Click any stat value to copy it'
            ]
          },
          {
            emoji: '📋',
            title: 'Copy Continuous Range',
            desc: 'When you need to copy a rectangular region of data:',
            steps: [
              'Hold <strong>' + modKey + '</strong> and click the top-left starting cell',
              'Hold <strong>' + modKey + ' + Shift</strong> and click the bottom-right ending cell',
              'All cells in the rectangle are selected and highlighted',
              'Press <strong>' + modKey + ' + C</strong> to copy, paste directly into Excel'
            ]
          },
          {
            emoji: '📥',
            title: 'Export Entire Table to Excel',
            desc: 'When you need to export a complete table as an Excel file:',
            steps: [
              'Hold <strong>' + modKey + '</strong> key, "Select All" button appears at top-right',
              'Click the "Select All" button to select the entire table',
              '"Download Excel" button appears in the statistics panel',
              'Click download to get a .xlsx file'
            ]
          },
          {
            emoji: '🔍',
            title: 'Compare Non-consecutive Rows',
            desc: 'When you need to compare scattered rows of data:',
            steps: [
              'Hold <strong>' + modKey + ' + Alt</strong> and click the first row',
              'Continue holding <strong>' + modKey + ' + Alt</strong> and click other rows',
              'Multiple rows are highlighted, stats show aggregate data',
              'Quickly compare different products or time periods'
            ]
          }
        ]
      },
      zh: {
        docTitle: 'SuperTables 使用文档',
        docSubtitle: '像 Excel 一样选择网页表格 - 选择、复制、分析表格数据',
        sectionShortcuts: '快捷键操作',
        thAction: '操作',
        thShortcut: '快捷键',
        thDesc: '说明',
        sectionMultiselect: '多选与范围选择',
        sectionStats: '统计面板',
        sectionPractices: '最佳实践案例',
        footerTip: '按',
        highlightTip: '<strong>提示：</strong>Shift 范围选择可以与单元格、行、列选择组合使用。例如：Alt+点击选择第一列，然后 Alt+Shift+点击选择最后一列，即可选中连续多列。',
        statsDesc: '选中单元格后，页面底部会自动显示统计面板。面板支持<strong>两种模式</strong>，根据数据内容自动切换：',
        statsMode1Title: '数字模式',
        statsMode1Desc: '数字数据时显示求和、平均值、最大最小值等',
        statsMode2Title: '文本模式 (Top 5)',
        statsMode2Desc: '文本数据时显示出现频率最高的 5 个值及其次数',
        statsToggle: '点击右侧切换按钮可手动切换模式。点击任意统计值可复制。',
        statsNote: '* 选中整个表格时，统计面板会显示「下载 Excel」按钮，可一键导出表格数据',
        shortcuts: [
          { action: '选择单元格', keys: [[modKey], [click_zh, true]], desc: '单击选中一个单元格' },
          { action: '选择列', keys: [['Alt'], [click_zh, true]], desc: '选中整列数据' },
          { action: '选择行', keys: [[modKey], ['Alt'], [click_zh, true]], desc: '选中整行数据' },
          { action: '选择整表', keys: [[modKey], ['「全选」按钮', true]], desc: '按住后点击表格右上角按钮' },
          { action: '复制选中', keys: [[modKey], ['C']], desc: '复制到剪贴板，可粘贴到 Excel' },
          { action: '取消选择', keys: [['Esc']], desc: '清除所有选中状态' }
        ],
        features: [
          { title: '多选单元格', desc: '按住 ' + kbd(modKey) + ' 连续点击不同单元格，可同时选中多个单元格' },
          { title: '多选列', desc: '按住 ' + kbd('Alt') + ' 连续点击不同列，可同时选中多列数据' },
          { title: '多选行', desc: '按住 ' + kbd(modKey) + kbd('Alt') + ' 连续点击不同行' },
          { title: '范围选择', desc: '先点击起始单元格，再按住 ' + kbd('Shift') + ' 点击结束单元格，选中矩形区域' }
        ],
        stats: [
          { label: '数值', value: '10' },
          { label: '求和', value: '1,234.56' },
          { label: '平均', value: '123.46' },
          { label: '最小', value: '10.00' },
          { label: '最大', value: '500.00' }
        ],
        textStats: [
          { rank: 1, text: '已完成', count: 5 },
          { rank: 2, text: '待处理', count: 3 },
          { rank: 3, text: '进行中', count: 2 }
        ],
        practices: [
          {
            emoji: '📊',
            title: '快速分析某列数据',
            desc: '当你需要快速了解某一列数据的统计信息（如销售额、库存数量）时：',
            steps: [
              '按住 <strong>Alt</strong> 键',
              '点击目标列的任意单元格',
              '底部统计面板立即显示该列的计数、求和、平均值等',
              '点击统计数值即可复制，粘贴到报表中'
            ]
          },
          {
            emoji: '📋',
            title: '批量复制连续区域',
            desc: '需要复制表格中某个矩形区域的数据时：',
            steps: [
              '按住 <strong>' + modKey + '</strong> 点击左上角起始单元格',
              '按住 <strong>' + modKey + ' + Shift</strong> 点击右下角结束单元格',
              '矩形区域内所有单元格被选中并高亮',
              '按 <strong>' + modKey + ' + C</strong> 复制，可直接粘贴到 Excel'
            ]
          },
          {
            emoji: '📥',
            title: '导出整个表格到 Excel',
            desc: '需要将网页表格完整导出为 Excel 文件时：',
            steps: [
              '按住 <strong>' + modKey + '</strong> 键，表格右上角出现「全选」按钮',
              '点击「全选」按钮，整个表格被选中',
              '统计面板出现「下载 Excel」按钮',
              '点击下载，获得 .xlsx 格式文件'
            ]
          },
          {
            emoji: '🔍',
            title: '对比不连续的多行数据',
            desc: '需要对比表格中分散的几行数据时：',
            steps: [
              '按住 <strong>' + modKey + ' + Alt</strong> 点击第一行',
              '继续按住 <strong>' + modKey + ' + Alt</strong> 点击其他要对比的行',
              '多行同时高亮，统计面板显示这些行的汇总数据',
              '快速对比不同产品、不同时期的数据'
            ]
          }
        ]
      },
      ja: {
        docTitle: 'SuperTables 使用ガイド',
        docSubtitle: 'Excelのようにテーブルセルを選択 - 選択、コピー、データ分析',
        sectionShortcuts: 'キーボードショートカット',
        thAction: '操作',
        thShortcut: 'ショートカット',
        thDesc: '説明',
        sectionMultiselect: '複数選択と範囲選択',
        sectionStats: '統計パネル',
        sectionPractices: 'ベストプラクティス',
        footerTip: '押す',
        highlightTip: '<strong>ヒント：</strong>Shift範囲選択はセル、行、列の選択と組み合わせて使用できます。例：Alt+クリックで最初の列を選択し、Alt+Shift+クリックで最後の列を選択すると、連続した複数の列を選択できます。',
        statsDesc: 'セルを選択すると、ページ下部に統計パネルが自動的に表示されます。パネルは<strong>2つのモード</strong>があり、データ内容に応じて自動的に切り替わります：',
        statsMode1Title: '数値モード',
        statsMode1Desc: '数値データの場合、合計、平均、最大・最小値などを表示',
        statsMode2Title: 'テキストモード (Top 5)',
        statsMode2Desc: 'テキストデータの場合、出現頻度の高い上位5件とその回数を表示',
        statsToggle: '右側の切替ボタンで手動でモードを切り替えられます。統計値をクリックするとコピーできます。',
        statsNote: '* テーブル全体を選択すると、「Excelダウンロード」ボタンが表示され、ワンクリックでエクスポートできます',
        shortcuts: [
          { action: 'セル選択', keys: [[modKey], [click_ja, true]], desc: 'クリックで1つのセルを選択' },
          { action: '列選択', keys: [['Alt'], [click_ja, true]], desc: '列全体を選択' },
          { action: '行選択', keys: [[modKey], ['Alt'], [click_ja, true]], desc: '行全体を選択' },
          { action: 'テーブル全選択', keys: [[modKey], ['「全選択」', true]], desc: '押しながら右上のボタンをクリック' },
          { action: 'コピー', keys: [[modKey], ['C']], desc: 'クリップボードにコピー、Excelに貼り付け可能' },
          { action: '選択解除', keys: [['Esc']], desc: 'すべての選択を解除' }
        ],
        features: [
          { title: '複数セル選択', desc: kbd(modKey) + ' を押しながら異なるセルをクリックして、複数のセルを選択' },
          { title: '複数列選択', desc: kbd('Alt') + ' を押しながら異なる列をクリックして、複数の列を選択' },
          { title: '複数行選択', desc: kbd(modKey) + kbd('Alt') + ' を押しながら異なる行をクリック' },
          { title: '範囲選択', desc: '開始セルをクリックし、' + kbd('Shift') + ' を押しながら終了セルをクリックで矩形範囲を選択' }
        ],
        stats: [
          { label: '数値', value: '10' },
          { label: '合計', value: '1,234.56' },
          { label: '平均', value: '123.46' },
          { label: '最小', value: '10.00' },
          { label: '最大', value: '500.00' }
        ],
        textStats: [
          { rank: 1, text: '完了', count: 5 },
          { rank: 2, text: '保留中', count: 3 },
          { rank: 3, text: '進行中', count: 2 }
        ],
        practices: [
          {
            emoji: '📊',
            title: '列データの素早い分析',
            desc: '列の統計情報（売上、在庫数など）をすばやく確認したい場合：',
            steps: [
              '<strong>Alt</strong> キーを押しながら',
              '対象列の任意のセルをクリック',
              '下部の統計パネルにカウント、合計、平均などが即座に表示',
              '統計値をクリックしてコピー、レポートに貼り付け'
            ]
          },
          {
            emoji: '📋',
            title: '連続範囲の一括コピー',
            desc: 'テーブルの矩形範囲のデータをコピーする場合：',
            steps: [
              '<strong>' + modKey + '</strong> を押しながら左上の開始セルをクリック',
              '<strong>' + modKey + ' + Shift</strong> を押しながら右下の終了セルをクリック',
              '矩形範囲内のすべてのセルが選択・ハイライト',
              '<strong>' + modKey + ' + C</strong> でコピー、Excelに直接貼り付け可能'
            ]
          },
          {
            emoji: '📥',
            title: 'テーブル全体をExcelにエクスポート',
            desc: 'Webテーブルを完全なExcelファイルとしてエクスポートする場合：',
            steps: [
              '<strong>' + modKey + '</strong> キーを押すと、テーブル右上に「全選択」ボタンが表示',
              '「全選択」ボタンをクリックしてテーブル全体を選択',
              '統計パネルに「Excelダウンロード」ボタンが表示',
              'クリックしてダウンロード、.xlsx形式ファイルを取得'
            ]
          },
          {
            emoji: '🔍',
            title: '離れた複数行のデータを比較',
            desc: 'テーブル内の離れた行のデータを比較する場合：',
            steps: [
              '<strong>' + modKey + ' + Alt</strong> を押しながら最初の行をクリック',
              '<strong>' + modKey + ' + Alt</strong> を押し続けて他の行をクリック',
              '複数行が同時にハイライト、統計パネルに集計データを表示',
              '異なる製品や期間のデータをすばやく比較'
            ]
          }
        ]
      }
    };
  }

  // Render page
  function render() {
    var translations = getTranslations();
    var t = translations[currentLang] || translations.en;

    // Update HTML lang
    document.documentElement.lang = currentLang === 'zh' ? 'zh-CN' : currentLang === 'ja' ? 'ja' : 'en';

    // Update title
    document.title = t.docTitle;

    // Header
    document.getElementById('doc-title').textContent = t.docTitle;
    document.getElementById('doc-subtitle').textContent = t.docSubtitle;

    // Section titles
    document.getElementById('section-shortcuts').textContent = t.sectionShortcuts;
    document.getElementById('section-multiselect').textContent = t.sectionMultiselect;
    document.getElementById('section-stats').textContent = t.sectionStats;
    document.getElementById('section-practices').textContent = t.sectionPractices;

    // Table headers
    document.getElementById('th-action').textContent = t.thAction;
    document.getElementById('th-shortcut').textContent = t.thShortcut;
    document.getElementById('th-desc').textContent = t.thDesc;

    // Shortcuts table
    var shortcutsHtml = '';
    for (var i = 0; i < t.shortcuts.length; i++) {
      var s = t.shortcuts[i];
      var keysHtml = '';
      for (var j = 0; j < s.keys.length; j++) {
        if (j > 0) keysHtml += '<span class="plus">+</span>';
        var keyItem = s.keys[j];
        var keyText = keyItem[0];
        var isSecondary = keyItem[1] || false;
        keysHtml += kbd(keyText, isSecondary);
      }
      shortcutsHtml += '<tr>' +
        '<td class="action-name">' + s.action + '</td>' +
        '<td><span class="key-combo">' + keysHtml + '</span></td>' +
        '<td style="color: #888; font-size: 13px;">' + s.desc + '</td>' +
        '</tr>';
    }
    document.getElementById('shortcuts-body').innerHTML = shortcutsHtml;

    // Feature grid
    var featuresHtml = '';
    for (var i = 0; i < t.features.length; i++) {
      var f = t.features[i];
      featuresHtml += '<div class="feature-card">' +
        '<h4>' + featureIcons[i] + f.title + '</h4>' +
        '<p>' + f.desc + '</p>' +
        '</div>';
    }
    document.getElementById('feature-grid').innerHTML = featuresHtml;

    // Highlight tip
    document.getElementById('highlight-tip').innerHTML = t.highlightTip;

    // Stats section
    document.getElementById('stats-desc').innerHTML = t.statsDesc;
    document.getElementById('stats-note').textContent = t.statsNote;

    // Stats modes cards
    var modesHtml = '<div class="stats-mode-card">' +
      '<h4><svg viewBox="0 0 24 24"><path d="M5 9.2h3V19H5V9.2zM10.6 5h2.8v14h-2.8V5zm5.6 8H19v6h-2.8v-6z"/></svg>' + t.statsMode1Title + '</h4>' +
      '<p>' + t.statsMode1Desc + '</p>' +
      '</div>' +
      '<div class="stats-mode-card text-mode">' +
      '<h4><svg viewBox="0 0 24 24"><path d="M3 18h12v-2H3v2zM3 6v2h18V6H3zm0 7h18v-2H3v2z"/></svg>' + t.statsMode2Title + '</h4>' +
      '<p>' + t.statsMode2Desc + '</p>' +
      '</div>';
    document.getElementById('stats-modes').innerHTML = modesHtml;

    // Preview labels
    document.getElementById('stats-preview-label-numeric').textContent = t.statsMode1Title;
    document.getElementById('stats-preview-label-text').textContent = t.statsMode2Title;

    // Numeric stats preview
    var statsHtml = '';
    for (var i = 0; i < t.stats.length; i++) {
      var stat = t.stats[i];
      statsHtml += '<div class="stat-item clickable">' +
        '<div class="stat-label">' + stat.label + '</div>' +
        '<div class="stat-value">' + stat.value + '</div>' +
        '</div>';
    }
    document.getElementById('stats-preview').innerHTML = statsHtml;

    // Text stats preview
    var textStatsHtml = '';
    for (var i = 0; i < t.textStats.length; i++) {
      var ts = t.textStats[i];
      textStatsHtml += '<div class="text-stat-item">' +
        '<span class="text-stat-rank">#' + ts.rank + '</span>' +
        '<span class="text-stat-text">' + ts.text + '</span>' +
        '<span class="text-stat-count">x' + ts.count + '</span>' +
        '</div>';
    }
    document.getElementById('stats-preview-text').innerHTML = textStatsHtml;

    // Toggle info
    document.getElementById('stats-toggle-text').textContent = t.statsToggle;

    // Best practices
    var practicesHtml = '';
    for (var i = 0; i < t.practices.length; i++) {
      var p = t.practices[i];
      var stepsHtml = '';
      for (var j = 0; j < p.steps.length; j++) {
        stepsHtml += '<li>' + p.steps[j] + '</li>';
      }
      practicesHtml += '<div class="practice-item">' +
        '<div class="practice-number">0' + (i + 1) + '</div>' +
        '<h4><span class="emoji">' + p.emoji + '</span>' + p.title + '</h4>' +
        '<p>' + p.desc + '</p>' +
        '<ol class="steps">' + stepsHtml + '</ol>' +
        '</div>';
    }
    document.getElementById('practice-list').innerHTML = practicesHtml;

    // Footer
    document.getElementById('footer-tip').textContent = t.footerTip;
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      try {
        render();
      } catch (e) {
        console.error('SuperTables docs render error:', e);
      }
    });
  } else {
    try {
      render();
    } catch (e) {
      console.error('SuperTables docs render error:', e);
    }
  }
})();

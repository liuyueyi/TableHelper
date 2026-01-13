var featureIcons = ['🖱️', '🔢', '📋', '↔️', '🎨', '🔍'];

// Get current language
var currentLang = 'en';
var modKey = navigator.userAgent.indexOf('Mac OS X') !== -1 ? '⌘' : 'Ctrl';
var click_ja = 'クリック';

function getTranslations() {
  return {
    en: {
      docTitle: 'TableHelper Usage Guide',
      docSubtitle: 'Select table cells like Excel - Select, Copy, Analyze Data',
      sectionShortcuts: 'Keyboard Shortcuts',
      thAction: 'Action',
      thShortcut: 'Shortcut',
      thDesc: 'Description',
      sectionMultiselect: 'Multi-Select & Range Selection',
      sectionStats: 'Statistics Panel',
      sectionPractices: 'Best Practices',
      sectionAdvanced: 'Advanced Features',
      footerTip: 'Press',
      highlightTip: '<strong>Tip:</strong> Shift range selection can be combined with cell, row, and column selection. For example: Alt+click to select the first column, then Alt+Shift+click to select the last column, selecting multiple consecutive columns.',
      statsDesc: 'When you select cells, a statistics panel automatically appears at the bottom of the page. The panel has <strong>2 modes</strong> and automatically switches based on the data content:',
      statsMode1Title: 'Numeric Mode',
      statsMode1Desc: 'For numeric data, displays sum, average, max/min values, etc.',
      statsMode2Title: 'Text Mode (Top 5)',
      statsMode2Desc: 'For text data, displays the top 5 most frequent items and their counts',
      statsToggle: 'You can manually switch modes using the toggle button on the right. Click on any statistic value to copy it.',
      statsNote: '* When you select the entire table, an "Download Excel" button appears, allowing you to export with one click',
      shortcuts: [
        { action: 'Select Cell', keys: [[modKey], ['click', true]], desc: 'Click to select a single cell' },
        { action: 'Select Column', keys: [['Alt'], ['click', true]], desc: 'Select the entire column' },
        { action: 'Select Row', keys: [[modKey], ['Alt'], ['click', true]], desc: 'Select the entire row' },
        { action: 'Select Entire Table', keys: [[modKey], ['double click']], desc: 'Double-click the first cell of the table' },
        { action: 'Copy', keys: [[modKey], ['C']], desc: 'Copy to clipboard, pasteable in Excel' },
        { action: 'Extend Selection', keys: [[modKey], ['Shift'], ['↑↓←→', true]], desc: 'Extend selection to the edge of the column/row' },
        { action: 'Clear Selection', keys: [['Esc']], desc: 'Clear all selections' }
      ],
      features: [
        { title: 'Multi-cell Selection', desc: 'Select multiple cells by pressing ' + kbd(modKey) + ' while clicking different cells' },
        { title: 'Multi-column Selection', desc: 'Select multiple columns by pressing ' + kbd('Alt') + ' while clicking different columns' },
        { title: 'Multi-row Selection', desc: 'Select multiple rows by pressing ' + kbd(modKey) + kbd('Alt') + ' while clicking different rows' },
        { title: 'Range Selection', desc: 'Select rectangular ranges by clicking a start cell, then holding ' + kbd('Shift') + ' while clicking an end cell' },
        { title: 'Select Entire Table', desc: 'Double-click the first cell of a table to select all cells' },
        { title: 'Quick Extend Selection', desc: 'Use ' + kbd(modKey) + kbd('Shift') + kbd('↑↓←→') + ' to quickly extend selection to the edge of a column/row' },
        { title: 'Keep Empty Placeholders', desc: 'Enable "Keep Empty Placeholders" in settings to maintain gaps when copying non-contiguous cells' }
      ],
      stats: [
        { label: 'Count', value: '10' },
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
          emoji: '🎨',
          title: 'Theme Selection',
          desc: 'Change the appearance of the table selection tool to match your preferences:',
          steps: [
            'Go to the <strong>Settings</strong> page via the extension popup',
            'Choose from 4 available themes: Excel, Fresh Green, Dark, Metallic',
            'Select your preferred theme and click <strong>Save</strong>',
            'Changes are applied immediately to all table selections'
          ]
        },
        {
          emoji: '📊',
          title: 'Quick Column Analysis',
          desc: 'When you need to quickly view statistics for a column (e.g., sales figures, inventory):',
          steps: [
            'Hold down the <strong>Alt</strong> key',
            'Click any cell in the target column',
            'The stats panel immediately shows count, sum, average, etc.',
            'Click any statistic value to copy, paste into reports'
          ]
        },
        {
          emoji: '📋',
          title: 'Copy Contiguous Region',
          desc: 'When you need to copy rectangular data regions:',
          steps: [
            'Hold <strong>' + modKey + '</strong> and click the top-left starting cell',
            'Hold <strong>' + modKey + ' + Shift</strong> and click the bottom-right ending cell',
            'All cells in the rectangular region are selected and highlighted',
            'Press <strong>' + modKey + ' + C</strong> to copy, paste directly into Excel'
          ]
        },
        {
          emoji: '📥',
          title: 'Export Entire Table to Excel',
          desc: 'When you need to export the complete table as an Excel file:',
          steps: [
            'Hold down the <strong>' + modKey + '</strong> key, and an "Select All" button appears in the top right',
            'Click the "Select All" button, the entire table is selected',
            'The "Download Excel" button appears in the stats panel',
            'Click to download the .xlsx file'
          ]
        },
        {
          emoji: '🔍',
          title: 'Compare Disparate Rows',
          desc: 'When you need to compare data from scattered rows in a table:',
          steps: [
            'Hold <strong>' + modKey + ' + Alt</strong> and click the first row',
            'Continue holding <strong>' + modKey + ' + Alt</strong> and click other rows',
            'Multiple rows are highlighted simultaneously, stats panel shows aggregate data',
            'Quickly compare different products or time periods'
          ]
        },
        {
          emoji: '⚡',
          title: 'Quick Extend Selection',
          desc: 'When you need to quickly select from the current cell to the edge of the row/column:',
          steps: [
            'First select a starting cell',
            'Press <strong>' + modKey + ' + Shift + ↓</strong> to extend to the bottom of the column',
            'Or press <strong>' + modKey + ' + Shift + →</strong> to extend to the end of the row',
            'Quickly select entire columns or rows from any starting point'
          ]
        },
        {
          emoji: '⚙️',
          title: 'Side Drawer Panel',
          desc: 'Access advanced table operations through the side drawer:',
          steps: [
            'Click the <strong>Advanced</strong> button (three dots icon) on the stats panel',
            'The side drawer opens, containing multiple operation panels: Table Info, Basic Operations, Set Operations, SQL Operations',
            'Use <strong>Basic Operations</strong> to transform, merge, or deduplicate data',
            'Use <strong>Set Operations</strong> for intersection, union, and difference calculations',
            'Use <strong>SQL Operations</strong> to generate INSERT, SELECT, or UPDATE statements'
          ]
        },
        {
          emoji: '📝',
          title: 'Advanced Editing Functions',
          desc: 'Perform advanced transformations on selected table data:',
          steps: [
            'Open the side drawer using the <strong>Advanced</strong> button',
            'Use <strong>Cell Transform</strong> to apply formatting rules to cells (e.g., wrap in quotes)',
            'Use <strong>Column Deduplication</strong> to remove duplicate rows',
            'Use <strong>Column Merge</strong> to join values from each column with a delimiter',
            'Use <strong>Row Merge</strong> to concatenate row content with a delimiter'
          ]
        },
        {
          emoji: '🔄',
          title: 'Set Operations',
          desc: 'Perform mathematical set operations on table data:',
          steps: [
            'Select <strong>exactly two columns</strong> of data for set operations',
            'Open the side drawer and go to the <strong>Set Operations</strong> panel',
            'Select operation: <strong>Intersection</strong> (common elements), <strong>Union</strong> (all unique elements), <strong>Difference</strong> (elements in A but not in B)',
            'Results appear in the result display panel'
          ]
        },
      ],
      advancedFeatures: {
        sectionTitle: 'Advanced Features',
        features: [
          {
            key: 'theme-selection',
            title: 'Theme Selection',
            desc: 'Choose from multiple themes to customize the appearance of the table helper. Switch between light, dark, or system theme based on your preference and working environment.',
            captions: [
              'Mulit Theme',
            ]
          },
          {
            key: 'side-drawer',
            title: 'Side Drawer Panel',
            desc: 'Access additional tools and information through the collapsible side drawer. View detailed table statistics, export options, and advanced settings without cluttering the main interface.',
            captions: [
              'Drawer Open',
              'Drawer Open',
              'Drawer Open'
            ]
          },
          {
            key: 'advanced-editing',
            title: 'Advanced Editing',
            desc: 'Perform advanced editing operations on table data including batch updates, conditional formatting, and formula calculations that mirror spreadsheet functionality.',
            captions: [
              'Cell Operate',
              'Column Operate',
              'Row Operate'
            ]
          },
          {
            key: 'set-operations',
            title: 'Set Operations',
            desc: 'Combine data from multiple tables using set operations like union, intersection, and difference. Merge, join, or compare datasets with simple operations.',
            captions: [
              'Union Operation',
            ]
          },
          {
            key: 'sql-generation',
            title: 'SQL Generation',
            desc: 'Automatically generate SQL queries from your table selections and operations. Export data with corresponding SQL statements for database integration.',
            captions: [
              'Insert Sql',
              'Select Sql',
              'Update SQL'
            ]
          }
        ]
      }
    },
    zh: {
      docTitle: 'TableHelper 使用指南',
      docSubtitle: '像Excel一样选择表格单元格 - 选择、复制、数据分析',
      sectionShortcuts: '键盘快捷键',
      thAction: '操作',
      thShortcut: '快捷键',
      thDesc: '说明',
      sectionMultiselect: '多选与范围选择',
      sectionStats: '统计面板',
      sectionPractices: '最佳实践案例',
      sectionAdvanced: '高级特性',
      footerTip: '按下',
      highlightTip: '<strong>提示：</strong>Shift范围选择可以与单元格、行、列选择组合使用。例如：Alt+点击选择第一列，然后Alt+Shift+点击选择最后一列，即可选择多个连续列。',
      statsDesc: '当您选择单元格时，统计面板会自动出现在页面底部。面板有<strong>2种模式</strong>，并根据数据内容自动切换：',
      statsMode1Title: '数值模式',
      statsMode1Desc: '对于数值数据，显示总和、平均值、最大/最小值等',
      statsMode2Title: '文本模式 (前5名)',
      statsMode2Desc: '对于文本数据，显示出现频率最高的前5项及其数量',
      statsToggle: '您可以使用右侧的切换按钮手动切换模式。点击任何统计数据值即可复制。',
      statsNote: '* 当您选择整个表格时，会出现"下载Excel"按钮，允许您一键导出',
      shortcuts: [
        { action: '选择单元格', keys: [[modKey], ['click', true]], desc: '点击选择单个单元格' },
        { action: '选择列', keys: [['Alt'], ['click', true]], desc: '选择整列' },
        { action: '选择行', keys: [[modKey], ['Alt'], ['click', true]], desc: '选择整行' },
        { action: '选择整个表格', keys: [[modKey], ['double click']], desc: '双击表格的第一个单元格' },
        { action: '复制', keys: [[modKey], ['C']], desc: '复制到剪贴板，可在Excel中粘贴' },
        { action: '扩展选择', keys: [[modKey], ['Shift'], ['↑↓←→', true]], desc: '将选择扩展到列/行的边缘' },
        { action: '清除选择', keys: [['Esc']], desc: '清除所有选择' }
      ],
      features: [
        { title: '多单元格选择', desc: '按住' + kbd(modKey) + '的同时点击不同单元格来选择多个单元格' },
        { title: '多列选择', desc: '按住' + kbd('Alt') + '的同时点击不同列来选择多列' },
        { title: '多行选择', desc: '按住' + kbd(modKey) + kbd('Alt') + '的同时点击不同行来选择多行' },
        { title: '范围选择', desc: '点击起始单元格，然后按住' + kbd('Shift') + '的同时点击结束单元格来选择矩形范围' },
        { title: '选择整个表格', desc: '双击表格的第一个单元格来选择所有单元格' },
        { title: '快速扩展选择', desc: '使用' + kbd(modKey) + kbd('Shift') + kbd('↑↓←→') + '快速将选择扩展到列/行的边缘' },
        { title: '保持空白占位符', desc: '在设置中启用"保持空白占位符"，在复制非连续单元格时保持间隙' }
      ],
      stats: [
        { label: '计数', value: '10' },
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
          emoji: '🎨',
          title: '主题选择',
          desc: '更改表格选择工具的外观以匹配您的偏好：',
          steps: [
            '通过扩展弹出窗口进入<strong>设置</strong>页面',
            '从4种可用主题中选择：Excel、清新绿、暗黑、金属质感',
            '选择首选主题并点击<strong>保存</strong>',
            '更改立即应用于所有表格选择'
          ]
        },
        {
          emoji: '📊',
          title: '快速列分析',
          desc: '当您需要快速查看某列的统计数据（例如销售额、库存）时：',
          steps: [
            '按住 <strong>Alt</strong> 键',
            '点击目标列的任意单元格',
            '统计面板立即显示计数、求和、平均值等',
            '点击任意统计值进行复制'
          ]
        },
        {
          emoji: '📋',
          title: '复制连续区域',
          desc: '当您需要复制数据的矩形区域时：',
          steps: [
            '按住 <strong>' + modKey + '</strong> 并点击左上角起始单元格',
            '按住 <strong>' + modKey + ' + Shift</strong> 并点击右下角结束单元格',
            '矩形区域内所有单元格被选中和高亮',
            '按 <strong>' + modKey + ' + C</strong> 复制，可直接粘贴到Excel'
          ]
        },
        {
          emoji: '📥',
          title: '导出整个表格到Excel',
          desc: '当您需要将完整表格导出为Excel文件时：',
          steps: [
            '按住 <strong>' + modKey + '</strong> 键，"全选"按钮出现在右上角',
            '点击"全选"按钮，整个表格被选中',
            '"下载Excel"按钮出现在统计面板',
            '点击下载得到.xlsx文件'
          ]
        },
        {
          emoji: '🔍',
          title: '对比非连续行',
          desc: '当您需要对比分散的行数据时：',
          steps: [
            '按住 <strong>' + modKey + ' + Alt</strong> 并点击第一行',
            '继续按住 <strong>' + modKey + ' + Alt</strong> 并点击其他行',
            '多行同时高亮，统计数据显示聚合信息',
            '快速对比不同产品或时间段'
          ]
        },
        {
          emoji: '⚡',
          title: '快速扩展选择',
          desc: '当您需要从当前单元格快速选择到行/列边缘时：',
          steps: [
            '首先选择一个起始单元格',
            '按 <strong>' + modKey + ' + Shift + ↓</strong> 扩展到列底部',
            '或按 <strong>' + modKey + ' + Shift + →</strong> 扩展到行末尾',
            '从任何起点快速选择整列或整行'
          ]
        },
        {
          emoji: '⚙️',
          title: '侧边抽屉面板',
          desc: '通过侧边抽屉访问高级表格操作：',
          steps: [
            '点击统计面板上的 <strong>高级</strong> 按钮（三点图标）',
            '侧边抽屉打开，包含多个操作面板：表格信息、基础操作、集合操作、SQL操作',
            '使用 <strong>基础操作</strong> 来变换、合并或去重数据',
            '使用 <strong>集合操作</strong> 进行交集、并集和差集计算',
            '使用 <strong>SQL操作</strong> 生成INSERT、SELECT或UPDATE语句'
          ]
        },
        {
          emoji: '📝',
          title: '高级编辑功能',
          desc: '对选定的表格数据执行高级变换：',
          steps: [
            '打开侧边抽屉使用 <strong>高级</strong> 按钮',
            '使用 <strong>单元格变换</strong> 对单元格应用格式规则（例如，用引号包装）',
            '使用 <strong>列去重</strong> 删除重复行',
            '使用 <strong>列合并</strong> 用分隔符连接每列的值',
            '使用 <strong>行合并</strong> 用分隔符连接行内容'
          ]
        },
        {
          emoji: '🔄',
          title: '集合运算',
          desc: '对表格数据执行数学集合运算：',
          steps: [
            '为集合运算选择 <strong>恰好两列</strong> 数据',
            '打开侧边抽屉并转到 <strong>集合操作</strong> 面板',
            '选择运算: <strong>交集</strong> (公共元素), <strong>并集</strong> (所有唯一元素), <strong>差集</strong> (A中但B中没有的元素)',
            '结果出现在结果展示面板'
          ]
        }
      ],
      advancedFeatures: {
        sectionTitle: '高级特性',
        features: [
          {
            key: 'theme-selection',
            title: '主题选择',
            desc: '从多种主题中选择，自定义表格助手的外观。根据您的偏好和工作环境在浅色、深色或系统主题之间切换。',
            captions: [
              '多种主题',
            ]
          },
          {
            key: 'side-drawer',
            title: '侧边抽屉面板',
            desc: '通过可折叠的侧边抽屉访问更多工具和信息。查看详细表格统计、导出选项和高级设置，不会使主界面混乱。',
            captions: [
              '抽屉打开',
              '抽屉打开',
              '抽屉打开'
            ]
          },
          {
            key: 'advanced-editing',
            title: '高级编辑功能',
            desc: '对表格数据执行高级编辑操作，包括批量更新、条件格式和公式计算，模拟电子表格功能。',
            captions: [
              '表格编辑',
              '行编辑',
              '列编辑'
            ]
          },
          {
            key: 'set-operations',
            title: '集合运算',
            desc: '使用联合、交集和差集等集合运算将多个表格的数据合并。通过简单操作合并、连接或比较数据集。',
            captions: [
              '集合运算',
            ]
          },
          {
            key: 'sql-generation',
            title: 'SQL语句生成',
            desc: '从表格选择和操作中自动生成SQL查询。使用相应的SQL语句导出数据以进行数据库集成。',
            captions: [
              '插入语句',
              '查询语句',
              '更新语句'
            ]
          }
        ]
      }
    },
    ja: {
      docTitle: 'TableHelper 使用ガイド',
      docSubtitle: 'Excelのようにテーブルセルを選択 - 選択、コピー、データ分析',
      sectionShortcuts: 'キーボードショートカット',
      thAction: '操作',
      thShortcut: 'ショートカット',
      thDesc: '説明',
      sectionMultiselect: '複数選択と範囲選択',
      sectionStats: '統計パネル',
      sectionPractices: 'ベストプラクティス',
      sectionAdvanced: '高度な機能',
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
        { action: 'テーブル全選択', keys: [[modKey], ['ダブルクリック']], desc: 'テーブルの最初のセルをダブルクリック' },
        { action: 'コピー', keys: [[modKey], ['C']], desc: 'クリップボードにコピー、Excelに貼り付け可能' },
        { action: '選択拡張', keys: [[modKey], ['Shift'], ['↑↓←→', true]], desc: '列/行の端まで選択を拡張' },
        { action: '選択解除', keys: [['Esc']], desc: 'すべての選択を解除' }
      ],
      features: [
        { title: '複数セル選択', desc: kbd(modKey) + ' を押しながら異なるセルをクリックして、複数のセルを選択' },
        { title: '複数列選択', desc: kbd('Alt') + ' を押しながら異なる列をクリックして、複数の列を選択' },
        { title: '複数行選択', desc: kbd(modKey) + kbd('Alt') + ' を押しながら異なる行をクリック' },
        { title: '範囲選択', desc: '開始セルをクリックし、' + kbd('Shift') + ' を押しながら終了セルをクリックで矩形範囲を選択' },
        { title: 'テーブル全体を選択', desc: 'テーブルの最初のセルをダブルクリックして、すべてのセルを選択' },
        { title: '選択拡張', desc: kbd(modKey) + kbd('Shift') + kbd('↑↓←→') + ' で列/行の端まで選択を素早く拡張' },
        { title: '空プレースホルダー保持', desc: '設定で「空プレースホルダーを保持」を有効にすると、非連続セルをコピーする際にギャップを維持' }
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
          emoji: '🎨',
          title: 'テーマ選択',
          desc: 'テーブル選択ツールの外観を好みに合わせて変更:',
          steps: [
            '拡張機能ポップアップから<strong>設定</strong>ページに移動',
            '4つの利用可能なテーマから選択: Excel、フレッシュグリーン、ダーク、メタリック',
            '好みのテーマを選択して<strong>保存</strong>をクリック',
            '変更はすべてのテーブル選択に即座に適用されます'
          ]
        },
        {
          emoji: '📊',
          title: '列データの素早い分析',
          desc: '列の統計情報（売上、在庫数など）をすばやく確認したい場合：',
          steps: [
            '按住 <strong>Alt</strong> キー',
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
        },
        {
          emoji: '⚡',
          title: 'クイック選択拡張',
          desc: '現在のセルから行/列の端まで素早く選択する場合：',
          steps: [
            'まず開始セルを選択',
            '<strong>' + modKey + ' + Shift + ↓</strong> で列の下端まで拡張',
            'または <strong>' + modKey + ' + Shift + →</strong> で行の右端まで拡張',
            '任意の開始点から列全体または行全体を素早く選択'
          ]
        },
        {
          emoji: '⚙️',
          title: 'サイドドローパネル',
          desc: 'サイドドロワーを通じて高度な表操作にアクセス:',
          steps: [
            '統計パネルの<strong>詳細</strong>ボタン（三点リーダー）をクリック',
            'サイドドロワーが開き、複数の操作パネルが表示: 表情報、基本操作、集合演算、SQL操作',
            '<strong>基本操作</strong>を使用してデータの変換、マージ、重複削除を行う',
            '<strong>集合演算</strong>を使用して積集合、和集合、差集合の計算を行う',
            '<strong>SQL操作</strong>を使用してINSERT、SELECT、UPDATE文を生成'
          ]
        },
        {
          emoji: '📝',
          title: '高度な編集機能',
          desc: '選択した表データに対して高度な変換を実行:',
          steps: [
            '<strong>詳細</strong>ボタンを使用してサイドドロワーを開く',
            '<strong>セル変換</strong>を使用してセルに書式ルールを適用（例：クォートで囲む）',
            '<strong>列の重複排除</strong>を使用して重複行を削除',
            '<strong>列のマージ</strong>を使用して各列の値をセパレーターで結合',
            '<strong>行のマージ</strong>を使用して行の内容をセパレーターで連結'
          ]
        },
        {
          emoji: '🔄',
          title: '集合演算',
          desc: '表データに対して数学的な集合演算を実行:',
          steps: [
            '集合演算のために<strong>ちょうど2列</strong>のデータを選択',
            'サイドドロワーを開き、<strong>集合演算</strong>パネルに移動',
            '演算を選択: <strong>積集合</strong>（共通要素）、<strong>和集合</strong>（すべての固有要素）、<strong>差集合</strong>（AにあるがBにない要素）',
            '結果は結果表示パネルに表示される'
          ]
        },
      ],
      advancedFeatures: {
        sectionTitle: '高度な機能',
        features: [
          {
            key: 'theme-selection',
            title: 'テーマ選択',
            desc: '複数のテーマから選択してテーブルヘルパーの外観をカスタマイズします。環境設定や作業環境に応じてライト、ダーク、またはシステムテーマを切り替えます。',
            captions: [
              '多種テーマ',
            ]
          },
          {
            key: 'side-drawer',
            title: 'サイドドロワーパネル',
            desc: '折りたたみ可能なサイドドロワーを通じて追加ツールや情報をアクセスします。詳細な表統計、エクスポートオプション、高度な設定をメインインターフェースを混乱させずに表示します。',
            captions: [
              'ドロワーを開く',
              'ドロワーを開く',
              'ドロワーを開く'
            ]
          },
          {
            key: 'advanced-editing',
            title: '高度な編集機能',
            desc: '表データに対して高度な編集操作を実行します。バッチ更新、条件付き書式、スプレッドシート機能を模倣した数式計算などを含みます。',
            captions: [
              'セル編集',
              '行編集',
              '列編集'
            ]
          },
          {
            key: 'set-operations',
            title: '集合演算',
            desc: '和集合、積集合、差集合などの集合演算を使用して複数の表のデータを結合します。単純な操作でデータセットをマージ、結合、比較します。',
            captions: [
              '集合演算',
            ]
          },
          {
            key: 'sql-generation',
            title: 'SQL文生成',
            desc: '表の選択と操作から自動的にSQLクエリを生成します。データベース統合用の対応するSQLステートメントでデータをエクスポートします。',
            captions: [
              'Insert Sql',
              'Select Sql',
              'Update Sql'
            ]
          }
        ]
      }
    }
  };
}

function kbd(text, isSecondary) {
  return '<kbd' + (isSecondary ? ' class="secondary"' : '') + '>' + text + '</kbd>';
}

// Detect language
function detectLanguage() {
  var lang = navigator.language || navigator.userLanguage || 'en';
  if (lang.startsWith('zh')) {
    return 'zh';
  } else if (lang.startsWith('ja') || lang.startsWith('ko')) {
    return 'ja';
  }
  return 'en';
}

// Initialize
currentLang = detectLanguage();

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
  document.getElementById('section-advanced').textContent = t.sectionAdvanced;

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

  // Advanced features
  var advancedFeatures = t.advancedFeatures.features;
  for (var i = 0; i < advancedFeatures.length; i++) {
    var feature = advancedFeatures[i];
    var featureElement = document.querySelector('.feature-detail-card[data-feature="' + feature.key + '"]');
    if (featureElement) {
      var titleElement = featureElement.querySelector('.feature-title-text');
      var descElement = featureElement.querySelector('.feature-description');
      if (titleElement) {
        titleElement.textContent = feature.title;
      }
      if (descElement) {
        descElement.textContent = feature.desc;
      }

      // Update captions for demo slides
      var captionElements = featureElement.querySelectorAll('.demo-caption');
      for (var j = 0; j < captionElements.length && j < feature.captions.length; j++) {
        captionElements[j].textContent = feature.captions[j];
      }
    }
  }

  // Footer
  document.getElementById('footer-tip').textContent = t.footerTip;
}

// 图片轮播功能
function initializeCarousel() {
  // 为每个功能卡片初始化轮播
  const featureCards = document.querySelectorAll('.feature-detail-card');

  featureCards.forEach(card => {
    const demoSlides = card.querySelectorAll('.demo-slide');
    const navButtons = card.querySelectorAll('.demo-nav-btn');

    // 为导航按钮添加点击事件
    navButtons.forEach((btn, index) => {
      btn.addEventListener('click', () => {
        showSlide(card, index);
      });
    });

    // 初始化第一个幻灯片为活动状态
    if (demoSlides.length > 0) {
      demoSlides[0].classList.add('active');
      if (navButtons.length > 0) {
        navButtons[0].classList.add('active');
      }
    }
  });

  // 显示指定幻灯片的函数
  function showSlide(card, slideIndex) {
    const demoSlides = card.querySelectorAll('.demo-slide');
    const navButtons = card.querySelectorAll('.demo-nav-btn');

    // 隐藏所有幻灯片并移除活动状态
    demoSlides.forEach(slide => slide.classList.remove('active'));
    navButtons.forEach(btn => btn.classList.remove('active'));

    // 显示指定幻灯片并设置活动状态
    if (demoSlides[slideIndex]) {
      demoSlides[slideIndex].classList.add('active');
      navButtons[slideIndex].classList.add('active');
    }
  }
}

// 确保在DOM加载完成后初始化所有功能
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function () {
    initializeCarousel();
    render();
    initializeImagePreview();
  });
} else {
  // 如果页面已经加载完成，则直接执行
  initializeCarousel();
  render();
  initializeImagePreview();
}

// 图片全屏预览功能
function initializeImagePreview() {
  // 获取所有演示图片
  const demoImages = document.querySelectorAll('.demo-slide img');
  const modal = document.getElementById('imagePreviewModal');
  const previewImg = document.getElementById('previewedImage');
  const previewCaption = document.getElementById('previewCaption');
  const closeBtn = document.getElementById('closePreview');
  const zoomInBtn = document.getElementById('zoomIn');
  const zoomOutBtn = document.getElementById('zoomOut');
  const zoomResetBtn = document.getElementById('zoomReset');

  // 初始化缩放级别
  let scale = 1;
  const minScale = 0.1;
  const maxScale = 5;

  // 确保模态框元素有正确的样式
  if (modal) {
    modal.classList.add('modal');
  }

  // 为每张图片添加点击事件
  demoImages.forEach(img => {
    img.addEventListener('click', function () {
      previewImg.src = this.src;
      previewCaption.textContent = this.alt || '';
      // 重置缩放
      scale = 1;
      previewImg.style.transform = `scale(${scale})`;
      modal.style.display = 'block';
      document.body.style.overflow = 'hidden'; // 防止背景滚动
    });
  });

  // 缩放功能
  function updateZoom() {
    previewImg.style.transform = `scale(${scale})`;
    zoomResetBtn.textContent = Math.round(scale * 100) + '%';
  }

  // 放大
  zoomInBtn?.addEventListener('click', function (e) {
    e.stopPropagation(); // 阻止事件冒泡
    scale = Math.min(scale + 0.2, maxScale);
    updateZoom();
  });

  // 缩小
  zoomOutBtn?.addEventListener('click', function (e) {
    e.stopPropagation(); // 阻止事件冒泡
    scale = Math.max(scale - 0.2, minScale);
    updateZoom();
  });

  // 重置缩放
  zoomResetBtn?.addEventListener('click', function (e) {
    e.stopPropagation(); // 阻止事件冒泡
    scale = 1;
    updateZoom();
  });

  // 关闭模态框
  closeBtn.onclick = function () {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // 恢复背景滚动
  };

  // 点击模态框外部关闭
  window.onclick = function (event) {
    if (event.target === modal) {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto'; // 恢复背景滚动
    }
  };

  // 添加ESC键关闭功能
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && modal.style.display === 'block') {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto'; // 恢复背景滚动
    }
  });
}
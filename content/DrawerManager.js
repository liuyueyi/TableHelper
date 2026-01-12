/**
 * DrawerManager - Manage the advanced drawer panel for table operations
 */
class DrawerManager {
    constructor(statsPanel) {
        this.statsPanel = statsPanel;
        this.drawer = null;
        this.drawerPanel = null;
        this.currentSelectedCells = [];
        this.init();
    }

    /**
     * Initialize the drawer manager
     * @private
     */
    init() {
        // Create drawer element
        this.drawer = document.createElement('div');
        this.drawer.innerHTML = this._getDrawerTemplate();
        document.body.appendChild(this.drawer);

        // Get reference to the drawer panel
        this.drawerPanel = document.getElementById('drawer-panel');

        // Setup event listeners
        this._setupEventListeners();

        // Set initial state of collapsible groups
        this._initializeCollapsibleGroups();
    }

    /**
     * Initialize collapsible groups
     * @private
     */
    _initializeCollapsibleGroups() {
        // Initially collapse all groups except the expanded panels (info, basic, and result panels)
        const groups = this.drawer.querySelectorAll('.operation-group.collapsible');
        groups.forEach((group, index) => {
            // Don't collapse the info panel (index 0), basic operations panel (index 1), or result panel (last panel)
            if (!group.classList.contains('expanded')) {
                const content = group.querySelector('.collapsible-content');
                const icon = group.querySelector('.collapse-icon');
                if (content) {
                    content.style.display = 'none';
                }
                if (icon) {
                    icon.textContent = '▼';
                }
            }
        });
    }

    /**
     * Get drawer panel HTML template
     * @private
     */
    _getDrawerTemplate() {
        return `
      <div class="drawer-panel" id="drawer-panel">
        <div class="drawer-header">
          <div class="drawer-title">高级表格操作</div>
          <button class="drawer-close" id="drawer-close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <div class="drawer-content">
          <!-- 第一个面板：当前选中的表格信息 -->
          <div class="operation-group collapsible expanded">
            <div class="group-title" id="info-group-title">
              <span>表格信息</span>
              <span class="collapse-icon">▲</span>
            </div>
            <div class="collapsible-content" style="display: block;">
              <textarea class="table-info" id="table-info" readonly>未选择任何表格数据</textarea>
            </div>
          </div>
              
          <!-- 第二个面板：基础操作 -->
          <div class="operation-group collapsible expanded">
            <div class="group-title" id="basic-group-title">
              <span>基础操作</span>
              <span class="collapse-icon">▲</span>
            </div>
            <div class="collapsible-content" style="display: block;">
                <!-- 单元格操作行 -->
                <div class="operation-row">
                <div class="operation-controls">
                    <label class="checkbox-label">
                    <input type="checkbox" id="cell-transform-checkbox">
                    <span class="checkmark"></span>
                    单元格转换
                    </label>
                    <div class="input-group" id="cell-transform-input-group" style="display: none;">
                    <input type="text" id="cell-transform-rule" placeholder="例如: '$' 表示单元格使用单引号包裹" value="'$'">
                    </div>
                </div>
                </div>
                <div class="hint-text" id="cell-transform-hint" style="display: none;">转换规则 ($ 表示单元格内容)</div>
                <!-- 列操作行 -->
                <div class="operation-row">
                <div class="operation-controls">
                    <label class="checkbox-label">
                    <input type="checkbox" id="col-dedup-checkbox">
                    <span class="checkmark"></span>
                    列去重
                    </label>
                    <label class="checkbox-label">
                    <input type="checkbox" id="col-merge-checkbox">
                    <span class="checkmark"></span>
                    列合并
                    </label>
                    <div class="input-group" id="col-merge-input-group" style="display: none;">
                    <input type="text" id="col-merge-template" placeholder="例如: ," value=",">
                    </div>
                </div>
                </div>
                <div class="hint-text" id="col-merge-hint" style="display: none;">默认使用英文逗号合并每一行的单元格，支持转义符</div>
                    
                <!-- 行操作行 -->
                <div class="operation-row">
                <div class="operation-controls">
                    <label class="checkbox-label">
                    <input type="checkbox" id="row-merge-checkbox">
                    <span class="checkmark"></span>
                    行合并
                    </label>
                    <div class="input-group" id="row-merge-input-group" style="display: none;">
                    <input type="text" id="row-merge-separator" placeholder="默认为换行符" value=";">
                    </div>
                </div>
                </div>
                <div class="hint-text" id="row-merge-hint" style="display: none;">默认使用 ; 拼接行内容，支持转义符</div>
            </div>
          </div>
              
          <!-- 第三个面板：集合操作 -->
          <div class="operation-group collapsible">
            <div class="group-title" id="set-group-title">
              <span>集合操作</span>
              <span class="collapse-icon">▼</span>
            </div>
            <div class="collapsible-content">
              <div class="operation-controls">
                <label class="radio-label">
                  <input type="radio" name="set-operation" id="set-no" value="no">
                  <span class="radiomark"></span>
                  无
                </label>
                <label class="radio-label">
                  <input type="radio" name="set-operation" id="set-intersection" value="intersection">
                  <span class="radiomark"></span>
                  交集
                </label>
                <label class="radio-label">
                  <input type="radio" name="set-operation" id="set-union" value="union">
                  <span class="radiomark"></span>
                  并集
                </label>
                <label class="radio-label">
                  <input type="radio" name="set-operation" id="set-diff-ab" value="difference-a-b">
                  <span class="radiomark"></span>
                  差集 (A - B)
                </label>
                <label class="radio-label">
                  <input type="radio" name="set-operation" id="set-diff-ba" value="difference-b-a">
                  <span class="radiomark"></span>
                  差集 (B - A)
                </label>
              </div>
            </div>
          </div>
              
          <!-- 第四个面板：SQL操作 -->
          <div class="operation-group collapsible">
            <div class="group-title" id="sql-group-title">
              <span>SQL</span>
              <span class="collapse-icon">▼</span>
            </div>
            <div class="collapsible-content">
              <div class="operation-controls">
                <label class="radio-label">
                  <input type="radio" name="sql-operation" id="sql-insert" value="insert">
                  <span class="radiomark"></span>
                  INSERT
                </label>
                <label class="radio-label">
                  <input type="radio" name="sql-operation" id="sql-select" value="select">
                  <span class="radiomark"></span>
                  SELECT
                </label>
                <label class="radio-label">
                  <input type="radio" name="sql-operation" id="sql-update" value="update">
                  <span class="radiomark"></span>
                  UPDATE
                </label>
              </div>
              
              <!-- 表名输入框 -->
              <div class="sql-operation-row">
                <div class="operation-controls">
                  <label style="margin-left: 8px;">表名:</label>
                  <div class="input-group">
                    <input type="text" id="sql-table-name" placeholder="请输入表名" style="width: 100%;">
                  </div>
                </div>
              </div>
              <!-- INSERT 操作的输入框 -->
              <div class="sql-operation-row" id="insert-columns-row" style="display: none;">
                <div class="operation-controls">
                  <div class="input-group">
                    <label>选中列 (逗号分隔):</label>
                    <input type="text" id="sql-insert-include-columns" placeholder="例如: id,name,age" style="width: 100%;">
                  </div>
                  <div class="input-group">
                    <label>排除列 (逗号分隔):</label>
                    <input type="text" id="sql-insert-exclude-columns" placeholder="例如: password,temp" style="width: 100%;">
                  </div>
                </div>
              </div>
              
              <!-- SELECT 操作的输入框 -->
              <div class="sql-operation-row" id="select-condition-row" style="display: none;">
                <div class="operation-controls">
                  <div class="input-group">
                    <label>查询条件 (逗号分隔):</label>
                    <input type="text" id="sql-select-condition" placeholder="用于构建查询条件的列，如name,age" style="width: 100%;">
                  </div>
                </div>
              </div>
              
              <!-- UPDATE 操作的输入框 -->
              <div class="sql-operation-row" id="update-columns-row" style="display: none;">
                <div class="operation-controls">
                  <div class="input-group">
                    <label>更新列 (逗号分隔):</label>
                    <input type="text" id="sql-update-set-columns" placeholder="例如: name,age" style="width: 100%;">
                  </div>
                  <div class="input-group">
                    <label>查询列 (逗号分隔):</label>
                    <input type="text" id="sql-update-where-columns" placeholder="例如: id,status" style="width: 100%;">
                  </div>
                </div>
              </div>
            </div>
          </div>
              
          <!-- 第五个面板：结果展示 -->
          <div class="operation-group collapsible expanded">
            <div class="group-title" id="result-group-title">
              <span>处理结果</span>
              <span class="collapse-icon">▲</span>
            </div>
            <div class="collapsible-content" style="display: block;">
              <div class="result-area" id="result-area">
                操作结果将显示在这里...
              </div>
              <div class="result-actions">
                <button class="result-action-btn" id="copy-result">复制结果</button>
                <button class="result-action-btn" id="export-result">导出结果</button>
              </div>
              <!-- 提示信息展示区域 -->
              <div class="status-message" id="status-message" style="margin-top: 10px; padding: 10px; background-color: #f0f0f0; border-radius: 4px; display: none;">
                操作状态信息将显示在这里...
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    }

    /**
     * Toggle collapse/expand state of a group
     * @param {HTMLElement} titleElement
     */
    _toggleCollapse(group) {
        const content = group.querySelector('.collapsible-content');
        const icon = group.querySelector('.collapse-icon');

        if (content.style.display === 'none' || content.style.display === '') {
            content.style.display = 'block';
            icon.textContent = '▲';
        } else {
            content.style.display = 'none';
            icon.textContent = '▼';
        }
    }

    static toggleCollapse(titleElement) {
        const group = titleElement.closest('.operation-group');
        const content = group.querySelector('.collapsible-content');
        const icon = titleElement.querySelector('.collapse-icon');

        if (content.style.display === 'none' || content.style.display === '') {
            content.style.display = 'block';
            icon.textContent = '▲';
        } else {
            content.style.display = 'none';
            icon.textContent = '▼';
        }
    }

    /**
     * Setup event listeners
     * @private
     */
    _setupEventListeners() {
        // Drawer close button
        const drawerClose = document.getElementById('drawer-close');
        if (drawerClose) {
            drawerClose.addEventListener('click', (e) => {
                e.stopPropagation();
                this.close();
            });
        }

        // Add click event listeners to group titles for collapsing/expanding
        const infoGroupTitle = document.getElementById('info-group-title');
        if (infoGroupTitle) {
            infoGroupTitle.addEventListener('click', (e) => {
                e.stopPropagation();
                this._toggleCollapse(infoGroupTitle.closest('.operation-group'));
            });
        }

        const basicGroupTitle = document.getElementById('basic-group-title');
        if (basicGroupTitle) {
            basicGroupTitle.addEventListener('click', (e) => {
                e.stopPropagation();
                this._toggleCollapse(basicGroupTitle.closest('.operation-group'));
            });
        }

        const setGroupTitle = document.getElementById('set-group-title');
        if (setGroupTitle) {
            setGroupTitle.addEventListener('click', (e) => {
                e.stopPropagation();
                this._toggleCollapse(setGroupTitle.closest('.operation-group'));
            });
        }

        const sqlGroupTitle = document.getElementById('sql-group-title');
        if (sqlGroupTitle) {
            sqlGroupTitle.addEventListener('click', (e) => {
                e.stopPropagation();
                this._toggleCollapse(sqlGroupTitle.closest('.operation-group'));
            });
        }

        const resultGroupTitle = document.getElementById('result-group-title');
        if (resultGroupTitle) {
            resultGroupTitle.addEventListener('click', (e) => {
                e.stopPropagation();
                this._toggleCollapse(resultGroupTitle.closest('.operation-group'));
            });
        }

        // Checkbox event listeners for basic operations
        const cellTransformCheckbox = document.getElementById('cell-transform-checkbox');
        if (cellTransformCheckbox) {
            cellTransformCheckbox.addEventListener('change', (e) => {
                const inputGroup = document.getElementById('cell-transform-input-group');
                const hint = document.getElementById('cell-transform-hint');
                if (inputGroup) {
                    inputGroup.style.display = e.target.checked ? 'inline-block' : 'none';
                }
                if (hint) {
                    hint.style.display = e.target.checked ? 'block' : 'none';
                }

                // Auto-execute when checkbox changes
                this._autoExecuteOperation('basic-operations');
            });
        }

        const rowMergeCheckbox = document.getElementById('row-merge-checkbox');
        if (rowMergeCheckbox) {
            rowMergeCheckbox.addEventListener('change', (e) => {
                const inputGroup = document.getElementById('row-merge-input-group');
                const hint = document.getElementById('row-merge-hint');
                if (inputGroup) {
                    inputGroup.style.display = e.target.checked ? 'inline-block' : 'none';
                }
                if (hint) {
                    hint.style.display = e.target.checked ? 'block' : 'none';
                }

                // Auto-execute when checkbox changes
                this._autoExecuteOperation('basic-operations');
            });
        }

        const colMergeCheckbox = document.getElementById('col-merge-checkbox');
        if (colMergeCheckbox) {
            colMergeCheckbox.addEventListener('change', (e) => {
                const inputGroup = document.getElementById('col-merge-input-group');
                const hint = document.getElementById('col-merge-hint');
                if (inputGroup) {
                    inputGroup.style.display = e.target.checked ? 'inline-block' : 'none';
                }
                if (hint) {
                    hint.style.display = e.target.checked ? 'block' : 'none';
                }

                // Auto-execute when checkbox changes
                this._autoExecuteOperation('basic-operations');
            });
        }

        const colDupCheckbox = document.getElementById('col-dedup-checkbox');
        if (colDupCheckbox) {
            colDupCheckbox.addEventListener('change', (e) => {
                console.log('Column duplicate checkbox changed:', e.target.checked);
                this._autoExecuteOperation('basic-operations');
            });
        }


        // Event listeners for input changes to trigger auto-execution
        const cellTransformRule = document.getElementById('cell-transform-rule');
        if (cellTransformRule) {
            cellTransformRule.addEventListener('input', () => {
                if (cellTransformCheckbox.checked) {
                    this._autoExecuteOperation('basic-operations');
                }
            });
        }

        const rowMergeSeparator = document.getElementById('row-merge-separator');
        if (rowMergeSeparator) {
            rowMergeSeparator.addEventListener('input', () => {
                if (rowMergeCheckbox.checked) {
                    this._autoExecuteOperation('basic-operations');
                }
            });
        }

        const colMergeTemplate = document.getElementById('col-merge-template');
        if (colMergeTemplate) {
            colMergeTemplate.addEventListener('input', () => {
                if (document.getElementById('col-merge-checkbox').checked) {
                    this._autoExecuteOperation('basic-operations');
                }
            });
            colMergeTemplate.addEventListener('change', (e) => {
                const hint = document.getElementById('col-merge-hint');
                if (hint) {
                    hint.style.display = e.target.value ? 'block' : 'none';
                }
            });
        }

        // Radio button event listeners for set operations
        const setOperationRadios = document.querySelectorAll('input[name="set-operation"]');
        setOperationRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                this._autoExecuteOperation('set-operations');
            });
        });

        // Radio button event listeners for SQL operations
        const sqlOperationRadios = document.querySelectorAll('input[name="sql-operation"]');
        sqlOperationRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                // 显示对应操作的输入框
                const insertRow = document.getElementById('insert-columns-row');
                const selectRow = document.getElementById('select-condition-row');
                const updateRow = document.getElementById('update-columns-row');

                if (radio.value === 'insert') {
                    if (insertRow) insertRow.style.display = 'block';
                    if (selectRow) selectRow.style.display = 'none';
                    if (updateRow) updateRow.style.display = 'none';
                } else if (radio.value === 'select') {
                    if (insertRow) insertRow.style.display = 'none';
                    if (selectRow) selectRow.style.display = 'block';
                    if (updateRow) updateRow.style.display = 'none';
                } else if (radio.value === 'update') {
                    if (insertRow) insertRow.style.display = 'none';
                    if (selectRow) selectRow.style.display = 'none';
                    if (updateRow) updateRow.style.display = 'block';
                } else {
                    if (insertRow) insertRow.style.display = 'none';
                    if (selectRow) selectRow.style.display = 'none';
                    if (updateRow) updateRow.style.display = 'none';
                }

                this._autoExecuteOperation('sql-operations');
            });
        });


        const sqlTableName = document.getElementById('sql-table-name');
        if (sqlTableName) {
            sqlTableName.addEventListener('input', () => {
                this._autoExecuteOperation('sql-operations');
            });
        }
        const sqlInsertColumns = document.getElementById('sql-insert-include-columns');
        if (sqlInsertColumns) {
            sqlInsertColumns.addEventListener('input', () => {
                this._autoExecuteOperation('sql-operations');
            });
        }
        const sqlExcludeColumns = document.getElementById('sql-insert-exclude-columns');
        if (sqlExcludeColumns) {
            sqlExcludeColumns.addEventListener('input', () => {
                this._autoExecuteOperation('sql-operations');
            });
        }
        const sqlUpdateSetColumns = document.getElementById('sql-update-set-columns');
        if (sqlUpdateSetColumns) {
            sqlUpdateSetColumns.addEventListener('input', () => {
                this._autoExecuteOperation('sql-operations');
            });
        }
        const sqlUpdateWhereColumns = document.getElementById('sql-update-where-columns');
        if (sqlUpdateWhereColumns) {
            sqlUpdateWhereColumns.addEventListener('input', () => {
                this._autoExecuteOperation('sql-operations');
            });
        }
        const sqlSelectColumns = document.getElementById('sql-select-condition')
        if (sqlSelectColumns) {
            sqlSelectColumns.addEventListener('input', () => {
                this._autoExecuteOperation('sql-operations');
            });
        }

        // Copy result button
        const copyResultBtn = document.getElementById('copy-result');
        if (copyResultBtn) {
            copyResultBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.copyResult();
            });
        }

        // Export result button
        const exportResultBtn = document.getElementById('export-result');
        if (exportResultBtn) {
            exportResultBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.exportResult();
            });
        }
    }

    /**
     * Auto execute operation based on selected options
     * @param {string} operation
     * @private
     */
    _autoExecuteOperation(operation) {
        // Small delay to ensure UI updates are complete before executing
        setTimeout(() => {
            this.executeOperation(operation);
        }, 100);
    }

    /**
     * Update the current selection
     * @param {HTMLTableCellElement[]} cells
     */
    updateSelection(cells) {
        this.currentSelectedCells = cells || [];
    }

    /**
     * Toggle drawer panel visibility
     */
    toggle() {
        if (this.drawerPanel) {
            const isOpen = this.drawerPanel.classList.contains('open');

            if (isOpen) {
                this.close();
            } else {
                this.open();
            }
        }
    }

    /**
     * Open drawer panel
     */
    open() {
        if (this.drawerPanel) {
            document.body.classList.add('drawer-open');
            // Trigger reflow to ensure the transition happens
            void this.drawerPanel.offsetWidth;
            this.drawerPanel.classList.add('open');

            // If opening drawer, update the UI to reflect current selection type
            this.updateOperationButtons();

            // Ensure the table info panel is updated immediately
            setTimeout(() => {
                this.updateTableInfo();
            }, 0);
        }
    }

    /**
     * Close drawer panel
     */
    close() {
        if (this.drawerPanel) {
            this.drawerPanel.classList.remove('open');
            const self = this;
            // Wait for transition to finish before removing body class
            setTimeout(function () {
                if (!self.drawerPanel.classList.contains('open')) {
                    document.body.classList.remove('drawer-open');
                }
            }, 300); // Match the CSS transition duration
        }
    }

    /**
     * Update operation buttons based on current selection
     * @private
     */
    updateOperationButtons() {
        // Update table info panel
        this.updateTableInfo();

        // Enable/disable set operations based on selection
        const selectedCells = this._getSelectedCells2D();
        const hasTwoColumns = selectedCells.length > 0 && selectedCells[0].length === 2;

        // If there aren't two columns, collapse the set operations panel
        const setOperationGroup = document.querySelector('.operation-group:nth-child(3)');
        if (setOperationGroup && !hasTwoColumns) {
            const content = setOperationGroup.querySelector('.collapsible-content');
            const icon = setOperationGroup.querySelector('.collapse-icon');
            if (content) {
                content.style.display = 'none';
            }
            if (icon) {
                icon.textContent = '▼';
            }
        }

        // Auto-execute if any operation is already selected
        if (document.querySelector('input[name="set-operation"]:checked')) {
            this._autoExecuteOperation('set-operations');
        }

        if (document.querySelector('input[name="sql-operation"]:checked')) {
            this._autoExecuteOperation('sql-operations');
        }
    }

    /**
     * Update table info panel
     * @private
     */
    updateTableInfo() {
        const tableInfoEl = document.getElementById('table-info');

        if (!tableInfoEl) return;

        // Try to get the selection data from the global selection manager to match copy format
        // Access the global selection manager from window
        const globalSelectionManager = this._getGlobalSelectionManager();

        if (globalSelectionManager && typeof globalSelectionManager.getSelectionData === 'function') {
            // Use the same data format as the copy functionality
            const data = globalSelectionManager.getSelectionData();

            if (data.length === 0) {
                tableInfoEl.value = '未选择任何表格数据';
                return;
            }

            // Convert to TSV-like format for display in textarea (same as copy)
            // This preserves the original table structure with tabs for columns and newlines for rows
            const cellTextDisplay = data.map(row => row.join('\t')).join('\n');

            // Limit the display to prevent too much content
            if (cellTextDisplay.length > 500) {
                tableInfoEl.value = cellTextDisplay.substring(0, 500) + '\n(内容过多，仅显示前500字符)';
            } else {
                tableInfoEl.value = cellTextDisplay;
            }
            console.log('Table info updated with global selection data', cellTextDisplay);
        } else {
            tableInfoEl.value = '未选择任何表格数据';
        }
    }

    /**
     * Get the global selection manager instance
     * @private
     */
    _getGlobalSelectionManager() {
        // Try to access the global selection manager from the content script
        if (window.SuperTables && window.SuperTables.contentScript && window.SuperTables.contentScript.selectionManager) {
            return window.SuperTables.contentScript.selectionManager;
        }

        // Alternative: try to access via modules
        if (window.SuperTables && window.SuperTables.modules && window.SuperTables.modules.selectionManager) {
            return window.SuperTables.modules.selectionManager;
        }

        return null;
    }

    /**
     * Get cell position in table
     * @private
     * @param {HTMLTableCellElement} cell
     * @returns {Object|null} {row, col}
     */
    _getCellPosition(cell) {
        const table = cell.closest('table');
        if (!table) return null;

        const rows = Array.from(table.rows);
        const rowIdx = rows.indexOf(cell.parentElement);

        if (rowIdx === -1) return null;

        // Calculate cell index accounting for colSpan
        let cellIdx = 0;
        const rowCells = Array.from(rows[rowIdx].cells);

        for (const rowCell of rowCells) {
            if (rowCell === cell) {
                break;
            }
            cellIdx += rowCell.colSpan || 1;
        }

        return { row: rowIdx, col: cellIdx };
    }

    /**
     * Execute selected operation
     * @param {string} operation
     */
    executeOperation(operation) {
        if (!this.statsPanel || !this.statsPanel.stats) {
            this.showResult('请先选择表格数据', 'error');
            return;
        }

        // 获取二维数组结构的选中单元格数据
        const selectedCells2D = this._getSelectedCells2D();
        if (!selectedCells2D || selectedCells2D.length === 0 || selectedCells2D.every(row => row.length === 0)) {
            this.showResult('请先选择表格数据', 'error');
            return;
        }

        let result;

        try {
            switch (operation) {
                case 'basic-operations':
                    result = this.executeBasicOperations(selectedCells2D);
                    break;
                case 'set-operations':
                    result = this.executeSetOperations(selectedCells2D);
                    break;
                case 'sql-operations':
                    result = this.executeSqlOperations(selectedCells2D);
                    break;
                default:
                    result = '未知操作';
                    break;
            }

            this.showResult(result, 'success');
        } catch (error) {
            this.showResult(`操作失败: ${error.message}`, 'error');
        }
    }

    /**
     * Execute basic operations
     * @param {HTMLTableCellElement[]} cells
     * @returns {string}
     */
    executeBasicOperations(cells2D) {
        console.log('Executing basic operations on 2D selected cells:', cells2D);

        // 记录原始数据的行列数
        const originalRowCount = cells2D.length;
        const originalColCount = cells2D.length > 0 ? Math.max(...cells2D.map(row => row.length)) : 0;

        // 将二维单元格数组转换为二维文本值数组
        const result2D = cells2D.map(row => row.map(cell => cell.textContent.trim()));
        console.log('Initial 2D result from cells:', result2D);

        // Cell transform - transform each cell value based on the rule
        const cellTransformCheckbox = document.getElementById('cell-transform-checkbox');
        if (cellTransformCheckbox && cellTransformCheckbox.checked) {
            const transformRule = document.getElementById('cell-transform-rule').value || "'$'";
            // 对二维数组中的每个单元格应用变换规则
            for (let r = 0; r < result2D.length; r++) {
                for (let c = 0; c < result2D[r].length; c++) {
                    result2D[r][c] = transformRule.replace(/(\$)/g, result2D[r][c]);
                }
            }
            console.log('After cell transform:', result2D);
        }

        // Column merge - merge values in each column with a template
        const colMergeCheckbox = document.getElementById('col-merge-checkbox');
        if (colMergeCheckbox && colMergeCheckbox.checked) {
            const template = document.getElementById('col-merge-template').value || ',';
            let aaa = []
            for (let item of result2D) {
                let bbb = item.join(template);
                aaa.push(bbb)
            }
            result2D.length = 0;
            for (let i = 0; i < aaa.length; i++) {
                result2D[i] = [aaa[i]];
            }
            console.log('After column merge:', result2D);
        }

        // Column deduplication - remove duplicate rows
        const colDedupCheckbox = document.getElementById('col-dedup-checkbox');
        if (colDedupCheckbox && colDedupCheckbox.checked) {
            // 逐行比较，去除重复的行
            const uniqueRows = [];
            const seenRows = new Set();

            for (const row of result2D) {
                const rowKey = row.join('|'); // 使用分隔符连接行元素
                if (!seenRows.has(rowKey)) {
                    seenRows.add(rowKey);
                    uniqueRows.push([...row]); // 复制行数据
                } else {
                    console.log('Duplicate row found and skipped:', row);
                }
            }

            if (uniqueRows.length > 0) {
                result2D.length = 0; // 清空原数组
                uniqueRows.forEach(row => result2D.push(row)); // 添加去重后的行
            }
            console.log('After column deduplication:', result2D);
        }

        // Row merge - merge values in each row with a separator
        const rowMergeCheckbox = document.getElementById('row-merge-checkbox');
        if (rowMergeCheckbox && rowMergeCheckbox.checked) {
            const separator = document.getElementById('row-merge-separator').value || '\n';
            const mergedRows = [];

            // 遍历每一行， 将行内元素使用分割符进行链接
            for (const rowData of result2D) {
                if (rowData.length == 0) {
                    // 移除空行
                    continue
                }
                if (rowData.length > 1) {
                    mergedRows.push(rowData.join('\t'));
                } else {
                    mergedRows.push(rowData[0])
                }
            }

            if (mergedRows.length > 0) {
                const ans = mergedRows.join(separator);
                result2D.length = 0; // 清空原数组
                result2D.push([ans]); // 添加合并后的结果作为单行
            }
            console.log('After row merge:', result2D);
        }

        if (result2D.length === 0 || result2D.every(row => row.length === 0)) {
            // 显示操作结果统计
            this.showStatusMessage(`操作完成: 输入 ${originalRowCount} 行 × ${originalColCount} 列，输出 0 行 × 0 列`, 'info');
            return '请至少选择一个操作';
        }

        // 将二维结果扁平化为字符串输出
        const flatResult = []
        for (const item of result2D) {
            flatResult.push(item.join('\t'))
        }
        console.log('Final flattened result:', flatResult);

        // 显示操作结果统计
        const finalRowCount = result2D.length;
        const finalColCount = result2D.length > 0 ? Math.max(...result2D.map(row => row.length)) : 0;
        this.showStatusMessage(`操作完成: 输入 ${originalRowCount} 行 × ${originalColCount} 列，输出 ${finalRowCount} 行 × ${finalColCount} 列`, 'info');

        return flatResult.join('\n');
    }

    /**
     * Execute set operations
     * @param {HTMLTableCellElement[][]} cells2D - 2D array of selected cells
     * @returns {string}
     */
    executeSetOperations(cells2D) {
        // Get selected radio button
        const selectedOp = document.querySelector('input[name="set-operation"]:checked');

        if (!selectedOp) {
            return '请选择集合操作类型';
        }

        const operation = selectedOp.value;

        // Convert 2D array to values for set operations
        // We need at least 2 columns for set operations
        if (cells2D.length === 0) {
            return '没有选择任何数据';
        }

        // 将二维单元格数组转换为二维文本值数组
        const result2D = cells2D.map(row => row.map(cell => cell.textContent.trim()));
        console.log('Initial 2D result from cells:', result2D);
        if (result2D[0].length != 2) {
            return '集合操作请选择两列数据';
        }

        // 提取两列数据
        const col0 = [];
        const col1 = [];
        for (const row of result2D) {
            col0.push(row[0]);
            col1.push(row[1]);
        }

        // 记录原始集合的元素个数
        const originalSetASize = col0.length;
        const originalSetBSize = col1.length;

        // 执行集合操作
        const result = this.setOperationOnColumns(col0, col1, operation);

        // 计算结果集合的元素个数（过滤掉空字符串）
        const resultCount = result ? result.split('\n').filter(item => item.trim() !== '').length : 0;

        // 显示集合操作结果统计
        let operationName = '';
        switch (operation) {
            case 'no':
                operationName = '不执行集合运算';
                break;
            case 'intersection':
                operationName = '交集';
                break;
            case 'union':
                operationName = '并集';
                break;
            case 'difference-a-b':
                operationName = '差集 (A - B)';
                break;
            case 'difference-b-a':
                operationName = '差集 (B - A)';
                break;
            default:
                operationName = '未知操作';
        }

        this.showStatusMessage(`集合操作完成: A集合 \${originalSetASize} 个元素, B集合 \${originalSetBSize} 个元素, \${operationName}结果 \${resultCount} 个元素`, 'info');
        return result;
    }

    /**
     * Execute SQL operations
     * @param {HTMLTableCellElement[][]} cells2D - 2D array of selected cells
     * @returns {string}
     */
    executeSqlOperations(cells2D) {
        // Get selected radio button
        const selectedOp = document.querySelector('input[name="sql-operation"]:checked');

        if (!selectedOp) {
            return '请选择SQL操作类型';
        }

        const operation = selectedOp.value;

        // 检查是否至少有一行数据作为表头
        if (cells2D.length === 0) {
            return '请先选择表格数据';
        }

        // 检查第一行是否为表头（检查第一个单元格是否为 th 标签）
        const firstRow = cells2D[0];
        if (!firstRow || firstRow.length === 0) {
            this.showStatusMessage('错误: 请选中包含表头的表格数据，第一行将作为字段名', 'error');
            return '错误: 请选中包含表头的表格数据，第一行将作为字段名';
        }

        // 检查第一个单元格是否为 th 标签，如果是则表示有表头
        const hasHeader = firstRow.some(cell => cell.tagName.toLowerCase() === 'th');
        if (!hasHeader) {
            this.showStatusMessage('错误: 请选中包含表头的表格数据（第一行应包含 th 标签作为表头）', 'error');
            return '错误: 请选中包含表头的表格数据（第一行应包含 th 标签作为表头）';
        }

        // 提取表头作为字段名
        const headers = firstRow.map(cell => cell.textContent.trim());

        // 检查表头是否为空
        const hasEmptyHeader = headers.some(header => !header);
        if (hasEmptyHeader) {
            this.showStatusMessage('错误: 表头包含空字段，请确保第一行每个单元格都有内容作为字段名', 'error');
            return '错误: 表头包含空字段，请确保第一行每个单元格都有内容作为字段名';
        }

        // 提取数据行（跳过表头）
        const dataRows = cells2D.slice(1);

        // 获取表名
        let tableName = document.getElementById('sql-table-name')?.value || 'table_name';
        // 如果表名中形如 xxx.xxx 格式，表示同时指定了库 + 表名，需要我们分别为库和表，添加 `
        const tableNameParts = tableName.split('.');
        if (tableNameParts.length === 2) {
            tableName = `\`${tableNameParts[0]}\`` + '.' + `\`${tableNameParts[1]}\``;
        } else {
            tableName = `\`${tableName}\``;
        }

        // 生成字段列表
        const columns = headers.map(header => `\`${header.replace(/\`/g, '``')}\``); // 使用反引号包围字段名，防止SQL关键字冲突

        // 根据操作类型生成SQL
        switch (operation) {
            case 'insert':
                if (dataRows.length === 0) {
                    return '没有数据行用于INSERT操作，请确保选择的表格包含表头和至少一行数据';
                }

                // 获取选中列和排除列
                const includeColsInput = document.getElementById('sql-insert-include-columns')?.value;
                const excludeColsInput = document.getElementById('sql-insert-exclude-columns')?.value;

                let filteredColumns = columns;

                // 如果设置了选中列，则只使用选中的列
                if (includeColsInput && includeColsInput.trim()) {
                    const includeCols = includeColsInput.split(',').map(col => col.trim()).filter(col => col);
                    filteredColumns = columns.filter((col, idx) => includeCols.includes(headers[idx].toLowerCase()));
                }
                // 如果设置了排除列，则移除排除的列
                else if (excludeColsInput && excludeColsInput.trim()) {
                    const excludeCols = excludeColsInput.split(',').map(col => col.trim()).filter(col => col);
                    filteredColumns = columns.filter((col, idx) => !excludeCols.includes(headers[idx].toLowerCase()));
                }

                // 过滤数据行以匹配列
                const filteredDataRows = dataRows.map(row => {
                    if (includeColsInput && includeColsInput.trim()) {
                        const includeCols = includeColsInput.split(',').map(col => col.trim()).filter(col => col);
                        return row.filter((_, idx) => includeCols.includes(headers[idx].toLowerCase()));
                    } else if (excludeColsInput && excludeColsInput.trim()) {
                        const excludeCols = excludeColsInput.split(',').map(col => col.trim()).filter(col => col);
                        return row.filter((_, idx) => !excludeCols.includes(headers[idx].toLowerCase()));
                    }
                    return row;
                });

                const insertValues = filteredDataRows.map(row => {
                    return '(' + row.map(cell => "'" + cell.textContent.trim().replace(/'/g, "''") + "'").join(',') + ')';
                }).join(',\n  ');

                return `INSERT INTO ${tableName} (${filteredColumns.join(',')}) VALUES\n  ${insertValues};`;

            case 'select':
                // 获取查询条件字段
                const selectConditionInput = document.getElementById('sql-select-condition')?.value;

                // 确定要使用的列（如果输入框为空，则使用所有列）
                let selectedColumns = [];
                if (selectConditionInput && selectConditionInput.trim()) {
                    // 如果输入框有值，使用输入的字段名
                    selectedColumns = selectConditionInput.split(',').map(col => col.trim()).filter(col => col);
                } else {
                    // 如果输入框为空，使用所有表头字段
                    selectedColumns = headers;
                }

                // 构建用于WHERE子句的列
                const selectedColumnNames = [];
                const selectedColumnIndices = [];

                for (let i = 0; i < headers.length; i++) {
                    if (selectedColumns.includes(headers[i])) {
                        selectedColumnNames.push(columns[i]);
                        selectedColumnIndices.push(i);
                    }
                }

                // 如果没有匹配的列，返回基本查询
                if (selectedColumnNames.length === 0) {
                    return `SELECT * FROM ${tableName};`;
                }

                // 构建IN子句中的值列表
                const valueTuples = dataRows.map(row => {
                    const tupleValues = [];
                    for (const colIndex of selectedColumnIndices) {
                        const cellValue = row[colIndex]?.textContent.trim();
                        // 转义单引号并用单引号包围值
                        const escapedValue = cellValue ? cellValue.replace(/'/g, "''") : '';
                        tupleValues.push(`'${escapedValue}'`);
                    }
                    return `(${tupleValues.join(',')})`;
                }).filter(tuple => tuple !== '()'); // 过滤空元组

                // 如果没有有效的值元组，返回基本查询
                if (valueTuples.length === 0) {
                    return `SELECT * FROM ${tableName};`;
                }

                // 生成最终的SQL查询
                // 如果只有一列，使用列名 IN (值1,值2,...) 的格式
                // 如果多列，使用 (列1,列2,...) IN ((值1,值2,...),(值3,值4,...),...) 的格式
                if (selectedColumnNames.length === 1) {
                    // 单列情况：列名 IN (值1,值2,...)
                    const singleColumn = selectedColumnNames[0];
                    // 从元组中提取单个值
                    const singleValues = valueTuples.map(tuple => {
                        // 去掉括号并提取值
                        const inner = tuple.substring(1, tuple.length - 1); // 去掉首尾的括号
                        return inner;
                    }).join(',');
                    return `SELECT * FROM ${tableName} WHERE ${singleColumn} IN (${singleValues});`;
                } else {
                    // 多列情况：(列1,列2) IN ((值1,值2),(值3,值4),...)
                    const columnsPart = `(${selectedColumnNames.join(',')})`;
                    const valuesPart = valueTuples.join(',');
                    return `SELECT * FROM ${tableName} WHERE ${columnsPart} IN (${valuesPart});`;
                }

            case 'update':
                if (dataRows.length === 0) {
                    return '没有数据行用于UPDATE操作，请确保选择的表格包含表头和至少一行数据';
                }

                // 获取更新列和查询列
                const setColsInput = document.getElementById('sql-update-set-columns')?.value;
                const whereColsInput = document.getElementById('sql-update-where-columns')?.value;

                let setColumns = columns;
                let whereColumns = columns;

                // 如果设置了更新列，则只使用指定的列
                if (setColsInput && setColsInput.trim()) {
                    const setCols = setColsInput.split(',').map(col => col.trim()).filter(col => col);
                    setColumns = columns.filter((col, idx) => setCols.includes(headers[idx].toLowerCase()));
                } else {
                    setColumns = ''
                }

                // 如果设置了查询列，则只使用指定的列作为WHERE条件
                if (whereColsInput && whereColsInput.trim()) {
                    const whereCols = whereColsInput.split(',').map(col => col.trim()).filter(col => col);
                    whereColumns = columns.filter((col, idx) => whereCols.includes(headers[idx].toLowerCase()));
                } else if (setColumns == '') {
                    // 更新列和查询列都没有设置时，使用所有的列作为查询列
                    const whereCols = columns;
                    whereColumns = columns.filter((col, idx) => whereCols.includes(headers[idx].toLowerCase()));
                }

                // 为每一行数据生成一个UPDATE语句
                const updateStatements = dataRows.map(row => {
                    // 构建SET子句
                    const setPairs = setColumns.map((col, colIdx) => {
                        // 找到对应的表头索引
                        const headerIdx = headers.findIndex(header => `\`${header}\`` === col);
                        return `${col} = '${row[headerIdx]?.textContent.trim().replace(/'/g, "''") || ""}'`;
                    }).join(', ');

                    // 构建WHERE子句
                    const wherePairs = whereColumns.map((col, colIdx) => {
                        // 找到对应的表头索引
                        const headerIdx = headers.findIndex(header => `\`${header}\`` === col);
                        return `${col} = '${row[headerIdx]?.textContent.trim().replace(/'/g, "''") || ""}'`;
                    }).join(' AND ');

                    return `UPDATE ${tableName} SET ${setPairs} WHERE ${wherePairs};`;
                }).join('\n');

                return updateStatements;

            default:
                return '未知SQL操作';
        }
    }
    /**
     * Get selected cells from the table as 2D array
     * @private
     * @returns {HTMLTableCellElement[][]}
     */
    _getSelectedCells2D() {
        // Try to get 2D array from global selection manager
        const globalSelectionManager = this._getGlobalSelectionManager();

        if (globalSelectionManager && typeof globalSelectionManager.getSelectionData === 'function') {
            // Get the 2D structure from the selection manager
            // But we need to return the actual cell elements, not just the text content
            // So we'll use the stored selected cells and convert them to 2D structure

            // Use the stored selected cells to reconstruct 2D structure
            const selectedCells = this.currentSelectedCells || [];
            if (selectedCells.length === 0) return [];

            // Group cells by their row position to create 2D structure
            const rowsMap = new Map();

            selectedCells.forEach(cell => {
                const pos = this._getCellPosition(cell);
                if (pos) {
                    if (!rowsMap.has(pos.row)) {
                        rowsMap.set(pos.row, []);
                    }
                    const row = rowsMap.get(pos.row);
                    // Insert cell at the correct column position to maintain order
                    let insertIndex = row.length;
                    for (let i = 0; i < row.length; i++) {
                        const existingPos = this._getCellPosition(row[i]);
                        if (existingPos && existingPos.col > pos.col) {
                            insertIndex = i;
                            break;
                        }
                    }
                    row.splice(insertIndex, 0, cell);
                }
            });

            // Convert map to sorted 2D array
            const sortedEntries = Array.from(rowsMap.entries()).sort((a, b) => a[0] - b[0]);
            return sortedEntries.map(entry => entry[1]);
        }

        // Fallback: return the currently stored selected cells as a single row
        const selectedCells = this.currentSelectedCells || [];
        return selectedCells.length > 0 ? [selectedCells] : [];
    }

    /**
     * Perform set operations on two columns of data
     * @param {string[]} columnA - First column data
     * @param {string[]} columnB - Second column data
     * @param {string} operation - Operation type
     * @returns {string}
     */
    setOperationOnColumns(columnA, columnB, operation) {
        const setA = new Set(columnA);
        const setB = new Set(columnB);

        let result;
        switch (operation) {
            case 'intersection':
                result = [...setA].filter(item => setB.has(item));
                break;
            case 'union':
                result = [...new Set([...setA, ...setB])];
                break;
            case 'difference-a-b':
                result = [...setA].filter(item => !setB.has(item));
                break;
            case 'difference-b-a':
                result = [...setB].filter(item => !setA.has(item));
                break;
            default:
                result = [];
                break;
        }

        return result.join('\n');
    }

    /**
     * Show result in the result area
     * @param {string} result
     * @param {string} type
     */
    showResult(result, type) {
        const resultArea = document.getElementById('result-area');
        if (resultArea) {
            resultArea.textContent = result;
            resultArea.className = `result-area ${type}`; // Add type class for styling if needed
        }
    }

    /**
     * Show status message in the status message area
     * @param {string} message
     * @param {string} type
     */
    showStatusMessage(message, type = 'info') {
        const statusMessage = document.getElementById('status-message');
        if (statusMessage) {
            statusMessage.textContent = message;
            statusMessage.style.display = 'block';
            statusMessage.className = `status-message ${type}`; // Add type class for styling if needed

            // // Auto-hide after 5 seconds if it's an info message
            // if (type === 'info') {
            //     setTimeout(() => {
            //         statusMessage.style.display = 'none';
            //     }, 5000);
            // }
        }
    }

    /**
     * Copy result to clipboard
     */
    copyResult() {
        const resultArea = document.getElementById('result-area');
        if (resultArea) {
            const text = resultArea.textContent;
            navigator.clipboard.writeText(text).then(() => {
                // Show a temporary message or update UI to indicate success
                console.log('结果已复制到剪贴板');
            }).catch(err => {
                console.error('复制失败:', err);
            });
        }
    }

    /**
     * Export result as a text file
     */
    exportResult() {
        const resultArea = document.getElementById('result-area');
        if (resultArea) {
            const text = resultArea.textContent;
            // Create a blob and download it as a text file
            const blob = new Blob([text], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'table-result.txt';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    }
}

// Export
window.SuperTables = window.SuperTables || {};
window.SuperTables.DrawerManager = DrawerManager;

// Make toggleCollapse method accessible globally for inline onclick handlers
window.SuperTables.DrawerManager.toggleCollapse = DrawerManager.toggleCollapse;
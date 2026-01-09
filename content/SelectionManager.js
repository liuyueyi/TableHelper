/**
 * SelectionManager - Manages cell selection state
 * Uses Set for O(1) lookup performance
 */
class SelectionManager {
  constructor(tableDetector, settingsManager = null) {
    this.tableDetector = tableDetector;
    this.settingsManager = settingsManager;
    this.selectedCells = new Set();
    this.lastSelectedCell = null;
    this.isFullTableSelected = false; // Track if entire table is selected
    this.selectedTable = null; // Reference to selected table
    this.onSelectionChange = null; // Callback for selection changes
  }

  /**
   * Check if a cell is selected
   * @param {HTMLTableCellElement} cell
   * @returns {boolean}
   */
  isSelected(cell) {
    return this.selectedCells.has(cell);
  }

  /**
   * Get count of selected cells
   * @returns {number}
   */
  getSelectionCount() {
    return this.selectedCells.size;
  }

  /**
   * Get all selected cells
   * @returns {HTMLTableCellElement[]}
   */
  getSelectedCells() {
    return Array.from(this.selectedCells);
  }

  /**
   * Get only visible selected cells (filtered rows are excluded)
   * @returns {HTMLTableCellElement[]}
   */
  getVisibleSelectedCells() {
    return Array.from(this.selectedCells).filter(cell =>
      this.tableDetector.isCellVisible(cell)
    );
  }

  /**
   * Toggle selection of a single cell
   * @param {HTMLTableCellElement} cell
   * @param {boolean} [additive=false] - If true, add to existing selection
   */
  toggleCell(cell, additive = false) {
    if (!this.tableDetector.isTableCell(cell)) return;

    if (!additive) {
      this.clearSelection(false);
    }

    if (this.selectedCells.has(cell)) {
      this._removeCell(cell);
    } else {
      this._addCell(cell);
    }

    this.lastSelectedCell = cell;
    this._notifyChange();
  }

  /**
   * Select a single cell
   * @param {HTMLTableCellElement} cell
   * @param {boolean} [additive=false] - If true, add to existing selection
   */
  selectCell(cell, additive = false) {
    if (!this.tableDetector.isTableCell(cell)) return;

    if (!additive) {
      this.clearSelection(false);
    }

    this._addCell(cell);
    this.lastSelectedCell = cell;
    this._notifyChange();
  }

  /**
   * Select an entire row
   * @param {HTMLTableCellElement} cell - Any cell in the row
   * @param {boolean} [additive=false]
   */
  selectRow(cell, additive = false) {
    if (!this.tableDetector.isTableCell(cell)) return;

    if (!additive) {
      this.clearSelection(false);
    }

    // Only select visible cells (filtered rows are excluded)
    const rowCells = this.tableDetector.getRowCells(cell, true);
    rowCells.forEach(c => this._addCell(c));

    this.lastSelectedCell = cell;
    this._notifyChange();
  }

  /**
   * Select an entire column
   * @param {HTMLTableCellElement} cell - Any cell in the column
   * @param {boolean} [additive=false]
   */
  selectColumn(cell, additive = false) {
    if (!this.tableDetector.isTableCell(cell)) return;

    if (!additive) {
      this.clearSelection(false);
    }

    // Only select visible cells (filtered rows are excluded)
    const colCells = this.tableDetector.getColumnCells(cell, true);
    const includeHeader = this.settingsManager?.get('columnIncludeHeader') ?? false;

    colCells.forEach(c => {
      // Skip header cells (th) if setting is disabled
      if (!includeHeader && c.tagName.toUpperCase() === 'TH') {
        return;
      }
      // Also check if cell is in thead
      if (!includeHeader && c.closest('thead')) {
        return;
      }
      this._addCell(c);
    });

    this.isFullTableSelected = false;
    this.selectedTable = null;
    this.lastSelectedCell = cell;
    this._notifyChange();
  }

  /**
   * Select entire table
   * @param {HTMLTableElement} table
   * @param {boolean} [additive=false]
   */
  selectTable(table, additive = false) {
    if (!table || table.tagName !== 'TABLE') return;

    if (!additive) {
      this.clearSelection(false);
    }

    // Only select visible cells (filtered rows are excluded)
    const allCells = this.tableDetector.getAllCells(table, true);
    allCells.forEach(c => this._addCell(c));

    this.isFullTableSelected = true;
    this.selectedTable = table;
    this._notifyChange();
  }

  /**
   * Select a range of cells between two cells
   * @param {HTMLTableCellElement} startCell
   * @param {HTMLTableCellElement} endCell
   * @param {boolean} [additive=false]
   */
  selectRange(startCell, endCell, additive = false) {
    const table = this.tableDetector.getTableFromCell(startCell);
    const table2 = this.tableDetector.getTableFromCell(endCell);

    if (!table || table !== table2) return;

    const startPos = this.tableDetector.getCellPosition(startCell);
    const endPos = this.tableDetector.getCellPosition(endCell);

    if (!startPos || !endPos) return;

    if (!additive) {
      this.clearSelection(false);
    }

    const structure = this.tableDetector.getTableStructure(table);
    const minRow = Math.min(startPos.row, endPos.row);
    const maxRow = Math.max(startPos.row, endPos.row);
    const minCol = Math.min(startPos.col, endPos.col);
    const maxCol = Math.max(startPos.col, endPos.col);

    const cellsToSelect = new Set();

    for (let r = minRow; r <= maxRow; r++) {
      for (let c = minCol; c <= maxCol; c++) {
        const gridCell = structure.grid[r]?.[c];
        // Only select visible cells (filtered rows are excluded)
        if (gridCell && gridCell.cell && this.tableDetector.isCellVisible(gridCell.cell)) {
          cellsToSelect.add(gridCell.cell);
        }
      }
    }

    cellsToSelect.forEach(c => this._addCell(c));
    this._notifyChange();
  }

  /**
   * Clear all selection
   * @param {boolean} [notify=true]
   */
  clearSelection(notify = true) {
    this.selectedCells.forEach(cell => {
      cell.classList.remove('st-selected');
    });
    this.selectedCells.clear();
    this.lastSelectedCell = null;
    this.isFullTableSelected = false;
    this.selectedTable = null;

    if (notify) {
      this._notifyChange();
    }
  }

  /**
   * Add cell to selection
   * @private
   */
  _addCell(cell) {
    if (!this.selectedCells.has(cell)) {
      this.selectedCells.add(cell);
      cell.classList.add('st-selected');
    }
  }

  /**
   * Remove cell from selection
   * @private
   */
  _removeCell(cell) {
    if (this.selectedCells.has(cell)) {
      this.selectedCells.delete(cell);
      cell.classList.remove('st-selected');
    }
  }

  /**
   * Notify selection change
   * @private
   */
  _notifyChange() {
    if (typeof this.onSelectionChange === 'function') {
      // Only pass visible cells to stats panel (filtered rows are excluded)
      this.onSelectionChange(this.getVisibleSelectedCells());
    }
  }

  /**
   * Get text content from selected cells
   * @returns {string[][]} 2D array of cell contents
   */
  getSelectionData() {
    // Only get visible selected cells (filtered rows are excluded)
    const cells = this.getVisibleSelectedCells();
    if (cells.length === 0) return [];

    // Find the table and organize cells by their grid position
    const table = this.tableDetector.getTableFromCell(cells[0]);
    if (!table) return cells.map(c => [c.innerText.trim()]);

    const structure = this.tableDetector.getTableStructure(table);
    const keepEmptyPlaceholders = this.settingsManager?.get('copyKeepEmptyPlaceholders') ?? false;

    // Create a set of visible selected cells for quick lookup
    const visibleSelectedSet = new Set(cells);

    // Find bounds of selection (only considering visible cells)
    let minRow = Infinity, maxRow = -Infinity;
    let minCol = Infinity, maxCol = -Infinity;

    const selectedPositions = new Map();

    cells.forEach(cell => {
      const pos = this.tableDetector.getCellPosition(cell);
      if (pos) {
        minRow = Math.min(minRow, pos.row);
        maxRow = Math.max(maxRow, pos.row);
        minCol = Math.min(minCol, pos.col);
        maxCol = Math.max(maxCol, pos.col);
        selectedPositions.set(cell, pos);
      }
    });

    // Build 2D array
    const data = [];
    for (let r = minRow; r <= maxRow; r++) {
      // Skip hidden rows entirely
      const rowElement = structure.grid[r]?.[0]?.cell?.closest('tr');
      if (rowElement && !this.tableDetector.isRowVisible(rowElement)) {
        continue;
      }

      const rowData = [];
      for (let c = minCol; c <= maxCol; c++) {
        const gridCell = structure.grid[r]?.[c];
        if (gridCell && gridCell.cell && visibleSelectedSet.has(gridCell.cell)) {
          // Only add content for origin cells to avoid duplicates
          if (gridCell.isOrigin) {
            rowData.push(gridCell.cell.innerText.trim());
          } else {
            // Check if origin is in this row's selection
            const originInSameRow = gridCell.originRow === r;
            if (!originInSameRow && keepEmptyPlaceholders) {
              rowData.push(''); // Empty for spanned cells
            }
          }
        } else {
          // Cell not selected - only add empty placeholder if setting is enabled
          if (keepEmptyPlaceholders) {
            rowData.push('');
          }
        }
      }
      if (rowData.length > 0) {
        data.push(rowData);
      }
    }

    return data;
  }
}

// Export
window.SuperTables = window.SuperTables || {};
window.SuperTables.SelectionManager = SelectionManager;

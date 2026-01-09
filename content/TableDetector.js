/**
 * TableDetector - Detects and caches table structures
 * Performance optimized: Uses WeakMap for caching, lazy detection
 */
class TableDetector {
  constructor() {
    // Cache table structures to avoid re-parsing
    this.tableCache = new WeakMap();
    // Cache cell positions for quick lookup
    this.cellPositionCache = new WeakMap();
    // Track observed tables for MutationObserver
    this.observedTables = new WeakMap();
    // Callback when table structure changes
    this.onTableChange = null;
  }

  /**
   * Start observing a table for DOM changes
   * @param {HTMLTableElement} table
   */
  _observeTable(table) {
    if (this.observedTables.has(table)) return;

    // Tags that represent table structure
    const structuralTags = new Set(['TR', 'TD', 'TH', 'TBODY', 'THEAD', 'TFOOT', 'COLGROUP', 'COL']);

    const observer = new MutationObserver((mutations) => {
      // Check if structure actually changed (not just text content or other DOM changes)
      let structureChanged = false;

      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          // Only care about structural elements being added/removed
          const checkNodes = (nodes) => {
            for (const node of nodes) {
              if (node.nodeType === Node.ELEMENT_NODE) {
                const tagName = node.tagName?.toUpperCase();
                if (structuralTags.has(tagName)) {
                  return true;
                }
                // Also check if the node contains structural elements
                if (node.querySelector && node.querySelector('tr, td, th, tbody, thead, tfoot')) {
                  return true;
                }
              }
            }
            return false;
          };

          if (checkNodes(mutation.addedNodes) || checkNodes(mutation.removedNodes)) {
            structureChanged = true;
            break;
          }
        } else if (mutation.type === 'attributes') {
          // colspan/rowspan changed on a cell
          const attr = mutation.attributeName;
          if (attr === 'colspan' || attr === 'rowspan') {
            structureChanged = true;
            break;
          }
        }
      }

      if (structureChanged) {
        this._invalidateTableCache(table);
      }
    });

    observer.observe(table, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['colspan', 'rowspan']
    });

    this.observedTables.set(table, observer);
  }

  /**
   * Invalidate cache for a specific table
   * @param {HTMLTableElement} table
   */
  _invalidateTableCache(table) {
    // Get old structure to clear cell position cache
    const oldStructure = this.tableCache.get(table);
    if (oldStructure && oldStructure.cells) {
      oldStructure.cells.forEach(cell => {
        this.cellPositionCache.delete(cell);
      });
    }

    // Clear table cache
    this.tableCache.delete(table);

    // Notify listeners
    if (this.onTableChange) {
      this.onTableChange(table);
    }
  }

  /**
   * Find the table element containing a cell
   * @param {HTMLElement} cell - td or th element
   * @returns {HTMLTableElement|null}
   */
  getTableFromCell(cell) {
    return cell.closest('table');
  }

  /**
   * Check if an element is a table cell
   * @param {HTMLElement} element
   * @returns {boolean}
   */
  isTableCell(element) {
    if (!element) return false;
    const tagName = element.tagName?.toUpperCase();
    return tagName === 'TD' || tagName === 'TH';
  }

  /**
   * Check if a table row is visible (not hidden by filtering)
   * @param {HTMLTableRowElement} row
   * @returns {boolean}
   */
  isRowVisible(row) {
    if (!row) return false;
    // Check computed style for display and visibility
    const style = window.getComputedStyle(row);
    return style.display !== 'none' && style.visibility !== 'hidden';
  }

  /**
   * Check if a table cell is visible (its row is not hidden)
   * @param {HTMLTableCellElement} cell
   * @returns {boolean}
   */
  isCellVisible(cell) {
    if (!cell) return false;
    const row = cell.closest('tr');
    return this.isRowVisible(row);
  }

  /**
   * Find the closest table cell from an element
   * @param {HTMLElement} element
   * @returns {HTMLTableCellElement|null}
   */
  findCell(element) {
    if (!element) return null;
    return element.closest('td, th');
  }

  /**
   * Get table structure (cached)
   * @param {HTMLTableElement} table
   * @returns {Object} Table structure info
   */
  getTableStructure(table) {
    if (this.tableCache.has(table)) {
      return this.tableCache.get(table);
    }

    const structure = this._parseTableStructure(table);
    this.tableCache.set(table, structure);

    // Start observing this table for changes
    this._observeTable(table);

    return structure;
  }

  /**
   * Parse table structure
   * @private
   */
  _parseTableStructure(table) {
    const rows = Array.from(table.rows);
    const structure = {
      rows: rows.length,
      cols: 0,
      cells: [],
      grid: [] // 2D grid accounting for colspan/rowspan
    };

    if (rows.length === 0) return structure;

    // Calculate max columns considering colspan
    let maxCols = 0;
    rows.forEach(row => {
      let colCount = 0;
      Array.from(row.cells).forEach(cell => {
        colCount += cell.colSpan || 1;
      });
      maxCols = Math.max(maxCols, colCount);
    });
    structure.cols = maxCols;

    // Build grid accounting for colspan and rowspan
    const grid = Array(rows.length).fill(null).map(() => Array(maxCols).fill(null));

    rows.forEach((row, rowIndex) => {
      let colIndex = 0;
      Array.from(row.cells).forEach(cell => {
        // Find next available column
        while (colIndex < maxCols && grid[rowIndex][colIndex] !== null) {
          colIndex++;
        }

        const colspan = cell.colSpan || 1;
        const rowspan = cell.rowSpan || 1;

        // Fill grid with cell reference
        for (let r = 0; r < rowspan && rowIndex + r < rows.length; r++) {
          for (let c = 0; c < colspan && colIndex + c < maxCols; c++) {
            grid[rowIndex + r][colIndex + c] = {
              cell,
              isOrigin: r === 0 && c === 0,
              originRow: rowIndex,
              originCol: colIndex
            };
          }
        }

        // Cache cell position
        this.cellPositionCache.set(cell, {
          row: rowIndex,
          col: colIndex,
          rowspan,
          colspan
        });

        structure.cells.push(cell);
        colIndex += colspan;
      });
    });

    structure.grid = grid;
    return structure;
  }

  /**
   * Get cell position in table
   * @param {HTMLTableCellElement} cell
   * @returns {Object|null} {row, col, rowspan, colspan}
   */
  getCellPosition(cell) {
    if (this.cellPositionCache.has(cell)) {
      return this.cellPositionCache.get(cell);
    }

    const table = this.getTableFromCell(cell);
    if (!table) return null;

    // This will populate the cache
    this.getTableStructure(table);
    return this.cellPositionCache.get(cell) || null;
  }

  /**
   * Get all cells in a row
   * @param {HTMLTableCellElement} cell - Any cell in the row
   * @param {boolean} [visibleOnly=false] - If true, only return visible cells
   * @returns {HTMLTableCellElement[]}
   */
  getRowCells(cell, visibleOnly = false) {
    const table = this.getTableFromCell(cell);
    if (!table) return [cell];

    const position = this.getCellPosition(cell);
    if (!position) return [cell];

    const structure = this.getTableStructure(table);
    const rowCells = new Set();

    // Get all cells that span into this row
    structure.grid[position.row]?.forEach(gridCell => {
      if (gridCell && gridCell.cell) {
        if (!visibleOnly || this.isCellVisible(gridCell.cell)) {
          rowCells.add(gridCell.cell);
        }
      }
    });

    return Array.from(rowCells);
  }

  /**
   * Get all cells in a column
   * @param {HTMLTableCellElement} cell - Any cell in the column
   * @param {boolean} [visibleOnly=false] - If true, only return visible cells
   * @returns {HTMLTableCellElement[]}
   */
  getColumnCells(cell, visibleOnly = false) {
    const table = this.getTableFromCell(cell);
    if (!table) return [cell];

    const position = this.getCellPosition(cell);
    if (!position) return [cell];

    const structure = this.getTableStructure(table);
    const colCells = new Set();

    // Get all cells that span into this column
    structure.grid.forEach(row => {
      const gridCell = row[position.col];
      if (gridCell && gridCell.cell) {
        if (!visibleOnly || this.isCellVisible(gridCell.cell)) {
          colCells.add(gridCell.cell);
        }
      }
    });

    return Array.from(colCells);
  }

  /**
   * Get all cells in a table
   * @param {HTMLTableElement} table
   * @param {boolean} [visibleOnly=false] - If true, only return visible cells
   * @returns {HTMLTableCellElement[]}
   */
  getAllCells(table, visibleOnly = false) {
    const structure = this.getTableStructure(table);
    if (!visibleOnly) {
      return structure.cells;
    }
    return structure.cells.filter(cell => this.isCellVisible(cell));
  }

  /**
   * Clear cache for a specific table or all
   * @param {HTMLTableElement} [table] - If not provided, clears all
   */
  clearCache(table) {
    if (table) {
      this.tableCache.delete(table);
      // Can't easily clear cellPositionCache for specific table
      // but WeakMap will handle GC
    }
  }

  /**
   * Find all tables in the document
   * @returns {HTMLTableElement[]}
   */
  findAllTables() {
    return Array.from(document.querySelectorAll('table'));
  }
}

// Export for use in other modules
window.SuperTables = window.SuperTables || {};
window.SuperTables.TableDetector = TableDetector;

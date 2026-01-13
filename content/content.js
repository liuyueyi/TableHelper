/**
 * SuperTables - Main Content Script
 * Table cell selection for Chrome
 */
(function () {
  'use strict';

  // Prevent double initialization
  if (window.SuperTablesInitialized) return;
  window.SuperTablesInitialized = true;

  const {
    TableDetector,
    SelectionManager,
    StatsPanel,
    ClipboardHandler,
    SettingsManager,
    ExcelExporter
  } = window.SuperTables;

  // Initialize modules
  const settingsManager = new SettingsManager();
  const tableDetector = new TableDetector();
  const selectionManager = new SelectionManager(tableDetector, settingsManager);
  const statsPanel = new StatsPanel();
  const clipboardHandler = new ClipboardHandler(selectionManager);
  const excelExporter = new ExcelExporter();

  // Expose the selection manager globally so other modules can access it
  window.SuperTables = window.SuperTables || {};
  window.SuperTables.contentScript = window.SuperTables.contentScript || {};
  window.SuperTables.contentScript.selectionManager = selectionManager;

  // Track modifier key state
  let modifierState = {
    cmd: false,
    alt: false,
    shift: false
  };

  // Track if we're in selection mode
  let isSelectionMode = false;
  let hoveredCell = null;

  // Track anchor cell for Shift range selection
  let anchorCell = null;

  // Track double-click for selectAll
  let firstClickTime = null;
  let firstClickCell = null;

  // Select-all button element
  let selectAllButton = null;
  let currentHoveredTable = null;

  // Detect platform
  const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform);

  /**
   * Check if the modifier key for selection is pressed
   */
  function isCmdPressed(e) {
    return isMac ? e.metaKey : e.ctrlKey;
  }

  /**
   * Determine selection mode based on user's shortcut settings
   * Returns: 'cell', 'row', 'column', 'selectAll', or null
   */
  function getSelectionMode(e, isDoubleClick = false) {
    const mode = settingsManager.getSelectionMode(e);

    // Check if this is a selectAll action
    if (mode === 'cell' && isDoubleClick) {
      const shortcuts = settingsManager.get('shortcuts');
      const shortcut = shortcuts && shortcuts.selectAll;
      console.log('判断是否为双击:', shortcut)
      if (shortcut && shortcut.doubleClick) {
        // Check if the modifiers match
        const isCmd = isMac ? e.metaKey : e.ctrlKey;
        const isAlt = e.altKey;
        const isShift = e.shiftKey;

        const hasCmd = shortcut.modifiers.includes('cmd') && isCmd;
        const hasAlt = shortcut.modifiers.includes('alt') && isAlt;
        const hasShift = shortcut.modifiers.includes('shift') && isShift;

        // Check if all required modifiers are pressed and no extra ones
        const requiredMods = shortcut.modifiers.length;
        const actualMods = (isCmd ? 1 : 0) + (isAlt ? 1 : 0) + (isShift ? 1 : 0);

        if (hasCmd === (shortcut.modifiers.includes('cmd')) &&
          hasAlt === (shortcut.modifiers.includes('alt')) &&
          hasShift === (shortcut.modifiers.includes('shift')) &&
          requiredMods === actualMods) {
          return 'selectAll';
        }
      }
    }

    return mode;
  }

  /**
   * Create the select-all button
   */
  function createSelectAllButton() {
    if (selectAllButton) return;

    selectAllButton = document.createElement('div');
    selectAllButton.className = 'st-select-all-btn';
    selectAllButton.innerHTML = `
      <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
        <path d="M3 3h18v18H3V3zm2 2v5h5V5H5zm7 0v5h7V5h-7zm-7 7v5h5v-5H5zm7 0v5h7v-5h-7z"/>
      </svg>
      <span>全选</span>
    `;
    selectAllButton.style.cssText = `
      position: absolute;
      display: none;
      align-items: center;
      gap: 4px;
      padding: 4px 8px;
      background: #6BCB77;
      color: white;
      border-radius: 4px;
      font-size: 11px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      cursor: pointer;
      z-index: 2147483646;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      transition: background 0.15s ease, transform 0.1s ease;
      user-select: none;
    `;

    selectAllButton.addEventListener('mouseenter', () => {
      selectAllButton.style.background = '#54a05d';
    });

    selectAllButton.addEventListener('mouseleave', () => {
      selectAllButton.style.background = '#6BCB77';
    });

    selectAllButton.addEventListener('mousedown', (e) => {
      e.preventDefault();
      e.stopPropagation();
    });

    selectAllButton.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (currentHoveredTable) {
        selectionManager.selectTable(currentHoveredTable);
        anchorCell = null;
      }
    });

    document.body.appendChild(selectAllButton);
  }

  /**
   * Show select-all button for a table
   */
  function showSelectAllButton(table) {
    if (!selectAllButton || !table) return;

    currentHoveredTable = table;

    const rect = table.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    // Position at top-right corner of the table
    selectAllButton.style.top = (rect.top + scrollTop - 4) + 'px';
    selectAllButton.style.left = (rect.right + scrollLeft - selectAllButton.offsetWidth - 4) + 'px';
    selectAllButton.style.display = 'flex';
  }

  /**
   * Hide select-all button
   */
  function hideSelectAllButton() {
    if (selectAllButton) {
      selectAllButton.style.display = 'none';
    }
    currentHoveredTable = null;
  }

  /**
   * Update modifier state and selection mode
   */
  function updateModifierState(e) {
    const newCmd = isCmdPressed(e);
    const newAlt = e.altKey;
    const newShift = e.shiftKey;

    const stateChanged = (
      modifierState.cmd !== newCmd ||
      modifierState.alt !== newAlt ||
      modifierState.shift !== newShift
    );

    modifierState.cmd = newCmd;
    modifierState.alt = newAlt;
    modifierState.shift = newShift;

    const mode = getSelectionMode(e);
    const wasInSelectionMode = isSelectionMode;
    isSelectionMode = mode !== null;

    // Show/hide select-all button based on cell selection mode
    if (mode === 'cell' && hoveredCell) {
      const table = tableDetector.getTableFromCell(hoveredCell);
      if (table) {
        showSelectAllButton(table);
      }
    } else {
      hideSelectAllButton();
    }

    if (stateChanged) {
      updateHoverPreview();
    }

    if (isSelectionMode !== wasInSelectionMode) {
      document.body.classList.toggle('st-selecting', isSelectionMode);
    }
  }

  /**
   * Clear hover preview
   */
  function clearHoverPreview() {
    document.querySelectorAll('.st-hover-preview, .st-row-preview, .st-col-preview, .st-table-highlight')
      .forEach(el => {
        el.classList.remove('st-hover-preview', 'st-row-preview', 'st-col-preview', 'st-table-highlight');
      });
  }

  /**
   * Update hover preview based on current mode
   */
  function updateHoverPreview() {
    clearHoverPreview();

    if (!isSelectionMode || !hoveredCell) return;

    const mode = getSelectionMode({
      metaKey: isMac ? modifierState.cmd : false,
      ctrlKey: isMac ? false : modifierState.cmd,
      altKey: modifierState.alt,
      shiftKey: modifierState.shift
    });

    // If shift is pressed and we have an anchor, show range preview
    if (modifierState.shift && anchorCell) {
      showRangePreview(anchorCell, hoveredCell, mode);
      return;
    }

    switch (mode) {
      case 'cell':
        hoveredCell.classList.add('st-hover-preview');
        break;

      case 'row':
        tableDetector.getRowCells(hoveredCell).forEach(cell => {
          cell.classList.add('st-hover-preview');
        });
        break;

      case 'column':
        const colCells = tableDetector.getColumnCells(hoveredCell);
        const includeHeader = settingsManager.get('columnIncludeHeader');
        colCells.forEach(cell => {
          if (!includeHeader && (cell.tagName.toUpperCase() === 'TH' || cell.closest('thead'))) {
            return;
          }
          cell.classList.add('st-hover-preview');
        });
        break;
    }
  }

  /**
   * Show range preview between anchor and current cell
   */
  function showRangePreview(startCell, endCell, mode) {
    const table = tableDetector.getTableFromCell(startCell);
    const table2 = tableDetector.getTableFromCell(endCell);

    if (!table || table !== table2) return;

    const startPos = tableDetector.getCellPosition(startCell);
    const endPos = tableDetector.getCellPosition(endCell);

    if (!startPos || !endPos) return;

    const structure = tableDetector.getTableStructure(table);
    let minRow, maxRow, minCol, maxCol;

    if (mode === 'row') {
      // For row mode, select all columns but range of rows
      minRow = Math.min(startPos.row, endPos.row);
      maxRow = Math.max(startPos.row, endPos.row);
      minCol = 0;
      maxCol = structure.colCount - 1;
    } else if (mode === 'column') {
      // For column mode, select all rows but range of columns
      minRow = 0;
      maxRow = structure.rowCount - 1;
      minCol = Math.min(startPos.col, endPos.col);
      maxCol = Math.max(startPos.col, endPos.col);
    } else {
      // Cell mode - rectangular selection
      minRow = Math.min(startPos.row, endPos.row);
      maxRow = Math.max(startPos.row, endPos.row);
      minCol = Math.min(startPos.col, endPos.col);
      maxCol = Math.max(startPos.col, endPos.col);
    }

    const includeHeader = settingsManager.get('columnIncludeHeader');

    for (let r = minRow; r <= maxRow; r++) {
      for (let c = minCol; c <= maxCol; c++) {
        const gridCell = structure.grid[r]?.[c];
        if (gridCell && gridCell.cell) {
          // Skip headers in column mode if setting is disabled
          if (mode === 'column' && !includeHeader) {
            const cell = gridCell.cell;
            if (cell.tagName.toUpperCase() === 'TH' || cell.closest('thead')) {
              continue;
            }
          }
          gridCell.cell.classList.add('st-hover-preview');
        }
      }
    }
  }

  /**
   * Handle mouse move for hover preview
   */
  let rafId = null;
  function handleMouseMove(e) {
    if (rafId) return;

    rafId = requestAnimationFrame(() => {
      rafId = null;

      const cell = tableDetector.findCell(e.target);

      if (cell !== hoveredCell) {
        hoveredCell = cell;

        // Update select-all button position if in cell selection mode
        if (isSelectionMode && cell) {
          const currentMode = getSelectionMode({
            metaKey: isMac ? modifierState.cmd : false,
            ctrlKey: isMac ? false : modifierState.cmd,
            altKey: modifierState.alt,
            shiftKey: modifierState.shift
          });
          if (currentMode === 'cell') {
            const table = tableDetector.getTableFromCell(cell);
            if (table && table !== currentHoveredTable) {
              showSelectAllButton(table);
            }
          }
        }

        if (isSelectionMode) {
          updateHoverPreview();
        }
      }
    });
  }

  /**
   * Handle mousedown to prevent text selection in selection mode
   */
  function handleMouseDown(e) {
    const mode = getSelectionMode(e);
    if (!mode) return;

    const cell = tableDetector.findCell(e.target);
    if (!cell) return;

    // Prevent default text selection behavior
    e.preventDefault();

    // Clear any existing text selection
    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
    }
  }

  /**
   * Select range of rows between two cells
   */
  function selectRowRange(startCell, endCell, additive = false) {
    const table = tableDetector.getTableFromCell(startCell);
    const table2 = tableDetector.getTableFromCell(endCell);

    if (!table || table !== table2) return;

    const startPos = tableDetector.getCellPosition(startCell);
    const endPos = tableDetector.getCellPosition(endCell);

    if (!startPos || !endPos) return;

    if (!additive) {
      selectionManager.clearSelection(false);
    }

    const structure = tableDetector.getTableStructure(table);
    const minRow = Math.min(startPos.row, endPos.row);
    const maxRow = Math.max(startPos.row, endPos.row);

    for (let r = minRow; r <= maxRow; r++) {
      for (let c = 0; c < structure.colCount; c++) {
        const gridCell = structure.grid[r]?.[c];
        if (gridCell && gridCell.cell && gridCell.isOrigin) {
          selectionManager._addCell(gridCell.cell);
        }
      }
    }

    selectionManager._notifyChange();
  }

  /**
   * Select range of columns between two cells
   */
  function selectColumnRange(startCell, endCell, additive = false) {
    const table = tableDetector.getTableFromCell(startCell);
    const table2 = tableDetector.getTableFromCell(endCell);

    if (!table || table !== table2) return;

    const startPos = tableDetector.getCellPosition(startCell);
    const endPos = tableDetector.getCellPosition(endCell);

    if (!startPos || !endPos) return;

    if (!additive) {
      selectionManager.clearSelection(false);
    }

    const structure = tableDetector.getTableStructure(table);
    const minCol = Math.min(startPos.col, endPos.col);
    const maxCol = Math.max(startPos.col, endPos.col);
    const includeHeader = settingsManager.get('columnIncludeHeader');

    for (let r = 0; r < structure.rowCount; r++) {
      for (let c = minCol; c <= maxCol; c++) {
        const gridCell = structure.grid[r]?.[c];
        if (gridCell && gridCell.cell && gridCell.isOrigin) {
          const cell = gridCell.cell;
          // Skip headers if setting is disabled
          if (!includeHeader && (cell.tagName.toUpperCase() === 'TH' || cell.closest('thead'))) {
            continue;
          }
          selectionManager._addCell(cell);
        }
      }
    }

    selectionManager._notifyChange();
  }

  /**
   * Handle click for selection
   */
  function handleClick(e) {
    const currentTime = Date.now();
    const cell = tableDetector.findCell(e.target);
    if (!cell) return;

    const isDoubleClick = (firstClickCell === cell && currentTime - firstClickTime < 500);
    const mode = getSelectionMode(e, isDoubleClick);
    console.log('判断是否为双击:', isDoubleClick, mode)
    if (!mode) return;

    e.preventDefault();
    e.stopPropagation();

    // Clear any text selection that might have occurred
    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
    }

    // Handle double click for selectAll
    if (mode === 'selectAll') {
      const table = tableDetector.getTableFromCell(cell);
      if (table) {
        selectionManager.selectTable(table, false);
        anchorCell = null;
        // Reset double click tracker
        firstClickTime = null;
        firstClickCell = null;
      }
      return;
    }

    const isShift = e.shiftKey;

    // Handle Shift+Click for range selection
    if (isShift && anchorCell) {
      const anchorTable = tableDetector.getTableFromCell(anchorCell);
      const clickedTable = tableDetector.getTableFromCell(cell);

      if (anchorTable === clickedTable) {
        switch (mode) {
          case 'cell':
            selectionManager.selectRange(anchorCell, cell, false);
            break;
          case 'row':
            selectRowRange(anchorCell, cell, false);
            break;
          case 'column':
            selectColumnRange(anchorCell, cell, false);
            break;
        }
        return;
      }
    }

    // Handle single click
    anchorCell = cell;

    // Update double click tracker
    firstClickTime = currentTime;
    firstClickCell = cell;

    // Clear the double click tracker after delay
    setTimeout(() => {
      if (firstClickTime && currentTime === firstClickTime) {
        firstClickTime = null;
        firstClickCell = null;
      }
    }, 500);

    switch (mode) {
      case 'cell':
        selectionManager.toggleCell(cell, true);
        break;

      case 'row':
        // Cmd+Alt+Click for row - additive mode for multi-row selection
        selectionManager.selectRow(cell, true);
        break;

      case 'column':
        // Alt+Click for column - additive mode for multi-column selection
        selectionManager.selectColumn(cell, true);
        break;
    }
  }

  /**
   * Check if there's a native text selection
   */
  function hasNativeTextSelection() {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return false;

    const selectedText = selection.toString().trim();
    return selectedText.length > 0;
  }

  /**
   * Handle keydown events
   */
  function handleKeyDown(e) {
    updateModifierState(e);

    // Handle Cmd/Ctrl+C for copy
    // Only intercept if:
    // 1. There's no native text selection (let system handle native copy)
    // 2. We have SuperTables selected cells
    if (isCmdPressed(e) && e.key.toLowerCase() === 'c' && !e.altKey && !e.shiftKey) {
      if (!hasNativeTextSelection() && selectionManager.getSelectionCount() > 0) {
        e.preventDefault();
        clipboardHandler.copy();
      }
      // If there's native text selection, let the browser handle Cmd+C normally
    }

    // Handle Cmd+Shift+Down - Extend selection to bottom of column
    if (isCmdPressed(e) && e.shiftKey && e.key === 'ArrowDown') {
      const startCell = anchorCell || selectionManager.lastSelectedCell;
      if (startCell) {
        e.preventDefault();
        extendSelectionToColumnEnd(startCell);
      }
    }

    // Handle Cmd+Shift+Up - Extend selection to top of column
    if (isCmdPressed(e) && e.shiftKey && e.key === 'ArrowUp') {
      const startCell = anchorCell || selectionManager.lastSelectedCell;
      if (startCell) {
        e.preventDefault();
        extendSelectionToColumnStart(startCell);
      }
    }

    // Handle Cmd+Shift+Right - Extend selection to end of row
    if (isCmdPressed(e) && e.shiftKey && e.key === 'ArrowRight') {
      const startCell = anchorCell || selectionManager.lastSelectedCell;
      if (startCell) {
        e.preventDefault();
        extendSelectionToRowEnd(startCell);
      }
    }

    // Handle Cmd+Shift+Left - Extend selection to start of row
    if (isCmdPressed(e) && e.shiftKey && e.key === 'ArrowLeft') {
      const startCell = anchorCell || selectionManager.lastSelectedCell;
      if (startCell) {
        e.preventDefault();
        extendSelectionToRowStart(startCell);
      }
    }

    // Handle Escape to clear selection
    if (e.key === 'Escape') {
      selectionManager.clearSelection();
      clearHoverPreview();
      hideSelectAllButton();
      anchorCell = null;
    }
  }

  /**
   * Get the current selection bounds
   * @returns {Object|null} {table, minRow, maxRow, minCol, maxCol, structure}
   */
  function getSelectionBounds() {
    const cells = selectionManager.getSelectedCells();
    if (cells.length === 0) return null;

    const table = tableDetector.getTableFromCell(cells[0]);
    if (!table) return null;

    const structure = tableDetector.getTableStructure(table);
    let minRow = Infinity, maxRow = -Infinity;
    let minCol = Infinity, maxCol = -Infinity;

    cells.forEach(cell => {
      const pos = tableDetector.getCellPosition(cell);
      if (pos) {
        minRow = Math.min(minRow, pos.row);
        maxRow = Math.max(maxRow, pos.row);
        minCol = Math.min(minCol, pos.col);
        maxCol = Math.max(maxCol, pos.col);
      }
    });

    return { table, structure, minRow, maxRow, minCol, maxCol };
  }

  /**
   * Select a rectangular range and scroll to target cell
   */
  function selectRangeAndScroll(structure, minRow, maxRow, minCol, maxCol, scrollToCell) {
    selectionManager.clearSelection(false);

    for (let r = minRow; r <= maxRow; r++) {
      for (let c = minCol; c <= maxCol; c++) {
        const gridCell = structure.grid[r]?.[c];
        if (gridCell && gridCell.cell) {
          selectionManager._addCell(gridCell.cell);
        }
      }
    }

    selectionManager._notifyChange();

    if (scrollToCell) {
      scrollToCell.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    }
  }

  /**
   * Extend selection to the bottom of the column
   */
  function extendSelectionToColumnEnd(startCell) {
    const bounds = getSelectionBounds();
    if (!bounds) {
      // No selection, use startCell
      const table = tableDetector.getTableFromCell(startCell);
      if (!table) return;
      const pos = tableDetector.getCellPosition(startCell);
      if (!pos) return;
      const structure = tableDetector.getTableStructure(table);

      // Find the last row
      let lastRow = pos.row;
      for (let r = structure.grid.length - 1; r >= pos.row; r--) {
        if (structure.grid[r]?.[pos.col]?.cell) {
          lastRow = r;
          break;
        }
      }

      const endCell = structure.grid[lastRow]?.[pos.col]?.cell;
      selectionManager.selectRange(startCell, endCell, false);
      anchorCell = startCell;
      if (endCell) endCell.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const { structure, minRow, minCol, maxCol } = bounds;

    // Find the last row for current column range
    let newMaxRow = bounds.maxRow;
    for (let r = structure.grid.length - 1; r >= bounds.maxRow; r--) {
      let hasCell = false;
      for (let c = minCol; c <= maxCol; c++) {
        if (structure.grid[r]?.[c]?.cell) {
          hasCell = true;
          break;
        }
      }
      if (hasCell) {
        newMaxRow = r;
        break;
      }
    }

    const scrollCell = structure.grid[newMaxRow]?.[maxCol]?.cell;
    selectRangeAndScroll(structure, minRow, newMaxRow, minCol, maxCol, scrollCell);
  }

  /**
   * Check if a row is a header row (contains th or is in thead)
   */
  function isHeaderRow(structure, rowIndex) {
    const row = structure.grid[rowIndex];
    if (!row) return false;

    for (let c = 0; c < row.length; c++) {
      const gridCell = row[c];
      if (gridCell && gridCell.cell) {
        const cell = gridCell.cell;
        if (cell.tagName.toUpperCase() === 'TH' || cell.closest('thead')) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Check if a cell is a header cell (th or in thead)
   */
  function isHeaderCell(cell) {
    if (!cell) return false;
    return cell.tagName.toUpperCase() === 'TH' || cell.closest('thead');
  }

  /**
   * Extend selection to the top of the column
   */
  function extendSelectionToColumnStart(startCell) {
    const includeHeader = settingsManager.get('columnIncludeHeader');
    const bounds = getSelectionBounds();

    if (!bounds) {
      const table = tableDetector.getTableFromCell(startCell);
      if (!table) return;
      const pos = tableDetector.getCellPosition(startCell);
      if (!pos) return;
      const structure = tableDetector.getTableStructure(table);

      let firstRow = pos.row;
      for (let r = 0; r <= pos.row; r++) {
        const gridCell = structure.grid[r]?.[pos.col];
        if (gridCell?.cell) {
          // Skip header rows if setting is disabled
          if (!includeHeader && isHeaderRow(structure, r)) {
            continue;
          }
          firstRow = r;
          break;
        }
      }

      const endCell = structure.grid[firstRow]?.[pos.col]?.cell;
      selectionManager.selectRange(startCell, endCell, false);
      anchorCell = startCell;
      if (endCell) endCell.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const { structure, maxRow, minCol, maxCol } = bounds;

    // Find the first row for current column range
    let newMinRow = bounds.minRow;
    for (let r = 0; r <= bounds.minRow; r++) {
      // Skip header rows if setting is disabled
      if (!includeHeader && isHeaderRow(structure, r)) {
        continue;
      }

      let hasCell = false;
      for (let c = minCol; c <= maxCol; c++) {
        if (structure.grid[r]?.[c]?.cell) {
          hasCell = true;
          break;
        }
      }
      if (hasCell) {
        newMinRow = r;
        break;
      }
    }

    const scrollCell = structure.grid[newMinRow]?.[minCol]?.cell;
    selectRangeAndScroll(structure, newMinRow, maxRow, minCol, maxCol, scrollCell);
  }

  /**
   * Extend selection to the end of the row
   */
  function extendSelectionToRowEnd(startCell) {
    const bounds = getSelectionBounds();
    if (!bounds) {
      const table = tableDetector.getTableFromCell(startCell);
      if (!table) return;
      const pos = tableDetector.getCellPosition(startCell);
      if (!pos) return;
      const structure = tableDetector.getTableStructure(table);
      const row = structure.grid[pos.row];
      if (!row) return;

      let lastCol = pos.col;
      for (let c = row.length - 1; c >= pos.col; c--) {
        if (row[c]?.cell) {
          lastCol = c;
          break;
        }
      }

      const endCell = row[lastCol]?.cell;
      selectionManager.selectRange(startCell, endCell, false);
      anchorCell = startCell;
      if (endCell) endCell.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
      return;
    }

    const { structure, minRow, maxRow, minCol } = bounds;

    // Find the last column for current row range
    let newMaxCol = bounds.maxCol;
    const colCount = structure.grid[0]?.length || 0;
    for (let c = colCount - 1; c >= bounds.maxCol; c--) {
      let hasCell = false;
      for (let r = minRow; r <= maxRow; r++) {
        if (structure.grid[r]?.[c]?.cell) {
          hasCell = true;
          break;
        }
      }
      if (hasCell) {
        newMaxCol = c;
        break;
      }
    }

    const scrollCell = structure.grid[maxRow]?.[newMaxCol]?.cell;
    selectRangeAndScroll(structure, minRow, maxRow, minCol, newMaxCol, scrollCell);
  }

  /**
   * Extend selection to the start of the row
   */
  function extendSelectionToRowStart(startCell) {
    const includeHeader = settingsManager.get('columnIncludeHeader');
    const bounds = getSelectionBounds();

    if (!bounds) {
      const table = tableDetector.getTableFromCell(startCell);
      if (!table) return;
      const pos = tableDetector.getCellPosition(startCell);
      if (!pos) return;
      const structure = tableDetector.getTableStructure(table);
      const row = structure.grid[pos.row];
      if (!row) return;

      let firstCol = pos.col;
      for (let c = 0; c <= pos.col; c++) {
        const gridCell = row[c];
        if (gridCell?.cell) {
          // Skip header cells if setting is disabled
          if (!includeHeader && isHeaderCell(gridCell.cell)) {
            continue;
          }
          firstCol = c;
          break;
        }
      }

      const endCell = row[firstCol]?.cell;
      selectionManager.selectRange(startCell, endCell, false);
      anchorCell = startCell;
      if (endCell) endCell.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
      return;
    }

    const { structure, minRow, maxRow, maxCol } = bounds;

    // Find the first column for current row range
    let newMinCol = bounds.minCol;
    for (let c = 0; c <= bounds.minCol; c++) {
      // Check if this column contains only header cells in the selected rows
      let hasNonHeaderCell = false;
      let hasCell = false;

      for (let r = minRow; r <= maxRow; r++) {
        const gridCell = structure.grid[r]?.[c];
        if (gridCell?.cell) {
          hasCell = true;
          if (!isHeaderCell(gridCell.cell)) {
            hasNonHeaderCell = true;
            break;
          }
        }
      }

      // Skip if all cells in this column are headers and setting is disabled
      if (!includeHeader && hasCell && !hasNonHeaderCell) {
        continue;
      }

      if (hasCell) {
        newMinCol = c;
        break;
      }
    }

    const scrollCell = structure.grid[minRow]?.[newMinCol]?.cell;
    selectRangeAndScroll(structure, minRow, maxRow, newMinCol, maxCol, scrollCell);
  }

  /**
   * Handle keyup events
   */
  function handleKeyUp(e) {
    updateModifierState(e);

    if (!isSelectionMode) {
      clearHoverPreview();
      hoveredCell = null;
      hideSelectAllButton();
    }
  }

  /**
   * Handle blur (window loses focus)
   */
  function handleBlur() {
    modifierState = { cmd: false, alt: false, shift: false };
    isSelectionMode = false;
    clearHoverPreview();
    hideSelectAllButton();
    document.body.classList.remove('st-selecting');
  }

  /**
   * Selection change callback
   */
  selectionManager.onSelectionChange = (cells) => {
    statsPanel.update(cells, selectionManager.isFullTableSelected);
  };

  /**
   * Handle table structure changes (AJAX updates)
   * Clean up stale selections when table content changes
   */
  tableDetector.onTableChange = (table) => {
    // Check if we have selections in this table
    if (selectionManager.selectedTable === table) {
      // Get current selection and filter out cells no longer in DOM
      const currentCells = selectionManager.getSelectedCells();
      const validCells = currentCells.filter(cell => document.body.contains(cell));

      if (validCells.length !== currentCells.length) {
        // Some cells were removed, clear and reselect valid ones
        selectionManager.clearSelection(false);
        validCells.forEach(cell => {
          selectionManager._addCell(cell);
        });
        selectionManager._notifyChange();
      }

      // Reset anchor if it's no longer valid
      if (anchorCell && !document.body.contains(anchorCell)) {
        anchorCell = validCells.length > 0 ? validCells[0] : null;
      }
    }

    // Clear hover preview as the structure changed
    clearHoverPreview();
    if (hoveredCell && !document.body.contains(hoveredCell)) {
      hoveredCell = null;
    }
  };

  /**
   * Excel download callback
   */
  statsPanel.onDownloadClick = () => {
    const visibleCells = selectionManager.getVisibleSelectedCells();
    if (visibleCells && visibleCells.length > 0) {
      // Export visible selected cells (filtered rows are excluded)
      excelExporter.exportFromCells(visibleCells, tableDetector);
    }
  };

  /**
   * Initialize event listeners
   */
  async function init() {
    // Initialize settings first
    await settingsManager.init();

    // Create select-all button
    createSelectAllButton();

    // Apply stats panel position from settings
    const statsPosition = settingsManager.get('statsPosition');
    statsPanel.setPosition(statsPosition);

    // Listen for settings changes
    settingsManager.onChange((newSettings) => {
      if (newSettings.statsPosition) {
        statsPanel.setPosition(newSettings.statsPosition);
      }
    });

    // Use capture phase for better performance
    document.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('keyup', handleKeyUp, true);
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mousedown', handleMouseDown, true);
    document.addEventListener('click', handleClick, true);
    window.addEventListener('blur', handleBlur);

    // Handle context menu
    document.addEventListener('contextmenu', (e) => {
      if (isSelectionMode) {
        e.preventDefault();
      }
    });

    // Clear selection on click outside tables (only when not in selection mode)
    document.addEventListener('click', (e) => {
      // Skip if we're in selection mode or if this click was already handled
      if (isSelectionMode) return;

      // Skip if clicking on select-all button
      if (selectAllButton && selectAllButton.contains(e.target)) return;

      // Skip if clicking inside the drawer panel
      const drawerPanel = document.getElementById('drawer-panel');
      if (drawerPanel && drawerPanel.contains(e.target)) return;

      if (selectionManager.getSelectionCount() > 0) {
        const cell = tableDetector.findCell(e.target);
        if (!cell) {
          selectionManager.clearSelection();
          anchorCell = null;
        }
      }
    });

    console.log('SuperTables: Initialized');
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Also expose the modules globally for external access
  window.SuperTables = window.SuperTables || {};
  window.SuperTables.modules = {
    settingsManager,
    tableDetector,
    selectionManager,
    statsPanel,
    clipboardHandler,
    excelExporter
  };

})();

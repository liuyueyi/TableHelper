/**
 * SuperTables - Main Content Script
 * Table cell selection for Chrome
 */
(function() {
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
   * Determine selection mode based on modifier keys
   * Returns: 'cell', 'row', 'column', or null
   */
  function getSelectionMode(e) {
    const cmd = isCmdPressed(e);
    const alt = e.altKey;

    // Cmd+Alt = row selection
    if (cmd && alt) return 'row';
    // Alt only = column selection
    if (alt && !cmd) return 'column';
    // Cmd only = cell selection
    if (cmd && !alt) return 'cell';

    return null;
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
      background: #217346;
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
      selectAllButton.style.background = '#1a5c38';
    });

    selectAllButton.addEventListener('mouseleave', () => {
      selectAllButton.style.background = '#217346';
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

    // Show/hide select-all button based on Cmd key
    if (newCmd && !newAlt && hoveredCell) {
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

        // Update select-all button position if Cmd is pressed
        if (modifierState.cmd && !modifierState.alt && cell) {
          const table = tableDetector.getTableFromCell(cell);
          if (table && table !== currentHoveredTable) {
            showSelectAllButton(table);
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
    const mode = getSelectionMode(e);
    if (!mode) return;

    const cell = tableDetector.findCell(e.target);
    if (!cell) return;

    e.preventDefault();
    e.stopPropagation();

    // Clear any text selection that might have occurred
    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
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

    // Normal selection (set new anchor)
    anchorCell = cell;

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

    // Handle Escape to clear selection
    if (e.key === 'Escape') {
      selectionManager.clearSelection();
      clearHoverPreview();
      hideSelectAllButton();
      anchorCell = null;
    }
  }

  /**
   * Handle keyup events
   */
  function handleKeyUp(e) {
    updateModifierState(e);

    if (!isSelectionMode) {
      clearHoverPreview();
      hoveredCell = null;
    }

    // Hide select-all button when Cmd is released
    if (!modifierState.cmd) {
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
   * Excel download callback
   */
  statsPanel.onDownloadClick = () => {
    if (selectionManager.isFullTableSelected && selectionManager.selectedTable) {
      excelExporter.exportFromCells(
        selectionManager.getSelectedCells(),
        tableDetector
      );
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
})();

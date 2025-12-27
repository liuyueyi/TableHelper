/**
 * StatsPanel - Excel-style horizontal statistics bar
 * Uses Shadow DOM for style isolation
 * Supports position: left, center, right
 */
class StatsPanel {
  constructor() {
    this.container = null;
    this.shadowRoot = null;
    this.isVisible = false;
    this.stats = null;
    this.showDownloadButton = false;
    this.onDownloadClick = null;
    this.position = 'left'; // default position
    this.isTextMode = false; // whether showing text stats instead of numeric stats
    this.userForcedMode = null; // 'numeric' | 'text' | null (auto)
    this._init();
  }

  /**
   * Initialize the panel
   * @private
   */
  _init() {
    // Create container
    this.container = document.createElement('div');
    this.container.id = 'st-stats-panel-host';

    // Create shadow DOM for style isolation
    this.shadowRoot = this.container.attachShadow({ mode: 'closed' });

    // Add styles
    const style = document.createElement('style');
    style.textContent = this._getStyles();
    this.shadowRoot.appendChild(style);

    // Create panel element
    this.panel = document.createElement('div');
    this.panel.className = 'stats-bar';
    this.panel.innerHTML = this._getTemplate();
    this.shadowRoot.appendChild(this.panel);

    // Append to body
    document.body.appendChild(this.container);

    // Setup event listeners
    this._setupEventListeners();
  }

  /**
   * Get panel styles
   * @private
   */
  _getStyles() {
    return `
      :host {
        position: fixed;
        bottom: 0;
        z-index: 2147483647;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      }

      :host(.position-center) {
        left: 50%;
        transform: translateX(-50%);
      }

      :host(.position-left) {
        left: 20px;
        transform: none;
      }

      :host(.position-right) {
        right: 20px;
        left: auto;
        transform: none;
      }

      .stats-bar {
        background: rgba(32, 32, 32, 0.95);
        border-radius: 8px 8px 0 0;
        box-shadow: 0 -2px 20px rgba(0, 0, 0, 0.2);
        padding: 8px 16px;
        display: flex;
        align-items: center;
        gap: 4px;
        color: #fff;
        font-size: 12px;
        opacity: 0;
        transform: translateY(100%);
        transition: opacity 0.2s ease, transform 0.2s ease;
        pointer-events: none;
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-bottom: none;
        max-width: 90vw;
      }

      .stats-bar.visible {
        opacity: 1;
        transform: translateY(0);
        pointer-events: auto;
      }

      .download-btn {
        display: none;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        background: #217346;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        margin-right: 8px;
        transition: background 0.15s ease;
      }

      .download-btn:hover {
        background: #1a5c38;
      }

      .download-btn.visible {
        display: flex;
      }

      .download-btn svg {
        width: 16px;
        height: 16px;
        fill: #fff;
      }

      .divider {
        width: 1px;
        height: 20px;
        background: rgba(255, 255, 255, 0.15);
        margin: 0 8px;
      }

      .stat-item {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 4px 10px;
        border-radius: 4px;
        cursor: pointer;
        transition: background 0.15s ease;
        white-space: nowrap;
        user-select: none;
      }

      .stat-item:hover {
        background: rgba(255, 255, 255, 0.1);
      }

      .stat-item:active {
        background: rgba(255, 255, 255, 0.2);
        transform: scale(0.98);
      }

      .stat-item.copied {
        background: rgba(33, 115, 70, 0.5);
      }

      .stat-label {
        color: rgba(255, 255, 255, 0.6);
        font-size: 11px;
      }

      .stat-value {
        font-weight: 600;
        font-size: 12px;
        color: #fff;
        font-variant-numeric: tabular-nums;
      }

      .stat-value.no-data {
        color: rgba(255, 255, 255, 0.4);
        font-weight: normal;
      }

      .copy-toast {
        position: absolute;
        top: -32px;
        left: 50%;
        transform: translateX(-50%);
        background: #217346;
        color: #fff;
        padding: 5px 14px;
        border-radius: 4px;
        font-size: 11px;
        font-weight: 500;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.2s ease, transform 0.2s ease;
        white-space: nowrap;
      }

      .copy-toast.show {
        opacity: 1;
        transform: translateX(-50%) translateY(-4px);
      }

      .count-badge {
        background: #217346;
        color: #fff;
        padding: 2px 8px;
        border-radius: 10px;
        font-size: 11px;
        font-weight: 500;
        margin-right: 4px;
      }

      /* Text stats mode (Top 5) */
      .text-stats-container {
        display: none;
        align-items: center;
        gap: 6px;
        flex-wrap: wrap;
      }

      .text-stats-container.visible {
        display: flex;
      }

      .numeric-stats-container {
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .numeric-stats-container.hidden {
        display: none;
      }

      .top-label {
        color: rgba(255, 255, 255, 0.6);
        font-size: 11px;
        margin-right: 4px;
      }

      #top-items {
        display: flex;
        align-items: center;
        gap: 6px;
        flex-wrap: wrap;
      }

      .top-item {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 3px 8px;
        background: rgba(255, 255, 255, 0.08);
        border-radius: 4px;
        cursor: pointer;
        transition: background 0.15s ease;
        white-space: nowrap;
        max-width: 150px;
      }

      .top-item:hover {
        background: rgba(255, 255, 255, 0.15);
      }

      .top-item:active {
        background: rgba(255, 255, 255, 0.2);
        transform: scale(0.98);
      }

      .top-item.copied {
        background: rgba(33, 115, 70, 0.5);
      }

      .top-item-text {
        font-size: 12px;
        color: #fff;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 100px;
      }

      .top-item-count {
        font-size: 10px;
        color: rgba(255, 255, 255, 0.5);
        font-weight: 500;
      }

      .top-item-rank {
        font-size: 10px;
        color: #217346;
        font-weight: 600;
        min-width: 14px;
      }

      /* Mode toggle button */
      .mode-toggle {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 4px 10px;
        margin-left: 8px;
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.15s ease;
        color: rgba(255, 255, 255, 0.7);
        font-size: 11px;
        white-space: nowrap;
        user-select: none;
      }

      .mode-toggle:hover {
        background: rgba(255, 255, 255, 0.15);
        color: #fff;
        border-color: rgba(255, 255, 255, 0.25);
      }

      .mode-toggle:active {
        background: rgba(255, 255, 255, 0.2);
        transform: scale(0.98);
      }

      .mode-toggle svg {
        width: 12px;
        height: 12px;
        fill: currentColor;
        opacity: 0.8;
      }

      .mode-toggle.active {
        background: rgba(33, 115, 70, 0.3);
        border-color: rgba(33, 115, 70, 0.5);
        color: #4ade80;
      }

      .mode-toggle.active:hover {
        background: rgba(33, 115, 70, 0.4);
      }

      .divider-right {
        width: 1px;
        height: 20px;
        background: rgba(255, 255, 255, 0.15);
        margin-left: 8px;
      }
    `;
  }

  /**
   * Get panel HTML template
   * @private
   */
  _getTemplate() {
    return `
      <div class="copy-toast" id="toast">Copied!</div>
      <button class="download-btn" id="download-btn" title="Download as Excel">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
          <polyline points="14 2 14 8 20 8" fill="none" stroke="#fff" stroke-width="2"/>
          <path d="M12 18v-6M9 15l3 3 3-3" fill="none" stroke="#217346" stroke-width="2"/>
        </svg>
      </button>
      <span class="count-badge" id="count">0</span>
      <div class="divider"></div>
      <!-- Numeric stats container -->
      <div class="numeric-stats-container" id="numeric-stats">
        <div class="stat-item" data-stat="numericCount" data-value="" title="Click to copy">
          <span class="stat-label">Numeric:</span>
          <span class="stat-value" id="numeric-count">-</span>
        </div>
        <div class="stat-item" data-stat="sum" data-value="" title="Click to copy">
          <span class="stat-label">Sum:</span>
          <span class="stat-value" id="sum">-</span>
        </div>
        <div class="stat-item" data-stat="average" data-value="" title="Click to copy">
          <span class="stat-label">Avg:</span>
          <span class="stat-value" id="average">-</span>
        </div>
        <div class="stat-item" data-stat="min" data-value="" title="Click to copy">
          <span class="stat-label">Min:</span>
          <span class="stat-value" id="min">-</span>
        </div>
        <div class="stat-item" data-stat="max" data-value="" title="Click to copy">
          <span class="stat-label">Max:</span>
          <span class="stat-value" id="max">-</span>
        </div>
      </div>
      <!-- Text stats container (Top 5) -->
      <div class="text-stats-container" id="text-stats">
        <span class="top-label">Top 5:</span>
        <div id="top-items"></div>
      </div>
      <!-- Mode toggle button -->
      <div class="divider-right"></div>
      <button class="mode-toggle" id="mode-toggle" title="Switch between numeric and text statistics">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>
        </svg>
        <span id="toggle-label">Top 5</span>
      </button>
    `;
  }

  /**
   * Setup event listeners
   * @private
   */
  _setupEventListeners() {
    // Click to copy stat values
    this.panel.querySelectorAll('.stat-item').forEach(item => {
      item.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();

        const value = item.dataset.value;
        if (value && value !== '-' && value !== '') {
          await this._copyToClipboard(value, item);
        }
      });
    });

    // Download button
    const downloadBtn = this.shadowRoot.getElementById('download-btn');
    downloadBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (typeof this.onDownloadClick === 'function') {
        this.onDownloadClick();
      }
    });

    // Mode toggle button
    const modeToggle = this.shadowRoot.getElementById('mode-toggle');
    modeToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this._toggleMode();
    });
  }

  /**
   * Toggle between numeric and text mode
   * @private
   */
  _toggleMode() {
    if (!this.stats) return;

    // Determine current display mode
    const currentlyShowingText = this.shadowRoot.getElementById('text-stats').classList.contains('visible');

    if (currentlyShowingText) {
      // Switch to numeric mode
      this.userForcedMode = 'numeric';
    } else {
      // Switch to text mode
      this.userForcedMode = 'text';
    }

    this._render();
  }

  /**
   * Copy text to clipboard and show toast
   * @private
   */
  async _copyToClipboard(text, itemElement) {
    let success = false;

    // Method 1: Use Clipboard API (preferred)
    try {
      await navigator.clipboard.writeText(text);
      success = true;
    } catch (e) {
      console.warn('SuperTables: Clipboard API failed, trying fallback', e);
    }

    // Method 2: Fallback using execCommand (must be outside Shadow DOM)
    if (!success) {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.cssText = 'position:fixed;left:-9999px;top:-9999px;opacity:0;pointer-events:none;';
        textarea.setAttribute('readonly', ''); // Prevent keyboard on mobile
        document.body.appendChild(textarea);

        // iOS specific handling
        const range = document.createRange();
        range.selectNodeContents(textarea);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        textarea.setSelectionRange(0, text.length);

        success = document.execCommand('copy');
        document.body.removeChild(textarea);
      } catch (e2) {
        console.error('SuperTables: execCommand copy failed', e2);
      }
    }

    // Method 3: Use chrome extension messaging to background script
    if (!success && typeof chrome !== 'undefined' && chrome.runtime) {
      try {
        chrome.runtime.sendMessage({ action: 'copyToClipboard', text: text }, (response) => {
          if (response && response.success) {
            this._showCopyFeedback(itemElement);
          }
        });
        return; // Background script will handle it
      } catch (e3) {
        console.error('SuperTables: Chrome messaging failed', e3);
      }
    }

    if (success) {
      this._showCopyFeedback(itemElement);
    }
  }

  /**
   * Show copy feedback
   * @private
   */
  _showCopyFeedback(itemElement) {
    if (itemElement) {
      itemElement.classList.add('copied');
      setTimeout(() => {
        itemElement.classList.remove('copied');
      }, 300);
    }
    this._showToast();
  }

  /**
   * Show copy toast
   * @private
   */
  _showToast() {
    const toast = this.shadowRoot.getElementById('toast');
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 1500);
  }

  /**
   * Set panel position
   * @param {string} position - 'left', 'center', or 'right'
   */
  setPosition(position) {
    this.position = position || 'center';

    // Remove all position classes
    this.container.classList.remove('position-left', 'position-center', 'position-right');

    // Add new position class
    this.container.classList.add(`position-${this.position}`);
  }

  /**
   * Parse numeric value from text
   * @param {string} text
   * @returns {number|null}
   */
  _parseNumber(text) {
    if (!text || typeof text !== 'string') return null;

    let cleaned = text.trim()
      .replace(/^[\$\u00A3\u20AC\u00A5\uFFE5\u20B9]+/, '')
      .replace(/[\$\u00A3\u20AC\u00A5\uFFE5\u20B9]+$/, '')
      .replace(/\s/g, '');

    const isPercentage = cleaned.endsWith('%');
    if (isPercentage) {
      cleaned = cleaned.slice(0, -1);
    }

    const hasCommaThenDot = /,\d{3}\./.test(cleaned);
    const hasDotThenComma = /\.\d{3},/.test(cleaned);

    if (hasDotThenComma) {
      cleaned = cleaned.replace(/\./g, '').replace(',', '.');
    } else if (hasCommaThenDot || cleaned.includes(',')) {
      cleaned = cleaned.replace(/,/g, '');
    }

    if (cleaned.startsWith('(') && cleaned.endsWith(')')) {
      cleaned = '-' + cleaned.slice(1, -1);
    }

    const num = parseFloat(cleaned);
    if (isNaN(num)) return null;
    return isPercentage ? num / 100 : num;
  }

  /**
   * Format number for display
   * @param {number} num
   * @param {number} [decimals=2]
   * @returns {string}
   */
  _formatNumber(num, decimals = 2) {
    if (num === null || num === undefined || isNaN(num)) return '-';

    const options = {
      minimumFractionDigits: 0,
      maximumFractionDigits: decimals
    };

    return num.toLocaleString(undefined, options);
  }

  /**
   * Calculate statistics from cell data
   * @param {HTMLTableCellElement[]} cells
   * @returns {Object}
   */
  calculateStats(cells) {
    const count = cells.length;
    const values = [];
    const textCounts = new Map(); // For text frequency counting

    cells.forEach(cell => {
      const text = cell.textContent?.trim() || '';
      if (!text) return;

      const num = this._parseNumber(text);
      if (num !== null) {
        values.push(num);
      }

      // Count text frequency (for all non-empty values)
      textCounts.set(text, (textCounts.get(text) || 0) + 1);
    });

    const numericCount = values.length;

    // Calculate Top 5 text items
    const topTexts = Array.from(textCounts.entries())
      .sort((a, b) => b[1] - a[1]) // Sort by count descending
      .slice(0, 5)
      .map(([text, freq]) => ({ text, count: freq }));

    if (numericCount === 0) {
      return {
        count,
        numericCount: 0,
        sum: null,
        average: null,
        min: null,
        max: null,
        topTexts,
        isTextMode: true
      };
    }

    const sum = values.reduce((a, b) => a + b, 0);
    const average = sum / numericCount;
    const min = Math.min(...values);
    const max = Math.max(...values);

    return {
      count,
      numericCount,
      sum,
      average,
      min,
      max,
      topTexts,
      isTextMode: false
    };
  }

  /**
   * Update the panel with new data
   * @param {HTMLTableCellElement[]} cells
   * @param {boolean} [isFullTable=false] - Whether entire table is selected
   */
  update(cells, isFullTable = false) {
    if (!cells || cells.length === 0) {
      this.hide();
      return;
    }

    // Reset user forced mode when new selection is made
    this.userForcedMode = null;

    this.stats = this.calculateStats(cells);
    this.showDownloadButton = isFullTable;
    this._render();
    this.show();
  }

  /**
   * Render statistics to panel
   * @private
   */
  _render() {
    if (!this.stats) return;

    const { count, numericCount, sum, average, min, max, topTexts, isTextMode: autoTextMode } = this.stats;

    // Determine actual display mode
    // Priority: userForcedMode > autoTextMode
    let showTextMode;
    if (this.userForcedMode === 'text') {
      showTextMode = true;
    } else if (this.userForcedMode === 'numeric') {
      showTextMode = false;
    } else {
      showTextMode = autoTextMode;
    }

    // Update count badge
    this._setValue('count', count, count);

    // Get containers
    const numericContainer = this.shadowRoot.getElementById('numeric-stats');
    const textContainer = this.shadowRoot.getElementById('text-stats');
    const modeToggle = this.shadowRoot.getElementById('mode-toggle');
    const toggleLabel = this.shadowRoot.getElementById('toggle-label');

    if (showTextMode) {
      // Show text stats (Top 5), hide numeric stats
      numericContainer.classList.add('hidden');
      textContainer.classList.add('visible');

      // Render Top 5 items
      this._renderTopTexts(topTexts);

      // Update toggle button - show option to switch to numeric
      toggleLabel.textContent = '123';
      modeToggle.title = 'Switch to numeric statistics';
      modeToggle.classList.toggle('active', this.userForcedMode === 'text');
    } else {
      // Show numeric stats, hide text stats
      numericContainer.classList.remove('hidden');
      textContainer.classList.remove('visible');

      this._setValue('numeric-count', numericCount || '-', numericCount);
      this._setValue('sum', this._formatNumber(sum), sum);
      this._setValue('average', this._formatNumber(average), average);
      this._setValue('min', this._formatNumber(min), min);
      this._setValue('max', this._formatNumber(max), max);

      // Update data-value attributes for copy functionality
      this._setDataValue('numericCount', numericCount);
      this._setDataValue('sum', sum);
      this._setDataValue('average', average);
      this._setDataValue('min', min);
      this._setDataValue('max', max);

      // Update toggle button - show option to switch to text
      toggleLabel.textContent = 'Top 5';
      modeToggle.title = 'Switch to text statistics (Top 5)';
      modeToggle.classList.toggle('active', this.userForcedMode === 'numeric');
    }

    // Toggle download button visibility
    const downloadBtn = this.shadowRoot.getElementById('download-btn');
    downloadBtn.classList.toggle('visible', this.showDownloadButton);
  }

  /**
   * Render Top 5 text items
   * @private
   */
  _renderTopTexts(topTexts) {
    const container = this.shadowRoot.getElementById('top-items');
    if (!container) return;

    container.innerHTML = topTexts.map((item, index) => {
      // Truncate text if too long
      const displayText = item.text.length > 15
        ? item.text.substring(0, 15) + '...'
        : item.text;

      return `
        <span class="top-item" data-value="${this._escapeHtml(item.text)}" title="${this._escapeHtml(item.text)} (${item.count})">
          <span class="top-item-rank">#${index + 1}</span>
          <span class="top-item-text">${this._escapeHtml(displayText)}</span>
          <span class="top-item-count">×${item.count}</span>
        </span>
      `;
    }).join('');

    // Add click listeners for copying
    container.querySelectorAll('.top-item').forEach(item => {
      item.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const value = item.dataset.value;
        if (value) {
          await this._copyToClipboard(value, item);
        }
      });
    });
  }

  /**
   * Escape HTML to prevent XSS
   * @private
   */
  _escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Set data-value attribute for stat item
   * Store raw number without formatting for copy
   * @private
   */
  _setDataValue(statName, value) {
    const item = this.panel.querySelector(`[data-stat="${statName}"]`);
    if (item) {
      // Store raw number without thousand separators for copying
      item.dataset.value = (value !== null && value !== undefined && !isNaN(value))
        ? this._formatNumberRaw(value)
        : '';
    }
  }

  /**
   * Format number without thousand separators (for copy)
   * @param {number} num
   * @param {number} [decimals=2]
   * @returns {string}
   */
  _formatNumberRaw(num, decimals = 6) {
    if (num === null || num === undefined || isNaN(num)) return '';

    // Check if it's an integer
    if (Number.isInteger(num)) {
      return num.toString();
    }

    // For decimals, remove trailing zeros
    const fixed = num.toFixed(decimals);
    return parseFloat(fixed).toString();
  }

  /**
   * Set value in panel
   * @private
   */
  _setValue(id, displayValue, rawValue) {
    const el = this.shadowRoot.getElementById(id);
    if (el) {
      el.textContent = displayValue;
      el.classList.toggle('no-data', displayValue === '-' || displayValue === null);
    }
  }

  /**
   * Show the panel
   */
  show() {
    if (!this.isVisible) {
      this.panel.classList.add('visible');
      this.isVisible = true;
    }
  }

  /**
   * Hide the panel
   */
  hide() {
    if (this.isVisible) {
      this.panel.classList.remove('visible');
      this.isVisible = false;
    }
  }

  /**
   * Destroy the panel
   */
  destroy() {
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
  }
}

// Export
window.SuperTables = window.SuperTables || {};
window.SuperTables.StatsPanel = StatsPanel;

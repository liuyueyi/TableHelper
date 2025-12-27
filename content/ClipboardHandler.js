/**
 * ClipboardHandler - Handle copy operations
 * Supports both plain text (TSV) and HTML formats
 */
class ClipboardHandler {
  constructor(selectionManager) {
    this.selectionManager = selectionManager;
  }

  /**
   * Copy selected cells to clipboard
   * @returns {Promise<boolean>} Success status
   */
  async copy() {
    const cells = this.selectionManager.getSelectedCells();
    if (cells.length === 0) return false;

    const data = this.selectionManager.getSelectionData();
    if (data.length === 0) return false;

    const text = this._toTSV(data);
    const html = this._toHTML(data);

    try {
      // Try using Clipboard API with multiple formats
      if (navigator.clipboard && navigator.clipboard.write) {
        const blob = new Blob([html], { type: 'text/html' });
        const textBlob = new Blob([text], { type: 'text/plain' });

        await navigator.clipboard.write([
          new ClipboardItem({
            'text/html': blob,
            'text/plain': textBlob
          })
        ]);
      } else {
        // Fallback to execCommand
        await this._fallbackCopy(text, html);
      }

      this._showCopyFeedback();
      return true;
    } catch (err) {
      console.error('SuperTables: Copy failed', err);

      // Try simple text copy as last resort
      try {
        await navigator.clipboard.writeText(text);
        this._showCopyFeedback();
        return true;
      } catch (e) {
        console.error('SuperTables: Text copy also failed', e);
        return false;
      }
    }
  }

  /**
   * Convert data to TSV format
   * @param {string[][]} data
   * @returns {string}
   */
  _toTSV(data) {
    return data.map(row => row.join('\t')).join('\n');
  }

  /**
   * Convert data to HTML table format
   * @param {string[][]} data
   * @returns {string}
   */
  _toHTML(data) {
    const rows = data.map(row => {
      const cells = row.map(cell => {
        const escaped = this._escapeHTML(cell);
        return `<td>${escaped}</td>`;
      }).join('');
      return `<tr>${cells}</tr>`;
    }).join('');

    return `<table>${rows}</table>`;
  }

  /**
   * Escape HTML special characters
   * @param {string} text
   * @returns {string}
   */
  _escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Fallback copy method using execCommand
   * @param {string} text
   * @param {string} html
   * @returns {Promise<void>}
   */
  _fallbackCopy(text, html) {
    return new Promise((resolve, reject) => {
      const listener = (e) => {
        e.preventDefault();
        e.clipboardData.setData('text/plain', text);
        e.clipboardData.setData('text/html', html);
        document.removeEventListener('copy', listener);
        resolve();
      };

      document.addEventListener('copy', listener);

      const success = document.execCommand('copy');
      if (!success) {
        document.removeEventListener('copy', listener);
        reject(new Error('execCommand failed'));
      }
    });
  }

  /**
   * Show visual feedback for successful copy
   * @private
   */
  _showCopyFeedback() {
    // Flash selected cells briefly
    const cells = this.selectionManager.getSelectedCells();

    cells.forEach(cell => {
      cell.style.transition = 'background-color 0.15s ease';
      const originalBg = cell.style.backgroundColor;
      cell.style.backgroundColor = 'rgba(33, 115, 70, 0.4)';

      setTimeout(() => {
        cell.style.backgroundColor = originalBg;
        setTimeout(() => {
          cell.style.transition = '';
        }, 150);
      }, 150);
    });
  }
}

// Export
window.SuperTables = window.SuperTables || {};
window.SuperTables.ClipboardHandler = ClipboardHandler;

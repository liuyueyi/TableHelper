/**
 * ClipboardHandler - Handle copy operations
 * Supports both plain text (TSV) and HTML formats
 */
class ClipboardHandler {
  // Translations for toast messages
  static messages = {
    en: { copied: 'Copied' },
    zh: { copied: '已复制' },
    ja: { copied: 'コピーしました' }
  };

  constructor(selectionManager) {
    this.selectionManager = selectionManager;
    this.locale = this._detectLanguage();
  }

  /**
   * Detect system language
   * @returns {string} Language code (en, zh, ja)
   * @private
   */
  _detectLanguage() {
    const lang = navigator.language || navigator.userLanguage || 'en';
    const shortLang = lang.split('-')[0].toLowerCase();

    if (ClipboardHandler.messages[shortLang]) {
      return shortLang;
    }

    // Map zh-TW, zh-HK to zh
    if (lang.startsWith('zh')) {
      return 'zh';
    }

    return 'en';
  }

  /**
   * Get translation
   * @param {string} key
   * @returns {string}
   * @private
   */
  _t(key) {
    const messages = ClipboardHandler.messages[this.locale] || ClipboardHandler.messages.en;
    return messages[key] || ClipboardHandler.messages.en[key] || key;
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

    // Show toast notification in center of page
    this._showToast(this._t('copied'));
  }

  /**
   * Show a toast notification in the center of the page
   * @param {string} message - The message to display
   * @private
   */
  _showToast(message) {
    // Remove existing toast if any
    const existingToast = document.getElementById('supertables-toast');
    if (existingToast) {
      existingToast.remove();
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.id = 'supertables-toast';
    toast.textContent = message;

    // Apply styles
    Object.assign(toast.style, {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'rgba(33, 115, 70, 0.85)',
      color: 'white',
      padding: '12px 24px',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '500',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      zIndex: '2147483647',
      opacity: '0',
      transition: 'opacity 0.2s ease-in-out',
      pointerEvents: 'none'
    });

    document.body.appendChild(toast);

    // Trigger fade in
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
    });

    // Fade out and remove after delay
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => {
        toast.remove();
      }, 200);
    }, 1000);
  }
}

// Export
window.SuperTables = window.SuperTables || {};
window.SuperTables.ClipboardHandler = ClipboardHandler;

/**
 * SuperTables - Installation Marker
 * This script runs at document_start to mark the extension as installed
 * so that web pages can detect it early.
 */
(function() {
  'use strict';

  // Mark extension as installed
  document.documentElement.setAttribute('data-supertables-installed', 'true');
  document.documentElement.setAttribute('data-supertables-version', '1.1.2');

  // Dispatch custom event for pages that want to listen
  document.dispatchEvent(new CustomEvent('supertables-ready', {
    detail: { version: '1.1.2' }
  }));
})();

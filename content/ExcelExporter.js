/**
 * ExcelExporter - Export table data to Excel (.xlsx)
 * Uses simple XML-based Excel format
 */
class ExcelExporter {
  constructor() {
    this.mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  }

  /**
   * Export data to Excel and trigger download
   * @param {string[][]} data - 2D array of cell contents
   * @param {string} [filename='table-export.xlsx']
   */
  export(data, filename = 'table-export.xlsx') {
    if (!data || data.length === 0) {
      console.warn('SuperTables: No data to export');
      return;
    }

    const xlsx = this._createXLSX(data);
    this._download(xlsx, filename);
  }

  /**
   * Create XLSX content
   * @private
   */
  _createXLSX(data) {
    // Create a simple XML spreadsheet (Excel 2003 XML format)
    // This is more compatible and doesn't require external libraries
    const xml = this._createSpreadsheetML(data);
    return xml;
  }

  /**
   * Create SpreadsheetML (Excel 2003 XML format)
   * @private
   */
  _createSpreadsheetML(data) {
    const rows = data.map((row, rowIndex) => {
      const cells = row.map((cell, colIndex) => {
        const value = this._escapeXML(cell || '');
        const type = this._detectType(cell);

        if (type === 'Number') {
          return `<Cell><Data ss:Type="Number">${value}</Data></Cell>`;
        } else {
          return `<Cell><Data ss:Type="String">${value}</Data></Cell>`;
        }
      }).join('');

      return `<Row>${cells}</Row>`;
    }).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
 <Styles>
  <Style ss:ID="Default" ss:Name="Normal">
   <Alignment ss:Vertical="Center"/>
   <Font ss:FontName="Arial" ss:Size="10"/>
  </Style>
  <Style ss:ID="Header">
   <Font ss:FontName="Arial" ss:Size="10" ss:Bold="1"/>
   <Interior ss:Color="#E8E8E8" ss:Pattern="Solid"/>
  </Style>
 </Styles>
 <Worksheet ss:Name="Sheet1">
  <Table>
${rows}
  </Table>
 </Worksheet>
</Workbook>`;
  }

  /**
   * Detect cell type (Number or String)
   * @private
   */
  _detectType(value) {
    if (value === null || value === undefined || value === '') {
      return 'String';
    }

    // Clean the value for number detection
    const cleaned = String(value)
      .replace(/^[\$\u00A3\u20AC\u00A5\uFFE5\u20B9]+/, '')
      .replace(/[\$\u00A3\u20AC\u00A5\uFFE5\u20B9]+$/, '')
      .replace(/,/g, '')
      .replace(/%$/, '')
      .trim();

    const num = parseFloat(cleaned);
    if (!isNaN(num) && isFinite(num)) {
      return 'Number';
    }

    return 'String';
  }

  /**
   * Escape XML special characters
   * @private
   */
  _escapeXML(str) {
    if (typeof str !== 'string') {
      str = String(str);
    }
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  /**
   * Trigger file download
   * @private
   */
  _download(content, filename) {
    // Use .xls extension for XML spreadsheet format
    const actualFilename = filename.replace(/\.xlsx$/, '.xls');

    const blob = new Blob([content], {
      type: 'application/vnd.ms-excel'
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = actualFilename;
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up
    setTimeout(() => URL.revokeObjectURL(url), 100);
  }

  /**
   * Export from selected cells
   * @param {HTMLTableCellElement[]} cells
   * @param {TableDetector} tableDetector
   * @param {string} [filename]
   */
  exportFromCells(cells, tableDetector, filename) {
    if (!cells || cells.length === 0) return;

    const table = tableDetector.getTableFromCell(cells[0]);
    if (!table) return;

    const structure = tableDetector.getTableStructure(table);

    // Create a Set of selected cells for quick lookup
    const selectedCellSet = new Set(cells);

    // Find the row and column range of selected cells
    let minRow = Infinity, maxRow = -1, minCol = Infinity, maxCol = -1;
    const cellPositions = new Map(); // Map cell element to its grid position

    for (let r = 0; r < structure.rows; r++) {
      for (let c = 0; c < structure.cols; c++) {
        const gridCell = structure.grid[r]?.[c];
        if (gridCell && gridCell.isOrigin && selectedCellSet.has(gridCell.cell)) {
          minRow = Math.min(minRow, r);
          maxRow = Math.max(maxRow, r);
          minCol = Math.min(minCol, c);
          maxCol = Math.max(maxCol, c);
          cellPositions.set(gridCell.cell, { row: r, col: c });
        }
      }
    }

    if (maxRow < 0) return; // No selected cells found

    // Build 2D array from selected cells only
    const data = [];
    for (let r = minRow; r <= maxRow; r++) {
      const rowData = [];
      for (let c = minCol; c <= maxCol; c++) {
        const gridCell = structure.grid[r]?.[c];
        if (gridCell && gridCell.isOrigin && selectedCellSet.has(gridCell.cell)) {
          rowData.push(gridCell.cell.textContent.trim());
        } else {
          rowData.push('');
        }
      }
      data.push(rowData);
    }

    // Generate filename from page title or URL
    const defaultName = document.title
      ? `${document.title.slice(0, 30).replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_')}.xls`
      : 'table-export.xls';

    this.export(data, filename || defaultName);
  }
}

// Export
window.SuperTables = window.SuperTables || {};
window.SuperTables.ExcelExporter = ExcelExporter;

// 工具类函数
class TableToolUtils {
    // 将文本输入转换为二维数组
    static parseInputTo2DArray(inputText) {
        if (!inputText.trim()) return [];

        const lines = inputText.split('\n').filter(line => line.trim() !== '');
        if (lines.length === 0) return [];

        // 将每一行按制表符或多个空格分割
        return lines.map(line => {
            // 使用正则表达式按制表符或一个或多个空格分割
            return line.split(/\t+| {2,}/).map(cell => cell.trim());
        });
    }

    // 将二维数组转换为文本输出
    static format2DArrayToString(array2D) {
        return array2D.map(row => row.join('\t')).join('\n');
    }

    // 显示状态消息
    static showStatusMessage(elementId, message, type = 'info') {
        const statusElement = document.getElementById(elementId);
        if (statusElement) {
            statusElement.textContent = message;
            statusElement.className = `thp-status-message ${type === 'info' ? 'thp-status-message-info' : ''}`;
            statusElement.style.display = 'block';
        }
    }

    // 复制到剪贴板
    static copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            console.log('已复制到剪贴板');
        }).catch(err => {
            console.error('复制失败:', err);
            // 降级处理：使用旧版方法
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
        });
    }

    // 导出为文件
    static exportAsFile(content, filename) {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // 执行基础操作
    static executeBasicOperations(inputText) {
        const result2D = this.parseInputTo2DArray(inputText);

        if (result2D.length === 0) {
            return '请先输入表格数据';
        }

        // 记录原始数据的行列数
        const originalRowCount = result2D.length;
        const originalColCount = result2D.length > 0 ? Math.max(...result2D.map(row => row.length)) : 0;

        // Cell transform - 转换单元格值
        const cellTransformCheckbox = document.getElementById('thp-cell-transform-checkbox');
        if (cellTransformCheckbox && cellTransformCheckbox.checked) {
            const transformRule = document.getElementById('thp-cell-transform-rule').value || "'$'";
            for (let r = 0; r < result2D.length; r++) {
                for (let c = 0; c < result2D[r].length; c++) {
                    result2D[r][c] = transformRule.replace(/\$/g, result2D[r][c]);
                }
            }
        }

        // Column merge - 合并每列的值
        const colMergeCheckbox = document.getElementById('thp-col-merge-checkbox');
        if (colMergeCheckbox && colMergeCheckbox.checked) {
            const template = document.getElementById('thp-col-merge-template').value || ',';
            const mergedRows = [];
            for (let r = 0; r < result2D.length; r++) {
                mergedRows.push([result2D[r].join(template)]);
            }
            result2D.length = 0;
            mergedRows.forEach(row => result2D.push(row));
        }

        // Column deduplication - 去除重复行
        const colDedupCheckbox = document.getElementById('thp-col-dedup-checkbox');
        if (colDedupCheckbox && colDedupCheckbox.checked) {
            const uniqueRows = [];
            const seenRows = new Set();

            for (const row of result2D) {
                const rowKey = row.join('|');
                if (!seenRows.has(rowKey)) {
                    seenRows.add(rowKey);
                    uniqueRows.push([...row]);
                }
            }

            result2D.length = 0;
            uniqueRows.forEach(row => result2D.push(row));
        }

        // Row merge - 合并每行的值
        const rowMergeCheckbox = document.getElementById('thp-row-merge-checkbox');
        if (rowMergeCheckbox && rowMergeCheckbox.checked) {
            const separator = document.getElementById('thp-row-merge-separator').value || ';';
            const flatRows = result2D.flat();
            const mergedResult = flatRows.join(separator);
            result2D.length = 0;
            result2D.push([mergedResult]);
        }

        // 计算最终行列数
        const finalRowCount = result2D.length;
        const finalColCount = result2D.length > 0 ? Math.max(...result2D.map(row => row.length)) : 0;

        // 显示操作统计
        this.showStatusMessage('thp-basic-status',
            `操作完成: 输入 ${originalRowCount} 行 × ${originalColCount} 列，输出 ${finalRowCount} 行 × ${finalColCount} 列`,
            'info');

        return this.format2DArrayToString(result2D);
    }

    // 执行集合操作
    static executeSetOperations(inputText) {
        const selectedOp = document.querySelector('input[name="set-operation"]:checked');

        if (!selectedOp) {
            return '请选择集合操作类型';
        }

        const operation = selectedOp.value;

        const result2D = this.parseInputTo2DArray(inputText);

        if (result2D.length === 0) {
            return '没有选择任何数据';
        }

        if (result2D[0].length !== 2) {
            return '集合操作请选择两列数据，每行包含两列';
        }

        // 提取两列数据
        const colA = result2D.map(row => row[0]).filter(val => val !== undefined);
        const colB = result2D.map(row => row[1]).filter(val => val !== undefined);

        // 执行集合操作
        let result = this.setOperationOnColumns(colA, colB, operation);

        // 计算结果集合的元素个数
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

        this.showStatusMessage('thp-set-status',
            `集合操作完成: A集合 ${colA.length} 个元素, B集合 ${colB.length} 个元素, ${operationName}结果 ${resultCount} 个元素`,
            'info');

        return result;
    }

    // 执行集合操作的核心函数
    static setOperationOnColumns(columnA, columnB, operation) {
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

    // 执行SQL操作
    static executeSqlOperations(inputText) {
        const selectedOp = document.querySelector('input[name="sql-operation"]:checked');
        console.log('Selected SQL Operation:', selectedOp);

        if (!selectedOp) {
            return '请选择SQL操作类型';
        }

        const operation = selectedOp.value;

        const result2D = this.parseInputTo2DArray(inputText);

        if (result2D.length === 0) {
            return '请先输入表格数据';
        }

        // 提取表头（第一行）
        const headers = result2D[0];
        if (!headers || headers.length === 0) {
            return '请确保第一行包含表头信息';
        }

        // 提取数据行（除第一行外的所有行）
        const dataRows = result2D.slice(1);

        // 获取表名
        const tableName = document.getElementById('thp-sql-table-name')?.value || 'table_name';
        const formattedTableName = `\`${tableName}\``;

        // 生成字段列表（使用反引号包围，防止SQL关键字冲突）
        const columns = headers.map(header => `\`${header.replace(/`/g, '``')}\``);

        // 根据操作类型生成SQL
        switch (operation) {
            case 'insert':
                if (dataRows.length === 0) {
                    return '没有数据行用于INSERT操作，请确保输入的表格包含表头和至少一行数据';
                }

                // 获取选中列和排除列
                const includeColsInput = document.getElementById('thp-sql-insert-include-columns')?.value;
                const excludeColsInput = document.getElementById('thp-sql-insert-exclude-columns')?.value;

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
                    return '(' + row.map(cell => this.formatSqlValue(cell)).join(',') + ')';
                }).join(',\n  ');


                return `INSERT INTO ${formattedTableName} (${filteredColumns.join(',')}) VALUES\n  ${insertValues};`;

            case 'select':
                // 获取查询条件字段
                const selectConditionInput = document.getElementById('thp-sql-select-condition')?.value;

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
                    return `SELECT * FROM ${formattedTableName};`;
                }

                // 构建IN子句中的值列表
                const valueTuples = dataRows.map(row => {
                    const tupleValues = [];
                    for (const colIndex of selectedColumnIndices) {
                        const cellValue = row[colIndex]?.trim();
                        // 使用通用方法处理单元格值
                        tupleValues.push(this.formatSqlValue(cellValue));
                    }
                    return `(${tupleValues.join(',')})`;
                }).filter(tuple => tuple !== '()'); // 过滤空元组

                // 如果没有有效的值元组，返回基本查询
                if (valueTuples.length === 0) {
                    return `SELECT * FROM ${formattedTableName};`;
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
                    return `SELECT * FROM ${formattedTableName} WHERE ${singleColumn} IN (${singleValues});`;
                } else {
                    // 多列情况：(列1,列2) IN ((值1,值2),(值3,值4),...)
                    const columnsPart = `(${selectedColumnNames.join(',')})`;
                    const valuesPart = valueTuples.join(',');
                    return `SELECT * FROM ${formattedTableName} WHERE ${columnsPart} IN (${valuesPart});`;
                }

            case 'update':
                if (dataRows.length === 0) {
                    return '没有数据行用于UPDATE操作，请确保输入的表格包含表头和至少一行数据';
                }

                // 获取更新列和查询列
                const setColsInput = document.getElementById('thp-sql-update-set-columns')?.value;
                const whereColsInput = document.getElementById('thp-sql-update-where-columns')?.value;

                let setColumns = columns;
                let whereColumns = columns;

                // 如果设置了更新列，则只使用指定的列
                if (setColsInput && setColsInput.trim()) {
                    const setCols = setColsInput.split(',').map(col => col.trim()).filter(col => col);
                    setColumns = columns.filter((col, idx) => setCols.includes(headers[idx].toLowerCase()));
                } else {
                    setColumns = []
                }

                // 如果设置了查询列，则只使用指定的列作为WHERE条件
                if (whereColsInput && whereColsInput.trim()) {
                    const whereCols = whereColsInput.split(',').map(col => col.trim()).filter(col => col);
                    whereColumns = columns.filter((col, idx) => whereCols.includes(headers[idx].toLowerCase()));
                } else if (setColumns.length == 0) {
                    // 更新列和查询列都没有设置时，使用所有的列作为查询列
                    whereColumns = columns
                }

                // 为每一行数据生成一个UPDATE语句
                const updateStatements = dataRows.map(row => {
                    // 构建SET子句
                    const setPairs = setColumns.map((col, colIdx) => {
                        // 找到对应的表头索引
                        const headerIdx = headers.findIndex(header => `\`${header}\`` === col);
                        return `${col} = ${this.formatSqlValue(row[headerIdx] || "")}`;
                    }).join(', ');

                    // 构建WHERE子句
                    const wherePairs = whereColumns.map((col, colIdx) => {
                        // 找到对应的表头索引
                        const headerIdx = headers.findIndex(header => `\`${header}\`` === col);
                        const val = this.formatSqlValue(row[headerIdx] || "")
                        if (val != 'NULL') {
                            return `${col} = ${this.formatSqlValue(row[headerIdx] || "")}`;
                        } else {
                            return `${col} is null`;
                        }

                    }).join(' AND ');

                    return `UPDATE ${tableName} SET ${setPairs} WHERE ${wherePairs};`;
                }).join('\n');
                return updateStatements;

            default:
                return '未知SQL操作';
        }
    }


    /**
     * Format cell value for SQL operations
     * Handles special values like null, (null), NULL and escapes single quotes
     * @param {string} cellText - The raw cell text content
     * @returns {string} - Formatted SQL value (with quotes) or NULL
     */
    static formatSqlValue(cellText) {
        if (cellText === null || cellText === undefined) {
            return 'NULL';
        }

        const trimmedText = cellText.toString().trim();

        // Check for null-like values
        if (trimmedText.toLowerCase() === 'null' || trimmedText === '(null)') {
            return 'NULL';
        }

        // Escape single quotes in the text using backslash
        const escapedText = trimmedText.replace(/'/g, "''");

        // Return the value wrapped in quotes
        return `'${escapedText}'`;
    }
}

// 页面初始化
document.addEventListener('DOMContentLoaded', function () {
    // 选项卡切换
    const tabs = document.querySelectorAll('.thp-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // 移除所有活动状态
            tabs.forEach(t => t.classList.remove('thp-tab-active'));
            document.querySelectorAll('.thp-tab-content').forEach(content => {
                content.classList.remove('thp-tab-content-active');
            });

            // 设置当前选项卡为活动状态
            tab.classList.add('thp-tab-active');
            const tabId = tab.getAttribute('data-tab');
            document.getElementById('thp-' + tabId).classList.add('thp-tab-content-active');
        });
    });

    // 基础操作相关事件
    document.getElementById('thp-cell-transform-checkbox').addEventListener('change', function () {
        const inputGroup = document.getElementById('thp-cell-transform-input-group');
        const hint = document.getElementById('thp-cell-transform-hint');
        if (inputGroup && hint) {
            inputGroup.style.display = this.checked ? 'block' : 'none';
            hint.style.display = this.checked ? 'block' : 'none';
        }
        // 自动触发计算
        triggerAutoCalculate();
    });

    document.getElementById('thp-col-merge-checkbox').addEventListener('change', function () {
        const inputGroup = document.getElementById('thp-col-merge-input-group');
        const hint = document.getElementById('thp-col-merge-hint');
        if (inputGroup && hint) {
            inputGroup.style.display = this.checked ? 'block' : 'none';
            hint.style.display = this.checked ? 'block' : 'none';
        }
        // 自动触发计算
        triggerAutoCalculate();
    });

    document.getElementById('thp-row-merge-checkbox').addEventListener('change', function () {
        const inputGroup = document.getElementById('thp-row-merge-input-group');
        const hint = document.getElementById('thp-row-merge-hint');
        if (inputGroup && hint) {
            inputGroup.style.display = this.checked ? 'block' : 'none';
            hint.style.display = this.checked ? 'block' : 'none';
        }
        // 自动触发计算
        triggerAutoCalculate();
    });

    document.getElementById('thp-col-dedup-checkbox').addEventListener('change', function () {
        // 自动触发计算
        triggerAutoCalculate();
    });

    // 监听输入框变化事件
    document.getElementById('thp-cell-transform-rule').addEventListener('input', function () {
        triggerAutoCalculate();
    });

    document.getElementById('thp-col-merge-template').addEventListener('input', function () {
        triggerAutoCalculate();
    });

    document.getElementById('thp-row-merge-separator').addEventListener('input', function () {
        triggerAutoCalculate();
    });

    // 监听输入区域变化
    document.getElementById('thp-basic-input').addEventListener('input', function () {
        triggerAutoCalculate();
    });

    // SQL操作相关事件
    const sqlOperationRadios = document.querySelectorAll('input[name="sql-operation"]');
    sqlOperationRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            // 隐藏所有SQL输入框
            document.getElementById('thp-insert-inputs').style.display = 'none';
            document.getElementById('thp-select-inputs').style.display = 'none';
            document.getElementById('thp-update-inputs').style.display = 'none';

            // 显示选中操作的输入框
            if (radio.value === 'insert') {
                document.getElementById('thp-insert-inputs').style.display = 'block';
            } else if (radio.value === 'select') {
                document.getElementById('thp-select-inputs').style.display = 'block';
            } else if (radio.value === 'update') {
                document.getElementById('thp-update-inputs').style.display = 'block';
            }

            // 自动触发计算
            triggerAutoCalculate();
        });
    });

    // 监听SQL输入框变化
    document.getElementById('thp-sql-table-name').addEventListener('input', function () {
        triggerAutoCalculate();
    });

    document.getElementById('thp-sql-insert-include-columns').addEventListener('input', function () {
        triggerAutoCalculate();
    });

    document.getElementById('thp-sql-insert-exclude-columns').addEventListener('input', function () {
        triggerAutoCalculate();
    });

    document.getElementById('thp-sql-select-condition').addEventListener('input', function () {
        triggerAutoCalculate();
    });

    document.getElementById('thp-sql-update-set-columns').addEventListener('input', function () {
        triggerAutoCalculate();
    });

    document.getElementById('thp-sql-update-where-columns').addEventListener('input', function () {
        triggerAutoCalculate();
    });

    // 监听SQL输入区域变化
    document.getElementById('thp-sql-input').addEventListener('input', function () {
        triggerAutoCalculate();
    });

    // 触发自动计算函数
    function triggerAutoCalculate() {
        const activeTab = document.querySelector('.thp-tab-content-active');
        if (activeTab.id === 'thp-basic-tab') {
            const input = document.getElementById('thp-basic-input').value;
            if (input.trim() !== '') {
                const result = TableToolUtils.executeBasicOperations(input);
                document.getElementById('thp-basic-result').value = result;
            }
        } else if (activeTab.id === 'thp-set-tab') {
            const input = document.getElementById('thp-set-input').value;
            if (input.trim() !== '') {
                const result = TableToolUtils.executeSetOperations(input);
                document.getElementById('thp-set-result').value = result;
            }
        } else if (activeTab.id === 'thp-sql-tab') {
            const input = document.getElementById('thp-sql-input').value;
            if (input.trim() !== '') {
                const result = TableToolUtils.executeSqlOperations(input);
                document.getElementById('thp-sql-result').value = result;
            }
        }
    }

    // 绑定执行按钮事件
    document.getElementById('thp-basic-execute').addEventListener('click', () => {
        const input = document.getElementById('thp-basic-input').value;
        const result = TableToolUtils.executeBasicOperations(input);
        document.getElementById('thp-basic-result').value = result;
    });

    document.getElementById('thp-set-execute').addEventListener('click', () => {
        const input = document.getElementById('thp-set-input').value;
        const result = TableToolUtils.executeSetOperations(input);
        document.getElementById('thp-set-result').value = result;
    });

    document.getElementById('thp-sql-execute').addEventListener('click', () => {
        const input = document.getElementById('thp-sql-input').value;
        const result = TableToolUtils.executeSqlOperations(input);
        document.getElementById('thp-sql-result').value = result;
    });

    // 监听集合操作输入框变化
    document.getElementById('thp-set-input').addEventListener('input', function () {
        triggerAutoCalculate();
    });

    // 绑定复制和导出按钮事件
    document.getElementById('thp-basic-copy').addEventListener('click', () => {
        const result = document.getElementById('thp-basic-result').value;
        TableToolUtils.copyToClipboard(result);
        TableToolUtils.showStatusMessage('thp-basic-status', '结果已复制到剪贴板', 'info');
    });

    document.getElementById('thp-basic-export').addEventListener('click', () => {
        const result = document.getElementById('thp-basic-result').value;
        TableToolUtils.exportAsFile(result, 'basic-operation-result.txt');
        TableToolUtils.showStatusMessage('thp-basic-status', '结果已导出', 'info');
    });

    document.getElementById('thp-set-copy').addEventListener('click', () => {
        const result = document.getElementById('thp-set-result').value;
        TableToolUtils.copyToClipboard(result);
        TableToolUtils.showStatusMessage('thp-set-status', '结果已复制到剪贴板', 'info');
    });

    document.getElementById('thp-set-export').addEventListener('click', () => {
        const result = document.getElementById('thp-set-result').value;
        TableToolUtils.exportAsFile(result, 'set-operation-result.txt');
        TableToolUtils.showStatusMessage('thp-set-status', '结果已导出', 'info');
    });

    document.getElementById('thp-sql-copy').addEventListener('click', () => {
        const result = document.getElementById('thp-sql-result').value;
        TableToolUtils.copyToClipboard(result);
        TableToolUtils.showStatusMessage('thp-sql-status', '结果已复制到剪贴板', 'info');
    });

    document.getElementById('thp-sql-export').addEventListener('click', () => {
        const result = document.getElementById('thp-sql-result').value;
        TableToolUtils.exportAsFile(result, 'sql-operation-result.txt');
        TableToolUtils.showStatusMessage('thp-sql-status', '结果已导出', 'info');
    });

    // 初始化时触发一次单选按钮事件以显示相应输入框
    const checkedRadio = document.querySelector('input[name="sql-operation"]:checked');
    if (checkedRadio) {
        checkedRadio.dispatchEvent(new Event('change'));
    }
});

// 国际化处理函数
function initializeI18n() {
    // 等待 i18n 对象加载完成
    if (typeof window.i18n !== 'undefined') {
        // 初始化当前语言环境
        window.i18n.init();

        // 查找并翻译所有带有 data-i18n 属性的元素
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = window.i18n.t(key);
            if (translation && translation !== key) {
                // 检查是否需要翻译属性（如placeholder）
                if (element.hasAttribute('data-i18n-attr')) {
                    const attrName = element.getAttribute('data-i18n-attr');
                    element.setAttribute(attrName, translation);
                } else {
                    // 获取元素内的所有文本节点并替换
                    const textNodes = getTextNodes(element);
                    if (textNodes.length > 0) {
                        // 替换第一个文本节点的内容
                        textNodes[0].textContent = translation;
                    } else {
                        // 如果没有子文本节点，直接设置文本内容
                        element.textContent = translation;
                    }
                }
            }
        });

        // 更新页面标题
        document.title = window.i18n.t('tableTool');
    } else {
        console.warn('i18n module not found');
    }
}

// 获取元素内的所有文本节点
function getTextNodes(element) {
    const textNodes = [];
    const walker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );

    let node;
    while (node = walker.nextNode()) {
        // 只获取直接的文本节点，不包括子元素内的文本节点
        if (node.parentNode === element || !hasElementAncestorIn(element, node)) {
            textNodes.push(node);
        }
    }

    return textNodes;
}

// 检查文本节点是否有祖先元素在指定父元素内
function hasElementAncestorIn(parent, textNode) {
    let currentNode = textNode.parentNode;
    while (currentNode && currentNode !== parent) {
        if (currentNode.nodeType === Node.ELEMENT_NODE) {
            return true;
        }
        currentNode = currentNode.parentNode;
    }
    return false;
}

// 等待 DOM 加载完成后初始化国际化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeI18n);
} else {
    initializeI18n();
}
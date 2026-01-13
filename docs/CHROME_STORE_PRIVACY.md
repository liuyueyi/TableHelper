# Chrome Web Store 隐私权规范填写指南

## 1. 单一用途说明 (Single Purpose)

**中文：**
```
SuperTables 的单一用途是帮助用户选择、复制和分析网页上的表格数据。用户可以像使用 Excel 一样选择表格单元格、行或列，查看统计信息（求和、平均值等），并将数据复制到剪贴板或导出为 Excel 文件。
```

**English：**
```
SuperTables has a single purpose: to help users select, copy, and analyze table data on web pages. Users can select table cells, rows, or columns like in Excel, view statistics (sum, average, etc.), and copy data to clipboard or export as Excel files.
```

---

## 2. 权限说明 (Permission Justifications)

### 远程代码 (Remote Code)
```
此扩展不使用任何远程代码。所有代码都打包在扩展内部，不从外部服务器加载或执行任何脚本。
```
```
This extension does not use any remote code. All code is bundled within the extension and no scripts are loaded or executed from external servers.
```

### 主机权限 / Host Permissions (<all_urls>)
```
需要 <all_urls> 权限是因为用户可能需要在任意网站上选择和复制表格数据。扩展需要在所有网页上运行内容脚本，以便检测表格元素并响应用户的选择操作。扩展不会收集或传输任何用户数据。
```
```
The <all_urls> permission is required because users may need to select and copy table data on any website. The extension needs to run content scripts on all web pages to detect table elements and respond to user selection actions. The extension does not collect or transmit any user data.
```

### activeTab 权限
```
activeTab 权限用于在用户当前浏览的标签页中执行表格选择功能。这使扩展能够在用户主动交互时访问当前页面的 DOM，以识别和高亮显示表格单元格。
```
```
The activeTab permission is used to execute table selection functionality in the user's current tab. This allows the extension to access the current page's DOM when the user actively interacts, to identify and highlight table cells.
```

### clipboardWrite 权限
```
clipboardWrite 权限用于将用户选中的表格数据复制到系统剪贴板。当用户按下 Cmd/Ctrl+C 或点击统计面板中的数值时，扩展会将选中的数据写入剪贴板，以便用户可以粘贴到 Excel 或其他应用程序。
```
```
The clipboardWrite permission is used to copy user-selected table data to the system clipboard. When users press Cmd/Ctrl+C or click values in the statistics panel, the extension writes the selected data to the clipboard so users can paste it into Excel or other applications.
```

### offscreen 权限
```
offscreen 权限用于在后台处理剪贴板操作。由于 Manifest V3 的限制，service worker 无法直接访问剪贴板 API，因此需要使用 offscreen document 来完成复制操作。
```
```
The offscreen permission is used to handle clipboard operations in the background. Due to Manifest V3 restrictions, service workers cannot directly access the clipboard API, so an offscreen document is needed to complete copy operations.
```

### scripting 权限
```
scripting 权限用于在旧版 Chrome 浏览器中作为 offscreen API 的回退方案，以确保剪贴板复制功能在所有支持的 Chrome 版本中都能正常工作。
```
```
The scripting permission is used as a fallback for the offscreen API in older Chrome browsers, to ensure clipboard copy functionality works correctly across all supported Chrome versions.
```

### storage 权限
```
storage 权限用于保存用户的个人偏好设置，包括自定义快捷键和统计面板位置。这些设置存储在 Chrome 的同步存储中，可以在用户的多个设备之间同步。不存储任何个人数据或浏览历史。
```
```
The storage permission is used to save user preferences, including custom keyboard shortcuts and statistics panel position. These settings are stored in Chrome's sync storage and can be synced across the user's devices. No personal data or browsing history is stored.
```

---

## 3. 数据使用声明

### 此扩展是否收集用户数据？
**选择：否 (No)**

### 数据使用认证
勾选确认：
- ✅ 我确认此扩展不收集用户数据
- ✅ 我已阅读并同意 Chrome Web Store 开发者计划政策

---

## 4. 其他需要完成的步骤

### 验证邮箱
在"账号"标签页中验证您的联系邮箱地址

### 上传图标
- 商店图标：128x128 像素
- 文件位置：`icons/icon128.png`

### 上传截图
文件位置：`screenshots/output/`
- screenshot-1-numeric-mode.png
- screenshot-2-text-mode.png
- screenshot-3-popup-settings.png
- screenshot-4-documentation.png

---

## 5. 快速复制模板

### 隐私权规范 - 完整回答（中文）

**单一用途：**
```
帮助用户选择、复制和分析网页上的表格数据，支持单元格/行/列选择、统计分析和Excel导出。
```

**权限理由（统一回答）：**
```
• <all_urls>：需要在任意网站上检测和选择表格元素
• activeTab：在当前标签页执行表格选择功能
• clipboardWrite：将选中的表格数据复制到剪贴板
• offscreen：Manifest V3 下处理后台剪贴板操作
• scripting：旧版浏览器的剪贴板操作回退方案
• storage：保存用户的快捷键和界面偏好设置

此扩展不收集任何用户数据，不连接外部服务器，所有处理在本地完成。
```

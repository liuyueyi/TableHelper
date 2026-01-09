<p align="center">
  <img src="icons/logo.png" alt="SuperTables Logo" width="128" height="128">
</p>

<h1 align="center">SuperTables</h1>

<p align="center">
  <a href="https://github.com/wxkingstar/SuperTables"><img src="https://img.shields.io/badge/Chrome-扩展程序-green" alt="Chrome Web Store"></a>
  <a href="https://github.com/wxkingstar/SuperTables"><img src="https://img.shields.io/badge/版本-1.1.0-blue" alt="Version"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/许可证-MIT-green" alt="License"></a>
</p>

<p align="center">
  <b>语言 / Language / 言語</b>: <a href="README_en.md">English</a> | 简体中文 | <a href="README_ja.md">日本語</a>
</p>

---

像 Excel 一样选择网页表格 - 选择、复制、分析任意网页上的表格数据。

## 功能特性

### 单元格选择
- **选择单元格**: `Cmd/Ctrl + 点击` - 选择单个单元格
- **选择整行**: `Cmd/Ctrl + Alt + 点击` - 选择整行
- **选择整列**: `Alt + 点击` - 选择整列
- **范围选择**: `Shift + 点击` - 从锚点单元格选择范围
- **扩展选择**: `Cmd/Ctrl + Shift + 方向键` - 扩展选择到列/行边缘
- **全选表格**: 悬停在表格上时点击出现的"全选"按钮

### 统计面板
页面底部实时显示统计信息：
- **数值模式**: 计数、求和、平均值、最小值、最大值
- **文本模式**: Top 5 出现频率最高的值
- 点击任意统计值即可复制

### 导出与复制
- `Cmd/Ctrl + C` - 复制选中单元格到剪贴板
- 选中整个表格时可下载为 Excel 文件
- 多语言提示通知（英文、中文、日文）

### 智能功能
- **保留空占位符**: 复制非连续单元格时保持间隔位置
- **自动清理**: 表格结构变化时自动清理无效选择

### 自定义设置
- 键盘快捷键
- 统计栏位置（左、中、右）
- 列选择时是否包含表头

## 截图

| 数值模式 | 文本模式 |
|---------|---------|
| ![数值模式](screenshots/output/screenshot-1-numeric-mode.png) | ![文本模式](screenshots/output/screenshot-2-text-mode.png) |

## 安装

### Chrome 网上应用店
[从 Chrome 网上应用店安装](https://chromewebstore.google.com/detail/supertables/eonhkaekeodnhfmajkjgiikmjakekjnj?hl=zh-CN)

### 手动安装
1. 下载或克隆此仓库
2. 打开 Chrome 浏览器，访问 `chrome://extensions/`
3. 在右上角启用"开发者模式"
4. 点击"加载已解压的扩展程序"，选择项目文件夹

## 使用方法

### 基本选择操作
| 操作 | 快捷键 |
|-----|-------|
| 选择单元格 | `Cmd/Ctrl` + 点击 |
| 选择整行 | `Cmd/Ctrl` + `Alt` + 点击 |
| 选择整列 | `Alt` + 点击 |
| 范围选择 | `Shift` + 点击 |
| 扩展选择 | `Cmd/Ctrl` + `Shift` + `↑↓←→` |
| 复制选中内容 | `Cmd/Ctrl` + `C` |
| 清除选择 | `Esc` |

### 统计面板
选择单元格后，统计面板会自动显示：
- **数值数据**: 显示求和、平均值、最小值、最大值
- **文本数据**: 显示 Top 5 出现频率最高的值
- 点击切换按钮可在两种模式间切换
- 点击任意数值可复制到剪贴板

## 项目结构

```
supertables/
├── manifest.json           # 扩展清单文件
├── background/
│   └── service-worker.js   # 后台服务工作器
├── content/
│   ├── content.js          # 主内容脚本
│   ├── content.css         # 样式文件
│   ├── TableDetector.js    # 表格检测逻辑
│   ├── SelectionManager.js # 单元格选择处理
│   ├── StatsPanel.js       # 统计面板 UI
│   ├── ClipboardHandler.js # 复制功能
│   ├── ExcelExporter.js    # Excel 导出
│   └── SettingsManager.js  # 用户设置
├── popup/
│   ├── popup.html          # 弹出窗口 UI
│   ├── popup.js            # 弹出窗口逻辑
│   └── i18n.js             # 国际化
├── icons/                  # 扩展图标
└── _locales/               # 语言文件
    ├── en/
    ├── zh_CN/
    └── ja/
```

## 国际化支持

SuperTables 支持多种语言：
- 英语 (en)
- 简体中文 (zh_CN)
- 日语 (ja)

## 开发

### 构建
```bash
./build.sh
```

这将在 `dist/` 文件夹中创建可分发的 zip 文件。

### 本地开发
1. 修改源文件
2. 访问 `chrome://extensions/`
3. 点击 SuperTables 扩展卡片上的刷新按钮

## 隐私声明

SuperTables：
- 不收集任何个人数据
- 不向外部服务器发送数据
- 仅访问您浏览页面上的表格数据
- 所有处理均在您的浏览器本地进行

## 贡献

欢迎贡献代码！请随时提交 Pull Request。

## 许可证

MIT 许可证 - 详见 [LICENSE](LICENSE) 文件。

## 作者

**wangxin** - [GitHub](https://github.com/wxkingstar)

---

如果您觉得这个扩展有用，请考虑在 GitHub 上给它一个 Star！

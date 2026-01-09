# SuperTables - AI 图片生成提示词

## 如何获取截图

### 方法一：使用演示页面（推荐）

1. 在浏览器中打开 `demo.html` 和 `demo-text-mode.html`
2. 使用浏览器截图或系统截图工具
3. 裁剪为 1280x800 尺寸

### 方法二：使用宣传页面模板

1. 打开 `promo-small.html`（440x280）和 `promo-large.html`（1400x560）
2. 直接截图即可

---

## Gemini / DALL-E / Midjourney 提示词

### 小型宣传图 (440x280)

**中文提示词：**
```
设计一个Chrome扩展的宣传图，尺寸440x280像素。

主题：表格数据选择工具
品牌名称：SuperTables
主色调：深绿色(#217346)渐变到深绿(#0d3320)

设计要素：
- 居中显示一个圆角白色图标框，里面是表格图标
- 下方显示"SuperTables"标题，白色粗体
- 副标题"Select Tables Like Excel"
- 背景添加淡淡的网格线条装饰
- 四角点缀一些半透明的单元格方块图形
- 整体风格：简洁、专业、科技感

不要：文字过多、复杂插图、人物
```

**English Prompt:**
```
Design a Chrome extension promotional banner, 440x280 pixels.

Theme: Table data selection tool
Brand name: SuperTables
Color scheme: Dark green (#217346) gradient to deep green (#0d3320)

Design elements:
- Centered white rounded icon box with table/grid icon inside
- "SuperTables" title below in bold white
- Tagline "Select Tables Like Excel"
- Subtle grid line pattern in background
- Semi-transparent cell/box shapes in corners as decoration
- Style: Clean, professional, tech-forward

Avoid: Too much text, complex illustrations, people
```

---

### 大型宣传图 (1400x560)

**中文提示词：**
```
设计一个Chrome扩展的宽幅宣传横幅，尺寸1400x560像素。

品牌：SuperTables
功能：像Excel一样在网页上选择表格数据

布局：左右分栏
- 左侧（40%）：
  - 圆角白色Logo框 + 表格图标
  - 大标题"SuperTables"白色粗体
  - 副标题"Select table cells like Excel on any webpage"
  - 4个功能标签胶囊：Select, Copy, Analyze, Export

- 右侧（60%）：
  - 模拟的浏览器窗口，带红黄绿三个圆点
  - 里面显示一个数据表格
  - 部分单元格高亮选中（绿色边框+浅绿背景）
  - 底部悬浮一个深色统计面板，显示Sum、Avg等数值

背景：深绿色渐变 + 淡淡网格纹理
风格：现代、简洁、专业的SaaS产品宣传风格

不要：3D效果过重、卡通风格、人物
```

**English Prompt:**
```
Design a wide Chrome extension promotional banner, 1400x560 pixels.

Brand: SuperTables
Function: Select table cells like Excel on any webpage

Layout: Two-column design
- Left side (40%):
  - White rounded logo box with table/grid icon
  - Large "SuperTables" title in bold white
  - Tagline "Select table cells like Excel on any webpage"
  - 4 feature pill badges: Select, Copy, Analyze, Export

- Right side (60%):
  - Simulated browser window with red/yellow/green dots
  - Shows a data table inside
  - Some cells highlighted/selected (green border + light green background)
  - Dark floating stats panel at bottom showing Sum, Avg values

Background: Dark green gradient with subtle grid texture
Style: Modern, clean, professional SaaS product style

Avoid: Heavy 3D effects, cartoon style, people/characters
```

---

### 商店截图建议

Chrome Web Store 需要 1-5 张截图（1280x800 或 640x400）

**截图1 - 主功能展示**
```
展示SuperTables在实际网页表格上的使用效果：
- 一个专业的销售数据表格
- 多个单元格被选中（绿色高亮）
- 底部显示统计面板（Sum, Average, Min, Max）
- 右上角显示快捷键提示
- 左上角显示扩展图标
```

**截图2 - 列选择功能**
```
展示整列选择功能：
- 订单管理表格
- 整列（如Status列）被选中高亮
- 文本模式统计面板（Top 5频率统计）
- 蓝色渐变的统计面板风格
```

**截图3 - 复制到Excel**
```
分屏对比图：
- 左侧：网页表格选中状态
- 右侧：Excel中粘贴后的效果
- 中间箭头表示数据流向
- 突出"一键复制，保持格式"
```

**截图4 - 设置界面**
```
展示扩展弹窗设置界面：
- 快捷键设置列表
- 统计栏位置选项
- 简洁的UI设计
- 底部的使用文档链接
```

**截图5 - Excel导出**
```
展示整表导出功能：
- 表格右上角的"全选"按钮
- 整个表格被选中
- 统计面板显示"下载Excel"按钮
- 下方显示导出的.xlsx文件图标
```

---

## 使用已有的HTML模板

我已创建了可直接截图的HTML模板：

| 文件 | 用途 | 尺寸 |
|------|------|------|
| `demo.html` | 数字模式截图 | 1280x800 |
| `demo-text-mode.html` | 文本模式截图 | 1280x800 |
| `promo-small.html` | 小型宣传图 | 440x280 |
| `promo-large.html` | 大型宣传图 | 1400x560 |

### 截图方法

**Mac:**
- 全屏截图: `Cmd + Shift + 3`
- 区域截图: `Cmd + Shift + 4`
- 窗口截图: `Cmd + Shift + 4`, 然后按空格

**Windows:**
- 截图工具: `Win + Shift + S`

**Chrome DevTools:**
1. 打开 DevTools (F12)
2. `Cmd/Ctrl + Shift + P`
3. 输入 "screenshot"
4. 选择 "Capture screenshot" 或 "Capture full size screenshot"

---

## 图片优化建议

1. **格式**: PNG（推荐）或 JPEG
2. **压缩**: 使用 TinyPNG 压缩（https://tinypng.com）
3. **文件大小**: 每张图片 < 1MB
4. **分辨率**: 确保清晰锐利，无模糊

#!/bin/bash

# SuperTables - Sync Chrome to Safari
# 将 Chrome 版本代码同步到 Safari 版本

set -e

CHROME_DIR="/Users/wangxin/Documents/work/chrome/supertables"
SAFARI_RESOURCES="/Users/wangxin/Documents/work/chrome/supertables-safari/SuperTables/Shared (Extension)/Resources"
SAFARI_PROJECT="/Users/wangxin/Documents/work/chrome/supertables-safari/SuperTables"

echo "🔄 同步 SuperTables Chrome → Safari"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 检查目录是否存在
if [ ! -d "$SAFARI_RESOURCES" ]; then
    echo "❌ Safari 项目不存在，请先运行转换工具"
    exit 1
fi

# 同步通用文件
echo "📁 同步 content/ ..."
rm -rf "$SAFARI_RESOURCES/content"
cp -r "$CHROME_DIR/content" "$SAFARI_RESOURCES/"

echo "📁 同步 popup/ ..."
rm -rf "$SAFARI_RESOURCES/popup"
cp -r "$CHROME_DIR/popup" "$SAFARI_RESOURCES/"

echo "📁 同步 background/ ..."
rm -rf "$SAFARI_RESOURCES/background"
cp -r "$CHROME_DIR/background" "$SAFARI_RESOURCES/"

echo "📁 同步 icons/ ..."
rm -rf "$SAFARI_RESOURCES/icons"
cp -r "$CHROME_DIR/icons" "$SAFARI_RESOURCES/"

echo "📁 同步 _locales/ ..."
rm -rf "$SAFARI_RESOURCES/_locales"
cp -r "$CHROME_DIR/_locales" "$SAFARI_RESOURCES/"

# 处理 manifest.json - 移除 offscreen 权限
echo "📝 处理 manifest.json (移除 offscreen) ..."
cat "$CHROME_DIR/manifest.json" | \
    sed 's/"offscreen", //g' | \
    sed 's/, "offscreen"//g' | \
    sed 's/"offscreen"//g' \
    > "$SAFARI_RESOURCES/manifest.json"

# 不复制 offscreen 文件
echo "🚫 跳过 offscreen.html, offscreen.js (Safari 不支持)"

# 清理 .DS_Store
find "$SAFARI_RESOURCES" -name ".DS_Store" -delete 2>/dev/null || true

echo ""
echo "✅ 代码同步完成"
echo ""

# 询问是否编译
read -p "是否重新编译 Safari 版本? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🔨 编译 Safari 版本..."
    cd "$SAFARI_PROJECT"
    xcodebuild -scheme "SuperTables (macOS)" -configuration Debug build 2>&1 | grep -E "(BUILD|error:|warning:)" || true

    # 复制到 Applications
    APP_PATH=~/Library/Developer/Xcode/DerivedData/SuperTables-*/Build/Products/Debug/SuperTables.app
    if ls $APP_PATH 1> /dev/null 2>&1; then
        echo "📦 安装到 /Applications/ ..."
        rm -rf /Applications/SuperTables.app
        cp -R $APP_PATH /Applications/
        echo "✅ 安装完成"

        read -p "是否打开 SuperTables? (y/n) " -n 1 -r
        echo ""
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            open /Applications/SuperTables.app
        fi
    fi
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 同步完成!"

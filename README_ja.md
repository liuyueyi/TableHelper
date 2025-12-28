<p align="center">
  <img src="icons/logo.png" alt="SuperTables Logo" width="128" height="128">
</p>

<h1 align="center">SuperTables</h1>

<p align="center">
  <a href="https://github.com/wxkingstar/SuperTables"><img src="https://img.shields.io/badge/Chrome-拡張機能-green" alt="Chrome Web Store"></a>
  <a href="https://github.com/wxkingstar/SuperTables"><img src="https://img.shields.io/badge/バージョン-1.0.0-blue" alt="Version"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/ライセンス-MIT-green" alt="License"></a>
</p>

<p align="center">
  <b>言語 / Language / 语言</b>: <a href="README.md">English</a> | <a href="README_zh-CN.md">简体中文</a> | 日本語
</p>

---

Excel のようにテーブルセルを選択 - 任意のウェブページでテーブルデータを選択、コピー、分析できます。

## 機能

### セル選択
- **単一セル選択**: `Cmd/Ctrl + クリック` - 個別のセルを選択
- **行選択**: `Cmd/Ctrl + Alt + クリック` - 行全体を選択
- **列選択**: `Alt + クリック` - 列全体を選択
- **範囲選択**: `Shift + クリック` - アンカーセルから範囲を選択
- **全選択**: テーブルにホバーすると表示される「全選択」ボタンをクリック

### 統計パネル
ページ下部にリアルタイムで統計情報を表示：
- **数値モード**: カウント、合計、平均、最小値、最大値
- **テキストモード**: 出現頻度上位5件
- 統計値をクリックしてコピー

### エクスポートとコピー
- `Cmd/Ctrl + C` - 選択したセルをクリップボードにコピー
- テーブル全体を選択すると Excel ファイルとしてダウンロード可能

### カスタマイズ設定
- キーボードショートカット
- 統計バーの位置（左、中央、右）
- 列選択時のヘッダー行の含有設定

## スクリーンショット

| 数値モード | テキストモード |
|-----------|---------------|
| ![数値モード](screenshots/output/screenshot-1-numeric-mode.png) | ![テキストモード](screenshots/output/screenshot-2-text-mode.png) |

## インストール

### Chrome ウェブストア
*（近日公開予定）*

### 手動インストール
1. このリポジトリをダウンロードまたはクローン
2. Chrome を開き、`chrome://extensions/` にアクセス
3. 右上の「デベロッパーモード」を有効にする
4. 「パッケージ化されていない拡張機能を読み込む」をクリックし、プロジェクトフォルダを選択

## 使い方

### 基本的な選択操作
| 操作 | ショートカット |
|-----|---------------|
| セル選択 | `Cmd/Ctrl` + クリック |
| 行選択 | `Cmd/Ctrl` + `Alt` + クリック |
| 列選択 | `Alt` + クリック |
| 範囲選択 | `Shift` + クリック |
| 選択内容をコピー | `Cmd/Ctrl` + `C` |
| 選択解除 | `Esc` |

### 統計パネル
セルを選択すると、統計パネルが自動的に表示されます：
- **数値データ**: 合計、平均、最小値、最大値を表示
- **テキストデータ**: 出現頻度上位5件を表示
- トグルボタンでモードを切り替え
- 任意の値をクリックしてクリップボードにコピー

## プロジェクト構成

```
supertables/
├── manifest.json           # 拡張機能マニフェスト
├── background/
│   └── service-worker.js   # バックグラウンドサービスワーカー
├── content/
│   ├── content.js          # メインコンテンツスクリプト
│   ├── content.css         # スタイル
│   ├── TableDetector.js    # テーブル検出ロジック
│   ├── SelectionManager.js # セル選択処理
│   ├── StatsPanel.js       # 統計パネル UI
│   ├── ClipboardHandler.js # コピー機能
│   ├── ExcelExporter.js    # Excel エクスポート
│   └── SettingsManager.js  # ユーザー設定
├── popup/
│   ├── popup.html          # ポップアップ UI
│   ├── popup.js            # ポップアップロジック
│   └── i18n.js             # 国際化
├── icons/                  # 拡張機能アイコン
└── _locales/               # 言語ファイル
    ├── en/
    ├── zh_CN/
    └── ja/
```

## 国際化対応

SuperTables は複数の言語をサポートしています：
- 英語 (en)
- 簡体字中国語 (zh_CN)
- 日本語 (ja)

## 開発

### ビルド
```bash
./build.sh
```

これにより `dist/` フォルダに配布用の zip ファイルが作成されます。

### ローカル開発
1. ソースファイルを変更
2. `chrome://extensions/` にアクセス
3. SuperTables 拡張機能カードの更新ボタンをクリック

## プライバシー

SuperTables は：
- 個人データを収集しません
- 外部サーバーにデータを送信しません
- 閲覧中のページのテーブルデータにのみアクセスします
- すべての処理はブラウザ内でローカルに行われます

## コントリビューション

コントリビューションを歓迎します！お気軽に Pull Request を提出してください。

## ライセンス

MIT ライセンス - 詳細は [LICENSE](LICENSE) をご覧ください。

## 作者

**wangxin** - [GitHub](https://github.com/wxkingstar)

---

この拡張機能が役に立ったら、GitHub でスターを付けていただけると嬉しいです！

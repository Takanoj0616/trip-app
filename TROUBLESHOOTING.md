# トラブルシューティングガイド

## 🔥 現在発生中のエラー解決方法

### ❌ 404エラー: `GET http://localhost:3000/_next/static/...`

このエラーは以下の原因で発生します：

#### 原因
1. **ポート競合**: 複数の開発サーバーが異なるポートで動作
2. **ブラウザキャッシュ**: 古いポート情報がキャッシュされている
3. **プロセス重複**: 前回のサーバーが残っている

#### 🚨 即効解決方法

### 1. ブラウザキャッシュをクリア
```
Chrome/Edge:
- Ctrl+Shift+R (Windows) または Cmd+Shift+R (Mac)
- または開発者ツール(F12) → Application → Storage → Clear storage

Firefox:
- Ctrl+Shift+R (Windows) または Cmd+Shift+R (Mac)
- または Ctrl+F5

Safari:
- Cmd+Option+R
- または開発メニュー → キャッシュを空にする
```

### 2. 開発サーバーを完全に再起動
```bash
# 1. すべてのNode.jsプロセスを確認
ps aux | grep node

# 2. Next.jsプロセスを終了
pkill -f "next dev"

# 3. ポート3000を使用中のプロセスを終了
lsof -ti:3000 | xargs kill -9

# 4. 開発サーバーを再起動
cd /Users/j.takano/Desktop/trip-app
npm run dev
```

### 3. ブラウザで正しいURLにアクセス
```
✅ 正しい: http://localhost:3000
❌ 間違い: http://localhost:3001 (古いポート)
```

### 4. 完全にクリーンスタート
```bash
# Next.jsキャッシュをクリア
rm -rf .next

# node_modulesを再インストール（必要に応じて）
rm -rf node_modules
npm install

# 開発サーバー起動
npm run dev
```

## 🔍 その他よくあるエラー

### Firebase関連エラー
- **解決済み**: モック実装により解決
- 本格運用時は `FIREBASE_SETUP.md` を参照

### 多言語対応の警告
```
⚠ i18n configuration in next.config.ts is unsupported in App Router
```
- **影響**: なし（機能は正常動作）
- **対応**: App Router用の国際化に後で移行予定

### ポート使用エラー
```
Port 3000 is in use by process XXX
```
- **解決**: 上記の手順2を実行

## 📱 動作確認手順

### 1. サーバー起動確認
```bash
npm run dev
# ✅ Ready in XXXXms が表示されること
```

### 2. ブラウザアクセス確認
```
URL: http://localhost:3000
✅ 旅しおりサイトが表示される
✅ コンソールに Firebase モックメッセージが表示される
✅ デモユーザーで自動ログイン
```

### 3. 機能動作確認
- ✅ ヘッダーナビゲーション
- ✅ 言語切り替え
- ✅ お気に入り機能
- ✅ 履歴ページ

## 🆘 それでも解決しない場合

### デバッグ情報収集
```bash
# 1. ポート使用状況確認
netstat -tulpn | grep 3000

# 2. Node.jsプロセス確認
ps aux | grep node

# 3. Next.jsログ確認
npm run dev --verbose
```

### 開発者ツールでエラー確認
1. F12で開発者ツールを開く
2. Console タブでエラーメッセージを確認
3. Network タブで失敗しているリクエストを確認

### 最終手段：プロジェクト再作成
```bash
# バックアップ作成
cp -r /Users/j.takano/Desktop/trip-app /Users/j.takano/Desktop/trip-app-backup

# 新しいプロジェクト作成
cd /Users/j.takano/Desktop
npx create-next-app@latest trip-app-new --typescript --tailwind --eslint --app --src-dir

# ソースコードを手動移行
```
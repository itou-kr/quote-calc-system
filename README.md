## 実行・開発環境

■ Node.js
→バージョンはフロントとバックの両方を実行し開発するために使用。
今回使用するバージョン：XXXX

※将来的にサーバレスでlamdaなどを使用する場合、lamdaで動く用のバージョンにする必要がある。


■ Visual Studio Code
- 拡張機能
・ESLint（https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint）

・Prettier - Code formatter（https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode）


■ JAVA
　11以上（https://adoptium.net/temurin/releases?version=11&os=any&arch=any）
  → 伊藤は17にしました。が、11以上であれば動くはず…。


## 実行方法

### 開発に必要なフレームワーク、ライブラリをインストール（初回またはpackageにフレームワーク、ライブラリを追加時）

  npm ci


※ネットワークエラーが出る前に「PowerShell -ExecutionPolicy RemoteSigned npm XXX」

### docs/openapi側のyml追加、変更があった時openapi generater を実行する（client側とapi側と共に）

  npm run codegen

### openaiに関して

　src/openapiは openapi-generatorを利用しdocs/openapi/index.ymlから自動生成したソースとなっている。そのため手動での修正は禁止でdocs/openapi側のymlを修正しopenapi generator を実行してください。

### 静的ファイルをビルドする（client側とapi側と共に）

  npm run build

### デバッグで実行する（api側）

  npm run start

### デバッグで実行する（client側）

  npm run dev

ブラウザでターミナルに出力されたログのLocalのURLを開く
例：http://localhost:{PORT}
※ {PORT} は出力されたログのURLの物に置き換える


## パフォーマンス最適化

アプリケーションのパフォーマンスを向上させるため、以下の最適化を実装しています：

### 実装済みの最適化
1. **ルーティングのメモ化** - ページ遷移の高速化
2. **Progress表示の最適化** - 体感速度の向上（300ms以下の処理では非表示）
3. **React Query の導入** - APIレスポンスのキャッシング戦略
4. **Code Splitting の改善** - 初期ロード時間の短縮

### 詳細情報
- [パフォーマンス最適化ガイド](./docs/PERFORMANCE_OPTIMIZATION.md)
- [実装サマリー](./docs/OPTIMIZATION_SUMMARY.md)

### React Query の使用例
```typescript
import { useApiQuery } from '@front/hooks/query';

const { data, isLoading } = useApiQuery(
  ['users', userId],
  () => fetchUser(userId)
);
```

## コーディング規約

ESLint, Prettierに設定されているコーディングルールを守ること。
warningは仕様で仕方ない場合はコメントを記載し、ルールから除外してもいい。
errorは出ないように解決してください。

### 手動コーディングチェック

  npm run lint

## インストールしたパッケージ
🔹 linters / formatters 関連

@eslint/js / eslint
JavaScript / TypeScript の文法チェック、コーディング規約のチェック

eslint-config-prettier
ESLint と Prettier の競合を解消する設定

eslint-plugin-prettier
ESLint 上で Prettier の整形ルールを適用

prettier
コード整形ツール

🔹 TypeScript 関連

typescript
TypeScript コンパイラ本体

ts-node
TypeScript ファイルを直接 Node.js で実行できるツール

tsconfig-paths
tsconfig.json のパスエイリアスを Node.js で解決するツール

typescript-eslint
ESLint で TypeScript を扱うためのパッケージ

🔹 Node.js / 実行関連

nodemon
ファイル変更時に自動で Node.js を再起動するツール

dotenv
.env ファイルから環境変数を読み込む

globals
グローバル変数を ESLint や TypeScript で認識させるための型定義

🔹 型定義関連（@types/xxx）

@types/node → Node.js 標準モジュール用型定義

@types/express → Express 用型定義

@types/jsonwebtoken → jsonwebtoken 用型定義

@types/http-errors → http-errors 用型定義

@types/cookie-parser → cookie-parser 用型定義

@types/lodash → lodash 用型定義

@types/nodemailer → nodemailer 用型定義

@types/oracledb → oracledb 用型定義

@types/aws-lambda → AWS Lambda 用型定義

🔹 CLI / ユーティリティ

@openapitools/openapi-generator-cli → OpenAPI 仕様から自動でクライアント・サーバーコード生成

@redocly/cli → OpenAPI ドキュメント生成・確認用 CLI

rimraf → UNIX の rm -rf 相当（ディレクトリ削除用）


🔹 dependencies 一覧

@aws-lambda-powertools/logger

@aws-sdk/client-secrets-manager

@codegenie/serverless-express

@middy/core

axios

cookie-parser

csv-stringify

exceljs

express

express-openapi-validator

format-message

http-errors

i18next

jsonwebtoken

lodash

nodemailer



## ディレクトリ構成

### client側
```
.
├ dist ← ビルド成果物（デプロイ対象）
├ node_modules      ← 依存パッケージ
├ openapi           ← openapi-generator の設定
├ src
│ ├ assets
│ │ └ i18n          ← messageの一元管理
│ ├ components
│ │ ├ pages         ← viewId ごとの画面
│ │ ├ styles        ← 共通で利用するコンポーネントのスタイル調整
│ │ └ ui            ← 共通で利用するmuiコンポーネントの調整
│ ├ config
│ │ ├ i18n          ← i18next の設定
│ │ └ yup           ← yupのカスタマイズ
│ ├ consts          ← ラジオボタンなどで利用する定数
│ ├ contexts        ← React Context
│ ├ dialogs         ← 共通ダイアログコンポーネント
│ ├ hooks           ← 共通フック、viewId ごとのフック
│ ├ layouts         ← 共通レイアウト
│ ├ models          ← ドメインモデル
│ ├ openapi         ← openapi-generator で生成されたソース
│ ├ app             ← 画面ルーティング単位のページコンポーネント
│ ├ providers       ← アプリケーション全体に影響する Provider
│ ├ stores          ← 共通ストア、viewid ごとのストア
│ ├ types           ← 共通で利用する type
│ └ utils           ← 共通で利用する便利関数
```

### api側
```
.
├ dist              ← ビルド成果物（デプロイ対象）
├ node_modules      ← 依存パッケージ
├ openapi           ← openapi-generator の設定
├ src
│ ├ apis            ← APIエンドポイントに関連するロジックを格納
│ ├ commons　　　　　← 共通ユーティリティやヘルパー関数
│ ├ domains         ← データモデルの定義
│ ├ i18n            ← メッセージの一元管理
│ ├ middlewares     ← ミドルウェア関数（必要であれば）
│ ├ models          ← リクエストとレスポンスのデータモデル定義
│ └ utils           ← 共通で利用する便利関数
```
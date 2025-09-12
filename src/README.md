## 実行・開発環境

■ Node.js
→バージョンはフロントとバックの両方を実行し開発するために使用。
今回使用するバージョン：XXXX

※将来的にサーバレスでlamdaなどを使用する場合、lamdaで動く用のバージョンにする必要がある。


■ Visual Studio Code
- 拡張機能
・ESLint（https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint）

・Prettier - Code formatter（https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode）


## 実行方法

### 開発に必要なフレームワーク、ライブラリをインストール（初回またはpackageにフレームワーク、ライブラリを追加時）

  npm ci

※ネットワークエラーが出る前に「PowerShell -ExecutionPolicy RemoteSigned npm XXX」

### docs/openapi側のyml追加、変更があった時openapi generater を実行する（client側とapi側と共に）

  npm run codegen

### openaiに関して

　src/openapiは openapi-generatorを利用しdocs/openapi/index.ymlから自動生成したソースとなっている。そのため手動での修正は禁止でdocs/openapi側のymlを修正しopenapi generator を実行してください。

### 本番用の静的ファイルをビルドする（client側とapi側と共に）

  npm run build

### デバッグで実行する（api側）

  npm run start

### デバッグで実行する（client側）

  npm run dev

ブラウザでターミナルに出力されたログのLocalのURLを開く
例：http://localhost:{PORT}
※ {PORT} は出力されたログのURLの物に置き換える


## コーディング規約

ESLint, Prettierに設定されているコーディングルールを守ること。
warningは仕様で仕方ない場合はコメントを記載し、ルールから除外してもいい。
errorは出ないように解決してください。

### 手動コーディングチェック

  npm run lint



## ディレクトリ構成
```
.
├ dist ← ビルド成果物（デプロイ対象）
├ node_modules ← 依存パッケージ
├ openapi ← openapi-generator の設定
├ src
│ ├ assets
│ │ └ i18n
│ │   └ locales ← ロケールごとのメッセージ
│ ├ components
│ │ ├ pages ← viewId ごとの画面
│ │ ├ styles ← 共通で利用するコンポーネントのスタイル調整
│ │ └ ui ← 共通で利用するmuiコンポーネントの調整
│ ├ config
│ │ ├ i18n ← i18next の設定
│ │ └ yup ← yupのカスタマイズ
│ ├ consts ← ラジオボタンなどで利用する定数
│ ├ contexts ← React Context
│ ├ dialogs ← 共通ダイアログコンポーネント
│ ├ hooks ← 共通フック、viewId ごとのフック
│ ├ layouts ← 共通レイアウト
│ ├ models ← ドメインモデル
│ ├ openapi ← openapi-generator で生成されたソース
│ ├ pages ← 画面ルーティング単位のページコンポーネント
│ ├ providers ← アプリケーション全体に影響する Provider
│ ├ stores ← 共通ストア、viewid ごとのストア
│ ├ types ← 共通で利用する type
│ └ utils ← 共通で利用する便利関数
```

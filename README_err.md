■ npmグローバルモジュール入れ方

1. npm グローバルモジュール確認
npm list -g --depth=0
→@redocly/cli や @openapitools/openapi-generator-cliがなければインストールする必要あり

2. Redocly CLI インストール
npm install -g @redocly/cli

3. OpenAPI Generator CLI インストール
npm install -g @openapitools/openapi-generator-cli

4. パスの追加
$env:Path += ";C:\Users\nagisa\AppData\Roaming\npm"

5. bundling（openapi.yml生成）
redocly bundle .\docs\openapi\index.yml -o openapi\openapi.yml --remove-unused-components

6.TypeScript Node クライアント生成
openapi-generator-cli generate `
  -i openapi\openapi.yml `
  -g typescript-node `
  -o ..\generated `
  --inline-schema-name-mappings _test_get_200_response_inner=User


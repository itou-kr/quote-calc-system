# パフォーマンス最適化ガイド

このドキュメントでは、アプリケーションのパフォーマンスを向上させるために実装された機能について説明します。

## 実装された最適化

### 1. ルーティングのメモ化

**実装内容:**
- `MainContent` コンポーネントを `React.memo()` でメモ化
- Lazy コンポーネントのキャッシング機能を追加
- `RouterProvider` でのルーター作成を最適化

**効果:**
- ルート変更時の不要な再レンダリングを防止
- コンポーネントの再読み込みを削減
- メモリ使用量の最適化

**使い方:**
特別な設定は不要です。既存のルーティングがそのまま高速化されます。

### 2. 不要なProgress表示の削減

**実装内容:**
- `useAsyncEffect` と `useAsyncEffectOnce` に300msの遅延を追加
- 高速な処理では Progress インジケーターを表示しない

**効果:**
- 体感速度の向上（フリッカー防止）
- UXの改善

**使い方:**
```typescript
import { useAsyncEffect, useAsyncEffectOnce } from '@front/utils/asyncEffect';

// 300ms以内に完了する処理ではProgressが表示されません
useAsyncEffectOnce(async () => {
    const data = await fetchData();
    setData(data);
});
```

### 3. React Query の導入

**実装内容:**
- `@tanstack/react-query` をインストール
- `QueryProvider` を作成して App.tsx に統合
- カスタムフック `useApiQuery` と `useApiMutation` を提供

**デフォルト設定:**
- Stale Time: 5分
- Cache Time: 10分
- Retry: 1回
- Window Focus での自動再フェッチ: 無効

**効果:**
- APIレスポンスのキャッシング
- 重複リクエストの防止
- バックグラウンドでのデータ更新
- オフライン対応の基盤

**使い方:**

#### データの取得（Query）
```typescript
import { useApiQuery } from '@front/hooks/query';

function UserProfile({ userId }: { userId: string }) {
    const { data, isLoading, error } = useApiQuery(
        ['user', userId], // キャッシュキー
        () => fetchUser(userId), // データ取得関数
        {
            staleTime: 5 * 60 * 1000, // オプション: 5分間キャッシュ
        }
    );

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    
    return <div>{data.name}</div>;
}
```

#### データの更新（Mutation）
```typescript
import { useApiMutation } from '@front/hooks/query';
import { useQueryClient } from '@tanstack/react-query';

function UpdateUserButton({ userId }: { userId: string }) {
    const queryClient = useQueryClient();
    
    const { mutate, isPending } = useApiMutation(
        (data: UserData) => updateUser(userId, data),
        {
            onSuccess: () => {
                // 成功時にキャッシュを無効化して再取得
                queryClient.invalidateQueries({ queryKey: ['user', userId] });
            },
        }
    );

    return (
        <button 
            onClick={() => mutate({ name: 'New Name' })}
            disabled={isPending}
        >
            {isPending ? '更新中...' : 'ユーザー更新'}
        </button>
    );
}
```

### 4. Code Splitting の改善

**実装内容:**
- Vite の `manualChunks` 設定を最適化
- ベンダーライブラリを以下のように分割:
  - `vendor-react`: React コア
  - `vendor-mui-core`: MUI コア
  - `vendor-mui-icons`: MUI アイコン
  - `vendor-mui-datagrid`: MUI DataGrid
  - `vendor-mui-datepicker`: MUI DatePicker
  - `vendor-emotion`: Emotion スタイリング
  - `vendor-redux`: Redux
  - `vendor-react-query`: React Query
  - `vendor-i18n`: i18next
  - `vendor-forms`: フォームライブラリ
  - `vendor-other`: その他のベンダー

**効果:**
- 初期ロード時間の短縮
- ブラウザキャッシュの効率化
- 並列ダウンロードによる高速化
- 変更されていないチャンクの再利用

**確認方法:**
```bash
npm run build
```

ビルド結果に各チャンクのサイズが表示されます。

## パフォーマンス計測

### ビルドサイズの確認
```bash
cd src/client
npm run build
```

### 開発サーバーでの確認
```bash
cd src/client
npm run dev
```

ブラウザの開発者ツール（Network タブ）で以下を確認:
- 各チャンクのダウンロード時間
- キャッシュの動作状況
- 並列ダウンロードの状況

## ベストプラクティス

### React Query の使用
1. **キャッシュキーは配列で指定**: `['resource', id]` のように階層的に
2. **依存関係を明示**: ユーザーIDなどの変数をキャッシュキーに含める
3. **適切な staleTime を設定**: 頻繁に変わらないデータは長めに設定
4. **楽観的更新**: ユーザー体験向上のため、必要に応じて実装

### コンポーネントの最適化
1. **不要な再レンダリングを避ける**: `React.memo()` や `useMemo()` を活用
2. **高速な処理に Progress は不要**: 自動的に 300ms 以下は非表示
3. **コンポーネント分割**: 大きなコンポーネントは小さく分割

### バンドルサイズの管理
1. **tree shaking を意識**: 名前付きインポートを使用
2. **必要なものだけインポート**: `import { Button } from '@mui/material'`
3. **重いライブラリは遅延ロード**: 必要な時だけ読み込む

## トラブルシューティング

### React Query のキャッシュをクリアしたい
```typescript
import { useQueryClient } from '@tanstack/react-query';

const queryClient = useQueryClient();
queryClient.clear(); // 全てのキャッシュをクリア
```

### Progress が表示されない
300ms 以下で完了する処理では意図的に表示されません。
常に表示したい場合は `useProgressContext` を直接使用してください。

### ビルドサイズが大きい
1. `npm run build` の出力を確認
2. 不要な依存関係を削除
3. 動的インポートを検討

## 関連ドキュメント

- [React Query Documentation](https://tanstack.com/query/latest)
- [Vite Code Splitting](https://vitejs.dev/guide/build.html#chunking-strategy)
- [React Performance Optimization](https://react.dev/learn/render-and-commit)

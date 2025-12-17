import { Box, SxProps } from '@mui/material';

export type TabPanelProps = {
    value: number;
    index: number;
    children: React.ReactNode;
    sx?: SxProps;
};

/**
 * タブパネルコンポーネント
 * アクティブなタブの内容のみを表示する
 * @param props - value: 現在のタブ値, index: このパネルのインデックス, children: パネル内容, sx: 追加スタイル
 * @returns TabPanelコンポーネント
 */
function TabPanel(props: TabPanelProps) {
    const { value, index, children, sx } = props;

    // 非アクティブなタブはレンダリングしない（パフォーマンス最適化）
    if (value !== index) {
        return null;
    }

    return (
        <Box
            role="tabpanel"
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            sx={{ flex: 1, height: '100%', display: 'flex', flexDirection: 'column', ...sx }}
        >
            {children}
        </Box>
    );
}

export default TabPanel;

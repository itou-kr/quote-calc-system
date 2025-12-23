import { Box, Stack, Tabs, Tab, SxProps, Theme } from '@mui/material';
import Button from '@front/components/ui/Button';

export type TabDefinition = {
    label: string;
};

export type ActionButton = {
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
    disabled?: boolean;
    variant?: 'outlined' | 'contained' | 'text';
    sx?: SxProps<Theme>;
};

export type Props = {
    tabs: TabDefinition[];
    activeTab: number;
    onTabChange: (newValue: number) => void;
    actions?: ActionButton[];
};

/**
 * テーブル上部のタブ+操作ボタンツールバー
 * @param props - tabs: タブ定義配列, activeTab: アクティブタブ, onTabChange: タブ変更ハンドラー, actions: アクションボタン配列
 * @returns テーブルツールバーコンポーネント
 */
function TableToolbar(props: Props) {
    const { tabs, activeTab, onTabChange, actions = [] } = props;

    return (
        <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            borderBottom: 1, 
            borderColor: 'divider', 
            mb: 2,
            flexWrap: 'nowrap', // 改行を防止
            minWidth: 900 // 最小幅を確保
        }}>
            <Tabs 
                value={activeTab} 
                onChange={(_, newValue) => onTabChange(newValue)} 
                sx={{ 
                    flexShrink: 0, // タブエリアの縮小を防止
                    '& .MuiTab-root': { 
                        minWidth: 160, // タブの最小幅を少し縮小
                        whiteSpace: 'nowrap' // テキストの改行を防止
                    } 
                }}
            >
                {tabs.map((tab, index) => (
                    <Tab key={index} label={tab.label} />
                ))}
            </Tabs>
            {actions.length > 0 && (
                <Stack 
                    direction="row" 
                    spacing={1} 
                    alignItems="center" 
                    sx={{ 
                        mr: 2, 
                        flexShrink: 0, // ボタンエリアの縮小を防止
                        whiteSpace: 'nowrap' // 改行を防止
                    }}
                >
                    {actions.map((action, index) => (
                        <Button
                            key={index}
                            variant={action.variant || 'outlined'}
                            startIcon={action.icon}
                            onClick={action.onClick}
                            size="small"
                            disabled={action.disabled}
                            sx={action.sx}
                        >
                            {action.label}
                        </Button>
                    ))}
                </Stack>
            )}
        </Box>
    );
}

export default TableToolbar;

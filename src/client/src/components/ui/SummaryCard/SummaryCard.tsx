import { Box, Stack, Typography } from '@mui/material';

export type Props = {
    label: string;
    value: number | string;
    icon?: React.ReactNode;
};

/**
 * 計算結果サマリーの表示カード
 * @param props - label: ラベル, value: 表示値, icon: アイコン
 * @returns サマリーカードコンポーネント
 */
function SummaryCard(props: Props) {
    const { label, value, icon } = props;

    return (
        <Box sx={{ mb: 1, p: 1.5, bgcolor: '#f5f5f5', borderRadius: 1, border: 1, borderColor: '#e0e0e0' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {icon && <Box sx={{ fontSize: 18, mr: 0.8, color: 'primary.main', display: 'flex', alignItems: 'center' }}>{icon}</Box>}
                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>{label}</Typography>
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>{value}</Typography>
            </Stack>
        </Box>
    );
}

export default SummaryCard;

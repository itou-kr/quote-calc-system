import { Box, Stack, Typography } from '@mui/material';

export type ColorVariant = 'blue' | 'green' | 'orange' | 'periwinkle';

export type Props = {
    label: string;
    value: number | string;
    colorVariant?: ColorVariant;
    borderOnly?: boolean;
    grayBackground?: boolean;
};

const colorSchemes = {
    blue: {
        gradient: 'linear-gradient(135deg, #f0f9ff 0%, #e3f2fd 100%)',
        border: '#42a5f5',
        icon: '#1976d2',
        label: '#1565c0',
        value: '#0d47a1',
        shadow: 'rgba(25, 118, 210, 0.15)',
        shadowHover: 'rgba(25, 118, 210, 0.25)',
    },
    periwinkle: {
        gradient: 'linear-gradient(135deg, #f4f7ff 0%, #e9f0ff 100%)',
        border: '#6f8fe6',
        icon: '#4a5fc4',
        label: '#3e57bf',
        value: '#3046a4',
        shadow: 'rgba(63, 81, 181, 0.12)',
        shadowHover: 'rgba(63, 81, 181, 0.20)',
    },
    green: {
        gradient: 'linear-gradient(135deg, #f5faf5 0%, #e8f5e9 100%)',
        border: '#24d82dff',
        icon: '#388e3c',
        label: '#339e38ff',
        value: '#2e7d32',
        shadow: 'rgba(56, 142, 60, 0.15)',
        shadowHover: 'rgba(56, 142, 60, 0.25)',
    },
    orange: {
        gradient: 'linear-gradient(135deg, #fffbf0 0%, #fff3e0 100%)',
        border: '#ffab2eff',
        icon: '#f57c00',
        label: '#ef6c00',
        value: '#ef6c00',
        shadow: 'rgba(245, 124, 0, 0.15)',
        shadowHover: 'rgba(245, 124, 0, 0.25)',
    },
};

/**
 * 計算結果サマリーの表示カード（カラーバリエーション版）
 * @param props - label: ラベル, value: 表示値, colorVariant: カラーバリエーション, borderOnly: 枠線のみ色付き, grayBackground: グレー背景
 * @returns サマリーカードコンポーネント
 */
function SummaryCard2(props: Props) {
    const { label, value, colorVariant = 'blue', borderOnly = false, grayBackground = false } = props;
    const colors = colorSchemes[colorVariant];

    const getBackgroundStyle = () => {
        if (grayBackground) return '#f5f5f5';
        if (borderOnly) return 'white';
        return colors.gradient;
    };

    return (
        <Box sx={{ 
            mb: 1.5, 
            p: 1.5, 
            background: getBackgroundStyle(),
            borderRadius: 2, 
            border: 2, 
            borderColor: colors.border,
            boxShadow: (borderOnly || grayBackground) ? 'none' : `0 4px 12px ${colors.shadow}`,
            transition: 'all 0.3s ease',
            '&:hover': {
                transform: (borderOnly || grayBackground) ? 'none' : 'translateY(-2px)',
                boxShadow: (borderOnly || grayBackground) ? 'none' : `0 6px 16px ${colors.shadowHover}`,
            }
        }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ 
                        fontSize: 20, 
                        mr: 1, 
                        color: colors.icon, 
                        display: 'flex', 
                        alignItems: 'center',
                        bgcolor: borderOnly ? `${colors.icon}15` : 'transparent',
                        borderRadius: borderOnly ? 1 : 0,
                        p: borderOnly ? 0.5 : 0
                    }}>
                    </Box>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', color: colors.label }}>{label}</Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: colors.label, fontSize: '1.75rem' }}>{value}</Typography>
            </Stack>
        </Box>
    );
}

export default SummaryCard2;

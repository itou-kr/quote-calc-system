import { Box, Typography } from '@mui/material';

export type Props = {
    label: string;
    icon?: React.ReactNode;
    required?: boolean;
    children: React.ReactNode;
    mb?: number;
};

/**
 * ラベル付きフォーム入力セクション
 * @param props - label: ラベル, icon: アイコン, required: 必須マーク表示, children: 入力要素, mb: マージンボトム
 * @returns フォームセクションコンポーネント
 */
function FormSection(props: Props) {
    const { label, icon, required, children, mb = 2.5 } = props;

    return (
        <Box sx={{ mb }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.8 }}>
                {icon && <Box sx={{ fontSize: 16, mr: 0.5, display: 'flex', alignItems: 'center' }}>{icon}</Box>}
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {label}
                    {required && <Typography component="span" color="error"> *</Typography>}
                </Typography>
            </Box>
            {children}
        </Box>
    );
}

export default FormSection;

import { Box, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

export type Props = {
    label: string;
    icon?: React.ReactNode; // デフォルトはEditIcon
    required?: boolean;
    children: React.ReactNode;
    mb?: number;
    rightElement?: React.ReactNode; // ラベル行の右側に配置する要素
};

/**
 * ラベル付きフォーム入力セクション
 * @param props - label: ラベル, icon: アイコン(デフォルト: EditIcon), required: 必須マーク表示, children: 入力要素, mb: マージンボトム, rightElement: ラベル右側の要素
 * @returns フォームセクションコンポーネント
 */
function FormSection(props: Props) {
    const { label, icon = <EditIcon />, required, children, mb = 2.5, rightElement } = props;

    return (
        <Box sx={{ mb }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.8 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {icon && <Box sx={{ fontSize: 16, mr: 0.5, display: 'flex', alignItems: 'center' }}>{icon}</Box>}
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {label}
                        {required && <Typography component="span" color="error"> *</Typography>}
                    </Typography>
                </Box>
                {rightElement && <Box>{rightElement}</Box>}
            </Box>
            {children}
        </Box>
    );
}

export default FormSection;

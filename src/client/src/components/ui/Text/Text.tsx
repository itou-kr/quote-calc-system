import { Typography, TypographyProps } from '@mui/material';

export type TextProps = {
    /** テキストのバリアント */
    variant?: 'pageTitle' | 'sectionTitle' | 'subsectionTitle' | 'label' | 'caption' | TypographyProps['variant'];
} & Omit<TypographyProps, 'variant'>

/**
 * よく使うTypographyのスタイルパターンを事前定義したコンポーネント
 * 
 * - pageTitle: ページタイトル (h5 + bold)
 * - sectionTitle: セクションタイトル (h6 + bold)
 * - subsectionTitle: サブセクションタイトル (subtitle2 + bold + mb:1.5)
 * - label: ラベルテキスト (body2 + secondary color)
 * - caption: キャプションテキスト (caption + secondary color)
 */
function Text({ variant = 'body1', sx, children, ...props }: TextProps) {
    // カスタムバリアントの場合はスタイルを定義
    const getCustomStyles = () => {
        switch (variant) {
            case 'pageTitle':
                return {
                    variant: 'h5' as const,
                    sx: { fontWeight: 'bold', ...sx }
                };
            case 'sectionTitle':
                return {
                    variant: 'h6' as const,
                    sx: { fontWeight: 'bold', ...sx }
                };
            case 'subsectionTitle':
                return {
                    variant: 'subtitle2' as const,
                    sx: { fontWeight: 'bold', mb: 1.5, ...sx }
                };
            case 'label':
                return {
                    variant: 'body2' as const,
                    sx: { color: 'text.secondary', ...sx }
                };
            case 'caption':
                return {
                    variant: 'caption' as const,
                    sx: { color: 'text.secondary', ...sx }
                };
            default:
                return {
                    variant: variant as TypographyProps['variant'],
                    sx
                };
        }
    };

    const customStyles = getCustomStyles();

    return (
        <Typography {...props} variant={customStyles.variant} sx={customStyles.sx}>
            {children}
        </Typography>
    );
}

export default Text;

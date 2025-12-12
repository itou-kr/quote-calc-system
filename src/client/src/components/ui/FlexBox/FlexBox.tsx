import { Box, SxProps } from '@mui/material';

export type FlexBoxProps = {
    direction?: 'row' | 'column';
    align?: 'center' | 'flex-start' | 'flex-end' | 'stretch' | 'baseline';
    justify?: 'center' | 'flex-start' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
    gap?: number;
    wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
    children: React.ReactNode;
    sx?: SxProps;
};

/**
 * Flexboxレイアウト用の汎用コンポーネント
 * @param props - direction: 配置方向(デフォルト: row), align: 交差軸の配置(デフォルト: center), justify: 主軸の配置(デフォルト: flex-start), gap: 要素間の間隔, wrap: 折り返し, children: 子要素, sx: 追加スタイル
 * @returns FlexBoxコンポーネント
 */
function FlexBox(props: FlexBoxProps) {
    const { 
        direction = 'row', 
        align = 'center', 
        justify = 'flex-start', 
        gap, 
        wrap = 'nowrap',
        children, 
        sx 
    } = props;

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: direction,
                alignItems: align,
                justifyContent: justify,
                ...(gap !== undefined && { gap }),
                flexWrap: wrap,
                ...sx,
            }}
        >
            {children}
        </Box>
    );
}

export default FlexBox;

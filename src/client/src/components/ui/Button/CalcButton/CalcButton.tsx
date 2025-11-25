// import { useTranslation } from 'react-i18next';
import CalculateIcon from '@mui/icons-material/Calculate';

import ProgressButton, { Props as BaseButtonProps } from '@front/components/ui/Button/ProgressButton';

type Props = Omit<BaseButtonProps, 'startIcon' | 'endIcon' | 'children'> & {
  fullWidth?: boolean;
};

/**
 * 自動計算ボタン
 * @param props
 * @returns
 */
function CalcButton(props: Props) {
    // const { t } = useTranslation();

    return (
        <ProgressButton {...props} sx={{ width: '100%' }} startIcon={<CalculateIcon />}>
            {/* ★要修正 */}
            {'自動計算ボタン'}
        </ProgressButton>
    )
}

export default CalcButton;
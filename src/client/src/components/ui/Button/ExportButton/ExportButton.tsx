// import { useTranslation } from 'react-i18next';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

import ProgressButton, { Props as BaseButtonProps } from '@front/components/ui/Button/ProgressButton';

type Props = Omit<BaseButtonProps, 'startIcon' | 'endIcon' | 'children'>;

/**
 * エクスポートボタン
 * @param props
 * @returns
 */
function ExportButton(props: Props) {
    // const { t } = useTranslation();

    return (
        <ProgressButton {...props} startIcon={<FileDownloadIcon />}>
            {/* ★要：修正 */}
            {'エクスポートボタン'}
        </ProgressButton>
    )
}

export default ExportButton;
import FileuploadIcon from '@mui/icons-material/FileUpload';

import ProgressButton, { Props as BaseButtonProps } from '@front/components/ui/Button/ProgressButton';

type Props = Omit<BaseButtonProps, 'startIcon' | 'endIcon'>;

/**
 * インポートボタン
 * @param props
 * @returns
 */
function ImportButton(props: Props) {
    return <ProgressButton {...props} startIcon={<FileuploadIcon />} />;
}

export default ImportButton;
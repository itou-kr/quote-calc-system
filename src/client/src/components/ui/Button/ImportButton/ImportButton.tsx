import FileuploadIcon from '@mui/icons-material/FileUpload';
import ProgressButton, { Props as BaseButtonProps } from '@front/components/ui/Button/ProgressButton';

type Props = Omit<BaseButtonProps, 'startIcon' | 'endIcon'> & {
    onFileSelect: (file: File) => void | Promise<void>;
};

/**
 * インポートボタン
 */
function ImportButton({ onFileSelect, ...props }: Props) {

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) onFileSelect(file);
    };

    return (
        <>
            <input
                type="file"
                style={{ display: 'none' }}
                id="import-input"
                onChange={handleChange}
            />

            <label htmlFor="import-input">
                <ProgressButton {...props} startIcon={<FileuploadIcon />}>
                    {/* ★要修正 */}
                    {'インポートボタン'}
                </ProgressButton>
            </label>
        </>
    );
}

export default ImportButton;

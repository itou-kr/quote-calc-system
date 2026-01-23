import FileuploadIcon from '@mui/icons-material/FileUpload';
import ProgressButton, { Props as BaseButtonProps } from '@front/components/ui/Button/ProgressButton';
import React from 'react';

type Props = Omit<BaseButtonProps, 'startIcon' | 'endIcon'> & {
  onFileSelect: (file: File) => void | Promise<void>;
};

function ImportButton({ onFileSelect, ...props }: Props) {
    const inputRef = React.useRef<HTMLInputElement>(null);

    return (
        <>
            <ProgressButton
                type="button"
                {...props}
                startIcon={<FileuploadIcon />}
                onClick={() => inputRef.current?.click()}
            >
                インポート
            </ProgressButton>

            <input
                ref={inputRef}
                type="file"
                hidden
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) onFileSelect(file);
                }}
            />
        </>
    );
}


export default ImportButton;

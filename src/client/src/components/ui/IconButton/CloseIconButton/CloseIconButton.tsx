import CloseIcon from '@mui/icons-material/Close';

import IconButton, { Props as BaseButtonProps } from '@front/components/ui/IconButton';

type Props = Omit<BaseButtonProps, 'children'>;

function CloseIconButton(props: Props) {
    const { disabled, className, sx, onClick } = props;

    const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
        await onClick(e);
    };

    return (
        <IconButton disabled={disabled} className={className} sx={sx} onClick={handleClick}>
            <CloseIcon />
        </IconButton>
    );
}

export default CloseIconButton;
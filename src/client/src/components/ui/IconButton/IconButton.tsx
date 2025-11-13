import MuiIconButton, { IconButtonProps as  MuiIconButtonProps } from '@mui/material/IconButton';

export type Props = {
    disabled?: boolean;
    sx?: MuiIconButtonProps['sx'];
    className?: MuiIconButtonProps['className'];
    children: React.ReactNode;
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>;
};

function IconButton(props: Props) {
    const { disabled, className, children, sx, onClick } = props;

    const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
        await onClick(e);
    };

    return (
        <MuiIconButton disabled={disabled} className={className} sx={sx} onClick={handleClick}>
            {children}
        </MuiIconButton>
    )
}

export default IconButton;
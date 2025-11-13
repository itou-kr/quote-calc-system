import MuiButton, { ButtonProps } from '@mui/material/Button';

export type Props = {
    variant?: ButtonProps['variant'];
    size?: ButtonProps['size'];
    color?: ButtonProps['color'];
    disabled?: boolean;
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
    sx?: ButtonProps['sx'];
    className?: ButtonProps['className'];
    children: React.ReactNode;
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>;
};

function Button(props: Props) {
    const { variant, size, color, disabled, startIcon, endIcon, className, children, sx, onClick } = props;

    const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
        await onClick(e);
    };

    return (
        <MuiButton variant={variant} size={size} color={color} disabled={disabled} startIcon={startIcon} endIcon={endIcon} className={className} sx={sx} onClick={handleClick}>
            {children}
        </MuiButton>
    );
}

export default Button;
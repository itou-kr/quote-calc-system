import Grid from '@mui/material/Grid2';
import MuiDialog, { DialogProps } from '@mui/material/Dialog';

import StyledDialogTitle from '@front/components/styles/StyledDialogTitle';
import CloseIconButton from '@front/components/ui/IconButton/CloseIconButton';

export type Props = {
    open?: boolean;
    title?: React.ReactNode;
    escapeKeyDown?: boolean;
    maxWidth?: DialogProps['maxWidth'];
    sx?: DialogProps['sx'];
    onClose?: () => void;
    children: React.ReactNode;
};

function Dialog(props: Props) {
    // const { open = false, title, escapeKeyDown, onClose, children, maxWidth = 'md', sx } = props;
    const { open = false, title, escapeKeyDown, onClose, maxWidth = 'md', sx } = props;

    return (
        <MuiDialog disableEscapeKeyDown={!escapeKeyDown} open={open} fullWidth maxWidth={maxWidth} sx={sx}>
            <StyledDialogTitle component="div">
                <Grid container direction="row" alignItems="center">
                <Grid size="grow">{title}</Grid>
                {onClose && (
                    <Grid size="auto">
                        <CloseIconButton onClick={onClose} />
                    </Grid>
                )}    
                </Grid>
            </StyledDialogTitle>
        </MuiDialog>
    )
}

export default Dialog;
import MuiDialogActions from '@mui/material/DialogActions';

type Props = {
    children: React.ReactNode;
}

function Actions({ children }: Props) {
    return <MuiDialogActions>{children}</MuiDialogActions>
}

export default Actions;
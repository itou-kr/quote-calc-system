import MuiDialogTitle from '@mui/material/DialogTitle';
import { styled } from '@mui/material/styles';

const StyledDialogTitle = styled(MuiDialogTitle)(({ theme }) => ({
    padding: theme.spacing(1),
})) as typeof MuiDialogTitle;

export default StyledDialogTitle;
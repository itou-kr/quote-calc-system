import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import { grey } from '@mui/material/colors';

const StyledFormPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    background: grey[200],
})) as typeof Paper;

export default StyledFormPaper;
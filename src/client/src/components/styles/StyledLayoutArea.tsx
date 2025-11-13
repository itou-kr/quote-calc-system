import { styled } from '@mui/material/styles';
import Container from '@mui/material/Container';

const StyledLayputArea = styled(Container)({
    height: '100vh',
    // width: 'max-content',
    minWidth: '100%',
}) as typeof Container;

export default StyledLayputArea;
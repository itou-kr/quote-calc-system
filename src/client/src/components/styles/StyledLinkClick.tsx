import { styled } from '@mui/material/styles';

const StyledLinkClick = styled('div')<{ disabled?: boolean }>(({ disabled }) =>
    disabled
        ? {}
        : {
            cursor: 'pointer',
            textDecoration: 'underline',
            [`&:hover`]: {
                textDecoration: 'none',
                background: '#0000000a'
            },
        }
);

export default StyledLinkClick;
import MuiContainer from '@mui/material/Container';

type Props = {
    children: React.ReactNode;
}

function Container({ children }: Props) {
    return (
        <MuiContainer component="form" disableGutters title="">
            {children}
        </MuiContainer>
    );
}

export default Container;
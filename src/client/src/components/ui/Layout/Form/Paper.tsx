import StyledFormPaper from '@front/components/styles/StyledFormPaper';

type Props = {
    children: React.ReactNode;
};

function Paper({ children }: Props) {
    return (
        <StyledFormPaper component="form" title="">
            {children}
        </StyledFormPaper>
    );
}

export default Paper;
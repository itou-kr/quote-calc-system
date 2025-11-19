import { PaperProps } from '@mui/material/Paper'

import StyledFormPaper from '@front/components/styles/StyledFormPaper';

type Props = {
    sx?: PaperProps['sx'];
    className?: PaperProps['className'];
    children: React.ReactNode;
};

function LayoutForm(props: Props) {
    const { sx, className, children } = props;

    return (
        <StyledFormPaper sx={{ ...sx }} className={className}>
            {children}
        </StyledFormPaper>
    );
}

export default LayoutForm;
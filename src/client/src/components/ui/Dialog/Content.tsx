import MuiDialogContent from '@mui/material/DialogContent';

type Props = {
    noDividers?: boolean;
    children: React.ReactNode;
};

function Content(props: Props) {
    const { noDividers, children } = props;
    return <MuiDialogContent dividers={!noDividers}>{children}</MuiDialogContent>;
}

export default Content;
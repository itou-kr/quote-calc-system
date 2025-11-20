import TableRow from '@mui/material/TableRow';

import StyledTableCell from '@front/components/styles/StyledTableCell';

type Props = {
    children: React.ReactNode | React.ReactNode[];
    colSpan: number;
};

function RecordTitle(props: Props) {
    const { children, colSpan } = props;

    return (
        <TableRow>
            <StyledTableCell colSpan={colSpan}>{children}</StyledTableCell>
        </TableRow>
    );
}

export default RecordTitle;
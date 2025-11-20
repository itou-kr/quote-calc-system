import { TableContainer, Table, TableBody } from '@mui/material';

type Props = {
    children: React.ReactNode;
};

function Content({ children }: Props) {
    return (
        <TableContainer>
            <Table>
                <TableBody>{children}</TableBody>
            </Table>
        </TableContainer>
    );
}

export default Content;
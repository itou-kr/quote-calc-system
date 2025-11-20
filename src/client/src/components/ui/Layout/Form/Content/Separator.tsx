import { TableRow, Divider } from '@mui/material';

import StyledLabelTableCell from '@front/components/styles/StyledLabelTableCell';

function Separator() {
    return (
        <TableRow>
            <StyledLabelTableCell colSpan={3}>
                <Divider />
            </StyledLabelTableCell>
        </TableRow>
    );
}

export default Separator;
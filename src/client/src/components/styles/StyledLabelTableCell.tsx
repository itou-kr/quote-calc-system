import { TableCellProps } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles'

import StyledTableCell from './StyledTableCell';

export type VerticalAlign = 'baseline' | 'sub' | 'super' | 'text-top' | 'text-bottom' | 'middle' | 'top' | 'bottom';

const StyledLabelTableCell = styled(StyledTableCell)<{ verticalalign?: VerticalAlign }>(({ verticalalign: verticalAlign }) => ({
    width: 'auto',
    whiteSpace: 'nowrap',
    verticalAlign,
})) as (props: TableCellProps & { verticalalign?: VerticalAlign }) => JSX.Element;

export default StyledLabelTableCell;
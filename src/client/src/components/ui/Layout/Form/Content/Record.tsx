import TableRow from '@mui/material/TableRow';

import StyledTableCell from '@front/components/styles/StyledTableCell';
import  LabelCell, { Props as LabelCelProps }  from './LabelCell';
import EditableCell from './EditableCell';

type Props = {
    label?: React.ReactNode;
    labelVerticalAlign?: LabelCelProps['verticalAlign'];
    multipleRow?: number;
    indentFlag?: boolean;
    children: React.ReactNode | React.ReactNode[];
};

function Record(props: Props) {
    const { label, labelVerticalAlign, multipleRow, indentFlag, children } = props;
    const multipleEditable = multipleRow && multipleRow > 0;
    const rowSpan = multipleEditable && multipleRow > 0 ? multipleRow : undefined;
    
    return (
        <TableRow>
            <LabelCell verticalAlign={labelVerticalAlign} rowSpan={rowSpan} indentFlag={indentFlag}>
                {label}
            </LabelCell>
            {/* ダミー列 */}
            <StyledTableCell padding='none' />
            <EditableCell>{children}</EditableCell>
        </TableRow>
    );
}

export default Record;
// import TableRow from '@mui/material/TableRow';
import {  Typography } from '@mui/material';
// import StyledTableCell from '@front/components/styles/StyledTableCell';
// import  LabelCell, { Props as LabelCelProps }  from './LabelCell';
import  { Props as LabelCelProps }  from './LabelCell';
// import EditableCell from './EditableCell';
import EditIcon from '@mui/icons-material/Edit';

type Props = {
    label?: React.ReactNode;
    labelVerticalAlign?: LabelCelProps['verticalAlign'];
    multipleRow?: number;
    indentFlag?: boolean;
    children: React.ReactNode | React.ReactNode[];
    required?: boolean;
};

function Record(props: Props) {
    // const { label, labelVerticalAlign, multipleRow, indentFlag, children } = props;
    // const multipleEditable = multipleRow && multipleRow > 0;
    // const rowSpan = multipleEditable && multipleRow > 0 ? multipleRow : undefined;
    const { label, children, required } = props;
    
    return (
        <div style={{ display: "flex", flexDirection: "column", marginBottom: "16px" }}>
            <div style={{ marginBottom: 4, fontWeight: "bold" }}>
                <EditIcon sx={{ fontSize: 16, marginRight: 1}} />{label}
                {required && (
                    <Typography component="span" color="error"> *</Typography>
                )}
            </div>
            <div>{children}</div>
        </div>
        );
}

export default Record;
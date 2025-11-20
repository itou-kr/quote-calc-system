import StyledLabelTableCell, { VerticalAlign } from '@front/components/styles/StyledLabelTableCell';

export type Props = {
    verticalAlign?: VerticalAlign;
    colSpan?: number;
    rowSpan?: number;
    indentFlag?: boolean;
    children: React.ReactNode;
};

function LabelCell(props: Props) {
    const { verticalAlign, colSpan, rowSpan, indentFlag, children } = props;
    return (
        <StyledLabelTableCell verticalalign={verticalAlign} colSpan={colSpan} rowSpan={rowSpan} sx={() => (indentFlag ? { paddingLeft: '2em' } : {})}>
            {children}
        </StyledLabelTableCell>
    );
}

export default LabelCell;
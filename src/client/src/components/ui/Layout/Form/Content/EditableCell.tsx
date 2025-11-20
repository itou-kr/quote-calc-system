import StyledInputTableCell from '@front/components/styles/StyledInputTableCell';

type Props = {
    children: React.ReactNode;
};

function EditableCell({ children }: Props) {
    return <StyledInputTableCell>{children}</StyledInputTableCell>;
}

export default EditableCell;
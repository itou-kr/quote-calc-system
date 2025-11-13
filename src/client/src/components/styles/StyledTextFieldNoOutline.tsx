import TextField from '@mui/material/TextField';
import { inputBaseClasses } from '@mui/material/InputBase';
import { autocompleteClasses } from '@mui/material/Autocomplete';
import { styled } from '@mui/material/styles';

const StyledTextFieldNoOutline = styled(TextField)(() => ({
    [`& .${inputBaseClasses.root}`]: { background: 'transparent' },
    [`& .${autocompleteClasses.inputRoot} .${inputBaseClasses.input} .${autocompleteClasses.input}`]: { width: '100%' },
    '& .MuiOutlinedInput-root': { '& fieldset': { border: 'none' }, '&:hover fieldset': { border: 'none' }, '&.Mui-focused fieldset': { border: 'none' } },
})) as typeof TextField;

export default StyledTextFieldNoOutline;
import TextField from '@mui/material/TextField';
import { inputBaseClasses } from '@mui/material/InputBase';
import { autocompleteClasses } from '@mui/material/Autocomplete';
import { styled } from '@mui/material/styles';
import { yellow } from '@mui/material/colors';

const StyledTextField = styled(TextField)(({ theme, disabled, required }) => ({
    [`& .${inputBaseClasses.root}`]: {background: disabled ? undefined : required ? yellow[100] : (theme.vars || theme).palette.background.default },
    [`& .${autocompleteClasses.inputRoot} .${inputBaseClasses.input} .${autocompleteClasses.input}`]: {width: '100%'},
})) as typeof TextField;

export default StyledTextField;
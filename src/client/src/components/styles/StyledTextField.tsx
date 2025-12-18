import TextField from '@mui/material/TextField';
import { inputBaseClasses } from '@mui/material/InputBase';
import { autocompleteClasses } from '@mui/material/Autocomplete';
import { styled } from '@mui/material/styles';
import { yellow } from '@mui/material/colors';

const StyledTextField = styled(TextField)(({ theme, disabled, required }) => ({
    [`& .${inputBaseClasses.root}`]: {background: disabled ? undefined : required ? yellow[100] : (theme.vars || theme).palette.background.default },
    [`& .${autocompleteClasses.inputRoot} .${inputBaseClasses.input} .${autocompleteClasses.input}`]: {width: '100%'},
    // エラー時のボーダー設定（フォーカス時・非フォーカス時で統一）
    '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
        borderColor: '#d32f2f',
        borderWidth: '2px',
    },
    '& .MuiOutlinedInput-root.Mui-error:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: '#d32f2f',
        borderWidth: '2px',
    },
    '& .MuiOutlinedInput-root.Mui-error.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: '#d32f2f',
        borderWidth: '2px',
    },
})) as typeof TextField;

export default StyledTextField;
// import { useTranslation } from 'react-i18next';
import AddIcon from '@mui/icons-material/Add';

import Button, { Props as BaseButtonProps } from '@front/components/ui/Button';

type Props = Omit<BaseButtonProps, 'startIcon' | 'endIcon' | 'children'>;

/**
 * 行追加ボタン
 * @param props
 * @return
 */
function AddRowButton(props: Props) {
    // const { t } = useTranslation();

    return (
        <Button
            {...props}
            variant="outlined" 
            startIcon={<AddIcon />} 
            size="small"
            sx={{ 
                borderColor: '#1e88e5', 
                color: '#1e88e5',
                '&:hover': { 
                    borderColor: '#1565c0',
                    bgcolor: '#e3f2fd'
                },
            }}
        >
            {('行追加')}
        </Button>  
    );
}

export default AddRowButton;
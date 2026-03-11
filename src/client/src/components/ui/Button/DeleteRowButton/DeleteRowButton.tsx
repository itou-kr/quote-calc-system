// import { useTranslation } from 'react-i18next';
import DeleteIcon from '@mui/icons-material/Delete';

import Button, { Props as BaseButtonProps } from '@front/components/ui/Button';

type Props = Omit<BaseButtonProps, 'startIcon' | 'endIcon' | 'color' | 'children'>;

/**
 * 行削除ボタン
 * @param props
 * @return
 */
function DeleteRowButton(props: Props) {
    // const { t } = useTranslation();

    return (
        <Button
            {...props}
            variant="outlined" 
            startIcon={<DeleteIcon />} 
            size="small"
            sx={{ 
                borderColor: '#e53935', 
                color: '#e53935',
                '&:hover': { 
                    borderColor: '#c62828',
                    bgcolor: '#ffebee'
                },
                '&.Mui-disabled': {
                    borderColor: 'rgba(0, 0, 0, 0.12)',
                    color: 'rgba(0, 0, 0, 0.26)'
                }
            }}>
                {('選択した行を削除')}
            </Button>   
    );
}

export default DeleteRowButton;
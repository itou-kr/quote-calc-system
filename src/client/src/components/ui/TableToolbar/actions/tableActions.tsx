import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { ActionButton } from '../TableToolbar';

/**
 * 行追加アクションを生成
 */
export const createAddRowAction = (onClick: () => void): ActionButton => ({
    label: '行を追加',
    icon: <AddIcon />,
    onClick,
    variant: 'outlined',
    sx: { 
        borderColor: '#1e88e5', 
        color: '#1e88e5',
        '&:hover': { 
            borderColor: '#1565c0',
            bgcolor: '#e3f2fd'
        }
    }
});

/**
 * 選択削除アクションを生成
 * @param onClick - 削除処理関数
 * @param selectedCount - 選択されている行数
 */
export const createDeleteSelectedAction = (
    onClick: () => void, 
    selectedCount: number
): ActionButton => ({
    label: `選択した行を削除${selectedCount > 0 ? ` (${selectedCount})` : ''}`,
    icon: <DeleteIcon />,
    onClick,
    disabled: selectedCount === 0,
    variant: 'outlined',
    sx: { 
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
    }
});

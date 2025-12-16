import { Paper, Box, Table, TableHead, TableBody, TableRow, TableCell, Checkbox, Select, MenuItem } from '@mui/material';
import { Controller, Control, FieldValues, FieldPath, UseFormTrigger, FieldArrayWithId } from 'react-hook-form';
import { TFunction } from 'i18next';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import TextField from '@front/components/ui/TextField';
import Button from '@front/components/ui/Button';

export type ColumnDefinition = {
    key: string;
    label: string;
    width?: number | string;
    minWidth?: number | string;
    align?: 'left' | 'center' | 'right';
    type?: 'text' | 'number' | 'select' | 'checkbox' | 'readonly';
    icon?: 'edit' | 'auto';
    options?: { value: string; label: string }[];
    disabled?: boolean;
};

export type Props<T extends FieldValues = FieldValues> = {
    fields: FieldArrayWithId<T>[];
    columns: ColumnDefinition[];
    baseName: FieldPath<T>;
    control: Control<T>;
    trigger: UseFormTrigger<T>;
    t: TFunction<'translation', undefined>;
    onRowAdd: () => void;
    onDeleteSelected: () => void;
    selectedCount: number;
    onSelectedCountChange: (count: number) => void;
    maxHeight?: string;
    onScroll?: (e: React.UIEvent<HTMLElement>) => void;
    scrollTop?: number;
};

/**
 * データファンクション/トランザクションファンクション共通テーブル
 * @param props - fields: 配列データ, columns: カラム定義, baseName: フィールドベース名, control: react-hook-form control, trigger: react-hook-form trigger, t: i18n関数, onRowAdd: 行追加ハンドラー, onSelectedCountChange: 選択数変更ハンドラー, maxHeight: 最大高さ, onScroll: スクロールハンドラー, scrollTop: スクロール位置
 * @returns ファンクションテーブルコンポーネント
 */
function FunctionTable<T extends FieldValues = FieldValues>(props: Props<T>) {
    const { fields, columns, baseName, control, trigger, t, onRowAdd, onDeleteSelected, selectedCount, onSelectedCountChange, maxHeight, onScroll, scrollTop } = props;

    const renderIcon = (iconType?: 'edit' | 'auto') => {
        if (iconType === 'edit') {
            return <EditIcon sx={{ fontSize: 16, mr: 0.5 }} />;
        } else if (iconType === 'auto') {
            return <AutoAwesomeIcon sx={{ fontSize: 16, mr: 0.5 }} />;
        }
        return null;
    };

    const renderCell = (_field: FieldArrayWithId<T>, index: number, column: ColumnDefinition) => {
        const fieldName = `${baseName}.${index}.${column.key}` as FieldPath<T>;

        if (column.key === 'selected') {
            return (
                <TableCell key={column.key} align="center" padding="checkbox">
                    <Controller
                        name={fieldName}
                        control={control}
                        render={({ field: controllerField }) => (
                            <Checkbox 
                                {...controllerField} 
                                checked={controllerField.value || false} 
                                onChange={(e) => {
                                    controllerField.onChange(e);
                                    setTimeout(() => {
                                        let count = 0;
                                        fields.forEach((_, idx) => {
                                            const val = control._getWatch(`${baseName}.${idx}.selected` as any);
                                            if (val) count++;
                                        });
                                        onSelectedCountChange(count);
                                    }, 0);
                                }}
                            />
                        )}
                    />
                </TableCell>
            );
        }

        if (column.type === 'select') {
            return (
                <TableCell key={column.key} sx={{ width: column.width, minWidth: column.minWidth }}>
                    <Controller
                        name={fieldName}
                        control={control}
                        render={({ field: controllerField }) => (
                            <Select {...controllerField} size="small" fullWidth displayEmpty sx={{ bgcolor: 'white' }}>
                                <MenuItem value="">選択してください</MenuItem>
                                {column.options?.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        )}
                    />
                </TableCell>
            );
        }

        if (column.type === 'number') {
            return (
                <TableCell key={column.key} sx={{ width: column.width, minWidth: column.minWidth }}>
                    <TextField
                        name={fieldName}
                        control={control}
                        trigger={trigger}
                        t={t}
                        type="number"
                        notFullWidth
                        disabled={column.disabled}
                        slotProps={{ 
                            htmlInput: { 
                                min: 0, 
                                onKeyDown: (e: React.KeyboardEvent) => { 
                                    if (e.key === '-' || e.key === 'e' || e.key === '+') e.preventDefault(); 
                                } 
                            } 
                        }}
                        sx={{ 
                            '& .MuiInputBase-root': { 
                                bgcolor: column.disabled ? '#f5f5f5' : 'white', 
                                width: 80 
                            },
                            '& input[type="number"]': {
                                paddingRight: '4px',
                            }
                        }}
                    />
                </TableCell>
            );
        }

        return (
            <TableCell key={column.key} sx={{ width: column.width, minWidth: column.minWidth }}>
                <TextField 
                    name={fieldName}
                    control={control}
                    trigger={trigger}
                    t={t}
                    sx={{ '& .MuiInputBase-root': { bgcolor: 'white' } }}
                />
            </TableCell>
        );
    };

    return (
        <Paper 
            elevation={1} 
            sx={{ maxHeight: maxHeight || 'calc(100vh - 240px)', overflow: 'auto', transition: 'max-height 300ms ease-in-out' }}
            onScroll={onScroll}
            ref={(el) => {
                if (el && scrollTop !== undefined) {
                    el.scrollTop = scrollTop;
                }
            }}
        >
            <Table stickyHeader size="small">
                <TableHead>
                    <TableRow>
                        <TableCell align="center" sx={{ bgcolor: '#e3f2fd', fontWeight: 'bold', width: 60 }}>No</TableCell>
                        {columns.map((column) => (
                            <TableCell 
                                key={column.key}
                                align={column.align || 'left'}
                                padding={column.key === 'selected' ? 'checkbox' : 'normal'}
                                sx={{ bgcolor: '#e3f2fd', fontWeight: 'bold', width: column.width, minWidth: column.minWidth }}
                            >
                                {column.key === 'selected' ? (
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <DeleteIcon sx={{ fontSize: 16, mr: 0.5, color: '#e53935' }} />
                                        削除
                                    </Box>
                                ) : (
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        {renderIcon(column.icon)}
                                        {column.label}
                                    </Box>
                                )}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {fields.map((field, index) => (
                        <TableRow key={field.id} hover>
                            <TableCell align="center">{index + 1}</TableCell>
                            {columns.map((column) => renderCell(field, index, column))}
                        </TableRow>
                    ))}
                    {/* 行追加ボタン行 */}
                    <TableRow>
                        <TableCell colSpan={columns.length + 1} align="center" sx={{ py: 2, bgcolor: '#fafafa', borderTop: 2, borderColor: '#e0e0e0' }}>
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                <Button 
                                    variant="outlined" 
                                    startIcon={<AddIcon />} 
                                    onClick={onRowAdd}
                                    size="small"
                                    sx={{ 
                                        borderColor: '#1e88e5', 
                                        color: '#1e88e5',
                                        '&:hover': { 
                                            borderColor: '#1565c0',
                                            bgcolor: '#e3f2fd'
                                        }
                                    }}
                                >
                                    行を追加
                                </Button>
                                <Button 
                                    variant="outlined" 
                                    startIcon={<DeleteIcon />} 
                                    onClick={onDeleteSelected}
                                    size="small"
                                    disabled={selectedCount === 0}
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
                                    }}
                                >
                                    選択した行を削除{selectedCount > 0 ? ` (${selectedCount})` : ''}
                                </Button>
                            </Box>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </Paper>
    );
}

export default FunctionTable;

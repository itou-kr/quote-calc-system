import { Paper, Box, Table, TableHead, TableRow, TableCell, Checkbox, Select, MenuItem } from '@mui/material';
import { Controller, Control, FieldValues, FieldPath, UseFormTrigger, FieldArrayWithId } from 'react-hook-form';
import { TFunction } from 'i18next';
import { useCallback, memo, useRef, useState, useEffect } from 'react';
import { FixedSizeList } from 'react-window';
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
    maxLength?: number;
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
    fieldErrors?: Record<number, Record<string, boolean>>;
};

/**
 * データファンクション/トランザクションファンクション共通テーブル（react-windowで仮想化）
 */
function FunctionTable<T extends FieldValues = FieldValues>(props: Props<T>) {
    const { fields, columns, baseName, control, trigger, t, onRowAdd, onDeleteSelected, selectedCount, onSelectedCountChange, fieldErrors } = props;

    const ROW_HEIGHT = 53; // 1行の高さ（px）
    
    // リストコンテナのrefと高さstate
    const listContainerRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const headerContainerRef = useRef<HTMLDivElement>(null);
    const [listHeight, setListHeight] = useState(0);

    // リストコンテナの高さを監視（debounceでカクつき軽減）
    useEffect(() => {
        let timeoutId: number;
        
        const updateHeight = () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            
            // 20ms遅延でカクつきを軽減
            timeoutId = window.setTimeout(() => {
                if (listContainerRef.current) {
                    setListHeight(listContainerRef.current.clientHeight);
                }
            }, 20);
        };

        // 初回は即座に実行
        if (listContainerRef.current) {
            setListHeight(listContainerRef.current.clientHeight);
        }

        window.addEventListener('resize', updateHeight);
        
        // ResizeObserverでコンテナサイズ変更を監視
        const observer = new ResizeObserver(updateHeight);
        if (listContainerRef.current) {
            observer.observe(listContainerRef.current);
        }

        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            window.removeEventListener('resize', updateHeight);
            observer.disconnect();
        };
    }, []);

    // 横スクロールの同期
    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;
        const headerContainer = headerContainerRef.current;
        
        if (!scrollContainer || !headerContainer) return;

        const handleScroll = (e: Event) => {
            // リストの横スクロール位置をヘッダーに同期
            const target = e.target as HTMLDivElement;
            headerContainer.scrollLeft = target.scrollLeft;
        };

        scrollContainer.addEventListener('scroll', handleScroll);
        
        return () => {
            scrollContainer.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const renderIcon = useCallback((iconType?: 'edit' | 'auto') => {
        if (iconType === 'edit') {
            return <EditIcon sx={{ fontSize: 16, mr: 0.5 }} />;
        } else if (iconType === 'auto') {
            return <AutoAwesomeIcon sx={{ fontSize: 16, mr: 0.5 }} />;
        }
        return null;
    }, []);

    const renderCell = useCallback((_field: FieldArrayWithId<T>, index: number, column: ColumnDefinition) => {
        const fieldName = `${baseName}.${index}.${column.key}` as FieldPath<T>;

        if (column.key === 'selected') {
            return (
                <TableCell key={column.key} sx={{ width: column.width, minWidth: column.minWidth, flexShrink: 0, borderLeft: 1, borderRight: 1, borderColor: 'divider', borderBottom: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px 16px' }}>
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
            const hasError = fieldErrors?.[index]?.[column.key] || false;
            return (
                <TableCell key={column.key} sx={{ width: column.width, minWidth: column.minWidth, flexShrink: 0, borderBottom: 'none', display: 'flex', alignItems: 'center', padding: '6px 16px' }}>
                    <Controller
                        name={fieldName}
                        control={control}
                        render={({ field: controllerField }) => (
                            <Select 
                                {...controllerField} 
                                size="small" 
                                fullWidth 
                                displayEmpty 
                                error={hasError}
                                sx={{ 
                                    bgcolor: 'white',
                                    ...(hasError && {
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#d32f2f !important',
                                            borderWidth: '2px !important',
                                        },
                                    }),
                                }}
                            >
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
            const hasError = fieldErrors?.[index]?.[column.key] || false;
            
            // disabled の場合は通常のテキスト表示にする
            if (column.disabled) {
                return (
                    <TableCell key={column.key} sx={{ width: column.width, minWidth: column.minWidth, flexShrink: 0, borderLeft: 1, borderRight: 1, borderColor: 'divider', borderBottom: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px 16px' }}>
                        <Controller
                            name={fieldName}
                            control={control}
                            render={({ field: controllerField }) => (
                                <Box sx={{ fontWeight: 'bold', color: '#212121' }}>
                                    {controllerField.value || 0}
                                </Box>
                            )}
                        />
                    </TableCell>
                );
            }
            
            return (
                <TableCell key={column.key} sx={{ width: column.width, minWidth: column.minWidth, flexShrink: 0, borderBottom: 'none', display: 'flex', alignItems: 'center', padding: '6px 16px' }}>
                    <TextField
                        name={fieldName}
                        control={control}
                        trigger={trigger}
                        t={t}
                        type="number"
                        notFullWidth
                        disabled={column.disabled}
                        error={hasError}
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
                                textAlign: 'center',
                            },
                            ...(hasError && {
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#d32f2f !important',
                                    borderWidth: '2px !important',
                                },
                            }),
                        }}
                    />
                </TableCell>
            );
        }

        return (
            <TableCell key={column.key} sx={{ width: column.width, minWidth: column.minWidth, flex: column.width ? '0 0 auto' : 1, borderRight: column.width ? 1 : undefined, borderColor: 'divider', borderBottom: 'none', display: 'flex', alignItems: 'center', padding: '6px 16px' }}>
                <TextField 
                    name={fieldName}
                    control={control}
                    trigger={trigger}
                    t={t}
                    error={fieldErrors?.[index]?.[column.key] || false}
                    maxLength={column.maxLength}
                    sx={{ 
                        '& .MuiInputBase-root': { bgcolor: 'white' },
                        ...(fieldErrors?.[index]?.[column.key] && {
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#d32f2f !important',
                                borderWidth: '2px !important',
                            },
                        }),
                    }}
                />
            </TableCell>
        );
    }, [baseName, control, fields, onSelectedCountChange, trigger, t, fieldErrors]);

    // 仮想化リストの行コンポーネント（memo化でちらつき軽減）
    const Row = memo(({ index, style }: { index: number; style: React.CSSProperties }) => {
        // 最終行+1の位置に行追加・行削除ボタンを表示
        if (index === fields.length) {
            return (
                <Box style={style} sx={{ 
                    bgcolor: '#fafafa', 
                    borderBottom: '1px solid rgba(224, 224, 224, 1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    gap: 1,
                    pl: '77px',
                    pr: 2
                }}>
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
            );
        }

        const field = fields[index];
        return (
            <Box style={style} sx={{ borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>
                <TableRow hover sx={{ display: 'flex', alignItems: 'stretch', width: '100%', height: ROW_HEIGHT }}>
                    <TableCell align="center" sx={{ width: 60, flexShrink: 0, borderRight: 1, borderColor: 'divider', borderBottom: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px 16px' }}>{index + 1}</TableCell>
                    {columns.map((column) => renderCell(field, index, column))}
                </TableRow>
            </Box>
        );
    });

    return (
        <Paper elevation={1} sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* ヘッダー（横スクロール同期用のコンテナでラップ） */}
            <Box 
                ref={headerContainerRef}
                sx={{ 
                    overflowX: 'auto', 
                    overflowY: 'hidden',
                    paddingRight: '13px', // スクロールバーの幅分の余白を確保
                    '&::-webkit-scrollbar': {
                        height: 0, // スクロールバーを非表示
                    },
                    scrollbarWidth: 'none', // Firefox用
                }}
            >
                <Table stickyHeader size="small">
                    <TableHead>
                        <TableRow sx={{ display: 'flex', width: '100%' }}>
                            <TableCell align="center" sx={{ bgcolor: '#e3f2fd', fontWeight: 'bold', width: 60, flexShrink: 0, borderRight: 1, borderColor: 'divider', padding: '6px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', whiteSpace: 'nowrap' }}>No</TableCell>
                            {columns.map((column) => (
                                <TableCell 
                                    key={column.key}
                                    sx={{ 
                                        bgcolor: '#e3f2fd', 
                                        fontWeight: 'bold', 
                                        width: column.width, 
                                        minWidth: column.minWidth,
                                        flexShrink: column.key === 'selected' || column.type === 'number' || column.type === 'select' ? 0 : undefined,
                                        flex: column.key !== 'selected' && column.type !== 'number' && column.type !== 'select' && !column.width ? 1 : undefined,
                                        padding: '6px 16px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'flex-start',
                                        whiteSpace: 'nowrap',
                                        ...(column.key === 'selected' && { paddingLeft: '0px', borderLeft: 1, borderRight: 1, borderColor: 'divider', justifyContent: 'center' }),
                                        ...(column.type === 'number' && column.disabled && { borderLeft: 1, borderRight: 1, borderColor: 'divider', justifyContent: 'center' }),
                                        ...(column.type === 'text' && column.width && { borderRight: 1, borderColor: 'divider' })
                                    }}
                                >
                                    {column.key === 'selected' ? (
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
                </Table>
            </Box>

            {/* 仮想化リスト */}
            <Box ref={listContainerRef} sx={{ flex: 1, overflow: 'hidden' }}>
                <FixedSizeList
                    height={listHeight || 700}
                    itemCount={fields.length + 1}
                    itemSize={ROW_HEIGHT}
                    width="100%"
                    overscanCount={5}
                    outerRef={scrollContainerRef}
                    itemKey={(index) => index === fields.length ? 'footer' : (fields[index]?.id || index)}
                >
                    {Row}
                </FixedSizeList>
            </Box>
        </Paper>
    );
}

const FunctionTableMemo = memo(FunctionTable) as <T extends FieldValues = FieldValues>(props: Props<T>) => JSX.Element;
export default FunctionTableMemo;

import {
    Paper,
    Box,
    Table,
    TableHead,
    TableRow,
    TableCell,
    Checkbox,
    Select,
    MenuItem,
    Stack,
} from '@mui/material';
import {
    Controller,
    Control,
    FieldPath,
    UseFormTrigger,
    FieldArrayWithId,
    FieldValues,
    ArrayPath,
} from 'react-hook-form';
import { TFunction } from 'i18next';
import { useCallback, memo, useRef, useState, useEffect, useMemo } from 'react';
import { FixedSizeList } from 'react-window';
// import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import TextField from '@front/components/ui/TextField';
import AddRowButton from '../Button/AddRowButton';
import DeleteRowButton from '../Button/DeleteRowButton';
import DeleteIcon from '@mui/icons-material/Delete';

export type ColumnDefinition<TRow> = {
    key: keyof TRow;
    label: string;
    width?: number | string;
    minWidth?: number | string;
    align?: 'left' | 'center' | 'right';
    type?: 'text' | 'number' | 'select' | 'checkbox' | 'readonly' | 'updateType';
    icon?: 'edit' | 'auto';
    options?: { value: string; label: string }[];
    disabled?: boolean;
    maxLength?: number;
    min?: number;
    max?: number;
    render?: (index: number, fieldName: string) => React.ReactNode;
};

export type Props<
    TForm extends FieldValues = FieldValues,
    TFieldArrayName extends ArrayPath<TForm> = ArrayPath<TForm>
> = {
    fields: FieldArrayWithId<TForm, TFieldArrayName>[];
    columns: ColumnDefinition<
        TForm[TFieldArrayName] extends Array<infer TRow> ? TRow : never
    >[];
    baseName: TFieldArrayName;
    control: Control<TForm>;
    trigger: UseFormTrigger<TForm>;
    t: TFunction<'translation', undefined>;
    handleAddDataRow: () => void;
    handleDeleteDataRow: () => void;
    selectedCount: number;
    onSelectedCountChange: (count: number) => void;
    maxHeight?: string;
    fieldErrors?: Record<number, Record<string, boolean>>;
};

function FunctionTable<
    TForm extends FieldValues,
    TFieldArrayName extends ArrayPath<TForm>
>(props: Props<TForm, TFieldArrayName>) {
    const {
        fields,
        columns,
        baseName,
        control,
        trigger,
        t,
        handleAddDataRow,
        handleDeleteDataRow,
        onSelectedCountChange,
        fieldErrors,
    } = props;

    const ROW_HEIGHT = 53;

    const listContainerRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const headerContainerRef = useRef<HTMLDivElement>(null);

    const [listHeight, setListHeight] = useState(0);
    const [scrollbarWidth, setScrollbarWidth] = useState(15);

    /* =========================
        レイアウト制御
    ========================= */

    useEffect(() => {
        if (scrollContainerRef.current) {
            const width = scrollContainerRef.current.offsetWidth - scrollContainerRef.current.clientWidth;
            if (width !== scrollbarWidth) {
                setScrollbarWidth(width);
            }
        }
    }, []); // 初回のみ実行

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

    /* =========================
        列確定（SendScriptSearchTableと同じ思想）
    ========================= */

    const resolvedColumns = useMemo(() => {
        return columns.map((column) => {
        const renderCell = (index: number) => {
            const fieldName =
            `${baseName}.${index}.${String(column.key)}` as FieldPath<TForm>;

            // const hasError = fieldErrors?.[index]?.[
            // column.key as string
            // ] || false;

            // custom render
            if (column.render) {
                return (
                    <TableCell
                        key={String(column.key)}
                        sx={{
                            width: column.width,
                            minWidth: column.minWidth,
                            flexShrink: 0,
                            borderBottom: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            padding: '6px 16px'
                        }}
                    >
                        {column.render(index, fieldName)}
                    </TableCell>
                );
            }

            // checkbox
            if (column.key === 'selected') {
            return (
                <TableCell key={column.key} sx={{ width: column.width, minWidth: column.minWidth, flexShrink: 0, borderLeft: 0, borderRight: 0, borderColor: 'divider', borderBottom: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px 16px' }}>
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

            // select
            if (column.type === 'updateType') {

            const hasError = fieldErrors?.[index]?.[
            column.key as string
            ] || false;

            // const hasError = fieldErrors?.[index]?.[column.key] || false;
            return (
                <TableCell key={String(column.key)} sx={{ width: column.width, minWidth: column.minWidth, flexShrink: 0, borderBottom: 'none', display: 'flex', alignItems: 'center', padding: '6px 16px' }}>
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

            // number
            if (column.type === 'number') {
            const hasError = fieldErrors?.[index]?.[
            column.key as string
            ] || false;
            // const hasError = fieldErrors?.[index]?.[column.key] || false;
            
            // disabled の場合は通常のテキスト表示にする
            if (column.disabled) {
                return (
                    <TableCell key={String(column.key)} sx={{ width: column.width, minWidth: column.minWidth, flexShrink: 0, borderLeft: 0, borderRight: 0, borderColor: 'divider', borderBottom: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px 16px' }}>
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
                <TableCell key={String(column.key)} sx={{ width: column.width, minWidth: column.minWidth, flexShrink: 0, borderBottom: 'none', display: 'flex', alignItems: 'center', padding: '6px 16px' }}>
                <TextField
                    name={fieldName}
                    control={control}
                    trigger={trigger}
                    t={t}
                    type="number"
                    notFullWidth
                    disabled={column.disabled}
                    error={hasError}
                    min={column.min}
                    max={column.max}
                    slotProps={{ 
                        htmlInput: { 
                            onKeyDown: (e: React.KeyboardEvent) => { 
                                // 整数のみなので小数点も禁止
                                if (e.key === '.') e.preventDefault(); 
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
                        },
                        ...(hasError && {
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#d32f2f !important',
                                borderWidth: '2px !important',
                            },
                        }),
                    }}
                    hideHelperText
                />
                </TableCell>
            );
            }

            // default text
            return (
            <TableCell key={String(column.key)} sx={{ width: column.width, minWidth: column.minWidth, flex: column.width ? '0 0 auto' : 1, borderRight: column.width ? 1 : undefined, borderColor: 'divider', borderBottom: 'none', display: 'flex', alignItems: 'center', padding: '6px 16px' }}>
                <TextField
                name={fieldName}
                control={control}
                trigger={trigger}
                t={t}
                error={fieldErrors?.[index]?.[column.key as string ] || false}
                maxLength={column.maxLength}
                sx={{ 
                    '& .MuiInputBase-root': { bgcolor: 'white' },
                    ...(fieldErrors?.[index]?.[column.key as string] && {
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#d32f2f !important',
                            borderWidth: '2px !important',
                        },
                    }),
                }}
                hideHelperText
                />
            </TableCell>
            );
        };

        return {
            ...column,
            renderCell,
        };
        });
    }, [
        columns,
        baseName,
        control,
        trigger,
        t,
        fieldErrors,
        fields,
        onSelectedCountChange,
    ]);

    /* =========================
        仮想行
    ========================= */

    const Row = memo(
        ({ index, style }: { index: number; style: React.CSSProperties }) => {
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
                    <Stack direction="row" spacing={1}>
                        <AddRowButton onClick={handleAddDataRow} />
                        <DeleteRowButton onClick={handleDeleteDataRow} />
                    </Stack>
                </Box>
            );
        }

        return (
            <Box style={style} sx={{ borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>
                <TableRow hover sx={{ display: 'flex', alignItems: 'stretch', width: '100%', height: ROW_HEIGHT }}>
                    <TableCell align="center" sx={{ width: 60, flexShrink: 0, borderRight: 0, borderColor: 'divider', borderBottom: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px 16px' }}>{index + 1}</TableCell>
                    {resolvedColumns.map((col) => col.renderCell(index))}
            </TableRow>
            </Box>
        );
        }
    );

    /* =========================
        Render
    ========================= */

    return (
        <Paper elevation={1} sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* ヘッダー（横スクロール同期用のコンテナでラップ） */}
            <Box 
                ref={headerContainerRef}
                sx={{ 
                    overflowX: 'auto', 
                    overflowY: 'hidden',
                    paddingRight: `${scrollbarWidth}px`, // スクロールバーの幅分の余白を確保
                    '&::-webkit-scrollbar': {
                        height: 0, // スクロールバーを非表示
                    },
                    scrollbarWidth: 'none', // Firefox用
                }}
            >
                <Table stickyHeader size="small">
                    <TableHead>
                        <TableRow sx={{ display: 'flex', width: '100%' }}>
                            <TableCell align="center" sx={{ bgcolor: '#e3f2fd', fontWeight: 'bold', width: 60, flexShrink: 0, borderRight: 0, borderColor: 'divider', padding: '6px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', whiteSpace: 'nowrap' }}>No</TableCell>
                            {columns.map((column) => (
                            <TableCell 
                                key={String(column.key)}
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
                                    ...(column.key === 'selected' && { paddingLeft: '0px', borderLeft: 0, borderRight: 0, borderColor: 'divider', justifyContent: 'center' }),
                                    ...(column.type === 'number' && column.disabled && { borderLeft: 0, borderRight: 0, borderColor: 'divider', justifyContent: 'center' }),
                                    ...(column.type === 'text' && column.width && { borderRight: 0, borderColor: 'divider' })
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

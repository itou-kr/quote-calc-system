import * as yup from 'yup';
import { useImportFile } from '@front/hooks/TEST/test';
import { useExportFile } from '@front/hooks/TEST/test';
import { ViewIdType } from '@front/stores/TEST/test/testStore/index';
import { useMemo, useState } from 'react';
import { FormProvider, useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Stack, Paper, Typography, Divider, Table, TableHead, TableBody, TableRow, TableCell, Checkbox, Select, MenuItem, Tabs, Tab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

import ImportButton from '@front/components/ui/Button/ImportButton';
import ExportButton from '@front/components/ui/Button/ExportButton';
import Button from '@front/components/ui/Button';
import TextField from '@front/components/ui/TextField';
import { t } from 'i18next';

// 初期データファンクションデータ
const DEFAULT_DATA_FUNCTIONS = Array.from({ length: 20 }, () => ({
    selected: false,
    name: '',
    updateType: '',
    fpValue: 0,
    remarks: '',
}));

// 初期トランザクションファンクションデータ
const DEFAULT_TRANSACTION_FUNCTIONS = Array.from({ length: 20 }, () => ({
    selected: false,
    name: '',
    externalInput: 0,
    externalOutput: 0,
    externalInquiry: 0,
    fpValue: 0,
    remarks: '',
}));

const setupYupScheme = () => {
    return yup.object({
        // 案件情報
        projectName: yup.string().required('案件名を入力してください'),
        productivityFPPerMonth: yup.number().positive('正の数を入力してください').required('生産性を入力してください'),
        projectType: yup.string().required('案件種別を選択してください'),
        
        // データファンクション情報
        dataFunctions: yup.array().of(
            yup.object({
                selected: yup.boolean(),
                name: yup.string(),
                updateType: yup.string(),
                fpValue: yup.number().min(0, '0以上の値を入力してください'),
                remarks: yup.string(),
            })
        ),
        
        // トランザクションファンクション情報
        transactionFunctions: yup.array().of(
            yup.object({
                selected: yup.boolean(),
                name: yup.string(),
                externalInput: yup.number().min(0, '0以上の値を入力してください'),
                externalOutput: yup.number().min(0, '0以上の値を入力してください'),
                externalInquiry: yup.number().min(0, '0以上の値を入力してください'),
                fpValue: yup.number().min(0, '0以上の値を入力してください'),
                remarks: yup.string(),
            })
        ),
    });
};

export type FormType = yup.InferType<ReturnType<typeof setupYupScheme>>;

type Props = {
    viewId: ViewIdType | 'CALC';
    data?: FormType;
    isDirty: boolean;
};

function CalcForm(props: Props) {
    const { viewId } = props;
    const [tabValue, setTabValue] = useState(0);

    const schema = useMemo(() => setupYupScheme(), []);

    const importFile = useImportFile(viewId as ViewIdType | 'TEST' | 'CALC');
    const exportFile = useExportFile(viewId as ViewIdType | 'TEST' | 'CALC');

    const methods = useForm<FormType>({
        mode: 'onSubmit',
        reValidateMode: 'onSubmit',
        resolver: yupResolver(schema),
        defaultValues: {
            projectName: '',
            productivityFPPerMonth: undefined,
            projectType: '新規開発',
            dataFunctions: [...DEFAULT_DATA_FUNCTIONS],
            transactionFunctions: [...DEFAULT_TRANSACTION_FUNCTIONS],
            ...props.data,
        },
    });

    const { control, trigger, watch, setValue, getValues } = methods;
    
    const { fields: dataFields, append: appendData, remove: removeData } = useFieldArray({
        control,
        name: 'dataFunctions',
    });
    
    const { fields: transactionFields, append: appendTransaction, remove: removeTransaction } = useFieldArray({
        control,
        name: 'transactionFunctions',
    });

    const dataFunctions = watch('dataFunctions') || [];
    const transactionFunctions = watch('transactionFunctions') || [];
    const productivityFPPerMonth = watch('productivityFPPerMonth') || 0;
    
    const [tableTabValue, setTableTabValue] = useState(0);

    /** ▼ FP合計を計算 */
    const calculateTotalFP = () => {
        const dataTotal = dataFunctions.reduce((sum, item) => sum + (Number(item.fpValue) || 0), 0);
        const transactionTotal = transactionFunctions.reduce((sum, item) => sum + (Number(item.fpValue) || 0), 0);
        return dataTotal + transactionTotal;
    };

    /** ▼ 工数を計算 */
    const calculateManMonths = () => {
        const totalFP = calculateTotalFP();
        if (productivityFPPerMonth > 0) {
            return Math.round((totalFP / productivityFPPerMonth) * 100) / 100;
        }
        return 0;
    };

    /** ▼ 工数計算実行（バリデーショントリガー） */
    const onExecuteCalculation = () => {
        // フォームのバリデーションを実行
        // 計算自体はリアクティブに自動実行される
        trigger();
    };

    /** ▼ 行追加 */
    const onAddRow = () => {
        if (tableTabValue === 0) {
            appendData({ 
                selected: false, 
                name: '', 
                updateType: '',
                fpValue: 0, 
                remarks: '' 
            });
        } else {
            appendTransaction({
                selected: false,
                name: '',
                externalInput: 0,
                externalOutput: 0,
                externalInquiry: 0,
                fpValue: 0,
                remarks: ''
            });
        }
    };

    /** ▼ 選択削除 */
    const onDeleteSelected = () => {
        if (tableTabValue === 0) {
            const values = getValues('dataFunctions');
            if (!values) return;
            const indicesToRemove = values
                .map((item, index) => (item.selected ? index : -1))
                .filter(index => index !== -1)
                .reverse();
            indicesToRemove.forEach(index => removeData(index));
        } else {
            const values = getValues('transactionFunctions');
            if (!values) return;
            const indicesToRemove = values
                .map((item, index) => (item.selected ? index : -1))
                .filter(index => index !== -1)
                .reverse();
            indicesToRemove.forEach(index => removeTransaction(index));
        }
    };

    /** ▼ インポート処理 */
    const onImportButtonClick = async (file: File) => {
        const result = await importFile(file);

        try {
            const json = JSON.parse(result.content);
            methods.reset(json);
        } catch (e) {
            console.error('JSON parse error:', e);
        }
    };

    /** ▼ エクスポート処理 */
    const onExportButtonClick = async () => {
        const data = methods.getValues();
        await exportFile({
            name: 'export.json',
            content: JSON.stringify(data, null, 2),
        });
    };

    const totalFP = calculateTotalFP();
    const manMonths = calculateManMonths();

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <FormProvider {...methods}>
                {/* ヘッダー */}
                <Paper elevation={0} sx={{ bgcolor: '#1976d2', color: 'white', p: 2, borderRadius: 0 }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>FP見積システム</Typography>
                </Paper>

                {/* タブエリア */}
                <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: '#f5f5f5' }}>
                    <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
                        <Tab icon={<Box component="span" sx={{ mr: 1 }}>✎</Box>} label="入力編（青枠）" sx={{ border: '2px solid #1976d2', borderBottom: 'none', borderRadius: '4px 4px 0 0', mr: 1, bgcolor: tabValue === 0 ? 'white' : 'transparent' }} />
                        <Tab icon={<Box component="span" sx={{ mr: 1 }}>⚙</Box>} label="自動計算編（グレー背景）" sx={{ bgcolor: '#e0e0e0', borderRadius: '4px 4px 0 0', mr: 1 }} />
                        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', px: 2, color: 'text.secondary' }}>
                            <Box component="span" sx={{ mr: 1 }}>ⓘ</Box>
                            <Typography variant="body2">計算ボタンを押すと自動で値が更新されます</Typography>
                        </Box>
                    </Tabs>
                </Box>

                {/* メインコンテンツエリア */}
                <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                    {/* 左サイドバー - 案件情報 */}
                    <Box sx={{ width: 320, borderRight: 1, borderColor: 'divider', p: 2, overflow: 'auto', bgcolor: 'white' }}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>案件情報</Typography>

                        {/* 案件名 */}
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 'bold' }}>案件名 <Typography component="span" color="error">*</Typography></Typography>
                            <TextField name="projectName" control={control} trigger={trigger} t={t} sx={{ '& .MuiInputBase-root': { bgcolor: 'white' } }} />
                        </Box>

                        {/* 生産性 */}
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 'bold' }}>生産性(FP/月) <Typography component="span" color="error">*</Typography></Typography>
                            <TextField name="productivityFPPerMonth" control={control} trigger={trigger} t={t} type="number" />
                        </Box>

                        {/* 案件種別 */}
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 'bold' }}>案件種別 <Typography component="span" color="error">*</Typography></Typography>
                            <Select value={watch('projectType') || '新規開発'} onChange={(e) => setValue('projectType', e.target.value)} fullWidth size="small" sx={{ bgcolor: 'white' }}>
                                <MenuItem value="新規開発">新規開発</MenuItem>
                                <MenuItem value="改良開発">改良開発</MenuItem>
                                <MenuItem value="再開発">再開発</MenuItem>
                            </Select>
                        </Box>

                        {/* インポート/エクスポート */}
                        <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
                            <ImportButton onFileSelect={onImportButtonClick} onClick={() => {}} size="small">インポート</ImportButton>
                            <ExportButton onClick={onExportButtonClick} size="small" />
                        </Stack>

                        <Divider sx={{ my: 2 }} />

                        {/* 計算結果サマリー */}
                        <Typography variant="body2" sx={{ mb: 2, fontWeight: 'bold' }}>計算結果サマリー</Typography>

                        <Box sx={{ mb: 2, p: 1.5, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Typography variant="body2">総FP</Typography>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{totalFP}</Typography>
                            </Stack>
                        </Box>

                        <Box sx={{ mb: 2, p: 1.5, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Typography variant="body2">工数(人月)</Typography>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{manMonths}</Typography>
                            </Stack>
                        </Box>

                        {/* 工数計算実行ボタン */}
                        <Button variant="contained" color="primary" onClick={onExecuteCalculation} sx={{ mt: 2, width: '100%' }}>工数計算を実行</Button>
                    </Box>

                    {/* 右メインエリア - 画面情報入力 */}
                    <Box sx={{ flex: 1, p: 2, overflow: 'auto', bgcolor: '#fafafa' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Stack direction="row" spacing={1}>
                                <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={onAddRow} size="small">行追加</Button>
                                <Button variant="contained" color="error" startIcon={<DeleteIcon />} onClick={onDeleteSelected} size="small">選択削除</Button>
                            </Stack>
                        </Box>
                        
                        {/* テーブルタブ */}
                        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                            <Tabs value={tableTabValue} onChange={(_, newValue) => setTableTabValue(newValue)}>
                                <Tab label="データファンクション" />
                                <Tab label="トランザクションファンクション" />
                            </Tabs>
                        </Box>

                        {/* テーブル */}
                        <Paper elevation={1} sx={{ maxHeight: 'calc(100vh - 350px)', overflow: 'auto' }}>
                            <Table stickyHeader size="small">
                                {tableTabValue === 0 ? (
                                    <TableHead>
                                        <TableRow>
                                            <TableCell padding="checkbox" sx={{ bgcolor: '#e3f2fd', fontWeight: 'bold' }}>選択</TableCell>
                                            <TableCell sx={{ bgcolor: '#e3f2fd', fontWeight: 'bold', minWidth: 60 }}>No</TableCell>
                                            <TableCell sx={{ bgcolor: '#e3f2fd', fontWeight: 'bold', minWidth: 200 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Box component="span" sx={{ mr: 0.5 }}>✎</Box>
                                                    名称
                                                </Box>
                                            </TableCell>
                                            <TableCell sx={{ bgcolor: '#e3f2fd', fontWeight: 'bold', minWidth: 150 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Box component="span" sx={{ mr: 0.5 }}>✎</Box>
                                                    更新種別
                                                </Box>
                                            </TableCell>
                                            <TableCell sx={{ bgcolor: '#e3f2fd', fontWeight: 'bold', minWidth: 100 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Box component="span" sx={{ mr: 0.5 }}>⚙</Box>
                                                    FP値
                                                </Box>
                                            </TableCell>
                                            <TableCell sx={{ bgcolor: '#e3f2fd', fontWeight: 'bold', minWidth: 200 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Box component="span" sx={{ mr: 0.5 }}>✎</Box>
                                                    備考
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                ) : (
                                    <TableHead>
                                        <TableRow>
                                            <TableCell padding="checkbox" sx={{ bgcolor: '#e3f2fd', fontWeight: 'bold' }}>選択</TableCell>
                                            <TableCell sx={{ bgcolor: '#e3f2fd', fontWeight: 'bold', minWidth: 60 }}>No</TableCell>
                                            <TableCell sx={{ bgcolor: '#e3f2fd', fontWeight: 'bold', minWidth: 200 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Box component="span" sx={{ mr: 0.5 }}>✎</Box>
                                                    名称
                                                </Box>
                                            </TableCell>
                                            <TableCell sx={{ bgcolor: '#e3f2fd', fontWeight: 'bold', minWidth: 60 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Box component="span" sx={{ mr: 0.5 }}>✎</Box>
                                                    外部入力
                                                </Box>
                                            </TableCell>
                                            <TableCell sx={{ bgcolor: '#e3f2fd', fontWeight: 'bold', minWidth: 60 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Box component="span" sx={{ mr: 0.5 }}>✎</Box>
                                                    外部出力
                                                </Box>
                                            </TableCell>
                                            <TableCell sx={{ bgcolor: '#e3f2fd', fontWeight: 'bold', minWidth: 60 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Box component="span" sx={{ mr: 0.5 }}>✎</Box>
                                                    外部照会
                                                </Box>
                                            </TableCell>
                                            <TableCell sx={{ bgcolor: '#e3f2fd', fontWeight: 'bold', minWidth: 100 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Box component="span" sx={{ mr: 0.5 }}>⚙</Box>
                                                    FP値
                                                </Box>
                                            </TableCell>
                                            <TableCell sx={{ bgcolor: '#e3f2fd', fontWeight: 'bold', minWidth: 200 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Box component="span" sx={{ mr: 0.5 }}>✎</Box>
                                                    備考
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                )}
                                <TableBody>
                                    {tableTabValue === 0 ? (
                                        dataFields.map((field, index) => (
                                            <TableRow key={field.id} hover>
                                                <TableCell padding="checkbox">
                                                    <Checkbox checked={watch(`dataFunctions.${index}.selected`) || false} onChange={(e) => setValue(`dataFunctions.${index}.selected`, e.target.checked)} />
                                                </TableCell>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>
                                                    <TextField name={`dataFunctions.${index}.name`} control={control} trigger={trigger} t={t} notFullWidth sx={{ '& .MuiInputBase-root': { bgcolor: 'white', minWidth: 180 } }} />
                                                </TableCell>
                                                <TableCell>
                                                    <Select value={watch(`dataFunctions.${index}.updateType`) || ''} onChange={(e) => setValue(`dataFunctions.${index}.updateType`, e.target.value)} size="small" fullWidth displayEmpty sx={{ bgcolor: 'white', minWidth: 130 }}>
                                                        <MenuItem value="">選択してください</MenuItem>
                                                        <MenuItem value="更新あり">更新あり</MenuItem>
                                                        <MenuItem value="参照のみ">参照のみ</MenuItem>
                                                    </Select>
                                                </TableCell>
                                                <TableCell>
                                                    <TextField name={`dataFunctions.${index}.fpValue`} control={control} trigger={trigger} t={t} type="number" notFullWidth sx={{ '& .MuiInputBase-root': { bgcolor: '#f5f5f5', minWidth: 80 } }} />
                                                </TableCell>
                                                <TableCell>
                                                    <TextField name={`dataFunctions.${index}.remarks`} control={control} trigger={trigger} t={t} notFullWidth sx={{ '& .MuiInputBase-root': { bgcolor: 'white', minWidth: 180 } }} />
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        transactionFields.map((field, index) => (
                                            <TableRow key={field.id} hover>
                                                <TableCell padding="checkbox">
                                                    <Checkbox checked={watch(`transactionFunctions.${index}.selected`) || false} onChange={(e) => setValue(`transactionFunctions.${index}.selected`, e.target.checked)} />
                                                </TableCell>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>
                                                    <TextField name={`transactionFunctions.${index}.name`} control={control} trigger={trigger} t={t} notFullWidth sx={{ '& .MuiInputBase-root': { bgcolor: 'white', minWidth: 180 } }} />
                                                </TableCell>
                                                <TableCell>
                                                    <TextField name={`transactionFunctions.${index}.externalInput`} control={control} trigger={trigger} t={t} type="number" notFullWidth sx={{ '& .MuiInputBase-root': { bgcolor: 'white', minWidth: 40 } }} />
                                                </TableCell>
                                                <TableCell>
                                                    <TextField name={`transactionFunctions.${index}.externalOutput`} control={control} trigger={trigger} t={t} type="number" notFullWidth sx={{ '& .MuiInputBase-root': { bgcolor: 'white', minWidth: 40 } }} />
                                                </TableCell>
                                                <TableCell>
                                                    <TextField name={`transactionFunctions.${index}.externalInquiry`} control={control} trigger={trigger} t={t} type="number" notFullWidth sx={{ '& .MuiInputBase-root': { bgcolor: 'white', minWidth: 40 } }} />
                                                </TableCell>
                                                <TableCell>
                                                    <TextField name={`transactionFunctions.${index}.fpValue`} control={control} trigger={trigger} t={t} type="number" notFullWidth sx={{ '& .MuiInputBase-root': { bgcolor: '#f5f5f5', minWidth: 80 } }} />
                                                </TableCell>
                                                <TableCell>
                                                    <TextField name={`transactionFunctions.${index}.remarks`} control={control} trigger={trigger} t={t} notFullWidth sx={{ '& .MuiInputBase-root': { bgcolor: 'white', minWidth: 180 } }} />
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </Paper>
                    </Box>
                </Box>
            </FormProvider>
        </Box>
    );
}

export default CalcForm;
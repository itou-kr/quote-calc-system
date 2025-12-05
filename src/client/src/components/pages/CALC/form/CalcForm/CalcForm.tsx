import * as yup from 'yup';
import { useImportFile } from '@front/hooks/TEST/test';
import { useExportFile } from '@front/hooks/TEST/test';
import { ViewIdType } from '@front/stores/TEST/test/testStore/index';
import { useMemo, useState } from 'react';
import { FormProvider, useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Stack, Paper, Typography, Divider, Table, TableHead, TableBody, TableRow, TableCell, Checkbox, Select, MenuItem, Tabs, Tab, Collapse, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import SummarizeIcon from '@mui/icons-material/Summarize';
import EditIcon from '@mui/icons-material/Edit';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

import ImportButton from '@front/components/ui/Button/ImportButton';
import ExportButton from '@front/components/ui/Button/ExportButton';
import Button from '@front/components/ui/Button';
import TextField from '@front/components/ui/TextField';
import { t } from 'i18next';

// 初期データファンクションデータ
const DEFAULT_DATA_FUNCTIONS = Array.from({ length: 50 }, () => ({
    selected: false,
    name: '',
    updateType: '',
    fpValue: 0,
    remarks: '',
}));

// 初期トランザクションファンクションデータ
const DEFAULT_TRANSACTION_FUNCTIONS = Array.from({ length: 50 }, () => ({
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
        autoProductivity: yup.boolean(),
        productivityFPPerMonth: yup.number().positive('正の数を入力してください').required('生産性を入力してください'),
        projectType: yup.string().required('案件種別を選択してください'),
        // 使用するIPA代表値
        ipaValueType: yup.string().required('使用するIPA代表値を選択してください'),
        
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

        // 工程別比率
        processRatios: yup.object({
            basicDesign: yup.number().min(0, '0以上の値を入力してください').max(1, '1以下の値を入力してください'),
            detailedDesign: yup.number().min(0, '0以上の値を入力してください').max(1, '1以下の値を入力してください'),
            implementation: yup.number().min(0, '0以上の値を入力してください').max(1, '1以下の値を入力してください'),
            integrationTest: yup.number().min(0, '0以上の値を入力してください').max(1, '1以下の値を入力してください'),
            systemTest: yup.number().min(0, '0以上の値を入力してください').max(1, '1以下の値を入力してください'),
        }),
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

    const schema = useMemo(() => setupYupScheme(), []);

    const importFile = useImportFile(viewId as ViewIdType | 'TEST' | 'CALC');
    const exportFile = useExportFile(viewId as ViewIdType | 'TEST' | 'CALC');

    const methods = useForm<FormType>({
        mode: 'onSubmit',
        reValidateMode: 'onSubmit',
        resolver: yupResolver(schema),
        defaultValues: {
            projectName: '',
            autoProductivity: true,
            productivityFPPerMonth: 10.5,
            projectType: '新規開発',
            ipaValueType: '中央値',
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
    const autoProductivity = watch('autoProductivity') ?? false;
    const productivityFPPerMonth = watch('productivityFPPerMonth') || 0;
    
    const [tableTabValue, setTableTabValue] = useState(0);
    const [processBreakdownOpen, setProcessBreakdownOpen] = useState(false);
    const [dataTableScrollTop, setDataTableScrollTop] = useState(0);
    const [transactionTableScrollTop, setTransactionTableScrollTop] = useState(0);

    // 工程別の比率（デフォルト値）
    const processRatios = {
        basicDesign: 0.157,
        detailedDesign: 0.189,
        implementation: 0.354,
        integrationTest: 0.164,
        systemTest: 0.136,
    };

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

    /** ▼ 工程別の工数を計算 */
    const calculateProcessManMonths = (ratio: number) => {
        const totalManMonths = calculateManMonths();
        return Math.round(totalManMonths * ratio * 100) / 100;
    };

    /** ▼ 工程別の工期を計算（仮：工数と同じ値を表示） */
    const calculateProcessDuration = (ratio: number) => {
        const totalManMonths = calculateManMonths();
        return Math.round(totalManMonths * ratio * 100) / 100;
    };

    /** ▼ 工数計算実行（バリデーショントリガー） */
    const onExecuteCalculation = () => {
        // フォームのバリデーションを実行
        // 計算自体はリアクティブに自動実行される
        trigger();
        // 工程別比率の表を自動で表示
        setProcessBreakdownOpen(true);
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
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <SummarizeIcon sx={{ fontSize: 32 }} />
                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>見積作成支援ツール</Typography>
                    </Box>
                </Paper>

                {/* メインコンテンツエリア */}
                <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                    {/* 左サイドバー - 案件情報 */}
                    <Box sx={{ width: 360, borderRight: 1, borderColor: 'divider', display: 'flex', flexDirection: 'column', bgcolor: 'white' }}>
                        {/* スクロール可能な上部エリア */}
                        <Box sx={{ flex: 1, p: 3, overflowY: 'auto' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>案件情報</Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <EditIcon sx={{ fontSize: 16, mr: 0.3, color: 'text.secondary' }} />
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>入力欄</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <AutoAwesomeIcon sx={{ fontSize: 16, mr: 0.3, color: 'text.secondary' }} />
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>自動計算欄</Typography>
                                    </Box>
                                </Box>
                            </Box>

                            {/* 案件名 */}
                            <Box sx={{ mb: 2.5 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.8 }}>
                                    <EditIcon sx={{ fontSize: 16, mr: 0.5 }} />
                                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>案件名 <Typography component="span" color="error">*</Typography></Typography>
                                </Box>
                                <TextField name="projectName" control={control} trigger={trigger} t={t} hideHelperText sx={{ '& .MuiInputBase-root': { bgcolor: 'white' } }} />
                            </Box>

                            {/* 生産性 */}
                            <Box sx={{ mb: 2.5 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.8 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <EditIcon sx={{ fontSize: 16, mr: 0.5 }} />
                                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>生産性(FP/月) <Typography component="span" color="error">*</Typography></Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Checkbox 
                                            checked={autoProductivity} 
                                            onChange={(e) => setValue('autoProductivity', e.target.checked)}
                                            size="small"
                                            sx={{ p: 0, mr: 0.5 }}
                                        />
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>自動入力</Typography>
                                    </Box>
                                </Box>
                                <TextField 
                                    name="productivityFPPerMonth" 
                                    control={control} 
                                    trigger={trigger} 
                                    t={t} 
                                    type="number" 
                                    hideHelperText 
                                    disabled={autoProductivity}
                                    sx={{ '& .MuiInputBase-root': { bgcolor: autoProductivity ? '#f5f5f5' : 'white' } }}
                                />
                            </Box>

                            {/* 案件種別 */}
                            <Box sx={{ mb: 2.5 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.8 }}>
                                    <EditIcon sx={{ fontSize: 16, mr: 0.5 }} />
                                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>案件種別</Typography>
                                </Box>
                                <Select value={watch('projectType') || '新規開発'} onChange={(e) => setValue('projectType', e.target.value)} fullWidth size="small" sx={{ bgcolor: 'white' }}>
                                    <MenuItem value="新規開発">新規開発</MenuItem>
                                    <MenuItem value="改良開発">改良開発</MenuItem>
                                    <MenuItem value="再開発">再開発</MenuItem>
                                </Select>
                            </Box>

                            {/* 使用するIPA代表値 */}
                            <Box sx={{ mb: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.8 }}>
                                    <EditIcon sx={{ fontSize: 16, mr: 0.5 }} />
                                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>使用するIPA代表値</Typography>
                                </Box>
                                <Select value={watch('ipaValueType') || '中央値'} onChange={(e) => setValue('ipaValueType', e.target.value)} size="small" fullWidth sx={{ bgcolor: 'white' }}>
                                    <MenuItem value="中央値">中央値</MenuItem>
                                    <MenuItem value="平均値">平均値</MenuItem>
                                </Select>
                            </Box>

                            <Divider sx={{ my: 3 }} />

                            {/* インポート / エクスポート */}
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1.5 }}>インポート / エクスポート</Typography>
                                <Stack direction="row" spacing={1}>
                                    <ImportButton onFileSelect={onImportButtonClick} onClick={() => {}} size="small" sx={{ bgcolor: '#42a5f5', '&:hover': { bgcolor: '#2196f3' }, flex: 1 }}>インポート</ImportButton>
                                    <ExportButton onClick={onExportButtonClick} size="small" sx={{ bgcolor: '#42a5f5', '&:hover': { bgcolor: '#2196f3' }, flex: 1 }} />
                                </Stack>
                            </Box>

                            <Divider sx={{ my: 3 }} />

                            {/* 計算結果サマリー */}
                            <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1.5 }}>計算結果サマリー</Typography>

                                <Box sx={{ mb: 1, p: 1.5, bgcolor: '#f5f5f5', borderRadius: 1, border: 1, borderColor: '#e0e0e0' }}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <AutoAwesomeIcon sx={{ fontSize: 18, mr: 0.8, color: 'primary.main' }} />
                                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>総FP</Typography>
                                        </Box>
                                        <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>{totalFP}</Typography>
                                    </Stack>
                                </Box>

                                <Box sx={{ p: 1.5, bgcolor: '#f5f5f5', borderRadius: 1, border: 1, borderColor: '#e0e0e0' }}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <AutoAwesomeIcon sx={{ fontSize: 18, mr: 0.8, color: 'primary.main' }} />
                                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>工数(人月)</Typography>
                                        </Box>
                                        <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>{manMonths}</Typography>
                                    </Stack>
                                </Box>
                            </Box>
                        </Box>

                        {/* 固定された下部ボタンエリア */}
                        <Box sx={{ borderTop: 1, borderColor: 'divider', p: 3, bgcolor: 'white' }}>
                            {/* 工数計算実行ボタン */}
                            <Button variant="contained" onClick={onExecuteCalculation} sx={{ width: '100%', bgcolor: '#12a830ff', '&:hover': { bgcolor: '#137f19ff' } }}>工数計算を実行</Button>
                        </Box>
                    </Box>

                    {/* 右メインエリア - 画面情報入力 */}
                    <Box sx={{ flex: 1, p: 2, overflow: 'hidden', bgcolor: '#fafafa' }}>
                        {/* テーブルタブと操作ボタン */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                            <Tabs value={tableTabValue} onChange={(_, newValue) => setTableTabValue(newValue)} sx={{ '& .MuiTab-root': { minWidth: 200 } }}>
                                <Tab label="データファンクション" />
                                <Tab label="トランザクションファンクション" />
                            </Tabs>
                            <Stack direction="row" spacing={1} sx={{ mr: 2 }}>
                                <Button variant="contained" startIcon={<AddIcon />} onClick={onAddRow} size="small" sx={{ bgcolor: '#1e88e5', '&:hover': { bgcolor: '#1565c0' } }}>行追加</Button>
                                <Button variant="contained" sx={{ bgcolor: '#e53935', '&:hover': { bgcolor: '#c62828' } }} startIcon={<DeleteIcon />} onClick={onDeleteSelected} size="small">行削除</Button>
                            </Stack>
                        </Box>

                        {/* ファンクション情報入力テーブル */}
                        <Paper elevation={1} sx={{ maxHeight: processBreakdownOpen ? 'calc(100vh - 400px)' : 'calc(100vh - 240px)', overflow: 'auto', transition: 'max-height 300ms ease-in-out' }}
                            onScroll={(e) => {
                                const target = e.target as HTMLElement;
                                if (tableTabValue === 0) {
                                    setDataTableScrollTop(target.scrollTop);
                                } else {
                                    setTransactionTableScrollTop(target.scrollTop);
                                }
                            }}
                            ref={(el) => {
                                if (el) {
                                    el.scrollTop = tableTabValue === 0 ? dataTableScrollTop : transactionTableScrollTop;
                                }
                            }}
                        >
                            {/* データファンクションテーブル */}
                            <Box sx={{ display: tableTabValue === 0 ? 'block' : 'none' }}>
                                <Table stickyHeader size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="center" sx={{ bgcolor: '#e3f2fd', fontWeight: 'bold', width: 60 }}>No</TableCell>
                                            <TableCell sx={{ bgcolor: '#e3f2fd', fontWeight: 'bold', width: 500 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <EditIcon sx={{ fontSize: 16, mr: 0.5 }} />
                                                    名称
                                                </Box>
                                            </TableCell>
                                            <TableCell sx={{ bgcolor: '#e3f2fd', fontWeight: 'bold', width: 150 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <EditIcon sx={{ fontSize: 16, mr: 0.5 }} />
                                                    更新種別
                                                </Box>
                                            </TableCell>
                                            <TableCell sx={{ bgcolor: '#e3f2fd', fontWeight: 'bold', width: 100 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <AutoAwesomeIcon sx={{ fontSize: 16, mr: 0.5 }} />
                                                    FP値
                                                </Box>
                                            </TableCell>
                                            <TableCell sx={{ bgcolor: '#e3f2fd', fontWeight: 'bold', minWidth: 300 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <EditIcon sx={{ fontSize: 16, mr: 0.5 }} />
                                                    備考
                                                </Box>
                                            </TableCell>
                                            <TableCell align="center" padding="checkbox" sx={{ bgcolor: '#e3f2fd', fontWeight: 'bold', minWidth: 80 }}>行選択</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {dataFields.map((field, index) => (
                                            <TableRow key={field.id} hover>
                                                <TableCell align="center">{index + 1}</TableCell>
                                                <TableCell>
                                                    <TextField name={`dataFunctions.${index}.name`} control={control} trigger={trigger} t={t} sx={{ '& .MuiInputBase-root': { bgcolor: 'white' } }} />
                                                </TableCell>
                                                <TableCell>
                                                    <Select value={watch(`dataFunctions.${index}.updateType`) || ''} onChange={(e) => setValue(`dataFunctions.${index}.updateType`, e.target.value)} size="small" fullWidth displayEmpty sx={{ bgcolor: 'white' }}>
                                                        <MenuItem value="">選択してください</MenuItem>
                                                        <MenuItem value="更新あり">更新あり</MenuItem>
                                                        <MenuItem value="参照のみ">参照のみ</MenuItem>
                                                    </Select>
                                                </TableCell>
                                                <TableCell>
                                                    <TextField name={`dataFunctions.${index}.fpValue`} control={control} trigger={trigger} t={t} type="number" notFullWidth disabled sx={{ '& .MuiInputBase-root': { bgcolor: '#f5f5f5', width: 80 } }} />
                                                </TableCell>
                                                <TableCell>
                                                    <TextField name={`dataFunctions.${index}.remarks`} control={control} trigger={trigger} t={t} sx={{ '& .MuiInputBase-root': { bgcolor: 'white' } }} />
                                                </TableCell>
                                                <TableCell align="center" padding="checkbox">
                                                    <Checkbox checked={watch(`dataFunctions.${index}.selected`) || false} onChange={(e) => setValue(`dataFunctions.${index}.selected`, e.target.checked)} />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Box>

                            {/* トランザクションファンクションテーブル */}
                            <Box sx={{ display: tableTabValue === 1 ? 'block' : 'none' }}>
                                <Table stickyHeader size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="center" sx={{ bgcolor: '#e3f2fd', fontWeight: 'bold', width: 60 }}>No</TableCell>
                                            <TableCell sx={{ bgcolor: '#e3f2fd', fontWeight: 'bold', width: 500 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <EditIcon sx={{ fontSize: 16, mr: 0.5 }} />
                                                    名称
                                                </Box>
                                            </TableCell>
                                            <TableCell sx={{ bgcolor: '#e3f2fd', fontWeight: 'bold', width: 100 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <EditIcon sx={{ fontSize: 16, mr: 0.5 }} />
                                                    外部入力
                                                </Box>
                                            </TableCell>
                                            <TableCell sx={{ bgcolor: '#e3f2fd', fontWeight: 'bold', width: 100 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <EditIcon sx={{ fontSize: 16, mr: 0.5 }} />
                                                    外部出力
                                                </Box>
                                            </TableCell>
                                            <TableCell sx={{ bgcolor: '#e3f2fd', fontWeight: 'bold', width: 100 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <EditIcon sx={{ fontSize: 16, mr: 0.5 }} />
                                                    外部照会
                                                </Box>
                                            </TableCell>
                                            <TableCell sx={{ bgcolor: '#e3f2fd', fontWeight: 'bold', width: 100 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <AutoAwesomeIcon sx={{ fontSize: 16, mr: 0.5 }} />
                                                    FP値
                                                </Box>
                                            </TableCell>
                                            <TableCell sx={{ bgcolor: '#e3f2fd', fontWeight: 'bold', minWidth: 300 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <EditIcon sx={{ fontSize: 16, mr: 0.5 }} />
                                                    備考
                                                </Box>
                                            </TableCell>
                                            <TableCell align="center" padding="checkbox" sx={{ bgcolor: '#e3f2fd', fontWeight: 'bold', minWidth: 80 }}>行選択</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {transactionFields.map((field, index) => (
                                            <TableRow key={field.id} hover>
                                                <TableCell align="center">{index + 1}</TableCell>
                                                <TableCell>
                                                    <TextField name={`transactionFunctions.${index}.name`} control={control} trigger={trigger} t={t} sx={{ '& .MuiInputBase-root': { bgcolor: 'white' } }} />
                                                </TableCell>
                                                <TableCell>
                                                    <TextField name={`transactionFunctions.${index}.externalInput`} control={control} trigger={trigger} t={t} type="number" notFullWidth sx={{ '& .MuiInputBase-root': { bgcolor: 'white', width: 80 } }} />
                                                </TableCell>
                                                <TableCell>
                                                    <TextField name={`transactionFunctions.${index}.externalOutput`} control={control} trigger={trigger} t={t} type="number" notFullWidth sx={{ '& .MuiInputBase-root': { bgcolor: 'white', width: 80 } }} />
                                                </TableCell>
                                                <TableCell>
                                                    <TextField name={`transactionFunctions.${index}.externalInquiry`} control={control} trigger={trigger} t={t} type="number" notFullWidth sx={{ '& .MuiInputBase-root': { bgcolor: 'white', width: 80 } }} />
                                                </TableCell>
                                                <TableCell>
                                                    <TextField name={`transactionFunctions.${index}.fpValue`} control={control} trigger={trigger} t={t} type="number" notFullWidth disabled sx={{ '& .MuiInputBase-root': { bgcolor: '#f5f5f5', width: 80 } }} />
                                                </TableCell>
                                                <TableCell>
                                                    <TextField name={`transactionFunctions.${index}.remarks`} control={control} trigger={trigger} t={t} sx={{ '& .MuiInputBase-root': { bgcolor: 'white' } }} />
                                                </TableCell>
                                                <TableCell align="center" padding="checkbox">
                                                    <Checkbox checked={watch(`transactionFunctions.${index}.selected`) || false} onChange={(e) => setValue(`transactionFunctions.${index}.selected`, e.target.checked)} />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Box>
                        </Paper>

                        {/* 工程別工数・工期テーブル */}
                        <Box sx={{ mt: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, cursor: 'pointer', bgcolor: '#f5f5f5', p: 1, borderRadius: 1 }} onClick={() => setProcessBreakdownOpen(!processBreakdownOpen)}>
                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>工程別内訳</Typography>
                                <IconButton size="small" sx={{ ml: 1 }}>
                                    {processBreakdownOpen ? <ExpandMoreIcon /> : <ExpandLessIcon />}
                                </IconButton>
                            </Box>
                            
                            <Collapse in={processBreakdownOpen} timeout={300} unmountOnExit>
                                <Paper elevation={1} sx={{ border: 1, borderColor: 'divider', overflow: 'auto' }}>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ bgcolor: '#e3f2fd', fontWeight: 'bold', borderRight: 1, borderColor: 'divider', width: 100 }}></TableCell>
                                                <TableCell align="center" sx={{ bgcolor: '#e3f2fd', fontWeight: 'bold', borderRight: 1, borderColor: 'divider' }}>基本設計</TableCell>
                                                <TableCell align="center" sx={{ bgcolor: '#e3f2fd', fontWeight: 'bold', borderRight: 1, borderColor: 'divider' }}>詳細設計</TableCell>
                                                <TableCell align="center" sx={{ bgcolor: '#e3f2fd', fontWeight: 'bold', borderRight: 1, borderColor: 'divider' }}>実装</TableCell>
                                                <TableCell align="center" sx={{ bgcolor: '#e3f2fd', fontWeight: 'bold', borderRight: 1, borderColor: 'divider' }}>結合テスト</TableCell>
                                                <TableCell align="center" sx={{ bgcolor: '#e3f2fd', fontWeight: 'bold' }}>総合テスト</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5', borderRight: 1, borderColor: 'divider' }}>比率</TableCell>
                                                <TableCell align="center" sx={{ borderRight: 1, borderColor: 'divider' }}>{processRatios.basicDesign}</TableCell>
                                                <TableCell align="center" sx={{ borderRight: 1, borderColor: 'divider' }}>{processRatios.detailedDesign}</TableCell>
                                                <TableCell align="center" sx={{ borderRight: 1, borderColor: 'divider' }}>{processRatios.implementation}</TableCell>
                                                <TableCell align="center" sx={{ borderRight: 1, borderColor: 'divider' }}>{processRatios.integrationTest}</TableCell>
                                                <TableCell align="center">{processRatios.systemTest}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5', borderRight: 1, borderColor: 'divider' }}>工数</TableCell>
                                                <TableCell align="center" sx={{ borderRight: 1, borderColor: 'divider' }}>{calculateProcessManMonths(processRatios.basicDesign)}</TableCell>
                                                <TableCell align="center" sx={{ borderRight: 1, borderColor: 'divider' }}>{calculateProcessManMonths(processRatios.detailedDesign)}</TableCell>
                                                <TableCell align="center" sx={{ borderRight: 1, borderColor: 'divider' }}>{calculateProcessManMonths(processRatios.implementation)}</TableCell>
                                                <TableCell align="center" sx={{ borderRight: 1, borderColor: 'divider' }}>{calculateProcessManMonths(processRatios.integrationTest)}</TableCell>
                                                <TableCell align="center">{calculateProcessManMonths(processRatios.systemTest)}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5', borderRight: 1, borderColor: 'divider' }}>工期</TableCell>
                                                <TableCell align="center" sx={{ borderRight: 1, borderColor: 'divider' }}>{calculateProcessDuration(processRatios.basicDesign)}</TableCell>
                                                <TableCell align="center" sx={{ borderRight: 1, borderColor: 'divider' }}>{calculateProcessDuration(processRatios.detailedDesign)}</TableCell>
                                                <TableCell align="center" sx={{ borderRight: 1, borderColor: 'divider' }}>{calculateProcessDuration(processRatios.implementation)}</TableCell>
                                                <TableCell align="center" sx={{ borderRight: 1, borderColor: 'divider' }}>{calculateProcessDuration(processRatios.integrationTest)}</TableCell>
                                                <TableCell align="center">{calculateProcessDuration(processRatios.systemTest)}</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </Paper>
                            </Collapse>
                        </Box>
                    </Box>
                </Box>
            </FormProvider>
        </Box>
    );
}

export default CalcForm;
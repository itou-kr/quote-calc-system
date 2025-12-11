import * as yup from 'yup';
import { useImportFile } from '@front/hooks/TEST/test';
import { useExportFile } from '@front/hooks/TEST/test';
import { ViewIdType } from '@front/stores/TEST/test/testStore/index';
import { useMemo, useState, useCallback } from 'react';
import { FormProvider, useForm, useFieldArray, Controller } from 'react-hook-form';
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
        productivityFPPerMonth: yup
            .number()
            .min(1, '1以上の値を入力してください')
            .test('decimal-places', '小数点第二位までの値を入力してください', (value) => {
                if (value === undefined || value === null) return true;
                const decimalPart = value.toString().split('.')[1];
                return !decimalPart || decimalPart.length <= 2;
            })
            .required('生産性を入力してください'),
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

    // パフォーマンス改善: watch呼び出しを最小限に
    const autoProductivity = watch('autoProductivity') ?? false;
    
    const [tableTabValue, setTableTabValue] = useState(0);
    const [processBreakdownOpen, setProcessBreakdownOpen] = useState(false);
    const [dataTableScrollTop, setDataTableScrollTop] = useState(0);
    const [transactionTableScrollTop, setTransactionTableScrollTop] = useState(0);
    const [totalFP, setTotalFP] = useState(0);
    const [manMonths, setManMonths] = useState(0);
    const [standardDuration, setStandardDuration] = useState(0);
    const [selectedCount, setSelectedCount] = useState(0);

    // パフォーマンス改善: スクロールイベントハンドラーをメモ化
    const handleScroll = useCallback((e: React.UIEvent<HTMLElement>) => {
        const target = e.target as HTMLElement;
        if (tableTabValue === 0) {
            setDataTableScrollTop(target.scrollTop);
        } else {
            setTransactionTableScrollTop(target.scrollTop);
        }
    }, [tableTabValue]);

    /** ▼ 選択数を更新 */
    const updateSelectedCount = useCallback(() => {
        if (tableTabValue === 0) {
            const values = getValues('dataFunctions');
            const count = values?.filter(item => item.selected).length || 0;
            setSelectedCount(count);
        } else {
            const values = getValues('transactionFunctions');
            const count = values?.filter(item => item.selected).length || 0;
            setSelectedCount(count);
        }
    }, [tableTabValue, getValues]);

    // 工程別の比率（デフォルト値）
    const processRatios = {
        basicDesign: 0.157,
        detailedDesign: 0.189,
        implementation: 0.354,
        integrationTest: 0.164,
        systemTest: 0.136,
    };

    /** ▼ FP合計を計算 */
    const calculateTotalFP = useCallback(() => {
        const dataFunctions = getValues('dataFunctions') || [];
        const transactionFunctions = getValues('transactionFunctions') || [];
        const dataTotal = dataFunctions.reduce((sum, item) => sum + (Number(item.fpValue) || 0), 0);
        const transactionTotal = transactionFunctions.reduce((sum, item) => sum + (Number(item.fpValue) || 0), 0);
        return dataTotal + transactionTotal;
    }, [getValues]);

    /** ▼ 総FPに基づいて生産性を計算 */
    const calculateProductivity = useCallback((totalFP: number) => {
        if (totalFP < 400) {
            return 10.5;
        } else if (totalFP < 1000) {
            return 13.1;
        } else if (totalFP < 3000) {
            return 9.0;
        } else {
            return 8.4;
        }
    }, []);

    /** ▼ 総工数を計算 */
    const calculateManMonths = useCallback(() => {
        const totalFP = calculateTotalFP();
        const productivityFPPerMonth = getValues('productivityFPPerMonth') || 0;
        if (productivityFPPerMonth > 0) {
            // 小数点第三位を切り上げ(第二位まで表示)
            return Math.ceil((totalFP / productivityFPPerMonth) * 100) / 100;
        }
        return 0;
    }, [calculateTotalFP, getValues]);

    /** ▼ 標準工期を計算 */
    const calculateStandardDuration = useCallback(() => {
        const totalManMonths = calculateManMonths();
        // 標準工期 = 2.64 × 総工数^(1/3)
        return Math.round(2.64 * Math.pow(totalManMonths, 1/3) * 100) / 100;
    }, [calculateManMonths]);

    /** ▼ 工程別の工数を計算 */
    const calculateProcessManMonths = useCallback((ratio: number, isLast: boolean = false) => {
        const totalManMonths = calculateManMonths();
        
        if (isLast) {
            // 実装（比率が最大の工程）は、総工数から他の工程の合計を引いた値にする
            const basicDesign = Math.round(processRatios.basicDesign * totalManMonths * 100) / 100;
            const detailedDesign = Math.round(processRatios.detailedDesign * totalManMonths * 100) / 100;
            const integrationTest = Math.round(processRatios.integrationTest * totalManMonths * 100) / 100;
            const systemTest = Math.round(processRatios.systemTest * totalManMonths * 100) / 100;
            const sumOthers = basicDesign + detailedDesign + integrationTest + systemTest;
            return Math.round((totalManMonths - sumOthers) * 100) / 100;
        }
        
        // 通常の工程は四捨五入
        return Math.round(ratio * totalManMonths * 100) / 100;
    }, [calculateManMonths]);

    /** ▼ 工程別の工期を計算 */
    const calculateProcessDuration = useCallback((ratio: number, isLast: boolean = false) => {
        const standardDuration = calculateStandardDuration();
        
        if (isLast) {
            // 実装（比率が最大の工程）は、標準工期から他の工程の合計を引いた値にする
            const basicDesign = Math.round(processRatios.basicDesign * standardDuration * 100) / 100;
            const detailedDesign = Math.round(processRatios.detailedDesign * standardDuration * 100) / 100;
            const integrationTest = Math.round(processRatios.integrationTest * standardDuration * 100) / 100;
            const systemTest = Math.round(processRatios.systemTest * standardDuration * 100) / 100;
            const sumOthers = basicDesign + detailedDesign + integrationTest + systemTest;
            return Math.round((standardDuration - sumOthers) * 100) / 100;
        }
        
        // 通常の工程は四捨五入
        return Math.round(ratio * standardDuration * 100) / 100;
    }, [calculateStandardDuration]);

    /** ▼ 工数計算実行（バリデーショントリガー） */
    const onExecuteCalculation = () => {
        // データファンクションのFP値を計算
        const currentDataFunctions = getValues('dataFunctions');
        if (currentDataFunctions) {
            currentDataFunctions.forEach((item, index) => {
                // 名称に文字列が入っている場合のみ計算
                if (item.name && item.name.trim() !== '') {
                    if (item.updateType === '更新あり') {
                        setValue(`dataFunctions.${index}.fpValue`, 7);
                    } else if (item.updateType === '参照のみ') {
                        setValue(`dataFunctions.${index}.fpValue`, 5);
                    }
                }
            });
        }

        // トランザクションファンクションのFP値を計算
        const currentTransactionFunctions = getValues('transactionFunctions');
        if (currentTransactionFunctions) {
            currentTransactionFunctions.forEach((item, index) => {
                // 名称に文字列が入っている場合のみ計算
                if (item.name && item.name.trim() !== '') {
                    const externalInput = Number(item.externalInput) || 0;
                    const externalOutput = Number(item.externalOutput) || 0;
                    const externalInquiry = Number(item.externalInquiry) || 0;
                    
                    // FP値 = 外部入力*4 + 外部出力*5 + 外部照会*4
                    const fpValue = externalInput * 4 + externalOutput * 5 + externalInquiry * 4;
                    setValue(`transactionFunctions.${index}.fpValue`, fpValue);
                }
            });
        }

        // 計算結果を更新
        const newTotalFP = calculateTotalFP();
        setTotalFP(newTotalFP);
        
        // 自動入力ONの場合は生産性を自動計算
        if (autoProductivity) {
            const newProductivity = calculateProductivity(newTotalFP);
            setValue('productivityFPPerMonth', newProductivity);
            // input要素に直接値を設定して小数点第一位まで表示
            setTimeout(() => {
                const input = document.querySelector('input[name="productivityFPPerMonth"]') as HTMLInputElement;
                if (input) {
                    input.value = newProductivity.toFixed(1);
                }
            }, 0);
        }
        
        const newManMonths = calculateManMonths();
        setManMonths(newManMonths);
        
        const newStandardDuration = calculateStandardDuration();
        setStandardDuration(newStandardDuration);

        // フォームのバリデーションを実行
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
        // 削除後は選択数を0にリセット
        setSelectedCount(0);
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
                                    slotProps={{ 
                                        htmlInput: { 
                                            min: 1.0,
                                            step: 0.1,
                                            onKeyDown: (e: React.KeyboardEvent) => { 
                                                if (e.key === '-' || e.key === 'e' || e.key === '+') {
                                                    e.preventDefault();
                                                }
                                            },
                                            onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
                                                const value = parseFloat(e.target.value);
                                                if (!isNaN(value)) {
                                                    // 小数点第一位まで丸めて表示（0でも省略しない）
                                                    const formatted = Math.round(value * 10) / 10;
                                                    setValue('productivityFPPerMonth', parseFloat(formatted.toFixed(1)));
                                                    // 表示を更新するためにinput要素の値も設定
                                                    e.target.value = formatted.toFixed(1);
                                                }
                                            }
                                        } 
                                    }}
                                    sx={{ '& .MuiInputBase-root': { bgcolor: autoProductivity ? '#f5f5f5' : 'white' } }}
                                />
                            </Box>

                            {/* 案件種別 */}
                            <Box sx={{ mb: 2.5 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.8 }}>
                                    <EditIcon sx={{ fontSize: 16, mr: 0.5 }} />
                                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>案件種別(未対応)</Typography>
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
                                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>使用するIPA代表値(未対応)</Typography>
                                </Box>
                                <Select value={watch('ipaValueType') || '中央値'} onChange={(e) => setValue('ipaValueType', e.target.value)} size="small" fullWidth sx={{ bgcolor: 'white' }}>
                                    <MenuItem value="中央値">中央値</MenuItem>
                                    <MenuItem value="平均値">平均値</MenuItem>
                                </Select>
                            </Box>

                            <Divider sx={{ my: 3 }} />

                            {/* インポート / エクスポート */}
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1.5 }}>インポート / エクスポート(未対応)</Typography>
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

                                <Box sx={{ mb: 1, p: 1.5, bgcolor: '#f5f5f5', borderRadius: 1, border: 1, borderColor: '#e0e0e0' }}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <AutoAwesomeIcon sx={{ fontSize: 18, mr: 0.8, color: 'primary.main' }} />
                                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>工数(人月)</Typography>
                                        </Box>
                                        <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>{manMonths}</Typography>
                                    </Stack>
                                </Box>

                                <Box sx={{ p: 1.5, bgcolor: '#f5f5f5', borderRadius: 1, border: 1, borderColor: '#e0e0e0' }}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <AutoAwesomeIcon sx={{ fontSize: 18, mr: 0.8, color: 'primary.main' }} />
                                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>標準工期(月)</Typography>
                                        </Box>
                                        <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>{standardDuration}</Typography>
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
                            <Tabs value={tableTabValue} onChange={(_, newValue) => { setTableTabValue(newValue); setTimeout(() => updateSelectedCount(), 0); }} sx={{ '& .MuiTab-root': { minWidth: 200 } }}>
                                <Tab label="データファンクション" />
                                <Tab label="トランザクションファンクション" />
                            </Tabs>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mr: 2 }}>
                                <Button 
                                    variant="outlined" 
                                    startIcon={<AddIcon />} 
                                    onClick={onAddRow} 
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
                                    行追加
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
                            </Stack>
                        </Box>

                        {/* ファンクション情報入力テーブル */}
                        <Paper elevation={1} sx={{ maxHeight: processBreakdownOpen ? 'calc(100vh - 400px)' : 'calc(100vh - 240px)', overflow: 'auto', transition: 'max-height 300ms ease-in-out' }}
                            onScroll={handleScroll}
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
                                                    FP
                                                </Box>
                                            </TableCell>
                                            <TableCell sx={{ bgcolor: '#e3f2fd', fontWeight: 'bold', minWidth: 300 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <EditIcon sx={{ fontSize: 16, mr: 0.5 }} />
                                                    備考
                                                </Box>
                                            </TableCell>
                                            <TableCell align="center" padding="checkbox" sx={{ bgcolor: '#e3f2fd', fontWeight: 'bold', minWidth: 80 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <DeleteIcon sx={{ fontSize: 16, mr: 0.5, color: '#e53935' }} />
                                                    削除
                                                </Box>
                                            </TableCell>
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
                                                    <Controller
                                                        name={`dataFunctions.${index}.updateType`}
                                                        control={control}
                                                        render={({ field }) => (
                                                            <Select {...field} size="small" fullWidth displayEmpty sx={{ bgcolor: 'white' }}>
                                                                <MenuItem value="">選択してください</MenuItem>
                                                                <MenuItem value="更新あり">更新あり</MenuItem>
                                                                <MenuItem value="参照のみ">参照のみ</MenuItem>
                                                            </Select>
                                                        )}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <TextField name={`dataFunctions.${index}.fpValue`} control={control} trigger={trigger} t={t} type="number" notFullWidth disabled sx={{ '& .MuiInputBase-root': { bgcolor: '#f5f5f5', width: 80 } }} />
                                                </TableCell>
                                                <TableCell>
                                                    <TextField name={`dataFunctions.${index}.remarks`} control={control} trigger={trigger} t={t} sx={{ '& .MuiInputBase-root': { bgcolor: 'white' } }} />
                                                </TableCell>
                                                <TableCell align="center" padding="checkbox">
                                                    <Controller
                                                        name={`dataFunctions.${index}.selected`}
                                                        control={control}
                                                        render={({ field }) => (
                                                            <Checkbox {...field} checked={field.value || false} onChange={(e) => { field.onChange(e); setTimeout(() => updateSelectedCount(), 0); }} />
                                                        )}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {/* 行追加ボタン行 */}
                                        <TableRow>
                                            <TableCell colSpan={6} align="center" sx={{ py: 2, bgcolor: '#fafafa', borderTop: 2, borderColor: '#e0e0e0' }}>
                                                <Button 
                                                    variant="outlined" 
                                                    startIcon={<AddIcon />} 
                                                    onClick={onAddRow} 
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
                                            </TableCell>
                                        </TableRow>
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
                                                    FP
                                                </Box>
                                            </TableCell>
                                            <TableCell sx={{ bgcolor: '#e3f2fd', fontWeight: 'bold', minWidth: 300 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <EditIcon sx={{ fontSize: 16, mr: 0.5 }} />
                                                    備考
                                                </Box>
                                            </TableCell>
                                            <TableCell align="center" padding="checkbox" sx={{ bgcolor: '#e3f2fd', fontWeight: 'bold', minWidth: 80 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <DeleteIcon sx={{ fontSize: 16, mr: 0.5, color: '#e53935' }} />
                                                    削除
                                                </Box>
                                            </TableCell>
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
                                                    <TextField name={`transactionFunctions.${index}.externalInput`} control={control} trigger={trigger} t={t} type="number" notFullWidth slotProps={{ htmlInput: { min: 0, onKeyDown: (e: React.KeyboardEvent) => { if (e.key === '-' || e.key === 'e' || e.key === '+') e.preventDefault(); } } }} sx={{ '& .MuiInputBase-root': { bgcolor: 'white', width: 80 } }} />
                                                </TableCell>
                                                <TableCell>
                                                    <TextField name={`transactionFunctions.${index}.externalOutput`} control={control} trigger={trigger} t={t} type="number" notFullWidth slotProps={{ htmlInput: { min: 0, onKeyDown: (e: React.KeyboardEvent) => { if (e.key === '-' || e.key === 'e' || e.key === '+') e.preventDefault(); } } }} sx={{ '& .MuiInputBase-root': { bgcolor: 'white', width: 80 } }} />
                                                </TableCell>
                                                <TableCell>
                                                    <TextField name={`transactionFunctions.${index}.externalInquiry`} control={control} trigger={trigger} t={t} type="number" notFullWidth slotProps={{ htmlInput: { min: 0, onKeyDown: (e: React.KeyboardEvent) => { if (e.key === '-' || e.key === 'e' || e.key === '+') e.preventDefault(); } } }} sx={{ '& .MuiInputBase-root': { bgcolor: 'white', width: 80 } }} />
                                                </TableCell>
                                                <TableCell>
                                                    <TextField name={`transactionFunctions.${index}.fpValue`} control={control} trigger={trigger} t={t} type="number" notFullWidth disabled sx={{ '& .MuiInputBase-root': { bgcolor: '#f5f5f5', width: 80 } }} />
                                                </TableCell>
                                                <TableCell>
                                                    <TextField name={`transactionFunctions.${index}.remarks`} control={control} trigger={trigger} t={t} sx={{ '& .MuiInputBase-root': { bgcolor: 'white' } }} />
                                                </TableCell>
                                                <TableCell align="center" padding="checkbox">
                                                    <Controller
                                                        name={`transactionFunctions.${index}.selected`}
                                                        control={control}
                                                        render={({ field }) => (
                                                            <Checkbox {...field} checked={field.value || false} onChange={(e) => { field.onChange(e); setTimeout(() => updateSelectedCount(), 0); }} />
                                                        )}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {/* 行追加ボタン行 */}
                                        <TableRow>
                                            <TableCell colSpan={8} align="center" sx={{ py: 2, bgcolor: '#fafafa', borderTop: 2, borderColor: '#e0e0e0' }}>
                                                <Button 
                                                    variant="outlined" 
                                                    startIcon={<AddIcon />} 
                                                    onClick={onAddRow} 
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
                                            </TableCell>
                                        </TableRow>
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
                                                <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5', borderRight: 1, borderColor: 'divider' }}>工数(人月)</TableCell>
                                                <TableCell align="center" sx={{ borderRight: 1, borderColor: 'divider' }}>{calculateProcessManMonths(processRatios.basicDesign, false)}</TableCell>
                                                <TableCell align="center" sx={{ borderRight: 1, borderColor: 'divider' }}>{calculateProcessManMonths(processRatios.detailedDesign, false)}</TableCell>
                                                <TableCell align="center" sx={{ borderRight: 1, borderColor: 'divider' }}>{calculateProcessManMonths(processRatios.implementation, true)}</TableCell>
                                                <TableCell align="center" sx={{ borderRight: 1, borderColor: 'divider' }}>{calculateProcessManMonths(processRatios.integrationTest, false)}</TableCell>
                                                <TableCell align="center">{calculateProcessManMonths(processRatios.systemTest, false)}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5', borderRight: 1, borderColor: 'divider' }}>工期(月)</TableCell>
                                                <TableCell align="center" sx={{ borderRight: 1, borderColor: 'divider' }}>{calculateProcessDuration(processRatios.basicDesign, false)}</TableCell>
                                                <TableCell align="center" sx={{ borderRight: 1, borderColor: 'divider' }}>{calculateProcessDuration(processRatios.detailedDesign, false)}</TableCell>
                                                <TableCell align="center" sx={{ borderRight: 1, borderColor: 'divider' }}>{calculateProcessDuration(processRatios.implementation, true)}</TableCell>
                                                <TableCell align="center" sx={{ borderRight: 1, borderColor: 'divider' }}>{calculateProcessDuration(processRatios.integrationTest, false)}</TableCell>
                                                <TableCell align="center">{calculateProcessDuration(processRatios.systemTest, false)}</TableCell>
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
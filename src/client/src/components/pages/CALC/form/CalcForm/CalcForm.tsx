import * as yup from 'yup';
import { useImportFile } from '@front/hooks/TEST/test';
import { useExportExcel } from '@front/hooks/CALC';
import { ViewIdType } from '@front/stores/TEST/test/testStore/index';
import { useMemo, useState, useCallback } from 'react';
import { FormProvider, useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Stack, Paper, Divider, Select, MenuItem } from '@mui/material';
import SummarizeIcon from '@mui/icons-material/Summarize';
import EditIcon from '@mui/icons-material/Edit';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ImportButton from '@front/components/ui/Button/ImportButton';
import ExportButton from '@front/components/ui/Button/ExportButton';
import Button from '@front/components/ui/Button';
import TextField from '@front/components/ui/TextField';
import SummaryCard from '@front/components/ui/SummaryCard';
import FormSection from '@front/components/ui/FormSection';
import ProductivityField from '@front/components/ui/ProductivityField';
import TableToolbar from '@front/components/ui/TableToolbar';
import ProcessBreakdownTable from '@front/components/ui/ProcessBreakdownTable';
import FunctionTable, { ColumnDefinition } from '@front/components/ui/FunctionTable';
import FlexBox from '@front/components/ui/FlexBox';
import TabPanel from '@front/components/ui/TabPanel';
import Text from '@front/components/ui/Text';
import { createEmptyDataFunction, createEmptyTransactionFunction, createDataFunctions, createTransactionFunctions } from '@front/types/functionTypes';
import { createAddRowAction, createDeleteSelectedAction } from '@front/components/ui/TableToolbar/actions/tableActions';
import { t } from 'i18next';

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
    const { exportToExcel } = useExportExcel();

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
            dataFunctions: createDataFunctions(50),
            transactionFunctions: createTransactionFunctions(50),
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

    const [tableTabValue, setTableTabValue] = useState(0);
    const [processBreakdownOpen, setProcessBreakdownOpen] = useState(false);
    const [dataSelectedCount, setDataSelectedCount] = useState(0);
    const [transactionSelectedCount, setTransactionSelectedCount] = useState(0);
    const [totalFP, setTotalFP] = useState(0);
    const [manMonths, setManMonths] = useState(0);
    const [standardDuration, setStandardDuration] = useState(0);

    // データファンクションテーブルのカラム定義
    const dataColumns: ColumnDefinition[] = useMemo(() => [
        { key: 'name', label: '名称', width: 500, icon: 'edit', type: 'text' },
        { key: 'updateType', label: 'データファンクションの種類', width: 300, icon: 'edit', type: 'select', options: [
            { value: '内部論理ファイル', label: '内部論理ファイル' },
            { value: '外部インタフェースファイル', label: '外部インタフェースファイル' }
        ]},
        { key: 'fpValue', label: 'FP', width: 100, icon: 'auto', type: 'number', disabled: true },
        { key: 'remarks', label: '備考', minWidth: 300, icon: 'edit', type: 'text' },
        { key: 'selected', label: '削除', minWidth: 80, align: 'center' as const, type: 'checkbox' },
    ], []);

    // トランザクションファンクションテーブルのカラム定義
    const transactionColumns: ColumnDefinition[] = useMemo(() => [
        { key: 'name', label: '名称', width: 500, icon: 'edit', type: 'text' },
        { key: 'externalInput', label: '外部入力', width: 100, icon: 'edit', type: 'number' },
        { key: 'externalOutput', label: '外部出力', width: 100, icon: 'edit', type: 'number' },
        { key: 'externalInquiry', label: '外部照会', width: 100, icon: 'edit', type: 'number' },
        { key: 'fpValue', label: 'FP', width: 100, icon: 'auto', type: 'number', disabled: true },
        { key: 'remarks', label: '備考', minWidth: 300, icon: 'edit', type: 'text' },
        { key: 'selected', label: '削除', minWidth: 80, align: 'center' as const, type: 'checkbox' },
    ], []);

    // 工程別の比率（デフォルト値）- メモ化
    const processRatios = useMemo(() => ({
        basicDesign: 0.157,
        detailedDesign: 0.189,
        implementation: 0.354,
        integrationTest: 0.164,
        systemTest: 0.136,
    }), []);

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
    }, [calculateManMonths, processRatios]);

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
    }, [calculateStandardDuration, processRatios]);

    /** ▼ 工数計算実行（バリデーショントリガー） */
    const onExecuteCalculation = () => {
        // データファンクションのFP値を計算
        const currentDataFunctions = getValues('dataFunctions');
        if (currentDataFunctions) {
            currentDataFunctions.forEach((item, index) => {
                // 名称に文字列が入っている場合のみ計算
                if (item.name && item.name.trim() !== '') {
                    if (item.updateType === '内部論理ファイル') {
                        setValue(`dataFunctions.${index}.fpValue`, 7);
                    } else if (item.updateType === '外部インタフェースファイル') {
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
        const autoProductivity = getValues('autoProductivity');
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

    /** ▼ データファンクション行追加 */
    const onAddDataRow = useCallback(() => {
        appendData(createEmptyDataFunction());
    }, [appendData]);

    /** ▼ トランザクションファンクション行追加 */
    const onAddTransactionRow = useCallback(() => {
        appendTransaction(createEmptyTransactionFunction());
    }, [appendTransaction]);

    /** ▼ データファンクション選択削除 */
    const onDeleteDataSelected = useCallback(() => {
        const values = getValues('dataFunctions');
        if (!values) return;
        const indicesToRemove = values
            .map((item, index) => (item.selected ? index : -1))
            .filter(index => index !== -1)
            .reverse();
        indicesToRemove.forEach(index => removeData(index));
        setDataSelectedCount(0);
    }, [getValues, removeData]);

    /** ▼ トランザクションファンクション選択削除 */
    const onDeleteTransactionSelected = useCallback(() => {
        const values = getValues('transactionFunctions');
        if (!values) return;
        const indicesToRemove = values
            .map((item, index) => (item.selected ? index : -1))
            .filter(index => index !== -1)
            .reverse();
        indicesToRemove.forEach(index => removeTransaction(index));
        setTransactionSelectedCount(0);
    }, [getValues, removeTransaction]);

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
        try {
            const data = methods.getValues();
            
            // 案件名のバリデーション
            if (!data.projectName || data.projectName.trim() === '') {
                console.error('案件名を入力してください');
                alert('案件名を入力してください');
                return;
            }

            // 工程別内訳データの準備（工数計算実行後のみ）
            let processBreakdown = undefined;
            if (processBreakdownOpen && manMonths > 0) {
                processBreakdown = {
                    basicDesign: {
                        manMonths: calculateProcessManMonths(processRatios.basicDesign),
                        duration: calculateProcessDuration(processRatios.basicDesign)
                    },
                    detailedDesign: {
                        manMonths: calculateProcessManMonths(processRatios.detailedDesign),
                        duration: calculateProcessDuration(processRatios.detailedDesign)
                    },
                    implementation: {
                        manMonths: calculateProcessManMonths(processRatios.implementation, true),
                        duration: calculateProcessDuration(processRatios.implementation, true)
                    },
                    integrationTest: {
                        manMonths: calculateProcessManMonths(processRatios.integrationTest),
                        duration: calculateProcessDuration(processRatios.integrationTest)
                    },
                    systemTest: {
                        manMonths: calculateProcessManMonths(processRatios.systemTest),
                        duration: calculateProcessDuration(processRatios.systemTest)
                    }
                };
            }

            await exportToExcel(data, totalFP, manMonths, standardDuration, processBreakdown);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Excelファイルの生成中にエラーが発生しました';
            console.error('Export error:', error);
            alert(errorMessage);
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <FormProvider {...methods}>
                {/* ヘッダー */}
                <Paper elevation={0} sx={{ bgcolor: '#1976d2', color: 'white', p: 2, borderRadius: 0 }}>
                    <FlexBox gap={1}>
                        <SummarizeIcon sx={{ fontSize: 32 }} />
                        <Text variant="pageTitle">見積作成支援ツール</Text>
                    </FlexBox>
                </Paper>

                {/* メインコンテンツエリア */}
                <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                    {/* 左サイドバー - 案件情報 */}
                    <Box sx={{ width: 360, borderRight: 1, borderColor: 'divider', display: 'flex', flexDirection: 'column', bgcolor: 'white' }}>
                        {/* スクロール可能な上部エリア */}
                        <Box sx={{ flex: 1, p: 3, overflowY: 'auto' }}>
                            <FlexBox justify="space-between" sx={{ mb: 3 }}>
                                <Text variant="sectionTitle">案件情報</Text>
                                <FlexBox gap={1.5}>
                                    <FlexBox>
                                        <EditIcon sx={{ fontSize: 16, mr: 0.3, color: 'text.secondary' }} />
                                        <Text variant="label">入力欄</Text>
                                    </FlexBox>
                                    <FlexBox>
                                        <AutoAwesomeIcon sx={{ fontSize: 16, mr: 0.3, color: 'text.secondary' }} />
                                        <Text variant="label">自動計算欄</Text>
                                    </FlexBox>
                                </FlexBox>
                            </FlexBox>

                            {/* 案件名 */}
                            <FormSection label="案件名" required>
                                <TextField name="projectName" control={control} trigger={trigger} t={t} hideHelperText sx={{ '& .MuiInputBase-root': { bgcolor: 'white' } }} />
                            </FormSection>

                            {/* 生産性 */}
                            <ProductivityField control={control} trigger={trigger} setValue={setValue} t={t} />

                            {/* 案件種別 */}
                            <FormSection label="案件種別(未対応)">
                                <Select value={watch('projectType') || '新規開発'} onChange={(e) => setValue('projectType', e.target.value)} fullWidth size="small" sx={{ bgcolor: 'white' }}>
                                    <MenuItem value="新規開発">新規開発</MenuItem>
                                    <MenuItem value="改良開発">改良開発</MenuItem>
                                    <MenuItem value="再開発">再開発</MenuItem>
                                </Select>
                            </FormSection>

                            {/* 使用するIPA代表値 */}
                            <FormSection label="使用するIPA代表値(未対応)" mb={3}>
                                <Select value={watch('ipaValueType') || '中央値'} onChange={(e) => setValue('ipaValueType', e.target.value)} size="small" fullWidth sx={{ bgcolor: 'white' }}>
                                    <MenuItem value="中央値">中央値</MenuItem>
                                    <MenuItem value="平均値">平均値</MenuItem>
                                </Select>
                            </FormSection>

                            <Divider sx={{ my: 3 }} />

                            {/* インポート / エクスポート */}
                            <Box sx={{ mb: 3 }}>
                                <Text variant="subsectionTitle">インポート / エクスポート(未対応)</Text>
                                <Stack direction="row" spacing={1}>
                                    <ImportButton onFileSelect={onImportButtonClick} onClick={() => {}} size="small" sx={{ bgcolor: '#42a5f5', '&:hover': { bgcolor: '#2196f3' }, flex: 1 }}>インポート</ImportButton>
                                    <ExportButton onClick={onExportButtonClick} size="small" sx={{ bgcolor: '#42a5f5', '&:hover': { bgcolor: '#2196f3' }, flex: 1 }} />
                                </Stack>
                            </Box>

                            <Divider sx={{ my: 3 }} />

                            {/* 計算結果サマリー */}
                            <Box>
                                <Text variant="subsectionTitle">計算結果サマリー</Text>
                                <SummaryCard label="総FP" value={totalFP} />
                                <SummaryCard label="工数(人月)" value={manMonths} />
                                <SummaryCard label="標準工期(月)" value={standardDuration} />
                            </Box>
                        </Box>

                        {/* 固定された下部ボタンエリア */}
                        <Box sx={{ borderTop: 1, borderColor: 'divider', p: 3, bgcolor: 'white' }}>
                            {/* 工数計算実行ボタン */}
                            <Button variant="contained" onClick={onExecuteCalculation} sx={{ width: '100%', bgcolor: '#00d02aff', '&:hover': { bgcolor: '#00a708ff' } }}>工数計算を実行</Button>
                        </Box>
                    </Box>

                    {/* 右メインエリア - 画面情報入力 */}
                    <Box sx={{ flex: 1, pt: 2, px: 2, pb: 0, overflow: 'hidden', bgcolor: '#fafafa', display: 'flex', flexDirection: 'column' }}>
                        {/* テーブルタブと操作ボタン */}
                        <TableToolbar
                            tabs={[
                                { label: 'データファンクション' },
                                { label: 'トランザクションファンクション' }
                            ]}
                            activeTab={tableTabValue}
                            onTabChange={setTableTabValue}
                            actions={
                                tableTabValue === 0
                                    ? [
                                        createAddRowAction(onAddDataRow),
                                        createDeleteSelectedAction(onDeleteDataSelected, dataSelectedCount)
                                    ]
                                    : [
                                        createAddRowAction(onAddTransactionRow),
                                        createDeleteSelectedAction(onDeleteTransactionSelected, transactionSelectedCount)
                                    ]
                            }
                        />

                        {/* ファンクション情報入力テーブル */}
                        <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                            <TabPanel value={tableTabValue} index={0}>
                                <FunctionTable
                                    fields={dataFields}
                                    columns={dataColumns}
                                    baseName="dataFunctions"
                                    control={control}
                                    trigger={trigger}
                                    t={t}
                                    onRowAdd={onAddDataRow}
                                    onDeleteSelected={onDeleteDataSelected}
                                    selectedCount={dataSelectedCount}
                                    onSelectedCountChange={setDataSelectedCount}
                                    maxHeight="100%"
                                />
                            </TabPanel>
                            <TabPanel value={tableTabValue} index={1}>
                                <FunctionTable
                                    fields={transactionFields}
                                    columns={transactionColumns}
                                    baseName="transactionFunctions"
                                    control={control}
                                    trigger={trigger}
                                    t={t}
                                    onRowAdd={onAddTransactionRow}
                                    onDeleteSelected={onDeleteTransactionSelected}
                                    selectedCount={transactionSelectedCount}
                                    onSelectedCountChange={setTransactionSelectedCount}
                                    maxHeight="100%"
                                />
                            </TabPanel>
                        </Box>

                        {/* 工程別工数・工期テーブル */}
                        <ProcessBreakdownTable
                            processRatios={processRatios}
                            calculateProcessManMonths={calculateProcessManMonths}
                            calculateProcessDuration={calculateProcessDuration}
                            isOpen={processBreakdownOpen}
                            onToggle={useCallback(() => setProcessBreakdownOpen(prev => !prev), [])}
                        />
                    </Box>
                </Box>
            </FormProvider>
        </Box>
    );
}

export default CalcForm;
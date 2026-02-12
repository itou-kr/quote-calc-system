import * as yup from 'yup';
import { useCalcTest } from '@front/hooks/TEST/test';
import { useImportFile, useExportFile } from '@front/hooks/CALC/calc';
import { ViewIdType } from '@front/stores/TEST/test/testStore/index';
// import { useMemo, useState, useCallback, useEffect } from 'react';
import { useMemo, useState, useCallback } from 'react';
import { FormProvider, useForm, useFieldArray } from 'react-hook-form';
// import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Stack, Paper, Select, MenuItem, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ImportButton from '@front/components/ui/Button/ImportButton';
import ExportButton from '@front/components/ui/Button/ExportButton';
import Button from '@front/components/ui/Button';
import TextField from '@front/components/ui/TextField';
import SummaryCard2 from '@front/components/ui/SummaryCard2';
import FormSection from '@front/components/ui/FormSection';
import ProductivityField from '@front/components/ui/ProductivityField';
import ProcessRatiosField from '@front/components/ui/ProcessRatiosField';
import TableToolbar from '@front/components/ui/TableToolbar';
import CalculationResultsPanel from '@front/components/ui/CalculationResultsPanel';
import ProcessBreakdownTable, { ProcessRatios } from '@front/components/ui/ProcessBreakdownTable';
import FunctionTable, { ColumnDefinition } from '@front/components/ui/FunctionTable';
import FlexBox from '@front/components/ui/FlexBox';
import TabPanel from '@front/components/ui/TabPanel';
import Text from '@front/components/ui/Text';
import { createEmptyDataFunction, createEmptyTransactionFunction, createDataFunctions, createTransactionFunctions } from '@front/types/functionTypes';
import { createAddRowAction, createDeleteSelectedAction } from '@front/components/ui/TableToolbar/actions/tableActions';
import { t } from 'i18next';
import { getProcessRatios } from '@common/constants/processRatios';
// import { useSetDirty } from '@front/hooks/TEST/test';
// import FormPaperProvider from '@front/components/ui/Layout/Form/FormPaperProvider';
import { FieldErrors } from 'react-hook-form';
import { useSetAlertMessage } from '@front/hooks/alertMessage/useSetAlertMessage';



const setupYupScheme = () => {
    return yup.object({
        /** 案件情報 */
        // 案件名
        projectName: yup.string().label('案件名').required(),
        // 生産性自動入力チェック
        autoProductivity: yup.boolean(),
        // 生産性(FP/月)
        productivityFPPerMonth: yup.number().rangeCheck(1, 9999),
        // 開発工程比率自動入力チェック
        autoProcessRatios: yup.boolean(),
        // 案件種別
        projectType: yup.string(),
        // 使用するIPA代表値
        ipaValueType: yup.string(),
        // 総FP
        totalFP: yup.number(),
        // 総工数(人月)
        totalManMonths: yup.number(),
        // 標準工期(月)
        standardDurationMonths: yup.number(),

        // データファンクション情報
        dataFunctions: yup.array().of(
            yup.object({
                selected: yup.boolean(),
                name: yup.string(),
                updateType: yup.string(),
                fpValue: yup.number().rangeCheck(0, 9999),
                remarks: yup.string(),
            })
        ),
        // トランザクションファンクション情報
        transactionFunctions: yup.array().of(
            yup.object({
                selected: yup.boolean(),
                name: yup.string(),
                externalInput: yup.number().transform((value, originalValue) => originalValue === "" ? undefined : value).rangeCheck(0, 9999),      // 入力欄が空の場合はundefinedに変換
                externalOutput: yup.number().transform((value, originalValue) => originalValue === "" ? undefined : value).rangeCheck(0, 9999),     // 入力欄が空の場合はundefinedに変換
                externalInquiry: yup.number().transform((value, originalValue) => originalValue === "" ? undefined : value).rangeCheck(0, 9999),    // 入力欄が空の場合はundefinedに変換
                fpValue: yup.number().rangeCheck(0, 9999),
                remarks: yup.string(),
            })
        ),

        // 工程別比率
        processRatios: yup.object({
            basicDesign: yup.number().label('基本設計比率').rangeCheck(0.000, 1.000),
            detailedDesign: yup.number().label('詳細設計比率').rangeCheck(0.000, 1.000),
            implementation: yup.number().label('製造比率').rangeCheck(0.000, 1.000),
            integrationTest: yup.number().label('統合テスト比率').rangeCheck(0.000, 1.000),
            systemTest: yup.number().label('システムテスト比率').rangeCheck(0.000, 1.000),
        }),
        // 工程別FP
        processFPs: yup.object({
            basicDesign: yup.number().rangeCheck(0, 9999).required(),
            detailedDesign: yup.number().rangeCheck(0, 9999).required(),
            implementation: yup.number().rangeCheck(0, 9999).required(),
            integrationTest: yup.number().rangeCheck(0, 9999).required(),
            systemTest: yup.number().rangeCheck(0, 9999).required(),
        }),
        // 工程別工数
        processManMonths: yup.object({
            basicDesign: yup.number().rangeCheck(0, 9999).required(),
            detailedDesign: yup.number().rangeCheck(0, 9999).required(),
            implementation: yup.number().rangeCheck(0, 9999).required(),
            integrationTest: yup.number().rangeCheck(0, 9999).required(),
            systemTest: yup.number().rangeCheck(0, 9999).required(),
        }),
        // 工程別工期
        processDurations: yup.object({
            basicDesign: yup.number().rangeCheck(0, 9999).required(),
            detailedDesign: yup.number().rangeCheck(0, 9999).required(),
            implementation: yup.number().rangeCheck(0, 9999).required(),
            integrationTest: yup.number().rangeCheck(0, 9999).required(),
            systemTest: yup.number().rangeCheck(0, 9999).required(),
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
    const calc = useCalcTest(viewId as ViewIdType);
    const importFile = useImportFile();
    const exportFile = useExportFile();
    const setAlertMessage = useSetAlertMessage('TEST');
    // const setDirty = useSetDirty();
    const methods = useForm<FormType>({
        mode: 'onSubmit',
        reValidateMode: 'onSubmit',
        resolver: yupResolver(schema),
        defaultValues: {
            projectName: '',
            autoProductivity: true,
            autoProcessRatios: true,
            productivityFPPerMonth: 10,
            projectType: '新規開発',
            ipaValueType: '中央値',
            totalFP: 0,
            totalManMonths: 0,
            standardDurationMonths: 0,
            dataFunctions: createDataFunctions(50),
            transactionFunctions: createTransactionFunctions(50),
            processRatios: getProcessRatios('新規開発', '中央値'),
            processFPs: {
                basicDesign: 0,
                detailedDesign: 0,
                implementation: 0,
                integrationTest: 0,
                systemTest: 0,
            },
            processManMonths: {
                basicDesign: 0,
                detailedDesign: 0,
                implementation: 0,  
                integrationTest: 0,
                systemTest: 0,
            },
            processDurations: {
                basicDesign: 0,
                detailedDesign: 0,
                implementation: 0,
                integrationTest: 0,
                systemTest: 0,
            },
            ...props.data,
        },
    });
    // const { control, trigger, watch, setValue, getValues, handleSubmit, clearErrors, formState: { isDirty: formIsDirty },
    const { control, trigger, watch, setValue, getValues, handleSubmit, clearErrors,
 } = methods;
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
    // 工程別内訳表に表示する比率（計算ボタン押下時のみ更新）
    const [displayedProcessRatios, setDisplayedProcessRatios] = useState<ProcessRatios>({
        basicDesign: 0,
        detailedDesign: 0,
        implementation: 0,
        integrationTest: 0,
        systemTest: 0,
    });

    // データファンクションテーブルのカラム定義
    const dataColumns: ColumnDefinition[] = useMemo(() => [
        { key: 'name', label: '名称', minWidth: 200, maxWidth: 400, icon: 'edit', type: 'text', maxLength: 50 },
        { key: 'updateType', label: 'データファンクションの種類', width: 360, icon: 'edit', type: 'select', options: [
            { value: '内部論理ファイル', label: '内部論理ファイル' },
            { value: '外部インタフェースファイル', label: '外部インタフェースファイル' }
        ]},
        { key: 'fpValue', label: 'FP', minWidth: 80, maxWidth: 100, icon: 'auto', type: 'number', disabled: true },
        { key: 'remarks', label: '備考', minWidth: 200, maxWidth: 300, icon: 'edit', type: 'text' , maxLength: 200},
        { key: 'selected', label: '削除', minWidth: 80, align: 'center' as const, type: 'checkbox' },
    ], []);

    // トランザクションファンクションテーブルのカラム定義
    const transactionColumns: ColumnDefinition[] = useMemo(() => [
        { key: 'name', label: '名称', minWidth: 200, maxWidth: 400, icon: 'edit', type: 'text', maxLength: 50 },
        { key: 'externalInput', label: '外部入力', width: 120, icon: 'edit', type: 'number', min: 0, max: 9999 },
        { key: 'externalOutput', label: '外部出力', width: 120, icon: 'edit', type: 'number', min: 0, max: 9999 },
        { key: 'externalInquiry', label: '外部照会', width: 120, icon: 'edit', type: 'number', min: 0, max: 9999 },
        { key: 'fpValue', label: 'FP', minWidth: 80, maxWidth: 100, icon: 'auto', type: 'number', disabled: true },
        { key: 'remarks', label: '備考', minWidth: 200, maxWidth: 300, icon: 'edit', type: 'text', maxLength: 200 },
        { key: 'selected', label: '削除', minWidth: 80, align: 'center' as const, type: 'checkbox' },
    ], []);

    // /** ▼ 工数計算実行（バリデーショントリガー） */
    const handleCalcClick = async (onValid: FormType) => {
        const result = await calc(onValid, methods.setError);

        if(!result) return;

        methods.reset({
            ...onValid,
            ...result,
        });
        
        // 工程別内訳表に表示する比率を更新
        if (result.processRatios) {
            setDisplayedProcessRatios({
                basicDesign: result.processRatios.basicDesign ?? 0,
                detailedDesign: result.processRatios.detailedDesign ?? 0,
                implementation: result.processRatios.implementation ?? 0,
                integrationTest: result.processRatios.integrationTest ?? 0,
                systemTest: result.processRatios.systemTest ?? 0,
            });
        }
        
        // 工程別比率の表を自動で表示
        setProcessBreakdownOpen(true);
    };

    const totalFP = watch('totalFP');
    const manMonths = watch('totalManMonths');
    const standardDuration = watch('standardDurationMonths');
    const processFPs = watch('processFPs');
    const processManMonths = watch('processManMonths');
    const processDurations = watch('processDurations');

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
        try {
            const json = await importFile(file);
            methods.reset(json);
        } catch (e) {
            console.error(e);
        }
    };

    /** ▼ エクスポート処理 */
    const onExportButtonClick = async () => {
        const latestValues = getValues();
        await exportFile(latestValues);
    };

    /** ▼ バリデーションエラー時処理 */
    const handleInvalid = (errors: FieldErrors<FormType>) => {
        const messages = flattenErrors(errors);
        setAlertMessage({
            severity: 'error',
            message: messages.join('\n')
        });

        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const flattenErrors = (errors: any): string[] => {
        return Object.values(errors).flatMap((error: any) => {
            if (error?.message) return [error.message];
            if (typeof error === 'object') return flattenErrors(error);
            return [];
        });
    };

    // useEffect(() => {
    //     setDirty(formIsDirty);
    // }, [setDirty, formIsDirty]);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
            {/* <FormProvider {...methods} blockNavigation={methods.formState.isDirty}> */}
            <FormProvider {...methods}>
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

                            {/* インポート / エクスポート */}
                            <Box sx={{ mb: 3 }}>
                                <Text variant="subsectionTitle">インポート / エクスポート</Text>
                                <Stack direction="row" spacing={1}>
                                    <ImportButton onFileSelect={onImportButtonClick} onClick={() => {}} size="small" sx={{ bgcolor: '#42a5f5', '&:hover': { bgcolor: '#2196f3' }, flex: 1 }}>インポート</ImportButton>
                                    <ExportButton onClick={handleSubmit(onExportButtonClick)} size="small" sx={{ bgcolor: '#42a5f5', '&:hover': { bgcolor: '#2196f3' }, flex: 1 }} />
                                </Stack>
                            </Box>

                            {/* 案件名 */}
                            <FormSection label="案件名" required>
                                <TextField name="projectName" control={control} trigger={trigger} t={t} hideHelperText sx={{ '& .MuiInputBase-root': { bgcolor: 'white' } }} maxLength={100}/>
                            </FormSection>

                            {/* 生産性 */}
                            <ProductivityField control={control} trigger={trigger} setValue={setValue} watch={watch} clearErrors={clearErrors} t={t} />

                            {/* 案件種別 */}
                            <FormSection label="案件種別">
                                <Select value={watch('projectType') || '新規開発'} onChange={(e) => setValue('projectType', e.target.value)} fullWidth size="small" sx={{ bgcolor: 'white' }}>
                                    <MenuItem value="新規開発">新規開発</MenuItem>
                                    <MenuItem value="改良開発">改良開発</MenuItem>
                                    <MenuItem value="再開発">再開発</MenuItem>
                                </Select>
                            </FormSection>

                            {/* 使用するIPA代表値 */}
                            <FormSection label="使用するIPA代表値" mb={3}>
                                <Select value={watch('ipaValueType') || '中央値'} onChange={(e) => setValue('ipaValueType', e.target.value)} size="small" fullWidth sx={{ bgcolor: 'white' }}>
                                    <MenuItem value="中央値">中央値</MenuItem>
                                    <MenuItem value="平均値">平均値</MenuItem>
                                </Select>
                            </FormSection>

                            {/* 開発工程比率入力 */}
                            <ProcessRatiosField
                                control={control}
                                trigger={trigger}
                                setValue={setValue}
                                watch={watch}
                                clearErrors={clearErrors}
                                t={t}
                            />
                        </Box>

                        {/* 固定された下部ボタンエリア */}
                        <Box sx={{ borderTop: 1, borderColor: 'divider', p: 2, bgcolor: 'white' }}>
                            {/* 工数計算実行ボタン */}
                            <Button variant="contained" onClick={methods.handleSubmit(handleCalcClick, handleInvalid)} sx={{ width: '100%', bgcolor: '#00d02aff', '&:hover': { bgcolor: '#00a708ff' } }}>工数計算を実行</Button>
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

                        {/* 計算結果 */}
                        <CalculationResultsPanel
                            isOpen={processBreakdownOpen}
                            onToggle={useCallback(() => setProcessBreakdownOpen(prev => !prev), [])}
                            summaryContent={
                                <Paper elevation={0} sx={{ p: 2, bgcolor: 'white' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, pl: 0 }}>
                                        <AutoAwesomeIcon sx={{ fontSize: 18, mr: 0.5, color: 'text.secondary' }} />
                                        <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '0.95rem' }}>サマリー</Typography>
                                    </Box>
                                    <SummaryCard2 label="FP" value={totalFP} colorVariant="periwinkle" />
                                    <SummaryCard2 label="工数(人月)" value={manMonths} colorVariant="green" />
                                    <SummaryCard2 label="標準工期(月)" value={standardDuration} colorVariant="orange" />
                                </Paper>
                            }
                        >
                            <ProcessBreakdownTable
                                processRatios={displayedProcessRatios}
                                processFPs={processFPs}
                                processManMonths={processManMonths}
                                processDurations={processDurations}
                            />
                        </CalculationResultsPanel>
                    </Box>
                </Box>
            </FormProvider>
        </Box>
    );
}

export default CalcForm;
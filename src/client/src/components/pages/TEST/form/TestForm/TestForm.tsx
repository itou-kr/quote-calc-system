import * as yup from 'yup';
import { useFormState } from "react-hook-form";
import { useCalcTest } from '@front/hooks/TEST/test';
import { useImportFile, useExportFile } from '@front/hooks/TEST/test';
import { viewId, ViewIdType } from '@front/stores/TEST/test/testStore/index';
// import { useMemo, useState, useCallback, useEffect } from 'react';
import { useMemo, useState, useCallback, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
// import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// import { Box, Stack, Paper, Select, MenuItem, Typography } from '@mui/material';
import { Box, Stack, Paper, Typography } from '@mui/material';
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
// import { createEmptyDataFunction, createEmptyTransactionFunction, createDataFunctions, createTransactionFunctions } from '@front/types/functionTypes';
import { createTransactionFunctions, DataFunction, TransactionFunction } from '@front/types/functionTypes';
// import { createAddRowAction, createDeleteSelectedAction } from '@front/components/ui/TableToolbar/actions/tableActions';
import { t } from 'i18next';
// import { getProcessRatios } from '@common/constants/processRatios';
// import { useSetDirty } from '@front/hooks/TEST/test';
// import FormPaperProvider from '@front/components/ui/Layout/Form/FormPaperProvider';
import { FieldErrors } from 'react-hook-form';
import { useSetAlertMessage } from '@front/hooks/alertMessage/useSetAlertMessage';
import FormContainerProvider from '@front/components/ui/Layout/Form/FormContainerProvider';
import { useClear as useClearAlertMessage } from '@front/hooks/alertMessage';
import UseProjectTypeField from '@front/components/ui/AutocompleteField/Master/UseProjectTypeField';
import UseIpaValueTypeField from '@front/components/ui/AutocompleteField/Master/UseIpaValueTypeField';
import UseUpdateTypeField from '@front/components/ui/AutocompleteField/Master/UseUpdateTypeField';
// import { on } from 'events';
// import { ipaValueType, projectType, dataFunctionType } from '@front/consts';
import type { ExportApplicationRequest, ExportApplicationRequestProjectTypeEnum, ExportApplicationRequestIpaValueTypeEnum, ExportApplicationRequestDataFunctionsInner } from '@front/openapi/models';

import type {
    CalcTestApplicationRequest,
    CalcTestApplicationRequestProjectTypeEnum,
    CalcTestApplicationRequestIpaValueTypeEnum,
    DataFunctionUpdateType,
} from '@front/openapi/models';
import { useConfirm } from '@front/hooks/ui/confirm';
import { createEmptyDataFunction, createEmptyTransactionFunction } from '@front/types/functionTypes';
import AddRowButton from '@front/components/ui/Button/AddRowButton/AddRowButton';
import DeleteRowButton from '@front/components/ui/Button/DeleteRowButton/DeleteRowButton';

const setupYupScheme = () => {
    return yup.object({
        /** 案件情報 */
        // 案件名
        projectName: yup.string().label('案件名').required(),
        // 生産性自動計算フラグ
        autoProductivity: yup.boolean(),
        // 生産性(FP/月)
        productivityFPPerMonth: yup.number().rangeCheck(1, 9999),
        // 案件種別
        projectType: yup.object({ label: yup.string(), value: yup.string() }).default(undefined).label('案件種別').required(),
        // 使用するIPA代表値
        ipaValueType: yup.object({ label: yup.string(), value: yup.string() }).default(undefined).label('使用するIPA代表値').required(),
        // 開発工程比率自動入力フラグ
        autoProcessRatios: yup.boolean(),
        // データファンクション情報
        dataFunctions: yup.array().of(
            yup.object({
                selected: yup.boolean().label('データファンクションテーブルの削除有無'),
                name: yup.string().label('データファンクションテーブルの名称'),
                updateType: yup.object({ label: yup.string(), value: yup.string() }).default(undefined).label('データファンクションの種類').nullable(),
                fpValue: yup.number().rangeCheck(0, 9999).label('データファンクションテーブルのFP値'),
                remarks: yup.string().label('データファンクションテーブルの備考'),
            }).dataPairCheck(),
        ),
        // トランザクションファンクション情報
        transactionFunctions: yup.array().of(
            yup.object({
                selected: yup.boolean().label('トランザクションファンクションテーブルの削除有無'),
                name: yup
                    .string()
                    .label('トランザクションファンクションテーブルの名称'),
                externalInput: yup
                    .number()
                    .transform((value, originalValue) => originalValue === "" ? undefined : value)
                    .rangeCheck(0, 9999)
                    .label('外部入力'),
                externalOutput: yup
                    .number()
                    .transform((value, originalValue) => originalValue === "" ? undefined : value)
                    .rangeCheck(0, 9999)
                    .label('外部出力'),
                externalInquiry: yup
                    .number()
                    .transform((value, originalValue) => originalValue === "" ? undefined : value)
                    .rangeCheck(0, 9999)
                    .label('外部照会'),
                fpValue: yup.number().rangeCheck(0, 9999).label('トランザクションファンクションテーブルのFP値'),
                remarks: yup.string().label('トランザクションファンクションテーブルの備考'),
            }).transactionPairCheck(),
        ),

        // 総FP
        totalFP: yup.number(),
        // 総工数(人月)
        totalManMonths: yup.number(),
        // 標準工期(月)
        standardDurationMonths: yup.number(),
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
            basicDesign: yup.number().rangeCheck(0, 9999),
            detailedDesign: yup.number().rangeCheck(0, 9999),
            implementation: yup.number().rangeCheck(0, 9999),
            integrationTest: yup.number().rangeCheck(0, 9999),
            systemTest: yup.number().rangeCheck(0, 9999),
        })
        .optional(),
        // 工程別工数
        processManMonths: yup.object({
            basicDesign: yup.number().rangeCheck(0, 9999),
            detailedDesign: yup.number().rangeCheck(0, 9999),
            implementation: yup.number().rangeCheck(0, 9999),
            integrationTest: yup.number().rangeCheck(0, 9999),
            systemTest: yup.number().rangeCheck(0, 9999),
        })
        .optional(),
        // 工程別工期
        processDurations: yup.object({
            basicDesign: yup.number().rangeCheck(0, 9999),
            detailedDesign: yup.number().rangeCheck(0, 9999),
            implementation: yup.number().rangeCheck(0, 9999),
            integrationTest: yup.number().rangeCheck(0, 9999),
            systemTest: yup.number().rangeCheck(0, 9999),
        })
        .optional(),
    });
};

export type FormType = yup.InferType<ReturnType<typeof setupYupScheme>>;

// type Props<T extends FieldValues = FieldValues, N extends FieldArrayPath<T> = FieldArrayPath<T>> = {
type Props = {
    label?: React.ReactNode;
    maxLimit?: {
        limit?: number;
        label?: React.ReactNode;
        message?: string;
    }
    viewId: ViewIdType | 'TEST';
    data?: FormType;
    isDirty: boolean;
    // DataFunction: DataFunction;
    // TransactionFunction: TransactionFunction;
    // empty: NonNullable<FieldArray<T, N>>;
};

function CalcForm(props: Props) {
    // const { maxLimit, name, control } = props;
    const { maxLimit } = props;
    
    const schema = useMemo(() => setupYupScheme(), []);
    const calc = useCalcTest(viewId as ViewIdType);
    const importFile = useImportFile();
    const exportFile = useExportFile();
    const setAlertMessage = useSetAlertMessage('TEST');
    const clearAlertMessage = useClearAlertMessage(viewId);
    const confirm = useConfirm();

    console.log('props.data?.dataFunctions length:',
    props.data?.dataFunctions?.length
    );
    console.log('updateType', props.data?.dataFunctions?.[0]?.updateType);
        // const setDirty = useSetDirty();
    const methods = useForm<FormType>({
        mode: 'onSubmit',
        reValidateMode: 'onSubmit',
        resolver: yupResolver(schema, {
            abortEarly: false,
        }),
        defaultValues: {
            projectName: '',
            autoProductivity: true,
            autoProcessRatios: true,
            productivityFPPerMonth: 10,
            projectType: { label: '新規開発', value: 'N' },
            ipaValueType: { label: '中央値', value: 'M' },
            totalFP: 0,
            totalManMonths: 0,
            standardDurationMonths: 0,
            // dataFunctions: createDataFunctions(50),
            transactionFunctions: createTransactionFunctions(50),
            // processRatios: getProcessRatios(projectType, ipaValueType),
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
            // ...props.data,
        },
    });
    const { control, trigger, watch, setValue, getValues, handleSubmit, clearErrors
    } = methods;
    const { fields: dataFields, append: appendData, remove: removeData } = useFieldArray({
        control,
        name: 'dataFunctions',
    });
    const { fields: transactionFields, append: appendTransaction, remove: removeTransaction } = useFieldArray({
        control,
        name: 'transactionFunctions',
    });
    const { errors } = useFormState({
    control: methods.control
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
    const { reset } = methods;

    useEffect(() => {
    if (props.data) {
        reset({
        ...methods.getValues(),
        ...props.data,
        });
    }
    }, [props.data, reset]);

    // データファンクションテーブルのカラム定義
    const dataColumns: ColumnDefinition<DataFunction>[] = useMemo(() => [
        { key: 'name', label: '名称', minWidth: 200, maxWidth: 400, icon: 'edit', type: 'text', maxLength: 50 },
        {
            key: 'updateType',
            label: 'データファンクションの種類',
            width: 360,
            icon: 'edit',
            render: (index: number) => (
                <UseUpdateTypeField name={`dataFunctions.${index}.updateType`} t={t}/>
            )
        },
        { key: 'fpValue', label: 'FP', minWidth: 80, maxWidth: 100, icon: 'auto', type: 'number', disabled: true },
        { key: 'remarks', label: '備考', minWidth: 200, maxWidth: 300, icon: 'edit', type: 'text' , maxLength: 200},
        { key: 'selected', label: '削除', minWidth: 80, align: 'center' as const, type: 'checkbox' },
    ], []);

    // トランザクションファンクションテーブルのカラム定義
    const transactionColumns: ColumnDefinition<TransactionFunction>[] = useMemo(() => [
        { key: 'name', label: '名称', minWidth: 200, maxWidth: 400, icon: 'edit', type: 'text', maxLength: 50 },
        { key: 'externalInput', label: '外部入力', width: 120, icon: 'edit', type: 'number', min: 0, max: 9999 },
        { key: 'externalOutput', label: '外部出力', width: 120, icon: 'edit', type: 'number', min: 0, max: 9999 },
        { key: 'externalInquiry', label: '外部照会', width: 120, icon: 'edit', type: 'number', min: 0, max: 9999 },
        { key: 'fpValue', label: 'FP', minWidth: 80, maxWidth: 100, icon: 'auto', type: 'number', disabled: true },
        { key: 'remarks', label: '備考', minWidth: 200, maxWidth: 300, icon: 'edit', type: 'text', maxLength: 200 },
        { key: 'selected', label: '削除', minWidth: 80, align: 'center' as const, type: 'checkbox' },
    ], []);

const transactionFieldErrors: Record<number, Record<string, boolean>> = {};

transactionFields.forEach((_, index) => {
    const rowError = errors.transactionFunctions?.[index];

    if (!rowError) return;

    transactionFieldErrors[index] = {};

    if (rowError.externalInput) {
        transactionFieldErrors[index].externalInput = true;
        transactionFieldErrors[index].externalOutput = true;
        transactionFieldErrors[index].externalInquiry = true;
    }

    if (rowError.name) {
        transactionFieldErrors[index].name = true;
    }
}); 
    /** ▼ 工数計算実行（バリデーショントリガー） */
    const handleCalcClick = async (onValid: FormType) => {
        // サーバエラーメッセージをリセット
        clearAlertMessage();

        const data: CalcTestApplicationRequest = {
            ...onValid,
            projectType: onValid.projectType?.value as CalcTestApplicationRequestProjectTypeEnum,
            ipaValueType: onValid.ipaValueType?.value as CalcTestApplicationRequestIpaValueTypeEnum,
            dataFunctions: onValid.dataFunctions?.map(df => ({
                selected: df.selected,
                name: df.name,
                updateType: df.updateType?.value as DataFunctionUpdateType,
                fpValue: df.fpValue,
                remarks: df.remarks,
            })) || [],
        };

        const result = await calc(data, methods.setError);

        if(!result) return;

        
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

    // let { fields, append, remove, update } = useFieldArray({ control, name: 'dataFunctions' });

    /** ▼ データファンクション行追加 */
    const handleAddDataRow = async () => {
        if(!maxLimit?.limit || dataFields.length < maxLimit.limit) {
            appendData(createEmptyDataFunction());
        } else {
            if (maxLimit.message) {
                await confirm({ message: "200行までしか追加できません", yes: true, close: true });
            }
        }
    };

    
    /** ▼ トランザクションファンクション行追加 */
    const handleAddTransactionRow = async () => {
        if(!maxLimit?.limit || transactionFields.length < maxLimit.limit) {
            appendTransaction(createEmptyTransactionFunction());
        } else {
            if (maxLimit.message) {
                await confirm({ message: "200行までしか追加できません", yes: true, close: true });
            }
        }
    };
    
    /** ▼ データファンクション選択削除 */
    const handleDeleteDataRow = useCallback(() => {
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
    const handleDeleteTransactionRow = useCallback(() => {
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

    const request: ExportApplicationRequest = {
        ...latestValues,
        projectType: latestValues.projectType?.value as ExportApplicationRequestProjectTypeEnum,
        ipaValueType: latestValues.ipaValueType?.value as ExportApplicationRequestIpaValueTypeEnum,
        dataFunctions: latestValues.dataFunctions?.map(df => ({
            selected: df.selected,
            name: df.name,
            updateType: df.updateType?.value as ExportApplicationRequestDataFunctionsInner['updateType'],
            fpValue: df.fpValue,
            remarks: df.remarks,
        })) || [],
    };

    await exportFile(request);
    };
    /** ▼ バリデーションエラー時処理 */
    const handleInvalid = (errors: FieldErrors<FormType>) => {
        clearAlertMessage();
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

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
            <FormContainerProvider blockNavigation={methods.formState.isDirty} {...methods}>
                {/* <FormProvider {...methods}> */}
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
                                    <ExportButton onClick={onExportButtonClick} size="small" sx={{ bgcolor: '#42a5f5', '&:hover': { bgcolor: '#2196f3' }, flex: 1 }} />
                                </Stack>
                            </Box>

                            {/* 案件名 */}
                            <FormSection label="案件名" required>
                                <TextField name="projectName" control={control} trigger={trigger} t={t} hideHelperText sx={{ '& .MuiInputBase-root': { bgcolor: 'white' } }} maxLength={100}/>
                            </FormSection>

                            {/* 生産性 */}
                            <ProductivityField control={control} trigger={trigger} setValue={setValue} watch={watch} clearErrors={clearErrors} t={t} />

                            {/* 案件種別 */}
                            <FormSection label="案件種別" required>
                                <UseProjectTypeField name="projectType" t={t}/>
                            </FormSection>

                            {/* 使用するIPA代表値 */}
                            <FormSection label="使用するIPA代表値" required>
                                <UseIpaValueTypeField name="ipaValueType" t={t}/>
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
                            actions={[
                                {
                                    component: (
                                        <AddRowButton
                                            onClick={() => {
                                                if (tableTabValue === 0) handleAddDataRow();
                                                else handleAddTransactionRow();
                                            }}
                                        />
                                    )
                                },
                                {
                                    component: (
                                        <DeleteRowButton
                                            onClick={() => {
                                                if (tableTabValue === 0) handleDeleteDataRow();
                                                else handleDeleteTransactionRow();
                                            }}
                                        />
                                    )
                                }
                            ]}
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
                                    handleAddDataRow={handleAddDataRow}
                                    handleDeleteDataRow={handleDeleteDataRow}
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
                                    handleAddDataRow={handleAddTransactionRow}
                                    handleDeleteDataRow={handleDeleteTransactionRow}
                                    selectedCount={transactionSelectedCount}
                                    onSelectedCountChange={setTransactionSelectedCount}
                                    maxHeight="100%"
                                    fieldErrors={transactionFieldErrors}
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
                {/* </FormPaperProvider> */}
            </FormContainerProvider>
        </Box>
    );
}

export default CalcForm;
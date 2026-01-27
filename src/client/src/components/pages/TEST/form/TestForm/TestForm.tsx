import * as yup from 'yup';
import { useCalcTest, useExportFile, useImportFile } from '@front/hooks/TEST/test';
// import { useFunctionValidation } from '@front/hooks/useFunctionValidation';
import { ViewIdType } from '@front/stores/TEST/test/testStore/index';
import { useMemo, useState, useCallback, useEffect } from 'react';
import { FormProvider, useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Stack, Divider, Select, MenuItem } from '@mui/material';
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
        /** 案件情報 */
        // 案件名
        projectName: yup.string().required('案件名を入力してください'),
        // 生産性自動入力チェック
        autoProductivity: yup.boolean(),
        // 生産性(FP/月)
        productivityFPPerMonth: yup
            .number()
            .rangeCheck(1, 9999)
            .test('min-when-manual', '0.1以上の値を入力してください', function(value) {
                const autoProductivity = this.parent.autoProductivity;
                // 自動入力がOFFの場合のみminチェック
                if (autoProductivity === false && value !== undefined && value !== null) {
                    return value >= 0.1;
                }
                return true;
            })
            .test('decimal-places', '小数点第二位までの値を入力してください', (value) => {
                if (value === undefined || value === null) return true;
                const decimalPart = value.toString().split('.')[1];
                return !decimalPart || decimalPart.length <= 2;
            })
            .test('required-when-manual', '生産性を入力してください', function(value) {
                const autoProductivity = this.parent.autoProductivity;
                // 自動入力がOFFの場合のみ必須チェック
                if (autoProductivity === false) {
                    return value !== undefined && value !== null;
                }
                return true;
            }),
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
        processRatios: yup
        .object({
            basicDesign: yup.number().min(0).max(1).required(),
            detailedDesign: yup.number().min(0).max(1).required(),
            implementation: yup.number().min(0).max(1).required(),
            integrationTest: yup.number().min(0).max(1).required(),
            systemTest: yup.number().min(0).max(1).required(),
        }),
        // .optional(),

        // 工程別工数
        processManMonths: yup
        .object({
            basicDesign: yup.number().min(0).required(),
            detailedDesign: yup.number().min(0).required(),
            implementation: yup.number().min(0).required(),
            integrationTest: yup.number().min(0).required(),
            systemTest: yup.number().min(0).required(),
        }),
        // .optional(),

        // 工程別工期
        processDurations: yup
        .object({
            basicDesign: yup.number().min(0).required(),
            detailedDesign: yup.number().min(0).required(),
            implementation: yup.number().min(0).required(),
            integrationTest: yup.number().min(0).required(),
            systemTest: yup.number().min(0).required(),
        }),
        // .optional(),
    });
};

export type FormType = yup.InferType<ReturnType<typeof setupYupScheme>>;

type Props = {
    viewId: ViewIdType | 'TESt';
    data?: FormType;
    isDirty: boolean;
};

function TestForm(props: Props) {
    const { viewId } = props;

    const schema = useMemo(() => setupYupScheme(), []);

    const calc = useCalcTest(viewId as ViewIdType);
    const importFile = useImportFile();
    const exportFile = useExportFile();

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
            totalFP: 0,
            totalManMonths: 0,
            standardDurationMonths: 0,
            dataFunctions: createDataFunctions(50),
            transactionFunctions: createTransactionFunctions(50),
            processRatios: {
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
            ...(props.data ?? {}), 
        },
    });

    const { control, trigger, watch, setValue, getValues, handleSubmit } = methods;
    
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
    const [dataFunctionErrors] = useState<Record<number, { name: boolean; updateType: boolean }>>({});
    const [transactionFunctionErrors] = useState<Record<number, { name: boolean; externalInput: boolean; externalOutput: boolean; externalInquiry: boolean }>>({});

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

    // /** ▼ 工数計算実行（バリデーショントリガー） */
    const handleCalcClick = async (onValid: FormType) => {
        const result = await calc(onValid, methods.setError);
        console.log('result', result)

        if(!result) return;

        methods.reset({
            ...onValid,
            ...result,
        });
        console.log('onValid', onValid)
    }; 

    const totalFP = methods.watch('totalFP');
    const manMonths = methods.watch('totalManMonths');
    const projectType = methods.watch('projectType');
    const ipaValueType = methods.watch('ipaValueType');
    const standardDuration = methods.watch('standardDurationMonths');
    const processManMonths = methods.getValues('processManMonths');
    const processDurations = methods.getValues('processDurations');
    const processRatios = methods.watch('processRatios');

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
        console.log(latestValues)
        await exportFile(latestValues);
    };

    // TODO：分岐を増やす＆正しい値を設定する
    useEffect(() => {
        if (!projectType || !ipaValueType) return;

        let processRatios;

        if (projectType === '新規開発' && ipaValueType === '中央値') {
            processRatios = {
                basicDesign: 0.1,
                detailedDesign: 0.2,
                implementation: 0.3,
                integrationTest: 0.4,
                systemTest: 0.5,
            };
        } else if (projectType === '新規開発' && ipaValueType === '平均値') {
            processRatios = {
                basicDesign: 0.6,
                detailedDesign: 0.7,
                implementation: 0.8,
                integrationTest: 0.9,
                systemTest: 1.0,
            };
        } else if (projectType === '改良開発') {
            processRatios = {
                basicDesign: 0.1,
                detailedDesign: 0.2,
                implementation: 0.3,
                integrationTest: 0.4,
                systemTest: 0.5,
            };
        } else {
            processRatios = {
                basicDesign: 0,
                detailedDesign: 0,
                implementation: 0,
                integrationTest: 0,
                systemTest: 0,
            };
        }

    methods.setValue('processRatios', processRatios, {
        // shouldDirty: true,
        // shouldValidate: false,
    });
}, [projectType, ipaValueType, methods]);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
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

                            {/* 案件名 */}
                            <FormSection label="案件名" required>
                                <TextField name="projectName" control={control} trigger={trigger} t={t} hideHelperText sx={{ '& .MuiInputBase-root': { bgcolor: 'white' } }} maxLength={10}/>
                            </FormSection>

                            {/* 生産性 */}
                            <ProductivityField control={control} trigger={trigger} setValue={setValue} t={t}/>

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
                                    <ExportButton onClick={handleSubmit(onExportButtonClick)} size="small" sx={{ bgcolor: '#42a5f5', '&:hover': { bgcolor: '#2196f3' }, flex: 1 }} />
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
                            <Button variant="contained" onClick={methods.handleSubmit(handleCalcClick)} sx={{ width: '100%', bgcolor: '#00d02aff', '&:hover': { bgcolor: '#00a708ff' } }}>工数計算を実行</Button>
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
                                    fieldErrors={dataFunctionErrors}
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
                                    fieldErrors={transactionFunctionErrors}
                                />
                            </TabPanel>
                        </Box>

                        {/* 工程別工数・工期テーブル */}
                        <ProcessBreakdownTable
                            processRatios={processRatios}
                            processManMonths={processManMonths}
                            processDurations={processDurations}
                            isOpen={processBreakdownOpen}
                            onToggle={useCallback(() => setProcessBreakdownOpen(prev => !prev), [])}
                        />
                    </Box>
                </Box>
            </FormProvider>
        </Box>
    );
}

export default TestForm;


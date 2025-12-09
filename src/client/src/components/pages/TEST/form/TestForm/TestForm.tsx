import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Box, Stack, Grid2 as Grid, Typography } from '@mui/material';

import { useImportFile } from '@front/hooks/TEST/test';
import { useExportFile } from '@front/hooks/TEST/test';
import { ViewIdType } from '@front/stores/TEST/test/testStore/index';
import FormPaperProvider from '@front/components/ui/Layout/Form/FormPaperProvider';
import EditIcon from '@mui/icons-material/Edit';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

// import { useTypedSelector } from '@front/stores';
import ImportButton from '@front/components/ui/Button/ImportButton';
import ExportButton from '@front/components/ui/Button/ExportButton';
// import FileUpload from '@front/components/ui/FileUpload';
import FormContent, { Record, RecordTitle, Separator } from '@front/components/ui/Layout/Form/Content';
import TextField from '@front/components/ui/TextField';
import { t } from 'i18next';
import TestTable, { Props as TestTableProps } from '@front/components/pages/TEST/table/TestTable';
import { Columns } from '@front/stores/TEST/test/testStore';
import TestCalc from '@front/components/pages/TEST/form/TestForm/TestCalc'
// import { useTypedSelector } from '@front/stores';

const setupYupScheme = () => {
  return yup.object({
    // 案件情報
    projectName: yup.string(),
    autoProductivity: yup.boolean(),
    productivityFPPerMonth: yup.number().positive('正の数を入力してください'),
    projectType: yup.string(),
    fileUpload: yup.string(),
    totalFP: yup.number(),
    manMonth: yup.number(),
    ipaValueType: yup.string(),
    
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
    processRatios: yup.array().of(
      yup.object({
        basicDesign: yup.number().min(0, '0以上の値を入力してください').max(1, '1以下の値を入力してください'),
        detailedDesign: yup.number().min(0, '0以上の値を入力してください').max(1, '1以下の値を入力してください'),
        implementation: yup.number().min(0, '0以上の値を入力してください').max(1, '1以下の値を入力してください'),
        integrationTest: yup.number().min(0, '0以上の値を入力してください').max(1, '1以下の値を入力してください'),
        systemTest: yup.number().min(0, '0以上の値を入力してください').max(1, '1以下の値を入力してください'),
      }),
    )
  });
};

const dummyData: Columns[] = [
  {
    isSelected: '1',
    rowNo: 1,
    itemName: 'テストマスタ１',
    updateType: '更新あり',
    fpValue: '0',
    note: '備考１'
  },
  {
    isSelected: '1',
    rowNo: 2,
    itemName: 'テストマスタ２',
    updateType: '参照のみ',
    fpValue: '0',
    note: '備考２'
  },
  {
    isSelected: '1',
    rowNo: 3,
    itemName: 'テストマスタ３',
    updateType: '更新あり',
    fpValue: '0',
    note: '備考３'
  },
];

export type FormType = yup.InferType<ReturnType<typeof setupYupScheme>>;

type Props = Pick<TestTableProps, 'onSelected'> & {
  viewId: ViewIdType | 'TEST';
  data?: FormType;
  isDirty: boolean;
};

function TestForm(props: Props) {
  const { viewId, onSelected, data } = props;
  console.log(data);

  const yupSchema = useMemo(() => {
    return setupYupScheme();
  }, []);

  // const { data: calcData } = useTypedSelector((state) => state.test)
  // const { loading, rowCount, data } = useTypedSelector((state) => state.test);

  const importFile = useImportFile(viewId);
  const exportFile = useExportFile(viewId);

  const methods = useForm<FormType>({
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    resolver: yupResolver(yupSchema),
    defaultValues: props.data,
  });

  const { control, trigger } = methods;

  /** ▼ インポート処理 */
  const onImportButtonClick = async (file: File) => {
    const result = await importFile(file);
    console.log('import result:', result);

    try {
      const json = JSON.parse(result.content);
      methods.reset(json); // ← フォームに値を反映させる
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
    <Grid
      container
      direction="column"
      alignItems="stretch"
      justifyContent="flex-start"
      spacing={2}
      sx={{ height: '100%' }}
    >
      <Grid size="auto">
        <Box
          sx={{
            width: 400,
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          <Box sx={{ flex: 1, overflowY: 'auto' }}>
            <FormPaperProvider {...methods}>

              {/* --- 案件情報 ----------------------------------- */}
              <Box>
                <FormContent>
                  {/* タイトル部分 */}
                  <RecordTitle colSpan={4}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>                  
                      {/* 案件情報 */}
                      <Typography sx={{ fontWeight: 'bold' }}>案件情報</Typography>
                      {/* 入力欄・自動計算欄 */}
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
                  </RecordTitle>

                  {/* 案件名 */}
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Record label="案件名" required={true}>
                      <TextField
                        name="projectName"
                        control={control}
                        trigger={trigger}
                        t={t}
                      />
                    </Record>
                    <Record label="生産性（FP/月）" required={true}>
                      <TextField
                        name="projectType"
                        control={control}
                        trigger={trigger}
                        t={t}
                      />
                    </Record>
                    <Record label="案件種別" required={false}>
                      <TextField
                        name="productivityFPPerMonth"
                        control={control}
                        trigger={trigger}
                        t={t}
                      />
                    </Record>
                    <Record label="使用するAPI代表値" required={false}>
                      <TextField
                        name="ipaValueType"
                        control={control}
                        trigger={trigger}
                        t={t}
                      />
                    </Record>
                  </Box>
                </FormContent>
              </Box>

              <Separator />

              {/* インポート・エクスポートボタン */}
              <RecordTitle colSpan={4}>
                <Typography sx={{ fontWeight: 'bold' }}>インポート / エクスポート</Typography>
              </RecordTitle>
              <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                <Box>
                  <ImportButton
                    onFileSelect={onImportButtonClick}
                    onClick={() => {}}
                  >
                    インポート
                  </ImportButton>
                </Box>
                <Box>
                  <ExportButton onClick={onExportButtonClick} />
                </Box>
              </Stack>

              <Separator />

              {/* --- 計算結果 ------------------------------------------ */}
              <FormContent>
                <RecordTitle colSpan={4}>
                  <Typography sx={{ fontWeight: 'bold' }}>計算結果サマリー</Typography>
                </RecordTitle>
                {/* 計算結果の項目はここに追加していく */}
                {/* <Record label="総FP">
                  <TextField
                    name="totalFP"
                    control={control}
                    trigger={trigger}
                    t={t}
                  />
                </Record>
                <Record label="総工数(人月)">
                  <TextField
                    name="manMonth"
                    control={control}
                    trigger={trigger}
                    t={t}
                  />
                </Record> */}
                <Box sx={{ mb: 1, p: 1.5, bgcolor: '#f5f5f5', borderRadius: 1, border: 1, borderColor: '#e0e0e0' }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <AutoAwesomeIcon sx={{ fontSize: 18, mr: 0.8, color: 'primary.main' }} />
                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>総FP</Typography>
                        </Box>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>totalFP</Typography>
                    </Stack>
                </Box>

                <Box sx={{ p: 1.5, bgcolor: '#f5f5f5', borderRadius: 1, border: 1, borderColor: '#e0e0e0' }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <AutoAwesomeIcon sx={{ fontSize: 18, mr: 0.8, color: 'primary.main' }} />
                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>工数(人月)</Typography>
                        </Box>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>manMonth</Typography>
                    </Stack>
                </Box>
              </FormContent>

            </FormPaperProvider>
          </Box>
          {/* 自動計算ボタン */}
          <Box
            sx={{
              p: 2,
              borderTop: '1px solid #ddd',
              backgroundColor: 'white',
              position: 'sticky',
              bottom: 0
            }}
          >
            <TestCalc methods={methods} />
          </Box>
        </Box>
      </Grid>
      {/* <Grid size="grow">{loading && rowCount > 0 && <TestTable rowCount={rowCount} data={data} onSelected={onSelected} />}</Grid> */}
      <Grid size="grow"><TestTable rowCount={10} data={dummyData} onSelected={onSelected} /></Grid>
    </Grid>

  );
}

export default TestForm;

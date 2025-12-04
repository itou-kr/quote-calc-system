import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Box, Stack, Grid2 as Grid, Typography } from '@mui/material';

import { useImportFile } from '@front/hooks/TEST/test';
import { useExportFile } from '@front/hooks/TEST/test';
import { ViewIdType } from '@front/stores/TEST/test/testStore/index';
import FormPaperProvider from '@front/components/ui/Layout/Form/FormPaperProvider';

// import { useTypedSelector } from '@front/stores';
import ImportButton from '@front/components/ui/Button/ImportButton';
import ExportButton from '@front/components/ui/Button/ExportButton';
import FileUpload from '@front/components/ui/FileUpload';
import FormContent, { Record, RecordTitle, Separator } from '@front/components/ui/Layout/Form/Content';
import TextField from '@front/components/ui/TextField';
import { t } from 'i18next';
import TestTable, { Props as TestTableProps } from '@front/components/pages/TEST/table/TestTable';
import { Columns } from '@front/stores/TEST/test/testStore';
import TestCalc from '@front/components/pages/TEST/form/TestForm/TestCalc'

const setupYupScheme = () => {
  return yup.object({
    projectName: yup.string(),
    productivityFPPerMonth: yup.number(),
    projectType: yup.string(),
    fileUpload: yup.mixed(),
    totalFP: yup.number(),
    manMonth: yup.number(),
    
    // テーブル項目
    isSelected: yup.string(),
    rowNo: yup.number(),
    itemName: yup.string(),
    updateType: yup.string(),
    fpValue: yup.string(),
    note: yup.string(),

    // 工程別詳細結果項目
    basicDesignRatio: yup.mixed(),
    detailedDesignRatio: yup.mixed(),
    implementationRatio: yup.mixed(),
    systemTestRatio: yup.mixed(),
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
  const { viewId, onSelected } = props;
  const yupSchema = useMemo(() => {
    return setupYupScheme();
  }, []);
  // const { loading, rowCount, data } = useTypedSelector((state) => state.test);

  const importFile = useImportFile(viewId);
  const exportFile = useExportFile(viewId);

  const methods = useForm<FormType>({
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    resolver: yupResolver(yupSchema),
    defaultValues: props.data, // ← 初期値
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
        <Box sx={{ width: 400, marginLeft: 0 }}>
          <FormPaperProvider {...methods}>
            {/* --- 案件情報フォーム ----------------------------------- */}
            <FormContent>
              <RecordTitle colSpan={4}>
                <Typography sx={{ fontWeight: 'bold' }}>案件情報</Typography>
              </RecordTitle>
              <Separator />
              <Stack direction="column" spacing={1}>
                <Record label="案件名">
                  <TextField
                    name="projectName"
                    control={control}
                    trigger={trigger}
                    t={t}
                  />
                </Record>
              </Stack>
              <Record label="生産性（FP/月）">
                <TextField
                  name="productivityFPPerMonth"
                  control={control}
                  trigger={trigger}
                  t={t}
                />
              </Record>
              <Record label="案件種別">
                <TextField
                  name="projectType"
                  control={control}
                  trigger={trigger}
                  t={t}
                />
              </Record>
              <Record label="アップロードファイル">
                <FileUpload
                  name="fileUpload"
                  control={control}
                  trigger={trigger}
                  t={t}
                />
              </Record>
            </FormContent>
            {/* --- ボタン行 ------------------------------------------ */}
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
            {/* --- 計算結果 ------------------------------------------ */}
            <FormContent>
              <RecordTitle colSpan={4}>
                <Typography sx={{ fontWeight: 'bold' }}>計算結果</Typography>
              </RecordTitle>
              <Separator />
              {/* 計算結果の項目はここに追加していく */}
              <Record label="総FP">
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
              </Record>
            </FormContent>
            {/* --- ボタン行 ------------------------------------------ */}
            <Stack>
              <Box>
                {/* <CalcButton onClick={onExportButtonClick} fullWidth/> */}
                <TestCalc methods={methods}/>
              </Box>
            </Stack>
          </FormPaperProvider>
        </Box>
      </Grid>
      {/* <Grid size="grow">{loading && rowCount > 0 && <TestTable rowCount={rowCount} data={data} onSelected={onSelected} />}</Grid> */}
      <Grid size="grow"><TestTable rowCount={dummyData.length} data={dummyData} onSelected={onSelected} /></Grid>
    </Grid>

  );
}

export default TestForm;

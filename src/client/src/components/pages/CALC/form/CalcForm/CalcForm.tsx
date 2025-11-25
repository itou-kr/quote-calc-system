import * as yup from 'yup';
import { useImportFile } from '@front/hooks/TEST/test';
import { useExportFile } from '@front/hooks/TEST/test';
import { ViewIdType } from '@front/stores/TEST/test/testStore/index';
import { useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Stack, Grid2 as Grid } from '@mui/material';

import ImportButton from '@front/components/ui/Button/ImportButton';
import ExportButton from '@front/components/ui/Button/ExportButton';
import FileUpload from '@front/components/ui/FileUpload';
import FormContent, { Record } from '@front/components/ui/Layout/Form/Content';
import TextField from '@front/components/ui/TextField';
import { t } from 'i18next';

const setupYupScheme = () => {
  return yup.object({
    projectName: yup.string(),
    productivityFPPerMonth: yup.number(),
    projectType: yup.string(),
    totalFP: yup.number(),
    fileUpload: yup.mixed(),
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
    <Grid container direction="column" spacing={2}>
      <FormProvider {...methods}>
        <FormContent>
          <Record label="案件名">
            <TextField name="projectName" control={control} trigger={trigger} t={t} />
          </Record>
          <Record label="生産性（FP/月）">
            <TextField name="productivityFPPerMonth" control={control} trigger={trigger} t={t} />
          </Record>
          <Record label="案件種別">
            <TextField name="projectType" control={control} trigger={trigger} t={t} />
          </Record>
          <Record label="アップロードファイル">
            <FileUpload name="fileUpload" control={control} trigger={trigger} t={t} />
          </Record>
        </FormContent>
        <Stack direction="row" spacing={2}>
          <Box>
            {/* ファイルを受け取れる Import ボタン */}
            <ImportButton
              onFileSelect={onImportButtonClick}
              onClick={() => {}}
            >
              インポート
            </ImportButton> 
          </Box>
          <Box>       
            {/* 計算済みフォーム内容を返す Export ボタン */}
            <ExportButton onClick={onExportButtonClick} />
          </Box>
        </Stack>
      </FormProvider>
    </Grid>
  );
}

export default CalcForm;
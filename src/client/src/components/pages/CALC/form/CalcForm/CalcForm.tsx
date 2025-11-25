import * as yup from 'yup';
import { useImportFile } from '@front/hooks/TEST/test';
import { useExportFile } from '@front/hooks/TEST/test';
import { ViewIdType } from '@front/stores/TEST/test/testStore/index';
import { useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Stack, Grid2 as Grid, Paper, Typography, Divider } from '@mui/material';

import ImportButton from '@front/components/ui/Button/ImportButton';
import ExportButton from '@front/components/ui/Button/ExportButton';
import Button from '@front/components/ui/Button';
import FileUpload from '@front/components/ui/FileUpload';
import FormContent, { Record, RecordTitle, Separator } from '@front/components/ui/Layout/Form/Content';
import TextField from '@front/components/ui/TextField';
import { t } from 'i18next';

const setupYupScheme = () => {
  return yup.object({
    // 基本情報
    projectName: yup.string().required('案件名を入力してください'),
    projectType: yup.string(),
    productivityFPPerMonth: yup.number().positive('正の数を入力してください'),
    unitPrice: yup.number().positive('正の数を入力してください'),
    
    // FP計算
    externalInputFP: yup.number().min(0, '0以上の値を入力してください'),
    externalOutputFP: yup.number().min(0, '0以上の値を入力してください'),
    externalInquiryFP: yup.number().min(0, '0以上の値を入力してください'),
    internalLogicalFileFP: yup.number().min(0, '0以上の値を入力してください'),
    externalInterfaceFileFP: yup.number().min(0, '0以上の値を入力してください'),
    totalFP: yup.number(),
    
    // 工数・費用計算
    developmentMonths: yup.number().min(0, '0以上の値を入力してください'),
    totalCost: yup.number(),
    
    // その他
    remarks: yup.string(),
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
  const { control, trigger, watch, setValue } = methods;

  // フォームの値を監視
  const externalInputFP = watch('externalInputFP') || 0;
  const externalOutputFP = watch('externalOutputFP') || 0;
  const externalInquiryFP = watch('externalInquiryFP') || 0;
  const internalLogicalFileFP = watch('internalLogicalFileFP') || 0;
  const externalInterfaceFileFP = watch('externalInterfaceFileFP') || 0;
  const productivityFPPerMonth = watch('productivityFPPerMonth') || 0;
  const unitPrice = watch('unitPrice') || 0;

  /** ▼ FP合計を計算 */
  const calculateTotalFP = () => {
    const total = 
      (Number(externalInputFP) || 0) + 
      (Number(externalOutputFP) || 0) + 
      (Number(externalInquiryFP) || 0) + 
      (Number(internalLogicalFileFP) || 0) + 
      (Number(externalInterfaceFileFP) || 0);
    setValue('totalFP', total);
    return total;
  };

  /** ▼ 開発月数を計算 */
  const calculateDevelopmentMonths = (totalFP: number) => {
    if (productivityFPPerMonth > 0) {
      const months = totalFP / productivityFPPerMonth;
      setValue('developmentMonths', Math.round(months * 100) / 100);
      return months;
    }
    setValue('developmentMonths', 0);
    return 0;
  };

  /** ▼ 総費用を計算 */
  const calculateTotalCost = (developmentMonths: number) => {
    if (unitPrice > 0 && developmentMonths > 0) {
      const cost = developmentMonths * unitPrice;
      setValue('totalCost', Math.round(cost));
    } else {
      setValue('totalCost', 0);
    }
  };

  /** ▼ 全体の計算実行 */
  const onCalculateClick = () => {
    const totalFP = calculateTotalFP();
    const devMonths = calculateDevelopmentMonths(totalFP);
    calculateTotalCost(devMonths);
  };

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
    <Box sx={{ p: 3 }}>
      <FormProvider {...methods}>
        <Grid container direction="column" spacing={3}>
          {/* ヘッダー部分 */}
          <Grid>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h5" gutterBottom>
                見積計算システム
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Function Point法による開発工数・費用の見積計算
              </Typography>
            </Paper>
          </Grid>

          {/* 基本情報セクション */}
          <Grid>
            <Paper elevation={2} sx={{ p: 2 }}>
              <FormContent>
                <RecordTitle colSpan={3}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    基本情報
                  </Typography>
                </RecordTitle>
                <Record label="案件名" labelVerticalAlign="top">
                  <TextField 
                    name="projectName" 
                    control={control} 
                    trigger={trigger} 
                    t={t} 
                    required
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
                <Record label="生産性（FP/月）">
                  <TextField 
                    name="productivityFPPerMonth" 
                    control={control} 
                    trigger={trigger} 
                    t={t}
                    type="number"
                  />
                </Record>
                <Record label="単価（円/月）">
                  <TextField 
                    name="unitPrice" 
                    control={control} 
                    trigger={trigger} 
                    t={t}
                    type="number"
                  />
                </Record>
              </FormContent>
            </Paper>
          </Grid>

          {/* FP計算セクション */}
          <Grid>
            <Paper elevation={2} sx={{ p: 2 }}>
              <FormContent>
                <RecordTitle colSpan={3}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    ファンクションポイント（FP）計算
                  </Typography>
                </RecordTitle>
                <Record label="外部入力（EI）">
                  <TextField 
                    name="externalInputFP" 
                    control={control} 
                    trigger={trigger} 
                    t={t}
                    type="number"
                  />
                </Record>
                <Record label="外部出力（EO）">
                  <TextField 
                    name="externalOutputFP" 
                    control={control} 
                    trigger={trigger} 
                    t={t}
                    type="number"
                  />
                </Record>
                <Record label="外部照会（EQ）">
                  <TextField 
                    name="externalInquiryFP" 
                    control={control} 
                    trigger={trigger} 
                    t={t}
                    type="number"
                  />
                </Record>
                <Record label="内部論理ファイル（ILF）">
                  <TextField 
                    name="internalLogicalFileFP" 
                    control={control} 
                    trigger={trigger} 
                    t={t}
                    type="number"
                  />
                </Record>
                <Record label="外部インターフェースファイル（EIF）">
                  <TextField 
                    name="externalInterfaceFileFP" 
                    control={control} 
                    trigger={trigger} 
                    t={t}
                    type="number"
                  />
                </Record>
                <Separator />
                <Record label="合計FP">
                  <TextField 
                    name="totalFP" 
                    control={control} 
                    trigger={trigger} 
                    t={t}
                    type="number"
                    readOnly
                    sx={{ backgroundColor: '#f5f5f5' }}
                  />
                </Record>
              </FormContent>
            </Paper>
          </Grid>

          {/* 計算結果セクション */}
          <Grid>
            <Paper elevation={2} sx={{ p: 2 }}>
              <FormContent>
                <RecordTitle colSpan={3}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    計算結果
                  </Typography>
                </RecordTitle>
                <Record label="開発月数">
                  <TextField 
                    name="developmentMonths" 
                    control={control} 
                    trigger={trigger} 
                    t={t}
                    type="number"
                    readOnly
                    sx={{ backgroundColor: '#f5f5f5' }}
                  />
                </Record>
                <Record label="総費用（円）">
                  <TextField 
                    name="totalCost" 
                    control={control} 
                    trigger={trigger} 
                    t={t}
                    type="number"
                    readOnly
                    sx={{ backgroundColor: '#f5f5f5' }}
                  />
                </Record>
              </FormContent>
            </Paper>
          </Grid>

          {/* その他セクション */}
          <Grid>
            <Paper elevation={2} sx={{ p: 2 }}>
              <FormContent>
                <RecordTitle colSpan={3}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    その他
                  </Typography>
                </RecordTitle>
                <Record label="備考" labelVerticalAlign="top">
                  <TextField 
                    name="remarks" 
                    control={control} 
                    trigger={trigger} 
                    t={t}
                    multiline
                    multilineRowsAuto
                  />
                </Record>
                <Record label="アップロードファイル">
                  <FileUpload name="fileUpload" control={control} trigger={trigger} t={t} />
                </Record>
              </FormContent>
            </Paper>
          </Grid>

          {/* ボタンエリア */}
          <Grid>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Stack direction="row" spacing={2} justifyContent="center">
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={onCalculateClick}
                >
                  計算実行
                </Button>
                <Divider orientation="vertical" flexItem />
                <ImportButton
                  onFileSelect={onImportButtonClick}
                  onClick={() => {}}
                >
                  インポート
                </ImportButton>
                <ExportButton onClick={onExportButtonClick} />
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </FormProvider>
    </Box>
  );
}

export default CalcForm;
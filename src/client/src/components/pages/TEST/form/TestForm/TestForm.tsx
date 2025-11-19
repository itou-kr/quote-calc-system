import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Box from '@mui/material/Box';

// import FormContainerProvider from '@front/components/ui/Layout/Form/FormContainerProvider';
import { useExportFile } from '@front/hooks/TEST/test';
import ExportButton from '@front/components/ui/Button/ExportButton';
import { ViewIdType } from '@front/stores/TEST/test/testStore/index';

const setupYupScheme = () => {
    return yup.object({
        /**入力項目 */
        inputItems: yup.string(),
        /** 自動算出 */
        autoCalculation: yup.string(),
        /** プロジェクト名 */
        projectName: yup.string(),
        /** 生産性(FP/月) */
        productivityFPPerMonth: yup.number(),
        /** プロジェクト種別 */
        projectType: yup.string(),
        /** 総FP */
        totalFP: yup.number(),
        /** 総工数(人月) */
        totalManMonths: yup.number(),
        /** 工数計算 */
        effortCalculation: yup.string(),
        /** エクスポートボタン */
        exportButton: yup.string(),
        /** 参照ボタン */
        browseButton: yup.string(),
        /** インポートボタン */
        importButton: yup.string(),
        /** 比率 基本設計 */
        ratioBasicDesign: yup.number(),
        /** 比率 詳細設計 */
        ratioDetailedDesign: yup.number(),
        /** 比率 実装 */
        ratioImplementation: yup.number(),
        /** 比率 結合テスト */
        ratioIntegrationTest: yup.number(),
        /** 比率 総合テスト */
        ratioSystemTest: yup.number(),
        /** 工数 基本設計 */
        effortBasicDesign: yup.number(),
        /** 工数 詳細設計 */
        effortDetailedDesign: yup.number(),
        /** 工数 実装 */
        effortImplementation: yup.number(),
        /** 工数 結合テスト */
        effortIntegrationTest: yup.number(),
        /** 工数 総合テスト */
        effortSystemTest: yup.number(),
        /** 工期 基本設計 */
        durationBasicDesign: yup.number(),
        /** 工期 詳細設計 */
        durationDetailedDesign: yup.number(),
        /** 工期 実装 */
        durationImplementation: yup.number(),
        /** 工期 結合テスト */
        durationIntegrationTest: yup.number(),
        /** 工期 総合テスト */
        durationSystemTest: yup.number()
    })
}

export type FormType = yup.InferType<ReturnType<typeof setupYupScheme>>;

type Props = {
    viewId: ViewIdType | 'TEST';
    data?: FormType& {
    };
    isDirty: boolean;
};

function TestForm(props: Props) {
    const { viewId } = props;
    const yupSchema = useMemo(() => {
        return setupYupScheme();
    }, []);

    const exportFile = useExportFile(viewId);

    const methods = useForm({
        mode: 'onSubmit',
        reValidateMode: 'onSubmit',
        resolver: yupResolver(yupSchema),
    });

    const onExportButtonClick = async(model: FormType) => {
        await exportFile({
            name: 'export.json',
            content: JSON.stringify(model)
        });
    };

    // const { data, isDirty} = props;
    return (
        // <FormContainerProvider blockNavigation={ isDirty ? false : true } {...methods} >
            <Box>
                <ExportButton
                    onClick={() => onExportButtonClick(methods.getValues())}
                />
            </Box>
        // </FormContainerProvider>
    );
}

export default TestForm; 
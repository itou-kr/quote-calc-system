import { useState, useCallback, useMemo, useEffect } from 'react';
import { Control, UseFormTrigger, UseFormSetValue, UseFormWatch, UseFormClearErrors, FieldValues } from 'react-hook-form';
import { TFunction } from 'i18next';
import { Box, Checkbox } from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import FormSection from '@front/components/ui/FormSection';
import TextField from '@front/components/ui/TextField';
import FlexBox from '@front/components/ui/FlexBox';
import Text from '@front/components/ui/Text';
import Button from '@front/components/ui/Button';

export type Props<T extends FieldValues = any> = {
    control: Control<T>;
    trigger: UseFormTrigger<T>;
    setValue: UseFormSetValue<T>;
    watch: UseFormWatch<T>;
    clearErrors?: UseFormClearErrors<T>;
    t: TFunction<'translation', undefined>;
    getProcessRatios: (projectType: string, ipaValueType: string) => {
        basicDesign: number;
        detailedDesign: number;
        implementation: number;
        integrationTest: number;
        systemTest: number;
    };
};

/**
 * 開発工程比率入力フィールド（自動入力切り替え機能付き）
 */
function ProcessRatiosField<T extends FieldValues = any>(props: Props<T>) {
    const { control, trigger, setValue, watch, clearErrors, t, getProcessRatios } = props;

    const [autoProcessRatios, setAutoProcessRatios] = useState(true);
    
    // プルダウンの値を監視
    const projectType = watch('projectType' as any) || '新規開発';
    const ipaValueType = watch('ipaValueType' as any) || '中央値';
    
    // 各比率フィールドを個別に監視（リアルタイム更新のため）
    const basicDesign = watch('processRatios.basicDesign' as any);
    const detailedDesign = watch('processRatios.detailedDesign' as any);
    const implementation = watch('processRatios.implementation' as any);
    const integrationTest = watch('processRatios.integrationTest' as any);
    const systemTest = watch('processRatios.systemTest' as any);

    // 自動入力がONの場合、プルダウンの値が変わったら自動的に更新
    useEffect(() => {
        if (autoProcessRatios) {
            const defaultRatios = getProcessRatios(projectType, ipaValueType);
            setValue('processRatios' as any, defaultRatios as any);
        }
    }, [autoProcessRatios, projectType, ipaValueType, getProcessRatios, setValue]);

    const handleCheckboxChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;
        setAutoProcessRatios(checked);
        setValue('autoProcessRatios' as any, checked as any);
        
        // チェックをONにしたタイミングで自動的にデフォルト値を設定
        if (checked) {
            const defaultRatios = getProcessRatios(projectType, ipaValueType);
            setValue('processRatios' as any, defaultRatios as any, { shouldValidate: true });
            // エラーを解除
            clearErrors?.('processRatios.basicDesign' as any);
            clearErrors?.('processRatios.detailedDesign' as any);
            clearErrors?.('processRatios.implementation' as any);
            clearErrors?.('processRatios.integrationTest' as any);
            clearErrors?.('processRatios.systemTest' as any);
        }
    }, [setValue, clearErrors, getProcessRatios, projectType, ipaValueType]);

    const handleResetClick = useCallback(() => {
        const defaultRatios = getProcessRatios(projectType, ipaValueType);
        setValue('processRatios' as any, defaultRatios as any, { shouldValidate: true, shouldDirty: true });
    }, [setValue, getProcessRatios, projectType, ipaValueType]);

    // スタイルをメモ化
    const fieldSx = useMemo(() => ({
        '& .MuiInputBase-root': { bgcolor: autoProcessRatios ? '#f5f5f5' : 'white' }
    }), [autoProcessRatios]);

    const slotProps = useMemo(() => ({
        htmlInput: { step: 0.001 }
    }), []);

    // 合計値を計算（個別フィールドの変更を検知）
    const total = useMemo(() => {
        return (
            (Number(basicDesign) || 0) +
            (Number(detailedDesign) || 0) +
            (Number(implementation) || 0) +
            (Number(integrationTest) || 0) +
            (Number(systemTest) || 0)
        );
    }, [basicDesign, detailedDesign, implementation, integrationTest, systemTest]);

    return (
        <FormSection 
            label="開発工程比率" 
            mb={3}
            rightElement={
                <FlexBox>
                    <Checkbox 
                        checked={autoProcessRatios} 
                        onChange={handleCheckboxChange}
                        size="small"
                        sx={{ p: 0, mr: 0.5 }}
                    />
                    <Text variant="label">自動入力</Text>
                </FlexBox>
            }
        >
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5, mt: 1.5 }}>
                <TextField
                    name={"processRatios.basicDesign" as any}
                    control={control}
                    trigger={trigger}
                    t={t}
                    type="number"
                    label="基本設計"
                    disabled={autoProcessRatios}
                    sx={fieldSx}
                    slotProps={slotProps}
                />
                <TextField
                    name={"processRatios.detailedDesign" as any}
                    control={control}
                    trigger={trigger}
                    t={t}
                    type="number"
                    label="詳細設計"
                    disabled={autoProcessRatios}
                    sx={fieldSx}
                    slotProps={slotProps}
                />
                <TextField
                    name={"processRatios.implementation" as any}
                    control={control}
                    trigger={trigger}
                    t={t}
                    type="number"
                    label="実装"
                    disabled={autoProcessRatios}
                    sx={fieldSx}
                    slotProps={slotProps}
                />
                <TextField
                    name={"processRatios.integrationTest" as any}
                    control={control}
                    trigger={trigger}
                    t={t}
                    type="number"
                    label="結合テスト"
                    disabled={autoProcessRatios}
                    sx={fieldSx}
                    slotProps={slotProps}
                />
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                        name={"processRatios.systemTest" as any}
                        control={control}
                        trigger={trigger}
                        t={t}
                        type="number"
                        label="総合テスト"
                        disabled={autoProcessRatios}
                        sx={{ ...fieldSx, flex: 1 }}
                        slotProps={slotProps}
                    />
                </Box>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<RestartAltIcon />}
                        onClick={handleResetClick}
                        disabled={autoProcessRatios}
                        sx={{ fontSize: '0.75rem', py: 1, px: 1.5, flex: 1 }}
                    >
                        デフォルト値
                    </Button>
                </Box>
            </Box>
            {/* 比率合計表示 */}
            <Box sx={{ 
                mt: 1.5, 
                p: 1.5, 
                bgcolor: total === 1 ? '#e8f5e9' : '#fff3e0',
                border: 1,
                borderColor: total === 1 ? '#4caf50' : '#ff9800',
                borderRadius: 1,
                textAlign: 'center'
            }}>
                <Text variant="body2" sx={{ fontWeight: 'bold', color: total === 1 ? '#2e7d32' : '#e65100' }}>
                    合計: {total.toFixed(3)}
                </Text>
            </Box>
        </FormSection>
    );
}

export default ProcessRatiosField;

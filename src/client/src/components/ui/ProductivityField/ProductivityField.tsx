import { useState, useCallback, useMemo, useEffect } from 'react';
import { Control, UseFormTrigger, UseFormSetValue, UseFormClearErrors, UseFormWatch, FieldValues } from 'react-hook-form';
import { TFunction } from 'i18next';
import { Checkbox } from '@mui/material';
import FormSection from '@front/components/ui/FormSection';
import TextField from '@front/components/ui/TextField';
import FlexBox from '@front/components/ui/FlexBox';
import Text from '@front/components/ui/Text';
import { getProductivity } from '@common/constants/productivity';

export type Props<T extends FieldValues = any> = {
    control: Control<T>;
    trigger: UseFormTrigger<T>;
    setValue: UseFormSetValue<T>;
    watch: UseFormWatch<T>;
    clearErrors?: UseFormClearErrors<T>;
    t: TFunction<'translation', undefined>;
};

/**
 * 生産性入力フィールド
 */
function ProductivityField<T extends FieldValues = any>(props: Props<T>) {
    const { control, trigger, setValue, watch, clearErrors, t } = props;

    const [autoProductivity, setAutoProductivity] = useState(true);

    // プルダウンの値を監視
    const projectType = watch('projectType' as any) || '新規開発';
    const ipaValueType = watch('ipaValueType' as any) || '中央値';
    const totalFP = watch('totalFP' as any);

    // 自動入力がONの場合、プルダウンの値またはtotalFPが変わったら自動的に更新
    useEffect(() => {
        if (autoProductivity) {
            const productivity = getProductivity(projectType, ipaValueType, totalFP);
            setValue('productivityFPPerMonth' as any, productivity as any);
        }
    }, [autoProductivity, projectType, ipaValueType, totalFP, setValue]);

    // イベントハンドラーをメモ化
    const handleProductivityKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === '-' || e.key === 'e' || e.key === '+' || e.key === '.') {
            e.preventDefault();
        }
    }, []);

    const handleCheckboxChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;
        setAutoProductivity(checked);
        setValue('autoProductivity' as any, checked as any);
        // チェックをONにしたタイミングで現在のtotalFPに基づいた値を設定し、エラーを解除
        if (checked) {
            const productivity = getProductivity(projectType, ipaValueType, totalFP);
            setValue('productivityFPPerMonth' as any, productivity as any, { shouldValidate: true });
            clearErrors?.('productivityFPPerMonth' as any);
        }
    }, [setValue, clearErrors, projectType, ipaValueType, totalFP]);

    // スタイルをメモ化
    const productivitySx = useMemo(() => ({
        '& .MuiInputBase-root': { bgcolor: autoProductivity ? '#f5f5f5' : 'white' }
    }), [autoProductivity]);

    const productivitySlotProps = useMemo(() => ({
        htmlInput: {
            min: 1,
            step: 1,
            onKeyDown: handleProductivityKeyDown
        }
    }), [handleProductivityKeyDown]);

    return (
        <FormSection 
            label="生産性(FP/月)" 
            required
            rightElement={
                <FlexBox>
                    <Checkbox 
                        checked={autoProductivity} 
                        onChange={handleCheckboxChange}
                        size="small"
                        sx={{ p: 0, mr: 0.5 }}
                    />
                    <Text variant="label">自動入力</Text>
                </FlexBox>
            }
        >
            <TextField 
                name={"productivityFPPerMonth" as any}
                control={control} 
                trigger={trigger} 
                t={t} 
                type="number" 
                hideHelperText 
                disabled={autoProductivity}
                slotProps={productivitySlotProps}
                sx={productivitySx}
            />
        </FormSection>
    );
}

export default ProductivityField;

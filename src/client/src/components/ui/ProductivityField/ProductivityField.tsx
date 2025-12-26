import { useState, useCallback, useMemo } from 'react';
import { Control, UseFormTrigger, UseFormSetValue, UseFormClearErrors, FieldValues } from 'react-hook-form';
import { TFunction } from 'i18next';
import { Checkbox } from '@mui/material';
import FormSection from '@front/components/ui/FormSection';
import TextField from '@front/components/ui/TextField';
import FlexBox from '@front/components/ui/FlexBox';
import Text from '@front/components/ui/Text';

export type Props<T extends FieldValues = any> = {
    control: Control<T>;
    trigger: UseFormTrigger<T>;
    setValue: UseFormSetValue<T>;
    clearErrors: UseFormClearErrors<T>;
    t: TFunction<'translation', undefined>;
};

/**
 * 生産性入力フィールド（グレーアウト切り替え機能付き）
 * このコンポーネントを分離することで、チェックボックスのオン/オフ時にこの部分だけが再レンダリングされる
 */
function ProductivityField<T extends FieldValues = any>(props: Props<T>) {
    const { control, trigger, setValue, clearErrors, t } = props;

    const [autoProductivity, setAutoProductivity] = useState(true);

    // イベントハンドラーをメモ化
    const handleProductivityKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === '-' || e.key === 'e' || e.key === '+') {
            e.preventDefault();
        }
    }, []);

    const handleProductivityBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value);
        if (!isNaN(value)) {
            const formatted = Math.round(value * 10) / 10;
            setValue('productivityFPPerMonth' as any, parseFloat(formatted.toFixed(1)) as any);
            e.target.value = formatted.toFixed(1);
        }
    }, [setValue]);

    const handleCheckboxChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;
        setAutoProductivity(checked);
        setValue('autoProductivity' as any, checked as any);
        // チェックをONにしたタイミングでエラーを解除
        if (checked) {
            clearErrors('productivityFPPerMonth' as any);
        }
    }, [setValue, clearErrors]);

    // スタイルをメモ化
    const productivitySx = useMemo(() => ({
        '& .MuiInputBase-root': { bgcolor: autoProductivity ? '#f5f5f5' : 'white' }
    }), [autoProductivity]);

    const productivitySlotProps = useMemo(() => ({
        htmlInput: {
            min: 0.1,
            step: 0.1,
            onKeyDown: handleProductivityKeyDown,
            onBlur: handleProductivityBlur
        }
    }), [handleProductivityKeyDown, handleProductivityBlur]);

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

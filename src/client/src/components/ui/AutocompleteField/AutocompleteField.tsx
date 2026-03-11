import { useEffect } from 'react';
import { Controller, Control, FieldValues, FieldPath, UseFormTrigger } from 'react-hook-form';
import { TFunction } from 'i18next';
import MuiAutocomplete from '@mui/material/Autocomplete';
import { AutocompleteFreeSoloValueMapping } from '@mui/material/useAutocomplete';
import { TextFieldProps as MuiTextFieldProps } from '@mui/material/TextField';
import { SxProps, Theme } from '@mui/material/styles';

import { HookFormRenderProps } from '@front/types';
import StyledTextField from '@front/components/styles/StyledTextField';

type RenderProps<T extends FieldValues = FieldValues, N extends FieldPath<T> = FieldPath<T>> = {
    id?: string;
    options: NonNullable<T[N]>[];
    onChange?: (event: React.SyntheticEvent, newValue: NonNullable<T[N]> | string | null) => void | Promise<void>;
    disabled?: boolean;
    required?: boolean;
    readonly?: boolean;
    notFullWidth?: boolean;
    sx?: SxProps<Theme>;
    className?: string;
    isOptionEqualToValue?: (option: NonNullable<T[N]>, value: NonNullable<T[N]>) => boolean;
    getOptionLabel?: (option: NonNullable<T[N]> | AutocompleteFreeSoloValueMapping<T[N]>) => string;
    trigger: UseFormTrigger<T>;
    t: TFunction<'translation', undefined>;
    disableClearable?: boolean;
} & Pick<MuiTextFieldProps, 'label'>;

function RenderAutocompleteField<T extends FieldValues = FieldValues, N extends FieldPath<T> = FieldPath<T>>(props: RenderProps<T> & HookFormRenderProps<T, N>) {
    const {
        id,
        label,
        options,
        onChange,
        disabled,
        required,
        readonly,
        notFullWidth,
        sx,
        className,
        isOptionEqualToValue,
        getOptionLabel,
        field: { name, ...field },
        fieldState: { invalid, error },
        trigger,
        t,
        disableClearable,
    } = props;

    useEffect(() => {
        if (invalid) {
            // ロケール変更時に validate が有効な場合はロケールに適したメッセージへ切替 //
            trigger(name);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [t]);// ロケールが変更された時のみ限定

    const handleChange = async (e: React.SyntheticEvent, newValue: (typeof options)[number] | string | null) => {
        if (onChange) {
            await onChange(e, newValue);
        }
        field.onChange(newValue);
    };

    return (
        <MuiAutocomplete
            id={id}
            disablePortal
            options={options}
            disabled={disabled}
            readOnly={readonly}
            renderInput={(params) => (
                <StyledTextField
                    {...params}
                    label={label}
                    required={required}
                    error={!!error}
                    fullWidth={!notFullWidth}
                />
            )}
            value={field.value || null}
            sx={sx}
            className={className}
            onChange={handleChange}
            onBlur={field.onBlur}
            isOptionEqualToValue={isOptionEqualToValue}
            getOptionLabel={getOptionLabel}
            disableClearable={disableClearable}
        />
    );
}

export type Props<T extends FieldValues = FieldValues, N extends FieldPath<T> = FieldPath<T>> = RenderProps<T, N> & {
    name: N;
    control: Control<T>;
};

/**
 * 選択フィールド
 * react-hoo-form対応
 * @param props
 * @returns
 */
function AutocompleteField<T extends FieldValues = FieldValues, N extends FieldPath<T> = FieldPath<T>>(props: Props<T, N>) {
    const { name, control, ...autocompleteFieldProps } = props;

    const renderAutocompleteField = (hookFormRenderProps: HookFormRenderProps<T, N>) => {
        return <RenderAutocompleteField {...autocompleteFieldProps} {...hookFormRenderProps} />;
    };

    return <Controller name={name} control={control} render={renderAutocompleteField} />;
}

export default AutocompleteField;
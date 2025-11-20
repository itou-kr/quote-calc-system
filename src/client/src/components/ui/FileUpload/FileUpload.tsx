import { ChangeEvent, useRef, useState } from 'react';
import { TFunction } from 'i18next';
import { Grid2 as Grid, TextField, Button } from '@mui/material';
import { TextFieldProps as MuiTextFieldProps } from '@mui/material/TextField';
import { Control, FieldValues, FieldPath, UseFormTrigger, Controller } from 'react-hook-form';
import { HookFormRenderProps } from '@front/types';

type RenderProps<T extends FieldValues = FieldValues, N extends FieldPath<T> = FieldPath<T>> = {
    id?: string;
    type?: MuiTextFieldProps['type'];
    label?: MuiTextFieldProps['label'];
    variant?: MuiTextFieldProps['variant'];
    disabled?: boolean;
    required?: boolean;
    readonly?: boolean;
    notFullWidth?: boolean;
    sx?: MuiTextFieldProps['sx'];
    className?: MuiTextFieldProps['className'];
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void | Promise<void>;
    onBlur?: (e: React.FocusEvent<HTMLTextAreaElement, HTMLInputElement>, value: T[N]) => void | Promise<void>;
    trigger: UseFormTrigger<T>;
    t: TFunction<'translation', undefined>;
};

type Props<T extends FieldValues = FieldValues, N extends FieldPath<T> = FieldPath<T>> = RenderProps<T> & {
    name: N;
    control: Control<T>;
};

/**
 * ファイルアップロードパーツ
 * @param props
 * @returns
 */
function FileUpload<T extends FieldValues = FieldValues, N extends FieldPath<T> = FieldPath<T>>(props: Props<T, N>) {
    const { name, control } = props;
    const [filePath, setFieldPath] = useState('');
    const targetRef = useRef<HTMLInputElement>(null);

    const handleClick = () => {
        if(targetRef.current) {
            targetRef.current.value = '';
            targetRef.current.click();
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>, HookFormRenderProps: HookFormRenderProps<T, N>) => {
        const {
            field: { ...field },
        } = HookFormRenderProps;

        const files: FileList | null = e.target.files;

        if (files && files.length > 0) {
            const file: File = files[0];
            setFieldPath(file.name);
            field.onChange(file);
        }
    };

    return (
        <Controller
            name={name}
            control={control}
            render={(hookFormRenderProps: HookFormRenderProps<T, N>) => {
                const {
                    fieldState: { error },
                } = hookFormRenderProps;

                return (
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 6 }} justifyContent={'center'}>
                            <TextField helperText={error?.message} error={!!error} value={filePath} disabled></TextField>
                            <input
                                hidden
                                name={name}
                                type="file"
                                ref={targetRef}
                                onChange={(e) => {
                                    handleChange(e, hookFormRenderProps);
                                }}
                                required
                            />
                        </Grid>
                        <Grid size={{ xs: 4 }}>
                            {/* ★要修正 */}
                            <Button onClick={() => handleClick()}>{'参照'}</Button>
                        </Grid>
                    </Grid>
                );
            }}
        />
    );
}

export default FileUpload;
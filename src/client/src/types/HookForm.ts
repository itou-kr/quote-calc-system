import { ControllerRenderProps, FieldValues, ControllerFieldState, FieldPath, UseFormStateReturn } from 'react-hook-form';

export type HookFormRenderProps<T extends FieldValues = FieldValues, N extends FieldPath<T> = FieldPath<T>> = {
    field: ControllerRenderProps<T, N>;
    fieldState: ControllerFieldState;
    formState: UseFormStateReturn<T>;
};

export type HookFormRenderCallback<T extends FieldValues = FieldValues, N extends FieldPath<T> = FieldPath<T>> = (props: HookFormRenderProps<T, N>) => JSX.Element;
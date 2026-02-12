import { useCallback, useEffect } from "react";
import { useBlocker, BlockerFunction } from "react-router-dom";
import { FormProvider, FormProviderProps, FieldValues } from 'react-hook-form';
// import { useTranslation } from "react-i18next";

import { useAsyncEffect } from '@front/utils/asyncEffect';
import useConfirm from "@front/hooks/ui/confirm/useConfirm";
import FormContainer from './Container';

type Props<TF extends FieldValues, TC = unknown, TTV extends FieldValues | undefined = undefined> = FormProviderProps<TF, TC, TTV> & {
    blockNavigation?: boolean;
    children: React.ReactNode;
};

function FormContainerProvider<TF extends FieldValues, TC = unknown, TTV extends FieldValues | undefined = undefined>({ blockNavigation = false, children, ...methods }: Props<TF, TC, TTV>) {
    // const { t } = useTranslation();
    const confirm = useConfirm();
    const handleBlocker: BlockerFunction = useCallback(({ currentLocation, nextLocation }) => {
        return currentLocation.pathname !== nextLocation.pathname;
    }, []);
    const blocker = useBlocker(blockNavigation && handleBlocker);

    useAsyncEffect(
        useCallback(async () => {
            if (blocker.state === 'blocked') {
                const result = await confirm({ icon: 'help', message: ('確認ダイアログ'), yes: true, cancel: true, close: true });
                if (result === 'yes') {
                    blocker.proceed();
                } else {
                    blocker.reset();
                }
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [blocker, confirm]) // ロケール変更でのEffectは発生させない
    );

    useEffect(() => {
        if (!blockNavigation) return;

        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        e.returnValue = ''; // ★よくわからない
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [blockNavigation]);

    return (
        <FormProvider {...methods}>
            <FormContainer>{children}</FormContainer>
        </FormProvider>
    );
}

export default FormContainerProvider;

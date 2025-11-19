import { useCallback } from 'react';
import { useBlocker, BlockerFunction } from 'react-router-dom';
import { FormProvider, FormProviderProps, FieldValues } from 'react-hook-form';
// import { useTranslation } from 'react-i18next';

import { useAsyncEffect } from '@front/utils/asyncEffect';
import useConfirm from '@front/hooks/ui/confirm/useConfirm';
import FormPaper from './Paper';

type Props<TF extends FieldValues, TC = unknown, TTV extends FieldValues | undefined = undefined> = FormProviderProps<TF, TC, TTV> & {
    /** 内容の変更がある場合にページ遷移前に確認メッセージを表示する・しない */
    blockNavigation?: boolean;
    children: React.ReactNode;
};

function FormPaperProvider<TF extends FieldValues, TC = unknown, TTV extends FieldValues | undefined = undefined>({ blockNavigation = false, children, ...methods }: Props<TF, TC, TTV>) {
    // const { t } = useTranslation();
    const confirm = useConfirm();
    const handleBlocker: BlockerFunction = useCallback(({ currentLocation, nextLocation }) => {
        return currentLocation.pathname !== nextLocation.pathname;
    }, []);
    const blocker = useBlocker(blockNavigation && handleBlocker);

    useAsyncEffect(
        useCallback(async () => {
            if (blocker.state === 'blocked') {
                const result = await confirm({ icon: 'help', message: ('確認ダイアログ'), yes: true, cancel: true, close:true });
                if (result === 'yes') {
                    blocker.proceed();
                }
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [blocker, confirm])
    );

    return (
        <FormProvider {...methods}>
            <FormPaper>{children}</FormPaper>
        </FormProvider>
    );
}
export default FormPaperProvider;
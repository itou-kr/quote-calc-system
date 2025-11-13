import {useState, useCallback} from 'react';

import { ConfirmOptions, ConfirmResult } from '@front/hooks/ui/confirm/useConfirm';
import { ConfirmContext } from '@front/contexts';
import Confirm, { ConfirmResultYes, ConfirmResultNo, ConfirmResultCancel } from '@front/components/ui/Confirm';

type Props = {
    children?: React.ReactNode;
};

function ConfirmProvider({ children }: Props) {
    const [options, setOptions] = useState<ConfirmOptions>({ message:'' });
    const [resolveFunc, setResolveFunc] = useState<React.Dispatch<ConfirmResult>[]>([]);
    const [resolve] = resolveFunc;

    const confirm = useCallback(
        (confirmOptions: ConfirmOptions) => {
            setOptions(confirmOptions);
            return new Promise<ConfirmResult>((confirmResolve: React.Dispatch<ConfirmResult>, confirmReject: React.Dispatch<ConfirmResult>) => {
                setResolveFunc([confirmResolve, confirmReject]);
            });
        },
        [setOptions, setResolveFunc]
    );

    const close = useCallback(() => {
        setResolveFunc([]);
    }, []);

    const handleYes = useCallback(
        (value: ConfirmResultYes) => {
            resolve(value);
            close();
        },
        [resolve, close]
    );

    const handleNo = useCallback(
        (value: ConfirmResultNo) => {
            resolve(value);
            close();
        },
        [resolve, close]
    );

    const handleCancel = useCallback(
        (value: ConfirmResultCancel) => {
            resolve(value);
            close();
        },
        [resolve, close]
    );

    const handleClose = useCallback(() => {
        resolve(undefined);
        close();
    }, [resolve, close]);

    return (
        <>
            <ConfirmContext.Provider value={confirm}>{children}</ConfirmContext.Provider>
            {resolveFunc.length > 0 && (
                <Confirm
                    open={resolveFunc.length > 0}
                    icon={options.icon}
                    title={options.title}
                    message={options.message}
                    yes={options.yes ? { label: options.yes, on: handleYes } : undefined}
                    no={options.no ? { label: options.no, on: handleNo } : undefined}
                    cancel={options.cancel ? { label: options.cancel, on: handleCancel } : undefined}
                    close={options.close}
                    onClose={handleClose}
                />
            )}                    
        </>
    );
}

export default ConfirmProvider;
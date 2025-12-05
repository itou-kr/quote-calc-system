import { useCallback } from 'react';

import { ViewId } from '@front/types';
import { useAppDispatch } from '@front/stores';
import alertMessageStore, {MessageType} from '@front/stores/alertMessageStore';

export function useSetAlertMessage(viewId: ViewId) {
    const dispatch = useAppDispatch();
    return useCallback(
        (message: MessageType, override: boolean = false) => {
            if (override) {
                dispatch(alertMessageStore.actions.overrideMessage({ viewId, message }));
            } else {
                dispatch(alertMessageStore.actions.setMessage({ viewId, message }));
            }
        },
        [dispatch, viewId]
    );
}

export default useSetAlertMessage;
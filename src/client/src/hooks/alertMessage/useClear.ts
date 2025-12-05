import { useCallback } from 'react';

import { ViewId } from '@front/types';
import { useAppDispatch } from '@front/stores';
import alertMessageStore from '@front/stores/alertMessageStore';

export function useClear(viewId: ViewId) {
    const dispatch = useAppDispatch();
    return useCallback(() => {
        dispatch(alertMessageStore.actions.clear(viewId));
    }, [viewId, dispatch]);
}

export default useClear;
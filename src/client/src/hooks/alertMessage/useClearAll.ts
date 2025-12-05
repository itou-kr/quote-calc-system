import { useCallback } from 'react';

import { useAppDispatch } from '@front/stores';
import alertMessageStore from '@front/stores/alertMessageStore';

export function useClearAll() {
    const dispatch = useAppDispatch();
    return useCallback(() => {
        dispatch(alertMessageStore.actions.reset());
    }, [dispatch]);
}

export default useClearAll;
import { useCallback } from 'react';

import { useAppDispatch } from '@front/stores';
import calcStore from '@front/stores/TEST/test/calcStore/calcStore'

export const useSetDirty = () => {
    const dispatch = useAppDispatch();
    return useCallback(
        (isDirty: boolean) => {
            dispatch(calcStore.actions.setDirty(isDirty));
        },
        [dispatch],
    );
};

export default useSetDirty;
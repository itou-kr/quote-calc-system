import { useEffect } from "react";
import { useEffectOnce } from 'react-use';
import { useProgressContext } from '@front/hooks/contexts';
import { useThrowError } from '@front/hooks/error';

/**
 * 非同期用のuseEffectOnce
 * @param fn
 * @returns
 */
export function useAsyncEffectOnce(fn: () => Promise<void>) {
    const { setProgress } = useProgressContext();
    const throwError = useThrowError();
    return useEffectOnce(() => {
        setProgress(true);
        fn()
        .catch(throwError)
        .finally(() => setProgress(false));
    });
}

/**
 * 非同期用のuseEffect
 * @param fn 必ず useCallback でメモ化したコールバックを渡すこと
 * @returns
 */
export function useAsyncEffect(fn: () => Promise<void>) {
    const { setProgress } = useProgressContext();
    const throwError = useThrowError();
    return useEffect(() => {
        setProgress(true);
        fn()
            .catch(throwError)
            .finally(() => setProgress(false));
    }, [fn]);
}
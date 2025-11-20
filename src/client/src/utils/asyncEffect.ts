import { useEffect } from "react";
import { useEffectOnce } from 'react-use';
import { useProgressContext } from '@front/hooks/contexts';
import { useThrowError } from '@front/hooks/error';

// Minimum delay before showing progress indicator (in milliseconds)
const PROGRESS_DELAY = 300;

/**
 * 非同期用のuseEffectOnce
 * プログレスは300ms以上かかる処理のみ表示される
 * @param fn
 * @returns
 */
export function useAsyncEffectOnce(fn: () => Promise<void>) {
    const { setProgress } = useProgressContext();
    const throwError = useThrowError();
    return useEffectOnce(() => {
        let progressTimeout: ReturnType<typeof setTimeout> | null = null;
        let isCompleted = false;

        // Only show progress if operation takes longer than PROGRESS_DELAY
        progressTimeout = setTimeout(() => {
            if (!isCompleted) {
                setProgress(true);
            }
        }, PROGRESS_DELAY);

        fn()
            .catch(throwError)
            .finally(() => {
                isCompleted = true;
                if (progressTimeout) {
                    clearTimeout(progressTimeout);
                }
                setProgress(false);
            });
    });
}

/**
 * 非同期用のuseEffect
 * プログレスは300ms以上かかる処理のみ表示される
 * @param fn 必ず useCallback でメモ化したコールバックを渡すこと
 * @returns
 */
export function useAsyncEffect(fn: () => Promise<void>) {
    const { setProgress } = useProgressContext();
    const throwError = useThrowError();
    return useEffect(() => {
        let progressTimeout: ReturnType<typeof setTimeout> | null = null;
        let isCompleted = false;

        // Only show progress if operation takes longer than PROGRESS_DELAY
        progressTimeout = setTimeout(() => {
            if (!isCompleted) {
                setProgress(true);
            }
        }, PROGRESS_DELAY);

        fn()
            .catch(throwError)
            .finally(() => {
                isCompleted = true;
                if (progressTimeout) {
                    clearTimeout(progressTimeout);
                }
                setProgress(false);
            });
    }, [fn, setProgress, throwError]);
}
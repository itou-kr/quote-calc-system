import { useCallback, useEffect, useState } from 'react';
import { isAxiosError } from 'axios';
import { useAuthContext } from '@front/hooks/contexts';

export default function useThrowError() {
    const [error, setError] = useState<unknown>();
    const { setAuthorized } = useAuthContext();

    useEffect(() => {
        if (error) {
            throw error;
        }
    }, [error]);

    return useCallback(
        (error: unknown) => {
            if (isAxiosError(error)) {
                //Unauthorized
                if (error.status === 401) {
                    setAuthorized(false);
                    return;
                }
            }

            // other...
            setError(error);
        },
        [error]
    );
}
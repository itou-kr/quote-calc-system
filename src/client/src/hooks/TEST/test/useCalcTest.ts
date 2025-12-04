import { useCallback } from 'react';
import { UseFormSetError } from 'react-hook-form';

import { FormType } from '@front/components/pages/TEST/form/TestForm';
import type { CalcTestApplication200Response, CalcTestApplicationRequest } from '@front/openapi/models';
import { ViewIdType } from '@front/stores/TEST/test/testStore';

import { useClear as useClearAlertMessage, useSetAlertMessage } from '@front/hooks/alertMessage'; 
import { calcApi } from '@front/openapi'

export function useCalcTest(viewId: ViewIdType) {
    const clearAlertMessage = useClearAlertMessage(viewId);
    const setAlertMessage = useSetAlertMessage(viewId);

    return useCallback(
        async (data: CalcTestApplicationRequest, _: UseFormSetError<FormType>): Promise<CalcTestApplication200Response | undefined> => {
            clearAlertMessage();
            const response = await calcApi.calcTestApplication(data);
            console.log('response', response);
            const createTest = response.data;
            setAlertMessage({ severity: 'error', message:'aaaaa' });
            return createTest;
        },
        [clearAlertMessage, setAlertMessage]
    );
}

export default useCalcTest;
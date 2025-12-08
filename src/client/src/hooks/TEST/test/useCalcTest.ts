import { useCallback } from 'react';
import { UseFormSetError } from 'react-hook-form';
import { useAppDispatch } from '@front/stores';

import { FormType } from '@front/components/pages/TEST/form/TestForm';
// import type { CalcTestApplication200Response, CalcTestApplicationRequest } from '@front/openapi/models';
import type { CalcTestApplicationRequest } from '@front/openapi/models';
import { ViewIdType } from '@front/stores/TEST/test/testStore';
import calcStore from '@front/stores/TEST/test/calcStore';


import { useClear as useClearAlertMessage, useSetAlertMessage } from '@front/hooks/alertMessage'; 
import { calcApi } from '@front/openapi'

export function useCalcTest(viewId: ViewIdType) {
    const clearAlertMessage = useClearAlertMessage(viewId);
    const setAlertMessage = useSetAlertMessage(viewId);
    const dispatch = useAppDispatch();

    return useCallback(
        async (data: CalcTestApplicationRequest, _: UseFormSetError<FormType>) => {
            clearAlertMessage();
            const response = await calcApi.calcTestApplication(data);
            console.log('data', data);
            console.log('response', response);
            // const createTest = response.data;
            setAlertMessage({ severity: 'error', message:'aaaaa' });
            dispatch(
                calcStore.actions.setCalc({
                    ...response,
                    manMonth: response.data.manMonth || undefined,
                    /* t-miwa ビルドできないため、意図的にコメントアウト
                    totalFP: response.data.totalFP || undefined,
                    manMonthsBasicDesign: response.data.manMonthsBasicDesign || undefined,
                    manMonthsDetailedDesign: response.data.manMonthsDetailedDesign || undefined,
                    manMonthsImplementation: response.data.manMonthsImplementation || undefined,
                    manMonthsIntegrationTest: response.data.manMonthsIntegrationTest || undefined,
                    manMonthsSystemTest: response.data.manMonthsSystemTest || undefined,
                    durationBasicDesign: response.data.durationBasicDesign || undefined,
                    durationDetailedDesign: response.data.durationDetailedDesign || undefined,
                    durationImplementation: response.data.durationImplementation || undefined,
                    durationIntegrationTest: response.data.durationIntegrationTest || undefined,
                    durationSystemTest: response.data.durationSystemTest || undefined,
                    */
                })
            );
        },
        [clearAlertMessage, setAlertMessage]
    );
}

export default useCalcTest;
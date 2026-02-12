import { useCallback } from 'react';
import { UseFormSetError } from 'react-hook-form';
import { useAppDispatch } from '@front/stores';

import { FormType } from '@front/components/pages/CALC/form/CalcForm/CalcForm';
import type { CalcTestApplicationRequest } from '@front/openapi/models';
import calcStore from '@front/stores/TEST/test/calcStore';

import { useClear as useClearAlertMessage, useSetAlertMessage } from '@front/hooks/alertMessage';
import { calcApi } from '@front/openapi';

const viewId = 'CALC';

export function useCalc() {
    const clearAlertMessage = useClearAlertMessage(viewId);
    const setAlertMessage = useSetAlertMessage(viewId);
    const dispatch = useAppDispatch();

    return useCallback(
        async (data: CalcTestApplicationRequest, _: UseFormSetError<FormType>) => {
            clearAlertMessage();
            const response = await calcApi.calcTestApplication(data);
            const calcResultData = response.data;

            if ((calcResultData.errorMessages ?? []).length > 0) {
                setAlertMessage({
                    severity: 'error',
                    message: (calcResultData.errorMessages ?? []).join('\n').replaceAll('<br>', '\n'),
                });
                console.log('errorMessages', calcResultData.errorMessages);
                return;
            }

            console.log('response', response);
            dispatch(calcStore.actions.setCalc(calcResultData));

            return calcResultData;
        },
        [clearAlertMessage, setAlertMessage, dispatch]
    );
}

export default useCalc;

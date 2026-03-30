import { useCallback } from 'react';
import { UseFormSetError } from 'react-hook-form';
import { useAppDispatch } from '@front/stores';

import { FormType } from '@front/components/pages/TEST/form/TestForm';
import type { CalcTestApplicationRequest } from '@front/openapi/models';
import { ViewIdType } from '@front/stores/CALC/calc/calcStore';
import calcStore from '@front/stores/TEST/test/calcStore';


import { useClear as useClearAlertMessage, useSetAlertMessage } from '@front/hooks/alertMessage';
import { calcApi } from '@front/openapi';

export function useCalc(viewId: ViewIdType) {
    const clearAlertMessage = useClearAlertMessage(viewId);
    const setAlertMessage = useSetAlertMessage(viewId);
    const dispatch = useAppDispatch();

    return useCallback(
        async (data: CalcTestApplicationRequest, _: UseFormSetError<FormType>) => {
            clearAlertMessage();

            console.log('工数計算前のdata', data)
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

            dispatch(
                calcStore.actions.setCalc({
                    ...data,
                    ...calcResultData,
                })
            );
            // 正常メッセージの表示
            setAlertMessage({ severity: 'success', message: '工数を出力しました。' });   
            console.log('工数計算後のresponse', response);

            return calcResultData;
        },
        [clearAlertMessage, setAlertMessage, dispatch]
    );
}

export default useCalc;

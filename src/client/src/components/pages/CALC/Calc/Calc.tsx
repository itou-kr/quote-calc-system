import { memo } from 'react';

import { useTypedSelector } from '@front/stores';
import CalcForm from '@front/components/pages/CALC/form/CalcForm'
import { createDataFunctions } from '@front/types/functionTypes';


const Calc = memo (() => {
    const data = useTypedSelector((state) => state.calc.data)
    const { isDirty } = useTypedSelector((state) => state.calc);

    const processRatios = {
        basicDesign: data?.processRatios?.basicDesign ?? 0,
        detailedDesign: data?.processRatios?.detailedDesign ?? 0,
        implementation: data?.processRatios?.implementation ?? 0,
        integrationTest: data?.processRatios?.integrationTest ?? 0,
        systemTest: data?.processRatios?.systemTest ?? 0,
    };

    const processManMonths = {
        basicDesign: data?.processManMonths?.basicDesign ?? 0,
        detailedDesign: data?.processManMonths?.detailedDesign ?? 0,
        implementation: data?.processManMonths?.implementation ?? 0,
        integrationTest: data?.processManMonths?.integrationTest ?? 0,
        systemTest: data?.processManMonths?.systemTest ?? 0,
    };

    const processDurations = {
        basicDesign: data?.processDurations?.basicDesign ?? 0,
        detailedDesign: data?.processDurations?.detailedDesign ?? 0,
        implementation: data?.processDurations?.implementation ?? 0,
        integrationTest: data?.processDurations?.integrationTest ?? 0,
        systemTest: data?.processDurations?.systemTest ?? 0,
    }

    // const mappedDataFunctions =
    // data?.dataFunctions?.map(df => ({
    //     name: df.name,
    //     fpValue: df.fpValue,
    //     remarks: df.remarks,
    //     selected: df.selected ?? false,
    //     updateType: {
    //     label: df.updateType ?? '',
    //     value: df.updateType ?? '',
    //     }
    // }));

    const mappedDataFunctions =
    data?.dataFunctions?.map(df => ({
        name: df.name,
        fpValue: df.fpValue,
        remarks: df.remarks,
        selected: df.selected ?? false,
        updateType: df.updateType
        ? {
            label: df.updateType,
            value: df.updateType,
            }
        : null,
    }));

    return (
        // <Container disableGutters sx={{ height: '100%' }}>
            <CalcForm 
                viewId="CALC" 
                isDirty={isDirty} 
                data={{
                    ...data, 
                    projectName: data?.projectName ?? '',
                    productivityFPPerMonth: data?.productivityFPPerMonth ?? 0,
                    processRatios: processRatios,
                    processManMonths: processManMonths,
                    processDurations: processDurations,
                    projectType: { label: '新規開発', value: 'NEW' },
                    ipaValueType: { label: '中央値', value: 'MEDIAN' },
                    dataFunctions: mappedDataFunctions ?? createDataFunctions(50),
                }}
            />
        // </Container>
    );
});

export default Calc; 
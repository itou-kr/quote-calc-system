import { memo } from 'react';

// import { RootState, useTypedSelector } from '@front/stores';
import { useTypedSelector } from '@front/stores';
import CalcForm from '@front/components/pages/CALC/form/CalcForm'
// import { createDataFunctions } from '@front/types/functionTypes';
// import { useGetUpdateType } from '@front/hooks/consts';
// import { useTranslation } from 'react-i18next';
// import { useSelector } from 'react-redux';
// import { useGetProjectType, useGetIpaValueType } from '@front/hooks/consts';


const Calc = memo (() => {
    // const calcData = useSelector((state: RootState) => state.calc)
    // const { data, isDirty } = useTypedSelector((state) => state.calc);
    const { isDirty } = useTypedSelector((state) => state.calc);

    
    // const processRatios = {
    //     basicDesign: data?.processRatios?.basicDesign ?? 0,
    //     detailedDesign: data?.processRatios?.detailedDesign ?? 0,
    //     implementation: data?.processRatios?.implementation ?? 0,
    //     integrationTest: data?.processRatios?.integrationTest ?? 0,
    //     systemTest: data?.processRatios?.systemTest ?? 0,
    // };

    // const processManMonths = {
    //     basicDesign: data?.processManMonths?.basicDesign ?? 0,
    //     detailedDesign: data?.processManMonths?.detailedDesign ?? 0,
    //     implementation: data?.processManMonths?.implementation ?? 0,
    //     integrationTest: data?.processManMonths?.integrationTest ?? 0,
    //     systemTest: data?.processManMonths?.systemTest ?? 0,
    // };

    // const processDurations = {
    //     basicDesign: data?.processDurations?.basicDesign ?? 0,
    //     detailedDesign: data?.processDurations?.detailedDesign ?? 0,
    //     implementation: data?.processDurations?.implementation ?? 0,
    //     integrationTest: data?.processDurations?.integrationTest ?? 0,
    //     systemTest: data?.processDurations?.systemTest ?? 0,
    // }

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
    // const { t } = useTranslation();

    // const getUpdateTypes = useGetUpdateType(t);
    // const getProjectTypes = useGetProjectType(t);
    // const getIpaValueType = useGetIpaValueType(t);

    // const updateTypeOptions = getUpdateTypes();
    // const projectTypeOptions = getProjectTypes();
    // const ipaValueTypeOptions = getIpaValueType();
        
//     const projectTypeLabel =
//         projectTypeOptions.find(
//             (v) => v.value === calcData.data?.projectType
//         )?.label ?? '新規開発';

// const ipaValueTypeLabel =
//         ipaValueTypeOptions.find(
//             (v) => v.value === calcData.data?.ipaValueType
//         )?.label ?? '中央値';    
    
//     const mappedDataFunctions =
//         data?.dataFunctions?.map(df => ({
//             name: df.name,
//             fpValue: df.fpValue,
//             remarks: df.remarks,
//             selected: df.selected ?? false,
//             updateType: updateTypeOptions.find(
//                 option => option.value === df.updateType
//             ) ?? null,
//     }));
//     console.log(data?.dataFunctions, 'Calc.tsxのdataFunctions')

    return (
        // <Container disableGutters sx={{ height: '100%' }}>
            <CalcForm 
                viewId="CALC" 
                isDirty={isDirty} 
            />
        // </Container>
    );
});

export default Calc; 
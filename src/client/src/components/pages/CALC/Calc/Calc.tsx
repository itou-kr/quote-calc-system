import { memo } from 'react';

import { useTypedSelector } from '@front/stores';
import CalcForm from '@front/components/pages/CALC/form/CalcForm'


const Calc = memo (() => {
    const { isDirty } = useTypedSelector((state) => state.test);
    return (
        <CalcForm viewId="CALC" isDirty={isDirty}/>
    );
});

export default Calc; 
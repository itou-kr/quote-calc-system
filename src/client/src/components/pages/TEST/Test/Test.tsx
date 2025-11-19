import { memo } from 'react';

import { useTypedSelector } from '@front/stores';
import TestForm from '@front/components/pages/TEST/form/TestForm'


const Test = memo (() => {
    const { isDirty } = useTypedSelector((state) => state.test);
    return (
        <TestForm viewId="TEST" isDirty={isDirty}/>
    );
});

export default Test; 
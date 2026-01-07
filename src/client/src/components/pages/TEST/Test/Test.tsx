import { memo } from 'react';

import { useTypedSelector } from '@front/stores';
import TestForm from '@front/components/pages/TEST/form/TestForm'
import { Container } from '@mui/system';
// import { FormType } from '@front/components/pages/TEST/form/TestForm';


const Test = memo (() => {
    const data = useTypedSelector((state) => state.calc.data)
    const { isDirty } = useTypedSelector((state) => state.test);

    // if (!data) {
    //     return null;
    // }

    return (
        <Container disableGutters sx={{ height: '100%' }}>
            <TestForm 
                viewId="TEST" 
                isDirty={isDirty} 
                data={{
                    ...data,                    
                    projectName: data?.projectName ?? '',
                    productivityFPPerMonth: data?.productivityFPPerMonth ?? 0,
                }}
            />
        </Container>
    );
});

export default Test; 
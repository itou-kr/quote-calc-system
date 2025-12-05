import { memo } from 'react';

import { useTypedSelector } from '@front/stores';
import TestForm from '@front/components/pages/TEST/form/TestForm'
import { Container } from '@mui/system';



const Test = memo (() => {
    const data = useTypedSelector((state) => state.calc.data)
    const { isDirty } = useTypedSelector((state) => state.test);
    return (
        <Container disableGutters sx={{ height: '100%' }}>
            <TestForm viewId="TEST" isDirty={isDirty} data={data}/>
        </Container>
    );
});

export default Test; 
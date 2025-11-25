import { memo } from 'react';

import { useTypedSelector } from '@front/stores';
import TestForm from '@front/components/pages/TEST/form/TestForm'
import { Container } from '@mui/system';


const Test = memo (() => {
    const { isDirty } = useTypedSelector((state) => state.test);
    return (
        <Container disableGutters sx={{ height: '100%' }}>
            <TestForm viewId="TEST" isDirty={isDirty}/>
        </Container>
    );
});

export default Test; 
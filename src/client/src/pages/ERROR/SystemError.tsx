import { useMemo } from 'react';
import type { ReactElement } from 'react';
import { FallbackProps } from 'react-error-boundary';
import { Container, Alert, AlertTitle } from '@mui/material';

import StyleMessageAutoLineBreak from '@front/components/styles/StyleMessageAutoLineBreak';
import { errorMessage } from '@front/utils/errorMessage';

function SystemError(props: FallbackProps): ReactElement {
    const { error } = props;

    const checkError = useMemo(() => {
        const message = errorMessage(error);
        if (message) {
            return message;
        }
        return { message: 'unexpected error' };
    }, [error]);

    return (
        <Container disableGutters>
            <Alert severity="error">
                <AlertTitle>System Error</AlertTitle>
                <StyleMessageAutoLineBreak>
                    {checkError.message}
                </StyleMessageAutoLineBreak>
            </Alert>
        </Container>
    );
}

export default SystemError;
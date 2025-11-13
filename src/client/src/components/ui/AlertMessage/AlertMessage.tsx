import { useMemo } from 'react';
import { Container, AlertTitle } from '@mui/material';
import MuiAlert, { AlertColor } from '@mui/material/Alert';

import { ViewId } from '@front/types';
import { useTypedSelector } from '@front/stores'
import { AlertMessageType } from '@front/stores/alertMessageStore';
import StyleMessageAutoLineBreak from '@front/components/styles/StyledMessageAutoLineBreak';

type Props = {
    viewId: ViewId;
};

function Alert ({ severity, message }: { severity: AlertColor; message: AlertMessageType }) {
    return (
        <MuiAlert severity={severity} icon={message.icon ? undefined: false} sx={{ marginBottom: (theme) => theme.spacing(1) }}>
            {message.title && <AlertTitle>{message.title === 'boolean' ? 'error': message.title}</AlertTitle>}
            <StyleMessageAutoLineBreak sx={{ margin: 0 }}>{message.message.join('\n')}</StyleMessageAutoLineBreak>
        </MuiAlert>
    );
}

function AlertMessage({ viewId }: Props) {
    const {
        messages: { [viewId]: message },
    } = useTypedSelector((state) => state.alertMessage);

    const alertMessage = useMemo(() => {
        if (message && (message.error || message.warning || message.info ||message.success)) {
            return (
                <Container disableGutters>
                    {message.error && <Alert severity="error" message={message.error} />}
                    {message.warning && <Alert severity="warning" message={message.warning} />}
                    {message.info && <Alert severity="info" message={message.info} />}
                    {message.success && <Alert severity="success" message={message.success} />}
                </Container>
            );
        }
        return undefined;
    }, [message]);

    return alertMessage;
}

export default AlertMessage;
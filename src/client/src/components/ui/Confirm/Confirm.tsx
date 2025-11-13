import { useTranslation } from 'react-i18next';
import { Grid2 as Grid, DialogContentText } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import HelpIcon from '@mui/icons-material/Help';

import Dialog, { Content, Actions } from '@front/components/ui/Dialog';
import Button from '@front/components/ui/Button';

export type ConfirmResultYes = 'yes';
export type ConfirmResultNo = 'no';
export type ConfirmResultCancel = 'cancel';

type Props = {
    open?: boolean;
    title?: React.ReactNode;
    icon?: 'error' | 'warning' | 'info' | 'help';
    message: React.ReactNode;
    yes?: { label: React.ReactNode; on: (value: ConfirmResultYes) => void };
    no?: { label: React.ReactNode; on: (value: ConfirmResultNo) => void };
    cancel?: { label: React.ReactNode; on: (value: ConfirmResultCancel) => void };
    close?: boolean;
    onClose: () => void;
};

function Confirm(props: Props) {
    const { t } = useTranslation();
    const { open, title, icon, message, yes, no, cancel, close, onClose } = props;
    const isClose = close || (!yes?.label && !no?.label && !cancel?.label);

    const handleYes = () => {
        if (yes) {
            yes.on('yes');
        }
    };

    const handleNo = () => {
        if (no) {
            no.on('no');
        }
    };

    const handleCancel = () => {
        if (cancel) {
            cancel.on('cancel');
        }
    };

    const handleClose = () => {
        onClose();
    };

    return (
        <Dialog open={!!open} title={title} sx={(theme) => ({ zIndex: theme.zIndex.modal + 20 })} onClose={isClose ? handleClose : undefined}>
            <Content noDividers>
                <Grid container direction="row" alignItems="center" wrap="wrap" spacing={1}>
                    {icon && (
                        <Grid size="auto">
                            {icon === 'error' && <ErrorIcon color="error" fontSize="large" />}
                            {icon === 'warning' && <WarningIcon color="warning" fontSize="large" />}
                            {icon === 'info' && <InfoIcon color="info" fontSize="large" />}
                            {icon === 'help' && <HelpIcon color="primary" fontSize="large" />}
                        </Grid>
                    )}
                    <Grid size="grow">
                        <DialogContentText>{message}</DialogContentText>
                    </Grid>
                </Grid>
            </Content>
            <Actions>
                {yes && !(typeof yes.label === 'boolean' && yes.label === false) && (
                    <Button variant="outlined" onClick={handleYes}>
                        {typeof yes.label === 'boolean' ? 'OK' : yes.label}
                    </Button>
                )}
                {no && !(typeof no.label === 'boolean' && no.label === false) && (  
                    <Button variant="outlined" onClick={handleNo}>
                        {typeof no.label === 'boolean' ? t('No') : no.label}
                    </Button>
                )}
                {cancel && !(typeof cancel.label === 'boolean' && cancel.label === false) && (
                    <Button variant="outlined" onClick={handleCancel}>
                        {typeof cancel.label === 'boolean' ? t('Cancel') : cancel.label}
                    </Button>
                )}
            </Actions>
        </Dialog>
    );
}

export default Confirm;
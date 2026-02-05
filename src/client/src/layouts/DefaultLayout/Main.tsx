import { memo, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Outlet as MainContent } from 'react-router-dom';
import { Grid2 as Grid } from '@mui/material';
import AlertMessage from '@front/components/ui/AlertMessage';
import { useClear as useClearAlertMessage } from '@front/hooks/alertMessage';
import Header from './Header';

const useViewId = () => {
    const location = useLocation();
    return useMemo(() => (location.pathname.split('/')[1] || 'HOME').toUpperCase(), [location]);
}

const Main = memo(() => {
    const viewId = useViewId();
    const clearAlertMessage = useClearAlertMessage(viewId);

    useEffect(() => {
        clearAlertMessage();
    }, [clearAlertMessage]);

    return (
        <Grid size="grow">
            <Header />
            <AlertMessage viewId={viewId} />
            <MainContent />
        </Grid>
    );
});

export default Main;
import { memo } from 'react';
import { Container } from '@mui/material';
import { useTranslation } from 'react-i18next';

const NotFoundError = memo(() => {
    const { t } = useTranslation();
    return <Container>{t('TESTTTT')}</Container>;
});

export default NotFoundError;
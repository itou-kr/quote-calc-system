import { useMemo } from 'react';
import { RouterProvider as RouterDomRouterProvider } from 'react-router-dom';
import { useMenuContext } from '@front/hooks/contexts';
import { createRouter } from '@front/routes';

function RouterProvider() {
    const { menu } = useMenuContext();

    const router = useMemo(() => {
        const views = menu?.items //
        return createRouter(views || []);
    }, [menu]);

    return <RouterDomRouterProvider router={router} future={{ v7_startTransition: true }} />;
}

export default RouterProvider;

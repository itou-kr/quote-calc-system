import { useMemo } from 'react';
import { RouterProvider as RouterDomRouterProvider } from 'react-router-dom';
import { useMenuContext } from '@front/hooks/contexts';
import { createRouter } from '@front/routes';

function RouterProvider() {
    const { menu } = useMenuContext();

    // Memoize router based on stringified menu items to avoid unnecessary recreations
    const router = useMemo(() => {
        const views = menu?.items || [];
        return createRouter(views);
    }, [JSON.stringify(menu?.items)]);

    return <RouterDomRouterProvider router={router} future={{ v7_startTransition: true }} />;
}

export default RouterProvider;

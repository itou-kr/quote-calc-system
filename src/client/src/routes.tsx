import { lazy, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { createBrowserRouter } from "react-router-dom";

import NowLoading from '@front/components/ui/NowLoading';
import DefaultLayout from '@front/layouts/DefaultLayout';
import { NotFoundError, SystemError } from '@front/pages/ERROR';

function LazyPage({ viewId }: { viewId: string }) {
    const Component = lazy(() => import(`./pages/${viewId}/index.ts`));
    return (
        <Suspense fallback={<NowLoading vertical fullHeight />}>
            <Component />
        </Suspense>
    );
}

function getRoutes(menu: { viewId: string }[]) {
    const children = menu.map(({ viewId }) => ({
        path: viewId,
        element: <LazyPage viewId={viewId} />,
    }));

    // example static route still present in original file
    // example static route still present in original file
    children.push({
        path: "TEST",
        element: <LazyPage viewId="TEST" />,
    });
    return children;
}

/**
 * 取得したメニューを基にルート設定する
 * @returns
 */
export function createRouter(menu: { viewId: string }[]) {
    const routes = getRoutes(menu);
    return createBrowserRouter(
        [
            {
                path: '/',
                element: (
                    <ErrorBoundary FallbackComponent={SystemError}>
                        <DefaultLayout />
                    </ErrorBoundary>
                ),
                children: routes,
            },
            {
                path: '*',
                element: <NotFoundError />,
            },
        ],
        {
            future: {
                v7_relativeSplatPath: true,
                v7_fetcherPersist: true,
                v7_normalizeFormMethod: true,
                v7_skipActionErrorRevalidation: true,
                v7_partialHydration: true,
            },
        }
    );
}
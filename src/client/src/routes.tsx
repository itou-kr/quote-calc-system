import { lazy, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { createBrowserRouter, RouteObject } from "react-router-dom";

// import NowLoading from '@front/components/ui/NowLoading';
import DefaultLayout from '@front/layouts/DefaultLayout';
import { NotFoundError, SystemError } from '@front/pages/ERROR';
// import TEST from './pages/TEST';

type MainContentProps = {
    component: ReturnType<typeof lazy>
};

function MainContent({ component: Component }: MainContentProps) {
    return (
        <Suspense>
            <Component />
        </Suspense>
    );
}

const lazyComponent = (viewId: string) => lazy(() => import(`./pages/${viewId}/index.ts`));

function getRoutes(menu: { viewId: string }[]): RouteObject[] {
    const routes = menu //
        .map(({ viewId }) => ({
            path: viewId,
            element: <MainContent component={lazyComponent(viewId)} />,
        }));

    return [
        {
            path: 'TEST',
            element: <MainContent component={lazyComponent('TEST')} />,
        },
        {
            path: 'CALC',
            element: <MainContent component={lazyComponent('CALC')} />,
        },
        ...routes,
    ];
}

/**
 * 取得したメニューを基にルート設定する
 * @returns
 */
export function createRouter(menu: { viewId: string }[]) {
    const routes = getRoutes(menu);
    console.log(routes);
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
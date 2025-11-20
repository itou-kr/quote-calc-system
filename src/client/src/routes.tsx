import { lazy, memo, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { createBrowserRouter, RouteObject } from "react-router-dom";

// import NowLoading from '@front/components/ui/NowLoading';
import DefaultLayout from '@front/layouts/DefaultLayout';
import { NotFoundError, SystemError } from '@front/pages/ERROR';
// import TEST from './pages/TEST';

type MainContentProps = {
    component: ReturnType<typeof lazy>
};

// Memoize MainContent to prevent unnecessary re-renders
const MainContent = memo(({ component: Component }: MainContentProps) => {
    return (
        <Suspense>
            <Component />
        </Suspense>
    );
});

// Cache lazy components to avoid recreating them
const lazyComponentCache = new Map<string, ReturnType<typeof lazy>>();
const lazyComponent = (viewId: string) => {
    if (!lazyComponentCache.has(viewId)) {
        lazyComponentCache.set(viewId, lazy(() => import(`./pages/${viewId}/index.ts`)));
    }
    return lazyComponentCache.get(viewId)!;
};

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
            path: 'TESTNawa',
            element: <MainContent component={lazyComponent('TESTNawa')} />,
        },
        {
            path: 'TESTNawaClaude',
            element: <MainContent component={lazyComponent('TESTNawaClaude')} />,
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
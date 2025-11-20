import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

type Props = {
    children: React.ReactNode;
};

// Create a client with optimized defaults for caching
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Cache for 5 minutes
            staleTime: 5 * 60 * 1000,
            // Keep cached data for 10 minutes
            gcTime: 10 * 60 * 1000,
            // Retry failed requests once
            retry: 1,
            // Don't refetch on window focus by default (can be overridden per query)
            refetchOnWindowFocus: false,
        },
    },
});

function QueryProvider({ children }: Props) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

export default QueryProvider;

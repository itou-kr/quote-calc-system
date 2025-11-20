import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

/**
 * API クエリのカスタムフック
 * React Query を使用してデータフェッチングをキャッシュする
 * 
 * @example
 * const { data, isLoading, error } = useApiQuery(
 *   ['users', userId],
 *   () => fetchUser(userId),
 *   { staleTime: 5 * 60 * 1000 }
 * );
 */
export function useApiQuery<TData = unknown, TError = Error>(
    queryKey: string | readonly unknown[],
    queryFn: () => Promise<TData>,
    options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>
) {
    return useQuery<TData, TError>({
        queryKey: Array.isArray(queryKey) ? queryKey : [queryKey],
        queryFn,
        ...options,
    });
}

/**
 * API ミューテーションのカスタムフック
 * React Query を使用してデータ更新を管理する
 * 
 * @example
 * const { mutate, isLoading } = useApiMutation(
 *   (data) => updateUser(userId, data),
 *   {
 *     onSuccess: () => {
 *       queryClient.invalidateQueries(['users', userId]);
 *     }
 *   }
 * );
 */
export function useApiMutation<TData = unknown, TError = Error, TVariables = void>(
    mutationFn: (variables: TVariables) => Promise<TData>,
    options?: Omit<UseMutationOptions<TData, TError, TVariables>, 'mutationFn'>
) {
    return useMutation<TData, TError, TVariables>({
        mutationFn,
        ...options,
    });
}


// ============================================
// REACT QUERY HOOKS - MURAT DEMİRHAN
// Client-side caching & data management
// ============================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiDataService, DEFAULT_DATA } from './siteData';

// Keys for query caching
export const QUERY_KEYS = {
    all: ['siteData'],
    artworks: ['artworks'],
    exhibitions: ['exhibitions'],
    settings: ['settings'],
    messages: ['messages']
};

// Main hook to fetch all public data
export function usePublicDataQuery() {
    return useQuery({
        queryKey: QUERY_KEYS.all,
        queryFn: async () => {
            console.log('[React Query] Fetching fresh data...');
            const data = await ApiDataService.load();
            return data;
        },
        // Data considered fresh for 10 minutes (no refetch on navigate)
        staleTime: 10 * 60 * 1000,
        // Data kept in memory for 30 minutes
        cacheTime: 30 * 60 * 1000,
        // Using initial data to prevent null crashes
        placeholderData: DEFAULT_DATA
    });
}

// Admin hooks for mutations (invalidates cache automatically)
export function useAdminMutations() {
    const queryClient = useQueryClient();

    const invalidateAll = () => {
        console.log('[React Query] Invalidating cache...');
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.all });
    };

    return { invalidateAll };
}

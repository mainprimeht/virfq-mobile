import { create } from 'zustand';
import { api } from '../services/api';
import type { RFQ, RFQFilters } from '../types';

interface RFQState {
  rfqs: RFQ[];
  currentRFQ: RFQ | null;
  isLoading: boolean;
  error: string | null;
  page: number;
  hasMore: boolean;
  filters: RFQFilters;
  
  // Actions
  fetchRFQs: (filters?: RFQFilters) => Promise<void>;
  loadMore: () => Promise<void>;
  fetchRFQDetail: (id: string) => Promise<void>;
  setFilters: (filters: RFQFilters) => void;
  clearFilters: () => void;
  clearError: () => void;
}

const DEFAULT_LIMIT = 20;

export const useRFQStore = create<RFQState>((set, get) => ({
  rfqs: [],
  currentRFQ: null,
  isLoading: false,
  error: null,
  page: 1,
  hasMore: true,
  filters: {},

  fetchRFQs: async (filters?: RFQFilters) => {
    set({ isLoading: true, error: null });
    try {
      const currentFilters = filters || get().filters;
      const response = await api.getRFQs({
        ...currentFilters,
        page: 1,
        limit: DEFAULT_LIMIT,
      });
      
      set({
        rfqs: response.data,
        page: 1,
        hasMore: response.pagination.hasMore,
        filters: currentFilters,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch RFQs',
        isLoading: false,
      });
    }
  },

  loadMore: async () => {
    const { isLoading, hasMore, page, filters, rfqs } = get();
    
    if (isLoading || !hasMore) return;
    
    set({ isLoading: true, error: null });
    try {
      const nextPage = page + 1;
      const response = await api.getRFQs({
        ...filters,
        page: nextPage,
        limit: DEFAULT_LIMIT,
      });
      
      set({
        rfqs: [...rfqs, ...response.data],
        page: nextPage,
        hasMore: response.pagination.hasMore,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to load more RFQs',
        isLoading: false,
      });
    }
  },

  fetchRFQDetail: async (id: string) => {
    set({ isLoading: true, error: null, currentRFQ: null });
    try {
      const rfq = await api.getRFQDetail(id);
      set({
        currentRFQ: rfq,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch RFQ detail',
        isLoading: false,
      });
    }
  },

  setFilters: (filters: RFQFilters) => {
    set({ filters });
  },

  clearFilters: () => {
    set({ filters: {} });
  },

  clearError: () => set({ error: null }),
}));

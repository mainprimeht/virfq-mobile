import { create } from 'zustand';
import * as api from '../services/api';
import type { RFQ, RFQDetail, RFQAccess, RFQFilters } from '../types';

interface RFQState {
  rfqs: RFQ[];
  currentRFQ: RFQDetail | null;
  currentAccess: RFQAccess | null;
  filters: RFQFilters | null;
  
  // Pagination
  page: number;
  hasNextPage: boolean;
  isLoading: boolean;
  isLoadingMore: boolean;
  
  // Filter state
  searchQuery: string;
  selectedCategory: string;
  selectedCountry: string;
  selectedIncoterm: string;
  
  // Actions
  fetchRFQs: (refresh?: boolean) => Promise<void>;
  loadMore: () => Promise<void>;
  fetchRFQDetail: (id: string) => Promise<void>;
  unlockRFQ: (id: string) => Promise<any>;
  fetchFilters: () => Promise<void>;
  setSearch: (query: string) => void;
  setCategory: (category: string) => void;
  setCountry: (country: string) => void;
  setIncoterm: (incoterm: string) => void;
  clearFilters: () => void;
}

export const useRFQStore = create<RFQState>((set, get) => ({
  rfqs: [],
  currentRFQ: null,
  currentAccess: null,
  filters: null,
  page: 1,
  hasNextPage: false,
  isLoading: false,
  isLoadingMore: false,
  searchQuery: '',
  selectedCategory: '',
  selectedCountry: '',
  selectedIncoterm: '',

  fetchRFQs: async (refresh = false) => {
    const state = get();
    if (state.isLoading && !refresh) return;
    
    set({ isLoading: true, page: 1 });
    
    try {
      const result = await api.getRFQList({
        page: 1,
        limit: 12,
        q: state.searchQuery || undefined,
        category: state.selectedCategory || undefined,
        country: state.selectedCountry || undefined,
        incoterm: state.selectedIncoterm || undefined,
      });
      
      set({
        rfqs: result.rfqs,
        page: 1,
        hasNextPage: result.pagination.hasNextPage,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  loadMore: async () => {
    const state = get();
    if (state.isLoadingMore || !state.hasNextPage) return;
    
    set({ isLoadingMore: true });
    
    try {
      const nextPage = state.page + 1;
      const result = await api.getRFQList({
        page: nextPage,
        limit: 12,
        q: state.searchQuery || undefined,
        category: state.selectedCategory || undefined,
        country: state.selectedCountry || undefined,
        incoterm: state.selectedIncoterm || undefined,
      });
      
      set({
        rfqs: [...state.rfqs, ...result.rfqs],
        page: nextPage,
        hasNextPage: result.pagination.hasNextPage,
        isLoadingMore: false,
      });
    } catch (error) {
      set({ isLoadingMore: false });
      throw error;
    }
  },

  fetchRFQDetail: async (id: string) => {
    set({ isLoading: true, currentRFQ: null, currentAccess: null });
    
    try {
      const result = await api.getRFQDetail(id);
      set({
        currentRFQ: result.rfq,
        currentAccess: result.access,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  unlockRFQ: async (id: string) => {
    const result = await api.unlockRFQ(id);
    
    // Refresh the current RFQ to get updated contact info
    const state = get();
    if (state.currentRFQ?.id === id) {
      const refreshed = await api.getRFQDetail(id);
      set({
        currentRFQ: refreshed.rfq,
        currentAccess: refreshed.access,
      });
    }
    
    return result;
  },

  fetchFilters: async () => {
    try {
      const filters = await api.getRFQFilters();
      set({ filters });
    } catch (error) {
      console.error('Failed to fetch filters:', error);
    }
  },

  setSearch: (query: string) => {
    set({ searchQuery: query });
  },

  setCategory: (category: string) => {
    set({ selectedCategory: category });
  },

  setCountry: (country: string) => {
    set({ selectedCountry: country });
  },

  setIncoterm: (incoterm: string) => {
    set({ selectedIncoterm: incoterm });
  },

  clearFilters: () => {
    set({
      searchQuery: '',
      selectedCategory: '',
      selectedCountry: '',
      selectedIncoterm: '',
    });
  },
}));

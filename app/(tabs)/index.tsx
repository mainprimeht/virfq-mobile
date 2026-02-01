import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { RFQCard, TextInput, FilterModal, FilterChips } from '../../components';
import { useRFQStore } from '../../store';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius } from '../../constants';
import type { RFQ } from '../../types';

// Sample filter data - in production, fetch from API
const CATEGORIES = [
  { id: 'coffee', label: 'Cà phê' },
  { id: 'pepper', label: 'Tiêu' },
  { id: 'cashew', label: 'Điều' },
  { id: 'rice', label: 'Gạo' },
  { id: 'rubber', label: 'Cao su' },
  { id: 'seafood', label: 'Hải sản' },
  { id: 'fruits', label: 'Trái cây' },
  { id: 'vegetables', label: 'Rau củ' },
];

const COUNTRIES = ['USA', 'China', 'Japan', 'Korea', 'EU', 'India', 'UAE', 'Australia'];
const INCOTERMS = ['FOB', 'CIF', 'CFR', 'EXW', 'DDP', 'DAP'];

export default function RFQListScreen() {
  const { rfqs, isLoading, error, fetchRFQs, loadMore, hasMore } = useRFQStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedIncoterms, setSelectedIncoterms] = useState<string[]>([]);

  useEffect(() => {
    fetchRFQs();
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchRFQs();
    setRefreshing(false);
  }, [fetchRFQs]);

  const handleLoadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      loadMore();
    }
  }, [isLoading, hasMore, loadMore]);

  const handleRFQPress = useCallback((rfq: RFQ) => {
    router.push(`/rfq/${rfq.id}`);
  }, []);

  const handleApplyFilters = useCallback((filters: {
    categories: string[];
    countries: string[];
    incoterms: string[];
  }) => {
    setSelectedCategories(filters.categories);
    setSelectedCountries(filters.countries);
    setSelectedIncoterms(filters.incoterms);
    // In production, refetch with filters
    fetchRFQs();
  }, [fetchRFQs]);

  const handleClearFilters = useCallback(() => {
    setSelectedCategories([]);
    setSelectedCountries([]);
    setSelectedIncoterms([]);
    fetchRFQs();
  }, [fetchRFQs]);

  const totalFilters = selectedCategories.length + selectedCountries.length + selectedIncoterms.length;

  const filteredRFQs = rfqs.filter((rfq) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchTitle = rfq.titleEn.toLowerCase().includes(query);
      const matchCategory = rfq.productCategory?.nameEn?.toLowerCase().includes(query);
      if (!matchTitle && !matchCategory) return false;
    }
    return true;
  });

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={Colors.slate[400]} style={styles.searchIcon} />
        <TextInput
          placeholder="Tìm kiếm sản phẩm..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
          containerStyle={styles.searchInputContainer}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color={Colors.slate[400]} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Chips */}
      <FilterChips
        onOpenFilter={() => setFilterModalVisible(true)}
        selectedCount={totalFilters}
        onClearAll={totalFilters > 0 ? handleClearFilters : undefined}
      />
    </View>
  );

  const renderItem = useCallback(({ item }: { item: RFQ }) => (
    <View style={styles.cardContainer}>
      <RFQCard rfq={item} onPress={() => handleRFQPress(item)} locale="vi" />
    </View>
  ), [handleRFQPress]);

  const renderFooter = () => {
    if (!isLoading) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={Colors.primary[600]} />
      </View>
    );
  };

  const renderEmpty = () => {
    if (isLoading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="document-text-outline" size={64} color={Colors.slate[300]} />
        <Text style={styles.emptyTitle}>Không có RFQ nào</Text>
        <Text style={styles.emptyText}>
          {searchQuery || totalFilters > 0
            ? 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm'
            : 'Chưa có yêu cầu báo giá nào'}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredRFQs}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[Colors.primary[600]]}
            tintColor={Colors.primary[600]}
          />
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Filter Modal */}
      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        categories={CATEGORIES}
        countries={COUNTRIES}
        incoterms={INCOTERMS}
        selectedCategories={selectedCategories}
        selectedCountries={selectedCountries}
        selectedIncoterms={selectedIncoterms}
        onApply={handleApplyFilters}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.slate[50],
  },
  headerContainer: {
    backgroundColor: Colors.white,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.slate[100],
    marginBottom: Spacing.md,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    backgroundColor: Colors.slate[100],
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  searchInput: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    paddingHorizontal: 0,
  },
  searchInputContainer: {
    flex: 1,
    marginBottom: 0,
  },
  clearButton: {
    padding: Spacing.xs,
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: Spacing.xl,
  },
  cardContainer: {
    paddingHorizontal: Spacing.lg,
  },
  footer: {
    paddingVertical: Spacing.xl,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing['4xl'],
    paddingHorizontal: Spacing.xl,
  },
  emptyTitle: {
    fontSize: FontSize.h3,
    fontWeight: FontWeight.semiBold,
    color: Colors.slate[700],
    marginTop: Spacing.lg,
  },
  emptyText: {
    fontSize: FontSize.body,
    color: Colors.slate[500],
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
});

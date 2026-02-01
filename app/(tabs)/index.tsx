import React, { useEffect, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  Text,
  TextInput,
} from 'react-native';
import { router } from 'expo-router';
import { RFQCard, Loading } from '../../components';
import { useRFQStore, useAuthStore } from '../../store';
import { useI18n } from '../../i18n';
import { Colors, Spacing, FontSize, BorderRadius } from '../../constants';
import { Ionicons } from '@expo/vector-icons';
import type { RFQ } from '../../types';

export default function HomeScreen() {
  const { t, locale } = useI18n();
  const { isAuthenticated } = useAuthStore();
  const {
    rfqs,
    isLoading,
    isLoadingMore,
    hasNextPage,
    searchQuery,
    fetchRFQs,
    loadMore,
    setSearch,
  } = useRFQStore();

  useEffect(() => {
    fetchRFQs();
  }, []);

  const handleRefresh = useCallback(() => {
    fetchRFQs(true);
  }, [fetchRFQs]);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isLoadingMore) {
      loadMore();
    }
  }, [hasNextPage, isLoadingMore, loadMore]);

  const handleSearch = useCallback((text: string) => {
    setSearch(text);
  }, [setSearch]);

  const handleSearchSubmit = useCallback(() => {
    fetchRFQs(true);
  }, [fetchRFQs]);

  const handleRFQPress = useCallback((rfq: RFQ) => {
    if (!isAuthenticated) {
      router.push('/(auth)/login');
      return;
    }
    router.push(`/rfq/${rfq.id}`);
  }, [isAuthenticated]);

  const renderItem = useCallback(
    ({ item }: { item: RFQ }) => (
      <RFQCard
        rfq={item}
        onPress={() => handleRFQPress(item)}
        locale={locale}
      />
    ),
    [locale, handleRFQPress]
  );

  const renderEmpty = useCallback(
    () =>
      !isLoading ? (
        <View style={styles.emptyContainer}>
          <Ionicons
            name="document-text-outline"
            size={64}
            color={Colors.light.textMuted}
          />
          <Text style={styles.emptyText}>{t.rfq.noResults}</Text>
        </View>
      ) : null,
    [isLoading, t]
  );

  const renderFooter = useCallback(
    () =>
      isLoadingMore ? (
        <View style={styles.footerLoader}>
          <Loading text={t.common.loading} />
        </View>
      ) : null,
    [isLoadingMore, t]
  );

  if (isLoading && rfqs.length === 0) {
    return <Loading fullScreen text={t.common.loading} />;
  }

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons
            name="search-outline"
            size={20}
            color={Colors.light.textSecondary}
          />
          <TextInput
            style={styles.searchInput}
            placeholder={t.common.search}
            placeholderTextColor={Colors.light.textMuted}
            value={searchQuery}
            onChangeText={handleSearch}
            onSubmitEditing={handleSearchSubmit}
            returnKeyType="search"
          />
        </View>
      </View>

      {/* RFQ List */}
      <FlatList
        data={rfqs}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isLoading && rfqs.length > 0}
            onRefresh={handleRefresh}
            tintColor={Colors.light.primary}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  searchContainer: {
    padding: Spacing.md,
    backgroundColor: Colors.light.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    marginLeft: Spacing.sm,
    fontSize: FontSize.md,
    color: Colors.light.text,
  },
  listContent: {
    padding: Spacing.md,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl,
  },
  emptyText: {
    marginTop: Spacing.md,
    fontSize: FontSize.md,
    color: Colors.light.textSecondary,
  },
  footerLoader: {
    paddingVertical: Spacing.lg,
  },
});

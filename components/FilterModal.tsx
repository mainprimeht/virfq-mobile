import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSize, FontWeight, Shadows } from '../constants';
import { Button } from './Button';

interface FilterOption {
  id: string;
  label: string;
}

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  categories: FilterOption[];
  countries: string[];
  incoterms: string[];
  selectedCategories: string[];
  selectedCountries: string[];
  selectedIncoterms: string[];
  onApply: (filters: {
    categories: string[];
    countries: string[];
    incoterms: string[];
  }) => void;
}

export function FilterModal({
  visible,
  onClose,
  categories,
  countries,
  incoterms,
  selectedCategories: initialCategories,
  selectedCountries: initialCountries,
  selectedIncoterms: initialIncoterms,
  onApply,
}: FilterModalProps) {
  const [selectedCategories, setSelectedCategories] = useState(initialCategories);
  const [selectedCountries, setSelectedCountries] = useState(initialCountries);
  const [selectedIncoterms, setSelectedIncoterms] = useState(initialIncoterms);

  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const toggleCountry = (country: string) => {
    setSelectedCountries((prev) =>
      prev.includes(country) ? prev.filter((c) => c !== country) : [...prev, country]
    );
  };

  const toggleIncoterm = (incoterm: string) => {
    setSelectedIncoterms((prev) =>
      prev.includes(incoterm) ? prev.filter((i) => i !== incoterm) : [...prev, incoterm]
    );
  };

  const handleApply = () => {
    onApply({
      categories: selectedCategories,
      countries: selectedCountries,
      incoterms: selectedIncoterms,
    });
    onClose();
  };

  const handleReset = () => {
    setSelectedCategories([]);
    setSelectedCountries([]);
    setSelectedIncoterms([]);
  };

  const totalSelected =
    selectedCategories.length + selectedCountries.length + selectedIncoterms.length;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={Colors.slate[600]} />
          </TouchableOpacity>
          <Text style={styles.title}>Bộ lọc</Text>
          <TouchableOpacity onPress={handleReset} style={styles.resetButton}>
            <Text style={styles.resetText}>Đặt lại</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Categories */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Danh mục sản phẩm</Text>
            <View style={styles.chipContainer}>
              {categories.map((cat) => (
                <Pressable
                  key={cat.id}
                  style={[
                    styles.chip,
                    selectedCategories.includes(cat.id) && styles.chipSelected,
                  ]}
                  onPress={() => toggleCategory(cat.id)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      selectedCategories.includes(cat.id) && styles.chipTextSelected,
                    ]}
                  >
                    {cat.label}
                  </Text>
                  {selectedCategories.includes(cat.id) && (
                    <Ionicons name="checkmark" size={16} color={Colors.white} />
                  )}
                </Pressable>
              ))}
            </View>
          </View>

          {/* Countries */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quốc gia người mua</Text>
            <View style={styles.chipContainer}>
              {countries.map((country) => (
                <Pressable
                  key={country}
                  style={[
                    styles.chip,
                    selectedCountries.includes(country) && styles.chipSelected,
                  ]}
                  onPress={() => toggleCountry(country)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      selectedCountries.includes(country) && styles.chipTextSelected,
                    ]}
                  >
                    {country}
                  </Text>
                  {selectedCountries.includes(country) && (
                    <Ionicons name="checkmark" size={16} color={Colors.white} />
                  )}
                </Pressable>
              ))}
            </View>
          </View>

          {/* Incoterms */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Điều kiện giao hàng</Text>
            <View style={styles.chipContainer}>
              {incoterms.map((incoterm) => (
                <Pressable
                  key={incoterm}
                  style={[
                    styles.chip,
                    selectedIncoterms.includes(incoterm) && styles.chipSelected,
                  ]}
                  onPress={() => toggleIncoterm(incoterm)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      selectedIncoterms.includes(incoterm) && styles.chipTextSelected,
                    ]}
                  >
                    {incoterm}
                  </Text>
                  {selectedIncoterms.includes(incoterm) && (
                    <Ionicons name="checkmark" size={16} color={Colors.white} />
                  )}
                </Pressable>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <Button
            title={`Áp dụng${totalSelected > 0 ? ` (${totalSelected})` : ''}`}
            onPress={handleApply}
          />
        </View>
      </View>
    </Modal>
  );
}

interface FilterChipsProps {
  onOpenFilter: () => void;
  selectedCount: number;
  onClearAll?: () => void;
}

export function FilterChips({ onOpenFilter, selectedCount, onClearAll }: FilterChipsProps) {
  return (
    <View style={styles.filterChipsContainer}>
      <TouchableOpacity
        style={[styles.filterChip, selectedCount > 0 && styles.filterChipActive]}
        onPress={onOpenFilter}
      >
        <Ionicons
          name="filter"
          size={16}
          color={selectedCount > 0 ? Colors.white : Colors.slate[600]}
        />
        <Text
          style={[
            styles.filterChipText,
            selectedCount > 0 && styles.filterChipTextActive,
          ]}
        >
          Bộ lọc{selectedCount > 0 ? ` (${selectedCount})` : ''}
        </Text>
      </TouchableOpacity>

      {selectedCount > 0 && onClearAll && (
        <TouchableOpacity style={styles.clearButton} onPress={onClearAll}>
          <Text style={styles.clearText}>Xóa bộ lọc</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.slate[200],
  },
  closeButton: {
    padding: Spacing.xs,
  },
  title: {
    fontSize: FontSize.h3,
    fontWeight: FontWeight.semiBold,
    color: Colors.slate[900],
  },
  resetButton: {
    padding: Spacing.xs,
  },
  resetText: {
    fontSize: FontSize.body,
    color: Colors.primary[600],
    fontWeight: FontWeight.medium,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  section: {
    paddingVertical: Spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: Colors.slate[100],
  },
  sectionTitle: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.semiBold,
    color: Colors.slate[800],
    marginBottom: Spacing.md,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.slate[100],
    borderWidth: 1,
    borderColor: Colors.slate[200],
  },
  chipSelected: {
    backgroundColor: Colors.primary[600],
    borderColor: Colors.primary[600],
  },
  chipText: {
    fontSize: FontSize.body,
    color: Colors.slate[700],
  },
  chipTextSelected: {
    color: Colors.white,
    fontWeight: FontWeight.medium,
  },
  footer: {
    padding: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.slate[200],
    ...Shadows.md,
  },
  filterChipsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.slate[100],
    borderWidth: 1,
    borderColor: Colors.slate[200],
  },
  filterChipActive: {
    backgroundColor: Colors.primary[600],
    borderColor: Colors.primary[600],
  },
  filterChipText: {
    fontSize: FontSize.body,
    color: Colors.slate[600],
  },
  filterChipTextActive: {
    color: Colors.white,
  },
  clearButton: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  clearText: {
    fontSize: FontSize.body,
    color: Colors.error[600],
  },
});

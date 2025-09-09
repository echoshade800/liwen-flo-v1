import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, radii, spacing, typography } from '../theme/tokens';

interface PillChipsProps {
  options: string[];
  selected: string;
  onSelect: (option: string) => void;
}

/**
 * 时间段筛选组件 - Pill形状的选择器
 */
export default function PillChips({ options, selected, onSelect }: PillChipsProps) {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {options.map((option) => (
        <TouchableOpacity
          key={option}
          style={[
            styles.chip,
            option === selected && styles.selected
          ]}
          onPress={() => onSelect(option)}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.text,
            option === selected && styles.textSelected
          ]}>
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing(2),
    paddingVertical: spacing(1),
  },
  chip: {
    backgroundColor: colors.gray100,
    borderRadius: radii.pill,
    paddingHorizontal: spacing(2),
    paddingVertical: spacing(1),
    marginRight: spacing(1),
    borderWidth: 1,
    borderColor: colors.gray300,
  },
  selected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  text: {
    ...typography.caption,
    color: colors.text,
  },
  textSelected: {
    color: colors.white,
    fontWeight: '600',
  },
});
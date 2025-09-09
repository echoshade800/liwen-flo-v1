import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii, spacing, typography } from '../theme/tokens';

interface StatusBadgeProps {
  status: 'green' | 'yellow' | 'red';
  text: string;
}

/**
 * 状态标签组件 - 绿/黄/红状态 + 图标
 */
export default function StatusBadge({ status, text }: StatusBadgeProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'green':
        return { color: colors.green, icon: 'checkmark-circle' as const, bg: colors.green + '20' };
      case 'yellow':
        return { color: colors.yellow, icon: 'warning' as const, bg: colors.yellow + '20' };
      case 'red':
        return { color: colors.red, icon: 'alert-circle' as const, bg: colors.red + '20' };
    }
  };

  const config = getStatusConfig();

  return (
    <View style={[styles.container, { backgroundColor: config.bg }]}>
      <Ionicons name={config.icon} size={16} color={config.color} />
      <Text style={[styles.text, { color: config.color }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing(1.5),
    paddingVertical: spacing(0.5),
    borderRadius: radii.pill,
  },
  text: {
    ...typography.small,
    fontWeight: '600',
    marginLeft: spacing(0.5),
  },
});
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radii, spacing, typography } from '../theme/tokens';

interface ReassuranceCardProps {
  title: string;
  content: string;
}

/**
 * 正向反馈卡片 - 仅在问卷阶段显示
 * 粉色背景、简短安抚文本 + 知识点
 */
export default function ReassuranceCard({ title, content }: ReassuranceCardProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.content}>{content}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    borderRadius: radii.card,
    padding: spacing(2),
    marginTop: spacing(1),
    marginHorizontal: spacing(1),
  },
  title: {
    ...typography.caption,
    color: colors.white,
    fontWeight: '600',
    marginBottom: spacing(0.5),
  },
  content: {
    ...typography.small,
    color: colors.white,
    lineHeight: 16,
  },
});
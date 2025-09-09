import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, radii, spacing, typography } from '../theme/tokens';

interface EmojiOptionProps {
  emoji: string;
  text: string;
  selected: boolean;
  onPress: () => void;
  multiSelect?: boolean;
}

/**
 * Emoji选项组件 - 圆角pill样式，支持单选/多选
 */
export default function EmojiOption({ emoji, text, selected, onPress, multiSelect = false }: EmojiOptionProps) {
  return (
    <TouchableOpacity 
      style={[
        styles.container,
        selected && styles.selected
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={[styles.text, selected && styles.textSelected]}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray100,
    borderRadius: radii.pill,
    paddingHorizontal: spacing(2),
    paddingVertical: spacing(1),
    margin: spacing(0.5),
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selected: {
    backgroundColor: colors.primary + '20',
    borderColor: colors.primary,
  },
  emoji: {
    fontSize: 18,
    marginRight: spacing(1),
  },
  text: {
    ...typography.caption,
    color: colors.text,
  },
  textSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
});
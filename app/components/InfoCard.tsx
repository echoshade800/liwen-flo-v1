import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, radii, spacing, typography } from '../theme/tokens';

interface Props {
  title: string;
  body?: string;
  image?: any;
  actions?: { id: string; label: string; kind?: 'primary' | 'secondary' }[];
  onNext: () => void;
  onActionPress?: (id: string) => void;
}

export default function InfoCard({ title, body, image, actions, onNext, onActionPress }: Props) {
  return (
    <View style={styles.container}>
      {image && <Image source={image} style={styles.image} resizeMode="contain" />}
      
      <Text style={styles.title}>{title}</Text>
      
      {body && <Text style={styles.body}>{body}</Text>}
      
      {actions && actions.length > 0 && (
        <View style={styles.actionsContainer}>
          {actions.map((action) => (
          <TouchableOpacity
            key={action.id}
            onPress={() => {
              if (onActionPress) {
                onActionPress(action.id);
              }
            }}
            style={[
              styles.actionButton,
              action.kind === 'secondary' ? styles.secondaryButton : styles.primaryButton
            ]}
          >
              <Text style={[
                styles.actionText,
                action.kind === 'secondary' ? styles.secondaryText : styles.primaryText
              ]}>
                {action.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      
      <TouchableOpacity onPress={onNext} style={[styles.nextButton]}>
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: radii.card,
    padding: spacing(3),
    marginBottom: spacing(2),
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 160,
    marginBottom: spacing(2),
  },
  title: {
    ...typography.h3,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing(1),
    lineHeight: 28,
  },
  body: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing(2),
  },
  actionsContainer: {
    width: '100%',
    marginBottom: spacing(2),
  },
  actionButton: {
    width: '100%',
    paddingVertical: spacing(1.5),
    paddingHorizontal: spacing(2),
    borderRadius: radii.medium,
    alignItems: 'center',
    marginBottom: spacing(1),
  },
  primaryButton: {
    backgroundColor: colors.primary + '20',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: colors.gray100,
    borderWidth: 1,
    borderColor: colors.gray300,
  },
  actionText: {
    ...typography.caption,
    fontWeight: '600',
  },
  primaryText: {
    color: colors.primary,
  },
  secondaryText: {
    color: colors.text,
  },
  nextButton: {
    backgroundColor: colors.primary,
    borderRadius: radii.medium,
    paddingVertical: spacing(1.5),
    paddingHorizontal: spacing(4),
    width: '100%',
    alignItems: 'center',
  },
  nextButtonText: {
    ...typography.body,
    color: colors.white,
    fontWeight: '600',
  },
});
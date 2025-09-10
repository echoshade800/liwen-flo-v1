import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii, spacing, typography } from '../theme/tokens';

const { height: screenHeight } = Dimensions.get('window');

interface ReminderConfirmModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  nextPeriodDate?: string;
}

export default function ReminderConfirmModal({ 
  visible, 
  onConfirm, 
  onCancel, 
  nextPeriodDate 
}: ReminderConfirmModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.iconContainer}>
            <Ionicons name="notifications" size={32} color={colors.primary} />
          </View>
          
          <Text style={styles.title}>Enable period reminders?</Text>
          
          <Text style={styles.description}>
            We'll remind you at 09:00 on your predicted start date. 
            You can turn this off anytime in settings.
          </Text>
          
          <View style={styles.buttons}>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelButtonText}>Maybe Later</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
              <Text style={styles.confirmButtonText}>Enable Reminders</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radii.card,
    borderTopRightRadius: radii.card,
    padding: spacing(4),
    paddingBottom: spacing(6),
    maxHeight: screenHeight * 0.6,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: spacing(2),
  },
  title: {
    ...typography.h3,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing(2),
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing(4),
  },
  buttons: {
    flexDirection: 'row',
    gap: spacing(2),
  },
  cancelButton: {
    flex: 1,
    backgroundColor: colors.gray100,
    borderRadius: radii.card,
    paddingVertical: spacing(2),
    alignItems: 'center',
  },
  cancelButtonText: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: radii.card,
    paddingVertical: spacing(2),
    alignItems: 'center',
  },
  confirmButtonText: {
    ...typography.body,
    color: colors.white,
    fontWeight: '600',
  },
});
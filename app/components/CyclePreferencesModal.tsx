import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii, spacing, typography } from '../theme/tokens';
import WheelNumberPicker from './WheelNumberPicker';

const { height: screenHeight } = Dimensions.get('window');

interface CyclePreferencesModalProps {
  visible: boolean;
  type: 'cycle' | 'period';
  currentValue: number;
  onSave: (value: number) => void;
  onCancel: () => void;
}

export default function CyclePreferencesModal({ 
  visible, 
  type, 
  currentValue, 
  onSave, 
  onCancel 
}: CyclePreferencesModalProps) {
  const [selectedValue, setSelectedValue] = useState(currentValue);

  React.useEffect(() => {
    if (visible) {
      setSelectedValue(currentValue);
    }
  }, [visible, currentValue]);

  const getConfig = () => {
    if (type === 'cycle') {
      return {
        title: 'Average Cycle Length',
        description: 'The number of days from the start of one period to the start of the next',
        min: 15,
        max: 45,
        unit: 'days',
        icon: 'calendar' as const,
        color: colors.fertileLight,
      };
    } else {
      return {
        title: 'Average Period Length',
        description: 'The number of days your period typically lasts',
        min: 1,
        max: 10,
        unit: 'days',
        icon: 'water' as const,
        color: colors.period,
      };
    }
  };

  const config = getConfig();

  const handleSave = () => {
    onSave(selectedValue);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <View style={styles.titleContainer}>
              <Ionicons name={config.icon} size={20} color={config.color} />
              <Text style={styles.modalTitle}>{config.title}</Text>
            </View>
            
            <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.content}>
            <Text style={styles.description}>{config.description}</Text>
            
            <View style={styles.pickerContainer}>
              <WheelNumberPicker
                value={selectedValue}
                onChange={setSelectedValue}
                min={config.min}
                max={config.max}
                unit={config.unit}
              />
            </View>
            
            <View style={styles.infoBox}>
              <Ionicons name="information-circle" size={16} color={colors.primary} />
              <Text style={styles.infoText}>
                {type === 'cycle' 
                  ? 'Normal cycle length is typically 21-35 days. This setting affects period predictions.'
                  : 'Normal period length is typically 3-7 days. This helps predict period duration.'
                }
              </Text>
            </View>
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
    maxHeight: screenHeight * 0.7,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing(3),
    paddingVertical: spacing(2),
    borderBottomWidth: 1,
    borderBottomColor: colors.gray300,
  },
  cancelButton: {
    paddingVertical: spacing(1),
    paddingHorizontal: spacing(1),
  },
  cancelButtonText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  modalTitle: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text,
    marginLeft: spacing(1),
  },
  saveButton: {
    paddingVertical: spacing(1),
    paddingHorizontal: spacing(1),
  },
  saveButtonText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
  content: {
    padding: spacing(3),
  },
  description: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: spacing(3),
  },
  pickerContainer: {
    alignItems: 'center',
    marginVertical: spacing(4),
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.primary + '10',
    borderRadius: radii.medium,
    padding: spacing(2),
    marginTop: spacing(2),
  },
  infoText: {
    ...typography.small,
    color: colors.primary,
    lineHeight: 16,
    marginLeft: spacing(1),
    flex: 1,
  },
});
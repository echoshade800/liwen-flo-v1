import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { colors, radii, spacing, typography } from '../theme/tokens';

interface PeriodDateSelectorProps {
  selectedDates: string[];
  onDatesChange: (dates: string[]) => void;
  onSkip: () => void;
}

export default function PeriodDateSelector({ selectedDates, onDatesChange, onSkip }: PeriodDateSelectorProps) {
  const [currentMonth, setCurrentMonth] = useState(dayjs().format('YYYY-MM-DD'));
  const [hasSelectedAnyDate, setHasSelectedAnyDate] = useState(false);

  useEffect(() => {
    setHasSelectedAnyDate(selectedDates.length > 0);
  }, [selectedDates]);

  const handleDayPress = (day: any) => {
    const dateString = day.dateString;
    const selectedDate = dayjs(dateString);
    const today = dayjs();
    
    // Don't allow selecting future dates
    if (selectedDate.isAfter(today, 'day')) {
      return;
    }

    if (selectedDates.includes(dateString)) {
      // Remove the date if already selected
      const newDates = selectedDates.filter(date => date !== dateString);
      onDatesChange(newDates);
    } else {
      // Add the date and auto-select next 4 days
      const newDates = [...selectedDates];
      
      // Check if this is a new period (10+ days before earliest existing date)
      const isNewPeriod = selectedDates.length === 0 || 
        selectedDates.every(existingDate => {
          const daysDiff = dayjs(existingDate).diff(selectedDate, 'day');
          return daysDiff >= 10;
        });

      if (isNewPeriod) {
        // Auto-select this date + next 4 days (total 5 days)
        for (let i = 0; i < 5; i++) {
          const periodDate = selectedDate.add(i, 'day');
          const periodDateString = periodDate.format('YYYY-MM-DD');
          
          // Only add if not in future and not already selected
          if (!periodDate.isAfter(today, 'day') && !newDates.includes(periodDateString)) {
            newDates.push(periodDateString);
          }
        }
      } else {
        // Just add the single date
        newDates.push(dateString);
      }
      
      onDatesChange(newDates.sort());
    }
  };

  const getMarkedDates = () => {
    const marked: Record<string, any> = {};
    const today = dayjs();
    
    // Mark selected dates
    selectedDates.forEach(dateString => {
      marked[dateString] = {
        customStyles: {
          container: {
            backgroundColor: colors.period,
            borderRadius: 16,
          },
          text: {
            color: colors.white,
            fontWeight: '600',
          }
        }
      };
    });

    // Mark future dates as disabled
    let current = today.add(1, 'day');
    const monthEnd = dayjs(currentMonth).endOf('month');
    
    while (current.isSameOrBefore(monthEnd)) {
      const dateString = current.format('YYYY-MM-DD');
      if (!marked[dateString]) {
        marked[dateString] = {
          disabled: true,
          customStyles: {
            container: {
              backgroundColor: colors.gray100,
            },
            text: {
              color: colors.gray300,
            }
          }
        };
      }
      current = current.add(1, 'day');
    }

    return marked;
  };

  const getHeaderText = () => {
    if (hasSelectedAnyDate) {
      return 'Dates are auto-filled. Tap to modify.';
    }
    return 'Tap the start date of your last period.';
  };

  const getBottomButton = () => {
    if (hasSelectedAnyDate) {
      return (
        <TouchableOpacity style={styles.nextButton} onPress={onSkip}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      );
    }
    
    return (
      <TouchableOpacity style={styles.skipButton} onPress={onSkip}>
        <View style={styles.skipButtonContent}>
          <View style={styles.skipIcon}>
            <Text style={styles.skipIconText}>?</Text>
          </View>
          <Text style={styles.skipButtonText}>I don't remember</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, hasSelectedAnyDate && styles.headerSelected]}>
        <Text style={[styles.headerText, hasSelectedAnyDate && styles.headerTextSelected]}>
          {getHeaderText()}
        </Text>
      </View>

      <View style={styles.calendarContainer}>
        <Calendar
          current={currentMonth}
          onDayPress={handleDayPress}
          onMonthChange={(month) => setCurrentMonth(month.dateString)}
          maxDate={dayjs().format('YYYY-MM-DD')}
          markedDates={getMarkedDates()}
          markingType="custom"
          theme={{
            backgroundColor: colors.white,
            calendarBackground: colors.white,
            textSectionTitleColor: colors.textSecondary,
            selectedDayBackgroundColor: colors.period,
            selectedDayTextColor: colors.white,
            todayTextColor: colors.text,
            dayTextColor: colors.text,
            textDisabledColor: colors.gray300,
            arrowColor: colors.primary,
            monthTextColor: colors.text,
            textDayFontSize: 16,
            textMonthFontSize: 18,
            textDayHeaderFontSize: 13,
          }}
          enableSwipeMonths={true}
          hideExtraDays={false}
          firstDay={1}
        />
      </View>

      <View style={styles.bottomContainer}>
        {getBottomButton()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: colors.period,
    paddingVertical: spacing(2),
    paddingHorizontal: spacing(3),
    borderRadius: radii.card,
    marginBottom: spacing(2),
  },
  headerSelected: {
    backgroundColor: colors.period,
  },
  headerText: {
    ...typography.body,
    color: colors.white,
    textAlign: 'center',
    fontWeight: '500',
  },
  headerTextSelected: {
    color: colors.white,
  },
  calendarContainer: {
    backgroundColor: colors.white,
    borderRadius: radii.card,
    padding: spacing(1),
    marginBottom: spacing(2),
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  bottomContainer: {
    paddingHorizontal: spacing(1),
  },
  skipButton: {
    backgroundColor: colors.white,
    borderRadius: radii.card,
    paddingVertical: spacing(2),
    paddingHorizontal: spacing(3),
    borderWidth: 1,
    borderColor: colors.gray300,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  skipButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.fertileLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing(1),
  },
  skipIconText: {
    ...typography.caption,
    color: colors.white,
    fontWeight: '600',
  },
  skipButtonText: {
    ...typography.body,
    color: colors.text,
    fontWeight: '500',
  },
  nextButton: {
    backgroundColor: colors.fertileLight,
    borderRadius: radii.card,
    paddingVertical: spacing(2),
    paddingHorizontal: spacing(3),
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  nextButtonText: {
    ...typography.body,
    color: colors.white,
    textAlign: 'center',
    fontWeight: '600',
  },
});
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Platform, StatusBar } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { colors, radii, spacing, typography } from '../theme/tokens';

interface PeriodDateSelectorProps {
  selectedDates: string[];
  onDatesChange: (dates: string[]) => void;
  onSkip: () => void;
  onNext: () => void;
}

export default function PeriodDateSelector({ 
  selectedDates, 
  onDatesChange, 
  onSkip, 
  onNext 
}: PeriodDateSelectorProps) {
  const [currentMonth, setCurrentMonth] = useState(dayjs().format('YYYY-MM-DD'));
  
  const hasSelectedDates = selectedDates.length > 0;
  const today = dayjs().format('YYYY-MM-DD');

  const handleDayPress = (day: any) => {
    const dateString = day.dateString;
    console.log('=== PeriodDateSelector handleDayPress Debug ===');
    console.log('点击的日期:', dateString);
    console.log('点击前的 selectedDates:', selectedDates);
    
    
    // Prevent selecting future dates
    if (dayjs(dateString).isAfter(dayjs(), 'day')) {
      console.log('Ignoring future date:', dateString);
      return;
    }

    const selectedDate = dayjs(dateString);
    
    // Check if this date is already selected
    if (selectedDates.includes(dateString)) {
      // If clicking on an already selected date, remove it
      const newDates = selectedDates.filter(date => date !== dateString);
      console.log('移除日期，新的 selectedDates:', newDates);
      onDatesChange(newDates);
      return;
    }

    // Check if this should be a new period (10+ days before earliest existing date)
    let shouldCreateNewPeriod = false;
    if (selectedDates.length > 0) {
      const earliestSelected = dayjs(Math.min(...selectedDates.map(d => dayjs(d).valueOf())));
      const daysDifference = earliestSelected.diff(selectedDate, 'day');
      shouldCreateNewPeriod = daysDifference >= 10;
    }

    if (shouldCreateNewPeriod) {
      // Create new period: auto-select this date + next 4 days
      const newPeriodDates = [];
      for (let i = 0; i < 5; i++) {
        const periodDate = selectedDate.add(i, 'day');
        if (!periodDate.isAfter(dayjs(), 'day')) {
          const formattedDate = periodDate.format('YYYY-MM-DD');
          newPeriodDates.push(formattedDate);
          console.log('New period auto-selecting date:', formattedDate);
        }
      }
      const combinedDates = [...selectedDates, ...newPeriodDates].sort();
      console.log('New period - combined dates:', combinedDates);
      onDatesChange(combinedDates);
    } else {
      // First selection or extending existing period
      if (selectedDates.length === 0) {
        // First selection: auto-select this date + next 4 days
        const initialDates = [];
        for (let i = 0; i < 5; i++) {
          const periodDate = selectedDate.add(i, 'day');
          if (!periodDate.isAfter(dayjs(), 'day')) {
            initialDates.push(periodDate.format('YYYY-MM-DD'));
          }
        }
        console.log('首次选择 - 所有日期:', initialDates);
        onDatesChange(initialDates);
      } else {
        // Add single date to existing selection
        const newDates = [...selectedDates, dateString].sort();
        console.log('Adding single date, new selectedDates:', newDates);
        onDatesChange(newDates);
      }
    }
    
    console.log('=== PeriodDateSelector handleDayPress 完成 ===');
    console.log('最终调用 onDatesChange 的参数会传递给父组件');
  };

  const getMarkedDates = () => {
    const marked: Record<string, any> = {};
    
    // Mark selected period dates
    selectedDates.forEach(dateString => {
      if (!dayjs(dateString).isAfter(dayjs(), 'day')) {
        marked[dateString] = {
          customStyles: {
            container: {
              backgroundColor: colors.period,
              borderRadius: 16,
            },
            text: {
              color: colors.white,
            }
          }
        };
      }
    });

    // Mark today with border if not selected
    if (!selectedDates.includes(today)) {
      marked[today] = {
        customStyles: {
          container: {
            borderWidth: 2,
            borderColor: colors.primary,
            backgroundColor: 'transparent',
            borderRadius: 16,
          },
          text: {
            color: colors.primary,
            fontWeight: '600',
          }
        }
      };
    }

    return marked;
  };

  return (
    <SafeAreaView style={[styles.container, Platform.OS === 'android' && { paddingTop: StatusBar.currentHeight }]}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {hasSelectedDates 
            ? "Dates are auto-filled. Tap to modify." 
            : "Tap the start date of your last period."
          }
        </Text>
      </View>

      <View style={styles.calendarContainer}>
        <Calendar
          current={currentMonth}
          onDayPress={handleDayPress}
          onMonthChange={(month) => setCurrentMonth(month.dateString)}
          maxDate={today}
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

      <View style={styles.footer}>
        {!hasSelectedDates && (
          <TouchableOpacity style={styles.skipButton} onPress={onSkip}>
            <Ionicons name="help-circle-outline" size={20} color={colors.fertileLight} />
            <Text style={styles.skipButtonText}>I don't remember</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    backgroundColor: colors.period,
    paddingHorizontal: spacing(3),
    paddingVertical: spacing(3),
    alignItems: 'center',
  },
  title: {
    ...typography.body,
    color: colors.white,
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 22,
  },
  calendarContainer: {
    flex: 1,
    backgroundColor: colors.white,
    margin: spacing(2),
    borderRadius: radii.card,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    padding: spacing(1),
  },
  footer: {
    paddingHorizontal: spacing(3),
    paddingVertical: spacing(3),
    backgroundColor: colors.white,
  },
  nextButton: {
    backgroundColor: colors.fertileLight,
    borderRadius: radii.card,
    paddingVertical: spacing(2),
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    ...typography.body,
    color: colors.white,
    fontWeight: '600',
  },
  skipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderRadius: radii.card,
    paddingVertical: spacing(2),
    borderWidth: 2,
    borderColor: colors.ovulation,
  },
  skipButtonText: {
    ...typography.body,
    color: colors.ovulation,
    fontWeight: '500',
    marginLeft: spacing(1),
  },
});
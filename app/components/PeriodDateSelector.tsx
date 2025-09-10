import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Platform, StatusBar } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { colors, radii, spacing, typography } from '../theme/tokens';

// Extend dayjs with timezone plugins
dayjs.extend(utc);
dayjs.extend(timezone);

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
  // Use local timezone for display
  const [currentMonth, setCurrentMonth] = useState(dayjs().local().format('YYYY-MM-DD'));
  
  const hasSelectedDates = selectedDates.length > 0;
  // Get today in user's local timezone
  const today = dayjs().local().format('YYYY-MM-DD');

  // Convert UTC dates to local dates for display
  const convertUTCToLocal = (utcDateString: string): string => {
    return dayjs.utc(utcDateString).local().format('YYYY-MM-DD');
  };

  // Convert local dates to UTC for storage
  const convertLocalToUTC = (localDateString: string): string => {
    return dayjs(localDateString).utc().format('YYYY-MM-DD');
  };

  // Convert selectedDates from UTC to local for display
  const localSelectedDates = selectedDates.map(convertUTCToLocal);

  const handleDayPress = (day: any) => {
    const localDateString = day.dateString;
    console.log('=== PeriodDateSelector handleDayPress ===');
    console.log('用户点击本地日期:', localDateString);
    console.log('当前已选UTC日期:', selectedDates);
    console.log('当前已选本地日期:', localSelectedDates);
    
    
    // Prevent selecting future dates
    if (dayjs(localDateString).isAfter(dayjs().local(), 'day')) {
      console.log('忽略未来日期:', localDateString);
      return;
    }

    const selectedDate = dayjs(localDateString);
    const utcDateString = convertLocalToUTC(localDateString);
    
    // Check if this date is already selected
    if (selectedDates.includes(utcDateString)) {
      // If clicking on an already selected date, remove it
      const newDates = selectedDates.filter(date => date !== utcDateString);
      console.log('取消选择日期，更新后UTC日期:', newDates);
      onDatesChange(newDates);
      return;
    }

    // Check if this should be a new period (10+ days before earliest existing date)
    let shouldCreateNewPeriod = false;
    if (selectedDates.length > 0) {
      const earliestSelected = dayjs.utc(Math.min(...selectedDates.map(d => dayjs.utc(d).valueOf())));
      const daysDifference = earliestSelected.diff(selectedDate, 'day');
      shouldCreateNewPeriod = daysDifference >= 10;
    }

    if (shouldCreateNewPeriod) {
      // Create new period: auto-select this date + next 4 days
      const newPeriodUTCDates = [];
      for (let i = 0; i < 5; i++) {
        const periodDate = selectedDate.add(i, 'day');
        if (!periodDate.isAfter(dayjs().local(), 'day')) {
          const localDate = periodDate.format('YYYY-MM-DD');
          const utcDate = convertLocalToUTC(localDate);
          newPeriodUTCDates.push(utcDate);
          console.log('New period auto-selecting local date:', localDate, '-> UTC:', utcDate);
        }
      }
      const combinedDates = [...selectedDates, ...newPeriodUTCDates].sort();
      console.log('新经期组合UTC日期:', combinedDates);
      onDatesChange(combinedDates);
    } else {
      // First selection or extending existing period
      if (selectedDates.length === 0) {
        // First selection: auto-select this date + next 4 days
        const initialUTCDates = [];
        for (let i = 0; i < 5; i++) {
          const periodDate = selectedDate.add(i, 'day');
          if (!periodDate.isAfter(dayjs().local(), 'day')) {
            const localDate = periodDate.format('YYYY-MM-DD');
            const utcDate = convertLocalToUTC(localDate);
            initialUTCDates.push(utcDate);
          }
        }
        console.log('首次选择自动填充UTC日期:', initialUTCDates);
        onDatesChange(initialUTCDates);
      } else {
        // Add single date to existing selection
        const newDates = [...selectedDates, utcDateString].sort();
        console.log('添加单个UTC日期，更新后:', newDates);
        onDatesChange(newDates);
      }
    }
    
    console.log('=== PeriodDateSelector 日期选择完成 ===');
  };

  const getMarkedDates = () => {
    const marked: Record<string, any> = {};
    
    // Mark selected period dates
    selectedDates.forEach(utcDateString => {
      const localDateString = convertUTCToLocal(utcDateString);
      if (!dayjs(localDateString).isAfter(dayjs().local(), 'day')) {
        marked[localDateString] = {
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
    const todayUTC = convertLocalToUTC(today);
    if (!selectedDates.includes(todayUTC)) {
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
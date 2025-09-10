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
  const [localSelectedDates, setLocalSelectedDates] = useState<string[]>([]);
  
  // 初始化本地状态
  useEffect(() => {
    console.log('[PeriodDateSelector] 初始化，接收到的selectedDates:', selectedDates);
    setLocalSelectedDates([...selectedDates]);
  }, []);

  const today = dayjs().format('YYYY-MM-DD');

  const handleDayPress = (day: any) => {
    const dateString = day.dateString;
    console.log('[PeriodDateSelector] 用户点击日期:', dateString);
    
    // 防止选择未来日期
    if (dayjs(dateString).isAfter(dayjs(), 'day')) {
      console.log('[PeriodDateSelector] 忽略未来日期');
      return;
    }

    let newDates: string[];
    if (localSelectedDates.includes(dateString)) {
      // 取消选择
      newDates = localSelectedDates.filter(date => date !== dateString);
      console.log('[PeriodDateSelector] 取消选择，新数组:', newDates);
    } else {
      // 添加选择
      newDates = [...localSelectedDates, dateString].sort();
      console.log('[PeriodDateSelector] 添加选择，新数组:', newDates);
    }
    
    setLocalSelectedDates(newDates);
    onDatesChange(newDates);
    console.log('[PeriodDateSelector] 已调用onDatesChange，传递数据:', newDates);
  };

  const getMarkedDates = () => {
    const marked: Record<string, any> = {};
    
    // 标记选中的日期
    localSelectedDates.forEach(dateString => {
      if (!dayjs(dateString).isAfter(dayjs(), 'day')) {
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
      }
    });

    // 标记今天
    if (!localSelectedDates.includes(today)) {
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
          Select your period dates
        </Text>
        <Text style={styles.subtitle}>
          Tap any dates when you had your period
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
        <Text style={styles.selectedCount}>
          {localSelectedDates.length} dates selected
        </Text>
        
        <TouchableOpacity style={styles.skipButton} onPress={onSkip}>
          <Text style={styles.skipButtonText}>I don't remember</Text>
        </TouchableOpacity>
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
    fontWeight: '600',
    marginBottom: spacing(1),
  },
  subtitle: {
    ...typography.caption,
    color: colors.white,
    textAlign: 'center',
    opacity: 0.9,
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
    alignItems: 'center',
  },
  selectedCount: {
    ...typography.caption,
    color: colors.text,
    marginBottom: spacing(2),
    fontWeight: '600',
  },
  skipButton: {
    backgroundColor: colors.gray100,
    borderRadius: radii.card,
    paddingVertical: spacing(2),
    paddingHorizontal: spacing(4),
    borderWidth: 1,
    borderColor: colors.gray300,
  },
  skipButtonText: {
    ...typography.body,
    color: colors.text,
    fontWeight: '500',
  },
});
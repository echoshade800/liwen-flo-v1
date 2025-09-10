import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Calendar, CalendarProps } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { colors, spacing, typography, radii } from '../theme/tokens';

// 跨平台字体配置
const calendarFontFamily = Platform.select({
  ios: 'System',
  android: 'sans-serif',
  web: 'system-ui'
}) ?? 'system-ui';

interface MonthCalendarProps {
  periods: any[];
  predicted: any[];
  fertileWindow: any[];
  ovulationDay: string[];
  markedDates: Record<string, any>;
  onDaySelect: (dateString: string) => void;
  selectedDate?: string;
  onMonthChange?: (month: string) => void;
}

/**
 * 月历组件 - 显示经期、受孕窗口、排卵日、预测数据
 * 支持月/年切换，点击日期触发回调
 */
export default function MonthCalendar({
  markedDates,
  onDaySelect,
  selectedDate,
  onMonthChange
}: MonthCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(dayjs().format('YYYY-MM-DD'));

  console.log('=== MonthCalendar 组件渲染 ===');
  console.log('接收到的标记数据:', {
    markedDates: Object.keys(markedDates),
    count: Object.keys(markedDates).length,
    currentMonth: currentMonth,
    selectedDate: selectedDate
  });

  const calendarTheme: CalendarProps['theme'] = {
    backgroundColor: colors.white,
    calendarBackground: colors.white,
    textSectionTitleColor: colors.textSecondary,
    selectedDayBackgroundColor: colors.primary,
    selectedDayTextColor: colors.white,
    todayTextColor: colors.primary,
    dayTextColor: colors.text,
    textDisabledColor: colors.gray300,
    arrowColor: colors.primary,
    disabledArrowColor: colors.gray300,
    monthTextColor: colors.text,
    indicatorColor: colors.primary,
    textDayFontFamily: calendarFontFamily,
    textMonthFontFamily: calendarFontFamily,
    textDayHeaderFontFamily: calendarFontFamily,
    textDayFontSize: 16,
    textMonthFontSize: 18,
    textDayHeaderFontSize: 13,
  };

  // 获取今天的日期
  const today = dayjs().format('YYYY-MM-DD');

  // 处理标记日期，为今天添加特殊样式
  const processedMarkedDates = { ...markedDates };
  
  // 如果今天没有其他标记，添加今天的空心圆样式
  if (!processedMarkedDates[today]) {
    processedMarkedDates[today] = {
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
          fontSize: 12,
        }
      }
    };
  } else if (processedMarkedDates[today] && !selectedDate || selectedDate !== today) {
    // 如果今天有其他标记但不是选中状态，添加边框
    processedMarkedDates[today] = {
      ...processedMarkedDates[today],
      customStyles: {
        ...processedMarkedDates[today].customStyles,
        container: {
          ...(processedMarkedDates[today].customStyles && processedMarkedDates[today].customStyles.container ? processedMarkedDates[today].customStyles.container : {}),
          borderWidth: 2,
          borderColor: colors.primary,
        }
      }
    };
  }

  // 为今天添加 "Today" 标签
  if (processedMarkedDates[today]) {
    processedMarkedDates[today] = {
      ...processedMarkedDates[today],
      customStyles: {
        ...processedMarkedDates[today].customStyles,
        text: {
          ...processedMarkedDates[today].customStyles?.text,
          fontSize: 10,
        }
      },
      // 添加今天的标记文本
      marked: true,
      dotColor: 'transparent',
      // 使用自定义渲染来显示 "Today"
      customStyles: {
        ...processedMarkedDates[today].customStyles,
        text: {
          ...processedMarkedDates[today].customStyles?.text,
          fontSize: 10,
        }
      }
    };
  }
  const handleMonthChange = (month: any) => {
    const monthString = dayjs(month.dateString).format('YYYY-MM');
    setCurrentMonth(month.dateString);
    if (onMonthChange) { onMonthChange(monthString); }
  };

  return (
    <View style={styles.container}>
      <Calendar
        current={currentMonth}
        markedDates={{
          ...processedMarkedDates,
          ...(selectedDate && {
            [selectedDate]: {
              ...processedMarkedDates[selectedDate],
              selected: true,
              selectedColor: colors.primary,
            }
          })
        }}
        dayComponent={({ date, state }) => {
          const dateString = date?.dateString;
          const isToday = dateString === today;
          const isSelected = dateString === selectedDate;
          const markedData = processedMarkedDates[dateString || ''];
          
          // 获取日期的样式
          const containerStyle = markedData?.customStyles?.container || {};
          const textStyle = markedData?.customStyles?.text || {};
          
          // 如果是选中日期，使用选中样式
          const finalContainerStyle = isSelected ? {
            backgroundColor: colors.primary,
            borderRadius: 16,
            ...containerStyle
          } : containerStyle;
          
          const finalTextStyle = isSelected ? {
            color: colors.white,
            fontWeight: '600',
            ...textStyle
          } : textStyle;
          
          return (
            <TouchableOpacity
              style={[styles.dayContainer, finalContainerStyle]}
              onPress={() => onDaySelect(dateString || '')}
              disabled={state === 'disabled'}
            >
              <Text style={[
                styles.dayText,
                state === 'disabled' && styles.disabledText,
                finalTextStyle
              ]}>
                {date?.day}
              </Text>
              {isToday && (
                <Text style={[
                  styles.todayLabel,
                  isSelected && styles.todayLabelSelected
                ]}>
                  Today
                </Text>
              )}
            </TouchableOpacity>
          );
        }}
        onDayPress={(day) => onDaySelect(day.dateString)}
        onMonthChange={handleMonthChange}
        theme={calendarTheme}
        markingType="custom"
        hideExtraDays={true}
        firstDay={1} // 周一作为第一天
        enableSwipeMonths={true}
      />
      
      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.period }]} />
          <Text style={styles.legendText}>Period</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.fertileLight }]} />
          <Text style={styles.legendText}>Fertile window</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.ovulation }]} />
          <Text style={styles.legendText}>Ovulation</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.period + '80' }]} />
          <Text style={styles.legendText}>Predicted</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: radii.card,
    padding: spacing(2),
    margin: spacing(2),
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginTop: spacing(2),
    paddingTop: spacing(2),
    borderTopWidth: 1,
    borderTopColor: colors.gray300,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing(0.5),
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: spacing(0.5),
  },
  legendText: {
    ...typography.small,
    color: colors.textSecondary,
  },
  dayContainer: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  dayText: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
  },
  disabledText: {
    color: colors.gray300,
  },
  todayLabel: {
    fontSize: 7,
    color: colors.black,
    fontWeight: '600',
    position: 'absolute',
    top: -8,
    textAlign: 'center',
  },
  todayLabelSelected: {
    color: colors.black,
  },
});
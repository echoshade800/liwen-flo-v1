import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Platform, StatusBar } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import dayjs from 'dayjs';
import { useCycleStore } from '../store/useCycleStore';
import { findLastPeriodStart } from '../lib/cycle';
import { colors, radii, spacing, typography } from '../theme/tokens';

export default function PeriodEditScreen() {
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [currentMonth, setCurrentMonth] = useState(dayjs().format('YYYY-MM-DD'));
  // 记录本次编辑会话中被用户显式取消选择的日期，避免被LMP标记重新高亮
  const [suppressedDates, setSuppressedDates] = useState<string[]>([]);
  
  const periodLogs = useCycleStore(state => state.periodLogs);
  const setPeriodLogs = useCycleStore(state => state.setPeriodLogs);
  const preferences = useCycleStore(state => state.preferences);
  const setPreferences = useCycleStore(state => state.setPreferences);

  // 初始化时加载已有的经期记录
  useEffect(() => {
    // 过滤掉未来日期
    const today = dayjs();
    const sanitized = periodLogs
      .filter(d => !!d)
      .map(d => dayjs(d).format('YYYY-MM-DD'))
      .filter(d => !dayjs(d).isAfter(today, 'day'));
    const uniqueSorted = Array.from(new Set(sanitized)).sort();
    if (uniqueSorted.length !== periodLogs.length) {
      console.log('Filtered future dates from incoming period logs');
    }
    setSelectedDates([...uniqueSorted]);
    // 切换记录源时，清空抑制列表
    setSuppressedDates([]);
    // 跳转到最近一次选择日期所在的月份，确保进入页面即可看到标记
    if (uniqueSorted.length > 0) {
      const last = uniqueSorted[uniqueSorted.length - 1];
      setCurrentMonth(dayjs(last).format('YYYY-MM-DD'));
    }
  }, [periodLogs]);

  const handleDayPress = (day: any) => {
    console.log('handleDayPress day', day);
    const dateString = day.dateString;
    // 忽略未来日期
    if (dayjs(dateString).isAfter(dayjs(), 'day')) {
      return;
    }
    setSelectedDates(prev => {
      console.log('handleDayPress prev', prev);
      if (prev.includes(dateString)) {
        // 取消选择
        const next = prev.filter(date => date !== dateString);
        // 记录到抑制列表，避免被LMP标记重新着色
        setSuppressedDates(list => Array.from(new Set(list.concat(dateString))));
        console.log('handleDayPress next', next);
        return next;
      } else {
        // 添加选择
        const next = [...prev, dateString].sort();
        // 若重新选择该日期，从抑制列表移除
        setSuppressedDates(list => list.filter(d => d !== dateString));
        console.log('handleDayPress next', next);
        return next;
      }
    });
  };

  const handleSave = () => {
    try {
      console.log('handleSave selectedDates', selectedDates);
      // 保存前再次过滤掉未来日期，保证数据安全
      const filtered = selectedDates.filter(d => !dayjs(d).isAfter(dayjs(), 'day'));
      // 同步更新 LMP（最近一次经期开始），不生成额外日期
      const lmp = findLastPeriodStart(filtered);
      setPreferences({ lastMenstrualPeriod: lmp || undefined });
      setPeriodLogs(filtered);
      router.back();
    } catch (error) {
      console.error('Failed to save period logs:', error);
      // Could show an alert here if needed
    }
  };

  const handleCancel = () => {
    router.back();
  };

  const getMarkedDates = () => {
    const marked: Record<string, any> = {};
    const todayObj = dayjs();
    const todayStr = todayObj.format('YYYY-MM-DD');
    const suppressedSet = new Set(suppressedDates);
    
    // 标记LMP经期（淡色，仅作参考，不等同于选中）
    if (preferences.lastMenstrualPeriod) {
      const lmpStart = dayjs(preferences.lastMenstrualPeriod);
      const lmpEnd = lmpStart.add(preferences.avgPeriod - 1, 'day');
      
      let current = lmpStart;
      while (current.isSameOrBefore(lmpEnd)) {
        const dateKey = current.format('YYYY-MM-DD');
        // 移除未来日期标记
        if (current.isAfter(todayObj, 'day')) {
          current = current.add(1, 'day');
          continue;
        }
        // 若该日期被用户显式取消选择，跳过LMP着色
        if (suppressedSet.has(dateKey)) {
          current = current.add(1, 'day');
          continue;
        }
        marked[dateKey] = {
          customStyles: {
            container: {
              // 使用更轻的背景以与用户选中的实心色区分（约10% 透明度）
              backgroundColor: colors.period + '1A',
              borderRadius: 16,
            },
            text: {
              color: colors.text,
              fontWeight: '400',
            }
          }
        };
        current = current.add(1, 'day');
      }
    }
    
    // 标记用户选择的日期（仅当在 selectedDates 中时显示为“选中”样式）
    selectedDates.forEach(dateString => {
      // 忽略未来日期
      if (dayjs(dateString).isAfter(todayObj, 'day')) {
        return;
      }
      
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

    // 如果今天未被选中，显式覆盖为中性样式，防止残留选中态
    if (selectedDates.indexOf(todayStr) === -1) {
      marked[todayStr] = {
        customStyles: {
          container: {
            backgroundColor: 'transparent'
          },
          text: {
            color: colors.text,
            fontWeight: '400'
          }
        }
      };
    }

    return marked;
  };

  return (
    <SafeAreaView style={[styles.container, Platform.OS === 'android' && { paddingTop: StatusBar.currentHeight }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel} style={styles.headerButton}>
          <Ionicons name="close" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Select Your Period Dates</Text>
        <View style={styles.headerButton} />
      </View>

      <View style={styles.content}>
        <Calendar
          key={selectedDates.join('|') + '-' + currentMonth}
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

        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.period }]} />
            <Text style={styles.legendText}>Period dates</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.period, opacity: 0.7 }]} />
            <Text style={styles.legendText}>Historical period</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { borderWidth: 2, borderColor: colors.period, backgroundColor: 'transparent' }]} />
            <Text style={styles.legendText}>Today</Text>
          </View>
        </View>

      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing(3),
    paddingVertical: spacing(2),
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray300,
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...typography.h3,
    color: colors.text,
  },
  content: {
    flex: 1,
    backgroundColor: colors.white,
    margin: spacing(2),
    borderRadius: radii.card,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: spacing(3),
    paddingVertical: spacing(2),
    borderTopWidth: 1,
    borderTopColor: colors.gray300,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
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
  footer: {
    flexDirection: 'row',
    paddingHorizontal: spacing(3),
    paddingVertical: spacing(2),
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.gray300,
    gap: spacing(2),
  },
  cancelButton: {
    flex: 1,
    paddingVertical: spacing(2),
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    ...typography.body,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  saveButton: {
    flex: 2,
    backgroundColor: colors.period,
    borderRadius: radii.pill,
    paddingVertical: spacing(2),
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    ...typography.body,
    color: colors.white,
    fontWeight: '600',
  },
});
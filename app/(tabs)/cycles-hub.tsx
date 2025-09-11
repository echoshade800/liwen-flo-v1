import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { useCycleStore } from '../store/useCycleStore';
import { calculateCurrentCycle, getHistoricalCycles } from '../lib/cycle';
import { colors, radii, spacing, typography } from '../theme/tokens';
import StatusBadge from '../components/StatusBadge';
import PillChips from '../components/PillChips';
import TimelineDots from '../components/TimelineDots';

const TIME_FILTERS = ['Last 3M', 'Last 6M', 'Last Year', 'Earlier'];

export default function CyclesHubScreen() {
  const [selectedFilter, setSelectedFilter] = useState('Last 6M');
  
  const periods = useCycleStore(state => state.periods);
  const preferences = useCycleStore(state => state.preferences);
  const periodLogs = useCycleStore(state => state.periodLogs);
  const generateHistoricalCycles = useCycleStore(state => state.generateHistoricalCycles);
  const clearData = useCycleStore(state => state.clearData);

  const cycleInfo = calculateCurrentCycle(periods, preferences);
  
  // 优先使用用户记录的月经数据生成历史周期
  const historicalCycles = useMemo(() => {
    console.log('=== Debug Cycle History ===');
    console.log('periodLogs:', periodLogs);
    
    if (periodLogs.length > 0) {
      const cycles = generateHistoricalCycles(periodLogs);
      console.log('Generated historicalCycles:', cycles);
      cycles.forEach((cycle, index) => {
        console.log(`Cycle ${index}:`, {
          startDate: cycle.startDate,
          endDate: cycle.endDate,
          periodLength: cycle.periodLength,
          cycleLength: cycle.cycleLength
        });
      });
      return cycles;
    }
    return getHistoricalCycles(periods);
  }, [periodLogs, periods, generateHistoricalCycles]);

  const handleResetData = () => {
    clearData();
  };


  const getStats = () => {
    const { preferences } = useCycleStore.getState();
    
    // 优先使用用户手动记录的 periodLogs 进行计算
    if (periodLogs.length > 0) {
      const sortedLogs = [...periodLogs].sort();
      const periodGroups = groupConsecutiveDates(sortedLogs);
      
      if (periodGroups.length >= 2) {
        // 计算最近两个经期组的数据
        const latestPeriod = periodGroups[periodGroups.length - 1];
        const previousPeriod = periodGroups[periodGroups.length - 2];
        
        const latestStart = dayjs(latestPeriod[0]);
        const previousStart = dayjs(previousPeriod[0]);
        
        const cycleLength = latestStart.diff(previousStart, 'day');
        const periodLength = latestPeriod.length;
        
        // 判断周期长度状态 (21-35天为正常)
        const cycleLengthStatus = cycleLength >= 21 && cycleLength <= 35 ? 'green' : 'red';
        
        // 判断经期长度状态 (3-7天为正常)
        const periodLengthStatus = periodLength >= 3 && periodLength <= 7 ? 'green' : 'red';
        
        // 计算周期变化（与标准28天比较）
        const cycleVariation = Math.abs(cycleLength - 28);
        const cycleVariationStatus = cycleVariation <= 3 ? 'green' : cycleVariation <= 7 ? 'yellow' : 'red';
        
        return {
          lastCycleLength: cycleLength,
          lastPeriodLength: periodLength,
          cycleVariation: cycleVariationStatus,
          cycleLengthStatus,
          periodLengthStatus,
        };
      } else if (periodGroups.length === 1) {
        // 只有一个经期组，只能计算经期长度
        const periodLength = periodGroups[0].length;
        const periodLengthStatus = periodLength >= 3 && periodLength <= 7 ? 'green' : 'red';
        
        return {
          lastCycleLength: 0,
          lastPeriodLength: periodLength,
          cycleVariation: 'green' as const,
          cycleLengthStatus: 'green' as const,
          periodLengthStatus,
        };
      }
    }
    
    // 如果没有手动记录的经期数据，尝试使用 LMP 数据
    if (preferences.lastMenstrualPeriod && preferences.avgPeriod) {
      const periodLengthStatus = preferences.avgPeriod >= 3 && preferences.avgPeriod <= 7 ? 'green' : 'red';
      
      return {
        lastCycleLength: preferences.avgCycle || 28,
        lastPeriodLength: preferences.avgPeriod,
        cycleVariation: 'green' as const,
        cycleLengthStatus: 'green' as const,
        periodLengthStatus,
      };
    }
    
    // 如果没有足够的手动记录，回退到历史周期数据
    if (historicalCycles.length === 0) {
      return {
        lastCycleLength: 0,
        lastPeriodLength: 0,
        cycleVariation: 'green' as const,
        cycleLengthStatus: 'green' as const,
        periodLengthStatus: 'green' as const,
      };
    }

    const lastCycle = historicalCycles[0];
    
    return {
      lastCycleLength: lastCycle.cycleLength,
      lastPeriodLength: lastCycle.periodLength,
      cycleVariation: lastCycle.status,
      cycleLengthStatus: lastCycle.status,
      periodLengthStatus: lastCycle.status,
    };
  };

  // 将连续的日期分组的辅助函数
  const groupConsecutiveDates = (dates: string[]): string[][] => {
    if (dates.length === 0) return [];
    
    const groups: string[][] = [];
    let currentGroup: string[] = [dates[0]];
    
    for (let i = 1; i < dates.length; i++) {
      const prevDate = dayjs(dates[i - 1]);
      const currentDate = dayjs(dates[i]);
      
      // 如果当前日期与前一个日期相差1天，则属于同一组
      if (currentDate.diff(prevDate, 'day') === 1) {
        currentGroup.push(dates[i]);
      } else {
        // 否则开始新的组
        groups.push(currentGroup);
        currentGroup = [dates[i]];
      }
    }
    
    // 添加最后一组
    groups.push(currentGroup);
    
    return groups;
  };

  const stats = getStats();

  return (
    <SafeAreaView style={[styles.container, Platform.OS === 'android' && { paddingTop: StatusBar.currentHeight }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Cycle Hub</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={styles.statInfo}>
              <Text style={styles.statTitle}>Last Cycle Length</Text>
              <Text style={styles.statValue}>{stats.lastCycleLength || '--'} days</Text>
            </View>
            <View style={styles.statusBadgeContainer}>
              <StatusBadge 
                status={stats.cycleLengthStatus} 
                text={stats.cycleLengthStatus === 'green' ? 'Normal' : 'Needs attention'} 
              />
              <TouchableOpacity 
                style={styles.infoIcon}
                onPress={() => router.push('/info/cycle-length')}
              >
                <Ionicons name="information-circle-outline" size={20} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statInfo}>
              <Text style={styles.statTitle}>Last Period Length</Text>
              <Text style={styles.statValue}>{stats.lastPeriodLength || '--'} days</Text>
            </View>
            <StatusBadge 
              status={stats.periodLengthStatus} 
              text={stats.periodLengthStatus === 'green' ? 'Normal' : 'Needs attention'} 
            />
          </View>

          <View style={styles.statCard}>
            <View style={styles.statInfo}>
              <Text style={styles.statTitle}>Cycle Variation</Text>
              <Text style={styles.statValue}>
                {stats.lastCycleLength ? `±${Math.abs(28 - stats.lastCycleLength)} days` : '--'}
              </Text>
            </View>
            <StatusBadge 
              status={stats.cycleVariation} 
              text={
                stats.cycleVariation === 'green' ? 'Stable' :
                stats.cycleVariation === 'yellow' ? 'Slight variation' : 'Needs attention'
              } 
            />
          </View>
        </View>

        <PillChips
          options={TIME_FILTERS}
          selected={selectedFilter}
          onSelect={setSelectedFilter}
        />

        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>Cycle History</Text>
          
          {historicalCycles.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Not enough data yet</Text>
              <Text style={styles.emptySubtext}>Log a few cycles to see your history here</Text>
            </View>
          ) : (
            historicalCycles.map((cycle, index) => (
              <View key={index} style={styles.cycleCard}>
                <View style={styles.cycleHeader}>
                  <View>
                    <Text style={styles.cycleDate}>
                      {dayjs(cycle.startDate).format('MMM D')} - {' '}
                      {cycle.endDate ? dayjs(cycle.endDate).format('MMM D') : 'Ongoing'}
                    </Text>
                    <Text style={styles.cycleMeta}>
                      {cycle.cycleLength || '--'} day cycle · {cycle.periodLength} day period
                    </Text>
                  </View>
                  <StatusBadge 
                    status={cycle.status}
                    text={
                      cycle.status === 'green' ? 'Normal' :
                      cycle.status === 'yellow' ? 'Irregular' : 'Needs attention'
                    }
                  />
                </View>
                
                <TimelineDots 
                  cycleLength={cycle.cycleLength}
                  periodLength={cycle.periodLength}
                  ovulationDay={14}
                />
              </View>
            ))
          )}
        </View>

        <View style={styles.settingsSection}>
          <TouchableOpacity style={styles.settingItem} onPress={handleResetData}>
            <Ionicons name="trash-outline" size={20} color={colors.red} />
            <Text style={styles.settingText}>Clear All Data</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing(3),
    paddingTop: spacing(2),
    paddingBottom: spacing(1),
  },
  title: {
    ...typography.h2,
    color: colors.text,
  },
  content: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'column',
    paddingHorizontal: spacing(3),
    marginBottom: spacing(2),
    gap: spacing(1.5),
  },
  statCard: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: radii.card,
    padding: spacing(3),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statInfo: {
    flex: 1,
  },
  statTitle: {
    ...typography.small,
    color: colors.textSecondary,
    textAlign: 'left',
    marginBottom: spacing(0.5),
  },
  statValue: {
    ...typography.h4,
    color: colors.text,
    marginBottom: spacing(1),
  },
  historySection: {
    paddingHorizontal: spacing(3),
  },
  sectionTitle: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing(2),
  },
  emptyState: {
    backgroundColor: colors.white,
    borderRadius: radii.card,
    padding: spacing(4),
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  emptyText: {
    ...typography.body,
    color: colors.text,
    marginBottom: spacing(1),
  },
  emptySubtext: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing(2),
  },
  cycleCard: {
    backgroundColor: colors.white,
    borderRadius: radii.card,
    padding: spacing(3),
    marginBottom: spacing(2),
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cycleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing(2),
  },
  cycleDate: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing(0.5),
  },
  cycleMeta: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  settingsSection: {
    paddingHorizontal: spacing(3),
    paddingTop: spacing(2),
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radii.card,
    padding: spacing(2),
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  settingText: {
    ...typography.caption,
    color: colors.red,
    marginLeft: spacing(1),
  },
  statusBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(1),
  },
  infoIcon: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: colors.primary + '10',
  },
});
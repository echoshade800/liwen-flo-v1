import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Dimensions, Platform, StatusBar } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import dayjs from 'dayjs';
import { useCycleStore } from '../store/useCycleStore';
import { getHistoricalCycles } from '../lib/cycle';
import { colors, radii, spacing, typography } from '../theme/tokens';

const { width: screenWidth } = Dimensions.get('window');

export default function TrendsScreen() {
  const periods = useCycleStore(state => state.periods);
  const periodLogs = useCycleStore(state => state.periodLogs);
  const generateHistoricalCycles = useCycleStore(state => state.generateHistoricalCycles);
  
  // 优先使用用户记录的月经数据生成历史周期
  const historicalCycles = useMemo(() => {
    if (periodLogs.length > 0) {
      return generateHistoricalCycles(periodLogs);
    }
    return getHistoricalCycles(periods);
  }, [periodLogs, periods, generateHistoricalCycles]);

  // 固定显示最近6个月的数据
  const last6MonthsCycles = useMemo(() => {
    const now = dayjs();
    const sixMonthsAgo = now.subtract(6, 'month');
    
    return historicalCycles.filter(cycle => 
      dayjs(cycle.startDate).isAfter(sixMonthsAgo)
    );
  }, [historicalCycles]);

  const getChartData = () => {
    if (last6MonthsCycles.length < 2) {
      return {
        labels: ['No Data'],
        datasets: [{
          data: [28],
          color: () => '#D1D5DB',
        }]
      };
    }

    // 按时间顺序排列（最早的在左，最新的在右）
    const sortedCycles = [...last6MonthsCycles].sort((a, b) => 
      dayjs(a.startDate).valueOf() - dayjs(b.startDate).valueOf()
    );
    
    const labels = sortedCycles.map((cycle, index) => {
      const date = dayjs(cycle.startDate);
      return date.format('MM/DD');
    });
    
    const cycleLengths = sortedCycles.map(cycle => cycle.cycleLength);
    const avgLength = cycleLengths.reduce((sum, length) => sum + length, 0) / cycleLengths.length;
    const minRange = avgLength - 2;
    const maxRange = avgLength + 2;

    return {
      labels,
      datasets: [
        {
          data: cycleLengths,
          color: () => '#FF5A7A',
          strokeWidth: 3,
        },
        {
          data: new Array(cycleLengths.length).fill(maxRange),
          color: () => 'rgba(255, 90, 122, 0.3)',
          strokeWidth: 0,
          withDots: false,
        },
        {
          data: new Array(cycleLengths.length).fill(minRange),
          color: () => 'rgba(255, 90, 122, 0.3)',
          strokeWidth: 0,
          withDots: false,
        },
      ]
    };
  };

  const chartData = getChartData();
  
  const getInsights = () => {
    if (last6MonthsCycles.length < 3) {
      return {
        trend: 'Collecting data',
        message: 'Log more period data to see personalized trend analysis here',
        status: 'gray' as const,
      };
    }

    const recent3 = last6MonthsCycles.slice(0, 3);
    const avgLength = recent3.reduce((sum, cycle) => sum + cycle.cycleLength, 0) / 3;
    const variation = Math.max(...recent3.map(c => c.cycleLength)) - Math.min(...recent3.map(c => c.cycleLength));

    if (variation <= 2) {
      return {
        trend: 'Stable cycles',
        message: `Your last 3 cycles averaged ${avgLength.toFixed(1)} days with minimal variation`,
        status: 'green' as const,
      };
    } else if (variation <= 7) {
      return {
        trend: 'Slight variation',
        message: `Your recent cycles vary by ${variation} days, which is within normal range`,
        status: 'yellow' as const,
      };
    } else {
      return {
        trend: 'Needs attention',
        message: `Your cycles vary significantly (${variation} days). Consider tracking more or consulting a doctor`,
        status: 'red' as const,
      };
    }
  };

  const insights = getInsights();

  return (
    <SafeAreaView style={[styles.container, Platform.OS === 'android' && { paddingTop: StatusBar.currentHeight }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Period Trends</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Cycle Length Trends (Last 6 Months)</Text>
          
          {last6MonthsCycles.length >= 2 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <LineChart
                data={chartData}
                width={Math.max(screenWidth - 40, chartData.labels.length * 80)}
                height={220}
                chartConfig={{
                  backgroundColor: colors.white,
                  backgroundGradientFrom: colors.white,
                  backgroundGradientTo: colors.white,
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(255, 90, 122, ${opacity})`,
                  labelColor: (opacity = 1) => '#1F2937',
                  style: {
                    borderRadius: radii.card,
                  },
                  propsForDots: {
                    r: '6',
                    strokeWidth: '2',
                    stroke: '#FF5A7A',
                  },
                  propsForLabels: {
                    fontSize: 12,
                    fontWeight: '500',
                  },
                  propsForVerticalLabels: {
                    fontSize: 12,
                    fontWeight: '500',
                  },
                  propsForHorizontalLabels: {
                    fontSize: 12,
                    fontWeight: '500',
                  },
                  fillShadowGradient: '#FF5A7A',
                  fillShadowGradientOpacity: 0.1,
                  useShadowColorFromDataset: false,
                }}
                style={styles.chart}
                bezier
                withInnerLines={false}
                withOuterLines={false}
                withVerticalLines={false}
                withHorizontalLines={false}
                withVerticalLabels={true}
                withHorizontalLabels={true}
                fromZero={false}
              />
            </ScrollView>
          ) : (
            <View style={styles.noDataState}>
              <Text style={styles.noDataText}>📊</Text>
              <Text style={styles.noDataTitle}>Not enough data</Text>
              <Text style={styles.noDataDesc}>Log at least 2 cycles in "Log Period" to see trend charts here</Text>
            </View>
          )}
        </View>

        <View style={styles.insightsSection}>
          <Text style={styles.sectionTitle}>Insights</Text>
          
          <View style={[
            styles.insightCard,
            { borderLeftColor: colors[insights.status] || colors.gray300 }
          ]}>
            <Text style={[styles.insightTrend, { color: colors[insights.status] || colors.text }]}>
              {insights.trend}
            </Text>
            <Text style={styles.insightMessage}>{insights.message}</Text>
          </View>
        </View>

        {last6MonthsCycles.length > 0 && (
          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>Statistics</Text>
            
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {last6MonthsCycles.length > 0 ? 
                    (last6MonthsCycles.reduce((sum, c) => sum + c.cycleLength, 0) / last6MonthsCycles.length).toFixed(1) : 
                    '--'
                  } days
                </Text>
                <Text style={styles.statLabel}>Avg Cycle</Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {last6MonthsCycles.length > 0 ? 
                    (last6MonthsCycles.reduce((sum, c) => sum + c.periodLength, 0) / last6MonthsCycles.length).toFixed(1) : 
                    '--'
                  } days
                </Text>
                <Text style={styles.statLabel}>Avg Period</Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {last6MonthsCycles.length > 0 ? 
                    Math.max(...last6MonthsCycles.map(c => c.cycleLength)) - 
                    Math.min(...last6MonthsCycles.map(c => c.cycleLength)) : 
                    '--'
                  } days
                </Text>
                <Text style={styles.statLabel}>Max Variation</Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{last6MonthsCycles.length}</Text>
                <Text style={styles.statLabel}>Cycles Logged</Text>
              </View>
            </View>
          </View>
        )}
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
  chartSection: {
    paddingHorizontal: spacing(3),
    marginBottom: spacing(3),
  },
  sectionTitle: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing(2),
  },
  chart: {
    borderRadius: radii.card,
    marginVertical: spacing(1),
  },
  noDataState: {
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
  noDataText: {
    fontSize: 48,
    marginBottom: spacing(2),
  },
  noDataTitle: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing(1),
  },
  noDataDesc: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  insightsSection: {
    paddingHorizontal: spacing(3),
    marginBottom: spacing(3),
  },
  insightCard: {
    backgroundColor: colors.white,
    borderRadius: radii.card,
    padding: spacing(3),
    borderLeftWidth: 4,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  insightTrend: {
    ...typography.body,
    fontWeight: '600',
    marginBottom: spacing(1),
  },
  insightMessage: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  statsSection: {
    paddingHorizontal: spacing(3),
    marginBottom: spacing(3),
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing(2),
  },
  statItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.white,
    borderRadius: radii.medium,
    padding: spacing(2),
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statValue: {
    ...typography.h3,
    color: colors.primary,
    marginBottom: spacing(0.5),
  },
  statLabel: {
    ...typography.small,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
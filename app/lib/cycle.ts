import dayjs, { Dayjs } from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isBetween from 'dayjs/plugin/isBetween';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { PeriodEntry, Preferences } from '../store/useCycleStore';
import { colors } from '../theme/tokens';

// Extend dayjs with required plugins
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.extend(isBetween);
dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * Timezone utility functions for global users
 */
export const timezoneUtils = {
  // Convert UTC date string to local date string for display
  utcToLocal: (utcDateString: string): string => {
    return dayjs.utc(utcDateString).local().format('YYYY-MM-DD');
  },
  
  // Convert local date string to UTC for storage
  localToUTC: (localDateString: string): string => {
    return dayjs(localDateString).utc().format('YYYY-MM-DD');
  },
  
  // Get today in local timezone
  getTodayLocal: (): string => {
    return dayjs().local().format('YYYY-MM-DD');
  },
  
  // Get today in UTC
  getTodayUTC: (): string => {
    return dayjs().utc().format('YYYY-MM-DD');
  }
};

/**
 * 周期计算核心方法
 * 包含周期预测、排卵日计算、受孕窗口等
 */

export interface CycleInfo {
  currentCycleDay: number;
  nextPeriodDate: string;
  ovulationDate: string;
  fertileWindowStart: string;
  fertileWindowEnd: string;
  cycleLengthStatus: 'green' | 'yellow' | 'red';
  periodLengthStatus: 'green' | 'yellow' | 'red';
}

// 新增：预测记录类型
export interface FertilePrediction {
  id: string; // 唯一标识
  basedOnPeriodDate: string; // 基于哪个经期日期的预测
  calculatedAt: string; // 预测计算时间
  ovulationDate: string; // 预测的排卵日
  fertileWindowStart: string; // 受孕窗口开始
  fertileWindowEnd: string; // 受孕窗口结束
  cycleLength: number; // 使用的周期长度
  confidence: 'high' | 'medium' | 'low'; // 预测置信度
  source: 'latest_period' | 'historical_period' | 'lmp' | 'user_input'; // 预测来源
}

// 新增：预测历史管理
export interface PredictionHistory {
  latestPrediction: FertilePrediction | null; // 最新的预测
  historicalPredictions: FertilePrediction[]; // 历史预测记录
  lastUpdated: string; // 最后更新时间
}

/**
 * 增强的受孕窗口和排卵日预测计算
 * 支持基于不同经期日期的预测和历史记录
 */
export function calculateFertilePrediction(
  basedOnDate: string,
  cycleLength: number,
  source: FertilePrediction['source'],
  confidence: FertilePrediction['confidence'] = 'medium'
): FertilePrediction {
  const baseDate = dayjs(basedOnDate);
  const now = dayjs();
  
  // 计算排卵日（周期长度-14天，最小为第14天）
  const ovulationDay = Math.max(14, cycleLength - 14);
  const ovulationDate = baseDate.add(ovulationDay - 1, 'day');
  
  // 计算受孕窗口（排卵日前5天到后1天）
  const fertileWindowStart = ovulationDate.subtract(5, 'day');
  const fertileWindowEnd = ovulationDate.add(1, 'day');
  
  return {
    id: `${basedOnDate}-${now.format('YYYY-MM-DD-HH-mm-ss')}`,
    basedOnPeriodDate: basedOnDate,
    calculatedAt: now.format('YYYY-MM-DD HH:mm:ss'),
    ovulationDate: ovulationDate.format('YYYY-MM-DD'),
    fertileWindowStart: fertileWindowStart.format('YYYY-MM-DD'),
    fertileWindowEnd: fertileWindowEnd.format('YYYY-MM-DD'),
    cycleLength,
    confidence,
    source
  };
}

/**
 * 基于多个经期日期计算预测历史（只预测未来）
 */
export function calculatePredictionHistory(
  periodLogs: string[],
  preferences: Preferences
): PredictionHistory {
  const now = dayjs();
  const predictions: FertilePrediction[] = [];
  
  // 按日期排序并分组连续日期
  const sortedLogs = [...periodLogs].sort();
  const periodGroups = groupConsecutiveDates(sortedLogs);
  
  // 获取最早的经期日期作为预测下限
  const earliestPeriodDate = sortedLogs.length > 0 ? dayjs(sortedLogs[0]) : null;
  
  console.log('=== 计算预测历史 ===');
  console.log('经期组数:', periodGroups.length);
  console.log('最早经期日期:', earliestPeriodDate?.format('YYYY-MM-DD'));
  
  // 为每个经期组生成未来预测
  periodGroups.forEach((group, index) => {
    const periodStartDate = group[0];
    const isLatest = index === periodGroups.length - 1;
    
    // 计算置信度：最近的经期置信度更高
    let confidence: FertilePrediction['confidence'] = 'low';
    if (isLatest) {
      confidence = 'high';
    } else if (index >= periodGroups.length - 3) {
      confidence = 'medium';
    }
    
    // 确定预测来源
    const source: FertilePrediction['source'] = isLatest ? 'latest_period' : 'historical_period';
    
    // 生成预测（这里预测的是基于该经期的下一个周期）
    const baseDate = dayjs(periodStartDate);
    const nextCycleStart = baseDate.add(preferences.avgCycle, 'day');
    
    // 检查预测的下一个周期是否在最早经期之后（确保不预测过去）
    if (!earliestPeriodDate || nextCycleStart.isSameOrAfter(earliestPeriodDate)) {
      const prediction = calculateFertilePrediction(
        periodStartDate,
        preferences.avgCycle,
        source,
        confidence
      );
      
      console.log(`预测 ${index + 1}: 基于 ${periodStartDate}, 下次排卵 ${prediction.ovulationDate}`);
      predictions.push(prediction);
    } else {
      console.log(`跳过预测 ${index + 1}: 基于 ${periodStartDate}, 会预测到最早经期之前`);
    }
  });
  
  // 如果有LMP且不在periodLogs中，也生成一个预测（如果它不会预测过去）
  if (preferences.lastMenstrualPeriod && !periodLogs.includes(preferences.lastMenstrualPeriod)) {
    const lmpDate = dayjs(preferences.lastMenstrualPeriod);
    const lmpNextCycle = lmpDate.add(preferences.avgCycle, 'day');
    
    if (!earliestPeriodDate || lmpNextCycle.isSameOrAfter(earliestPeriodDate)) {
      const lmpPrediction = calculateFertilePrediction(
        preferences.lastMenstrualPeriod,
        preferences.avgCycle,
        'lmp',
        'medium'
      );
      console.log(`LMP预测: 基于 ${preferences.lastMenstrualPeriod}, 下次排卵 ${lmpPrediction.ovulationDate}`);
      predictions.push(lmpPrediction);
    } else {
      console.log(`跳过LMP预测: 会预测到最早经期之前`);
    }
  }
  
  // 按计算时间排序，最新的在前
  predictions.sort((a, b) => dayjs(b.calculatedAt).valueOf() - dayjs(a.calculatedAt).valueOf());
  
  console.log(`总共生成了 ${predictions.length} 个有效预测`);
  
  return {
    latestPrediction: predictions.length > 0 ? predictions[0] : null,
    historicalPredictions: predictions,
    lastUpdated: now.format('YYYY-MM-DD HH:mm:ss')
  };
}

/**
 * 计算当前周期信息
 */
export function calculateCurrentCycle(
  periods: PeriodEntry[], 
  preferences: Preferences
): CycleInfo | null {
  if (periods.length === 0) return null;

  const lastPeriod = periods[periods.length - 1];
  const lastPeriodStart = dayjs(lastPeriod.startDate);
  const today = dayjs();
  
  // 当前周期第几天
  const currentCycleDay = today.diff(lastPeriodStart, 'day') + 1;
  
  // 预测下次月经日期（基于平均周期长度）
  const nextPeriodDate = lastPeriodStart.add(preferences.avgCycle, 'day');
  
  // 排卵日（周期第14天，或周期长度-14天）
  const ovulationDay = Math.max(14, preferences.avgCycle - 14);
  const ovulationDate = lastPeriodStart.add(ovulationDay - 1, 'day');
  
  // 受孕窗口（排卵日前5天到后1天）
  const fertileWindowStart = ovulationDate.subtract(5, 'day');
  const fertileWindowEnd = ovulationDate.add(1, 'day');
  
  // 计算周期长度状态
  const cycleLengthStatus = calculateCycleLengthStatus(periods);
  const periodLengthStatus = calculatePeriodLengthStatus(periods);

  return {
    currentCycleDay,
    nextPeriodDate: nextPeriodDate.format('YYYY-MM-DD'),
    ovulationDate: ovulationDate.format('YYYY-MM-DD'),
    fertileWindowStart: fertileWindowStart.format('YYYY-MM-DD'),
    fertileWindowEnd: fertileWindowEnd.format('YYYY-MM-DD'),
    cycleLengthStatus,
    periodLengthStatus,
  };
}

/**
 * 计算周期长度状态
 * 绿=正常(21-35天)、黄=不规律(±3天变化)、红=需要注意(>7天变化或异常长度)
 */
export function calculateCycleLengthStatus(periods: PeriodEntry[]): 'green' | 'yellow' | 'red' {
  if (periods.length < 2) return 'green';

  const cycleLengths = [];
  for (let i = 1; i < periods.length; i++) {
    const prevStart = dayjs(periods[i - 1].startDate);
    const currentStart = dayjs(periods[i].startDate);
    cycleLengths.push(currentStart.diff(prevStart, 'day'));
  }

  const avgLength = cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length;
  const maxVariation = Math.max(...cycleLengths.map(len => Math.abs(len - avgLength)));

  // 异常长度判断
  if (avgLength < 21 || avgLength > 35) return 'red';
  
  // 变化幅度判断
  if (maxVariation > 7) return 'red';
  if (maxVariation > 3) return 'yellow';
  
  return 'green';
}

/**
 * 计算经期长度状态
 * 绿=正常(3-7天)、黄=轻微异常、红=需要注意
 */
export function calculatePeriodLengthStatus(periods: PeriodEntry[]): 'green' | 'yellow' | 'red' {
  const recentPeriods = periods.slice(-3); // 最近3个周期
  
  if (recentPeriods.length === 0) return 'green';

  const periodLengths = recentPeriods
    .filter(p => p.endDate)
    .map(p => dayjs(p.endDate!).diff(dayjs(p.startDate), 'day'));

  if (periodLengths.length === 0) return 'green';

  const avgLength = periodLengths.reduce((a, b) => a + b, 0) / periodLengths.length;
  
  // 异常长度判断
  if (avgLength < 2 || avgLength > 8) return 'red';
  if (avgLength < 3 || avgLength > 7) return 'yellow';
  
  return 'green';
}

/**
 * 获取日历显示数据（增强版）
 * 支持完整的未来周期预测：经期、受孕窗口、排卵日
 */
export function getCalendarData(
  periods: PeriodEntry[],
  preferences: Preferences,
  month: string, // YYYY-MM format
  periodLogs: string[] = [] // 用户手动选择的经期日期
) {
  console.log('=== getCalendarData 开始处理 ===');
  console.log('目标月份:', month);
  console.log('接收到的 periodLogs (UTC):', {
    data: periodLogs,
    length: periodLogs.length,
    details: periodLogs.map((d, i) => `${i}: "${d}"`)
  });
  
  // Use local timezone for month calculations
  const monthStart = dayjs(month).local().startOf('month');
  const cycleInfo = calculateCurrentCycle(periods, preferences);
  const monthEnd = monthStart.endOf('month');
  const today = dayjs().local();

  const calendarData: Record<string, any> = {};
  
  // 生成完整的未来周期预测（经期、排卵日、受孕窗口）
  const generateCompleteFuturePredictions = (referenceDate: dayjs.Dayjs, cycleLength: number, periodLength: number) => {
    const predictions: Array<{
      periodStart: dayjs.Dayjs;
      periodEnd: dayjs.Dayjs;
      ovulationDate: dayjs.Dayjs;
      fertileStart: dayjs.Dayjs;
      fertileEnd: dayjs.Dayjs;
      cycleNumber: number;
    }> = [];

    // 计算排卵日（周期长度-14天，最小为第14天）
    const ovulationDay = Math.max(14, cycleLength - 14);

    // 计算未来6个周期的完整预测
    for (let cycleOffset = 1; cycleOffset <= 6; cycleOffset++) {
      const periodStart = referenceDate.add(cycleOffset * cycleLength, 'day');
      
      // 只预测未来，不预测过去
      if (periodStart.isBefore(today)) {
        continue;
      }
      
      const periodEnd = periodStart.add(periodLength - 1, 'day');
      const ovulationDate = periodStart.add(ovulationDay - 1, 'day');
      const fertileStart = ovulationDate.subtract(5, 'day');
      const fertileEnd = ovulationDate.add(1, 'day');

      // 检查这个周期的任何部分是否与当前月份重叠
      const hasOverlap = (
        (periodStart.isSameOrBefore(monthEnd) && periodEnd.isSameOrAfter(monthStart)) ||
        (fertileStart.isSameOrBefore(monthEnd) && fertileEnd.isSameOrAfter(monthStart)) ||
        (ovulationDate.isBetween(monthStart, monthEnd, 'day', '[]'))
      );
      
      if (hasOverlap) {
        predictions.push({
          periodStart,
          periodEnd,
          ovulationDate,
          fertileStart,
          fertileEnd,
          cycleNumber: cycleOffset
        });
      }
    }

    return predictions;
  };

  // 优先标记用户手动选择的经期日期 (convert UTC to local for display)
  periodLogs.forEach(utcDateString => {
    console.log('处理经期UTC日期:', utcDateString);
    try {
      // Convert UTC to local timezone for display
      const localDateString = timezoneUtils.utcToLocal(utcDateString);
      const date = dayjs(localDateString);
      console.log('解析结果:', {
        originalUTC: utcDateString,
        localDate: localDateString,
        parsed: date.format('YYYY-MM-DD'),
        isValid: date.isValid(),
        inCurrentMonth: date.isBetween(monthStart, monthEnd, 'day', '[]')
      });
      
      if (date.isValid()) {
        // 使用标准格式 'YYYY-MM-DD' 作为键，确保与react-native-calendars兼容
        const formattedDate = date.format('YYYY-MM-DD');
        
        if (date.isBetween(monthStart, monthEnd, 'day', '[]')) {
          console.log('✅ 本地日期在当前月份，标记为经期:', formattedDate);
          calendarData[formattedDate] = {
            selectedColor: colors.period,
            type: 'user_period',
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
        } else {
          console.log('⏭️ 本地日期不在当前月份范围:', formattedDate);
        }
      } else {
        console.warn(`无效UTC日期: ${utcDateString}`);
      }
    } catch (error) {
      console.error(`处理UTC日期 ${utcDateString} 时出错:`, error);
    }
  });

  // 生成完整的未来周期预测
  let referenceDate: dayjs.Dayjs | null = null;
  
  if (preferences.lastMenstrualPeriod) {
    // Convert LMP from UTC to local for calculations
    referenceDate = dayjs.utc(preferences.lastMenstrualPeriod).local();
  } else if (periods.length > 0) {
    // Convert period start date from UTC to local
    referenceDate = dayjs.utc(periods[periods.length - 1].startDate).local();
  } else if (periodLogs.length > 0) {
    // 如果没有LMP，使用最近的用户记录日期
    const sortedUTCLogs = [...periodLogs].sort();
    const latestUTCDate = sortedUTCLogs[sortedUTCLogs.length - 1];
    referenceDate = dayjs.utc(latestUTCDate).local();
  }

  if (referenceDate) {
    console.log('基于本地参考日期生成预测:', referenceDate.format('YYYY-MM-DD'));
    
    const predictions = generateCompleteFuturePredictions(
      referenceDate, 
      preferences.avgCycle, 
      preferences.avgPeriod
    );

    console.log(`生成了 ${predictions.length} 个完整周期预测`);

    // 标记预测的经期、排卵日和受孕窗口
    predictions.forEach(prediction => {
      const isNearestCycle = prediction.cycleNumber === 1; // 最近的一个周期
      
      // 1. 标记预测经期
      let current = prediction.periodStart;
      while (current.isSameOrBefore(prediction.periodEnd)) {
        if (current.isBetween(monthStart, monthEnd, 'day', '[]')) {
          const dateKey = current.format('YYYY-MM-DD');
          if (!calendarData[dateKey]) {
            calendarData[dateKey] = {
              selectedColor: colors.period + '80',
              type: 'predicted_period',
              customStyles: {
                container: {
                  backgroundColor: colors.period + '80',
                  borderRadius: 16,
                },
                text: {
                  color: colors.white,
                  fontWeight: '600',
                }
              }
            };
          }
        }
        current = current.add(1, 'day');
      }
      
      // 2. 标记排卵日
      if (prediction.ovulationDate.isBetween(monthStart, monthEnd, 'day', '[]')) {
        const ovulationKey = prediction.ovulationDate.format('YYYY-MM-DD');
        if (!calendarData[ovulationKey]) {
          // 最近的排卵日用深色，远期的用浅色
          const ovulationColor = isNearestCycle ? colors.ovulation : colors.ovulation + '70';
          
          calendarData[ovulationKey] = {
            selectedColor: ovulationColor,
            type: 'predicted_ovulation',
            cycleNumber: prediction.cycleNumber,
            customStyles: {
              container: {
                backgroundColor: ovulationColor,
                borderRadius: 16,
              },
              text: {
                color: colors.white,
                fontWeight: '600',
              }
            }
          };
        }
      }
      
      // 3. 标记受孕窗口
      let fertileDay = prediction.fertileStart;
      while (fertileDay.isSameOrBefore(prediction.fertileEnd)) {
        if (fertileDay.isBetween(monthStart, monthEnd, 'day', '[]')) {
          const fertileKey = fertileDay.format('YYYY-MM-DD');
          
          // 跳过已经标记为排卵日的日期
          if (!calendarData[fertileKey]) {
            // 最近的受孕窗口用深色，远期的用浅色
            const fertileColor = isNearestCycle ? colors.fertileLight : colors.fertileLight + '60';
            
            calendarData[fertileKey] = {
              selectedColor: fertileColor,
              type: 'predicted_fertile',
              cycleNumber: prediction.cycleNumber,
              customStyles: {
                container: {
                  backgroundColor: fertileColor,
                  borderRadius: 16,
                },
                text: {
                  color: colors.white,
                  fontWeight: '600',
                }
              }
            };
          }
        }
        fertileDay = fertileDay.add(1, 'day');
      }
    });
  }

  // 标记已记录的经期
  periods.forEach(period => {
    // Convert period dates from UTC to local
    const start = dayjs.utc(period.startDate).local();
    const end = period.endDate ? dayjs.utc(period.endDate).local() : start.add(preferences.avgPeriod, 'day');
    
    let current = start;
    while (current.isSameOrBefore(end) && current.isBefore(monthEnd.add(1, 'day'))) {
      if (current.isAfter(monthStart.subtract(1, 'day'))) {
        const dateKey = current.format('YYYY-MM-DD');
        // 只有在用户没有手动标记且不是LMP期间时，才标记为普通经期
        if (!calendarData[dateKey]) {
          calendarData[dateKey] = {
            selectedColor: colors.period,
            type: 'period',
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
      }
      current = current.add(1, 'day');
    }
  });

  console.log('=== getCalendarData 处理完成 ===');
  console.log('月份', month, '标记的日期总数:', Object.keys(calendarData).length);
  console.log('标记详情:', Object.keys(calendarData).map(date => 
    `${date}: ${calendarData[date].type}${calendarData[date].cycleNumber ? ` (周期${calendarData[date].cycleNumber})` : ''}`
  ));

  return calendarData;
}

/**
 * 根据用户选择的经期日期计算当前经期天数
 */
export function calculatePeriodDay(periodLogs: string[], selectedDate: string): number | null {
  if (periodLogs.length === 0) return null;
  
  // Convert UTC period logs to local for calculation
  const localPeriodLogs = periodLogs.map(utcDate => timezoneUtils.utcToLocal(utcDate));
  const today = dayjs().local();
  const selected = dayjs(selectedDate); // selectedDate is already in local timezone
  
  // 按日期排序
  const sortedLogs = [...localPeriodLogs].sort();
  
  // 找到包含选中日期的经期组
  const periodGroups = groupConsecutiveDates(sortedLogs);
  
  for (const group of periodGroups) {
    const groupStart = dayjs(group[0]);
    const groupEnd = dayjs(group[group.length - 1]);
    
    // 如果选中日期在这个组内
    if (selected.isBetween(groupStart, groupEnd, 'day', '[]')) {
      return selected.diff(groupStart, 'day') + 1;
    }
  }
  
  return null;
}

/**
 * 将连续的日期分组
 */
function groupConsecutiveDates(dates: string[]): string[][] {
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
}

/**
 * 获取当前经期信息（基于用户选择的日期）
 */
export function getCurrentPeriodInfo(periodLogs: string[], selectedDate: string) {
  const periodDay = calculatePeriodDay(periodLogs, selectedDate);
  
  if (!periodDay) return null;
  
  return {
    periodDay,
    isCurrentPeriod: true
  };
}
/**
 * 获取下次月经预测信息（基于LMP）
 */
export function getNextPeriodPrediction(preferences: Preferences) {
  if (!preferences.lastMenstrualPeriod) return null;
  
  // Convert LMP from UTC to local for calculation
  const lmpStart = dayjs.utc(preferences.lastMenstrualPeriod).local();
  const nextPeriodStart = lmpStart.add(preferences.avgCycle, 'day');
  const nextPeriodEnd = nextPeriodStart.add(preferences.avgPeriod - 1, 'day');
  
  return {
    startDate: nextPeriodStart.format('YYYY-MM-DD'),
    endDate: nextPeriodEnd.format('YYYY-MM-DD'),
    daysFromNow: nextPeriodStart.diff(dayjs().local(), 'day'),
    isOverdue: nextPeriodStart.isBefore(dayjs().local()),
  };
}

/**
 * 计算历史周期摘要
 */
export function getHistoricalCycles(periods: PeriodEntry[]) {
  const cycles = [];
  
  for (let i = 1; i < periods.length; i++) {
    const prevPeriod = periods[i - 1];
    const currentPeriod = periods[i];
    
    const cycleLength = dayjs(currentPeriod.startDate).diff(dayjs(prevPeriod.startDate), 'day');
    const periodLength = prevPeriod.endDate 
      ? dayjs(prevPeriod.endDate).diff(dayjs(prevPeriod.startDate), 'day')
      : 5; // 默认5天

    cycles.push({
      startDate: prevPeriod.startDate,
      endDate: prevPeriod.endDate,
      cycleLength,
      periodLength,
      status: calculateSingleCycleStatus(cycleLength, periodLength),
    });
  }

  return cycles.reverse(); // 最新的在前
}

function calculateSingleCycleStatus(cycleLength: number, periodLength: number): 'green' | 'yellow' | 'red' {
  // 周期长度判断
  if (cycleLength < 21 || cycleLength > 35) return 'red';
  if (cycleLength < 25 || cycleLength > 32) return 'yellow';
  
  // 经期长度判断
  if (periodLength < 2 || periodLength > 8) return 'red';
  if (periodLength < 3 || periodLength > 7) return 'yellow';
  
  return 'green';
}

/**
 * 根据用户选择的经期日期，推导最近一次月经的起始日（LMP）
 * 逻辑：对 periodLogs 进行排序并分组连续日期，取最后一组的第一天作为 LMP
 * 注意：periodLogs 存储的是 UTC 时间，需要转换为本地时间进行计算
 */
export function findLastPeriodStart(periodLogs: string[]): string | null {
  console.log('findLastPeriodStart periodLogs', periodLogs);
  if (!Array.isArray(periodLogs) || periodLogs.length === 0) {
    return null;
  }

  try {
    // Convert UTC dates to local for processing
    const localDates = periodLogs.map(utcDate => timezoneUtils.utcToLocal(utcDate));
    const uniqueSorted = Array.from(new Set(localDates)).sort();
    
    const groups = (function(dates: string[]) {
      if (dates.length === 0) return [] as string[][];
      const result: string[][] = [];
      let currentGroup: string[] = [dates[0]];
      for (let i = 1; i < dates.length; i++) {
        const prevDate = dayjs(dates[i - 1]);
        const currDate = dayjs(dates[i]);
        if (currDate.diff(prevDate, 'day') === 1) {
          currentGroup.push(dates[i]);
        } else {
          result.push(currentGroup);
          currentGroup = [dates[i]];
        }
      }
      result.push(currentGroup);
      return result;
    })(uniqueSorted);

    if (groups.length === 0) return null;
    const lastGroup = groups[groups.length - 1];
    const localLMP = lastGroup[0] || null;
    
    // Convert back to UTC for storage
    return localLMP ? timezoneUtils.localToUTC(localLMP) : null;
  } catch (e) {
    console.warn('findLastPeriodStart failed:', e);
    return null;
  }
}
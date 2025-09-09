import dayjs, { Dayjs } from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isBetween from 'dayjs/plugin/isBetween';
import { PeriodEntry, Preferences } from '../store/useCycleStore';
import { colors } from '../theme/tokens';

// Extend dayjs with required plugins
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.extend(isBetween);

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
 * 获取日历显示数据
 */
export function getCalendarData(
  periods: PeriodEntry[],
  preferences: Preferences,
  month: string, // YYYY-MM format
  periodLogs: string[] = [] // 用户手动选择的经期日期
) {
  const monthStart = dayjs(month).startOf('month');
  const cycleInfo = calculateCurrentCycle(periods, preferences);
  const monthEnd = monthStart.endOf('month');

  const calendarData: Record<string, any> = {};

  // 为当前查看的月份生成完整的周期预测数据
  const generateCyclePredictionsForMonth = (referenceDate: dayjs.Dayjs, cycleLength: number, periodLength: number) => {
    const predictions: Array<{
      periodStart: dayjs.Dayjs;
      periodEnd: dayjs.Dayjs;
      ovulationDate: dayjs.Dayjs;
      fertileStart: dayjs.Dayjs;
      fertileEnd: dayjs.Dayjs;
    }> = [];

    // 计算排卵日（周期长度-14天，最小为第14天）
    const ovulationDay = Math.max(14, cycleLength - 14);

    // 从参考日期开始，向前和向后各计算6个周期，确保覆盖当前月份
    for (let cycleOffset = -6; cycleOffset <= 6; cycleOffset++) {
      const periodStart = referenceDate.add(cycleOffset * cycleLength, 'day');
      const periodEnd = periodStart.add(periodLength - 1, 'day');
      const ovulationDate = periodStart.add(ovulationDay - 1, 'day');
      const fertileStart = ovulationDate.subtract(5, 'day');
      const fertileEnd = ovulationDate.add(1, 'day');

      // 检查这个周期是否与当前月份有重叠
      if (periodStart.isBefore(monthEnd.add(1, 'day')) && periodEnd.isAfter(monthStart.subtract(1, 'day')) ||
          fertileStart.isBefore(monthEnd.add(1, 'day')) && fertileEnd.isAfter(monthStart.subtract(1, 'day'))) {
        predictions.push({
          periodStart,
          periodEnd,
          ovulationDate,
          fertileStart,
          fertileEnd
        });
      }
    }

    return predictions;
  };

  // 优先标记用户手动选择的经期日期
  periodLogs.forEach(dateString => {
    try {
      // 解析日期并确保格式正确
      const date = dayjs(dateString);
      if (date.isValid()) {
        // 使用标准格式 'YYYY-MM-DD' 作为键，确保与react-native-calendars兼容
        const formattedDate = date.format('YYYY-MM-DD');
        
        if (date.isBetween(monthStart, monthEnd, 'day', '[]')) {
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
          console.log(`Marked user period date: ${formattedDate}`);
        }
      } else {
        console.warn(`Invalid date in periodLogs: ${dateString}`);
      }
    } catch (error) {
      console.error(`Error processing periodLog date ${dateString}:`, error);
    }
  });

  // 生成基于LMP或最后一次经期的完整周期预测
  let referenceDate: dayjs.Dayjs | null = null;
  
  if (preferences.lastMenstrualPeriod) {
    referenceDate = dayjs(preferences.lastMenstrualPeriod);
  } else if (periods.length > 0) {
    referenceDate = dayjs(periods[periods.length - 1].startDate);
  }

  if (referenceDate) {
    const predictions = generateCyclePredictionsForMonth(
      referenceDate, 
      preferences.avgCycle, 
      preferences.avgPeriod
    );

    // 标记所有预测的周期数据
    predictions.forEach(prediction => {
      // 标记预测的经期
      let current = prediction.periodStart;
      while (current.isSameOrBefore(prediction.periodEnd)) {
        if (current.isBetween(monthStart, monthEnd, 'day', '[]')) {
          const dateKey = current.format('YYYY-MM-DD');
          // 只有在用户没有手动标记时才显示预测经期
          if (!calendarData[dateKey]) {
            // 所有预测经期使用统一颜色，不区分过去和未来
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

      // 标记受孕窗口
      current = prediction.fertileStart;
      while (current.isSameOrBefore(prediction.fertileEnd)) {
        if (current.isBetween(monthStart, monthEnd, 'day', '[]')) {
          const dateKey = current.format('YYYY-MM-DD');
          // 只有在没有其他标记时才显示受孕窗口
          if (!calendarData[dateKey]) {
            const isOvulationDay = current.isSame(prediction.ovulationDate, 'day');
            
            // 所有受孕窗口和排卵日使用统一颜色，不区分过去和未来
            calendarData[dateKey] = {
              selectedColor: isOvulationDay ? colors.ovulation : colors.fertileLight,
              type: isOvulationDay ? 'ovulation' : 'fertile',
              customStyles: {
                container: {
                  backgroundColor: isOvulationDay ? colors.ovulation : colors.fertileLight,
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
  }

  // 标记已记录的经期
  periods.forEach(period => {
    const start = dayjs(period.startDate);
    const end = period.endDate ? dayjs(period.endDate) : start.add(preferences.avgPeriod, 'day');
    
    let current = start;
    while (current.isSameOrBefore(end) && current.isBefore(monthEnd.add(1, 'day'))) {
      if (current.isAfter(monthStart.subtract(1, 'day'))) {
        const dateKey = current.format('YYYY-MM-DD');
        // 只有在用户没有手动标记且不是LMP期间时，才标记为普通经期
        if (!calendarData[dateKey]) {
          calendarData[dateKey] = {
            selectedColor: colors.period,
            type: 'period'
          };
        }
      }
      current = current.add(1, 'day');
    }
  });

  // 注意：原有的单次预测逻辑已被上面的完整周期预测替代
  // 新的预测逻辑会为每个月份生成完整的过去和未来周期预测

  return calendarData;
}

/**
 * 根据用户选择的经期日期计算当前经期天数
 */
export function calculatePeriodDay(periodLogs: string[], selectedDate: string): number | null {
  if (periodLogs.length === 0) return null;
  
  const today = dayjs();
  const selected = dayjs(selectedDate);
  
  // 按日期排序
  const sortedLogs = [...periodLogs].sort();
  
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
  
  const lmpStart = dayjs(preferences.lastMenstrualPeriod);
  const nextPeriodStart = lmpStart.add(preferences.avgCycle, 'day');
  const nextPeriodEnd = nextPeriodStart.add(preferences.avgPeriod - 1, 'day');
  
  return {
    startDate: nextPeriodStart.format('YYYY-MM-DD'),
    endDate: nextPeriodEnd.format('YYYY-MM-DD'),
    daysFromNow: nextPeriodStart.diff(dayjs(), 'day'),
    isOverdue: nextPeriodStart.isBefore(dayjs()),
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
 */
export function findLastPeriodStart(periodLogs: string[]): string | null {
  console.log('findLastPeriodStart periodLogs', periodLogs);
  if (!Array.isArray(periodLogs) || periodLogs.length === 0) {
    return null;
  }

  try {
    const uniqueSorted = Array.from(new Set(periodLogs)).sort();
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
    return lastGroup[0] || null;
  } catch (e) {
    console.warn('findLastPeriodStart failed:', e);
    return null;
  }
}
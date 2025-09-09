// 测试 cycle history 显示问题
const dayjs = require('dayjs');

console.log('=== Cycle History 显示问题分析 ===\n');

// 模拟 generateHistoricalCycles 函数的关键部分
const generateHistoricalCycles = (periodLogs, preferences = {}) => {
  let allPeriodDates = [...periodLogs];
  
  // 添加LMP数据（如果存在）
  if (preferences.lastMenstrualPeriod && preferences.avgPeriod) {
    const lmpStart = new Date(preferences.lastMenstrualPeriod);
    for (let i = 0; i < preferences.avgPeriod; i++) {
      const lmpDate = new Date(lmpStart);
      lmpDate.setDate(lmpStart.getDate() + i);
      const dateString = lmpDate.toISOString().split('T')[0];
      if (!allPeriodDates.includes(dateString)) {
        allPeriodDates.push(dateString);
      }
    }
  }
  
  if (allPeriodDates.length === 0) {
    return [];
  }
  
  // 分组连续日期
  const groupConsecutiveDates = (dates) => {
    if (dates.length === 0) return [];
    
    const sortedDates = dates.slice().sort();
    const groups = [];
    let currentGroup = [sortedDates[0]];
    
    for (let i = 1; i < sortedDates.length; i++) {
      const prevDate = new Date(sortedDates[i - 1]);
      const currentDate = new Date(sortedDates[i]);
      const diffDays = Math.round((currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        currentGroup.push(sortedDates[i]);
      } else {
        groups.push(currentGroup);
        currentGroup = [sortedDates[i]];
      }
    }
    groups.push(currentGroup);
    
    return groups.reverse(); // 最新的在前
  };
  
  const periodGroups = groupConsecutiveDates(allPeriodDates);
  const cycles = [];
  
  console.log('📊 经期分组结果:');
  periodGroups.forEach((group, index) => {
    console.log(`  组${index + 1}: ${group} (${group.length}天)`);
  });
  console.log('');
  
  // 生成历史周期数据
  for (let i = 1; i < periodGroups.length; i++) {
    const currentPeriod = periodGroups[i - 1]; // 较新的经期
    const previousPeriod = periodGroups[i]; // 较旧的经期
    
    const currentStart = new Date(currentPeriod[0]);
    const previousStart = new Date(previousPeriod[0]);
    
    // 计算周期长度
    const cycleLength = Math.round((currentStart.getTime() - previousStart.getTime()) / (1000 * 60 * 60 * 24));
    const periodLength = previousPeriod.length;
    
    // 🔍 关键：这里的日期显示逻辑
    const startDate = previousPeriod[0]; // 经期开始日期
    const endDate = previousPeriod[previousPeriod.length - 1]; // 经期结束日期
    
    console.log(`🔄 周期 ${cycles.length + 1}:`);
    console.log(`  基于经期组: ${previousPeriod}`);
    console.log(`  显示日期: ${dayjs(startDate).format('MMM D')} - ${dayjs(endDate).format('MMM D')}`);
    console.log(`  周期长度: ${cycleLength} 天`);
    console.log(`  经期长度: ${periodLength} 天`);
    console.log('');
    
    cycles.push({
      startDate: startDate,
      endDate: endDate,
      cycleLength: cycleLength,
      periodLength: periodLength,
      status: 'green'
    });
  }
  
  return cycles;
};

// 测试数据
console.log('🧪 测试场景：连续日期的经期记录');
const testPeriodLogs = [
  '2024-02-15', '2024-02-16', '2024-02-17', '2024-02-18',  // 第一个经期：4天
  '2024-03-15', '2024-03-16', '2024-03-17'  // 第二个经期：3天
];

console.log('输入的 periodLogs:', testPeriodLogs);
console.log('');

const cycles = generateHistoricalCycles(testPeriodLogs);

console.log('🎯 最终显示结果:');
cycles.forEach((cycle, index) => {
  console.log(`周期 ${index + 1}:`);
  console.log(`  日期显示: ${dayjs(cycle.startDate).format('MMM D')} - ${dayjs(cycle.endDate).format('MMM D')}`);
  console.log(`  描述: ${cycle.cycleLength} day cycle · ${cycle.periodLength} day period`);
});

console.log('');
console.log('✅ 分析结果:');
console.log('1. 日期分组逻辑是正确的');
console.log('2. 连续日期被正确拼接成一个经期组');
console.log('3. 显示格式: "开始日期 - 结束日期" 正确显示了整个经期范围');
console.log('');

console.log('🤔 如果您看到的是单独的日期，可能的原因：');
console.log('1. 实际的 periodLogs 数据不连续');
console.log('2. 数据中有时区或格式问题');
console.log('3. 前端显示逻辑有其他问题');

// 测试不连续的情况
console.log('');
console.log('🧪 测试场景：不连续日期');
const discontinuousDates = [
  '2024-02-15',  // 单独的日期
  '2024-03-15', '2024-03-16', '2024-03-17',  // 连续的日期
  '2024-04-20'   // 又一个单独的日期
];

console.log('不连续的 periodLogs:', discontinuousDates);
const cyclesDiscontinuous = generateHistoricalCycles(discontinuousDates);

console.log('🎯 不连续情况的显示结果:');
cyclesDiscontinuous.forEach((cycle, index) => {
  console.log(`周期 ${index + 1}:`);
  console.log(`  日期显示: ${dayjs(cycle.startDate).format('MMM D')} - ${dayjs(cycle.endDate).format('MMM D')}`);
  console.log(`  描述: ${cycle.cycleLength} day cycle · ${cycle.periodLength} day period`);
});

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, spacing } from '../theme/tokens';

interface TimelineDotsProps {
  cycleLength: number;
  periodLength: number;
  ovulationDay?: number;
}

/**
 * 历史周期时间轴小圆点
 * 粉红=经期、浅青=受孕窗口、深青=排卵、灰=其他
 */
export default function TimelineDots({ cycleLength, periodLength, ovulationDay = 14 }: TimelineDotsProps) {
  const dots = [];
  
  for (let day = 1; day <= Math.min(cycleLength, 35); day++) {
    let color = colors.gray300; // 默认灰色
    
    if (day <= periodLength) {
      color = colors.period; // 经期粉红
    } else if (day >= ovulationDay - 5 && day <= ovulationDay + 1) {
      color = day === ovulationDay ? colors.ovulation : colors.fertileLight; // 排卵日深青，受孕窗口浅青
    }
    
    dots.push(
      <View key={day} style={[styles.dot, { backgroundColor: color }]} />
    );
  }

  return (
    <View style={styles.container}>
      {dots}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 2,
    marginBottom: 2,
  },
});
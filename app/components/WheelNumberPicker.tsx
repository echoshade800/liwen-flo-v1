import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { colors, radii, spacing, typography } from '../theme/tokens';

interface WheelNumberPickerProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
}

const { height: screenHeight } = Dimensions.get('window');
const ITEM_HEIGHT = 50;
const VISIBLE_ITEMS = 5;

export default function WheelNumberPicker({ 
  value, 
  onChange, 
  min, 
  max, 
  step = 1, 
  unit = 'days' 
}: WheelNumberPickerProps) {
  const scrollViewRef = useRef<ScrollView>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  
  const options = [];
  for (let i = min; i <= max; i += step) {
    options.push(i);
  }

  const selectedIndex = options.indexOf(value);
  const containerHeight = VISIBLE_ITEMS * ITEM_HEIGHT;

  useEffect(() => {
    if (scrollViewRef.current && selectedIndex >= 0) {
      const scrollToY = selectedIndex * ITEM_HEIGHT;
      scrollViewRef.current.scrollTo({ y: scrollToY, animated: false });
    }
  }, [selectedIndex]);

  const handleScroll = (event: any) => {
    if (!isScrolling) return;
    
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    const clampedIndex = Math.max(0, Math.min(index, options.length - 1));
    
    if (options[clampedIndex] !== value) {
      onChange(options[clampedIndex]);
    }
  };

  const handleScrollBegin = () => {
    setIsScrolling(true);
  };

  const handleScrollEnd = (event: any) => {
    setIsScrolling(false);
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    const clampedIndex = Math.max(0, Math.min(index, options.length - 1));
    
    // 确保滚动到正确位置
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ 
        y: clampedIndex * ITEM_HEIGHT, 
        animated: true 
      });
    }
    
    if (options[clampedIndex] !== value) {
      onChange(options[clampedIndex]);
    }
  };

  const renderItem = (option: number, index: number) => {
    const isSelected = option === value;
    const distanceFromCenter = Math.abs(index - selectedIndex);
    const opacity = Math.max(0.3, 1 - distanceFromCenter * 0.2);
    
    return (
      <View key={option} style={[styles.item, { height: ITEM_HEIGHT }]}>
        <Text style={[
          styles.itemText,
          isSelected && styles.selectedText,
          { opacity }
        ]}>
          {option}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.pickerContainer}>
        <View style={[styles.wheelContainer, { height: containerHeight }]}>
          {/* 选中指示器 */}
          <View style={styles.selectedIndicator} />
          
          <ScrollView
            ref={scrollViewRef}
            style={styles.scrollView}
            contentContainerStyle={[
              styles.scrollContent,
              { paddingVertical: (VISIBLE_ITEMS - 1) * ITEM_HEIGHT / 2 }
            ]}
            showsVerticalScrollIndicator={false}
            onScroll={handleScroll}
            onScrollBeginDrag={handleScrollBegin}
            onScrollEndDrag={handleScrollEnd}
            onMomentumScrollEnd={handleScrollEnd}
            scrollEventThrottle={16}
            snapToInterval={ITEM_HEIGHT}
            decelerationRate="fast"
          >
            {options.map((option, index) => renderItem(option, index))}
          </ScrollView>
        </View>
        
        <Text style={styles.unit}>{unit}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: spacing(2),
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray100,
    borderRadius: radii.card,
    paddingHorizontal: spacing(3),
    paddingVertical: spacing(2),
  },
  wheelContainer: {
    position: 'relative',
    width: 80,
    overflow: 'hidden',
  },
  selectedIndicator: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    marginTop: -ITEM_HEIGHT / 2,
    backgroundColor: colors.white,
    borderRadius: radii.medium,
    zIndex: -1,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
  },
  item: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  itemText: {
    ...typography.h3,
    color: colors.textSecondary,
    fontWeight: '500',
    zIndex: 2,
  },
  selectedText: {
    color: colors.text,
    fontWeight: '700',
    zIndex: 2,
  },
  unit: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
    marginLeft: spacing(2),
  },
});
import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { colors, radii, spacing, typography } from '../theme/tokens';

interface BirthYearPickerProps {
  value: number;
  onChange: (value: number) => void;
  minYear: number;
  maxYear: number;
}

const { height: screenHeight } = Dimensions.get('window');
const ITEM_HEIGHT = 80;
const VISIBLE_ITEMS = 5;

export default function BirthYearPicker({ 
  value, 
  onChange, 
  minYear, 
  maxYear 
}: BirthYearPickerProps) {
  const scrollViewRef = useRef<ScrollView>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  
  const years = [];
  for (let year = maxYear; year >= minYear; year--) {
    years.push(year);
  }

  const selectedIndex = years.indexOf(value);
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
    const clampedIndex = Math.max(0, Math.min(index, years.length - 1));
    
    if (years[clampedIndex] !== value) {
      onChange(years[clampedIndex]);
    }
  };

  const handleScrollBegin = () => {
    setIsScrolling(true);
  };

  const handleScrollEnd = (event: any) => {
    setIsScrolling(false);
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    const clampedIndex = Math.max(0, Math.min(index, years.length - 1));
    
    // Ensure scroll to correct position
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ 
        y: clampedIndex * ITEM_HEIGHT, 
        animated: true 
      });
    }
    
    if (years[clampedIndex] !== value) {
      onChange(years[clampedIndex]);
    }
  };

  const renderItem = (year: number, index: number) => {
    const isSelected = year === value;
    const distanceFromCenter = Math.abs(index - selectedIndex);
    const opacity = Math.max(0.3, 1 - distanceFromCenter * 0.2);
    
    return (
      <View key={year} style={[styles.item, { height: ITEM_HEIGHT }]}>
        <Text style={[
          styles.itemText,
          isSelected && styles.selectedText,
          { opacity }
        ]}>
          {year}
        </Text>
        {isSelected && (
          <Text style={styles.selectLabel}>Select</Text>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.wheelContainer, { height: containerHeight }]}>
        {/* Selected indicator background */}
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
          {years.map((year, index) => renderItem(year, index))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  wheelContainer: {
    position: 'relative',
    width: 200,
    overflow: 'hidden',
  },
  selectedIndicator: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    marginTop: -ITEM_HEIGHT / 2,
    backgroundColor: colors.gray100,
    borderRadius: radii.medium,
    zIndex: -1,
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
    position: 'relative',
  },
  itemText: {
    fontSize: 32,
    color: colors.textSecondary,
    fontWeight: '400',
    zIndex: 2,
  },
  selectedText: {
    color: colors.text,
    fontWeight: '700',
    zIndex: 2,
  },
  selectLabel: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
    position: 'absolute',
    bottom: 8,
    zIndex: 2,
  },
});
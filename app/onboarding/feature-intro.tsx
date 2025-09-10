import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { colors, radii, spacing, typography } from '../theme/tokens';

const { width: screenWidth } = Dimensions.get('window');

const FEATURES = [
  {
    id: 'calendar',
    title: 'Smart Calendar',
    description: 'Intuitively view your menstrual cycle, ovulation day, and fertile window',
    emoji: '📅',
    color: colors.primary,
  },
  {
    id: 'insights',
    title: 'Daily Insights',
    description: 'Record symptoms, mood, and physical condition to understand body patterns',
    emoji: '💡',
    color: colors.ovulation,
  },
  {
    id: 'predictions',
    title: 'Accurate Predictions',
    description: 'Based on your data, predict next period and optimal conception timing',
    emoji: '🔮',
    color: colors.fertileLight,
  },
  {
    id: 'trends',
    title: 'Trend Analysis',
    description: 'View cycle trends and timely discover body changes',
    emoji: '📈',
    color: colors.yellow,
  },
];

export default function FeatureIntroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleNext = () => {
    if (currentIndex < FEATURES.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ x: nextIndex * screenWidth, animated: true });
      }
    } else {
      router.push('/onboarding/birth-year');
    }
  };

  const handleSkip = () => {
    router.push('/onboarding/birth-year');
  };

  const onScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(contentOffsetX / screenWidth);
    setCurrentIndex(newIndex);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {FEATURES.map((feature, index) => (
          <View key={feature.id} style={styles.page}>
            <View style={[styles.emojiContainer, { backgroundColor: feature.color + '20' }]}>
              <Text style={styles.emoji}>{feature.emoji}</Text>
            </View>
            <Text style={styles.title}>{feature.title}</Text>
            <Text style={styles.description}>{feature.description}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.indicators}>
        {FEATURES.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              index === currentIndex && styles.activeIndicator
            ]}
          />
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>
          {currentIndex === FEATURES.length - 1 ? 'Get Started' : 'Next'}
        </Text>
      </TouchableOpacity>
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
    justifyContent: 'flex-end',
    paddingHorizontal: spacing(3),
    paddingTop: spacing(2),
  },
  skipText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  page: {
    width: screenWidth,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing(4),
  },
  emojiContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing(4),
  },
  emoji: {
    fontSize: 48,
  },
  title: {
    ...typography.h2,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing(2),
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: spacing(2),
  },
  indicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: spacing(3),
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.gray300,
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: colors.primary,
    width: 24,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: radii.card,
    paddingVertical: spacing(2),
    paddingHorizontal: spacing(4),
    marginHorizontal: spacing(3),
    marginBottom: spacing(3),
  },
  buttonText: {
    ...typography.body,
    color: colors.white,
    textAlign: 'center',
    fontWeight: '600',
  },
});
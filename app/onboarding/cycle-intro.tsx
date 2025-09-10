import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Platform, StatusBar } from 'react-native';
import { router } from 'expo-router';
import { colors, radii, spacing, typography } from '../theme/tokens';

export default function CycleIntroScreen() {
  const handleContinue = () => {
    router.push('/onboarding/questions');
  };

  return (
    <SafeAreaView style={[styles.container, Platform.OS === 'android' && { paddingTop: StatusBar.currentHeight }]}>
      <View style={styles.content}>
        {/* Illustration Area */}
        <View style={styles.illustrationContainer}>
          {/* Calendar Icon */}
          <View style={styles.calendarIcon}>
            <View style={styles.calendarHeader} />
            <View style={styles.calendarBody}>
              <View style={styles.calendarRow}>
                <View style={styles.calendarDot} />
                <View style={styles.calendarDot} />
                <View style={styles.calendarDot} />
                <View style={styles.calendarDot} />
                <View style={styles.calendarDot} />
              </View>
              <View style={styles.calendarRow}>
                <View style={[styles.calendarDot, styles.periodDot]} />
                <View style={[styles.calendarDot, styles.periodDot]} />
                <View style={[styles.calendarDot, styles.periodDot]} />
                <View style={styles.calendarDot} />
                <View style={styles.calendarDot} />
              </View>
            </View>
          </View>

          {/* Chart Icon */}
          <View style={styles.chartIcon}>
            <View style={styles.chartLine}>
              <View style={[styles.chartPoint, { left: '20%', top: '60%' }]} />
              <View style={[styles.chartPoint, { left: '40%', top: '30%' }]} />
              <View style={[styles.chartPoint, { left: '60%', top: '50%' }]} />
              <View style={[styles.chartPoint, { left: '80%', top: '20%' }]} />
            </View>
          </View>

          {/* Central Figure */}
          <View style={styles.figureContainer}>
            <View style={styles.figure}>
              <View style={styles.figureHead} />
              <View style={styles.figureBody} />
            </View>
          </View>

          {/* Mood Icon */}
          <View style={styles.moodIcon}>
            <Text style={styles.moodEmoji}>😊</Text>
          </View>

          {/* Food Icon */}
          <View style={styles.foodIcon}>
            <View style={styles.burger}>
              <View style={styles.burgerTop} />
              <View style={styles.burgerMiddle} />
              <View style={styles.burgerBottom} />
            </View>
          </View>
        </View>

        {/* Text Content */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>Be prepared, every cycle is in your hands.</Text>
          
          <View style={styles.featuresContainer}>
            <View style={styles.featureItem}>
              <View style={styles.checkmark}>
                <Text style={styles.checkmarkText}>✓</Text>
              </View>
              <Text style={styles.featureText}>Get accurate period predictions and symptom insights.</Text>
            </View>
            
            <View style={styles.featureItem}>
              <View style={styles.checkmark}>
                <Text style={styles.checkmarkText}>✓</Text>
              </View>
              <Text style={styles.featureText}>Easily track your period, see upcoming cycles, and understand your fertile days.</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleContinue}>
          <Text style={styles.buttonText}>Next</Text>
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
  content: {
    flex: 1,
    paddingHorizontal: spacing(3),
    justifyContent: 'space-between',
    paddingTop: spacing(4),
    paddingBottom: spacing(3),
  },
  illustrationContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginVertical: spacing(4),
  },
  // Calendar Icon (top left)
  calendarIcon: {
    position: 'absolute',
    top: '10%',
    left: '10%',
    backgroundColor: colors.white,
    borderRadius: radii.medium,
    padding: spacing(1),
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  calendarHeader: {
    width: 40,
    height: 8,
    backgroundColor: colors.primary,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    marginBottom: 2,
  },
  calendarBody: {
    width: 40,
    backgroundColor: colors.gray100,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    padding: 4,
  },
  calendarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  calendarDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.gray300,
  },
  periodDot: {
    backgroundColor: colors.period,
  },
  // Chart Icon (top right)
  chartIcon: {
    position: 'absolute',
    top: '15%',
    right: '15%',
    width: 60,
    height: 40,
    backgroundColor: colors.white,
    borderRadius: radii.medium,
    padding: spacing(1),
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartLine: {
    flex: 1,
    position: 'relative',
  },
  chartPoint: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.period,
  },
  // Central Figure
  figureContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  figure: {
    alignItems: 'center',
  },
  figureHead: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#D4A574', // Skin tone
    marginBottom: spacing(1),
  },
  figureBody: {
    width: 100,
    height: 120,
    backgroundColor: colors.white,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  // Mood Icon (bottom left)
  moodIcon: {
    position: 'absolute',
    bottom: '20%',
    left: '15%',
    width: 50,
    height: 50,
    backgroundColor: '#FFA726',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  moodEmoji: {
    fontSize: 24,
  },
  // Food Icon (bottom right)
  foodIcon: {
    position: 'absolute',
    bottom: '25%',
    right: '10%',
    width: 50,
    height: 50,
    backgroundColor: colors.fertileLight,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  burger: {
    alignItems: 'center',
  },
  burgerTop: {
    width: 20,
    height: 4,
    backgroundColor: '#8B4513',
    borderRadius: 2,
    marginBottom: 1,
  },
  burgerMiddle: {
    width: 16,
    height: 3,
    backgroundColor: '#228B22',
    borderRadius: 1,
    marginBottom: 1,
  },
  burgerBottom: {
    width: 20,
    height: 4,
    backgroundColor: '#8B4513',
    borderRadius: 2,
  },
  // Text Content
  textContainer: {
    paddingHorizontal: spacing(2),
  },
  title: {
    ...typography.h2,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing(4),
    lineHeight: 32,
  },
  featuresContainer: {
    marginBottom: spacing(2),
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing(2),
    paddingHorizontal: spacing(1),
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.period,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing(2),
    marginTop: 2,
  },
  checkmarkText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  featureText: {
    ...typography.body,
    color: colors.text,
    flex: 1,
    lineHeight: 24,
  },
  button: {
    backgroundColor: colors.period,
    borderRadius: radii.pill,
    paddingVertical: spacing(2),
    paddingHorizontal: spacing(4),
    marginHorizontal: spacing(2),
  },
  buttonText: {
    ...typography.body,
    color: colors.white,
    textAlign: 'center',
    fontWeight: '600',
  },
});
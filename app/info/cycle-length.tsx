import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii, spacing, typography } from '../theme/tokens';

export default function CycleLengthInfoScreen() {
  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, Platform.OS === 'android' && { paddingTop: StatusBar.currentHeight }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cycle Length Info</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Menstrual Cycle Length & When to Seek Care</Text>

        <Text style={styles.sectionTitle}>How cycle length is calculated</Text>
        <Text style={styles.body}>
          Cycle length is counted from <Text style={styles.bold}>the first day of one period (day 1 of bleeding)</Text> to <Text style={styles.bold}>the day before the next period starts</Text>.
        </Text>

        <Text style={styles.sectionTitle}>Why it matters</Text>
        <Text style={styles.body}>
          Cycle length, period length, and cycle regularity are core features of the menstrual cycle. They're useful indicators of reproductive health and overall wellbeing.
        </Text>

        <Text style={styles.sectionTitle}>"Previous cycle length"</Text>
        <Text style={styles.body}>
          This refers to the length of the cycle <Text style={styles.bold}>before</Text> your last period.
        </Text>

        <Text style={styles.sectionTitle}>What's considered a typical cycle?</Text>
        <Text style={styles.body}>
          The American College of Obstetricians and Gynecologists (ACOG) notes that a typical menstrual cycle usually lasts <Text style={styles.bold}>21–35 days</Text>.
        </Text>

        <Text style={styles.sectionTitle}>What can affect cycle length?</Text>
        <Text style={styles.body}>
          Many factors can change cycle length, including:
        </Text>
        
        <View style={styles.listContainer}>
          <Text style={styles.bulletPoint}>• Hormonal contraception</Text>
          <Text style={styles.bulletPoint}>• High-intensity exercise</Text>
          <Text style={styles.bulletPoint}>• Eating disorders</Text>
          <Text style={styles.bulletPoint}>• Rapid changes in body weight</Text>
          <Text style={styles.bulletPoint}>• Hormonal shifts during puberty or perimenopause</Text>
          <Text style={styles.bulletPoint}>• Stress</Text>
          <Text style={styles.bulletPoint}>• Endocrine disorders</Text>
          <Text style={styles.bulletPoint}>• Puberty (cycle length often varies during the first 1–2 years)</Text>
        </View>

        <View style={styles.noteBox}>
          <Text style={styles.noteText}>
            <Text style={styles.bold}>Note (perimenopause):</Text> During perimenopause, cycles may shorten to <Text style={styles.bold}>2–3 weeks</Text> or stretch to <Text style={styles.bold}>several months</Text>. If this happens, it's best to consult a clinician.
          </Text>
        </View>

        <Text style={styles.body}>
          Incorrect or missing period entries can make your displayed cycle length look unusual. This is often due to skipping a logged period. You can update past events anytime from the calendar.
        </Text>

        <Text style={styles.sectionTitle}>When should I talk to a clinician?</Text>
        <Text style={styles.body}>
          Everyone is different, and life happens—an occasional long or short cycle can be normal. <Text style={styles.bold}>See a healthcare professional</Text> if your cycle length is frequently outside your usual pattern. They can help identify causes and suggest treatment if needed.
        </Text>

        <Text style={styles.body}>
          You should also seek medical advice if any of the following apply:
        </Text>

        <View style={styles.listContainer}>
          <Text style={styles.bulletPoint}>• Your period suddenly stops for <Text style={styles.bold}>more than 90 days</Text> and you're not pregnant.</Text>
          <Text style={styles.bulletPoint}>• Your periods were regular, then suddenly become irregular.</Text>
          <Text style={styles.bulletPoint}>• Bleeding lasts <Text style={styles.bold}>more than 7 days</Text>.</Text>
          <Text style={styles.bulletPoint}>• You bleed much more than usual, or soak through one or more pads/tampons <Text style={styles.bold}>every 1–2 hours</Text>.</Text>
          <Text style={styles.bulletPoint}>• You bleed <Text style={styles.bold}>between periods</Text>.</Text>
          <Text style={styles.bulletPoint}>• You have <Text style={styles.bold}>severe menstrual pain</Text>.</Text>
          <Text style={styles.bulletPoint}>• You feel <Text style={styles.bold}>dizzy</Text>.</Text>
          <Text style={styles.bulletPoint}>• You experience <Text style={styles.bold}>shortness of breath</Text>.</Text>
          <Text style={styles.bulletPoint}>• You have <Text style={styles.bold}>pain or bleeding during sex</Text>.</Text>
        </View>

        <Text style={styles.sectionTitle}>Track your cycle</Text>
        <Text style={styles.body}>
          Track cycle features and symptoms in <Text style={styles.bold}>Period</Text> to better understand your body and receive information tailored to your current situation.
        </Text>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Important note</Text>
        <View style={styles.importantBox}>
          <Text style={styles.importantText}>
            <Text style={styles.bold}>Period is not a diagnostic tool.</Text> Information provided in the app is not a substitute for professional medical advice. If you have questions about your menstrual cycle, consult a doctor or other qualified healthcare professional. Guidance from local health authorities may differ if you live outside the United States.
          </Text>
        </View>

        <View style={styles.bottomSpacing} />
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing(3),
    paddingVertical: spacing(2),
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray300,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...typography.h3,
    color: colors.text,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing(3),
  },
  title: {
    ...typography.h1,
    color: colors.text,
    marginTop: spacing(3),
    marginBottom: spacing(3),
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginTop: spacing(3),
    marginBottom: spacing(2),
  },
  body: {
    ...typography.body,
    color: colors.text,
    lineHeight: 24,
    marginBottom: spacing(2),
  },
  bold: {
    fontWeight: '600',
  },
  listContainer: {
    marginBottom: spacing(2),
  },
  bulletPoint: {
    ...typography.body,
    color: colors.text,
    lineHeight: 22,
    marginBottom: spacing(1),
    marginLeft: spacing(1),
  },
  noteBox: {
    backgroundColor: colors.primary + '10',
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    padding: spacing(2),
    borderRadius: radii.medium,
    marginVertical: spacing(2),
  },
  noteText: {
    ...typography.body,
    color: colors.primary,
    lineHeight: 22,
  },
  importantBox: {
    backgroundColor: colors.red + '10',
    borderLeftWidth: 4,
    borderLeftColor: colors.red,
    padding: spacing(2),
    borderRadius: radii.medium,
    marginVertical: spacing(2),
  },
  importantText: {
    ...typography.body,
    color: colors.red,
    lineHeight: 22,
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray300,
    marginVertical: spacing(3),
  },
  bottomSpacing: {
    height: spacing(4),
  },
});
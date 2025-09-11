import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii, spacing, typography } from '../theme/tokens';

export default function PeriodLengthInfoScreen() {
  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, Platform.OS === 'android' && { paddingTop: StatusBar.currentHeight }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Period Length Info</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Period Length: What It Is and When to Seek Help</Text>

        <Text style={styles.sectionTitle}>How period length is measured</Text>
        <Text style={styles.body}>
          Period length is counted from the <Text style={styles.bold}>first day you bleed</Text> (any amount) until the <Text style={styles.bold}>last day of bleeding</Text>.
        </Text>

        <Text style={styles.body}>
          Period length, overall cycle length, and cycle regularity are core menstrual features and important indicators of reproductive and general health.
        </Text>

        <Text style={styles.body}>
          <Text style={styles.bold}>Previous period length</Text> refers to the number of bleeding days <Text style={styles.bold}>in the cycle immediately before the last one</Text>.
        </Text>

        <Text style={styles.sectionTitle}>What's typical?</Text>
        <Text style={styles.body}>
          The <Text style={styles.bold}>American College of Obstetricians and Gynecologists (ACOG)</Text> considers a <Text style={styles.bold}>normal period</Text> to last <Text style={styles.bold}>2–7 days</Text>.
        </Text>

        <Text style={styles.sectionTitle}>What can affect period length?</Text>
        <Text style={styles.body}>
          Period length is influenced by many factors, including <Text style={styles.bold}>genetics, lifestyle, and body weight</Text>. Some people naturally have longer periods; others have shorter ones. It's also normal for your period to be occasionally shorter or longer due to changes in lifestyle, medications, stress, travel, and other factors that affect hormones.
        </Text>

        <Text style={styles.body}>
          Certain <Text style={styles.bold}>hormonal contraceptives</Text> may change your usual period length.
        </Text>

        <Text style={styles.body}>
          In some cases, <Text style={styles.bold}>prolonged bleeding</Text> (more than 7 days) can be associated with underlying conditions such as <Text style={styles.bold}>uterine polyps, fibroids, or adenomyosis</Text>.
        </Text>

        <Text style={styles.body}>
          <Text style={styles.bold}>Very short bleeding</Text> (less than 2 days) can sometimes be linked to reproductive tract conditions such as <Text style={styles.bold}>intrauterine adhesions (Asherman's syndrome)</Text> or <Text style={styles.bold}>endometrial tuberculosis</Text>—though these are uncommon.
        </Text>

        <Text style={styles.body}>
          During <Text style={styles.bold}>perimenopause</Text>, your bleeding amount may change (often slightly heavier).
        </Text>

        <View style={styles.noteBox}>
          <Text style={styles.noteText}>
            <Text style={styles.bold}>Data tip:</Text> Incorrect or missing entries can make your period length look too long or too short. You can always revisit the <Text style={styles.bold}>calendar</Text> to correct past events.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>When should you talk to a clinician?</Text>
        <Text style={styles.body}>
          Small month-to-month shifts in period length due to hormonal changes are common. Still, if your periods are <Text style={styles.bold}>frequently</Text> too short or too long, consider seeking medical advice.
        </Text>

        <Text style={styles.body}>
          If you experience <Text style={styles.bold}>heavy bleeding</Text>, especially when it affects your body, mood, and/or daily life, it's important to get care. Heavy bleeding can happen even when a period lasts only 2–7 days.
        </Text>

        <Text style={styles.body}>
          <Text style={styles.bold}>Heavy doesn't always mean something is wrong</Text>, but you should be evaluated for <Text style={styles.bold}>heavy menstrual bleeding (HMB)</Text> if you have:
        </Text>

        <View style={styles.listContainer}>
          <Text style={styles.bulletPoint}>• Bleeding that lasts <Text style={styles.bold}>more than 7 days</Text></Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.bold}>Saturating a pad or tampon every hour for several hours in a row</Text></Text>
          <Text style={styles.bulletPoint}>• Needing to use <Text style={styles.bold}>more than one pad at a time</Text> to prevent leaks</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.bold}>Changing pads/tampons overnight</Text></Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.bold}>Dizziness, lightheadedness, weakness, fatigue, chest pain, or shortness of breath</Text> during or after your period</Text>
          <Text style={styles.bulletPoint}>• Passing blood <Text style={styles.bold}>clots as large as a one-yuan coin (about the size of a US quarter) or larger</Text></Text>
        </View>

        <Text style={styles.body}>
          Also contact a clinician if you have any of the following:
        </Text>

        <View style={styles.listContainer}>
          <Text style={styles.bulletPoint}>1. Your period <Text style={styles.bold}>stops for more than 90 days</Text> and you're <Text style={styles.bold}>not pregnant</Text></Text>
          <Text style={styles.bulletPoint}>2. Cycles come <Text style={styles.bold}>less than 21 days</Text> apart or <Text style={styles.bold}>more than 35 days</Text> apart</Text>
          <Text style={styles.bulletPoint}>3. Previously regular periods suddenly become <Text style={styles.bold}>irregular</Text></Text>
          <Text style={styles.bulletPoint}>4. <Text style={styles.bold}>Bleeding between periods</Text></Text>
          <Text style={styles.bulletPoint}>5. <Text style={styles.bold}>Severe period pain</Text></Text>
          <Text style={styles.bulletPoint}>6. <Text style={styles.bold}>Pain or bleeding with sex</Text></Text>
          <Text style={styles.bulletPoint}>7. <Text style={styles.bold}>Irregular periods while trying to conceive</Text></Text>
        </View>

        <Text style={styles.sectionTitle}>Track in Period</Text>
        <Text style={styles.body}>
          Log your cycle features and symptoms in <Text style={styles.bold}>Period</Text> to learn more about your body and receive information tailored to your current situation.
        </Text>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Important note</Text>
        <View style={styles.importantBox}>
          <Text style={styles.importantText}>
            <Text style={styles.bold}>Note:</Text> Period is <Text style={styles.bold}>not</Text> a diagnostic tool. Information provided by Period does <Text style={styles.bold}>not</Text> replace advice from a healthcare professional. If you have questions about your cycle, consult a clinician. Local guidelines outside the United States may differ.
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
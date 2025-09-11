import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii, spacing, typography } from '../theme/tokens';

export default function CycleVariationInfoScreen() {
  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, Platform.OS === 'android' && { paddingTop: StatusBar.currentHeight }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cycle Variation Info</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Cycle Regularity: What It Means and What Affects It</Text>

        <Text style={styles.sectionTitle}>How cycle length is counted</Text>
        <Text style={styles.body}>
          Cycle length is measured from <Text style={styles.bold}>day 1 of one period</Text> to <Text style={styles.bold}>day 1 of the next</Text>.
          {'\n'}It doesn't have to be identical every time—length can vary from cycle to cycle.
        </Text>

        <Text style={styles.sectionTitle}>What counts as a "regular" cycle?</Text>
        <Text style={styles.body}>
          According to the <Text style={styles.bold}>American College of Obstetricians and Gynecologists (ACOG)</Text>, a cycle pattern is considered <Text style={styles.bold}>regular</Text> if the variation in length is <Text style={styles.bold}>no more than 7 days</Text>.
        </Text>

        <Text style={styles.subTitle}>Examples</Text>
        <View style={styles.listContainer}>
          <Text style={styles.bulletPoint}>• Shortest recent cycle: <Text style={styles.bold}>27 days</Text>; longest: <Text style={styles.bold}>30 days</Text> → difference <Text style={styles.bold}>3 days</Text> → <Text style={styles.bold}>regular</Text>.</Text>
          <Text style={styles.bulletPoint}>• Shortest recent cycle: <Text style={styles.bold}>23 days</Text>; longest: <Text style={styles.bold}>34 days</Text> → difference <Text style={styles.bold}>11 days</Text> → <Text style={styles.bold}>irregular</Text>.</Text>
        </View>

        <Text style={styles.subTitle}>How Period evaluates regularity</Text>
        <Text style={styles.body}>
          Period assesses regularity using information from <Text style={styles.bold}>2–4 cycles within the past 365 days</Text>.
        </Text>

        <Text style={styles.sectionTitle}>Common reasons cycles become irregular</Text>
        <Text style={styles.body}>
          Most people experience phases of changing menstrual patterns over their lifetime.
          Even for otherwise healthy people, a missed or irregular period now and then isn't unusual. Possible contributors include:
        </Text>
        
        <View style={styles.listContainer}>
          <Text style={styles.bulletPoint}>• <Text style={styles.bold}>Puberty</Text> (cycles are often irregular in the first 1–2 years)</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.bold}>Perimenopause</Text> (menopausal transition)</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.bold}>Pregnancy loss</Text> or <Text style={styles.bold}>abortion</Text></Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.bold}>Hormonal contraception</Text> (e.g., pills, IUDs, emergency contraception)</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.bold}>Significant weight loss or gain</Text></Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.bold}>Excessive exercise</Text></Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.bold}>Stress</Text> or intense emotions</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.bold}>Travel</Text>, especially with disrupted sleep or time-zone changes</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.bold}>Sleep problems</Text> (night shifts or insomnia)</Text>
        </View>

        <Text style={styles.sectionTitle}>When persistent irregularity may signal a condition</Text>
        <Text style={styles.body}>
          Ongoing irregular cycles can be linked to:
        </Text>
        
        <View style={styles.listContainer}>
          <Text style={styles.bulletPoint}>• <Text style={styles.bold}>Polycystic ovary syndrome (PCOS)</Text></Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.bold}>Thyroid dysfunction</Text> (overactive or underactive thyroid)</Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.bold}>Uncontrolled diabetes</Text></Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.bold}>Pelvic inflammatory disease (PID)</Text></Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.bold}>Uterine polyps</Text> or <Text style={styles.bold}>fibroids</Text></Text>
          <Text style={styles.bulletPoint}>• <Text style={styles.bold}>Primary ovarian insufficiency (early menopause)</Text></Text>
        </View>

        <Text style={styles.sectionTitle}>Data entry tips</Text>
        <Text style={styles.body}>
          Incorrect or missing period entries can make your cycles appear irregular in Period—most often due to a <Text style={styles.bold}>missed log</Text>. You can revisit the <Text style={styles.bold}>calendar</Text> at any time to correct past events.
        </Text>

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
  subTitle: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text,
    marginTop: spacing(2),
    marginBottom: spacing(1),
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
  bottomSpacing: {
    height: spacing(4),
  },
});
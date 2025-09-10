import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii, spacing, typography } from '../theme/tokens';

export default function PrivacyPolicyScreen() {
  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, Platform.OS === 'android' && { paddingTop: StatusBar.currentHeight }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Privacy Policy</Text>

        <Text style={styles.sectionTitle}>Table of Contents</Text>
        <Text style={styles.bulletPoint}>• Personal Data We Collect From You</Text>
        <Text style={styles.bulletPoint}>• How We Use Your Personal Data</Text>
        <Text style={styles.bulletPoint}>• Your Privacy Rights</Text>
        <Text style={styles.bulletPoint}>• Third Parties That Process Your Personal Data</Text>
        <Text style={styles.bulletPoint}>• Retention of Your Personal Data</Text>
        <Text style={styles.bulletPoint}>• Security of Your Personal Data</Text>
        <Text style={styles.bulletPoint}>• Children's Privacy</Text>
        <Text style={styles.bulletPoint}>• Communications With You</Text>
        <Text style={styles.bulletPoint}>• Storage and Cross-Border Transfers of Your Personal Data</Text>
        <Text style={styles.bulletPoint}>• United States</Text>
        <Text style={styles.bulletPoint}>• Contact Us</Text>

        <Text style={styles.body}>
          Click here to view the historical versions of this Privacy Policy.
          This policy explains how we handle your personal data. Below is a short overview of key points. The overview does not replace the full policy—please read this policy in full together with our Terms of Use.
        </Text>

        <Text style={styles.highlightTitle}>Protecting your data: Period's commitment to privacy and security</Text>

        <Text style={styles.subTitle}>Data that helps us serve you</Text>
        <Text style={styles.body}>
          When you use Period, we collect your personal data to improve your experience and the services you receive. This allows us to make predictions safer and more accurate and to provide relevant in-app content and product offers.
        </Text>

        <Text style={styles.subTitle}>You can help the Period community grow</Text>
        <Text style={styles.body}>
          With your consent, we may use technical information from your device and other information (e.g., your device's unique technical identifier, age group, subscription status, email, and app launch data) to contact you for promotional purposes.
        </Text>

        <Text style={styles.subTitle}>You are in control and can contact us</Text>
        <Text style={styles.body}>
          You may contact us to access, modify, correct, delete, and update your personal data. If we rely on your consent to process your personal data, you may withdraw that consent. If you have any questions about this Privacy Policy, please let us know.
        </Text>

        <Text style={styles.subTitle}>We limit children's access to the app</Text>
        <Text style={styles.body}>
          You must be at least 13 years old to use the app (residents of the EEA, the UK, and Canada must be at least 16).
        </Text>

        <Text style={styles.sectionTitle}>Introduction</Text>
        <Text style={styles.body}>
          This Privacy Policy explains how Period Health UK Limited and its affiliated entities ("Period," "we," "us") comply with the General Data Protection Regulation ("GDPR"), the UK GDPR, and any other applicable data-protection laws. It explains how Period collects, stores, uses, transfers, and shares personal data of users ("you") in connection with your use of the Period mobile application, the Period Period & Ovulation Tracker app (the "App"), the Period.health website and all related subdomains, products, and services (the "Website") (collectively, the "Services").
        </Text>

        <Text style={styles.body}>
          Period Health UK Limited, registered in the United Kingdom, is the data controller for our Services.
        </Text>

        <Text style={styles.body}>
          We may change this Privacy Policy from time to time. If we make any material changes, we will notify you by email or within the App. Where permitted by law, your continued use of the Services after the update means you accept the changes. In some cases, you may choose whether to accept the changes. If you do not accept the updated Privacy Policy, please do not use the Services.
        </Text>

        <Text style={styles.sectionTitle}>Personal Data We Collect From You</Text>
        <Text style={styles.body}>
          When you interact with the Services, we collect your personal data. This data may come directly from you or from other sources and third parties.
        </Text>

        <Text style={styles.subTitle}>Personal data you provide directly</Text>
        <Text style={styles.body}>
          <Text style={styles.bold}>General information:</Text> When you register to use the Services, we may collect your name, email address, year and month of birth, place of residence and location information (including time zone and language). From your use of the Services we may infer your gender.
          You may also choose to enter a first name or nickname. This is optional and not required to use the Services.
        </Text>

        <Text style={styles.body}>
          <Text style={styles.bold}>Health:</Text> When using the Services, you may choose to enter personal data such as weight; height; body mass index (BMI); body temperature; specific dates within your menstrual cycle; pregnancy status and detailed pregnancy information (if you select the pregnancy mode); other symptoms and stages related to your menstrual cycle; perimenopause and menopause symptoms; general physical and mental health; symptoms (which may include information related to sexual activity); or other information such as wellbeing, water intake, and sleep duration.
        </Text>

        <Text style={styles.subTitle}>Personal data we collect automatically</Text>
        <Text style={styles.body}>
          When you access or use the Services, we may automatically collect:
        </Text>

        <Text style={styles.body}>
          <Text style={styles.bold}>Device information:</Text> Device model; operating system and version; unique device identifiers; enabled accessibility features (e.g., display, hearing, physical and motor); mobile carrier and network information; device storage information or OS version.
        </Text>

        <Text style={styles.body}>
          <Text style={styles.bold}>Location information:</Text> Approximate (non-precise) location via IP address; time zone; or information about your mobile service provider.
        </Text>

        <Text style={styles.body}>
          <Text style={styles.bold}>Usage data:</Text> Frequency of use; scope and features of the Services you access or use; payment transaction information (excluding full payment card details); and interactions with specific features.
        </Text>

        <Text style={styles.body}>
          We may use cookies and similar technologies to collect this and other information. See our Cookie Policy for details.
        </Text>

        <Text style={styles.subTitle}>Data from other sources</Text>
        <Text style={styles.body}>
          We may receive personal data about you from third parties. For example, we may obtain information from third parties to enhance or supplement your existing information—for customization and for statistical and analytics purposes.
        </Text>

        <Text style={styles.sectionTitle}>How We Use Your Personal Data</Text>
        <Text style={styles.body}>
          Depending on the features of the Services you use, we process your personal data on one or more of the following legal bases (with examples):
        </Text>

        <Text style={styles.body}>
          <Text style={styles.bold}>Your consent:</Text> You may allow us to process your health data so we can provide the Services.
        </Text>

        <Text style={styles.body}>
          <Text style={styles.bold}>Contractual necessity:</Text> We may process your personal data to fulfill our contractual obligations to you, such as managing your Period account and for other administrative purposes.
        </Text>

        <Text style={styles.body}>
          <Text style={styles.bold}>Legitimate interests:</Text> We may process your personal data to better operate and manage the Services. For example:
        </Text>

        <Text style={styles.bulletPoint}>• Identify and fix bugs;</Text>
        <Text style={styles.bulletPoint}>• Determine genuine user (not bot) interactions with the Services;</Text>
        <Text style={styles.bulletPoint}>• Monitor the App and analyze performance and reliability;</Text>
        <Text style={styles.bulletPoint}>• Notify you about subscriptions;</Text>
        <Text style={styles.bulletPoint}>• Perform vulnerability scans to keep the Services secure; and</Text>
        <Text style={styles.bulletPoint}>• Review overall App usage trends.</Text>

        <Text style={styles.body}>
          Before relying on this legal basis, we assess our legitimate interests and balance them against your rights to ensure our interests do not override yours.
        </Text>

        <Text style={styles.body}>
          <Text style={styles.bold}>Legal obligations:</Text> We may be required to process some of your personal data to comply with applicable laws and regulations.
        </Text>

        <Text style={styles.sectionTitle}>Your Privacy Rights</Text>
        <Text style={styles.body}>
          Regardless of your country, state, or region, we are committed to providing you with GDPR-aligned rights regarding your personal data.
        </Text>

        <Text style={styles.subTitle}>Who can make a request?</Text>
        <Text style={styles.body}>
          Only you—or someone legally authorized to act on your behalf—may submit a verifiable request about your personal data. We reserve the right to take reasonable steps to verify authorization.
        </Text>

        <Text style={styles.body}>
          <Text style={styles.bold}>Rectification:</Text> If you believe your personal data is inaccurate, you may contact us to request correction.
        </Text>

        <Text style={styles.body}>
          <Text style={styles.bold}>Restriction of processing:</Text> You may request restriction of processing in certain circumstances (e.g., while we verify the accuracy of your personal data that you have challenged).
        </Text>

        <Text style={styles.body}>
          <Text style={styles.bold}>Access:</Text> You may request access to your personal data.
        </Text>

        <Text style={styles.body}>
          <Text style={styles.bold}>Data portability:</Text> You may request your personal data in a portable format so you can reuse it for your own purposes or with other services—that is, to securely migrate, copy, or transfer your data from Period.
        </Text>

        <Text style={styles.body}>
          <Text style={styles.bold}>Erasure:</Text> You may ask us to delete your personal data at any time. Note that deleting certain personal data may affect features that rely on historical data.
        </Text>

        <Text style={styles.body}>
          <Text style={styles.bold}>Right to object:</Text> You may object to our processing of your personal data, for example where we process it for direct marketing.
        </Text>

        <Text style={styles.subTitle}>How to exercise your rights</Text>
        <Text style={styles.body}>
          Email us at support@Period.health to exercise your privacy rights.
          To request deletion of your account, you can also go to Settings in the App.
        </Text>

        <Text style={styles.body}>
          We will process your request within one month of receipt. In some cases (e.g., completely removing your personal data from our backups) we may need up to 90 days. If we need more time, we will inform you and explain why.
        </Text>

        <Text style={styles.sectionTitle}>Security of Your Personal Data</Text>
        <Text style={styles.body}>
          Taking into account the nature of the personal data we process and the risks associated with special-category data, we implement technical and organizational measures to protect personal data against loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction. These measures include:
        </Text>

        <Text style={styles.bulletPoint}>• Encryption of personal data in transit and at rest;</Text>
        <Text style={styles.bulletPoint}>• System vulnerability scanning and penetration testing;</Text>
        <Text style={styles.bulletPoint}>• Data integrity protections;</Text>
        <Text style={styles.bulletPoint}>• Organizational and legal measures;</Text>
        <Text style={styles.bulletPoint}>• Regular Data Protection Impact Assessments.</Text>

        <Text style={styles.body}>
          Please protect your password. Do not share it or allow others to use your device. You may add a passcode or enable Face ID to access the App for extra security.
        </Text>

        <Text style={styles.sectionTitle}>Children's Privacy</Text>
        <Text style={styles.body}>
          <Text style={styles.bold}>General age limits:</Text> The Services are not intended for children, and we do not knowingly collect personal information from children under 13 in connection with providing the Services. If you become aware of a child under 13 using the Services, email support@Period.health and we will take steps to delete their information and/or account.
        </Text>

        <Text style={styles.body}>
          <Text style={styles.bold}>EEA and UK age limits:</Text> As required by law, residents of the EEA and the UK under 16 are not permitted to use the Services. If you become aware of a child under 16 using the Services, email support@Period.health and we will delete their information and/or account.
        </Text>

        <Text style={styles.body}>
          Some features of the App are available only to users 18+.
        </Text>

        <Text style={styles.sectionTitle}>Communications With You</Text>
        <Text style={styles.body}>
          From time to time, we may contact you by email or other means (such as pop-ups or push notifications) about Services, offers, promotions, rewards, and events, and provide news and information we believe may interest you. Such communications may be based on the Services and App features you choose to use (e.g., selected mode).
        </Text>

        <Text style={styles.subTitle}>Opt-out options:</Text>
        <Text style={styles.body}>
          You may always opt out of marketing emails by clicking the Unsubscribe link in the email. You will continue to receive service-related emails necessary for your use of the Services. You can also disable push notifications in your device settings. Where required, we may ask certain users for additional consent to receive such communications.
        </Text>

        <Text style={styles.sectionTitle}>Contact Us</Text>
        <Text style={styles.body}>
          <Text style={styles.bold}>General information</Text>
          {'\n'}If you have any questions or concerns about your privacy, please contact us or our Data Protection Officer:
        </Text>

        <Text style={styles.body}>
          • Email: support@Period.health or dpo@Period.health
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
  highlightTitle: {
    ...typography.h3,
    color: colors.primary,
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
  bulletPoint: {
    ...typography.body,
    color: colors.text,
    lineHeight: 22,
    marginBottom: spacing(0.5),
    marginLeft: spacing(1),
  },
  bottomSpacing: {
    height: spacing(4),
  },
});
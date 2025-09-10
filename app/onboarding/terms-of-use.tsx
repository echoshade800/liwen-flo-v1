import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii, spacing, typography } from '../theme/tokens';

export default function TermsOfUseScreen() {
  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, Platform.OS === 'android' && { paddingTop: StatusBar.currentHeight }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms of Use</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Terms of Use</Text>
        
        <Text style={styles.effectiveDate}>Effective: September 12, 2025</Text>

        <Text style={styles.body}>
          We know Terms can be dull, and you may be tempted to skip them—but it's important to understand what you can expect from Period and what we expect from you when you use our Services.
        </Text>

        <Text style={styles.body}>
          Before you start using the Services, please read these Terms. They govern our interactions with you. If you have questions, see <Text style={styles.bold}>Section 22 (Questions, Complaints, and Comments)</Text> for how to contact us.
        </Text>

        <Text style={styles.body}>
          These Terms help define your relationship with Period when you use our Services. For example, they cover:
        </Text>

        <Text style={styles.bulletPoint}>• What we expect from you (rules for using the Services)</Text>
        <Text style={styles.bulletPoint}>• Subscription and billing (cancellations, refunds, fees, and other charges)</Text>
        <Text style={styles.bulletPoint}>• What you can expect from us (how we provide and improve the Services)</Text>
        <Text style={styles.bulletPoint}>• How to address questions or disagreements</Text>

        <Text style={styles.body}>
          You must accept these Terms to use the Services.
        </Text>

        <Text style={styles.sectionTitle}>Table of Contents</Text>
        <Text style={styles.bulletPoint}>1. Introduction</Text>
        <Text style={styles.bulletPoint}>2. Who We Are</Text>
        <Text style={styles.bulletPoint}>3. Where These Terms Apply</Text>
        <Text style={styles.bulletPoint}>4. Who May Use Period</Text>
        <Text style={styles.bulletPoint}>5. No Medical Advice, Diagnosis, or Treatment</Text>
        <Text style={styles.bulletPoint}>6. Registration and Eligibility</Text>
        <Text style={styles.bulletPoint}>7. Your Use of the App</Text>
        <Text style={styles.bulletPoint}>8. Limited License to the App</Text>
        <Text style={styles.bulletPoint}>9. User Content License</Text>
        <Text style={styles.bulletPoint}>10. Use at Your Own Risk</Text>
        <Text style={styles.bulletPoint}>11. Notice Regarding Minors</Text>
        <Text style={styles.bulletPoint}>12. Subscriptions and Billing</Text>
        <Text style={styles.bulletPoint}>13. Disclaimer of Warranties</Text>
        <Text style={styles.bulletPoint}>14. Limitation of Liability</Text>
        <Text style={styles.bulletPoint}>15. Use on Mobile Devices</Text>
        <Text style={styles.bulletPoint}>16. Third-Party Services and Links</Text>
        <Text style={styles.bulletPoint}>17. Feedback</Text>
        <Text style={styles.bulletPoint}>18. Enforcement</Text>
        <Text style={styles.bulletPoint}>19. Maintenance and Updates</Text>
        <Text style={styles.bulletPoint}>20. Indemnification</Text>
        <Text style={styles.bulletPoint}>21. Other Provisions</Text>
        <Text style={styles.bulletPoint}>22. Questions, Complaints, and Comments</Text>

        <Text style={styles.sectionTitle}>1. Introduction</Text>
        <Text style={styles.body}>
          1.1. Please read these Terms of Use (the <Text style={styles.bold}>"Agreement"</Text> or <Text style={styles.bold}>"Terms"</Text>) carefully. This Agreement is a legally binding contract between you and <Text style={styles.bold}>Period Health UK Limited</Text> (registered office: 27 Old Gloucester Street, London, England, WC1N 3AX). Your access to and use of Period's products and Services is expressly conditioned on your acceptance of this Agreement. If you do not agree, you cannot access Period or its products and Services.
        </Text>

        <Text style={styles.body}>
          1.2. <Text style={styles.bold}>Binding arbitration and class action waiver.</Text> Please carefully read the binding arbitration and class action waiver clause below; it affects how disputes between you and Period are resolved and describes your opt-out right.
        </Text>

        <Text style={styles.noteBox}>
          Note: Depending on where you live, you may have non-waivable rights under applicable local laws. Nothing in this Agreement limits those rights.
        </Text>

        <Text style={styles.body}>
          1.3. By creating an account or accessing/using the App, you acknowledge and agree to these Terms. If you do not agree, you may be unable to access or use the App.
        </Text>

        <Text style={styles.body}>
          1.4. Our <Text style={styles.bold}>Privacy Policy</Text> at https://Period.health/zh/privacy-policy also applies and forms part of your contract with us.
        </Text>

        <Text style={styles.body}>
          1.5. By accepting this Agreement, you confirm that: (a) you have read it and agree to be bound by it and any incorporated terms; (b) you have reviewed and agree to the Privacy Policy; and (c) you will not use the Services or content for purposes other than those permitted by these Terms.
        </Text>

        <Text style={styles.sectionTitle}>2. Who We Are</Text>
        <Text style={styles.body}>
          2.1. We are <Text style={styles.bold}>Period Health UK Limited</Text>, a company registered in the United Kingdom (Company No. 12898410). In these Terms we refer to ourselves as <Text style={styles.bold}>"Period,"</Text> <Text style={styles.bold}>"we,"</Text> or <Text style={styles.bold}>"us."</Text>
        </Text>

        <Text style={styles.body}>
          2.2. Registered office: 27 Old Gloucester Street, London, England, WC1N 3AX.
        </Text>

        <Text style={styles.sectionTitle}>3. Where These Terms Apply</Text>
        <Text style={styles.body}>
          3.1. These Terms apply to all use of the <Text style={styles.bold}>Period Fem®</Text> mobile application (the <Text style={styles.bold}>"App"</Text>), our websites (Period.health, app.Period.health, etc.), and all related services, features, and content provided by Period.
        </Text>

        <Text style={styles.noteBox}>
          The App may appear under different names depending on your location. A complete list is available here.
        </Text>

        <Text style={styles.sectionTitle}>4. Who May Use Period</Text>
        <Text style={styles.body}>
          4.1. You must be at least <Text style={styles.bold}>13 years old</Text> (or <Text style={styles.bold}>16</Text> for residents of the EEA and the UK) to use the App and access Period's content.
        </Text>

        <Text style={styles.body}>
          4.2.–4.3. We do not knowingly collect personal information from children under 13 (or under 16 in the EEA/UK), and we do not permit such users to access the App.
        </Text>

        <Text style={styles.body}>
          4.4. Certain features may be restricted for users under <Text style={styles.bold}>18</Text>.
        </Text>

        <Text style={styles.body}>
          4.5. If you become aware of a user who does not meet these requirements, contact <Text style={styles.bold}>support@Period.health</Text>. We will take necessary steps to delete or disable the account.
        </Text>

        <Text style={styles.sectionTitle}>5. No Medical Advice, Diagnosis, or Treatment</Text>
        <Text style={styles.body}>
          5.1. Period is <Text style={styles.bold}>not</Text> a licensed healthcare provider. The App is not intended to replace professional medical advice or diagnosis, to treat or manage any disease or medical condition, or to be used for contraception or birth control. Always consult a physician or other qualified healthcare provider before making decisions or taking actions that could affect your health, your family's health, or a fetus. Do not ignore professional medical advice or delay seeking care because of information in the App. If you have questions or concerns about your health, or if your condition changes, consult a healthcare professional. In an emergency, call emergency services or go to the nearest open emergency department immediately.
        </Text>

        <Text style={styles.body}>
          5.2. We are not responsible for any errors, omissions, or inadvertent technical or typographical errors in the materials provided, or for any content that may conflict with ethical or moral standards applicable in your community regarding sex education or related materials.
        </Text>

        <Text style={styles.body}>
          5.3. Some translations in the App or on the website are supported by machine learning and AI. Period makes no express or implied warranties regarding such translations, including accuracy, reliability, fitness for a particular purpose, or non-infringement.
        </Text>

        <Text style={styles.sectionTitle}>6. Registration and Eligibility</Text>
        <Text style={styles.body}>
          6.1. To use the App, you must create or update an account (an <Text style={styles.bold}>"Account"</Text>) and provide certain personal information, such as your name, date of birth, and email address.
        </Text>

        <Text style={styles.body}>
          6.2. All information you provide during account creation must be accurate. If it changes, you must update it promptly.
        </Text>

        <Text style={styles.body}>
          6.3. Period reserves the right, at our sole discretion, to refuse to create any Account or to limit access to certain content within the App for users under 18.
        </Text>

        <Text style={styles.sectionTitle}>7. Your Use of the App</Text>
        <Text style={styles.body}>
          7.1. Content you submit through the App is subject to our Privacy Policy. If you submit questions or responses, you are responsible for such communications, their consequences, and any appearance of such communications in the public domain. Period and its licensors are not responsible for communications appearing in the public domain. If you feel threatened or believe someone is in danger, contact local law enforcement immediately. If you believe you face a medical emergency, call your doctor or emergency services. As a condition of using the App, you agree not to use it for any purpose prohibited by this Agreement. You are responsible for your activities in the App and must comply with all local, state/provincial, national, and international laws and regulations and any applicable codes.
        </Text>

        <Text style={styles.body}>
          7.2. You agree that the following actions constitute material breaches, and you <Text style={styles.bold}>will not</Text>:
        </Text>

        <Text style={styles.subBullet}>7.2.1. Resell, rent, lease, lend, sublicense, assign, or otherwise transfer your rights to the App;</Text>
        <Text style={styles.subBullet}>7.2.2. Modify, reverse engineer, decompile, or disassemble the App;</Text>
        <Text style={styles.subBullet}>7.2.3. Copy, adapt, alter, modify, translate, or create derivative works of the App without our written permission;</Text>
        <Text style={styles.subBullet}>7.2.4. Permit others to use the App, including by sharing over a network, except as allowed by these Terms;</Text>
        <Text style={styles.subBullet}>7.2.5. Circumvent or disable any technical features or measures that protect intellectual property in the App;</Text>
        <Text style={styles.subBullet}>7.2.6. Use the App with any device, program, or service designed to circumvent technical measures controlling access to copyrighted works or rights therein;</Text>
        <Text style={styles.subBullet}>7.2.7. Use or access the App to compile data in a way that is used by or available to a competing product or service;</Text>
        <Text style={styles.subBullet}>7.2.8. Use your Account to advertise, solicit, or transmit commercial messages, including chain letters, spam, or repetitive messages;</Text>
        <Text style={styles.subBullet}>7.2.9. Use your Account for any unlawful activity;</Text>
        <Text style={styles.subBullet}>7.2.10. Upload or transmit communications that infringe or violate any party's rights;</Text>
        <Text style={styles.subBullet}>7.2.11. Upload media containing hate, abuse, offensive images or conduct, obscenity, pornography, or explicit sexual content, or materials that could create civil or criminal liability under applicable law or conflict with these Terms or our Privacy Policy;</Text>
        <Text style={styles.subBullet}>7.2.12. Upload materials containing software viruses or any malicious or technically harmful code intended to disrupt, destroy, or limit any software, website, or App functionality;</Text>
        <Text style={styles.subBullet}>7.2.13. Use Period's predicted fertile window or estimated ovulation day for contraception or to promote conception; or</Text>
        <Text style={styles.subBullet}>7.2.14. Use data, content, or features of the App to diagnose, treat, or relieve any health condition.</Text>

        <Text style={styles.body}>
          Any prohibited use will immediately terminate your license to use the App. Your license is conditioned on your compliance with these Terms. If you violate them, we may revoke your license and your access.
        </Text>

        <Text style={styles.sectionTitle}>8. Limited License to the App</Text>
        <Text style={styles.body}>
          8.1. Subject to these Terms, we grant you a <Text style={styles.bold}>personal</Text>, worldwide, revocable, non-transferable, and non-exclusive license to access and use the App for personal, non-commercial purposes. Without our prior written permission (which we may grant or refuse for any reason), you may not copy, store, modify, distribute, transmit, perform, reproduce, publish, license, transfer, or sell any text, graphics, logos and other source identifiers, designs, icons, images, or other information, software, or code obtained from the App, nor create derivative works. You also agree not to download, display, or use content from the App for commercial purposes in publications, public performances, or websites unrelated to our products or services; in any manner likely to cause consumer confusion; to disparage or discredit us or our licensors; to dilute our or our licensors' goodwill; or in ways that infringe our or our licensors' intellectual property. Do not otherwise misuse content provided by us or third parties on the App.
        </Text>

        <Text style={styles.body}>
          8.2. We reserve all rights in the App not expressly granted to you. If you wish to use our software, names, trade names, trademarks, service marks, logos, domain names, or other brand features, or other content, you must obtain our written permission. Send requests to <Text style={styles.bold}>support@Period.health</Text>.
        </Text>

        <Text style={styles.body}>
          8.3. For clarity, all text, images, photos, audio, video, location data, software, code, and other data or information created and provided by us in connection with the App are owned by us, including user-interface elements, interactive features, graphics, designs, compilations of User Content (as defined below), aggregate ratings, and all other elements and components of the App, <Text style={styles.bold}>excluding</Text> User Content (collectively, <Text style={styles.bold}>"Company Content"</Text>). Except as expressly and unambiguously stated otherwise, we do not grant any implied rights; all rights in the App and Company Content are owned by us.
        </Text>

        <Text style={styles.sectionTitle}>9. User Content License</Text>
        <Text style={styles.body}>
          9.1. The App may allow you to record personal notes, share personal stories, post or upload content, submit content, and record certain information in the App (<Text style={styles.bold}>"User Content"</Text>). You retain ownership of your User Content.
        </Text>

        <Text style={styles.body}>
          By providing User Content in the App, you (a) grant us a <Text style={styles.bold}>non-exclusive, transferable, sublicensable, worldwide, royalty-free license</Text> to use, copy, exploit, modify, publicly display, publicly perform, create derivative works from, incorporate into other works, alter, reproduce, and distribute your User Content <Text style={styles.bold}>as described in the Privacy Policy</Text>, to operate the App and related services and/or for our promotional purposes (e.g., display on our website, in-app, on social media, or on any internet sites or platforms we deem appropriate); and (b) agree to <Text style={styles.bold}>indemnify</Text> Period and its affiliates, directors, officers, and employees from any and all claims and costs (including attorneys' fees) arising from your User Content and/or your failure to comply with these Terms.
        </Text>

        <Text style={styles.body}>
          9.2. We reserve the right to review User Content before submission and to remove any content or media at any time, without notice, at our sole discretion.
        </Text>

        <Text style={styles.sectionTitle}>10. Use at Your Own Risk</Text>
        <Text style={styles.body}>
          10.1. Our goal is to help you more easily access useful health-related information. The App <Text style={styles.bold}>cannot and does not guarantee</Text> improved health or clinical outcomes.
        </Text>

        <Text style={styles.body}>
          10.2. You use the App and any information, predictions, or suggestions at <Text style={styles.bold}>your own risk</Text>. We make no representations or warranties as to the accuracy of data, information, estimates, or predictions provided through the App. The App is not intended to replace medical or scientific equipment or healthcare providers or to serve the same function.
        </Text>

        <Text style={styles.sectionTitle}>11. Notice Regarding Minors</Text>
        <Text style={styles.body}>
          11.1. Information in the App does not incite, induce, or otherwise facilitate any sexual activity or conduct by minors, and is not directed to any specific person. All information is provided for general educational purposes only.
        </Text>

        <Text style={styles.body}>
          11.2. We carefully review materials provided to users aged 13–17 to avoid inappropriate or harmful content. We understand that ethical and moral rules differ by country/region regarding information accessible to minors on sexual topics.
        </Text>

        <Text style={styles.body}>
          11.3. We do not intend to publish explicit sexual content or content deemed harmful to minors under applicable law. We make reasonable efforts to ensure materials in the App are factual and scientifically accurate.
        </Text>

        <Text style={styles.body}>
          Please note that individual ethical views about what may offend or harm minors may differ from legal standards governing content for minors.
        </Text>

        <Text style={styles.sectionTitle}>12. Subscriptions and Billing</Text>
        <Text style={styles.body}>
          12.1. <Text style={styles.bold}>Subscriptions.</Text> We may offer subscriptions allowing access to certain content, products, or Services for a specified period. Subscriptions renew indefinitely. We automatically charge subscription fees at regular intervals until you cancel. Before you purchase, we disclose fees, billing frequency, and how to cancel.
        </Text>

        <Text style={styles.body}>
          12.2. Because we introduce new features, improve existing products, and sometimes deprecate underperforming features, the content, products, or Services included in a subscription may change from time to time. Features and content may vary by country/region, language, app store, version, or device.
        </Text>

        <Text style={styles.body}>
          By accessing Period, you agree your purchases do not depend on any future features or functionality or on any public statements (oral or written) by Period regarding such features or functionality.
        </Text>

        <Text style={styles.body}>
          12.3. You may obtain the App via third-party platforms such as the <Text style={styles.bold}>Apple App Store</Text> and <Text style={styles.bold}>Google Play</Text>. When you purchase a Period subscription, you may enter into a separate contract with the relevant app store provider, whose terms and conditions may apply. Under those terms, you may need to exercise your cancellation or withdrawal rights with that provider.
        </Text>

        <Text style={styles.body}>
          12.4. <Text style={styles.bold}>Billing.</Text> You may purchase subscriptions directly from Period or through third parties, by paying subscription fees and applicable taxes in advance for the disclosed billing period.
        </Text>

        <Text style={styles.body}>
          12.5. <Text style={styles.bold}>Trials.</Text> Some subscriptions include a trial period during which you can use the App free or at a discounted price (a <Text style={styles.bold}>"Trial"</Text>). After the Trial ends, it automatically converts to a recurring paid subscription. To avoid charges, cancel before the Trial ends. Review all applicable terms before signing up.
        </Text>

        <Text style={styles.body}>
          12.6. <Text style={styles.bold}>Changes to fees and taxes.</Text> Period may change subscription offerings, including recurring fees, and will notify you of price changes in advance. Price changes take effect at the start of the next subscription term after the change date. Continued use after the change means you accept the new price. If you do not agree, reject the change by cancelling before it takes effect.
        </Text>

        <Text style={styles.body}>
          If we discover a pricing error, we will contact you. You may confirm your order at the correct price or cancel. If we cannot reach you, your order will be cancelled.
        </Text>

        <Text style={styles.body}>
          Taxes and other charges are based on the applicable tax rate for your monthly fees and may change based on your location. Any tax rate changes apply automatically based on your account information.
        </Text>

        <Text style={styles.body}>
          12.7. <Text style={styles.bold}>Renewals.</Text> Subscriptions purchased from Period or third parties <Text style={styles.bold}>auto-renew</Text> unless you cancel before the end of the then-current term.
        </Text>

        <Text style={styles.body}>
          12.8. <Text style={styles.bold}>Cancellation.</Text> To avoid being charged for the next term, you must cancel your subscription or Trial <Text style={styles.bold}>before</Text> it renews.
        </Text>

        <Text style={styles.bulletPoint}>• If you purchased directly from Period, email <Text style={styles.bold}>help@Period.health</Text> any time to cancel renewal and include the email used to register at app.Period.health.</Text>
        <Text style={styles.bulletPoint}>• If you purchased through a third party, contact them for billing, cancellation, and refund information.</Text>

        <Text style={styles.body}>
          You may also contact our support team at <Text style={styles.bold}>help@Period.health</Text> (or submit a request here) or follow the instructions at the provided link to cancel.
        </Text>

        <Text style={styles.body}>
          12.9. <Text style={styles.bold}>Promotional offers.</Text> From time to time, you may purchase subscriptions via promotional offers. These may be available only to new users and/or not to all users, and only for a limited time. Other restrictions may apply. After the promotional period, subscriptions renew at then-current prices (which may change) plus applicable taxes, unless cancelled.
        </Text>

        <Text style={styles.sectionTitle}>13. Disclaimer of Warranties</Text>
        <Text style={styles.body}>
          13.1. We control and operate the App from different locations and do not represent that the App is appropriate or available in all locations. The App or certain features may be unavailable where you are, or may differ by location.
        </Text>

        <Text style={styles.body}>
          13.2. The App is provided <Text style={styles.bold}>"as is" and "as available."</Text> We expressly disclaim all express or implied representations and warranties, including implied warranties of title, non-infringement, merchantability, and fitness for a particular purpose, and any warranties arising from course of dealing or trade usage, except where required by law. Neither Period nor its officers, directors, employees, agents, affiliates, representatives, suppliers, partners, advertisers, or content providers warrants—and each expressly disclaims—that: (A) the App will be secure or available at any particular time or location; (B) defects or errors will be corrected; (C) content or software in or through the App is free of viruses or harmful components; (D) your use of the App will meet your requirements; or (E) third-party content, text, images, software, graphics, or communications in or through the App are accurate, reliable, or complete. <Text style={styles.bold}>You use the App at your sole risk.</Text> Some jurisdictions do not allow limitations on implied warranties; some or all of the above may not apply to you.
        </Text>

        <Text style={styles.sectionTitle}>14. Limitation of Liability</Text>
        <Text style={styles.body}>
          14.1. In no event will Period or its officers, directors, agents, affiliates, employees, representatives, suppliers, partners, advertisers, or data providers be liable for any <Text style={styles.bold}>indirect, special, incidental, consequential, exemplary, or punitive damages</Text> (including loss of use, profits, or data) arising out of or in connection with your use or misuse of the App, whether in contract, tort (including negligence), equity, or otherwise. In all cases, Period's total liability arising out of or relating to these Terms or your use or inability to use the App will not exceed the amount you paid to Period to use the App, or <Text style={styles.bold}>USD $100</Text> if you paid nothing.
        </Text>

        <Text style={styles.body}>
          Some jurisdictions do not allow exclusions or limitations of liability; the above may not apply to you. Period, its officers, directors, agents, affiliates, employees, representatives, suppliers, partners, advertisers, content providers, or any third parties mentioned in the App are <Text style={styles.bold}>not liable</Text> for any personal injury (including death) resulting from your use or misuse of the App. Nothing in these Terms excludes or limits liability where doing so would be unlawful. If any exclusion or limitation exceeds what is permitted by law, that term applies only to the maximum extent permitted.
        </Text>

        <Text style={styles.sectionTitle}>15. Use on Mobile Devices</Text>
        <Text style={styles.body}>
          15.1. If you use the App on a mobile device, normal carrier rates and fees (e.g., SMS and data) may apply.
        </Text>

        <Text style={styles.sectionTitle}>16. Third-Party Services and Links</Text>
        <Text style={styles.body}>
          16.1. The App may contain links to third-party websites, apps, or other products or services (<Text style={styles.bold}>"Third-Party Services"</Text>). We do not control Third-Party Services and are not responsible for their privacy practices or content. Your use of Third-Party Services is at your own risk. Inclusion of links does not imply our endorsement of materials in or linked by Third-Party Services. We are not responsible for products, services, or information provided by Third-Party Services. You should determine whether accessing a Third-Party Service is appropriate, including protecting your personal information and privacy and complying with relevant agreements.
        </Text>

        <Text style={styles.body}>
          You may not link to our website, App, content, or Services in ways that: (i) are unlawful; (ii) imply any association with us or our approval/endorsement where none exists; (iii) damage or exploit our reputation; or (iv) are improper.
        </Text>

        <Text style={styles.sectionTitle}>17. Feedback</Text>
        <Text style={styles.body}>
          17.1. We welcome feedback on the App. Unless expressly stated otherwise, any communications you send us or post in app stores are treated as public submissions, and you agree we may make them public at our discretion. You grant us a free right to use such feedback and to edit, modify, adapt, or change it as appropriate in any context.
        </Text>

        <Text style={styles.sectionTitle}>18. Enforcement</Text>
        <Text style={styles.body}>
          18.1. We are not obligated to monitor access to or use of the App, but we reserve the right to do so to operate and maintain the App, ensure compliance with these Terms, and meet legal obligations. We may disclose unlawful conduct to law enforcement and cooperate with lawful processes.
        </Text>

        <Text style={styles.body}>
          18.2. If we believe your content or use of the App is objectionable or violates these Terms, we may, at our sole discretion and without notice, remove content or disable access to the App. We may refuse service, close accounts, and change eligibility requirements at any time. We are not responsible for performing—or failing to perform—any such activities for any user or third party.
        </Text>

        <Text style={styles.sectionTitle}>19. Maintenance and Updates</Text>
        <Text style={styles.body}>
          19.1. We may need to modify, expand, upgrade, or improve the App from time to time to ensure proper operation. We may discontinue some or all of the App or disable certain features at any time. You do not acquire any right to continued use of the App by using it.
        </Text>

        <Text style={styles.body}>
          19.2. We may, in our sole discretion, modify or remove the App or any feature at any time without ongoing obligations or liability to you.
        </Text>

        <Text style={styles.body}>
          19.3. We may suspend or terminate online access to Period content at any time, including for deprecation, maintenance, or upgrades, without prior notice or liability. We may stop providing certain content or features. We do not commit to maintaining servers for any content or features that require online servers.
        </Text>

        <Text style={styles.sectionTitle}>20. Indemnification</Text>
        <Text style={styles.body}>
          20.1. You agree to defend, indemnify, and hold harmless Period, its officers, directors, employees, agents, affiliates, representatives, licensors, suppliers, partners, advertisers, and content providers from and against any claims, actions, demands, liabilities, and settlements (including reasonable legal and accounting fees) arising out of or alleged to result from your breach of this Agreement.
        </Text>

        <Text style={styles.sectionTitle}>21. Other Provisions</Text>
        <Text style={styles.body}>
          21.1. We may modify these Terms from time to time if we deem it necessary (e.g., for legal reasons or to reflect changes to the App or website). If we make material changes, we will post the updated Terms online and make reasonable efforts to notify you (e.g., by sending a notice).
        </Text>

        <Text style={styles.body}>
          21.2. The updated Terms become binding <Text style={styles.bold}>30 days</Text> after we post them online. During this period, contact <Text style={styles.bold}>support@Period.health</Text> with any specific questions. If you do not agree to the changes (whether or not you email us), you must stop using the App and our website. We hope you understand that, for Period to function, we need everyone to use the same rules rather than different rules for different people.
        </Text>

        <Text style={styles.body}>
          21.3. If you do not agree to the new Terms, you should stop using the Services. <Text style={styles.bold}>Your continued use</Text> after the updated Terms take effect means you accept them.
        </Text>

        <Text style={styles.body}>
          21.4. <Text style={styles.bold}>Successors and assigns.</Text> These Terms benefit each party and our successors in interest. We may assign our rights and obligations under these Terms to any affiliate or any Period entity.
        </Text>

        <Text style={styles.body}>
          21.5. <Text style={styles.bold}>Severability.</Text> If any provision of these Terms is found unenforceable by an arbitrator, tribunal, or court of competent jurisdiction, that provision will be enforced to the maximum extent permitted to effect the intent of these Terms, and the remaining provisions will remain in full force and effect. A printed version of these Terms is admissible in judicial, administrative, or arbitration proceedings.
        </Text>

        <Text style={styles.body}>
          21.6. <Text style={styles.bold}>No waiver.</Text> Our failure to enforce any term or condition is not a waiver of that term or any other term; our failure to assert a right or provision is not a waiver of that right or provision.
        </Text>

        <Text style={styles.body}>
          21.7. Upon termination of these Terms, all provisions that by their nature should survive termination will survive, including without limitation dispute-resolution provisions, all ownership provisions, warranty disclaimers, and limitations of liability.
        </Text>

        <Text style={styles.sectionTitle}>22. Questions, Complaints, and Comments</Text>
        <Text style={styles.body}>
          22.1. If you have any comments or questions about the App or these Terms, need support, or have any requests, please contact <Text style={styles.bold}>support@Period.health</Text>.
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
    marginBottom: spacing(2),
  },
  effectiveDate: {
    ...typography.body,
    fontWeight: '600',
    color: colors.primary,
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
  bulletPoint: {
    ...typography.body,
    color: colors.text,
    lineHeight: 22,
    marginBottom: spacing(0.5),
    marginLeft: spacing(1),
  },
  subBullet: {
    ...typography.body,
    color: colors.text,
    lineHeight: 22,
    marginBottom: spacing(0.5),
    marginLeft: spacing(2),
  },
  noteBox: {
    ...typography.body,
    color: colors.text,
    backgroundColor: colors.gray100,
    padding: spacing(2),
    borderRadius: radii.medium,
    marginVertical: spacing(1),
    fontStyle: 'italic',
    lineHeight: 22,
  },
  bottomSpacing: {
    height: spacing(4),
  },
});
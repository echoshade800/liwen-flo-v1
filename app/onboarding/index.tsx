import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Platform, StatusBar, Alert } from 'react-native';
import { router } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { colors, radii, spacing, typography } from '../theme/tokens';

// @ts-ignore
import BrokenHealthKit, { HealthKitPermissions } from "react-native-health";
const NativeModules = require("react-native").NativeModules;
const AppleHealthKit = NativeModules.AppleHealthKit as typeof BrokenHealthKit;

// Only set Constants if AppleHealthKit is available
if (AppleHealthKit && BrokenHealthKit.Constants) {
  AppleHealthKit.Constants = BrokenHealthKit.Constants;
}

export default function PermissionsAndTermsScreen() {
  const [isRequestingPermissions, setIsRequestingPermissions] = useState(false);

  // 请求通知权限
  const requestNotificationPermissions = async () => {
    try {
      console.log('开始申请通知权限...');
      const { status } = await Notifications.requestPermissionsAsync();
      
      if (status === 'granted') {
        console.log('通知权限申请成功');
      } else {
        console.log('通知权限被拒绝或未授权:', status);
      }
      
      // 通知权限申请完成后，自动继续申请健康权限
      await requestHealthPermissions();
    } catch (error) {
      console.error('申请通知权限时出错:', error);
      // 即使通知权限申请出错，也继续申请健康权限
      await requestHealthPermissions();
    }
  };

  const requestHealthPermissions = async () => {
    if (Platform.OS !== 'ios' || !AppleHealthKit) {
      // Android 或其他平台直接跳转
      router.push('/onboarding/goal-selection');
      return;
    }

    try {
      setIsRequestingPermissions(true);
      
      // 定义需要的健康数据权限
      const permissions = {
        permissions: {
          read: [
            AppleHealthKit.Constants.Permissions.Steps,
            AppleHealthKit.Constants.Permissions.DistanceWalkingRunning,
            AppleHealthKit.Constants.Permissions.SleepAnalysis,
            AppleHealthKit.Constants.Permissions.HeartRate,
          ],
          write: [
          ]
        }
      };

      // 初始化并请求权限
      AppleHealthKit.initHealthKit(permissions, (error: any) => {
        setIsRequestingPermissions(false);
        
        if (error) {
          console.log('Health permissions denied or error:', error);
          Alert.alert(
            '健康权限',
            '健康数据权限请求失败，您可以稍后在设置中手动开启。',
            [
              {
                text: '继续',
                onPress: () => router.push('/onboarding/goal-selection')
              }
            ]
          );
        } else {
          console.log('Health permissions granted successfully');
          router.push('/onboarding/goal-selection');
        }
      });
    } catch (error) {
      setIsRequestingPermissions(false);
      console.error('Error requesting health permissions:', error);
      Alert.alert(
        '权限请求失败',
        '无法请求健康权限，将继续设置流程。',
        [
          {
            text: '继续',
            onPress: () => router.push('/onboarding/goal-selection')
          }
        ]
      );
    }
  };

  const handleContinue = async () => {
    setIsRequestingPermissions(true);
    
    try {
      // 申请通知权限，健康权限会在通知权限申请完成后自动触发
      await requestNotificationPermissions();
    } catch (error) {
      console.error('权限申请过程中出错:', error);
      // 即使出错也继续到下一步
      router.push('/onboarding/goal-selection');
    } finally {
      setIsRequestingPermissions(false);
    }
  };

  const handlePrivacyPolicy = () => {
    router.push('/onboarding/privacy-policy');
  };

  const handleTermsOfUse = () => {
    router.push('/onboarding/terms-of-use');
  };
  return (
    <SafeAreaView style={[styles.container, Platform.OS === 'android' && { paddingTop: StatusBar.currentHeight }]}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to Period</Text>
        <Text style={styles.subtitle}>Your personal period companion</Text>
        
        <View style={styles.textContainer}>
          <Text style={styles.description}>
            We need some permissions to provide you the best experience:
          </Text>
          
          <View style={styles.permissionItem}>
            <Text style={styles.permissionTitle}>📱 Notifications</Text>
            <Text style={styles.permissionDesc}>Remind you to log periods and important dates</Text>
          </View>
          
          <View style={styles.permissionItem}>
            <Text style={styles.permissionTitle}>🏃‍♀️ Health Data</Text>
            <Text style={styles.permissionDesc}>Sync steps, sleep and other health info (optional)</Text>
          </View>
        </View>

        <Text style={styles.terms}>
          By continuing, you agree to our{' '}
          <Text style={styles.link} onPress={handlePrivacyPolicy}>Privacy Policy</Text> and{' '}
          <Text style={styles.link} onPress={handleTermsOfUse}>Terms of Use</Text>
        </Text>
        
        <TouchableOpacity 
          style={[styles.button, isRequestingPermissions && styles.buttonDisabled]} 
          onPress={handleContinue}
          disabled={isRequestingPermissions}
        >
          <Text style={styles.buttonText}>
            {isRequestingPermissions ? '请求权限中...' : 'Continue'}
          </Text>
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
    justifyContent: 'center',
  },
  title: {
    ...typography.h1,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: spacing(1),
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing(4),
  },
  textContainer: {
    marginBottom: spacing(4),
  },
  description: {
    ...typography.body,
    color: colors.text,
    marginBottom: spacing(3),
    lineHeight: 24,
  },
  permissionItem: {
    marginBottom: spacing(2),
  },
  permissionTitle: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing(0.5),
  },
  permissionDesc: {
    ...typography.small,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  terms: {
    ...typography.small,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing(3),
    lineHeight: 18,
  },
  link: {
    color: colors.primary,
    textDecorationLine: 'underline',
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: radii.card,
    paddingVertical: spacing(2),
    paddingHorizontal: spacing(4),
  },
  buttonDisabled: {
    backgroundColor: colors.gray300,
    opacity: 0.6,
  },
  buttonText: {
    ...typography.body,
    color: colors.white,
    textAlign: 'center',
    fontWeight: '600',
  },
});
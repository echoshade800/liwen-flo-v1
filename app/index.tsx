import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { useCycleStore } from './store/useCycleStore';
import StorageUtils from './lib/StorageUtils';

export default function Index() {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [hasUser, setHasUser] = useState(false);
  const profile = useCycleStore(state => state.profile);
  const initializeUser = useCycleStore(state => state.initializeUser);
  
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // 获取本地存储的用户数据
      const { userData, accessKey } = await StorageUtils.getUserDataAndAccessKey();
      console.log('checkAuthStatus userData', userData);
      // 检查是否存在有效的用户
      const hasValidUser = !!(userData && userData.uid);
      setHasUser(hasValidUser);
      console.log('checkAuthStatus hasValidUser', hasValidUser);
      // 如果存在有效的用户，初始化用户数据
      if (hasValidUser) {
        console.log('checkAuthStatus initializeUser');
        await initializeUser();
      }
    } catch (error) {
      console.error('Failed to check auth status:', error);
      setHasUser(false);
    } finally {
      setIsCheckingAuth(false);
    }
  };

  if (isCheckingAuth) {
    return null; // Show loading or splash screen
  }

  // If no user is logged in, show auth screen
  if (!hasUser) {
    return <Redirect href="/auth/login" />;
  }

  // 检查用户是否已经完成onboarding或者已经填写了调查问卷
  // 如果有questionnaireAnswers，说明已经填写了调查问卷，直接进入首页
  const shouldSkipOnboarding = 
    profile.hasCompletedOnboarding || 
    (profile.questionnaireAnswers && Object.keys(profile.questionnaireAnswers).length > 0);
  
  if (shouldSkipOnboarding) {
    return <Redirect href="/(tabs)" />;
  }
  
  return <Redirect href="/onboarding" />;
}
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFrameworkReady } from '../hooks/useFrameworkReady';
import { useCycleStore } from './store/useCycleStore';

export default function RootLayout() {
  useFrameworkReady();
  
  // Initialize store on app start
  useEffect(() => {
    useCycleStore.getState().initializeUser();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="auth" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="info" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </GestureHandlerRootView>
  );
}
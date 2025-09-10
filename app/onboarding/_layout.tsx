import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="privacy-policy" />
      <Stack.Screen name="terms-of-use" />
      <Stack.Screen name="birth-year" />
      <Stack.Screen name="questions" />
      <Stack.Screen name="done" />
    </Stack>
  );
}
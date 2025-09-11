import { Stack } from 'expo-router';

export default function InfoLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="cycle-length" />
      <Stack.Screen name="cycle-variation" />
      <Stack.Screen name="cycle-variation" />
    </Stack>
  );
}
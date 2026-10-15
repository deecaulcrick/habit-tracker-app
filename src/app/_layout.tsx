import { Nunito_600SemiBold, Nunito_800ExtraBold, Nunito_900Black, useFonts } from '@expo-google-fonts/nunito';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useSyncExternalStore } from 'react';

import { Celebrate } from '@/components/Celebrate';
import { Colors } from '@/constants/theme';
import { useStore } from '@/store/useStore';

SplashScreen.preventAutoHideAsync();

function useHydrated() {
  return useSyncExternalStore(
    (cb) => useStore.persist.onFinishHydration(cb),
    () => useStore.persist.hasHydrated(),
    () => false
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({ Nunito_600SemiBold, Nunito_800ExtraBold, Nunito_900Black });
  const hydrated = useHydrated();
  const onboarded = useStore((s) => !!s.profile);
  const ready = (fontsLoaded || !!fontError) && hydrated;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  const sheet = { presentation: 'modal' as const };

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Colors.bg } }}>
        <Stack.Protected guard={onboarded}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="add-food" options={sheet} />
          <Stack.Screen name="add-workout" options={sheet} />
          <Stack.Screen name="habit-editor" options={sheet} />
          <Stack.Screen name="goal-editor" options={sheet} />
          <Stack.Screen name="log-weight" options={sheet} />
          <Stack.Screen name="edit-profile" options={sheet} />
          <Stack.Screen name="meal-ideas" />
          <Stack.Screen name="meal/[id]" options={sheet} />
        </Stack.Protected>
        <Stack.Protected guard={!onboarded}>
          <Stack.Screen name="onboarding" />
        </Stack.Protected>
      </Stack>
      <Celebrate />
    </>
  );
}

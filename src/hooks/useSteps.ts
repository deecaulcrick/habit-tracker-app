import { Pedometer } from 'expo-sensors';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

import { todayKey } from '@/lib/date';
import { useStore } from '@/store/useStore';

export type StepSource = 'sensor' | 'manual';

/**
 * Keeps today's pedometer count in the store.
 * - iOS: reads the day's total from Core Motion, then follows live updates.
 * - Android: no historical query is available, so we count live steps since
 *   the app opened and add them to what we cached earlier today.
 * - Web / no sensor: manual entry only.
 */
export function useStepSync() {
  const [source, setSource] = useState<StepSource>('manual');
  const setSensorSteps = useStore((s) => s.setSensorSteps);

  useEffect(() => {
    if (Platform.OS === 'web') return;
    let sub: { remove: () => void } | undefined;
    let cancelled = false;

    (async () => {
      try {
        const available = await Pedometer.isAvailableAsync();
        if (!available || cancelled) return;
        const perm = await Pedometer.requestPermissionsAsync();
        if (!perm.granted || cancelled) return;
        setSource('sensor');

        if (Platform.OS === 'ios') {
          const start = new Date();
          start.setHours(0, 0, 0, 0);
          const refresh = async () => {
            const { steps } = await Pedometer.getStepCountAsync(start, new Date());
            setSensorSteps(todayKey(), steps);
          };
          await refresh();
          sub = Pedometer.watchStepCount(() => {
            refresh().catch(() => {});
          });
        } else {
          const day = todayKey();
          const base = useStore.getState().sensorSteps[day] ?? 0;
          sub = Pedometer.watchStepCount(({ steps }) => setSensorSteps(day, base + steps));
        }
      } catch {
        setSource('manual');
      }
    })();

    return () => {
      cancelled = true;
      sub?.remove();
    };
  }, [setSensorSteps]);

  return source;
}

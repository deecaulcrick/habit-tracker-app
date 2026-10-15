import { Pressable, StyleSheet, View } from 'react-native';

import { Colors, Radius } from '@/constants/theme';
import { addDays, fromKey, todayKey, weekdayShort } from '@/lib/date';
import { dayCompletion, useStore } from '@/store/useStore';
import { useUi } from '@/store/useUi';

import { Ring, Txt, haptic } from './ui';

/** Week-at-a-glance date picker; each day shows a mini ring of habit progress. */
export function DayStrip() {
  const { date, setDate } = useUi();
  const habits = useStore((s) => s.habits);
  const logs = useStore((s) => s.habitLogs);
  const today = todayKey();
  const days = Array.from({ length: 7 }, (_, i) => addDays(today, i - 6));

  return (
    <View style={styles.row}>
      {days.map((d) => {
        const selected = d === date;
        const c = dayCompletion(habits, logs, d) ?? 0;
        return (
          <Pressable
            key={d}
            onPress={() => {
              haptic();
              setDate(d);
            }}
            style={[styles.day, selected && styles.selected]}>
            <Txt
              variant="caption"
              color={selected ? '#fff' : Colors.inkSoft}
              style={{ fontFamily: 'Nunito_800ExtraBold' }}>
              {weekdayShort(d)}
            </Txt>
            <Ring
              size={30}
              stroke={4}
              progress={c}
              color={selected ? Colors.lemon : Colors.grape}
              track={selected ? '#ffffff40' : Colors.divider}>
              <Txt variant="label" color={selected ? '#fff' : Colors.ink} style={{ fontSize: 12 }}>
                {fromKey(d).getDate()}
              </Txt>
            </Ring>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  day: { alignItems: 'center', gap: 4, paddingVertical: 8, paddingHorizontal: 4, borderRadius: Radius.md, width: 44 },
  selected: { backgroundColor: Colors.ink },
});

import { StyleSheet, View } from 'react-native';

import { Colors, Radius, Sticker } from '@/constants/theme';
import { addDays, prettyDate, todayKey } from '@/lib/date';
import { useUi } from '@/store/useUi';

import { IconButton, Txt } from './ui';

/** "‹ Today ›" stepper shared by the Food and Move tabs. */
export function DateNav() {
  const { date, setDate } = useUi();
  const isToday = date === todayKey();
  return (
    <View style={[styles.wrap, Sticker]}>
      <IconButton icon="chevron-left" size={34} onPress={() => setDate(addDays(date, -1))} />
      <Txt variant="heading">{prettyDate(date)}</Txt>
      <View style={{ opacity: isToday ? 0.3 : 1 }} pointerEvents={isToday ? 'none' : 'auto'}>
        <IconButton icon="chevron-right" size={34} onPress={() => setDate(addDays(date, 1))} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderRadius: Radius.pill,
    padding: 6,
  },
});

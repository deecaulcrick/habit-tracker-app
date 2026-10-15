import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors, Sticker, accent, type Accent } from '@/constants/theme';

import { Icon, type IconName } from './Icon';
import { Txt, haptic } from './ui';

const TABS: Record<string, { icon: IconName; label: string; tone: Accent }> = {
  index: { icon: 'home', label: 'Today', tone: 'grape' },
  food: { icon: 'food', label: 'Food', tone: 'tangerine' },
  move: { icon: 'move', label: 'Move', tone: 'mint' },
  fast: { icon: 'fast', label: 'Fast', tone: 'sky' },
  me: { icon: 'me', label: 'Me', tone: 'bubblegum' },
};

/** Floating candy-pill tab bar. */
export function TabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  return (
    <View pointerEvents="box-none" style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      <View style={[styles.bar, Sticker]}>
        {state.routes.map((route, i) => {
          const meta = TABS[route.name];
          if (!meta) return null;
          const focused = state.index === i;
          const tone = accent(meta.tone);
          return (
            <Pressable
              key={route.key}
              accessibilityRole="tab"
              accessibilityState={{ selected: focused }}
              accessibilityLabel={meta.label}
              onPress={() => {
                haptic();
                const e = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
                if (!focused && !e.defaultPrevented) navigation.navigate(route.name);
              }}
              style={[styles.item, focused && { backgroundColor: tone.strong }]}>
              <Icon name={meta.icon} size={22} color={focused ? '#fff' : Colors.ink} />
              {focused ? (
                <Txt variant="label" color="#fff" numberOfLines={1}>
                  {meta.label}
                </Txt>
              ) : null}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 0, right: 0, bottom: 0, alignItems: 'center', paddingHorizontal: 16 },
  bar: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 999,
    padding: 6,
    gap: 2,
    width: '100%',
    maxWidth: 460,
    justifyContent: 'space-between',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 48,
    minWidth: 48,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
});

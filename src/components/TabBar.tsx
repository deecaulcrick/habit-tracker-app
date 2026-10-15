import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors, Shadow, accent, type Accent } from '@/constants/theme';

import { Emo } from './Emo';
import { Txt, haptic } from './ui';

const TABS: Record<string, { emoji: string; label: string; tone: Accent }> = {
  index: { emoji: '🏡', label: 'Today', tone: 'grape' },
  food: { emoji: '🍲', label: 'Food', tone: 'tangerine' },
  move: { emoji: '👟', label: 'Move', tone: 'mint' },
  fast: { emoji: '⏰', label: 'Fast', tone: 'sky' },
  me: { emoji: '🌱', label: 'Me', tone: 'bubblegum' },
};

/** Floating pill tab bar with 3D emoji icons. */
export function TabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  return (
    <View pointerEvents="box-none" style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      <View style={[styles.bar, Shadow]}>
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
              style={[styles.item, focused && { backgroundColor: tone.tint }]}>
              <View style={{ opacity: focused ? 1 : 0.55, transform: [{ scale: focused ? 1.08 : 1 }] }}>
                <Emo e={meta.emoji} size={26} />
              </View>
              {focused ? (
                <Txt variant="label" color={tone.strong} numberOfLines={1}>
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
    padding: 7,
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
    height: 50,
    minWidth: 50,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
});

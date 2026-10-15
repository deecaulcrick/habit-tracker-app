import { useEffect, useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withSpring } from 'react-native-reanimated';
import Svg, { Circle, Path } from 'react-native-svg';

import { Colors, Radius, Sticker, accent } from '@/constants/theme';
import { habitStreak, useStore, type Habit } from '@/store/useStore';

import { Icon } from './Icon';
import { Txt, haptic } from './ui';

/**
 * An "atom": the habit's emoji in a nucleus, with an orbit of dots that
 * fill as you check in. Multi-count habits (e.g. 8 glasses) get 8 dots.
 */
export function Atom({ habit, count, size = 64 }: { habit: Habit; count: number; size?: number }) {
  const { strong, tint } = accent(habit.accent);
  const done = count >= habit.target;
  const n = Math.min(habit.target, 12);
  const r = size / 2 - 5;
  const c = size / 2;
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        {n === 1 ? (
          <Circle
            cx={c}
            cy={c}
            r={r}
            stroke={done ? strong : Colors.divider}
            strokeWidth={4}
            fill="none"
            strokeDasharray={done ? undefined : '4 5'}
          />
        ) : (
          Array.from({ length: n }, (_, i) => {
            const a = (i / n) * Math.PI * 2 - Math.PI / 2;
            const filled = i < Math.round((Math.min(count, habit.target) / habit.target) * n);
            return (
              <Circle
                key={i}
                cx={c + r * Math.cos(a)}
                cy={c + r * Math.sin(a)}
                r={4}
                fill={filled ? strong : Colors.surface}
                stroke={filled ? strong : Colors.inkFaint}
                strokeWidth={1.5}
              />
            );
          })
        )}
      </Svg>
      <View
        style={[styles.nucleus, { width: size * 0.66, height: size * 0.66, backgroundColor: done ? strong : tint }]}>
        {done ? (
          <Svg width={size * 0.3} height={size * 0.3} viewBox="0 0 24 24">
            <Path
              d="m5 12.5 4.5 4.5L19 7.5"
              stroke="#fff"
              strokeWidth={3.5}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        ) : (
          <Text style={{ fontSize: size * 0.3 }}>{habit.emoji}</Text>
        )}
      </View>
    </View>
  );
}

export function HabitTile({ habit, date, onEdit }: { habit: Habit; date: string; onEdit: () => void }) {
  const count = useStore((s) => s.habitLogs[date]?.[habit.id] ?? 0);
  const logs = useStore((s) => s.habitLogs);
  const tap = useStore((s) => s.tapHabit);
  const pop = useSharedValue(1);
  const popStyle = useAnimatedStyle(() => ({ transform: [{ scale: pop.get() }] }));
  const done = count >= habit.target;
  const streak = habitStreak(habit, logs);
  const { strong } = accent(habit.accent);

  const prevDone = useRef(done);
  useEffect(() => {
    if (done && !prevDone.current) {
      haptic('success');
      pop.set(withSequence(withSpring(1.18, { duration: 180 }), withSpring(1, { dampingRatio: 0.4 })));
    }
    prevDone.current = done;
  }, [done, pop]);

  return (
    <Pressable
      onPress={() => {
        haptic();
        tap(habit.id, date);
      }}
      onLongPress={onEdit}
      delayLongPress={350}
      style={({ pressed }) => [
        styles.tile,
        Sticker,
        done && { backgroundColor: accent(habit.accent).tint },
        pressed && { transform: [{ translateY: 2 }] },
      ]}>
      <Animated.View style={popStyle}>
        <Atom habit={habit} count={count} />
      </Animated.View>
      <View style={{ flex: 1, gap: 2 }}>
        <Txt
          variant="heading"
          numberOfLines={1}
          style={done && { textDecorationLine: 'line-through', textDecorationColor: strong }}>
          {habit.name}
        </Txt>
        <Txt variant="caption" numberOfLines={1}>
          {habit.identity}
        </Txt>
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 2 }}>
          <Txt variant="label" color={strong}>
            {Math.min(count, habit.target)}/{habit.target} {habit.unit}
          </Txt>
          {streak > 0 ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
              <Icon name="flame" size={14} color={Colors.tangerine} />
              <Txt variant="label" color={Colors.tangerine}>
                {streak}
              </Txt>
            </View>
          ) : null}
        </View>
      </View>
      <Pressable onPress={onEdit} hitSlop={10} style={{ padding: 4 }}>
        <Icon name="chevron-right" size={18} color={Colors.inkFaint} />
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: 12,
  },
  nucleus: { borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
});

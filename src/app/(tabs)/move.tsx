import { router } from 'expo-router';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { BarChart } from '@/components/Charts';
import { DateNav } from '@/components/DateNav';
import { Icon } from '@/components/Icon';
import { Mascot } from '@/components/Mascot';
import { Button, Card, Chip, Emoji, Field, Ring, Row, Screen, SectionTitle, Txt } from '@/components/ui';
import { Colors, Radius, Sticker } from '@/constants/theme';
import { stepsKcal } from '@/lib/calc';
import { confirm } from '@/lib/confirm';
import { lastNDays, todayKey, weekdayShort } from '@/lib/date';
import { currentWeight, stepsOn, useStore, type Workout } from '@/store/useStore';
import { useUi } from '@/store/useUi';

export default function MoveScreen() {
  const date = useUi((s) => s.date);
  const s = useStore();
  const p = s.profile!;
  const [custom, setCustom] = useState('');
  const steps = stepsOn(s, date);
  const kg = currentWeight(s.weights, p.startWeightKg);
  const todays = s.workouts.filter((w) => w.date === date).sort((a, b) => b.at - a.at);
  const week = lastNDays(7, date);
  const stepWeek = week.map((d) => ({ label: weekdayShort(d), value: stepsOn(s, d), highlight: d === date }));
  const weekWorkouts = s.workouts.filter((w) => week.includes(w.date));
  const weekMinutes = weekWorkouts.reduce((n, w) => n + w.minutes, 0);
  const sensor = (s.sensorSteps[date] ?? 0) > 0;
  const pct = steps / p.stepGoal;

  const addCustom = () => {
    const n = parseInt(custom, 10);
    if (n > 0) s.addManualSteps(date, n);
    setCustom('');
  };

  return (
    <Screen tabs>
      <Txt variant="title">Move</Txt>
      <DateNav />

      <Card tone="mint" style={{ gap: 14 }}>
        <Row gap={16}>
          <Ring size={130} stroke={16} progress={pct} color={Colors.mint} track="#fff">
            <Icon name="shoe" size={26} />
            <Txt variant="number">{steps.toLocaleString()}</Txt>
            <Txt variant="caption" color={Colors.ink}>
              steps
            </Txt>
          </Ring>
          <View style={{ flex: 1, gap: 6 }}>
            <Txt variant="heading">
              {pct >= 1 ? 'Goal crushed! 🎉' : `${Math.max(0, p.stepGoal - steps).toLocaleString()} to go`}
            </Txt>
            <Txt variant="caption" color={Colors.ink}>
              ≈ {stepsKcal(steps, kg)} kcal · {(steps * 0.00075).toFixed(1)} km
            </Txt>
            <Txt variant="caption" color={Colors.ink}>
              {sensor
                ? '📱 Synced from your phone'
                : Platform.OS === 'web'
                  ? '✍️ Add steps manually'
                  : '✍️ Manual (no sensor access)'}
            </Txt>
          </View>
          {pct >= 1 ? <Mascot size={56} mood="proud" color={p.mascotColor} bounce={false} style={styles.peek} /> : null}
        </Row>
        <Row style={{ flexWrap: 'wrap' }}>
          {[500, 1000, 2500].map((n) => (
            <Chip key={n} label={`+${n.toLocaleString()}`} onPress={() => s.addManualSteps(date, n)} tone="mint" />
          ))}
        </Row>
        <Row>
          <View style={{ flex: 1 }}>
            <Field
              value={custom}
              onChangeText={setCustom}
              placeholder="Add custom steps"
              keyboardType="number-pad"
              onSubmitEditing={addCustom}
              returnKeyType="done"
            />
          </View>
          <Button title="Add" small onPress={addCustom} tone="ink" style={{ height: 52 }} />
        </Row>
      </Card>

      <Row gap={12}>
        <LogTile
          emoji="🏃"
          title="Cardio"
          sub="Run, walk, cycle…"
          bg={Colors.skyTint}
          onPress={() => router.push({ pathname: '/add-workout', params: { kind: 'cardio' } })}
        />
        <LogTile
          emoji="🏋️"
          title="Strength"
          sub="Sets, reps, weight"
          bg={Colors.bubblegumTint}
          onPress={() => router.push({ pathname: '/add-workout', params: { kind: 'strength' } })}
        />
      </Row>

      <SectionTitle title={date === todayKey() ? "Today's workouts" : 'Workouts'} />
      {todays.length ? (
        todays.map((w) => (
          <WorkoutCard
            key={w.id}
            w={w}
            onDelete={() => confirm('Delete workout?', w.name, () => s.removeWorkout(w.id))}
          />
        ))
      ) : (
        <Card flat style={{ alignItems: 'center', gap: 6 }}>
          <Text style={{ fontSize: 30 }}>🛋️</Text>
          <Txt variant="label">No workouts logged</Txt>
          <Txt variant="caption">Even a 10-minute walk counts!</Txt>
        </Card>
      )}

      <SectionTitle title="This week" />
      <Row gap={12}>
        <Card tone="sky" style={{ flex: 1, gap: 2 }}>
          <Txt variant="number">{weekWorkouts.length}</Txt>
          <Txt variant="caption" color={Colors.ink}>
            workouts
          </Txt>
        </Card>
        <Card tone="lemon" style={{ flex: 1, gap: 2 }}>
          <Txt variant="number">{weekMinutes}</Txt>
          <Txt variant="caption" color={Colors.ink}>
            active min
          </Txt>
        </Card>
        <Card tone="tomato" style={{ flex: 1, gap: 2 }}>
          <Txt variant="number">{weekWorkouts.reduce((n, w) => n + w.kcal, 0)}</Txt>
          <Txt variant="caption" color={Colors.ink}>
            kcal
          </Txt>
        </Card>
      </Row>
      <Card style={{ gap: 8 }}>
        <Txt variant="label">Steps</Txt>
        <BarChart data={stepWeek} goal={p.stepGoal} color={Colors.mint} overColor={Colors.mint} />
      </Card>
    </Screen>
  );
}

function LogTile({
  emoji,
  title,
  sub,
  bg,
  onPress,
}: {
  emoji: string;
  title: string;
  sub: string;
  bg: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.tile,
        Sticker,
        { backgroundColor: bg },
        pressed && { transform: [{ translateY: 2 }] },
      ]}>
      <Text style={{ fontSize: 30 }}>{emoji}</Text>
      <Txt variant="heading">{title}</Txt>
      <Txt variant="caption">{sub}</Txt>
      <View style={styles.plus}>
        <Icon name="plus" size={16} color="#fff" />
      </View>
    </Pressable>
  );
}

function WorkoutCard({ w, onDelete }: { w: Workout; onDelete: () => void }) {
  const best = w.sets?.length ? Math.max(...w.sets.map((x) => x.kg)) : 0;
  return (
    <Card style={{ gap: 8 }} onLongPress={onDelete}>
      <Row>
        <Emoji bg={w.kind === 'cardio' ? Colors.skyTint : Colors.bubblegumTint}>{w.emoji}</Emoji>
        <View style={{ flex: 1 }}>
          <Txt variant="heading">{w.name}</Txt>
          <Txt variant="caption">
            {w.kind === 'cardio'
              ? `${w.minutes} min${w.distanceKm ? ` · ${w.distanceKm} km` : ''}`
              : `${w.sets?.length ?? 0} sets · ${w.sets?.reduce((n, x) => n + x.reps, 0) ?? 0} reps${best ? ` · top ${best} kg` : ''}`}
          </Txt>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Txt variant="label" color={Colors.tomato}>
            🔥 {w.kcal}
          </Txt>
          <Pressable onPress={onDelete} hitSlop={8}>
            <Icon name="trash" size={16} color={Colors.inkFaint} />
          </Pressable>
        </View>
      </Row>
      {w.kind === 'strength' && w.sets?.length ? (
        <Row style={{ flexWrap: 'wrap' }} gap={6}>
          {w.sets.map((x, i) => (
            <View key={i} style={styles.setPill}>
              <Txt variant="caption" color={Colors.ink}>
                {x.reps} × {x.kg ? `${x.kg} kg` : 'BW'}
              </Txt>
            </View>
          ))}
        </Row>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  tile: { flex: 1, borderRadius: Radius.lg, padding: 14, gap: 2 },
  plus: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  setPill: { backgroundColor: Colors.bubblegumTint, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  peek: { position: 'absolute', right: -6, top: -30 },
});

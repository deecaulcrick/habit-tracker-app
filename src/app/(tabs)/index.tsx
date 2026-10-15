import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { DayStrip } from '@/components/DayStrip';
import { HabitTile } from '@/components/HabitTile';
import { Icon } from '@/components/Icon';
import { Mascot } from '@/components/Mascot';
import { Bar, Bubble, Button, Card, Ring, Row, Screen, SectionTitle, Txt } from '@/components/ui';
import { Colors, Radius, Sticker, accent } from '@/constants/theme';
import { useNow } from '@/hooks/useNow';
import { fmtWeight, levelFromXp } from '@/lib/calc';
import { greeting, prettyDate, todayKey } from '@/lib/date';
import { mascotSays } from '@/lib/mascot';
import {
  burnedOn,
  consistency,
  currentWeight,
  dayCompletion,
  dayTotals,
  habitScheduledOn,
  perfectStreak,
  stepsOn,
  useStore,
} from '@/store/useStore';
import { useUi } from '@/store/useUi';

export default function Today() {
  const date = useUi((s) => s.date);
  const now = useNow(true, 30_000);
  const s = useStore();
  const p = s.profile!;
  const totals = dayTotals(s.foods, date);
  const burned = burnedOn(s.workouts, date);
  const steps = stepsOn(s, date);
  const remaining = p.calorieTarget - totals.kcal + burned;
  const habitsToday = s.habits.filter((h) => habitScheduledOn(h, date));
  const completion = dayCompletion(s.habits, s.habitLogs, date);
  const streak = perfectStreak(s.habits, s.habitLogs);
  const lvl = levelFromXp(s.xp);
  const weight = currentWeight(s.weights, p.startWeightKg);
  const lost = p.startWeightKg - weight;
  const toGo = Math.max(0, weight - p.goalWeightKg);
  const weightPct = (p.startWeightKg - weight) / Math.max(0.1, p.startWeightKg - p.goalWeightKg);
  const isToday = date === todayKey();

  const say = mascotSays({
    name: p.name,
    hour: new Date(now).getHours(),
    eaten: totals.kcal,
    target: p.calorieTarget,
    habitPct: completion,
    fasting: !!s.activeFast,
    steps,
    stepGoal: p.stepGoal,
    workedOut: burned > 0,
    isToday,
  });

  return (
    <Screen tabs>
      <Row style={{ justifyContent: 'space-between' }}>
        <View style={{ flex: 1 }}>
          <Txt variant="caption">{isToday ? greeting() : prettyDate(date)}</Txt>
          <Txt variant="title" numberOfLines={1}>
            {isToday ? `Hey ${p.name}!` : prettyDate(date)}
          </Txt>
        </View>
        <Row gap={8}>
          <View style={[styles.pill, { backgroundColor: Colors.tangerineTint }]}>
            <Icon name="flame" size={16} color={Colors.tangerine} />
            <Txt variant="label">{streak}</Txt>
          </View>
          <View style={[styles.pill, { backgroundColor: Colors.grapeTint }]}>
            <Txt variant="label">Lv {lvl.level}</Txt>
            <View style={{ width: 36 }}>
              <Bar progress={lvl.into / lvl.need} color={Colors.grape} height={6} track="#fff" />
            </View>
          </View>
        </Row>
      </Row>

      <Row gap={10}>
        <Mascot size={92} mood={say.mood} color={p.mascotColor} />
        <Bubble style={{ marginLeft: 6 }}>{say.line}</Bubble>
      </Row>

      <DayStrip />

      {/* Calories */}
      <Card tone="grape" onPress={() => router.navigate('/food')} style={{ gap: 16 }}>
        <Row style={{ justifyContent: 'space-between' }}>
          <Stat label="Eaten" value={totals.kcal} emoji="🍽️" />
          <Ring
            size={140}
            stroke={16}
            progress={totals.kcal / (p.calorieTarget + burned)}
            color={remaining < 0 ? Colors.tomato : Colors.grape}
            track="#fff">
            <Txt variant="display" style={{ fontSize: 30 }}>
              {Math.abs(remaining).toLocaleString()}
            </Txt>
            <Txt variant="caption" color={Colors.ink}>
              {remaining < 0 ? 'kcal over' : 'kcal left'}
            </Txt>
          </Ring>
          <Stat label="Burned" value={burned} emoji="🔥" />
        </Row>
        <Row gap={12}>
          <Macro label="Protein" value={totals.protein} goal={p.proteinTarget} color={Colors.tangerine} />
          <Macro label="Carbs" value={totals.carbs} goal={Math.round((p.calorieTarget * 0.4) / 4)} color={Colors.sky} />
          <Macro
            label="Fat"
            value={totals.fat}
            goal={Math.round((p.calorieTarget * 0.3) / 9)}
            color={Colors.bubblegum}
          />
        </Row>
      </Card>

      {/* Quick stats */}
      <View style={styles.grid}>
        <MiniCard tone="mint" title="Steps" onPress={() => router.navigate('/move')}>
          <Row style={{ justifyContent: 'space-between' }}>
            <Txt variant="number">{steps.toLocaleString()}</Txt>
            <Ring size={36} stroke={6} progress={steps / p.stepGoal} color={Colors.mint} track="#fff" />
          </Row>
          <Txt variant="caption">of {p.stepGoal.toLocaleString()}</Txt>
        </MiniCard>
        <MiniCard tone="sky" title="Fasting" onPress={() => router.navigate('/fast')}>
          <Txt variant="number">
            {s.activeFast ? `${((now - s.activeFast.start) / 3_600_000).toFixed(1)}h` : 'Eating'}
          </Txt>
          <Txt variant="caption">{s.activeFast ? `goal ${s.activeFast.targetHours}h` : 'Tap to start a fast'}</Txt>
        </MiniCard>
        <MiniCard tone="lemon" title="Weight" onPress={() => router.push('/log-weight')}>
          <Txt variant="number">{fmtWeight(weight, p.units)}</Txt>
          <Bar progress={weightPct} color={Colors.ink} height={6} track="#fff" />
          <Txt variant="caption">
            {lost > 0 ? `−${fmtWeight(lost, p.units)} · ` : ''}
            {fmtWeight(toGo, p.units)} to go
          </Txt>
        </MiniCard>
        <MiniCard tone="tangerine" title="Workouts" onPress={() => router.navigate('/move')}>
          <Txt variant="number">{s.workouts.filter((w) => w.date === date).length}</Txt>
          <Txt variant="caption">{burned} kcal burned</Txt>
        </MiniCard>
      </View>

      {/* Habits */}
      <SectionTitle
        title={isToday ? "Today's atoms" : 'Atoms'}
        action="+ New habit"
        onAction={() => router.push('/habit-editor')}
      />
      {habitsToday.length ? (
        <View style={{ gap: 12 }}>
          {habitsToday.map((h) => (
            <HabitTile
              key={h.id}
              habit={h}
              date={date}
              onEdit={() => router.push({ pathname: '/habit-editor', params: { id: h.id } })}
            />
          ))}
          <Txt variant="caption" center>
            Tap to check in · long-press to edit
          </Txt>
        </View>
      ) : (
        <Card flat style={{ alignItems: 'center', gap: 8 }}>
          <Text style={{ fontSize: 32 }}>⚛️</Text>
          <Txt variant="heading">No habits scheduled</Txt>
          <Button title="Add a habit" small onPress={() => router.push('/habit-editor')} />
        </Card>
      )}

      {/* Goals */}
      <SectionTitle title="Goals" action="See all" onAction={() => router.navigate('/me')} />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 12, paddingBottom: 6 }}
        style={{ marginHorizontal: -16 }}>
        <View style={{ width: 4 }} />
        {s.goals.map((g) => {
          const linked = s.habits.filter((h) => h.goalId === g.id);
          const pct = g.achievedAt ? 1 : linked.length ? consistency(linked, s.habitLogs) : null;
          return (
            <Card
              key={g.id}
              tone={g.accent}
              style={{ width: 180, gap: 6 }}
              onPress={() => router.push({ pathname: '/goal-editor', params: { id: g.id } })}>
              <Text style={{ fontSize: 28 }}>{g.emoji}</Text>
              <Txt variant="heading" numberOfLines={2}>
                {g.title}
              </Txt>
              {pct !== null ? (
                <>
                  <Bar progress={pct} color={accent(g.accent).strong} track="#fff" />
                  <Txt variant="caption" color={Colors.ink}>
                    {g.achievedAt ? 'Achieved 🏆' : `${Math.round(pct * 100)}% consistent (14d)`}
                  </Txt>
                </>
              ) : (
                <Txt variant="caption">Link habits to track</Txt>
              )}
            </Card>
          );
        })}
        <Card
          flat
          style={{ width: 140, alignItems: 'center', justifyContent: 'center', gap: 6 }}
          onPress={() => router.push('/goal-editor')}>
          <Icon name="plus" size={28} />
          <Txt variant="label">New goal</Txt>
        </Card>
        <View style={{ width: 4 }} />
      </ScrollView>
    </Screen>
  );
}

function Stat({ label, value, emoji }: { label: string; value: number; emoji: string }) {
  return (
    <View style={{ alignItems: 'center', gap: 2, width: 70 }}>
      <Text style={{ fontSize: 22 }}>{emoji}</Text>
      <Txt variant="number">{value.toLocaleString()}</Txt>
      <Txt variant="caption" color={Colors.ink}>
        {label}
      </Txt>
    </View>
  );
}

function Macro({ label, value, goal, color }: { label: string; value: number; goal: number; color: string }) {
  return (
    <View style={{ flex: 1, gap: 4 }}>
      <Txt variant="label">{label}</Txt>
      <Bar progress={value / goal} color={color} track="#fff" />
      <Txt variant="caption" color={Colors.ink}>
        {Math.round(value)}/{goal}g
      </Txt>
    </View>
  );
}

function MiniCard({
  tone,
  title,
  children,
  onPress,
}: {
  tone: 'mint' | 'sky' | 'lemon' | 'tangerine';
  title: string;
  children: React.ReactNode;
  onPress: () => void;
}) {
  return (
    <Card tone={tone} onPress={onPress} style={styles.mini}>
      <Txt variant="label" color={Colors.inkSoft}>
        {title}
      </Txt>
      {children}
    </Card>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    height: 34,
    borderRadius: Radius.pill,
    ...Sticker,
    shadowOffset: { width: 0, height: 2 },
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  mini: { width: '47%', flexGrow: 1, gap: 6, padding: 14 },
});

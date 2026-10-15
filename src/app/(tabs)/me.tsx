import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { LineChart } from '@/components/Charts';
import { Atom } from '@/components/HabitTile';
import { Icon } from '@/components/Icon';
import { Mascot } from '@/components/Mascot';
import { Bar, Button, Card, Row, Screen, SectionTitle, Txt } from '@/components/ui';
import { Accents, Colors, accent } from '@/constants/theme';
import { bmi, fmtWeight, levelFromXp, toDisplayWeight, weightUnit } from '@/lib/calc';
import { confirm } from '@/lib/confirm';
import { consistency, currentWeight, habitStreak, perfectStreak, useStore } from '@/store/useStore';

const DAY_LETTERS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export default function MeScreen() {
  const s = useStore();
  const p = s.profile!;
  const lvl = levelFromXp(s.xp);
  const weight = currentWeight(s.weights, p.startWeightKg);
  const recent = s.weights.slice(-12);
  const lost = p.startWeightKg - weight;
  const pct = Math.max(0, Math.min(1, lost / Math.max(0.1, p.startWeightKg - p.goalWeightKg)));

  return (
    <Screen tabs>
      <Card tone={p.mascotColor} style={{ alignItems: 'center', gap: 6 }}>
        <Mascot size={120} mood={pct >= 1 ? 'excited' : 'proud'} color={p.mascotColor} />
        <Txt variant="title">{p.name}</Txt>
        <Txt variant="caption" color={Colors.ink}>
          Level {lvl.level} · {s.xp.toLocaleString()} XP · 🔥 {perfectStreak(s.habits, s.habitLogs)} day perfect streak
        </Txt>
        <View style={{ alignSelf: 'stretch', gap: 4, marginTop: 6 }}>
          <Bar progress={lvl.into / lvl.need} color={accent(p.mascotColor).strong} track="#fff" height={12} />
          <Txt variant="caption" color={Colors.ink} center>
            {lvl.need - lvl.into} XP to level {lvl.level + 1}
          </Txt>
        </View>
        <Row style={{ marginTop: 6 }}>
          {Accents.map((a) => (
            <Pressable
              key={a}
              accessibilityLabel={`Make Mochi ${a}`}
              onPress={() => s.updateProfile({ mascotColor: a })}
              style={[styles.swatch, { backgroundColor: accent(a).strong }, p.mascotColor === a && styles.swatchOn]}
            />
          ))}
        </Row>
      </Card>

      <SectionTitle title="Weight journey" action="Log weight" onAction={() => router.push('/log-weight')} />
      <Card style={{ gap: 14 }}>
        <Row style={{ justifyContent: 'space-between' }}>
          <WeightStat label="Start" value={fmtWeight(p.startWeightKg, p.units)} />
          <WeightStat label="Now" value={fmtWeight(weight, p.units)} big />
          <WeightStat label="Goal" value={fmtWeight(p.goalWeightKg, p.units)} />
        </Row>
        <Bar progress={pct} color={Colors.mint} height={14} />
        <Row style={{ justifyContent: 'space-between' }}>
          <Txt variant="caption">{lost > 0 ? `Down ${fmtWeight(lost, p.units)} 🎉` : 'Your journey starts here'}</Txt>
          <Txt variant="caption">
            {Math.round(pct * 100)}% · BMI {bmi(weight, p.heightCm).toFixed(1)}
          </Txt>
        </Row>
        {recent.length > 1 ? (
          <LineChart
            points={recent.map((w) => toDisplayWeight(w.kg, p.units))}
            goal={toDisplayWeight(p.goalWeightKg, p.units)}
            color={Colors.grape}
            format={(v) => `${v.toFixed(1)} ${weightUnit(p.units)}`}
          />
        ) : (
          <Txt variant="caption" center>
            Log your weight a couple of times to see your trend line.
          </Txt>
        )}
      </Card>

      <SectionTitle title="Goals" action="+ Add" onAction={() => router.push('/goal-editor')} />
      {s.goals.map((g) => {
        const linked = s.habits.filter((h) => h.goalId === g.id);
        const c = linked.length ? consistency(linked, s.habitLogs) : 0;
        return (
          <Card
            key={g.id}
            tone={g.achievedAt ? 'white' : g.accent}
            style={{ gap: 8 }}
            onPress={() => router.push({ pathname: '/goal-editor', params: { id: g.id } })}>
            <Row>
              <Text style={{ fontSize: 30 }}>{g.achievedAt ? '🏆' : g.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Txt variant="heading" style={g.achievedAt ? { textDecorationLine: 'line-through' } : null}>
                  {g.title}
                </Txt>
                {g.why ? <Txt variant="caption">“{g.why}”</Txt> : null}
              </View>
              <Icon name="chevron-right" size={18} />
            </Row>
            {linked.length ? (
              <>
                <Row gap={4} style={{ flexWrap: 'wrap' }}>
                  {linked.map((h) => (
                    <View key={h.id} style={styles.habitChip}>
                      <Text>{h.emoji}</Text>
                      <Txt variant="caption" color={Colors.ink}>
                        {h.name}
                      </Txt>
                    </View>
                  ))}
                </Row>
                <Bar progress={c} color={accent(g.accent).strong} track="#fff" />
                <Txt variant="caption" color={Colors.ink}>
                  {Math.round(c * 100)}% habit consistency over 14 days
                  {g.deadline ? ` · by ${g.deadline}` : ''}
                </Txt>
              </>
            ) : (
              <Txt variant="caption" color={Colors.ink}>
                Tip: link habits to this goal to track progress.
              </Txt>
            )}
          </Card>
        );
      })}

      <SectionTitle title="Habits" action="+ Add" onAction={() => router.push('/habit-editor')} />
      <Card style={{ gap: 0, paddingVertical: 4 }}>
        {s.habits.length === 0 ? (
          <Txt variant="caption" style={{ paddingVertical: 12 }}>
            No habits yet.
          </Txt>
        ) : null}
        {s.habits.map((h, i) => (
          <Pressable
            key={h.id}
            onPress={() => router.push({ pathname: '/habit-editor', params: { id: h.id } })}
            style={[styles.habitRow, i > 0 && { borderTopWidth: 1.5, borderTopColor: Colors.divider }]}>
            <Atom habit={h} count={0} size={44} />
            <View style={{ flex: 1 }}>
              <Txt variant="label">{h.name}</Txt>
              <Txt variant="caption">
                {h.days.length === 7 ? 'Every day' : h.days.map((d) => DAY_LETTERS[d]).join(' ')} · {h.target} {h.unit}
              </Txt>
            </View>
            <Txt variant="label" color={Colors.tangerine}>
              🔥 {habitStreak(h, s.habitLogs)}
            </Txt>
          </Pressable>
        ))}
      </Card>

      <SectionTitle title="Settings" />
      <Card style={{ gap: 0, paddingVertical: 4 }}>
        <SettingRow
          label="Edit profile & targets"
          value={`${p.calorieTarget} kcal`}
          onPress={() => router.push('/edit-profile')}
        />
        <SettingRow
          label="Units"
          value={p.units === 'metric' ? 'kg / cm' : 'lb / ft'}
          onPress={() => s.updateProfile({ units: p.units === 'metric' ? 'imperial' : 'metric' })}
        />
      </Card>
      <Button
        title="Reset all data"
        variant="ghost"
        tone="tomato"
        onPress={() =>
          confirm('Reset everything?', 'This deletes all your logs, habits and goals.', s.resetAll, 'Reset')
        }
      />
      <Txt variant="caption" center>
        Calorie and fasting guidance is general information, not medical advice.
      </Txt>
    </Screen>
  );
}

function WeightStat({ label, value, big }: { label: string; value: string; big?: boolean }) {
  return (
    <View style={{ alignItems: 'center' }}>
      <Txt variant="caption">{label}</Txt>
      <Txt variant={big ? 'number' : 'label'}>{value}</Txt>
    </View>
  );
}

function SettingRow({ label, value, onPress }: { label: string; value: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.settingRow}>
      <Txt variant="label" style={{ flex: 1 }}>
        {label}
      </Txt>
      <Txt variant="caption">{value}</Txt>
      <Icon name="chevron-right" size={16} color={Colors.inkFaint} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  swatch: { width: 30, height: 30, borderRadius: 15, borderWidth: 2, borderColor: Colors.line },
  swatchOn: { borderWidth: 4, transform: [{ scale: 1.15 }] },
  habitChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ffffffaa',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  habitRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    borderBottomWidth: 1.5,
    borderBottomColor: Colors.divider,
  },
});

import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Emo } from '@/components/Emo';
import { Button, Card, Chip, ColorPicker, Field, Row, Sheet, Txt } from '@/components/ui';
import { Colors, accent, type Accent } from '@/constants/theme';
import { close } from '@/lib/nav';
import { GOAL_EMOJIS } from '@/data/habits';
import { confirm } from '@/lib/confirm';
import { addDays, todayKey } from '@/lib/date';
import { useStore } from '@/store/useStore';

const DEADLINES = [
  { label: '1 month', days: 30 },
  { label: '3 months', days: 90 },
  { label: '6 months', days: 182 },
  { label: '1 year', days: 365 },
];

export default function GoalEditor() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const existing = useStore((s) => s.goals.find((g) => g.id === id));
  const habits = useStore((s) => s.habits);
  const saveGoal = useStore((s) => s.saveGoal);
  const saveHabit = useStore((s) => s.saveHabit);
  const remove = useStore((s) => s.deleteGoal);
  const toggleAchieved = useStore((s) => s.toggleGoalAchieved);

  const [title, setTitle] = useState(existing?.title ?? '');
  const [emoji, setEmoji] = useState(existing?.emoji ?? '🎯');
  const [color, setColor] = useState<Accent>(existing?.accent ?? 'bubblegum');
  const [why, setWhy] = useState(existing?.why ?? '');
  const [deadline, setDeadline] = useState(existing?.deadline ?? '');
  const [linked, setLinked] = useState<string[]>(
    existing ? habits.filter((h) => h.goalId === existing.id).map((h) => h.id) : []
  );

  const onSave = () => {
    const gid = saveGoal({
      id: existing?.id,
      title: title.trim(),
      emoji,
      accent: color,
      why: why.trim(),
      deadline: deadline || undefined,
      achievedAt: existing?.achievedAt,
    });
    for (const h of habits) {
      const want = linked.includes(h.id);
      if (want && h.goalId !== gid) saveHabit({ ...h, goalId: gid });
      if (!want && h.goalId === gid) saveHabit({ ...h, goalId: undefined });
    }
    close();
  };

  return (
    <Sheet
      title={existing ? 'Goal' : 'New goal'}
      onClose={() => close()}
      footer={
        <Button title={existing ? 'Save goal' : 'Create goal'} onPress={onSave} disabled={!title.trim()} tone={color} />
      }>
      <Card tone={color} style={{ alignItems: 'center', gap: 6 }}>
        <Emo e={emoji} size={57} />
        <Txt variant="title" center>
          {title || 'Dream big'}
        </Txt>
        {why ? (
          <Txt variant="body" center>
            “{why}”
          </Txt>
        ) : null}
      </Card>

      <Field label="Goal" value={title} onChangeText={setTitle} placeholder="e.g. Fit into my favourite jeans" />
      <Field
        label="Why does it matter?"
        value={why}
        onChangeText={setWhy}
        placeholder="Your reason keeps you going"
        multiline
      />

      <View style={{ gap: 8 }}>
        <Txt variant="label">Icon & colour</Txt>
        <Row gap={6} style={{ flexWrap: 'wrap' }}>
          {GOAL_EMOJIS.map((e) => (
            <Pressable
              key={e}
              onPress={() => setEmoji(e)}
              style={[styles.emoji, emoji === e && { backgroundColor: accent(color).tint, borderColor: Colors.ink }]}>
              <Emo e={e} size={29} />
            </Pressable>
          ))}
        </Row>
        <ColorPicker value={color} onChange={setColor} size={36} />
      </View>

      <View style={{ gap: 8 }}>
        <Txt variant="label">Target date {deadline ? `· ${deadline}` : ''}</Txt>
        <Row style={{ flexWrap: 'wrap' }}>
          <Chip label="No deadline" selected={!deadline} onPress={() => setDeadline('')} tone={color} />
          {DEADLINES.map((d) => {
            const v = addDays(todayKey(), d.days);
            return (
              <Chip
                key={d.label}
                label={d.label}
                selected={deadline === v}
                onPress={() => setDeadline(v)}
                tone={color}
              />
            );
          })}
        </Row>
      </View>

      <View style={{ gap: 8 }}>
        <Txt variant="label">Habits that build this goal</Txt>
        {habits.length === 0 ? <Txt variant="caption">Create some habits first.</Txt> : null}
        <Row style={{ flexWrap: 'wrap' }}>
          {habits.map((h) => {
            const on = linked.includes(h.id);
            return (
              <Chip
                key={h.id}
                emoji={h.emoji}
                label={h.name}
                selected={on}
                tone={h.accent}
                onPress={() => setLinked(on ? linked.filter((x) => x !== h.id) : [...linked, h.id])}
              />
            );
          })}
        </Row>
      </View>

      {existing ? (
        <>
          <Button
            title={existing.achievedAt ? 'Mark as in progress' : 'I achieved this!'}
            emoji={existing.achievedAt ? undefined : '🏆'}
            tone="lemon"
            variant={existing.achievedAt ? 'soft' : 'solid'}
            onPress={() => {
              toggleAchieved(existing.id);
              close();
            }}
          />
          <Button
            title="Delete goal"
            variant="ghost"
            tone="tomato"
            onPress={() =>
              confirm('Delete goal?', existing.title, () => {
                remove(existing.id);
                close();
              })
            }
          />
        </>
      ) : null}
    </Sheet>
  );
}

const styles = StyleSheet.create({
  emoji: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: Colors.surface,
  },
});

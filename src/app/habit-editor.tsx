import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Atom } from '@/components/HabitTile';
import { Button, Card, Chip, Field, Row, Sheet, Stepper, Txt } from '@/components/ui';
import { Accents, Colors, accent, type Accent } from '@/constants/theme';
import { close } from '@/lib/nav';
import { HABIT_EMOJIS, HABIT_TEMPLATES } from '@/data/habits';
import { confirm } from '@/lib/confirm';
import { todayKey } from '@/lib/date';
import { useStore } from '@/store/useStore';

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export default function HabitEditor() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const existing = useStore((s) => s.habits.find((h) => h.id === id));
  const goals = useStore((s) => s.goals);
  const save = useStore((s) => s.saveHabit);
  const remove = useStore((s) => s.deleteHabit);

  const [name, setName] = useState(existing?.name ?? '');
  const [emoji, setEmoji] = useState(existing?.emoji ?? '🎯');
  const [color, setColor] = useState<Accent>(existing?.accent ?? 'grape');
  const [identity, setIdentity] = useState(existing?.identity ?? '');
  const [target, setTarget] = useState(existing?.target ?? 1);
  const [unit, setUnit] = useState(existing?.unit ?? 'time');
  const [days, setDays] = useState<number[]>(existing?.days ?? [0, 1, 2, 3, 4, 5, 6]);
  const [goalId, setGoalId] = useState<string | undefined>(existing?.goalId);

  const preview = { id: 'p', name, emoji, accent: color, identity, target, unit, days, createdAt: todayKey() };

  const onSave = () => {
    save({
      id: existing?.id,
      name: name.trim(),
      emoji,
      accent: color,
      identity: identity.trim(),
      target,
      unit: unit.trim() || 'time',
      days,
      goalId,
    });
    close();
  };

  return (
    <Sheet
      title={existing ? 'Edit habit' : 'New habit'}
      onClose={() => close()}
      footer={
        <Button
          title={existing ? 'Save changes' : 'Create habit'}
          onPress={onSave}
          disabled={!name.trim() || days.length === 0}
          tone={color}
        />
      }>
      {!existing ? (
        <View style={{ gap: 8 }}>
          <Txt variant="label" color={Colors.inkSoft}>
            Quick start
          </Txt>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {HABIT_TEMPLATES.map((t) => (
              <Chip
                key={t.name}
                emoji={t.emoji}
                label={t.name}
                tone={t.accent}
                selected={name === t.name}
                onPress={() => {
                  setName(t.name);
                  setEmoji(t.emoji);
                  setColor(t.accent);
                  setIdentity(t.identity);
                  setTarget(t.target);
                  setUnit(t.unit);
                }}
              />
            ))}
          </ScrollView>
        </View>
      ) : null}

      <Card tone={color} style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
        <Atom habit={preview} count={Math.floor(target / 2)} size={70} />
        <View style={{ flex: 1 }}>
          <Txt variant="heading">{name || 'Your habit'}</Txt>
          <Txt variant="caption" color={Colors.ink}>
            {identity || 'I am someone who…'}
          </Txt>
        </View>
      </Card>

      <Field label="Habit" value={name} onChangeText={setName} placeholder="e.g. Drink water" />
      <Field
        label="Identity (who you're becoming)"
        value={identity}
        onChangeText={setIdentity}
        placeholder="I am someone who…"
      />

      <View style={{ gap: 8 }}>
        <Txt variant="label">Icon</Txt>
        <View style={styles.emojiGrid}>
          {HABIT_EMOJIS.map((e) => (
            <Pressable
              key={e}
              onPress={() => setEmoji(e)}
              style={[styles.emoji, emoji === e && { backgroundColor: accent(color).tint, borderColor: Colors.ink }]}>
              <Text style={{ fontSize: 22 }}>{e}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={{ gap: 8 }}>
        <Txt variant="label">Colour</Txt>
        <Row>
          {Accents.map((a) => (
            <Pressable
              key={a}
              onPress={() => setColor(a)}
              style={[styles.swatch, { backgroundColor: accent(a).strong }, color === a && styles.swatchOn]}
            />
          ))}
        </Row>
      </View>

      <Card style={{ gap: 10 }}>
        <Row style={{ justifyContent: 'space-between' }}>
          <Txt variant="label">Times per day</Txt>
          <Stepper value={target} onChange={setTarget} min={1} max={20} />
        </Row>
        <Field label="Unit" value={unit} onChangeText={setUnit} placeholder="glasses, minutes, times…" />
      </Card>

      <View style={{ gap: 8 }}>
        <Txt variant="label">Repeat on</Txt>
        <Row gap={6}>
          {DAYS.map((d, i) => {
            const on = days.includes(i);
            return (
              <Pressable
                key={d}
                onPress={() => setDays(on ? days.filter((x) => x !== i) : [...days, i].sort())}
                style={[styles.day, on && { backgroundColor: accent(color).strong }]}>
                <Txt variant="label" color={on ? '#fff' : Colors.ink}>
                  {d}
                </Txt>
              </Pressable>
            );
          })}
        </Row>
      </View>

      {goals.length ? (
        <View style={{ gap: 8 }}>
          <Txt variant="label">Supports goal</Txt>
          <Row style={{ flexWrap: 'wrap' }}>
            <Chip label="None" selected={!goalId} onPress={() => setGoalId(undefined)} tone="grape" />
            {goals.map((g) => (
              <Chip
                key={g.id}
                emoji={g.emoji}
                label={g.title}
                selected={goalId === g.id}
                onPress={() => setGoalId(g.id)}
                tone={g.accent}
              />
            ))}
          </Row>
        </View>
      ) : null}

      {existing ? (
        <Button
          title="Delete habit"
          variant="ghost"
          tone="tomato"
          onPress={() =>
            confirm('Delete habit?', existing.name, () => {
              remove(existing.id);
              close();
            })
          }
        />
      ) : null}
    </Sheet>
  );
}

const styles = StyleSheet.create({
  emojiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
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
  swatch: { width: 36, height: 36, borderRadius: 18, borderWidth: 2, borderColor: Colors.line },
  swatchOn: { borderWidth: 4, transform: [{ scale: 1.12 }] },
  day: {
    flex: 1,
    height: 42,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.line,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
  },
});

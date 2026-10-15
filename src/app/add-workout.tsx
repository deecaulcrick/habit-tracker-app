import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Emo } from '@/components/Emo';
import { Icon } from '@/components/Icon';
import { Button, Card, Chip, Field, IconButton, Row, Sheet, Stepper, Txt, haptic } from '@/components/ui';
import { Colors, Radius, Shadow } from '@/constants/theme';
import { close } from '@/lib/nav';
import { CARDIO, STRENGTH, STRENGTH_MET } from '@/data/exercises';
import { fromDisplayWeight, metKcal, toDisplayWeight, weightUnit } from '@/lib/calc';
import { currentWeight, useStore, type StrengthSet } from '@/store/useStore';
import { useUi } from '@/store/useUi';

const INTENSITY = [
  { key: 'easy', label: 'Easy', emoji: '😌', mult: 0.8 },
  { key: 'moderate', label: 'Moderate', emoji: '😤', mult: 1 },
  { key: 'hard', label: 'Hard', emoji: '🥵', mult: 1.25 },
] as const;

export default function AddWorkout() {
  const params = useLocalSearchParams<{ kind?: 'cardio' | 'strength' }>();
  const [kind, setKind] = useState<'cardio' | 'strength'>(params.kind ?? 'cardio');
  return (
    <Sheet title={kind === 'cardio' ? 'Log cardio' : 'Log strength'} onClose={() => close()}>
      <Row>
        <Chip emoji="🏃" label="Cardio" selected={kind === 'cardio'} onPress={() => setKind('cardio')} tone="sky" />
        <Chip
          emoji="🏋️"
          label="Strength"
          selected={kind === 'strength'}
          onPress={() => setKind('strength')}
          tone="bubblegum"
        />
      </Row>
      {kind === 'cardio' ? <CardioForm /> : <StrengthForm />}
    </Sheet>
  );
}

function CardioForm() {
  const date = useUi((s) => s.date);
  const add = useStore((s) => s.addWorkout);
  const p = useStore((s) => s.profile!);
  const kg = useStore((s) => currentWeight(s.weights, p.startWeightKg));
  const [typeId, setTypeId] = useState('walk');
  const [minutes, setMinutes] = useState(30);
  const [distance, setDistance] = useState('');
  const [intensity, setIntensity] = useState<(typeof INTENSITY)[number]['key']>('moderate');
  const type = CARDIO.find((c) => c.id === typeId)!;
  const mult = INTENSITY.find((i) => i.key === intensity)!.mult;
  const kcal = metKcal(type.met * mult, kg, minutes);
  const distUnit = p.units === 'imperial' ? 'mi' : 'km';

  const save = () => {
    const d = Number(distance);
    add({
      date,
      kind: 'cardio',
      typeId,
      name: type.name,
      emoji: type.emoji,
      minutes,
      distanceKm: d > 0 ? Math.round((p.units === 'imperial' ? d * 1.609 : d) * 100) / 100 : undefined,
      kcal,
    });
    haptic('success');
    close();
  };

  return (
    <>
      <View style={styles.grid}>
        {CARDIO.map((c) => (
          <Pressable
            key={c.id}
            onPress={() => setTypeId(c.id)}
            style={[styles.typeTile, typeId === c.id && styles.typeOn]}>
            <Emo e={c.emoji} size={34} />
            <Txt variant="caption" color={Colors.ink} numberOfLines={1}>
              {c.name}
            </Txt>
          </Pressable>
        ))}
      </View>
      <Card style={{ gap: 14, alignItems: 'center' }}>
        <Txt variant="label">Duration</Txt>
        <Stepper value={minutes} onChange={setMinutes} step={5} min={5} max={600} format={(v) => `${v} min`} />
        <Row style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
          {INTENSITY.map((i) => (
            <Chip
              key={i.key}
              label={i.label}
              emoji={i.emoji}
              selected={intensity === i.key}
              onPress={() => setIntensity(i.key)}
              tone="sky"
            />
          ))}
        </Row>
      </Card>
      {type.hasDistance ? (
        <Field
          label={`Distance (optional)`}
          value={distance}
          onChangeText={setDistance}
          keyboardType="decimal-pad"
          suffix={distUnit}
          placeholder="0"
        />
      ) : null}
      <Card tone="tomato" style={{ alignItems: 'center' }}>
        <Txt variant="caption" color={Colors.ink}>
          Estimated burn
        </Txt>
        <Row>
          <Emo e="🔥" size={40} />
          <Txt variant="display">{kcal} kcal</Txt>
        </Row>
      </Card>
      <Button title="Save workout" tone="sky" onPress={save} />
    </>
  );
}

function StrengthForm() {
  const date = useUi((s) => s.date);
  const add = useStore((s) => s.addWorkout);
  const p = useStore((s) => s.profile!);
  const bodyKg = useStore((s) => currentWeight(s.weights, p.startWeightKg));
  const history = useStore((s) => s.workouts);
  const [exId, setExId] = useState('squat');
  const [sets, setSets] = useState<{ reps: string; w: string }[]>([{ reps: '10', w: '' }]);
  const ex = STRENGTH.find((e) => e.id === exId)!;
  const last = [...history].reverse().find((w) => w.kind === 'strength' && w.typeId === exId);
  const minutes = Math.max(5, sets.length * 3);
  const kcal = metKcal(STRENGTH_MET, bodyKg, minutes);
  const unit = weightUnit(p.units);

  const update = (i: number, patch: Partial<{ reps: string; w: string }>) =>
    setSets(sets.map((s, j) => (j === i ? { ...s, ...patch } : s)));

  const save = (another: boolean) => {
    const parsed: StrengthSet[] = sets
      .map((s) => ({
        reps: parseInt(s.reps, 10) || 0,
        kg: Math.round(fromDisplayWeight(Number(s.w) || 0, p.units) * 10) / 10,
      }))
      .filter((s) => s.reps > 0);
    if (!parsed.length) return;
    add({ date, kind: 'strength', typeId: exId, name: ex.name, emoji: ex.emoji, minutes, sets: parsed, kcal });
    haptic('success');
    if (another) setSets([{ reps: '10', w: '' }]);
    else close();
  };

  return (
    <>
      <View style={styles.grid}>
        {STRENGTH.map((e) => (
          <Pressable
            key={e.id}
            onPress={() => setExId(e.id)}
            style={[styles.typeTile, exId === e.id && [styles.typeOn, { backgroundColor: Colors.bubblegumTint }]]}>
            <Emo e={e.emoji} size={29} />
            <Txt variant="caption" color={Colors.ink} numberOfLines={1}>
              {e.name}
            </Txt>
          </Pressable>
        ))}
      </View>

      {last?.sets?.length ? (
        <Card tone="lemon" style={{ paddingVertical: 10 }}>
          <Txt variant="caption" color={Colors.ink}>
            Last time ({last.date}):{' '}
            {last.sets.map((s) => `${s.reps}×${s.kg ? Math.round(toDisplayWeight(s.kg, p.units)) : 'BW'}`).join(', ')}
          </Txt>
        </Card>
      ) : null}

      <Card style={{ gap: 10 }}>
        <Row>
          <Txt variant="label" style={{ width: 40 }}>
            Set
          </Txt>
          <Txt variant="label" style={{ flex: 1 }}>
            Reps
          </Txt>
          <Txt variant="label" style={{ flex: 1 }}>
            Weight ({unit})
          </Txt>
          <View style={{ width: 30 }} />
        </Row>
        {sets.map((s, i) => (
          <Row key={i}>
            <View style={styles.setNum}>
              <Txt variant="label">{i + 1}</Txt>
            </View>
            <View style={{ flex: 1 }}>
              <Field value={s.reps} onChangeText={(v) => update(i, { reps: v })} keyboardType="number-pad" />
            </View>
            <View style={{ flex: 1 }}>
              <Field
                value={s.w}
                onChangeText={(v) => update(i, { w: v })}
                keyboardType="decimal-pad"
                placeholder="BW"
              />
            </View>
            <Pressable
              onPress={() => setSets(sets.filter((_, j) => j !== i))}
              hitSlop={8}
              style={{ width: 30, alignItems: 'center', opacity: sets.length > 1 ? 1 : 0.2 }}
              disabled={sets.length <= 1}>
              <Icon name="trash" size={18} color={Colors.inkSoft} />
            </Pressable>
          </Row>
        ))}
        <Row style={{ justifyContent: 'center' }}>
          <IconButton icon="plus" tone="bubblegum" onPress={() => setSets([...sets, { ...sets[sets.length - 1] }])} />
          <Txt variant="caption">Add set (copies the last one)</Txt>
        </Row>
      </Card>
      <Txt variant="caption" center>
        ≈ {minutes} min · {kcal} kcal burned
      </Txt>
      <Button title="Save exercise" tone="bubblegum" onPress={() => save(false)} />
      <Button title="Save & log another exercise" variant="soft" tone="bubblegum" onPress={() => save(true)} />
    </>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  typeTile: {
    width: '23%',
    alignItems: 'center',
    gap: 2,
    paddingVertical: 10,
    paddingHorizontal: 4,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 2,
    borderColor: Colors.divider,
  },
  typeOn: { ...Shadow, backgroundColor: Colors.skyTint },
  setNum: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.bubblegumTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

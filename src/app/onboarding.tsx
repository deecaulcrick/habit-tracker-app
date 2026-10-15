import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Emo } from '@/components/Emo';
import { Mascot, type Mood } from '@/components/Mascot';
import { Bar, Bubble, Button, Card, Chip, ColorPicker, Field, Row, Stepper, Txt, haptic } from '@/components/ui';
import { Colors, Radius, Spacing, Shadow, accent, type Accent } from '@/constants/theme';
import { HABIT_TEMPLATES } from '@/data/habits';
import {
  ACTIVITY,
  dailyTarget,
  fromDisplayWeight,
  ftInToCm,
  proteinTarget,
  tdee,
  weightUnit,
  type ActivityLevel,
  type Sex,
  type Units,
} from '@/lib/calc';
import { todayKey } from '@/lib/date';
import { useStore } from '@/store/useStore';

const STEPS = 7;
const ALL_DAYS = [0, 1, 2, 3, 4, 5, 6];
const PACES = [
  { kg: 0.25, label: 'Gentle', emoji: '🐢' },
  { kg: 0.5, label: 'Steady', emoji: '🚶' },
  { kg: 0.75, label: 'Brisk', emoji: '🏃' },
  { kg: 1, label: 'Ambitious', emoji: '🚀' },
];

export default function Onboarding() {
  const insets = useSafeAreaInsets();
  const complete = useStore((s) => s.completeOnboarding);
  const [step, setStep] = useState(0);

  const [name, setName] = useState('');
  const [sex, setSex] = useState<Sex>('female');
  const [age, setAge] = useState(30);
  const [units, setUnits] = useState<Units>('metric');
  const [heightCm, setHeightCm] = useState('165');
  const [ft, setFt] = useState('5');
  const [inch, setInch] = useState('5');
  const [weight, setWeight] = useState('');
  const [goal, setGoal] = useState('');
  const [activity, setActivity] = useState<ActivityLevel>('light');
  const [pace, setPace] = useState(0.5);
  const [picked, setPicked] = useState<string[]>(['Drink water', 'Eat veggies', 'Morning walk', 'Log my meals']);
  const [color, setColor] = useState<Accent>('grape');

  const cm = units === 'metric' ? Number(heightCm) : ftInToCm(Number(ft), Number(inch));
  const kg = fromDisplayWeight(Number(weight), units);
  const goalKg = fromDisplayWeight(Number(goal), units);
  const valid = cm > 100 && cm < 250 && kg > 30 && kg < 350 && goalKg > 30 && goalKg < kg;
  const target = valid ? dailyTarget(sex, kg, cm, age, activity, pace) : 0;
  const maintenance = valid ? tdee(sex, kg, cm, age, activity) : 0;
  const weeks = valid ? Math.ceil((kg - goalKg) / pace) : 0;

  const canNext = [name.trim().length > 0, cm > 100 && cm < 250, valid, true, true, picked.length > 0, true][step];

  const moods: Mood[] = ['happy', 'chill', 'proud', 'excited', 'happy', 'proud', 'excited'];
  const lines = [
    "Hi! I'm Mochi, your habit buddy. What should I call you?",
    `Nice to meet you, ${name.trim() || 'friend'}! Tell me a bit about you.`,
    'Where are you now, and where do you want to be? No judgement, promise.',
    'How much do you move on a normal day?',
    'Slow and steady wins. Pick a pace that feels doable!',
    'Big goals are built from tiny habits. Pick a few to start.',
    'Last thing: what colour should I be?',
  ];

  const finish = () => {
    complete(
      {
        name: name.trim(),
        sex,
        age,
        heightCm: Math.round(cm),
        startWeightKg: Math.round(kg * 10) / 10,
        goalWeightKg: Math.round(goalKg * 10) / 10,
        activity,
        weeklyLossKg: pace,
        units,
        calorieTarget: target,
        proteinTarget: proteinTarget(goalKg),
        stepGoal: 8000,
        mascotColor: color,
        fastPlanId: '16',
        startedAt: todayKey(),
      },
      HABIT_TEMPLATES.filter((t) => picked.includes(t.name)).map((t) => ({
        name: t.name,
        emoji: t.emoji,
        accent: t.accent,
        identity: t.identity,
        target: t.target,
        unit: t.unit,
        days: ALL_DAYS,
      }))
    );
    haptic('success');
  };

  const next = () => (step === STEPS - 1 ? finish() : setStep(step + 1));

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1, backgroundColor: Colors.bg }}>
      <View style={{ paddingTop: insets.top + 12, paddingHorizontal: Spacing.lg, gap: 16 }}>
        <Row>
          {step > 0 ? (
            <Pressable onPress={() => setStep(step - 1)} hitSlop={10}>
              <Txt variant="label" color={Colors.inkSoft}>
                ← Back
              </Txt>
            </Pressable>
          ) : null}
          <View style={{ flex: 1 }}>
            <Bar progress={(step + 1) / STEPS} color={Colors.grape} height={8} />
          </View>
        </Row>
        <Row gap={12}>
          <Mascot size={96} mood={moods[step]} color={color} />
          <Bubble style={{ marginLeft: 6 }}>{lines[step]}</Bubble>
        </Row>
      </View>

      <ScrollView contentContainerStyle={{ padding: Spacing.lg, gap: Spacing.lg }} keyboardShouldPersistTaps="handled">
        {step === 0 && (
          <Field
            label="Your name"
            value={name}
            onChangeText={setName}
            placeholder="e.g. Sam"
            autoFocus
            returnKeyType="next"
            onSubmitEditing={() => canNext && next()}
          />
        )}

        {step === 1 && (
          <>
            <View style={{ gap: 8 }}>
              <Txt variant="label">Units</Txt>
              <Row>
                <Chip label="kg / cm" selected={units === 'metric'} onPress={() => setUnits('metric')} />
                <Chip label="lb / ft" selected={units === 'imperial'} onPress={() => setUnits('imperial')} />
              </Row>
            </View>
            <View style={{ gap: 8 }}>
              <Txt variant="label">Body type for calorie maths</Txt>
              <Row>
                <Chip
                  emoji="♀️"
                  label="Female"
                  selected={sex === 'female'}
                  onPress={() => setSex('female')}
                  tone="bubblegum"
                />
                <Chip emoji="♂️" label="Male" selected={sex === 'male'} onPress={() => setSex('male')} tone="sky" />
              </Row>
            </View>
            <Card style={{ gap: 8, alignItems: 'center' }}>
              <Txt variant="label">Age</Txt>
              <Stepper value={age} onChange={setAge} min={13} max={100} />
            </Card>
            {units === 'metric' ? (
              <Field label="Height" value={heightCm} onChangeText={setHeightCm} keyboardType="number-pad" suffix="cm" />
            ) : (
              <Row gap={12}>
                <Field
                  label="Height"
                  value={ft}
                  onChangeText={setFt}
                  keyboardType="number-pad"
                  suffix="ft"
                  style={{ flex: 1 }}
                />
                <Field
                  label=" "
                  value={inch}
                  onChangeText={setInch}
                  keyboardType="number-pad"
                  suffix="in"
                  style={{ flex: 1 }}
                />
              </Row>
            )}
          </>
        )}

        {step === 2 && (
          <>
            <Field
              label="Current weight"
              value={weight}
              onChangeText={setWeight}
              keyboardType="decimal-pad"
              suffix={weightUnit(units)}
              placeholder="0"
              autoFocus
            />
            <Field
              label="Goal weight"
              value={goal}
              onChangeText={setGoal}
              keyboardType="decimal-pad"
              suffix={weightUnit(units)}
              placeholder="0"
            />
            {weight && goal && !valid ? (
              <Txt variant="caption" color={Colors.tomato}>
                Your goal should be lower than your current weight.
              </Txt>
            ) : null}
            {valid ? (
              <Card tone="mint">
                <Txt variant="heading">
                  That&apos;s {(Number(weight) - Number(goal)).toFixed(1)} {weightUnit(units)} to go. Totally doable!
                </Txt>
              </Card>
            ) : null}
          </>
        )}

        {step === 3 &&
          (Object.keys(ACTIVITY) as ActivityLevel[]).map((k) => (
            <Card key={k} tone={activity === k ? 'mint' : 'white'} onPress={() => setActivity(k)}>
              <Txt variant="heading">{ACTIVITY[k].label}</Txt>
              <Txt variant="caption">{ACTIVITY[k].hint}</Txt>
            </Card>
          ))}

        {step === 4 && (
          <>
            <View style={styles.grid}>
              {PACES.map((p) => {
                const sel = pace === p.kg;
                return (
                  <Pressable
                    key={p.kg}
                    onPress={() => setPace(p.kg)}
                    style={[styles.paceCard, Shadow, sel && { backgroundColor: Colors.grape }]}>
                    <Emo e={p.emoji} size={36} />
                    <Txt variant="heading" color={sel ? '#fff' : Colors.ink}>
                      {p.label}
                    </Txt>
                    <Txt variant="caption" color={sel ? '#fff' : Colors.inkSoft}>
                      {units === 'metric' ? `${p.kg} kg` : `${(p.kg * 2.2).toFixed(1)} lb`} / week
                    </Txt>
                  </Pressable>
                );
              })}
            </View>
            <Card tone="lemon" style={{ gap: 6 }}>
              <Txt variant="caption" color={Colors.ink}>
                Your daily calorie target
              </Txt>
              <Txt variant="display">{target.toLocaleString()} kcal</Txt>
              <Txt variant="body">
                Maintenance is about {maintenance.toLocaleString()} kcal. At this pace you could reach your goal in ~
                {weeks} weeks.
              </Txt>
            </Card>
          </>
        )}

        {step === 5 && (
          <View style={{ gap: 10 }}>
            {HABIT_TEMPLATES.map((t) => {
              const sel = picked.includes(t.name);
              return (
                <Card
                  key={t.name}
                  tone={sel ? t.accent : 'white'}
                  onPress={() => setPicked(sel ? picked.filter((p) => p !== t.name) : [...picked, t.name])}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 }}>
                  <Emo e={t.emoji} size={34} />
                  <View style={{ flex: 1 }}>
                    <Txt variant="heading">{t.name}</Txt>
                    <Txt variant="caption">{t.identity}</Txt>
                  </View>
                  <View style={[styles.check, sel && { backgroundColor: accent(t.accent).strong }]}>
                    {sel ? (
                      <Txt variant="label" color="#fff">
                        ✓
                      </Txt>
                    ) : null}
                  </View>
                </Card>
              );
            })}
          </View>
        )}

        {step === 6 && (
          <View style={{ alignItems: 'center', gap: 20 }}>
            <Mascot size={180} mood="excited" color={color} />
            <ColorPicker value={color} onChange={setColor} size={48} />
          </View>
        )}
      </ScrollView>

      <View style={{ padding: Spacing.lg, paddingBottom: insets.bottom + 16 }}>
        <Button
          title={step === STEPS - 1 ? "Let's go!" : 'Continue'}
          emoji={step === STEPS - 1 ? '🚀' : undefined}
          onPress={next}
          disabled={!canNext}
          tone={step === STEPS - 1 ? 'bubblegum' : 'grape'}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  paceCard: {
    width: '47%',
    flexGrow: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: 14,
    gap: 2,
  },
  check: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: Colors.divider,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
  },
});

import { useState } from 'react';
import { View } from 'react-native';

import { Button, Card, Chip, Field, Row, Sheet, Stepper, Txt } from '@/components/ui';
import { Colors } from '@/constants/theme';
import { close } from '@/lib/nav';
import {
  ACTIVITY,
  dailyTarget,
  fmtHeight,
  fromDisplayWeight,
  proteinTarget,
  toDisplayWeight,
  weightUnit,
  type ActivityLevel,
} from '@/lib/calc';
import { currentWeight, useStore } from '@/store/useStore';

export default function EditProfile() {
  const p = useStore((s) => s.profile!);
  const weights = useStore((s) => s.weights);
  const update = useStore((s) => s.updateProfile);
  const kg = currentWeight(weights, p.startWeightKg);

  const [name, setName] = useState(p.name);
  const [age, setAge] = useState(p.age);
  const [goal, setGoal] = useState(String(Math.round(toDisplayWeight(p.goalWeightKg, p.units) * 10) / 10));
  const [activity, setActivity] = useState<ActivityLevel>(p.activity);
  const [pace, setPace] = useState(p.weeklyLossKg);
  const [stepGoal, setStepGoal] = useState(p.stepGoal);
  const [manualKcal, setManualKcal] = useState('');

  const goalKg = fromDisplayWeight(Number(goal) || 0, p.units);
  const suggested = dailyTarget(p.sex, kg, p.heightCm, age, activity, pace);
  const kcal = Number(manualKcal) > 800 ? Math.round(Number(manualKcal)) : suggested;

  return (
    <Sheet
      title="Profile & targets"
      onClose={() => close()}
      footer={
        <Button
          title="Save"
          disabled={!name.trim() || goalKg < 30}
          onPress={() => {
            update({
              name: name.trim(),
              age,
              goalWeightKg: Math.round(goalKg * 10) / 10,
              activity,
              weeklyLossKg: pace,
              stepGoal,
              calorieTarget: kcal,
              proteinTarget: proteinTarget(goalKg),
            });
            close();
          }}
        />
      }>
      <Field label="Name" value={name} onChangeText={setName} />
      <Card style={{ gap: 12 }}>
        <Row style={{ justifyContent: 'space-between' }}>
          <Txt variant="label">Age</Txt>
          <Stepper value={age} onChange={setAge} min={13} max={100} />
        </Row>
        <Row style={{ justifyContent: 'space-between' }}>
          <Txt variant="label">Height</Txt>
          <Txt variant="label">{fmtHeight(p.heightCm, p.units)}</Txt>
        </Row>
      </Card>
      <Field
        label="Goal weight"
        value={goal}
        onChangeText={setGoal}
        keyboardType="decimal-pad"
        suffix={weightUnit(p.units)}
      />

      <View style={{ gap: 8 }}>
        <Txt variant="label">Activity</Txt>
        <Row style={{ flexWrap: 'wrap' }}>
          {(Object.keys(ACTIVITY) as ActivityLevel[]).map((a) => (
            <Chip
              key={a}
              label={ACTIVITY[a].label}
              selected={activity === a}
              onPress={() => setActivity(a)}
              tone="mint"
            />
          ))}
        </Row>
      </View>
      <View style={{ gap: 8 }}>
        <Txt variant="label">Weekly pace</Txt>
        <Row style={{ flexWrap: 'wrap' }}>
          {[0.25, 0.5, 0.75, 1].map((k) => (
            <Chip
              key={k}
              label={p.units === 'metric' ? `${k} kg` : `${(k * 2.2).toFixed(1)} lb`}
              selected={pace === k}
              onPress={() => setPace(k)}
            />
          ))}
        </Row>
      </View>
      <Card style={{ gap: 8, alignItems: 'center' }}>
        <Txt variant="label">Daily step goal</Txt>
        <Stepper
          value={stepGoal}
          onChange={setStepGoal}
          step={500}
          min={1000}
          max={40000}
          format={(v) => v.toLocaleString()}
        />
      </Card>

      <Card tone="lemon" style={{ gap: 8 }}>
        <Txt variant="caption" color={Colors.ink}>
          Suggested calorie target
        </Txt>
        <Txt variant="title">{suggested.toLocaleString()} kcal</Txt>
        <Field
          label="Or set your own (from your dietitian, etc.)"
          value={manualKcal}
          onChangeText={setManualKcal}
          keyboardType="number-pad"
          suffix="kcal"
          placeholder={String(p.calorieTarget)}
        />
      </Card>
    </Sheet>
  );
}

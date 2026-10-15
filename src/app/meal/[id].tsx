import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';

import { Button, Card, Chip, Row, Sheet, Txt, haptic } from '@/components/ui';
import { Colors, accent } from '@/constants/theme';
import { close } from '@/lib/nav';
import { MEAL_IDEAS, MEAL_SLOTS, type MealSlot } from '@/data/meals';
import { useStore } from '@/store/useStore';
import { useUi } from '@/store/useUi';

export default function MealDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const m = MEAL_IDEAS.find((x) => x.id === id);
  const addFood = useStore((s) => s.addFood);
  const date = useUi((s) => s.date);
  const [slot, setSlot] = useState<MealSlot>(m?.slot ?? 'lunch');
  const [logged, setLogged] = useState(false);

  if (!m) {
    return (
      <Sheet title="Recipe" onClose={() => close()}>
        <Txt>Recipe not found.</Txt>
      </Sheet>
    );
  }

  const { strong, tint } = accent(m.accent);

  return (
    <Sheet
      title={m.name}
      onClose={() => close()}
      footer={
        <Button
          title={logged ? 'Logged! ✓' : `Log to ${MEAL_SLOTS.find((s) => s.key === slot)!.label}`}
          tone={logged ? 'mint' : m.accent}
          disabled={logged}
          onPress={() => {
            addFood({
              date,
              meal: slot,
              name: m.name,
              emoji: m.emoji,
              servings: 1,
              kcal: m.kcal,
              protein: m.protein,
              carbs: m.carbs,
              fat: m.fat,
            });
            haptic('success');
            setLogged(true);
          }}
        />
      }>
      <View
        style={{
          height: 160,
          borderRadius: 24,
          backgroundColor: tint,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 2,
          borderColor: Colors.line,
        }}>
        <Text style={{ fontSize: 80 }}>{m.emoji}</Text>
      </View>
      <Row style={{ flexWrap: 'wrap' }} gap={6}>
        {m.tags.map((t) => (
          <View key={t} style={{ backgroundColor: tint, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 }}>
            <Txt variant="caption" color={Colors.ink}>
              {t}
            </Txt>
          </View>
        ))}
        <View style={{ backgroundColor: Colors.surface, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 }}>
          <Txt variant="caption" color={Colors.ink}>
            ⏱ {m.minutes} min
          </Txt>
        </View>
      </Row>
      <Row gap={8}>
        {[
          { l: 'kcal', v: m.kcal, c: strong },
          { l: 'protein', v: `${m.protein}g`, c: Colors.tangerine },
          { l: 'carbs', v: `${m.carbs}g`, c: Colors.sky },
          { l: 'fat', v: `${m.fat}g`, c: Colors.bubblegum },
        ].map((x) => (
          <Card key={x.l} style={{ flex: 1, alignItems: 'center', padding: 10 }}>
            <Txt variant="number" color={x.c} style={{ fontSize: 18 }}>
              {x.v}
            </Txt>
            <Txt variant="caption">{x.l}</Txt>
          </Card>
        ))}
      </Row>
      <Card style={{ gap: 8 }}>
        <Txt variant="heading">Ingredients</Txt>
        {m.ingredients.map((i) => (
          <Row key={i} gap={10}>
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: strong }} />
            <Txt variant="body" style={{ flex: 1 }}>
              {i}
            </Txt>
          </Row>
        ))}
      </Card>
      <Card style={{ gap: 10 }}>
        <Txt variant="heading">Method</Txt>
        {m.steps.map((s, i) => (
          <Row key={s} gap={10} style={{ alignItems: 'flex-start' }}>
            <View
              style={{
                width: 26,
                height: 26,
                borderRadius: 13,
                backgroundColor: tint,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Txt variant="label">{i + 1}</Txt>
            </View>
            <Txt variant="body" style={{ flex: 1 }}>
              {s}
            </Txt>
          </Row>
        ))}
      </Card>
      <View style={{ gap: 8 }}>
        <Txt variant="label">Log as</Txt>
        <Row style={{ flexWrap: 'wrap' }}>
          {MEAL_SLOTS.map((s) => (
            <Chip
              key={s.key}
              emoji={s.emoji}
              label={s.label}
              selected={slot === s.key}
              tone={s.accent}
              onPress={() => setSlot(s.key)}
            />
          ))}
        </Row>
      </View>
    </Sheet>
  );
}

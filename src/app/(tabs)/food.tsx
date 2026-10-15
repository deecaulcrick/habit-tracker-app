import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Emo } from '@/components/Emo';
import { BarChart } from '@/components/Charts';
import { DateNav } from '@/components/DateNav';
import { Icon } from '@/components/Icon';
import { Mascot } from '@/components/Mascot';
import { Bar, Card, Emoji, IconButton, Ring, Row, Screen, SectionTitle, Txt } from '@/components/ui';
import { Colors, accent } from '@/constants/theme';
import { MEAL_SLOTS } from '@/data/meals';
import { confirm } from '@/lib/confirm';
import { lastNDays, weekdayShort } from '@/lib/date';
import { burnedOn, dayTotals, useStore, type FoodEntry } from '@/store/useStore';
import { useUi } from '@/store/useUi';

export default function FoodScreen() {
  const date = useUi((s) => s.date);
  const foods = useStore((s) => s.foods);
  const workouts = useStore((s) => s.workouts);
  const removeFood = useStore((s) => s.removeFood);
  const p = useStore((s) => s.profile!);
  const totals = dayTotals(foods, date);
  const burned = burnedOn(workouts, date);
  const budget = p.calorieTarget + burned;
  const week = lastNDays(7, date).map((d) => ({
    label: weekdayShort(d),
    value: dayTotals(foods, d).kcal,
    highlight: d === date,
  }));
  const logged = week.filter((d) => d.value > 0);
  const avg = logged.length ? Math.round(logged.reduce((n, d) => n + d.value, 0) / logged.length) : 0;

  return (
    <Screen tabs>
      <Txt variant="title">Food diary</Txt>
      <DateNav />

      <Card tone="tangerine" style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
        <Ring
          size={110}
          stroke={14}
          progress={totals.kcal / budget}
          color={totals.kcal > budget ? Colors.tomato : Colors.tangerine}
          track="#fff">
          <Txt variant="number">{totals.kcal}</Txt>
          <Txt variant="caption" color={Colors.ink}>
            / {budget}
          </Txt>
        </Ring>
        <View style={{ flex: 1, gap: 8 }}>
          <MacroRow label="Protein" v={totals.protein} goal={p.proteinTarget} color={Colors.grape} />
          <MacroRow label="Carbs" v={totals.carbs} goal={Math.round((p.calorieTarget * 0.4) / 4)} color={Colors.sky} />
          <MacroRow
            label="Fat"
            v={totals.fat}
            goal={Math.round((p.calorieTarget * 0.3) / 9)}
            color={Colors.bubblegum}
          />
        </View>
      </Card>

      {MEAL_SLOTS.map((slot) => {
        const items = foods.filter((f) => f.date === date && f.meal === slot.key);
        const kcal = items.reduce((n, f) => n + f.kcal, 0);
        return (
          <Card key={slot.key} style={{ gap: 10 }}>
            <Row>
              <Emoji bg={accent(slot.accent).tint}>{slot.emoji}</Emoji>
              <View style={{ flex: 1 }}>
                <Txt variant="heading">{slot.label}</Txt>
                <Txt variant="caption">{items.length ? `${kcal} kcal` : 'Nothing yet'}</Txt>
              </View>
              <IconButton
                icon="plus"
                tone={slot.accent}
                onPress={() => router.push({ pathname: '/add-food', params: { meal: slot.key } })}
              />
            </Row>
            {items.map((f) => (
              <FoodRow key={f.id} f={f} onDelete={() => confirm('Remove food?', f.name, () => removeFood(f.id))} />
            ))}
          </Card>
        );
      })}

      <Card
        tone="mint"
        style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}
        onPress={() => router.push('/meal-ideas')}>
        <Mascot size={70} mood="hungry" color={p.mascotColor} bounce={false} />
        <View style={{ flex: 1 }}>
          <Txt variant="heading">Need meal ideas?</Txt>
          <Txt variant="caption" color={Colors.ink}>
            Tasty, macro-friendly recipes and a day plan built around {p.calorieTarget} kcal.
          </Txt>
        </View>
        <Icon name="chevron-right" />
      </Card>

      <SectionTitle title="This week" />
      <Card style={{ gap: 10 }}>
        <Row style={{ justifyContent: 'space-between' }}>
          <Txt variant="caption">Daily average</Txt>
          <Txt variant="label">{avg.toLocaleString()} kcal</Txt>
        </Row>
        <BarChart data={week} goal={p.calorieTarget} color={Colors.tangerine} />
      </Card>
    </Screen>
  );
}

function MacroRow({ label, v, goal, color }: { label: string; v: number; goal: number; color: string }) {
  return (
    <View style={{ gap: 3 }}>
      <Row style={{ justifyContent: 'space-between' }}>
        <Txt variant="label">{label}</Txt>
        <Txt variant="caption" color={Colors.ink}>
          {Math.round(v)} / {goal} g
        </Txt>
      </Row>
      <Bar progress={v / goal} color={color} track="#fff" height={8} />
    </View>
  );
}

function FoodRow({ f, onDelete }: { f: FoodEntry; onDelete: () => void }) {
  return (
    <Row style={styles.foodRow}>
      <View
        style={{
          width: 46,
          height: 46,
          borderRadius: 16,
          backgroundColor: Colors.bg,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Emo e={f.emoji} size={34} />
      </View>
      <View style={{ flex: 1 }}>
        <Txt variant="label" numberOfLines={1}>
          {f.name}
        </Txt>
        <Txt variant="caption">
          {f.servings !== 1 ? `${f.servings}× · ` : ''}P {Math.round(f.protein)} · C {Math.round(f.carbs)} · F{' '}
          {Math.round(f.fat)}
        </Txt>
      </View>
      <Txt variant="label">{f.kcal}</Txt>
      <Pressable onPress={onDelete} hitSlop={8}>
        <Icon name="trash" size={18} color={Colors.inkFaint} />
      </Pressable>
    </Row>
  );
}

const styles = StyleSheet.create({
  foodRow: { borderTopWidth: 1.5, borderTopColor: Colors.divider, paddingTop: 10, gap: 10 },
});

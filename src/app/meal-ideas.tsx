import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/Icon';
import { Mascot } from '@/components/Mascot';
import { Bubble, Button, Card, Chip, IconButton, Row, Txt } from '@/components/ui';
import { Colors, Radius, Spacing, Sticker, accent } from '@/constants/theme';
import { close } from '@/lib/nav';
import { MEAL_IDEAS, MEAL_SLOTS, buildDayPlan, type MealIdea, type MealSlot } from '@/data/meals';
import { useStore } from '@/store/useStore';

const TAGS = ['High protein', 'Quick', 'Vegetarian', 'Vegan', 'Low carb', 'Meal prep'];

export default function MealIdeas() {
  const insets = useSafeAreaInsets();
  const p = useStore((s) => s.profile!);
  const [seed, setSeed] = useState(0);
  const [slot, setSlot] = useState<MealSlot | 'all'>('all');
  const [tag, setTag] = useState<string | null>(null);
  const plan = buildDayPlan(p.calorieTarget - 100, seed);
  const planKcal = plan.reduce((n, m) => n + m.kcal, 0);
  const planProtein = plan.reduce((n, m) => n + m.protein, 0);
  const list = MEAL_IDEAS.filter((m) => (slot === 'all' || m.slot === slot) && (!tag || m.tags.includes(tag)));

  return (
    <ScrollView
      style={{ backgroundColor: Colors.bg }}
      contentContainerStyle={{
        padding: Spacing.lg,
        paddingTop: insets.top + 12,
        gap: Spacing.lg,
        paddingBottom: insets.bottom + 40,
      }}>
      <Row>
        <IconButton icon="chevron-left" onPress={() => close()} />
        <Txt variant="title">Meal ideas</Txt>
      </Row>

      <Row gap={10}>
        <Mascot size={80} mood="hungry" color={p.mascotColor} />
        <Bubble style={{ marginLeft: 6 }}>
          Here&apos;s a tasty day that fits your {p.calorieTarget} kcal target. Shuffle for more!
        </Bubble>
      </Row>

      <Card tone="mint" style={{ gap: 12 }}>
        <Row style={{ justifyContent: 'space-between' }}>
          <View>
            <Txt variant="heading">Today&apos;s plan</Txt>
            <Txt variant="caption" color={Colors.ink}>
              {planKcal} kcal · {planProtein} g protein
            </Txt>
          </View>
          <Button title="Shuffle" icon="sparkle" small tone="ink" onPress={() => setSeed(seed + 1)} />
        </Row>
        {plan.map((m) => (
          <Pressable
            key={m.id}
            onPress={() => router.push({ pathname: '/meal/[id]', params: { id: m.id } })}
            style={styles.planRow}>
            <Text style={{ fontSize: 26 }}>{m.emoji}</Text>
            <View style={{ flex: 1 }}>
              <Txt variant="caption">{MEAL_SLOTS.find((s) => s.key === m.slot)!.label}</Txt>
              <Txt variant="label" numberOfLines={1}>
                {m.name}
              </Txt>
            </View>
            <Txt variant="label">{m.kcal}</Txt>
            <Icon name="chevron-right" size={16} color={Colors.inkSoft} />
          </Pressable>
        ))}
      </Card>

      <Txt variant="heading">Browse recipes</Txt>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
        <Chip label="All" selected={slot === 'all'} onPress={() => setSlot('all')} />
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
      </ScrollView>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
        {TAGS.map((t) => (
          <Chip key={t} label={t} selected={tag === t} tone="bubblegum" onPress={() => setTag(tag === t ? null : t)} />
        ))}
      </ScrollView>

      <View style={styles.grid}>
        {list.map((m) => (
          <RecipeCard key={m.id} m={m} />
        ))}
        {list.length === 0 ? <Txt variant="caption">Nothing matches those filters yet.</Txt> : null}
      </View>
    </ScrollView>
  );
}

function RecipeCard({ m }: { m: MealIdea }) {
  const { tint } = accent(m.accent);
  return (
    <Pressable
      onPress={() => router.push({ pathname: '/meal/[id]', params: { id: m.id } })}
      style={({ pressed }) => [styles.recipe, Sticker, pressed && { transform: [{ translateY: 2 }] }]}>
      <View style={[styles.recipeArt, { backgroundColor: tint }]}>
        <Text style={{ fontSize: 46 }}>{m.emoji}</Text>
        <View style={styles.kcalBadge}>
          <Txt variant="label" style={{ fontSize: 12 }}>
            {m.kcal} kcal
          </Txt>
        </View>
      </View>
      <View style={{ padding: 10, gap: 2 }}>
        <Txt variant="label" numberOfLines={2}>
          {m.name}
        </Txt>
        <Txt variant="caption">
          ⏱ {m.minutes} min · P {m.protein}g
        </Txt>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  planRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#ffffffcc',
    borderRadius: Radius.md,
    padding: 10,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  recipe: { width: '48%', backgroundColor: Colors.surface, borderRadius: Radius.lg, overflow: 'hidden' },
  recipeArt: { height: 110, alignItems: 'center', justifyContent: 'center' },
  kcalBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: Colors.surface,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 1.5,
    borderColor: Colors.line,
  },
});

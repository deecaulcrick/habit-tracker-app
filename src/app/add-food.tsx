import { useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { Button, Card, Chip, Field, Row, Sheet, Stepper, Txt, haptic } from '@/components/ui';
import { Colors, Radius, Sticker, accent } from '@/constants/theme';
import { close } from '@/lib/nav';
import { FOOD_CATEGORIES, FOODS, type Food } from '@/data/foods';
import { MEAL_SLOTS, type MealSlot } from '@/data/meals';
import { useStore } from '@/store/useStore';
import { useUi } from '@/store/useUi';

function defaultSlot(): MealSlot {
  const h = new Date().getHours();
  if (h < 11) return 'breakfast';
  if (h < 15) return 'lunch';
  if (h < 21) return 'dinner';
  return 'snack';
}

export default function AddFood() {
  const params = useLocalSearchParams<{ meal?: MealSlot }>();
  const date = useUi((s) => s.date);
  const addFood = useStore((s) => s.addFood);
  const customFoods = useStore((s) => s.customFoods);
  const saveCustomFood = useStore((s) => s.saveCustomFood);
  const logged = useStore((s) => s.foods);

  const [meal, setMeal] = useState<MealSlot>(params.meal ?? defaultSlot());
  const [q, setQ] = useState('');
  const [cat, setCat] = useState<(typeof FOOD_CATEGORIES)[number]['key']>('all');
  const [picked, setPicked] = useState<Food | null>(null);
  const [servings, setServings] = useState(1);
  const [mode, setMode] = useState<'search' | 'custom'>('search');
  const [added, setAdded] = useState(0);

  const all = useMemo(() => [...customFoods, ...FOODS], [customFoods]);
  const recents = useMemo(() => {
    const seen = new Set<string>();
    const out: Food[] = [];
    for (const e of [...logged].reverse()) {
      if (seen.has(e.name)) continue;
      seen.add(e.name);
      const base = all.find((f) => f.name === e.name);
      out.push(
        base ?? {
          id: `recent-${e.id}`,
          name: e.name,
          emoji: e.emoji,
          serving: '1 serving',
          kcal: Math.round(e.kcal / e.servings),
          protein: e.protein / e.servings,
          carbs: e.carbs / e.servings,
          fat: e.fat / e.servings,
          category: 'meal',
        }
      );
      if (out.length >= 8) break;
    }
    return out;
  }, [logged, all]);

  const results = all.filter(
    (f) => (cat === 'all' || f.category === cat) && f.name.toLowerCase().includes(q.trim().toLowerCase())
  );

  const log = (f: Food, n: number) => {
    addFood({
      date,
      meal,
      name: f.name,
      emoji: f.emoji,
      servings: n,
      kcal: Math.round(f.kcal * n),
      protein: Math.round(f.protein * n * 10) / 10,
      carbs: Math.round(f.carbs * n * 10) / 10,
      fat: Math.round(f.fat * n * 10) / 10,
    });
    haptic('success');
    setAdded((a) => a + 1);
    setPicked(null);
    setServings(1);
  };

  return (
    <Sheet
      title="Add food"
      onClose={() => close()}
      footer={
        picked ? (
          <View style={{ gap: 12 }}>
            <Row>
              <Text style={{ fontSize: 32 }}>{picked.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Txt variant="heading">{picked.name}</Txt>
                <Txt variant="caption">
                  {picked.serving} · {Math.round(picked.kcal * servings)} kcal · P{' '}
                  {Math.round(picked.protein * servings)}g
                </Txt>
              </View>
              <Pressable onPress={() => setPicked(null)} hitSlop={10}>
                <Icon name="close" size={18} />
              </Pressable>
            </Row>
            <Row style={{ justifyContent: 'space-between' }}>
              <Txt variant="label">Servings</Txt>
              <Stepper value={servings} onChange={setServings} step={0.5} min={0.5} max={20} format={(v) => `${v}×`} />
            </Row>
            <Button
              title={`Add to ${MEAL_SLOTS.find((m) => m.key === meal)!.label}`}
              tone="tangerine"
              onPress={() => log(picked, servings)}
            />
          </View>
        ) : added ? (
          <Button title={`Done · ${added} added ✓`} tone="mint" onPress={() => close()} />
        ) : null
      }>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
        {MEAL_SLOTS.map((m) => (
          <Chip
            key={m.key}
            emoji={m.emoji}
            label={m.label}
            selected={meal === m.key}
            tone={m.accent}
            onPress={() => setMeal(m.key)}
          />
        ))}
      </ScrollView>

      <Row>
        <Chip label="🔎 Search" selected={mode === 'search'} onPress={() => setMode('search')} tone="tangerine" />
        <Chip
          label="✍️ Custom / quick add"
          selected={mode === 'custom'}
          onPress={() => setMode('custom')}
          tone="tangerine"
        />
      </Row>

      {mode === 'custom' ? (
        <CustomFood
          onSave={(f, keep) => {
            const food = keep ? saveCustomFood(f) : { ...f, id: 'quick' };
            log(food, 1);
            setMode('search');
          }}
        />
      ) : (
        <>
          <Field
            value={q}
            onChangeText={setQ}
            placeholder="Search foods…"
            autoCorrect={false}
            clearButtonMode="while-editing"
          />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {FOOD_CATEGORIES.map((c) => (
              <Chip key={c.key} label={c.label} selected={cat === c.key} onPress={() => setCat(c.key)} tone="grape" />
            ))}
          </ScrollView>

          {!q && cat === 'all' && recents.length ? (
            <View style={{ gap: 8 }}>
              <Txt variant="label" color={Colors.inkSoft}>
                Recent
              </Txt>
              <View style={styles.recentGrid}>
                {recents.map((f) => (
                  <Pressable
                    key={f.id}
                    onPress={() => log(f, 1)}
                    style={({ pressed }) => [styles.recent, Sticker, pressed && { transform: [{ translateY: 2 }] }]}>
                    <Text style={{ fontSize: 22 }}>{f.emoji}</Text>
                    <Txt variant="caption" color={Colors.ink} numberOfLines={1}>
                      {f.name}
                    </Txt>
                    <Txt variant="label" style={{ fontSize: 12 }}>
                      + {f.kcal}
                    </Txt>
                  </Pressable>
                ))}
              </View>
            </View>
          ) : null}

          <View style={{ gap: 8 }}>
            {results.map((f) => (
              <Pressable
                key={f.id}
                onPress={() => {
                  haptic();
                  setPicked(f);
                  setServings(1);
                }}
                style={[
                  styles.row,
                  picked?.id === f.id && { borderColor: Colors.tangerine, backgroundColor: Colors.tangerineTint },
                ]}>
                <Text style={{ fontSize: 26 }}>{f.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Txt variant="label">{f.name}</Txt>
                  <Txt variant="caption">
                    {f.serving} · P {f.protein} · C {f.carbs} · F {f.fat}
                  </Txt>
                </View>
                <Txt variant="label">{f.kcal}</Txt>
                <Pressable
                  onPress={() => log(f, 1)}
                  hitSlop={6}
                  style={[styles.quickAdd, { backgroundColor: accent('tangerine').strong }]}>
                  <Icon name="plus" size={16} color="#fff" />
                </Pressable>
              </Pressable>
            ))}
            {results.length === 0 ? (
              <Card flat style={{ alignItems: 'center', gap: 8 }}>
                <Txt variant="label">No matches for “{q}”</Txt>
                <Button title="Create it" small onPress={() => setMode('custom')} tone="tangerine" />
              </Card>
            ) : null}
          </View>
        </>
      )}
    </Sheet>
  );
}

function CustomFood({ onSave }: { onSave: (f: Omit<Food, 'id'>, keep: boolean) => void }) {
  const [name, setName] = useState('');
  const [kcal, setKcal] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [emoji, setEmoji] = useState('🍽️');
  const ok = Number(kcal) > 0;
  const food = {
    name: name.trim() || 'Quick add',
    emoji,
    serving: '1 serving',
    kcal: Math.round(Number(kcal) || 0),
    protein: Number(protein) || 0,
    carbs: Number(carbs) || 0,
    fat: Number(fat) || 0,
    category: 'meal' as const,
  };
  return (
    <View style={{ gap: 12 }}>
      <Row gap={6} style={{ flexWrap: 'wrap' }}>
        {['🍽️', '🥗', '🍲', '🥪', '🍝', '🍣', '🍰', '🥤', '🍳', '🌮'].map((e) => (
          <Pressable
            key={e}
            onPress={() => setEmoji(e)}
            style={[
              styles.emojiPick,
              emoji === e && { backgroundColor: Colors.tangerineTint, borderColor: Colors.ink },
            ]}>
            <Text style={{ fontSize: 22 }}>{e}</Text>
          </Pressable>
        ))}
      </Row>
      <Field label="Name" value={name} onChangeText={setName} placeholder="e.g. Mum's lasagne" />
      <Field
        label="Calories"
        value={kcal}
        onChangeText={setKcal}
        keyboardType="number-pad"
        suffix="kcal"
        placeholder="0"
      />
      <Row gap={10}>
        <Field
          label="Protein"
          value={protein}
          onChangeText={setProtein}
          keyboardType="decimal-pad"
          suffix="g"
          style={{ flex: 1 }}
        />
        <Field
          label="Carbs"
          value={carbs}
          onChangeText={setCarbs}
          keyboardType="decimal-pad"
          suffix="g"
          style={{ flex: 1 }}
        />
        <Field
          label="Fat"
          value={fat}
          onChangeText={setFat}
          keyboardType="decimal-pad"
          suffix="g"
          style={{ flex: 1 }}
        />
      </Row>
      <Button title="Log once" tone="tangerine" disabled={!ok} onPress={() => onSave(food, false)} />
      <Button
        title="Save to my foods & log"
        variant="soft"
        tone="tangerine"
        disabled={!ok || !name.trim()}
        onPress={() => onSave(food, true)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 2,
    borderColor: Colors.divider,
    padding: 10,
  },
  quickAdd: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  recentGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  recent: {
    width: '22.5%',
    alignItems: 'center',
    gap: 2,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: 8,
  },
  emojiPick: {
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

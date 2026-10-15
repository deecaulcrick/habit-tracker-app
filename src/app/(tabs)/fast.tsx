import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Emo } from '@/components/Emo';
import { BarChart } from '@/components/Charts';
import { Mascot } from '@/components/Mascot';
import { Button, Card, Chip, Ring, Row, Screen, SectionTitle, Txt } from '@/components/ui';
import { Colors, accent } from '@/constants/theme';
import { FAST_PLANS, FAST_STAGES, stageFor } from '@/data/fasting';
import { useNow } from '@/hooks/useNow';
import { confirm } from '@/lib/confirm';
import { formatDuration, formatTime } from '@/lib/date';
import { useStore } from '@/store/useStore';

export default function FastScreen() {
  const active = useStore((s) => s.activeFast);
  const fasts = useStore((s) => s.fasts);
  const p = useStore((s) => s.profile!);
  const update = useStore((s) => s.updateProfile);
  const start = useStore((s) => s.startFast);
  const end = useStore((s) => s.endFast);
  const cancel = useStore((s) => s.cancelFast);
  const [earlier, setEarlier] = useState(0);
  const now = useNow(!!active);

  const plan = FAST_PLANS.find((f) => f.id === p.fastPlanId) ?? FAST_PLANS[1];
  const tone = accent(plan.accent);
  const elapsed = active ? now - active.start : 0;
  const hours = elapsed / 3_600_000;
  const target = active?.targetHours ?? plan.fastHours;
  const pct = hours / target;
  const stage = stageFor(hours);
  const goalAt = active ? active.start + target * 3_600_000 : 0;

  const done = fasts.filter((f) => f.end);
  const recent = done.slice(0, 7).reverse();
  const longest = done.reduce((m, f) => Math.max(m, (f.end! - f.start) / 3_600_000), 0);
  const hits = done.filter((f) => (f.end! - f.start) / 3_600_000 >= f.targetHours).length;

  return (
    <Screen tabs>
      <Txt variant="title">Fasting</Txt>

      <Card tone={active ? plan.accent : 'white'} style={{ alignItems: 'center', gap: 14 }}>
        <Txt variant="label" color={Colors.inkSoft}>
          {active
            ? pct >= 1
              ? 'GOAL REACHED · keep going or break your fast'
              : `${plan.name} fast in progress`
            : "You're in your eating window"}
        </Txt>
        <Ring
          size={240}
          stroke={22}
          progress={active ? pct : 0}
          color={pct >= 1 ? Colors.mint : tone.strong}
          track={active ? '#fff' : Colors.divider}>
          <Mascot
            size={92}
            mood={active ? (pct >= 1 ? 'excited' : 'chill') : 'hungry'}
            color={p.mascotColor}
            bounce={!!active}
          />
          <Txt variant="title" style={{ fontVariant: ['tabular-nums'] }}>
            {active ? formatDuration(elapsed) : `${plan.fastHours}h`}
          </Txt>
          <Txt variant="caption" color={Colors.ink}>
            {active
              ? pct >= 1
                ? `+${formatDuration(elapsed - target * 3_600_000)} bonus`
                : `${formatDuration(goalAt - now)} left`
              : 'fasting goal'}
          </Txt>
        </Ring>

        {active ? (
          <>
            <Row gap={24}>
              <View style={{ alignItems: 'center' }}>
                <Txt variant="caption">Started</Txt>
                <Txt variant="label">{formatTime(active.start)}</Txt>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Txt variant="caption">Goal</Txt>
                <Txt variant="label">{formatTime(goalAt)}</Txt>
              </View>
            </Row>
            <Card
              style={{
                alignSelf: 'stretch',
                flexDirection: 'row',
                gap: 10,
                alignItems: 'center',
                paddingVertical: 12,
              }}>
              <Emo e={stage.emoji} size={34} />
              <View style={{ flex: 1 }}>
                <Txt variant="heading">{stage.title}</Txt>
                <Txt variant="caption">{stage.body}</Txt>
              </View>
            </Card>
            <Button
              title={pct >= 1 ? 'Break fast' : 'End fast early'}
              emoji={pct >= 1 ? '🎉' : undefined}
              tone={pct >= 1 ? 'mint' : 'ink'}
              onPress={end}
              style={{ alignSelf: 'stretch' }}
            />
            <Button
              title="Cancel (don't save)"
              variant="ghost"
              tone="tomato"
              small
              onPress={() => confirm('Cancel this fast?', "It won't be saved to your history.", cancel, 'Cancel fast')}
            />
          </>
        ) : (
          <>
            <Txt variant="caption" center>
              Started a while ago? Back-date it:
            </Txt>
            <Row style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
              {[0, 1, 2, 4].map((h) => (
                <Chip
                  key={h}
                  label={h === 0 ? 'Now' : `${h}h ago`}
                  selected={earlier === h}
                  tone={plan.accent}
                  onPress={() => setEarlier(h)}
                />
              ))}
            </Row>
            <Button
              title={`Start ${plan.name} fast`}
              tone={plan.accent}
              onPress={() => {
                start(plan.fastHours, Date.now() - earlier * 3_600_000);
                setEarlier(0);
              }}
              style={{ alignSelf: 'stretch' }}
            />
          </>
        )}
      </Card>

      {!active ? (
        <>
          <SectionTitle title="Pick a plan" />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginHorizontal: -16 }}
            contentContainerStyle={{ gap: 12, paddingHorizontal: 16, paddingBottom: 6 }}>
            {FAST_PLANS.map((f) => (
              <Card
                key={f.id}
                tone={p.fastPlanId === f.id ? f.accent : 'white'}
                onPress={() => update({ fastPlanId: f.id })}
                style={{ width: 150, gap: 4 }}>
                <Txt variant="title" color={accent(f.accent).strong}>
                  {f.name}
                </Txt>
                <Txt variant="caption" color={Colors.ink}>
                  {f.blurb}
                </Txt>
              </Card>
            ))}
          </ScrollView>
        </>
      ) : null}

      <SectionTitle title="Fasting stages" />
      <Card style={{ gap: 0, paddingVertical: 6 }}>
        {FAST_STAGES.map((st, i) => {
          const reached = active && hours >= st.at;
          return (
            <Row
              key={st.at}
              gap={12}
              style={[styles.stage, i > 0 && styles.stageBorder, { opacity: !active || reached ? 1 : 0.45 }]}>
              <View style={[styles.stageDot, reached && { backgroundColor: tone.strong }]}>
                <Emo e={st.emoji} size={21} />
              </View>
              <View style={{ flex: 1 }}>
                <Txt variant="label">{st.title}</Txt>
                <Txt variant="caption">{st.body}</Txt>
              </View>
              <Txt variant="label" color={Colors.inkSoft}>
                {st.at}h
              </Txt>
            </Row>
          );
        })}
      </Card>

      <SectionTitle title="History" />
      <Row gap={12}>
        <Card tone="sky" style={{ flex: 1 }}>
          <Txt variant="number">{done.length}</Txt>
          <Txt variant="caption" color={Colors.ink}>
            fasts
          </Txt>
        </Card>
        <Card tone="mint" style={{ flex: 1 }}>
          <Txt variant="number">{hits}</Txt>
          <Txt variant="caption" color={Colors.ink}>
            goals hit
          </Txt>
        </Card>
        <Card tone="lemon" style={{ flex: 1 }}>
          <Txt variant="number">{longest.toFixed(1)}h</Txt>
          <Txt variant="caption" color={Colors.ink}>
            longest
          </Txt>
        </Card>
      </Row>
      {recent.length ? (
        <Card style={{ gap: 8 }}>
          <Txt variant="label">Last {recent.length} fasts (hours)</Txt>
          <BarChart
            data={recent.map((f) => ({
              label: new Date(f.start).toLocaleDateString(undefined, { weekday: 'short' }).slice(0, 2),
              value: Math.round(((f.end! - f.start) / 3_600_000) * 10) / 10,
            }))}
            goal={plan.fastHours}
            color={Colors.sky}
            overColor={Colors.mint}
          />
        </Card>
      ) : (
        <Card flat style={{ alignItems: 'center' }}>
          <Txt variant="caption">Your completed fasts will show up here.</Txt>
        </Card>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  stage: { paddingVertical: 10 },
  stageBorder: { borderTopWidth: 1.5, borderTopColor: Colors.divider },
  stageDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

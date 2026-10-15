import { useState } from 'react';
import { View } from 'react-native';

import { Mascot } from '@/components/Mascot';
import { Bubble, Button, Card, Row, Sheet, Stepper, Txt, haptic } from '@/components/ui';
import { Colors } from '@/constants/theme';
import { close } from '@/lib/nav';
import { fmtWeight, fromDisplayWeight, toDisplayWeight, weightUnit } from '@/lib/calc';
import { prettyDate } from '@/lib/date';
import { currentWeight, useStore } from '@/store/useStore';

export default function LogWeight() {
  const p = useStore((s) => s.profile!);
  const weights = useStore((s) => s.weights);
  const log = useStore((s) => s.logWeight);
  const last = currentWeight(weights, p.startWeightKg);
  const [v, setV] = useState(Math.round(toDisplayWeight(last, p.units) * 10) / 10);
  const kg = fromDisplayWeight(v, p.units);
  const diff = kg - last;

  return (
    <Sheet
      title="Weigh in"
      onClose={() => close()}
      footer={
        <Button
          title="Save weight"
          tone="lemon"
          onPress={() => {
            log(Math.round(kg * 10) / 10);
            haptic('success');
            close();
          }}
        />
      }>
      <Row gap={10}>
        <Mascot size={90} mood={diff < 0 ? 'excited' : diff > 0 ? 'chill' : 'happy'} color={p.mascotColor} />
        <Bubble style={{ marginLeft: 6 }}>
          {diff < -0.05
            ? `Down ${fmtWeight(-diff, p.units)}! Woohoo! 🎉`
            : diff > 0.05
              ? "Scales wobble day to day. It's the trend that matters 💜"
              : 'Step on the scale and tell me the number!'}
        </Bubble>
      </Row>
      <Card tone="lemon" style={{ alignItems: 'center', gap: 12 }}>
        <Txt variant="caption" color={Colors.ink}>
          Today&apos;s weight ({weightUnit(p.units)})
        </Txt>
        <Stepper value={v} onChange={setV} step={0.1} min={30} max={700} format={(x) => x.toFixed(1)} />
        <Row>
          {[-1, -0.5, 0.5, 1].map((d) => (
            <Button
              key={d}
              small
              variant="soft"
              tone="lemon"
              title={`${d > 0 ? '+' : ''}${d}`}
              onPress={() => setV(Math.round((v + d) * 10) / 10)}
            />
          ))}
        </Row>
      </Card>
      <View style={{ gap: 6 }}>
        <Txt variant="label">Recent</Txt>
        {[...weights]
          .reverse()
          .slice(0, 6)
          .map((w) => (
            <Row key={w.date} style={{ justifyContent: 'space-between' }}>
              <Txt variant="body">{prettyDate(w.date)}</Txt>
              <Txt variant="label">{fmtWeight(w.kg, p.units)}</Txt>
            </Row>
          ))}
      </View>
    </Sheet>
  );
}

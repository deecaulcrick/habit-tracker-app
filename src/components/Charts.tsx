import { useState } from 'react';
import { View, type LayoutChangeEvent } from 'react-native';
import Svg, { Circle, Line, Path, Rect, Text as SvgText } from 'react-native-svg';

import { Colors, Fonts } from '@/constants/theme';

import { Txt } from './ui';

/** Simple bar chart; bars over `goal` are drawn in the warning colour. */
export function BarChart({
  data,
  goal,
  color,
  overColor = Colors.tomato,
  height = 120,
}: {
  data: { label: string; value: number; highlight?: boolean }[];
  goal?: number;
  color: string;
  overColor?: string;
  height?: number;
}) {
  const [w, setW] = useState(0);
  const max = Math.max(goal ?? 0, ...data.map((d) => d.value), 1) * 1.1;
  const gap = 10;
  const bw = w ? (w - gap * (data.length - 1)) / data.length : 0;
  const goalY = goal ? height - (goal / max) * height : 0;

  return (
    <View onLayout={(e: LayoutChangeEvent) => setW(e.nativeEvent.layout.width)} style={{ gap: 6 }}>
      {w > 0 ? (
        <Svg width={w} height={height}>
          {data.map((d, i) => {
            const bh = Math.max(4, (d.value / max) * height);
            const over = goal ? d.value > goal : false;
            return (
              <Rect
                key={i}
                x={i * (bw + gap)}
                y={height - bh}
                width={bw}
                height={bh}
                rx={Math.min(8, bw / 2)}
                fill={d.value === 0 ? Colors.divider : over ? overColor : color}
                opacity={d.highlight === false ? 0.55 : 1}
              />
            );
          })}
          {goal ? (
            <Line x1={0} x2={w} y1={goalY} y2={goalY} stroke={Colors.ink} strokeWidth={2} strokeDasharray="5 5" />
          ) : null}
        </Svg>
      ) : (
        <View style={{ height }} />
      )}
      <View style={{ flexDirection: 'row', gap }}>
        {data.map((d, i) => (
          <Txt
            key={i}
            variant="caption"
            center
            style={{ flex: 1, fontFamily: d.highlight ? Fonts.black : Fonts.regular }}>
            {d.label}
          </Txt>
        ))}
      </View>
    </View>
  );
}

/** Smooth-ish line chart with a dashed goal line. */
export function LineChart({
  points,
  goal,
  color,
  height = 140,
  format = (v: number) => v.toFixed(1),
}: {
  points: number[];
  goal?: number;
  color: string;
  height?: number;
  format?: (v: number) => string;
}) {
  const [w, setW] = useState(0);
  const pad = 14;
  const values = goal !== undefined ? [...points, goal] : points;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const x = (i: number) => pad + (points.length === 1 ? (w - pad * 2) / 2 : (i / (points.length - 1)) * (w - pad * 2));
  const y = (v: number) => pad + (1 - (v - min) / span) * (height - pad * 2);
  const d = points.map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ');

  return (
    <View onLayout={(e) => setW(e.nativeEvent.layout.width)}>
      {w > 0 && points.length > 0 ? (
        <Svg width={w} height={height}>
          {goal !== undefined ? (
            <>
              <Line
                x1={0}
                x2={w}
                y1={y(goal)}
                y2={y(goal)}
                stroke={Colors.mint}
                strokeWidth={2}
                strokeDasharray="6 6"
              />
              <SvgText x={w - 4} y={y(goal) - 6} fill={Colors.mint} fontSize={11} fontWeight="bold" textAnchor="end">
                {`goal ${format(goal)}`}
              </SvgText>
            </>
          ) : null}
          <Path d={d} stroke={color} strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          {points.map((v, i) => (
            <Circle
              key={i}
              cx={x(i)}
              cy={y(v)}
              r={i === points.length - 1 ? 7 : 4}
              fill={i === points.length - 1 ? color : Colors.surface}
              stroke={color}
              strokeWidth={3}
            />
          ))}
        </Svg>
      ) : (
        <View style={{ height }} />
      )}
    </View>
  );
}

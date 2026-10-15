import { useEffect, useState } from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Ellipse, G, Path } from 'react-native-svg';

import { Colors, type Accent } from '@/constants/theme';

export type Mood = 'happy' | 'excited' | 'sleepy' | 'hungry' | 'proud' | 'chill' | 'worried';

const BODY: Record<Accent, { body: string; shade: string }> = {
  grape: { body: '#C3B3FF', shade: '#A48DFF' },
  tangerine: { body: '#FFC59A', shade: '#FFA868' },
  bubblegum: { body: '#FFB3D3', shade: '#FF8DBE' },
  mint: { body: '#9EEBCF', shade: '#6FDDB5' },
  sky: { body: '#A9D7FF', shade: '#7EC1FF' },
  lemon: { body: '#FFE38A', shade: '#FFD24E' },
  tomato: { body: '#FFB0A8', shade: '#FF8A7F' },
};

type Props = {
  size?: number;
  mood?: Mood;
  color?: Accent;
  bounce?: boolean;
  style?: StyleProp<ViewStyle>;
};

/** Mochi: a squishy rice-cake buddy with a sprout on top. */
export function Mascot({ size = 140, mood = 'happy', color = 'grape', bounce = true, style }: Props) {
  const squish = useSharedValue(0);
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    if (!bounce) return;
    squish.set(withRepeat(withTiming(1, { duration: 900, easing: Easing.inOut(Easing.quad) }), -1, true));
    return () => {
      cancelAnimation(squish);
      squish.set(0);
    };
  }, [bounce, squish]);

  useEffect(() => {
    if (mood === 'sleepy') return;
    let t: ReturnType<typeof setTimeout>;
    const schedule = () => {
      t = setTimeout(
        () => {
          setBlink(true);
          setTimeout(() => setBlink(false), 140);
          schedule();
        },
        2500 + Math.random() * 2500
      );
    };
    schedule();
    return () => clearTimeout(t);
  }, [mood]);

  const { body, shade } = BODY[color];
  const bob = useAnimatedStyle(() => {
    const t = squish.get();
    return { transform: [{ translateY: -size * 0.04 * t }, { scaleX: 1 - 0.02 * t }, { scaleY: 1 + 0.03 * t }] };
  });

  return (
    <Animated.View style={[{ width: size, height: size }, bob, style]}>
      <Svg width={size} height={size} viewBox="0 0 200 200">
        <Ellipse cx={100} cy={188} rx={58} ry={7} fill={Colors.ink} opacity={0.12} />

        {/* sprout */}
        <Path d="M100 44 C100 34 101 26 104 18" stroke={Colors.ink} strokeWidth={5} strokeLinecap="round" fill="none" />
        <Path
          d="M104 20 C114 6 134 6 140 12 C132 26 114 28 104 20 Z"
          fill={Colors.mint}
          stroke={Colors.ink}
          strokeWidth={5}
          strokeLinejoin="round"
        />
        <Path
          d="M102 24 C92 12 74 12 68 18 C76 30 94 32 102 24 Z"
          fill="#7BE3BE"
          stroke={Colors.ink}
          strokeWidth={5}
          strokeLinejoin="round"
        />

        {/* arms */}
        {mood === 'excited' || mood === 'proud' ? (
          <G>
            <Path
              d="M34 128 C18 122 8 108 12 90"
              stroke={Colors.ink}
              strokeWidth={5}
              fill="none"
              strokeLinecap="round"
            />
            <Path
              d="M166 128 C182 122 192 108 188 90"
              stroke={Colors.ink}
              strokeWidth={5}
              fill="none"
              strokeLinecap="round"
            />
            <Circle cx={12} cy={86} r={8} fill={body} stroke={Colors.ink} strokeWidth={5} />
            <Circle cx={188} cy={86} r={8} fill={body} stroke={Colors.ink} strokeWidth={5} />
          </G>
        ) : null}

        {/* body */}
        <Path
          d="M100 42 C152 42 182 82 182 126 C182 166 148 182 100 182 C52 182 18 166 18 126 C18 82 48 42 100 42 Z"
          fill={body}
          stroke={Colors.ink}
          strokeWidth={5}
        />
        <Path d="M36 150 C52 172 148 172 164 150 C160 168 136 178 100 178 C64 178 40 168 36 150 Z" fill={shade} />
        <Ellipse cx={62} cy={78} rx={16} ry={9} fill="#FFFFFF" opacity={0.7} transform="rotate(-30 62 78)" />

        {/* cheeks */}
        <Ellipse cx={56} cy={132} rx={13} ry={8} fill={Colors.bubblegum} opacity={0.55} />
        <Ellipse cx={144} cy={132} rx={13} ry={8} fill={Colors.bubblegum} opacity={0.55} />

        <Eyes mood={mood} blink={blink} />
        <Mouth mood={mood} />

        {mood === 'sleepy' ? (
          <G>
            <Path d="M150 54 h14 l-14 14 h14" stroke={Colors.ink} strokeWidth={4} fill="none" strokeLinejoin="round" />
            <Path
              d="M170 30 h10 l-10 10 h10"
              stroke={Colors.ink}
              strokeWidth={3.5}
              fill="none"
              strokeLinejoin="round"
            />
          </G>
        ) : null}
        {mood === 'excited' ? (
          <G>
            <Sparkle x={36} y={50} />
            <Sparkle x={166} y={44} />
          </G>
        ) : null}
        {mood === 'worried' ? (
          <Path
            d="M156 82 C150 92 152 100 158 100 C164 100 166 92 156 82 Z"
            fill={Colors.sky}
            stroke={Colors.ink}
            strokeWidth={3}
          />
        ) : null}
      </Svg>
    </Animated.View>
  );
}

function Sparkle({ x, y }: { x: number; y: number }) {
  return (
    <Path
      d={`M${x} ${y - 12} L${x + 3} ${y - 3} L${x + 12} ${y} L${x + 3} ${y + 3} L${x} ${y + 12} L${x - 3} ${y + 3} L${x - 12} ${y} L${x - 3} ${y - 3} Z`}
      fill={Colors.lemon}
      stroke={Colors.ink}
      strokeWidth={3}
      strokeLinejoin="round"
    />
  );
}

function Eyes({ mood, blink }: { mood: Mood; blink: boolean }) {
  const ink = Colors.ink;
  if (mood === 'sleepy' || blink) {
    return (
      <G>
        <Path d="M64 112 C70 117 80 117 86 112" stroke={ink} strokeWidth={5} fill="none" strokeLinecap="round" />
        <Path d="M114 112 C120 117 130 117 136 112" stroke={ink} strokeWidth={5} fill="none" strokeLinecap="round" />
      </G>
    );
  }
  if (mood === 'happy' || mood === 'proud') {
    return (
      <G>
        <Path d="M64 114 C68 102 82 102 86 114" stroke={ink} strokeWidth={6} fill="none" strokeLinecap="round" />
        <Path d="M114 114 C118 102 132 102 136 114" stroke={ink} strokeWidth={6} fill="none" strokeLinecap="round" />
      </G>
    );
  }
  if (mood === 'excited') {
    return (
      <G>
        <Path
          d="M66 104 L84 112 L66 120"
          stroke={ink}
          strokeWidth={6}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M134 104 L116 112 L134 120"
          stroke={ink}
          strokeWidth={6}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
    );
  }
  const big = mood === 'hungry' || mood === 'worried';
  return (
    <G>
      <Ellipse cx={75} cy={112} rx={big ? 10 : 8} ry={big ? 12 : 10} fill={ink} />
      <Ellipse cx={125} cy={112} rx={big ? 10 : 8} ry={big ? 12 : 10} fill={ink} />
      <Circle cx={78} cy={107} r={3.5} fill="#fff" />
      <Circle cx={128} cy={107} r={3.5} fill="#fff" />
      {mood === 'worried' ? (
        <G>
          <Path d="M62 94 L84 98" stroke={ink} strokeWidth={4} strokeLinecap="round" />
          <Path d="M138 94 L116 98" stroke={ink} strokeWidth={4} strokeLinecap="round" />
        </G>
      ) : null}
    </G>
  );
}

function Mouth({ mood }: { mood: Mood }) {
  const ink = Colors.ink;
  switch (mood) {
    case 'excited':
    case 'proud':
      return (
        <G>
          <Path d="M84 130 C86 152 114 152 116 130 Z" fill={ink} stroke={ink} strokeWidth={4} strokeLinejoin="round" />
          <Path d="M92 142 C96 148 104 148 108 142 C104 138 96 138 92 142 Z" fill={Colors.tomato} />
        </G>
      );
    case 'hungry':
      return (
        <G>
          <Ellipse cx={100} cy={138} rx={10} ry={11} fill={ink} />
          <Path
            d="M112 134 C118 140 118 148 114 152"
            stroke={Colors.sky}
            strokeWidth={4}
            fill="none"
            strokeLinecap="round"
          />
        </G>
      );
    case 'sleepy':
      return <Ellipse cx={100} cy={136} rx={6} ry={5} fill={ink} />;
    case 'worried':
      return (
        <Path d="M86 140 C92 132 108 132 114 140" stroke={ink} strokeWidth={5} fill="none" strokeLinecap="round" />
      );
    case 'chill':
      return (
        <Path d="M88 132 C94 138 106 138 112 132" stroke={ink} strokeWidth={5} fill="none" strokeLinecap="round" />
      );
    default:
      return (
        <Path d="M86 130 C92 142 108 142 114 130" stroke={ink} strokeWidth={5} fill="none" strokeLinecap="round" />
      );
  }
}

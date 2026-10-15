import { useId } from 'react';
import Svg, { ClipPath, Defs, Ellipse, G, LinearGradient, Path, RadialGradient, Rect, Stop } from 'react-native-svg';

/**
 * Soft, 3D-ish food illustrations for dishes that have no emoji —
 * swallows, soups and rice dishes. Drawn on a 100×100 canvas.
 */

type Speck = { c: string; n: number };
type Plate = {
  kind: 'mound' | 'rice';
  food: [string, string];
  specks?: Speck[];
  side?: 'stew' | 'green-sauce' | 'fish' | 'coconut' | 'tomato';
};
type Bowl = {
  kind: 'bowl';
  soup: [string, string];
  bowl: [string, string];
  bits: ('meat' | 'fish' | 'leaf' | 'clump' | 'okra' | 'oil' | 'pepper' | 'bean' | 'yam')[];
  steam?: boolean;
};
type Other = { kind: 'dodo' | 'abacha' };
type Art = Plate | Bowl | Other;

const WHITE_BOWL: [string, string] = ['#FFFFFF', '#E9E3F2'];
const CLAY_BOWL: [string, string] = ['#C9805A', '#8E4E33'];
const BLUE_BOWL: [string, string] = ['#E6F1FF', '#A9C8F0'];

const ART: Record<string, Art> = {
  // rice
  jollof: {
    kind: 'rice',
    food: ['#FF9A4D', '#E0561F'],
    specks: [
      { c: '#FFC48A', n: 14 },
      { c: '#3FA34D', n: 4 },
    ],
    side: 'tomato',
  },
  'native-jollof': { kind: 'rice', food: ['#E9883C', '#B9521C'], specks: [{ c: '#4C8F33', n: 8 }], side: 'fish' },
  'fried-rice': {
    kind: 'rice',
    food: ['#F5D77E', '#DDB24A'],
    specks: [
      { c: '#4CAF50', n: 8 },
      { c: '#FF8A3D', n: 7 },
      { c: '#E53935', n: 4 },
    ],
  },
  'rice-stew': { kind: 'rice', food: ['#FFFFFF', '#EDE7DA'], specks: [{ c: '#FFFFFF', n: 10 }], side: 'stew' },
  ofada: { kind: 'rice', food: ['#EADBC2', '#C9AE86'], specks: [{ c: '#A07A52', n: 14 }], side: 'green-sauce' },
  'coconut-rice': { kind: 'rice', food: ['#FBEFD5', '#E5CFA3'], specks: [{ c: '#B08354', n: 10 }], side: 'coconut' },
  // swallows
  tuwo: { kind: 'mound', food: ['#FFFFFF', '#E8E4DA'] },
  eba: { kind: 'mound', food: ['#FFE08A', '#E6AE2E'], specks: [{ c: '#FFF1C2', n: 10 }] },
  'pounded-yam': { kind: 'mound', food: ['#FFFFFF', '#EDE6D3'] },
  amala: { kind: 'mound', food: ['#9C705A', '#5C3B2D'] },
  semo: { kind: 'mound', food: ['#FFF4D6', '#E7D3A0'] },
  fufu: { kind: 'mound', food: ['#FBF9F3', '#DDD8CB'] },
  wheat: { kind: 'mound', food: ['#DDBA8A', '#AD8455'], specks: [{ c: '#8E6A42', n: 10 }] },
  'oat-swallow': { kind: 'mound', food: ['#E8D7B4', '#BFA678'], specks: [{ c: '#A68D63', n: 12 }] },
  // soups
  egusi: {
    kind: 'bowl',
    soup: ['#F2C14E', '#D9921C'],
    bowl: WHITE_BOWL,
    bits: ['clump', 'leaf', 'meat', 'oil'],
    steam: true,
  },
  efo: {
    kind: 'bowl',
    soup: ['#5E9E36', '#2F6B22'],
    bowl: WHITE_BOWL,
    bits: ['leaf', 'oil', 'fish', 'pepper'],
    steam: true,
  },
  okra: { kind: 'bowl', soup: ['#94C24A', '#5E922B'], bowl: BLUE_BOWL, bits: ['okra', 'meat', 'oil'], steam: true },
  ogbono: { kind: 'bowl', soup: ['#8C7A45', '#5A4C27'], bowl: WHITE_BOWL, bits: ['leaf', 'meat', 'oil'], steam: true },
  banga: { kind: 'bowl', soup: ['#D9572A', '#9C3214'], bowl: CLAY_BOWL, bits: ['fish', 'oil', 'leaf'], steam: true },
  afang: { kind: 'bowl', soup: ['#3E7D33', '#21511B'], bowl: WHITE_BOWL, bits: ['leaf', 'meat', 'oil'], steam: true },
  edikang: { kind: 'bowl', soup: ['#4C8C34', '#28561D'], bowl: BLUE_BOWL, bits: ['leaf', 'meat', 'oil'], steam: true },
  oha: { kind: 'bowl', soup: ['#7DA43C', '#4D7322'], bowl: WHITE_BOWL, bits: ['leaf', 'meat', 'oil'], steam: true },
  nsala: { kind: 'bowl', soup: ['#F1E2BF', '#CDB487'], bowl: CLAY_BOWL, bits: ['fish', 'pepper', 'leaf'], steam: true },
  'pepper-soup': {
    kind: 'bowl',
    soup: ['#C9783A', '#8A4519'],
    bowl: CLAY_BOWL,
    bits: ['meat', 'leaf', 'pepper'],
    steam: true,
  },
  stew: { kind: 'bowl', soup: ['#E6452A', '#A9240F'], bowl: WHITE_BOWL, bits: ['meat', 'oil'] },
  beans: { kind: 'bowl', soup: ['#C9783A', '#8E4C1F'], bowl: WHITE_BOWL, bits: ['bean', 'oil'] },
  asaro: { kind: 'bowl', soup: ['#F29A3A', '#C8661B'], bowl: WHITE_BOWL, bits: ['yam', 'leaf'] },
  dodo: { kind: 'dodo' },
  abacha: { kind: 'abacha' },
};

/** Deterministic pseudo-random scatter so every render looks the same. */
function scatter(seed: number, n: number, cx: number, cy: number, rx: number, ry: number) {
  const pts: { x: number; y: number; r: number }[] = [];
  let s = seed;
  const rnd = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  while (pts.length < n) {
    const x = (rnd() * 2 - 1) * rx;
    const y = (rnd() * 2 - 1) * ry;
    if ((x * x) / (rx * rx) + (y * y) / (ry * ry) <= 1) pts.push({ x: cx + x, y: cy + y, r: rnd() });
  }
  return pts;
}

export function FoodArt({ id, size = 48 }: { id: string; size?: number }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const art = ART[id] ?? ART.jollof;
  const g = (name: string) => `${name}${uid}`;

  return (
    <Svg width={size} height={size} viewBox={art.kind === 'bowl' ? '6 4 88 88' : '3 22 94 74'}>
      <Defs>
        <LinearGradient id={g('plate')} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#FFFFFF" />
          <Stop offset="1" stopColor="#E7E1EE" />
        </LinearGradient>
        {'food' in art ? (
          <RadialGradient id={g('food')} cx="38%" cy="25%" r="80%">
            <Stop offset="0" stopColor={art.food[0]} />
            <Stop offset="1" stopColor={art.food[1]} />
          </RadialGradient>
        ) : null}
        {art.kind === 'bowl' ? (
          <>
            <LinearGradient id={g('bowl')} x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={art.bowl[0]} />
              <Stop offset="1" stopColor={art.bowl[1]} />
            </LinearGradient>
            <RadialGradient id={g('soup')} cx="40%" cy="35%" r="75%">
              <Stop offset="0" stopColor={art.soup[0]} />
              <Stop offset="1" stopColor={art.soup[1]} />
            </RadialGradient>
            <ClipPath id={g('surface')}>
              <Ellipse cx={50} cy={48} rx={36} ry={11} />
            </ClipPath>
          </>
        ) : null}
        <LinearGradient id={g('dodo')} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#FFD36B" />
          <Stop offset="0.6" stopColor="#F59A2E" />
          <Stop offset="1" stopColor="#C2611A" />
        </LinearGradient>
      </Defs>

      <Ellipse cx={50} cy={86} rx={38} ry={7} fill="#3B2A5A" opacity={0.1} />

      {art.kind === 'bowl' ? <BowlArt art={art} g={g} /> : null}
      {art.kind === 'rice' || art.kind === 'mound' ? <PlateArt art={art} g={g} /> : null}
      {art.kind === 'dodo' ? <DodoArt g={g} /> : null}
      {art.kind === 'abacha' ? <AbachaArt g={g} /> : null}
    </Svg>
  );
}

function PlateBase({ g }: { g: (n: string) => string }) {
  return (
    <>
      <Ellipse cx={50} cy={68} rx={45} ry={20} fill={`url(#${g('plate')})`} />
      <Ellipse cx={50} cy={66} rx={34} ry={13} fill="#F3EEF6" />
    </>
  );
}

function PlateArt({ art, g }: { art: Plate; g: (n: string) => string }) {
  const isRice = art.kind === 'rice';
  const shiftX = art.side ? -6 : 0;
  const mound = isRice
    ? `M${22 + shiftX} 66 C${20 + shiftX} 48 ${34 + shiftX} 36 ${50 + shiftX} 36 C${66 + shiftX} 36 ${80 + shiftX} 48 ${78 + shiftX} 66 Q${50 + shiftX} 74 ${22 + shiftX} 66 Z`
    : 'M20 68 C18 26 82 26 80 68 Q50 77 20 68 Z';
  return (
    <G>
      <PlateBase g={g} />
      {art.side === 'stew' ? (
        <G>
          <Ellipse cx={72} cy={64} rx={15} ry={8} fill="#D9381E" />
          <Ellipse cx={69} cy={62} rx={6} ry={2.5} fill="#FF8A5C" opacity={0.8} />
          <Ellipse cx={76} cy={65} rx={5} ry={3.5} fill="#7A3B22" />
        </G>
      ) : null}
      {art.side === 'green-sauce' ? (
        <G>
          <Ellipse cx={72} cy={64} rx={15} ry={8} fill="#4E7B23" />
          <Ellipse cx={70} cy={62} rx={7} ry={2.5} fill="#E25B2A" opacity={0.7} />
          <Ellipse cx={76} cy={65} rx={4.5} ry={4} fill="#FFFFFF" />
          <Ellipse cx={76} cy={65} rx={2.2} ry={2} fill="#FFC531" />
        </G>
      ) : null}
      {art.side === 'fish' ? <Path d="M60 64 Q70 54 84 60 L90 54 L90 68 L84 63 Q72 72 60 64 Z" fill="#C98A4B" /> : null}
      {art.side === 'coconut' ? (
        <G>
          <Path d="M64 66 A12 9 0 0 1 88 66 Z" fill="#6B4227" />
          <Path d="M66.5 65.5 A9.5 6.5 0 0 1 85.5 65.5 Z" fill="#FFFDF5" />
        </G>
      ) : null}
      {art.side === 'tomato' ? (
        <G>
          <Ellipse cx={77} cy={66} rx={8} ry={5} fill="#7BC043" />
          <Ellipse cx={72} cy={63} rx={6} ry={4.5} fill="#E53935" />
          <Ellipse cx={72} cy={63} rx={3.5} ry={2.5} fill="#FF8A80" />
        </G>
      ) : null}
      <Path d={mound} fill={`url(#${g('food')})`} />
      {(art.specks ?? []).map((sp, i) =>
        scatter(17 + i * 31, sp.n, 50 + shiftX, isRice ? 54 : 52, isRice ? 22 : 24, isRice ? 12 : 14).map((p, j) => (
          <Ellipse
            key={`${i}-${j}`}
            cx={p.x}
            cy={p.y}
            rx={isRice ? 2 : 1.2}
            ry={isRice ? 1.1 : 1.2}
            fill={sp.c}
            opacity={0.9}
          />
        ))
      )}
      <Ellipse
        cx={(isRice ? 40 : 38) + shiftX}
        cy={isRice ? 44 : 40}
        rx={isRice ? 8 : 10}
        ry={isRice ? 4 : 5}
        fill="#FFFFFF"
        opacity={0.45}
      />
    </G>
  );
}

function BowlArt({ art, g }: { art: Bowl; g: (n: string) => string }) {
  const surface = scatter(7, 7, 50, 48, 28, 7);
  return (
    <G>
      {art.steam ? (
        <G opacity={0.55}>
          <Path d="M38 30 C33 24 43 20 38 13" stroke="#FFFFFF" strokeWidth={4} strokeLinecap="round" fill="none" />
          <Path d="M52 28 C47 21 57 17 52 9" stroke="#FFFFFF" strokeWidth={4} strokeLinecap="round" fill="none" />
          <Path d="M64 30 C59 24 69 20 64 14" stroke="#FFFFFF" strokeWidth={4} strokeLinecap="round" fill="none" />
        </G>
      ) : null}
      <Path d="M10 48 C12 76 30 88 50 88 C70 88 88 76 90 48 Z" fill={`url(#${g('bowl')})`} />
      <Ellipse cx={50} cy={48} rx={40} ry={13} fill={art.bowl[0]} />
      <Ellipse cx={50} cy={48} rx={36} ry={11} fill={`url(#${g('soup')})`} />
      <G clipPath={`url(#${g('surface')})`}>
        {art.bits.includes('oil') ? (
          <G>
            <Ellipse cx={36} cy={45} rx={6} ry={2} fill="#FF7A3D" opacity={0.55} />
            <Ellipse cx={64} cy={51} rx={5} ry={1.6} fill="#FF7A3D" opacity={0.5} />
          </G>
        ) : null}
        {art.bits.includes('clump') &&
          scatter(3, 9, 50, 48, 30, 8).map((p, i) => (
            <Ellipse key={`c${i}`} cx={p.x} cy={p.y} rx={3 + p.r * 2} ry={1.6 + p.r} fill="#FFE7A3" />
          ))}
        {art.bits.includes('leaf') &&
          scatter(11, 10, 50, 48, 32, 9).map((p, i) => (
            <Ellipse key={`l${i}`} cx={p.x} cy={p.y} rx={2.6} ry={1.2} fill="#2E7D32" opacity={0.85} />
          ))}
        {art.bits.includes('okra') &&
          scatter(5, 7, 50, 48, 28, 7).map((p, i) => (
            <G key={`o${i}`}>
              <Ellipse cx={p.x} cy={p.y} rx={3.6} ry={2.2} fill="#7CB342" />
              <Ellipse cx={p.x} cy={p.y} rx={2} ry={1.1} fill="#F1F8E9" />
            </G>
          ))}
        {art.bits.includes('bean') &&
          scatter(9, 16, 50, 48, 31, 8).map((p, i) => (
            <Ellipse key={`b${i}`} cx={p.x} cy={p.y} rx={2.4} ry={1.5} fill="#7A3E17" />
          ))}
        {art.bits.includes('yam') &&
          scatter(13, 6, 50, 48, 26, 6).map((p, i) => (
            <Rect key={`y${i}`} x={p.x - 3.5} y={p.y - 2.5} width={7} height={5} rx={1.5} fill="#FFE6A8" />
          ))}
        {art.bits.includes('pepper') &&
          scatter(21, 4, 50, 48, 28, 7).map((p, i) => (
            <Ellipse key={`p${i}`} cx={p.x} cy={p.y} rx={1.6} ry={1.2} fill="#E53935" />
          ))}
      </G>
      {art.bits.includes('meat') ? (
        <G>
          <Path
            d={`M${surface[0].x - 7} 47 Q${surface[0].x - 6} 39 ${surface[0].x + 1} 40 Q${surface[0].x + 8} 41 ${surface[0].x + 7} 48 Q${surface[0].x} 51 ${surface[0].x - 7} 47 Z`}
            fill="#7B4A2E"
          />
          <Ellipse cx={surface[0].x - 1} cy={42} rx={3} ry={1.3} fill="#A8714E" />
          <Path d="M56 50 Q57 44 63 44 Q69 45 68 51 Q62 54 56 50 Z" fill="#8A5636" />
        </G>
      ) : null}
      {art.bits.includes('fish') ? (
        <G>
          <Path d="M40 50 Q48 40 60 45 L66 41 L66 52 L60 48 Q50 56 40 50 Z" fill="#D9A066" />
          <Ellipse cx={45} cy={47} rx={1.4} ry={1.4} fill="#3B2A1A" />
        </G>
      ) : null}
      <Path
        d="M18 58 C22 70 30 78 40 82"
        stroke="#FFFFFF"
        strokeWidth={3}
        strokeLinecap="round"
        fill="none"
        opacity={0.5}
      />
    </G>
  );
}

function DodoArt({ g }: { g: (n: string) => string }) {
  const slices = [
    [30, 58, -25],
    [46, 52, -25],
    [62, 58, -25],
    [38, 68, -25],
    [56, 68, -25],
  ];
  return (
    <G>
      <PlateBase g={g} />
      {slices.map(([x, y, r], i) => (
        <G key={i} transform={`rotate(${r} ${x} ${y})`}>
          <Ellipse cx={x} cy={y + 1.5} rx={11} ry={6} fill="#A64B12" />
          <Ellipse cx={x} cy={y} rx={11} ry={6} fill={`url(#${g('dodo')})`} />
          <Ellipse cx={x - 3} cy={y - 2} rx={4} ry={1.6} fill="#FFF3C4" opacity={0.6} />
        </G>
      ))}
    </G>
  );
}

function AbachaArt({ g }: { g: (n: string) => string }) {
  const strands = scatter(29, 26, 50, 56, 24, 10);
  return (
    <G>
      <PlateBase g={g} />
      <Ellipse cx={50} cy={58} rx={28} ry={12} fill="#F2B45C" />
      {strands.map((p, i) => (
        <Path
          key={i}
          d={`M${p.x - 5} ${p.y} q5 ${p.r * 4 - 2} 10 0`}
          stroke={i % 3 === 0 ? '#FFE9C2' : '#F7D79A'}
          strokeWidth={2}
          strokeLinecap="round"
          fill="none"
        />
      ))}
      <Ellipse cx={36} cy={52} rx={5} ry={4} fill="#EDEFD9" />
      <Ellipse cx={36} cy={52} rx={2.5} ry={2} fill="#A9C26B" />
      <Ellipse cx={62} cy={60} rx={5} ry={4} fill="#EDEFD9" />
      <Ellipse cx={62} cy={60} rx={2.5} ry={2} fill="#A9C26B" />
      {scatter(41, 6, 50, 56, 22, 8).map((p, i) => (
        <Ellipse key={`g${i}`} cx={p.x} cy={p.y} rx={2.4} ry={1} fill="#43A047" />
      ))}
      <Path d="M52 46 Q60 40 70 46 L74 43 L74 51 L70 48 Q60 54 52 46 Z" fill="#C98A4B" />
    </G>
  );
}

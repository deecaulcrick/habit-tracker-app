import { Platform, type ViewStyle } from 'react-native';

/**
 * Mochi's palette: a warm, airy canvas with soft pastel cards and
 * candy accents. Each accent has a gentle "tint" for card backgrounds
 * and a "strong" tone for rings, buttons and highlights.
 */
export const Colors = {
  bg: '#FFF9F3',
  surface: '#FFFFFF',
  ink: '#2D2545',
  inkSoft: '#7D7494',
  inkFaint: '#C2BBD0',
  divider: '#F2ECE5',
  track: '#F3EEF8',

  grape: '#8C6DFF',
  grapeTint: '#F1ECFF',
  tangerine: '#FF9150',
  tangerineTint: '#FFF0E4',
  bubblegum: '#FF6FAE',
  bubblegumTint: '#FFEAF3',
  mint: '#2DC896',
  mintTint: '#E2F8EF',
  sky: '#4DA9FF',
  skyTint: '#E5F2FF',
  lemon: '#FFC23D',
  lemonTint: '#FFF6DB',
  tomato: '#FF6B5E',
  tomatoTint: '#FFEBE8',
} as const;

export type Accent = 'grape' | 'tangerine' | 'bubblegum' | 'mint' | 'sky' | 'lemon' | 'tomato';

export const Accents: Accent[] = ['grape', 'tangerine', 'bubblegum', 'mint', 'sky', 'lemon', 'tomato'];

export function accent(a: Accent) {
  return { strong: Colors[a], tint: Colors[`${a}Tint` as const] };
}

export const Fonts = {
  regular: 'Nunito_600SemiBold',
  bold: 'Nunito_800ExtraBold',
  black: 'Nunito_900Black',
};

export const Radius = { sm: 14, md: 20, lg: 26, xl: 34, pill: 999 } as const;

export const Spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;

function shadow(color: string, opacity: number, radius: number, y: number, elevation: number): ViewStyle {
  return Platform.select<ViewStyle>({
    web: {
      boxShadow: `0px ${y}px ${radius * 1.4}px ${color}${Math.round(opacity * 255)
        .toString(16)
        .padStart(2, '0')}`,
    },
    default: {
      shadowColor: color,
      shadowOffset: { width: 0, height: y },
      shadowOpacity: opacity,
      shadowRadius: radius,
      elevation,
    },
  })!;
}

/** Soft, diffuse lift for white cards. */
export const Shadow = shadow('#6A4FB0', 0.08, 16, 6, 3);
export const ShadowSm = shadow('#6A4FB0', 0.07, 8, 3, 2);
/** Coloured glow under solid buttons. */
export const glow = (color: string) => shadow(color, 0.35, 10, 6, 4);

export const TAB_BAR_SPACE = 110;

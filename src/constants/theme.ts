import { Platform } from 'react-native';

/**
 * Mochi's palette: a warm cream canvas with candy-bright accents.
 * Every accent has a soft "tint" for card backgrounds and a strong
 * tone for text, rings and buttons.
 */
export const Colors = {
  bg: '#FFF7EC',
  surface: '#FFFFFF',
  ink: '#22193A',
  inkSoft: '#6E6585',
  inkFaint: '#B4ADC4',
  line: '#22193A',
  divider: '#EFE6DA',

  grape: '#7C5CFF',
  grapeTint: '#EAE3FF',
  tangerine: '#FF8A3D',
  tangerineTint: '#FFE6D4',
  bubblegum: '#FF5FA2',
  bubblegumTint: '#FFE0EE',
  mint: '#1FC796',
  mintTint: '#D5F7EA',
  sky: '#3BA8FF',
  skyTint: '#DCEFFF',
  lemon: '#FFC92E',
  lemonTint: '#FFF3C9',
  tomato: '#FF5A4E',
  tomatoTint: '#FFE0DD',
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

export const Radius = { sm: 12, md: 18, lg: 24, xl: 32, pill: 999 } as const;

export const Spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;

/** Chunky "sticker" look: ink outline + hard offset shadow. */
export const Sticker = {
  borderWidth: 2,
  borderColor: Colors.line,
  ...Platform.select({
    web: { boxShadow: `0px 4px 0px ${Colors.line}` },
    default: {
      shadowColor: Colors.line,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 0,
    },
  }),
} as const;

export const TAB_BAR_SPACE = 110;

import { Image } from 'expo-image';
import { Text, type StyleProp, type ImageStyle } from 'react-native';

import { EMOJI_ASSETS } from '@/constants/emoji-assets';

import { FoodArt } from './FoodArt';

/**
 * Renders an emoji as a soft 3D illustration (Fluent Emoji 3D), or one of our
 * own food illustrations when given `art:<id>`. Falls back to a text emoji.
 */
export function Emo({ e, size = 24, style }: { e: string; size?: number; style?: StyleProp<ImageStyle> }) {
  if (e.startsWith('art:')) return <FoodArt id={e.slice(4)} size={size} />;
  const src = EMOJI_ASSETS[e.replace(/️/g, '')];
  if (src) return <Image source={src} style={[{ width: size, height: size }, style]} contentFit="contain" />;
  return <Text style={{ fontSize: size * 0.8, lineHeight: size, width: size, textAlign: 'center' }}>{e}</Text>;
}

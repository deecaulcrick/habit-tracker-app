import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { Colors } from '@/constants/theme';

export type IconName =
  | 'home'
  | 'food'
  | 'move'
  | 'fast'
  | 'me'
  | 'plus'
  | 'minus'
  | 'close'
  | 'check'
  | 'chevron-right'
  | 'chevron-left'
  | 'flame'
  | 'trash'
  | 'edit'
  | 'shoe'
  | 'scale'
  | 'sparkle'
  | 'clock';

/** Hand-drawn-feeling line icons, so we need no icon font. */
export function Icon({ name, size = 24, color = Colors.ink }: { name: IconName; size?: number; color?: string }) {
  const p = {
    stroke: color,
    strokeWidth: 2.4,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    fill: 'none',
  };
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {(() => {
        switch (name) {
          case 'home':
            return <Path {...p} d="M4 11 12 4l8 7v8a1 1 0 0 1-1 1h-4v-5h-6v5H5a1 1 0 0 1-1-1z" />;
          case 'food':
            return (
              <>
                <Path {...p} d="M5 3v7a3 3 0 0 0 6 0V3M8 3v18" />
                <Path {...p} d="M17 21V3c-2.5 1.5-3.5 4-3.5 7.5 0 2 1.5 3 3.5 3" />
              </>
            );
          case 'move':
            return (
              <>
                <Circle {...p} cx={14} cy={4.5} r={1.8} />
                <Path {...p} d="M7 11.5 10 8l4 1.5 2 3.5 3 1M10 8l-1.5 6L13 17l1 4M8.5 14 6 20" />
              </>
            );
          case 'fast':
          case 'clock':
            return (
              <>
                <Circle {...p} cx={12} cy={13} r={8} />
                <Path {...p} d="M12 9v4l2.5 2.5M9.5 2.5h5" />
              </>
            );
          case 'me':
            return (
              <>
                <Circle {...p} cx={12} cy={8} r={4} />
                <Path {...p} d="M4 21c1-4.5 4.5-6.5 8-6.5s7 2 8 6.5" />
              </>
            );
          case 'plus':
            return <Path {...p} strokeWidth={3} d="M12 5v14M5 12h14" />;
          case 'minus':
            return <Path {...p} strokeWidth={3} d="M5 12h14" />;
          case 'close':
            return <Path {...p} strokeWidth={3} d="M6 6l12 12M18 6 6 18" />;
          case 'check':
            return <Path {...p} strokeWidth={3} d="m5 12.5 4.5 4.5L19 7.5" />;
          case 'chevron-right':
            return <Path {...p} strokeWidth={3} d="m9 5 7 7-7 7" />;
          case 'chevron-left':
            return <Path {...p} strokeWidth={3} d="m15 5-7 7 7 7" />;
          case 'flame':
            return (
              <Path
                {...p}
                d="M12 21c-4 0-6.5-2.7-6.5-6.2 0-3.3 2.2-5.4 3.6-7.6.4 1.6 1.3 2.7 2.3 3.1.2-3 1.4-5.6 3.6-7.3.2 3 2.1 4.8 3.2 6.6.8 1.3 1.3 2.8 1.3 4.3C19.5 18 16 21 12 21z"
              />
            );
          case 'trash':
            return <Path {...p} d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />;
          case 'edit':
            return <Path {...p} d="M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4" />;
          case 'shoe':
            return <Path {...p} d="M3 17v-6c2 0 3-1 3.5-4L10 8c0 2 1.5 3 3 3.5L19 13c1.5.5 2 1.5 2 2.5V17zM3 17h18" />;
          case 'scale':
            return (
              <>
                <Rect {...p} x={3.5} y={3.5} width={17} height={17} rx={4} />
                <Path {...p} d="M8 9a6 6 0 0 1 8 0l-2.5 2.5M12 12l1.5-1.5" />
              </>
            );
          case 'sparkle':
            return <Path {...p} d="M12 3l2 5.5L19.5 10.5 14 12.5 12 18l-2-5.5L4.5 10.5 10 8.5z" />;
        }
      })()}
    </Svg>
  );
}

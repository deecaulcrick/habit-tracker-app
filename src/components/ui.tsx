import * as Haptics from 'expo-haptics';
import { isValidElement, type ReactNode } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type PressableProps,
  type StyleProp,
  type TextInputProps,
  type TextProps,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';

import {
  Accents,
  Colors,
  Fonts,
  Radius,
  Shadow,
  ShadowSm,
  Spacing,
  TAB_BAR_SPACE,
  accent,
  glow,
  type Accent,
} from '@/constants/theme';

import { Emo } from './Emo';
import { Icon } from './Icon';

export function haptic(kind: 'tap' | 'success' | 'warn' = 'tap') {
  if (Platform.OS === 'web') return;
  if (kind === 'success') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  else if (kind === 'warn') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  else Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

/* ---------- Text ---------- */

type Variant = 'display' | 'title' | 'heading' | 'body' | 'label' | 'caption' | 'number';

const variants: Record<Variant, TextStyle> = {
  display: { fontFamily: Fonts.black, fontSize: 34, lineHeight: 40, letterSpacing: -0.5 },
  title: { fontFamily: Fonts.black, fontSize: 26, lineHeight: 32, letterSpacing: -0.3 },
  heading: { fontFamily: Fonts.bold, fontSize: 18, lineHeight: 24 },
  body: { fontFamily: Fonts.regular, fontSize: 15, lineHeight: 21 },
  label: { fontFamily: Fonts.bold, fontSize: 14, lineHeight: 18 },
  caption: { fontFamily: Fonts.regular, fontSize: 12, lineHeight: 16, color: Colors.inkSoft },
  number: { fontFamily: Fonts.black, fontSize: 22, lineHeight: 26, fontVariant: ['tabular-nums'] },
};

export function Txt({
  variant = 'body',
  color,
  center,
  style,
  ...rest
}: TextProps & { variant?: Variant; color?: string; center?: boolean }) {
  return (
    <Text
      {...rest}
      style={[
        { color: Colors.ink },
        variants[variant],
        color ? { color } : null,
        center && { textAlign: 'center' },
        style,
      ]}
    />
  );
}

/* ---------- Layout ---------- */

export function Screen({
  children,
  scroll = true,
  tabs = false,
  style,
}: {
  children: ReactNode;
  scroll?: boolean;
  tabs?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const insets = useSafeAreaInsets();
  const pad = {
    paddingTop: insets.top + Spacing.md,
    paddingBottom: (tabs ? TAB_BAR_SPACE : insets.bottom) + Spacing.xl,
  };
  if (!scroll) return <View style={[styles.screen, pad, style]}>{children}</View>;
  return (
    <ScrollView
      style={styles.screenBg}
      contentContainerStyle={[styles.screen, pad, style]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled">
      {children}
    </ScrollView>
  );
}

/** A modal-sheet screen with a title row and close button. */
export function Sheet({
  title,
  onClose,
  children,
  footer,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.screenBg, { flex: 1 }]}>
      <View style={[styles.sheetHeader, { paddingTop: Platform.OS === 'android' ? insets.top + 12 : 18 }]}>
        <Txt variant="title" style={{ flex: 1 }}>
          {title}
        </Txt>
        <IconButton icon="close" onPress={onClose} />
      </View>
      <ScrollView
        contentContainerStyle={{ padding: Spacing.lg, gap: Spacing.lg, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>
      {footer ? <View style={[styles.sheetFooter, { paddingBottom: insets.bottom + 12 }]}>{footer}</View> : null}
    </View>
  );
}

export function Row({
  children,
  gap = Spacing.sm,
  style,
}: {
  children: ReactNode;
  gap?: number;
  style?: StyleProp<ViewStyle>;
}) {
  return <View style={[{ flexDirection: 'row', alignItems: 'center', gap }, style]}>{children}</View>;
}

export function Card({
  children,
  tone,
  style,
  onPress,
  onLongPress,
  flat,
}: {
  children: ReactNode;
  tone?: Accent | 'white';
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  onLongPress?: () => void;
  flat?: boolean;
}) {
  const bg = !tone || tone === 'white' ? Colors.surface : accent(tone).tint;
  const white = !tone || tone === 'white';
  const base = [styles.card, flat ? styles.flat : white ? Shadow : null, { backgroundColor: bg }, style];
  if (!onPress && !onLongPress) return <View style={base}>{children}</View>;
  return (
    <Pressable onPress={onPress} onLongPress={onLongPress} style={({ pressed }) => [base, pressed && styles.pressed]}>
      {children}
    </Pressable>
  );
}

export function SectionTitle({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <Row style={{ justifyContent: 'space-between', marginTop: Spacing.sm }}>
      <Txt variant="heading">{title}</Txt>
      {action ? (
        <Pressable onPress={onAction} hitSlop={10}>
          <Txt variant="label" color={Colors.grape}>
            {action}
          </Txt>
        </Pressable>
      ) : null}
    </Row>
  );
}

/* ---------- Controls ---------- */

export function Button({
  title,
  onPress,
  tone = 'grape',
  variant = 'solid',
  icon,
  emoji,
  disabled,
  style,
  small,
}: {
  title: string;
  onPress: () => void;
  tone?: Accent | 'ink';
  variant?: 'solid' | 'soft' | 'ghost';
  icon?: Parameters<typeof Icon>[0]['name'];
  emoji?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  small?: boolean;
}) {
  const strong = tone === 'ink' ? Colors.ink : accent(tone).strong;
  const tint = tone === 'ink' ? Colors.divider : accent(tone).tint;
  const bg = variant === 'solid' ? strong : variant === 'soft' ? tint : 'transparent';
  const fg = variant === 'solid' ? (tone === 'lemon' ? Colors.ink : '#fff') : variant === 'soft' ? Colors.ink : strong;
  return (
    <Pressable
      disabled={disabled}
      onPress={() => {
        haptic();
        onPress();
      }}
      style={({ pressed }) => [
        styles.button,
        small && styles.buttonSmall,
        variant === 'solid' && !disabled && glow(strong),
        { backgroundColor: bg },
        pressed && styles.pressed,
        disabled && { opacity: 0.4 },
        style,
      ]}>
      {icon ? <Icon name={icon} size={small ? 16 : 20} color={fg} /> : null}
      <Txt variant="label" color={fg} style={{ fontSize: small ? 14 : 16 }}>
        {title}
      </Txt>
      {emoji ? <Emo e={emoji} size={small ? 18 : 24} /> : null}
    </Pressable>
  );
}

export function IconButton({
  icon,
  onPress,
  tone,
  size = 40,
}: {
  icon: Parameters<typeof Icon>[0]['name'];
  onPress: () => void;
  tone?: Accent;
  size?: number;
}) {
  return (
    <Pressable
      onPress={() => {
        haptic();
        onPress();
      }}
      hitSlop={6}
      style={({ pressed }) => [
        styles.iconButton,
        tone ? glow(accent(tone).strong) : ShadowSm,
        { width: size, height: size, backgroundColor: tone ? accent(tone).strong : Colors.surface },
        pressed && styles.pressed,
      ]}>
      <Icon name={icon} size={size * 0.5} color={tone && tone !== 'lemon' ? '#fff' : Colors.ink} />
    </Pressable>
  );
}

export function Chip({
  label,
  selected,
  onPress,
  tone = 'grape',
  emoji,
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  tone?: Accent;
  emoji?: string;
}) {
  return (
    <Pressable
      onPress={() => {
        haptic();
        onPress?.();
      }}
      style={({ pressed }) => [
        styles.chip,
        selected ? { backgroundColor: accent(tone).strong, borderColor: accent(tone).strong } : null,
        pressed && { opacity: 0.8 },
      ]}>
      {emoji ? <Emo e={emoji} size={18} /> : null}
      <Txt variant="label" color={selected ? (tone === 'lemon' ? Colors.ink : '#fff') : Colors.ink}>
        {label}
      </Txt>
    </Pressable>
  );
}

export function Field({ label, suffix, style, ...rest }: TextInputProps & { label?: string; suffix?: string }) {
  return (
    <View style={{ gap: 6, flex: (style as ViewStyle)?.flex }}>
      {label ? <Txt variant="label">{label}</Txt> : null}
      <View style={[styles.field, ShadowSm]}>
        <TextInput
          placeholderTextColor={Colors.inkFaint}
          {...rest}
          style={[styles.fieldInput, Platform.OS === 'web' && ({ outlineStyle: 'none' } as object)]}
        />
        {suffix ? (
          <Txt variant="label" color={Colors.inkSoft}>
            {suffix}
          </Txt>
        ) : null}
      </View>
    </View>
  );
}

export function Stepper({
  value,
  onChange,
  step = 1,
  min = 0,
  max = 9999,
  format = (v: number) => String(v),
}: {
  value: number;
  onChange: (v: number) => void;
  step?: number;
  min?: number;
  max?: number;
  format?: (v: number) => string;
}) {
  const clamp = (v: number) => Math.min(max, Math.max(min, Math.round(v * 100) / 100));
  return (
    <Row gap={Spacing.md}>
      <IconButton icon="minus" onPress={() => onChange(clamp(value - step))} />
      <Txt variant="number" style={{ minWidth: 70, textAlign: 'center' }}>
        {format(value)}
      </Txt>
      <IconButton icon="plus" onPress={() => onChange(clamp(value + step))} />
    </Row>
  );
}

/* ---------- Data viz ---------- */

export function Ring({
  size,
  stroke,
  progress,
  color,
  track = Colors.track,
  children,
}: {
  size: number;
  stroke: number;
  progress: number;
  color: string;
  track?: string;
  children?: ReactNode;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const p = Math.max(0, Math.min(1, progress));
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={track} strokeWidth={stroke} fill="none" />
        {p > 0 ? (
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke={color}
            strokeWidth={stroke}
            fill="none"
            strokeDasharray={`${c} ${c}`}
            strokeDashoffset={c * (1 - p)}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        ) : null}
      </Svg>
      {children}
    </View>
  );
}

export function Bar({
  progress,
  color,
  height = 10,
  track = Colors.track,
}: {
  progress: number;
  color: string;
  height?: number;
  track?: string;
}) {
  const p = Math.max(0, Math.min(1, progress));
  return (
    <View style={{ height, borderRadius: height, backgroundColor: track, overflow: 'hidden' }}>
      <View style={{ width: `${p * 100}%`, height, borderRadius: height, backgroundColor: color }} />
    </View>
  );
}

export function Emoji({
  children,
  size = 22,
  bg,
  box = 44,
}: {
  children: string;
  size?: number;
  bg?: string;
  box?: number;
}) {
  return (
    <View
      style={[styles.emojiBox, { width: box, height: box, borderRadius: box / 2.6, backgroundColor: bg ?? Colors.bg }]}>
      <Emo e={children} size={size * 1.3} />
    </View>
  );
}

/** A speech bubble that points left toward the mascot. */
export function Bubble({
  children,
  emoji,
  style,
}: {
  children: ReactNode;
  emoji?: string;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[{ flex: 1, justifyContent: 'center' }, style]}>
      <View style={[styles.bubble, Shadow]}>
        <View style={{ flex: 1 }}>{isValidElement(children) ? children : <Txt variant="label">{children}</Txt>}</View>
        {emoji ? <Emo e={emoji} size={30} /> : null}
      </View>
      <View style={styles.bubbleTail} />
    </View>
  );
}

export function PressableScale(props: PressableProps & { style?: StyleProp<ViewStyle> }) {
  const { style, ...rest } = props;
  return <Pressable {...rest} style={({ pressed }) => [style, pressed && styles.pressed]} />;
}

const styles = StyleSheet.create({
  screenBg: { backgroundColor: Colors.bg },
  screen: { paddingHorizontal: Spacing.lg, gap: Spacing.lg, backgroundColor: Colors.bg, flexGrow: 1 },
  card: { borderRadius: Radius.lg, padding: Spacing.lg + 2 },
  flat: { borderWidth: 1.5, borderColor: Colors.divider, borderStyle: 'dashed' },
  pressed: { transform: [{ scale: 0.97 }], opacity: 0.94 },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 54,
    paddingHorizontal: 20,
    borderRadius: Radius.pill,
  },
  buttonSmall: { height: 40, paddingHorizontal: 14 },
  iconButton: {
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radius.pill,
    borderWidth: 1.5,
    borderColor: Colors.divider,
    backgroundColor: Colors.surface,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    paddingHorizontal: 16,
    minHeight: 54,
    gap: 8,
  },
  fieldInput: { flex: 1, fontFamily: Fonts.bold, fontSize: 17, color: Colors.ink, paddingVertical: 12 },
  emojiBox: { alignItems: 'center', justifyContent: 'center' },
  bubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderBottomLeftRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  bubbleTail: {
    position: 'absolute',
    left: -7,
    top: '50%',
    marginTop: -6,
    width: 14,
    height: 14,
    backgroundColor: Colors.surface,
    transform: [{ rotate: '45deg' }],
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingBottom: 8,
    gap: 12,
  },
  sheetFooter: {
    paddingHorizontal: Spacing.lg,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    backgroundColor: Colors.bg,
  },
});

/** Row of accent swatches; the selected one gets a white ring and a glow. */
export function ColorPicker({
  value,
  onChange,
  size = 36,
}: {
  value: Accent;
  onChange: (a: Accent) => void;
  size?: number;
}) {
  return (
    <Row gap={10} style={{ flexWrap: 'wrap' }}>
      {Accents.map((a) => {
        const on = value === a;
        return (
          <Pressable
            key={a}
            accessibilityLabel={`${a} colour`}
            accessibilityState={{ selected: on }}
            onPress={() => {
              haptic();
              onChange(a);
            }}
            style={[
              {
                width: size,
                height: size,
                borderRadius: size / 2,
                backgroundColor: accent(a).strong,
                borderWidth: on ? 3 : 0,
                borderColor: '#fff',
              },
              on && glow(accent(a).strong),
              on && { transform: [{ scale: 1.12 }] },
            ]}
          />
        );
      })}
    </Row>
  );
}

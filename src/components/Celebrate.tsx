import { useEffect } from 'react';
import { Modal, StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, type SharedValue } from 'react-native-reanimated';

import { Accents, Colors, Radius, Shadow, accent } from '@/constants/theme';
import { useStore } from '@/store/useStore';

import { Mascot } from './Mascot';
import { Button, Txt, haptic } from './ui';

const CONFETTI = Array.from({ length: 28 }, (_, i) => ({
  left: Math.random() * 100,
  delay: Math.random() * 500,
  spin: 360 + i * 40,
  color: accent(Accents[i % Accents.length]).strong,
  size: 8 + Math.random() * 8,
  round: Math.random() > 0.5,
}));

/** Full-screen party when a goal, fast or milestone is hit. */
export function Celebrate() {
  const celebrate = useStore((s) => s.celebrate);
  const dismiss = useStore((s) => s.dismissCelebrate);
  const mascotColor = useStore((s) => s.profile?.mascotColor ?? 'grape');
  const fall = useSharedValue(0);
  const { height } = useWindowDimensions();

  useEffect(() => {
    if (!celebrate) return;
    haptic('success');
    fall.set(0);
    fall.set(withTiming(1, { duration: 2600 }));
  }, [celebrate, fall]);

  return (
    <Modal visible={!!celebrate} transparent animationType="fade" onRequestClose={dismiss}>
      <View style={styles.backdrop}>
        {CONFETTI.map((c, i) => (
          <Piece key={i} piece={c} fall={fall} height={height} />
        ))}
        <View style={[styles.card, Shadow]}>
          <Mascot mood="excited" size={150} color={mascotColor} />
          <Txt variant="title" center>
            {celebrate?.title}
          </Txt>
          <Txt variant="body" center color={Colors.inkSoft}>
            {celebrate?.body}
          </Txt>
          <Button
            title="Yay!"
            emoji="🎉"
            onPress={dismiss}
            tone="bubblegum"
            style={{ alignSelf: 'stretch', marginTop: 8 }}
          />
        </View>
      </View>
    </Modal>
  );
}

function Piece({
  piece,
  fall,
  height,
}: {
  piece: (typeof CONFETTI)[number];
  fall: SharedValue<number>;
  height: number;
}) {
  const style = useAnimatedStyle(() => {
    const t = fall.get();
    return {
      transform: [{ translateY: -piece.delay + t * (height + 40 + piece.delay) }, { rotate: `${t * piece.spin}deg` }],
    };
  });
  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          top: -20,
          left: `${piece.left}%`,
          width: piece.size,
          height: piece.round ? piece.size : piece.size * 1.8,
          borderRadius: piece.round ? piece.size : 2,
          backgroundColor: piece.color,
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: '#22193A99', alignItems: 'center', justifyContent: 'center', padding: 24 },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: 24,
    alignItems: 'center',
    gap: 10,
    width: '100%',
    maxWidth: 380,
  },
});

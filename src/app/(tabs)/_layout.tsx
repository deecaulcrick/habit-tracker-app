import { Tabs } from 'expo-router/js-tabs';

import { TabBar } from '@/components/TabBar';
import { Colors } from '@/constants/theme';
import { useStepSync } from '@/hooks/useSteps';

export default function TabsLayout() {
  useStepSync();
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: Colors.bg }, animation: 'shift' }}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="food" />
      <Tabs.Screen name="move" />
      <Tabs.Screen name="fast" />
      <Tabs.Screen name="me" />
    </Tabs>
  );
}

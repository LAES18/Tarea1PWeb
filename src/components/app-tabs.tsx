import { Tabs } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useColorScheme } from 'react-native';

import { Colors } from '@/constants/theme';

export default function AppTabs() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: { backgroundColor: colors.backgroundElement, borderTopColor: colors.border },
      }}>
      <Tabs.Screen name="index" options={{ title: 'Inicio', tabBarIcon: ({ color }) => <SymbolView name="house.fill" tintColor={color} /> }} />
      <Tabs.Screen name="explore" options={{ title: 'Descubrir', tabBarIcon: ({ color }) => <SymbolView name="suitcase.fill" tintColor={color} /> }} />
      <Tabs.Screen name="plan" options={{ title: 'Plan', tabBarIcon: ({ color }) => <SymbolView name="checklist" tintColor={color} /> }} />
      <Tabs.Screen name="profile" options={{ title: 'Perfil', tabBarIcon: ({ color }) => <SymbolView name="person.crop.circle.fill" tintColor={color} /> }} />
      <Tabs.Screen name="destination/[id]" options={{ href: null }} />
    </Tabs>
  );
}

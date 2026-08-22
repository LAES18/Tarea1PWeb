import { Link, Stack, usePathname } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors, MaxContentWidth, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const tabs = [
  { href: '/', label: 'Inicio', icon: '⌂' },
  { href: '/explore', label: 'Descubrir', icon: '▣' },
  { href: '/plan', label: 'Plan', icon: '✓' },
  { href: '/profile', label: 'Perfil', icon: '◉' },
] as const;

export default function AppTabs() {
  const pathname = usePathname();
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <Stack screenOptions={{ headerShown: false }} />
      <View style={styles.tabBar}>
        <View style={styles.tabInner}>
          <Text style={styles.brand}>Mi viaje</Text>
          {tabs.map((tab) => {
            const active = tab.href === '/' ? pathname === '/' : pathname.startsWith(tab.href);
            return (
              <Link key={tab.href} href={tab.href} asChild>
                <Pressable style={StyleSheet.flatten([styles.tab, active && styles.tabActive])}>
                  <Text style={StyleSheet.flatten([styles.icon, active && styles.activeText])}>{tab.icon}</Text>
                  <Text style={StyleSheet.flatten([styles.label, active && styles.activeText])}>{tab.label}</Text>
                </Pressable>
              </Link>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  tabBar: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: Spacing.three, alignItems: 'center', backgroundColor: '#163B56' },
  tabInner: { width: '100%', maxWidth: MaxContentWidth, borderWidth: 1, borderColor: '#4B7895', borderRadius: Spacing.five, padding: Spacing.one, flexDirection: 'row', alignItems: 'center', gap: Spacing.one, backgroundColor: '#214F6D' },
  brand: { fontSize: 14, fontWeight: 700, marginHorizontal: Spacing.two, color: '#FFFFFF' },
  tab: { minWidth: 90, flex: 1, borderRadius: Spacing.three, paddingVertical: Spacing.two, paddingHorizontal: Spacing.two, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: Spacing.one },
  tabActive: { backgroundColor: '#F4B942' },
  icon: { fontSize: 16, fontWeight: 700, color: '#D7E7F0' },
  label: { fontSize: 14, fontWeight: 600, color: '#D7E7F0' },
  activeText: { color: '#152C3D' },
});

import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { SymbolView } from 'expo-symbols';
import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { getCountryBySlug } from '@/data/port-destinations';
import { useTravelerProfile } from '@/utils/profile-storage';

const initialChecklist = [
  { id: 1, label: 'Pasaporte y documentos', done: true },
  { id: 2, label: 'Cámara y cargador', done: false },
  { id: 3, label: 'Ropa ligera para 3 días', done: false },
  { id: 4, label: 'Botella reutilizable', done: true },
];

export default function PlanScreen() {
  const [checklist, setChecklist] = useState(initialChecklist);
  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(18)).current;
  const profile = useTravelerProfile();
  const activeCountry = getCountryBySlug(profile?.country);

  const toggleItem = (id: number) => {
    setChecklist((items) => items.map((item) => (item.id === id ? { ...item, done: !item.done } : item)));
  };

  const completedCount = checklist.filter((item) => item.done).length;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeIn, { toValue: 1, duration: 650, useNativeDriver: true }),
      Animated.timing(slideUp, { toValue: 0, duration: 650, useNativeDriver: true }),
    ]).start();
  }, [fadeIn, slideUp]);

  return (
    <ThemedView style={styles.screen}>
      <StatusBar style="auto" />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content}>
          <Animated.View style={{ opacity: fadeIn, transform: [{ translateY: slideUp }] }}>
            <ThemedText type="subtitle">Planificador de viaje</ThemedText>
            <ThemedText themeColor="textSecondary" style={styles.intro}>
              Marca lo que ya tienes listo y mantén el viaje ordenado desde el celular.
            </ThemedText>
          </Animated.View>

          <Animated.View style={{ opacity: fadeIn, transform: [{ translateY: slideUp }] }}>
            <ThemedView type="backgroundElement" style={styles.heroCard}>
              <Image source={activeCountry.heroImage} style={styles.heroImage} contentFit="cover" transition={400} />
              <ThemedText type="smallBold">Checklist para {activeCountry.name}</ThemedText>
              <ThemedText themeColor="textSecondary" style={styles.cardText}>
                Ya llevas {completedCount} de {checklist.length} elementos preparados.
              </ThemedText>
            </ThemedView>
          </Animated.View>

          {checklist.map((item) => (
            <Animated.View key={item.id} style={{ opacity: fadeIn, transform: [{ translateY: slideUp }] }}>
              <Pressable onPress={() => toggleItem(item.id)}>
                <ThemedView type="backgroundElement" style={styles.itemCard}>
                  <ThemedView style={styles.itemRow}>
                    <ThemedView type={item.done ? 'backgroundSelected' : 'background'} style={styles.checkBadge}>
                      <SymbolView name={item.done ? 'checkmark' : 'circle'} size={16} />
                    </ThemedView>
                    <ThemedText style={item.done ? styles.doneText : undefined}>{item.label}</ThemedText>
                  </ThemedView>
                </ThemedView>
              </Pressable>
            </Animated.View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  safeArea: { flex: 1 },
  content: { padding: Spacing.four, gap: Spacing.three, paddingBottom: Spacing.six },
  intro: { lineHeight: 22 },
  heroCard: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.two,
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.08)',
    shadowColor: '#0F172A',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  heroImage: { width: '100%', height: 170, borderRadius: Spacing.two },
  cardText: { lineHeight: 20 },
  itemCard: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.06)',
    shadowColor: '#0F172A',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  itemRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  checkBadge: {
    borderRadius: 999,
    padding: Spacing.one,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  doneText: { textDecorationLine: 'line-through', opacity: 0.7 },
});

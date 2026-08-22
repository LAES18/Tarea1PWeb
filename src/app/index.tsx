import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef } from 'react';
import { Animated, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { getCountryBySlug } from '@/data/port-destinations';
import { useTravelerProfile } from '@/utils/profile-storage';

export default function HomeScreen() {
  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(24)).current;
  const profile = useTravelerProfile();
  const activeCountry = getCountryBySlug(profile?.country);
  const travelerName = profile?.name ?? 'viajero';

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
            <ThemedView type="backgroundElement" style={styles.heroCard}>
              <ThemedText type="title">Agenda de viajes</ThemedText>
              <ThemedText themeColor="textSecondary" style={styles.heroText}>
                Hola {travelerName}, descubre destinos y organiza tu próxima aventura.
              </ThemedText>
              <Image source={activeCountry.heroImage} style={styles.heroImage} contentFit="cover" transition={400} />
              <ThemedText type="smallBold">Tu destino destacado: {activeCountry.name}</ThemedText>
              <ThemedText themeColor="textSecondary" style={styles.cardText}>
                {activeCountry.intro}
              </ThemedText>
            </ThemedView>
          </Animated.View>

          <ThemedText type="subtitle">Destinos destacados</ThemedText>
          {activeCountry.destinations.map((item) => (
            <Animated.View key={item.slug} style={{ opacity: fadeIn, transform: [{ translateY: slideUp }] }}>
              <ThemedView type="backgroundElement" style={styles.card}>
                <ThemedText type="smallBold">{item.title}</ThemedText>
                <ThemedText themeColor="textSecondary" style={styles.cardText}>
                  {item.description}
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  {item.location} · Mejor momento: {item.bestTime}
                </ThemedText>
              </ThemedView>
            </Animated.View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  safeArea: {
    flex: 1,
  },
  content: {
    padding: Spacing.four,
    gap: Spacing.three,
    paddingBottom: Spacing.six,
  },
  heroCard: {
    borderRadius: Spacing.four,
    padding: Spacing.four,
    gap: Spacing.two,
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.08)',
    shadowColor: '#0F172A',
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },
    elevation: 4,
  },
  heroText: { lineHeight: 24 },
  heroImage: { width: '100%', height: 220, borderRadius: Spacing.three },
  card: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.one,
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.06)',
    shadowColor: '#0F172A',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  cardText: { lineHeight: 20 },
});

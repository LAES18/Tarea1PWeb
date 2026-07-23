import { Image } from 'expo-image';
import { Link, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef } from 'react';
import { Animated, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { getCountryBySlug } from '@/data/port-destinations';
import { useTravelerProfile } from '@/utils/profile-storage';

export default function DestinationDetailScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  const profile = useTravelerProfile();
  const activeCountry = getCountryBySlug(profile?.country);
  const destination = activeCountry.destinations.find((item) => item.slug === params.id);
  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(18)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeIn, { toValue: 1, duration: 650, useNativeDriver: true }),
      Animated.timing(slideUp, { toValue: 0, duration: 650, useNativeDriver: true }),
    ]).start();
  }, [fadeIn, slideUp]);

  if (!destination) {
    return (
      <ThemedView style={styles.screen}>
        <StatusBar style="auto" />
        <SafeAreaView style={styles.safeArea}>
          <ThemedText type="subtitle">Destino no encontrado</ThemedText>
        </SafeAreaView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.screen}>
      <StatusBar style="auto" />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content}>
          <Animated.View style={{ opacity: fadeIn, transform: [{ translateY: slideUp }] }}>
            <Image source={destination.image} style={styles.heroImage} contentFit="cover" transition={400} />
          </Animated.View>
          <Animated.View style={{ opacity: fadeIn, transform: [{ translateY: slideUp }] }}>
            <ThemedView type="backgroundElement" style={styles.card}>
              <ThemedText type="subtitle">{destination.title}</ThemedText>
              <ThemedText themeColor="textSecondary">{destination.location}</ThemedText>
              <ThemedText style={styles.description}>{destination.description}</ThemedText>
              <ThemedView style={styles.chipsRow}>
                {destination.highlights.map((item) => (
                  <ThemedView key={item} type="backgroundSelected" style={styles.chip}>
                    <ThemedText type="small">{item}</ThemedText>
                  </ThemedView>
                ))}
              </ThemedView>
            </ThemedView>
          </Animated.View>

          <Animated.View style={{ opacity: fadeIn, transform: [{ translateY: slideUp }] }}>
            <ThemedView type="backgroundElement" style={styles.card}>
              <ThemedText type="smallBold">Mejor horario</ThemedText>
              <ThemedText themeColor="textSecondary" style={styles.description}>
                {destination.bestTime}
              </ThemedText>
              <ThemedText type="smallBold">Ruta recomendada</ThemedText>
              <ThemedText themeColor="textSecondary" style={styles.description}>
                {destination.route}
              </ThemedText>
            </ThemedView>
          </Animated.View>

          <Animated.View style={{ opacity: fadeIn, transform: [{ translateY: slideUp }] }}>
            <Link href="/explore" asChild>
              <ThemedView type="backgroundElement" style={styles.backButton}>
                <ThemedText type="smallBold">Volver a explorar</ThemedText>
              </ThemedView>
            </Link>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  safeArea: { flex: 1 },
  content: { padding: Spacing.four, gap: Spacing.three, paddingBottom: Spacing.six },
  heroImage: { width: '100%', height: 220, borderRadius: Spacing.three },
  card: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.two,
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.08)',
    shadowColor: '#0F172A',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  description: { lineHeight: 22 },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.one },
  chip: { borderRadius: Spacing.five, paddingHorizontal: Spacing.two, paddingVertical: Spacing.one },
  backButton: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.08)',
    shadowColor: '#0F172A',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
});

import { Image } from 'expo-image';
import { Link, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { getCountryBySlug } from '@/data/port-destinations';
import { useTheme } from '@/hooks/use-theme';
import { getApiToken, listViajes, type ApiViaje } from '@/services/travel-api';
import { useTravelerProfile } from '@/utils/profile-storage';

export default function DiscoverScreen() {
  return <ApiTripsScreen />;
}

function ApiTripsScreen() {
  const [viajes, setViajes] = useState<ApiViaje[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!getApiToken()) {
      setLoading(false);
      setError('Inicia sesión para consultar tus viajes protegidos por token.');
      return;
    }

    listViajes()
      .then(setViajes)
      .catch((reason: Error) => setError(reason.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <ThemedView style={styles.screen}>
      <StatusBar style="auto" />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content}>
          <ThemedText type="subtitle">Mis viajes</ThemedText>
          <ThemedText themeColor="textSecondary">Recursos obtenidos desde tu API REST Laravel.</ThemedText>
          {loading && <ThemedText>Cargando viajes...</ThemedText>}
          {!loading && error !== '' && <ThemedText themeColor="textSecondary" style={styles.intro}>{error}</ThemedText>}
          {!loading && error === '' && viajes.length === 0 && <ThemedText>No hay viajes registrados todavía.</ThemedText>}
          {viajes.map((viaje) => (
            <ThemedView key={viaje.id} type="backgroundElement" style={styles.destinationCard}>
              <ThemedView style={styles.cardBody}>
                <ThemedText type="smallBold">{viaje.destino}, {viaje.pais}</ThemedText>
                <ThemedText themeColor="textSecondary">{viaje.fecha_inicio} al {viaje.fecha_fin}</ThemedText>
                <ThemedText themeColor="textSecondary" numberOfLines={2}>{viaje.descripcion}</ThemedText>
                <Pressable
                  onPress={() => router.push({ pathname: '/destination/[id]', params: { id: String(viaje.id), source: 'api' } })}
                  style={styles.primaryButton}>
                  <ThemedText type="smallBold" themeColor="text">Ver detalle</ThemedText>
                </Pressable>
              </ThemedView>
            </ThemedView>
          ))}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

function LegacyDiscoverScreen() {
  const theme = useTheme();
  const [savedSlugs, setSavedSlugs] = useState<string[]>([]);
  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(20)).current;
  const profile = useTravelerProfile();
  const activeCountry = getCountryBySlug(profile?.country);

  const toggleSaved = (slug: string) => {
    setSavedSlugs((items) => (items.includes(slug) ? items.filter((item) => item !== slug) : [...items, slug]));
  };

  const savedCount = savedSlugs.length;

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
            <ThemedView type="backgroundElement" style={styles.headerCard}>
              <ThemedText type="subtitle">Explora {activeCountry.name}</ThemedText>
              <ThemedText themeColor="textSecondary" style={styles.intro}>
                {activeCountry.intro}
              </ThemedText>
              <ThemedView type="backgroundSelected" style={styles.summaryChip}>
                <ThemedText type="smallBold">{savedCount} favoritos guardados</ThemedText>
              </ThemedView>
            </ThemedView>
          </Animated.View>

          {activeCountry.destinations.map((place) => {
            const isSaved = savedSlugs.includes(place.slug);
            return (
              <Animated.View key={place.slug} style={{ opacity: fadeIn, transform: [{ translateY: slideUp }] }}>
                <ThemedView type="backgroundElement" style={styles.destinationCard}>
                  <Image source={place.image} style={styles.destinationImage} contentFit="cover" transition={400} />
                  <ThemedView style={styles.cardBody}>
                    <ThemedText type="smallBold">{place.title}</ThemedText>
                    <ThemedText themeColor="textSecondary" style={styles.cardText}>
                      {place.description}
                    </ThemedText>
                    <ThemedView type="backgroundSelected" style={styles.badge}>
                      <ThemedText type="small">{place.location}</ThemedText>
                    </ThemedView>
                    <ThemedView style={styles.actionsRow}>
                      <Pressable
                        onPress={() => toggleSaved(place.slug)}
                        style={({ pressed }) => [
                          styles.secondaryButton,
                          {
                            backgroundColor: isSaved ? theme.backgroundSelected : theme.background,
                            borderColor: theme.textSecondary,
                            opacity: pressed ? 0.85 : 1,
                          },
                        ]}>
                        <ThemedText type="smallBold">{isSaved ? 'Guardado' : 'Guardar'}</ThemedText>
                      </Pressable>

                      <Link href={{ pathname: '/destination/[id]', params: { id: place.slug } }} asChild>
                        <Pressable style={({ pressed }) => [styles.primaryButton, { opacity: pressed ? 0.85 : 1 }]}> 
                          <ThemedText type="smallBold" themeColor="text">
                            Ver detalle
                          </ThemedText>
                        </Pressable>
                      </Link>
                    </ThemedView>
                  </ThemedView>
                </ThemedView>
              </Animated.View>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  safeArea: { flex: 1 },
  content: { padding: Spacing.four, gap: Spacing.three, paddingBottom: Spacing.six },
  headerCard: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.one,
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.08)',
  },
  intro: { lineHeight: 22 },
  summaryChip: { alignSelf: 'flex-start', borderRadius: Spacing.five, paddingHorizontal: Spacing.three, paddingVertical: Spacing.one },
  destinationCard: {
    borderRadius: Spacing.three,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.08)',
  },
  destinationImage: { width: '100%', height: 180 },
  cardBody: { padding: Spacing.three, gap: Spacing.two },
  cardText: { lineHeight: 20 },
  badge: { alignSelf: 'flex-start', borderRadius: Spacing.five, paddingHorizontal: Spacing.two, paddingVertical: Spacing.one },
  actionsRow: { flexDirection: 'row', gap: Spacing.two, marginTop: Spacing.one, flexWrap: 'wrap' },
  primaryButton: {
    backgroundColor: '#0F766E',
    borderRadius: Spacing.five,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    minWidth: 108,
    alignItems: 'center',
  },
  secondaryButton: {
    borderWidth: 1,
    borderRadius: Spacing.five,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    minWidth: 96,
    alignItems: 'center',
  },
});

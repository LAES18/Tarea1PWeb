import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { getCountryBySlug, type Destination } from '@/data/port-destinations';
import { useTheme } from '@/hooks/use-theme';
import { searchCountryPhotos, type PexelsPhoto } from '@/services/pexels-api';
import { useTravelerProfile } from '@/utils/profile-storage';

type RenderDestination = Destination & {
  source: 'local' | 'pexels';
  imageUrl?: string;
};

export default function DiscoverScreen() {
  const theme = useTheme();
  const [savedSlugs, setSavedSlugs] = useState<string[]>([]);
  const [apiDestinations, setApiDestinations] = useState<RenderDestination[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [apiMessage, setApiMessage] = useState<string | null>(null);
  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(20)).current;
  const profile = useTravelerProfile();
  const activeCountry = getCountryBySlug(profile?.country);

  const localDestinations: RenderDestination[] = activeCountry.destinations.map((destination) => ({
    ...destination,
    source: 'local',
  }));

  const visibleDestinations = apiDestinations.length > 0 ? apiDestinations : localDestinations;

  const toggleSaved = (slug: string) => {
    setSavedSlugs((items) => (items.includes(slug) ? items.filter((item) => item !== slug) : [...items, slug]));
  };

  const savedCount = savedSlugs.length;

  const syncFromApi = async () => {
    try {
      setIsSyncing(true);
      setApiMessage(null);
      const photos = await searchCountryPhotos(activeCountry.slug, 10);

      const mapped = activeCountry.destinations.map((destination, index) => {
        const photo: PexelsPhoto | undefined = photos[index % photos.length];
        return {
          ...destination,
          source: 'pexels' as const,
          imageUrl: photo?.src?.large ?? photo?.src?.medium,
        };
      });

      setApiDestinations(mapped);
      setApiMessage(`Sincronizado: ${photos.length} fotos desde Pexels.`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo consumir Pexels.';
      setApiDestinations([]);
      setApiMessage(message);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeIn, { toValue: 1, duration: 650, useNativeDriver: true }),
      Animated.timing(slideUp, { toValue: 0, duration: 650, useNativeDriver: true }),
    ]).start();
  }, [fadeIn, slideUp]);

  useEffect(() => {
    setApiDestinations([]);
    setApiMessage(null);
  }, [activeCountry.slug]);

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
              <Pressable onPress={syncFromApi} style={styles.apiButton}>
                <ThemedText type="smallBold" themeColor="text">
                  {isSyncing ? 'Sincronizando...' : 'Cargar fotos Pexels'}
                </ThemedText>
              </Pressable>
              {apiMessage ? (
                <ThemedText themeColor="textSecondary" style={styles.apiMessage}>
                  {apiMessage}
                </ThemedText>
              ) : null}
            </ThemedView>
          </Animated.View>

          {visibleDestinations.map((place) => {
            const isSaved = savedSlugs.includes(place.slug);
            return (
              <Animated.View key={place.slug} style={{ opacity: fadeIn, transform: [{ translateY: slideUp }] }}>
                <ThemedView type="backgroundElement" style={styles.destinationCard}>
                  <Image
                    source={place.imageUrl ? { uri: place.imageUrl } : place.image}
                    style={styles.destinationImage}
                    contentFit="cover"
                    transition={400}
                  />
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

                      {place.source === 'local' ? (
                        <Link href={{ pathname: '/destination/[id]', params: { id: place.slug } }} asChild>
                          <Pressable style={({ pressed }) => [styles.primaryButton, { opacity: pressed ? 0.85 : 1 }]}> 
                            <ThemedText type="smallBold" themeColor="text">
                              Ver detalle
                            </ThemedText>
                          </Pressable>
                        </Link>
                      ) : (
                        <ThemedView type="backgroundSelected" style={styles.apiChip}>
                          <ThemedText type="small">Foto Pexels</ThemedText>
                        </ThemedView>
                      )}
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
    shadowColor: '#0F172A',
    shadowOpacity: 0.1,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 10 },
    elevation: 3,
  },
  intro: { lineHeight: 22 },
  summaryChip: { alignSelf: 'flex-start', borderRadius: Spacing.five, paddingHorizontal: Spacing.three, paddingVertical: Spacing.one },
  apiButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#0F766E',
    borderRadius: Spacing.five,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    marginTop: Spacing.one,
  },
  apiMessage: {
    lineHeight: 18,
    marginTop: Spacing.one,
  },
  destinationCard: {
    borderRadius: Spacing.three,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.08)',
    shadowColor: '#0F172A',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
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
  apiChip: {
    borderRadius: Spacing.five,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 96,
  },
});

import { Image } from 'expo-image';
import { Link, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { getCountryBySlug } from '@/data/port-destinations';
import { getApiToken, getViaje, searchPhotos, type ApiViaje } from '@/services/travel-api';
import { useTravelerProfile } from '@/utils/profile-storage';

export default function DestinationDetailScreen() {
  const params = useLocalSearchParams<{ id?: string; source?: string }>();
  if (params.source === 'api') {
    return <ApiTripDetailScreen id={Number(params.id)} />;
  }

  return <LocalDestinationDetailScreen id={params.id} />;
}

function ApiTripDetailScreen({ id }: { id: number }) {
  const [viaje, setViaje] = useState<ApiViaje | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!getApiToken()) {
      setError('Necesitas iniciar sesión para consultar este viaje.');
      return;
    }

    getViaje(id)
      .then((result) => {
        setViaje(result);
        if (result.imagen) {
          setImageUrl(result.imagen);
          return;
        }

        return searchPhotos(`${result.destino} ${result.pais}`, 1).then((photos) => {
          setImageUrl(photos.photos[0]?.src.large ?? null);
        });
      })
      .catch((reason: Error) => setError(reason.message));
  }, [id]);

  if (error || !viaje) {
    return (
      <ThemedView style={styles.screen}>
        <SafeAreaView style={styles.safeArea}>
          <ThemedText type="subtitle">{error || 'Cargando viaje...'}</ThemedText>
        </SafeAreaView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.screen}>
      <StatusBar style="auto" />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content}>
          {imageUrl && <Image source={{ uri: imageUrl }} style={styles.heroImage} contentFit="cover" />}
          <ThemedView type="backgroundElement" style={styles.card}>
            <ThemedText type="subtitle">{viaje.destino}</ThemedText>
            <ThemedText themeColor="textSecondary">{viaje.pais} · {viaje.estado}</ThemedText>
            <ThemedText style={styles.description}>{viaje.descripcion}</ThemedText>
            <ThemedText themeColor="textSecondary">Del {viaje.fecha_inicio} al {viaje.fecha_fin}</ThemedText>
          </ThemedView>
          <Link href="/explore" asChild>
            <Pressable style={styles.backButton}>
              <ThemedText type="smallBold">Volver a mis viajes</ThemedText>
            </Pressable>
          </Link>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

function LocalDestinationDetailScreen({ id }: { id?: string }) {
  const profile = useTravelerProfile();
  const activeCountry = getCountryBySlug(profile?.country);
  const destination = activeCountry.destinations.find((item) => item.slug === id);
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

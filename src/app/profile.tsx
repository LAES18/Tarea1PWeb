import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { countries, getCountryBySlug } from '@/data/port-destinations';
import { loginAndStoreToken, registerAndStoreToken } from '@/services/travel-api';
import { saveTravelerProfile, useTravelerProfile } from '@/utils/profile-storage';

const stats = [
  { label: 'Lugares', value: '12' },
  { label: 'Fotos', value: '84' },
  { label: 'Metas', value: '5' },
];

const preferences = ['Playas', 'Cultura', 'Fotografía', 'Gastronomía'];

export default function ProfileScreen() {
  const [notificationsOn, setNotificationsOn] = useState(true);
  const profile = useTravelerProfile();
  const [name, setName] = useState(profile?.name ?? '');
  const [age, setAge] = useState(profile?.age ?? '');
  const [countrySlug, setCountrySlug] = useState(profile?.country ?? 'japan');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authMessage, setAuthMessage] = useState('');

  const activeCountry = getCountryBySlug(countrySlug);

  const persistProfile = (nextCountrySlug: string) => {
    const nextProfile = {
      name: name.trim() || profile?.name || 'Viajero',
      age: age.trim() || profile?.age || '18',
      destination: getCountryBySlug(nextCountrySlug).name,
      country: nextCountrySlug,
      updatedAt: new Date().toISOString(),
    };

    saveTravelerProfile(nextProfile);
  };

  const handleSave = () => {
    persistProfile(countrySlug);
  };

  const handleCountrySelect = (nextCountrySlug: string) => {
    setCountrySlug(nextCountrySlug);
    persistProfile(nextCountrySlug);
  };

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setAuthMessage('Escribe tu correo y contraseña.');
      return;
    }

    try {
      await loginAndStoreToken(email.trim(), password);
      setAuthMessage('Sesión iniciada. Ya puedes consultar tus viajes.');
    } catch (error) {
      setAuthMessage(error instanceof Error ? error.message : 'No se pudo iniciar sesión.');
    }
  };

  const handleRegister = async () => {
    if (!name.trim()) {
      setAuthMessage('Escribe tu nombre para crear la cuenta.');
      return;
    }
    if (!email.trim()) {
      setAuthMessage('Escribe un correo electrónico.');
      return;
    }
    if (password.length < 8) {
      setAuthMessage('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    try {
      await registerAndStoreToken(name.trim(), email.trim(), password);
      setAuthMessage('Cuenta creada y sesión iniciada. Ya puedes consultar tus viajes.');
    } catch (error) {
      setAuthMessage(error instanceof Error ? error.message : 'No se pudo crear la cuenta.');
    }
  };

  return (
    <ThemedView style={styles.screen}>
      <StatusBar style="auto" />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content}>
          <ThemedView type="backgroundElement" style={styles.profileCard}>
            <Image source={activeCountry.heroImage} style={styles.avatar} contentFit="cover" transition={400} />
            <ThemedText type="subtitle">{profile?.name ?? 'Tu perfil'}</ThemedText>
            <ThemedText themeColor="textSecondary" style={styles.bio}>
              {profile ? `Listo para viajar a ${profile.destination} con ${profile.age} años.` : 'Regístrate para que tu experiencia se recuerde cada vez que abras la app.'}
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.statsRow}>
            {stats.map((item) => (
              <ThemedView key={item.label} type="backgroundElement" style={styles.statCard}>
                <ThemedText type="smallBold">{item.value}</ThemedText>
                <ThemedText themeColor="textSecondary">{item.label}</ThemedText>
              </ThemedView>
            ))}
          </ThemedView>

          <ThemedView type="backgroundElement" style={styles.preferenceCard}>
            <ThemedText type="smallBold">Registro de viajero</ThemedText>
            <ThemedText themeColor="textSecondary" style={styles.cardText}>
              Elige el país que quieres visitar y guarda tu perfil para que el resto de la app se adapte.
            </ThemedText>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Tu nombre"
              style={styles.input}
              placeholderTextColor="#8DA2B8"
              autoCapitalize="words"
              autoCorrect={false}
              returnKeyType="done"
              blurOnSubmit
            />
            <TextInput
              value={age}
              onChangeText={setAge}
              placeholder="Tu edad"
              keyboardType="number-pad"
              style={styles.input}
              placeholderTextColor="#8DA2B8"
              maxLength={2}
              returnKeyType="done"
              blurOnSubmit
            />
            <ThemedText type="smallBold">Elige tu país</ThemedText>
            <ThemedView style={styles.destinationRow}>
              {countries.map((country) => {
                const active = countrySlug === country.slug;
                return (
                  <Pressable key={country.slug} onPress={() => handleCountrySelect(country.slug)} style={[styles.optionChip, active && styles.optionChipActive]}>
                    <ThemedText type="smallBold" themeColor={active ? 'text' : 'textSecondary'}>{country.name}</ThemedText>
                  </Pressable>
                );
              })}
            </ThemedView>
            <ThemedText themeColor="textSecondary" style={styles.cardText}>
              {activeCountry.intro}
            </ThemedText>
            <Pressable onPress={handleSave} style={styles.saveButton}>
              <ThemedText type="smallBold" themeColor="text">
                Guardar perfil
              </ThemedText>
            </Pressable>
          </ThemedView>

          <ThemedView type="backgroundElement" style={styles.preferenceCard}>
            <ThemedText type="smallBold">Acceso a la API</ThemedText>
            <ThemedText themeColor="textSecondary" style={styles.cardText}>
              Inicia sesión para generar el token que protege tus viajes.
            </ThemedText>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Correo electrónico"
              style={styles.input}
              placeholderTextColor="#8DA2B8"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Contraseña"
              style={styles.input}
              placeholderTextColor="#8DA2B8"
              secureTextEntry
            />
            <Pressable onPress={handleLogin} style={styles.saveButton}>
              <ThemedText type="smallBold" themeColor="text">Iniciar sesión</ThemedText>
            </Pressable>
            <Pressable onPress={handleRegister} style={styles.registerButton}>
              <ThemedText type="smallBold">Crear cuenta</ThemedText>
            </Pressable>
            {authMessage !== '' && <ThemedText themeColor="textSecondary">{authMessage}</ThemedText>}
          </ThemedView>

          <ThemedView type="backgroundElement" style={styles.preferenceCard}>
            <ThemedText type="smallBold">Preferencias</ThemedText>
            <ThemedView style={styles.chipRow}>
              {preferences.map((item) => (
                <ThemedView key={item} type="backgroundSelected" style={styles.chip}>
                  <ThemedText type="small">{item}</ThemedText>
                </ThemedView>
              ))}
            </ThemedView>
          </ThemedView>

          <ThemedView type="backgroundElement" style={styles.preferenceCard}>
            <ThemedView style={styles.rowBetween}>
              <ThemedText type="smallBold">Recordatorios</ThemedText>
              <Switch value={notificationsOn} onValueChange={setNotificationsOn} />
            </ThemedView>
            <ThemedText themeColor="textSecondary" style={styles.cardText}>
              Recibe alertas cuando se acerque el día del viaje o tus actividades favoritas.
            </ThemedText>
          </ThemedView>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  safeArea: { flex: 1 },
  content: { padding: Spacing.four, gap: Spacing.three, paddingBottom: Spacing.six },
  profileCard: {
    borderRadius: Spacing.three,
    padding: Spacing.four,
    alignItems: 'center',
    gap: Spacing.two,
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.08)',
    shadowColor: '#0F172A',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  bio: { textAlign: 'center', lineHeight: 22 },
  statsRow: { flexDirection: 'row', gap: Spacing.two },
  statCard: {
    flex: 1,
    borderRadius: Spacing.three,
    padding: Spacing.three,
    alignItems: 'center',
    gap: Spacing.one,
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.08)',
    shadowColor: '#0F172A',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  preferenceCard: {
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
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.one },
  chip: { borderRadius: Spacing.five, paddingHorizontal: Spacing.two, paddingVertical: Spacing.one },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardText: { lineHeight: 20 },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.12)',
    borderRadius: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    backgroundColor: 'rgba(255,255,255,0.75)',
    minHeight: 46,
  },
  destinationRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.one },
  optionChip: {
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.12)',
    borderRadius: Spacing.five,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
  },
  optionChipActive: {
    backgroundColor: '#0F766E',
    borderColor: '#0F766E',
  },
  saveButton: {
    backgroundColor: '#0F766E',
    borderRadius: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    alignItems: 'center',
  },
  registerButton: {
    borderWidth: 1,
    borderColor: '#0F766E',
    borderRadius: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    alignItems: 'center',
  },
});

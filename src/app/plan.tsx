import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { SymbolView } from 'expo-symbols';
import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { getCountryBySlug } from '@/data/port-destinations';
import { createViaje, deleteViaje, getApiToken, listViajes, updateViaje, type ApiViaje } from '@/services/travel-api';
import { useTravelerProfile } from '@/utils/profile-storage';

const initialChecklist = [
  { id: 1, label: 'Pasaporte y documentos', done: true },
  { id: 2, label: 'Cámara y cargador', done: false },
  { id: 3, label: 'Ropa ligera para 3 días', done: false },
  { id: 4, label: 'Botella reutilizable', done: true },
];

export default function PlanScreen() {
  return <ApiTripsManager />;
}

function ApiTripsManager() {
  const [viajes, setViajes] = useState<ApiViaje[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [destino, setDestino] = useState('');
  const [pais, setPais] = useState('');
  const [inicio, setInicio] = useState('2026-10-01');
  const [fin, setFin] = useState('2026-10-05');
  const [descripcion, setDescripcion] = useState('');
  const [estado, setEstado] = useState<ApiViaje['estado']>('planeado');
  const [message, setMessage] = useState('');

  const loadTrips = () => listViajes().then(setViajes).catch((error: Error) => setMessage(error.message));

  useEffect(() => {
    if (getApiToken()) {
      loadTrips();
    } else {
      setMessage('Inicia sesión desde Perfil para administrar tus viajes.');
    }
  }, []);

  const clearForm = () => {
    setEditingId(null);
    setDestino('');
    setPais('');
    setDescripcion('');
    setEstado('planeado');
  };

  const saveTrip = async () => {
    try {
      const payload = { destino, pais, fecha_inicio: inicio, fecha_fin: fin, descripcion, estado };
      if (editingId) {
        await updateViaje(editingId, payload);
        setMessage('Viaje actualizado correctamente.');
      } else {
        await createViaje(payload);
        setMessage('Viaje creado correctamente.');
      }
      clearForm();
      await loadTrips();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo guardar el viaje.');
    }
  };

  const startEditing = (viaje: ApiViaje) => {
    setEditingId(viaje.id);
    setDestino(viaje.destino);
    setPais(viaje.pais);
    setInicio(viaje.fecha_inicio);
    setFin(viaje.fecha_fin);
    setDescripcion(viaje.descripcion);
    setEstado(viaje.estado);
  };

  const removeTrip = async (id: number) => {
    try {
      await deleteViaje(id);
      setViajes((items) => items.filter((item) => item.id !== id));
      setMessage('Viaje eliminado correctamente.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo eliminar el viaje.');
    }
  };

  return (
    <ThemedView style={styles.screen}>
      <StatusBar style="auto" />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content}>
          <ThemedText type="subtitle">Administrar viajes</ThemedText>
          <ThemedText themeColor="textSecondary">CRUD conectado a Laravel mediante token.</ThemedText>
          <ThemedView type="backgroundElement" style={styles.formCard}>
            <ThemedText type="smallBold">{editingId ? 'Editar viaje' : 'Nuevo viaje'}</ThemedText>
            {[['Destino', destino, setDestino], ['País', pais, setPais], ['Fecha inicio (AAAA-MM-DD)', inicio, setInicio], ['Fecha fin (AAAA-MM-DD)', fin, setFin], ['Descripción', descripcion, setDescripcion]].map(([placeholder, value, setter]) => (
              <TextInput key={placeholder as string} value={value as string} onChangeText={setter as (value: string) => void} placeholder={placeholder as string} placeholderTextColor="#8DA2B8" style={styles.input} />
            ))}
            <ThemedText type="smallBold">Estado: {estado}</ThemedText>
            <ThemedView style={styles.statusRow}>
              {(['planeado', 'en curso', 'completado'] as const).map((value) => (
                <Pressable key={value} onPress={() => setEstado(value)} style={[styles.statusButton, estado === value && styles.statusButtonActive]}>
                  <ThemedText type="small">{value}</ThemedText>
                </Pressable>
              ))}
            </ThemedView>
            <Pressable onPress={saveTrip} style={styles.saveButton}><ThemedText type="smallBold" themeColor="text">{editingId ? 'Actualizar viaje' : 'Crear viaje'}</ThemedText></Pressable>
            {editingId && <Pressable onPress={clearForm}><ThemedText themeColor="textSecondary">Cancelar edición</ThemedText></Pressable>}
            {message !== '' && <ThemedText themeColor="textSecondary">{message}</ThemedText>}
          </ThemedView>
          {viajes.map((viaje) => (
            <ThemedView key={viaje.id} type="backgroundElement" style={styles.tripCard}>
              <ThemedText type="smallBold">{viaje.destino}, {viaje.pais}</ThemedText>
              <ThemedText themeColor="textSecondary">{viaje.estado} · {viaje.fecha_inicio} al {viaje.fecha_fin}</ThemedText>
              <ThemedView style={styles.actionsRow}>
                <Pressable onPress={() => startEditing(viaje)} style={styles.secondaryButton}><ThemedText type="smallBold">Editar</ThemedText></Pressable>
                <Pressable onPress={() => removeTrip(viaje.id)} style={styles.deleteButton}><ThemedText type="smallBold" themeColor="text">Eliminar</ThemedText></Pressable>
              </ThemedView>
            </ThemedView>
          ))}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

function LegacyPlanScreen() {
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
  formCard: { padding: Spacing.three, gap: Spacing.two, borderRadius: Spacing.three, borderWidth: 1, borderColor: 'rgba(15, 23, 42, 0.08)' },
  input: { minHeight: 46, borderWidth: 1, borderColor: 'rgba(15, 23, 42, 0.12)', borderRadius: Spacing.two, paddingHorizontal: Spacing.three, paddingVertical: Spacing.two, backgroundColor: 'rgba(255,255,255,0.75)' },
  statusRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.one },
  statusButton: { borderWidth: 1, borderColor: 'rgba(15, 23, 42, 0.12)', borderRadius: Spacing.two, paddingHorizontal: Spacing.two, paddingVertical: Spacing.one },
  statusButtonActive: { backgroundColor: '#A7F3D0', borderColor: '#0F766E' },
  saveButton: { backgroundColor: '#0F766E', borderRadius: Spacing.two, paddingHorizontal: Spacing.three, paddingVertical: Spacing.two, alignItems: 'center' },
  tripCard: { padding: Spacing.three, gap: Spacing.two, borderRadius: Spacing.three, borderWidth: 1, borderColor: 'rgba(15, 23, 42, 0.08)' },
  actionsRow: { flexDirection: 'row', gap: Spacing.two },
  secondaryButton: { borderWidth: 1, borderColor: '#0F766E', borderRadius: Spacing.two, paddingHorizontal: Spacing.three, paddingVertical: Spacing.two },
  deleteButton: { backgroundColor: '#DC2626', borderRadius: Spacing.two, paddingHorizontal: Spacing.three, paddingVertical: Spacing.two },
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

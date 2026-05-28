import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { apiGet } from '../services/api';

type ShowItem = {
  id: number;
  data: string;
  artista?: { nome?: string };
  casaDeShow?: { nome?: string; cidade?: string; uf?: string };
};

const fallbackEvents = [
  {
    status: 'CONFIRMADO',
    title: 'Sem shows carregados',
    datetime: '-',
    location: '-',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
    statusColor: '#228be6',
  },
];

export default function HomeScreen(): React.JSX.Element {
  const [shows, setShows] = useState<ShowItem[]>([]);

  useEffect(() => {
    async function load(): Promise<void> {
      try {
        const data = await apiGet<ShowItem[]>('/shows');
        setShows(data);
      } catch {
        setShows([]);
      }
    }
    load();
  }, []);

  const stats = useMemo(
    () => [
      { label: 'Shows', value: String(shows.length), icon: '??', color: '#22c58b' },
      {
        label: 'Artistas',
        value: String(new Set(shows.map((s) => s.artista?.nome).filter(Boolean)).size),
        icon: '??',
        color: '#0b6aef',
      },
      { label: 'Patrocinadores', value: '-', icon: '??', color: '#15aabf' },
      {
        label: 'Espaços',
        value: String(new Set(shows.map((s) => s.casaDeShow?.nome).filter(Boolean)).size),
        icon: '??',
        color: '#ff8c00',
      },
    ],
    [shows]
  );

  const events =
    shows.length > 0
      ? shows.map((show) => ({
          status: 'CONFIRMADO',
          title: show.artista?.nome ? `Show: ${show.artista.nome}` : `Show #${show.id}`,
          datetime: show.data || '-',
          location: show.casaDeShow?.nome
            ? `${show.casaDeShow.nome}, ${show.casaDeShow.cidade || ''}/${show.casaDeShow.uf || ''}`
            : '-',
          image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
          statusColor: '#228be6',
        }))
      : fallbackEvents;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSubtitle}>Olá, Gestor</Text>
          <Text style={styles.headerTitle}>Gestão de Eventos</Text>
        </View>
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>G</Text>
        </View>
      </View>

      <View style={styles.statsGrid}>
        {stats.map((item) => (
          <View key={item.label} style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: item.color + '22' }]}>
              <Text style={[styles.statIconText, { color: item.color }]}>{item.icon}</Text>
            </View>
            <Text style={styles.statValue}>{item.value}</Text>
            <Text style={styles.statLabel}>{item.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Próximos Shows</Text>
        <TouchableOpacity>
          <Text style={styles.sectionAction}>Ver todos</Text>
        </TouchableOpacity>
      </View>

      {events.map((event) => (
        <View key={`${event.title}-${event.datetime}`} style={styles.eventCard}>
          <Image source={typeof event.image === 'string' ? { uri: event.image } : event.image} style={styles.eventImage} />
          <View style={styles.eventBody}>
            <View style={[styles.eventBadge, { backgroundColor: event.statusColor + '16' }]}>
              <Text style={[styles.eventBadgeText, { color: event.statusColor }]}>{event.status}</Text>
            </View>
            <Text style={styles.eventTitle}>{event.title}</Text>
            <Text style={styles.eventMeta}>{event.datetime}</Text>
            <Text style={styles.eventMeta}>{event.location}</Text>
          </View>
          <View style={styles.eventActionButton}>
            <Text style={styles.eventActionIcon}>›</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f7f8fb' },
  content: { paddingHorizontal: 16, paddingTop: 32, paddingBottom: 24 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  headerSubtitle: { color: '#6c757d', fontSize: 15, marginBottom: 4 },
  headerTitle: { color: '#151821', fontSize: 28, fontWeight: '700' },
  avatarPlaceholder: { width: 48, height: 48, borderRadius: 16, backgroundColor: '#e9ecef', justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 20, fontWeight: '700', color: '#343a40' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 24 },
  statCard: { width: '48%', backgroundColor: '#ffffff', borderRadius: 20, padding: 18, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 12, elevation: 3 },
  statIcon: { width: 42, height: 42, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  statIconText: { fontSize: 20 },
  statValue: { fontSize: 28, fontWeight: '700', color: '#151821' },
  statLabel: { marginTop: 6, fontSize: 14, color: '#6c757d' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#151821' },
  sectionAction: { fontSize: 14, color: '#22c58b', fontWeight: '600' },
  eventCard: { backgroundColor: '#ffffff', borderRadius: 24, overflow: 'hidden', marginBottom: 18, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 5 },
  eventImage: { width: '100%', height: 160 },
  eventBody: { padding: 16 },
  eventBadge: { alignSelf: 'flex-start', borderRadius: 999, paddingVertical: 6, paddingHorizontal: 12, marginBottom: 12 },
  eventBadgeText: { fontSize: 12, fontWeight: '700' },
  eventTitle: { fontSize: 18, fontWeight: '700', color: '#151821', marginBottom: 8 },
  eventMeta: { fontSize: 14, color: '#6c757d', marginBottom: 4 },
  eventActionButton: { position: 'absolute', right: 16, top: 140, width: 42, height: 42, borderRadius: 21, backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.12, shadowRadius: 8, elevation: 4 },
  eventActionIcon: { fontSize: 24, color: '#151821' },
});

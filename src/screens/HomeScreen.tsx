import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { apiGet } from '../services/api';
import { Handshake, MapPin, Music2, UserRound } from 'lucide-react-native';

type ShowItem = {
  id: number;
  data: string;
  artistaId?: number;
  casaDeShowId?: number;
  patrocinadores?: Array<{
    id: number;
    patrocinadorId: number;
    patrocinadorNome: string;
    valorPatrocinado: number;
  }>;
  veiculosImprensaIds?: number[];
};

type CatalogItem = {
  id: number;
  nome?: string;
  cidade?: string;
  uf?: string;
  razaoSocial?: string;
  tipo?: string;
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
  const [artistasCount, setArtistasCount] = useState(0);
  const [patrocinadoresCount, setPatrocinadoresCount] = useState(0);
  const [espacosCount, setEspacosCount] = useState(0);
  const [artistasById, setArtistasById] = useState<Record<number, CatalogItem>>({});
  const [espacosById, setEspacosById] = useState<Record<number, CatalogItem>>({});
  const [veiculosById, setVeiculosById] = useState<Record<number, CatalogItem>>({});

  useEffect(() => {
    async function load(): Promise<void> {
      const [showsData, artistasData, patrocinadoresData, espacosData] = await Promise.allSettled([
        apiGet<ShowItem[]>('/shows'),
        apiGet<CatalogItem[]>('/artistas'),
        apiGet<CatalogItem[]>('/veiculos-imprensa'),
        apiGet<CatalogItem[]>('/casas-de-show'),
      ]);

      setShows(showsData.status === 'fulfilled' ? showsData.value : []);
      if (artistasData.status === 'fulfilled') {
        setArtistasCount(artistasData.value.length);
        setArtistasById(Object.fromEntries(artistasData.value.map((item) => [item.id, item])));
      } else {
        setArtistasCount(0);
        setArtistasById({});
      }

      if (patrocinadoresData.status === 'fulfilled') {
        setPatrocinadoresCount(patrocinadoresData.value.length);
        setVeiculosById(Object.fromEntries(patrocinadoresData.value.map((item) => [item.id, item])));
      } else {
        setPatrocinadoresCount(0);
        setVeiculosById({});
      }

      if (espacosData.status === 'fulfilled') {
        setEspacosCount(espacosData.value.length);
        setEspacosById(Object.fromEntries(espacosData.value.map((item) => [item.id, item])));
      } else {
        setEspacosCount(0);
        setEspacosById({});
      }
    }

    load();
  }, []);

  const stats = useMemo(
    () => [
      { label: 'Shows', value: String(shows.length), icon: Music2, color: '#22c58b' },
      { label: 'Artistas', value: String(artistasCount), icon: UserRound, color: '#0b6aef' },
      { label: 'Patrocinadores', value: String(patrocinadoresCount), icon: Handshake, color: '#15aabf' },
      { label: 'Espaços', value: String(espacosCount), icon: MapPin, color: '#ff8c00' },
    ],
    [shows.length, artistasCount, patrocinadoresCount, espacosCount, artistasById, espacosById, veiculosById]
  );

  const events =
    shows.length > 0
      ? shows.map((show) => ({
          status: 'CONFIRMADO',
          title: artistasById[show.artistaId ?? 0]?.nome ? `Show: ${artistasById[show.artistaId ?? 0].nome}` : `Show #${show.id}`,
          datetime: show.data || '-',
          location: espacosById[show.casaDeShowId ?? 0]?.nome
            ? `${espacosById[show.casaDeShowId ?? 0].nome}, ${espacosById[show.casaDeShowId ?? 0].cidade || ''}/${espacosById[show.casaDeShowId ?? 0].uf || ''}`
            : '-',
          image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
          statusColor: '#228be6',
          artistName: artistasById[show.artistaId ?? 0]?.nome ?? 'Artista não encontrado',
          venueName: espacosById[show.casaDeShowId ?? 0]?.nome ?? 'Espaço não encontrado',
          sponsors: (show.patrocinadores ?? []).map((sponsor) => sponsor.patrocinadorNome),
          press: (show.veiculosImprensaIds ?? []).map((id) => veiculosById[id]?.razaoSocial ?? `Veículo #${id}`),
        }))
      : fallbackEvents;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Visão geral</Text>
        </View>
      </View>

      <View style={styles.statsGrid}>
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <View key={item.label} style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: item.color + '22' }]}>
                <Icon size={20} color={item.color} />
              </View>
              <Text style={styles.statValue}>{item.value}</Text>
              <Text style={styles.statLabel}>{item.label}</Text>
            </View>
          );
        })}
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
            {'artistName' in event ? <Text style={styles.eventDetail}>Artista: {event.artistName}</Text> : null}
            {'venueName' in event ? <Text style={styles.eventDetail}>Espaço: {event.venueName}</Text> : null}
            {'sponsors' in event && event.sponsors.length > 0 ? (
              <Text style={styles.eventDetail}>Patrocinadores: {event.sponsors.join(', ')}</Text>
            ) : null}
            {'press' in event && event.press.length > 0 ? <Text style={styles.eventDetail}>Imprensa: {event.press.join(', ')}</Text> : null}
          </View>
          <View style={styles.eventActionButton}>
            <Text style={styles.eventActionIcon}></Text>
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
  eventDetail: { fontSize: 13, color: '#3f4654', marginTop: 4 },
  eventActionButton: { position: 'absolute', right: 16, top: 140, width: 42, height: 42, borderRadius: 21, backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.12, shadowRadius: 8, elevation: 4 },
  eventActionIcon: { fontSize: 24, color: '#151821' },
});

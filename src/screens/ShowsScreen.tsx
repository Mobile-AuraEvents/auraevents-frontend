import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Bell,
  Calendar,
  MapPin,
  Mic2,
  Plus,
  Save,
  Search,
  X,
} from 'lucide-react-native';

import { apiGet, apiPost, apiPut } from '../services/api';
import { Artista } from '../services/entities';

type ShowApi = {
  id: number;
  data?: string;
  artistaId?: number;
  casaDeShowId?: number;
  patrocinadores?: Array<{
    id: number;
    patrocinadorId: number;
    patrocinadorNome?: string;
    valorPatrocinado?: number;
  }>;
  veiculosImprensaIds?: number[];
};

type Casa = {
  id: number;
  nome: string;
  cidade?: string;
  uf?: string;
  fotoUrl?: string;
};

type ShowForm = {
  data: string;
  artistaId: string;
  casaDeShowId: string;
};

const initialForm: ShowForm = {
  data: '',
  artistaId: '',
  casaDeShowId: '',
};

const fallbackImages = [
  'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=900',
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=900',
  'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=900',
  'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=900',
];

export default function ShowsScreen(): React.JSX.Element {
  const [items, setItems] = useState<ShowApi[]>([]);
  const [artists, setArtists] = useState<Artista[]>([]);
  const [venues, setVenues] = useState<Casa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ShowForm>(initialForm);

  async function load(): Promise<void> {
    try {
      setLoading(true);
      const [showsResponse, artistsResponse, venuesResponse] = await Promise.all([
        apiGet<ShowApi[]>('/shows'),
        apiGet<Artista[]>('/artistas'),
        apiGet<Casa[]>('/casas-de-show'),
      ]);

      setItems(showsResponse);
      setArtists(artistsResponse);
      setVenues(venuesResponse);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar shows.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const artistsById = useMemo(() => {
    const map = new Map<number, Artista>();
    artists.forEach((artist) => map.set(artist.id, artist));
    return map;
  }, [artists]);

  const venuesById = useMemo(() => {
    const map = new Map<number, Casa>();
    venues.forEach((venue) => map.set(venue.id, venue));
    return map;
  }, [venues]);

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return items;

    return items.filter((item) => {
      const artist = item.artistaId ? artistsById.get(item.artistaId) : undefined;
      const venue = item.casaDeShowId ? venuesById.get(item.casaDeShowId) : undefined;
      const sponsors = item.patrocinadores?.map((sponsor) => sponsor.patrocinadorNome).join(' ') || '';

      return [artist?.nome, venue?.nome, venue?.cidade, venue?.uf, item.data, sponsors]
        .filter((field): field is string => Boolean(field))
        .some((field) => field.toLowerCase().includes(normalizedQuery));
    });
  }, [artistsById, items, query, venuesById]);

  function formatDisplayDate(value?: string): string {
    if (!value) return 'Data nao definida';
    const [year, month, day] = value.split('-');
    if (!year || !month || !day) return value;
    return `${day} ${getMonthName(month)}, ${year}`;
  }

  function getMonthName(month: string): string {
    const months: Record<string, string> = {
      '01': 'JAN',
      '02': 'FEV',
      '03': 'MAR',
      '04': 'ABR',
      '05': 'MAI',
      '06': 'JUN',
      '07': 'JUL',
      '08': 'AGO',
      '09': 'SET',
      '10': 'OUT',
      '11': 'NOV',
      '12': 'DEZ',
    };

    return months[month] || month;
  }

  function formatDateInput(value: string): string {
    return value.replace(/[^\d-]/g, '').slice(0, 10);
  }

  function getStatus(index: number): { label: string; style: object; textStyle: object } {
    if (index % 2 === 0) {
      return { label: 'Confirmado', style: styles.confirmedBadge, textStyle: styles.confirmedBadgeText };
    }
    return { label: 'Em negociacao', style: styles.pendingBadge, textStyle: styles.pendingBadgeText };
  }

  function openCreate(): void {
    setEditingId(null);
    setForm({
      ...initialForm,
      artistaId: artists[0] ? String(artists[0].id) : '',
      casaDeShowId: venues[0] ? String(venues[0].id) : '',
    });
    setModalVisible(true);
  }

  function openEdit(item: ShowApi): void {
    setEditingId(item.id);
    setForm({
      data: item.data || '',
      artistaId: item.artistaId ? String(item.artistaId) : '',
      casaDeShowId: item.casaDeShowId ? String(item.casaDeShowId) : '',
    });
    setModalVisible(true);
  }

  async function handleSubmit(): Promise<void> {
    if (!form.data.trim() || !form.artistaId || !form.casaDeShowId) return;

    setSaving(true);
    try {
      const payload = {
        id: editingId,
        data: form.data.trim(),
        artistaId: Number(form.artistaId),
        casaDeShowId: Number(form.casaDeShowId),
        patrocinadores: [],
        veiculosImprensaIds: [],
      };

      if (editingId) {
        await apiPut<ShowApi, typeof payload>(`/shows/${editingId}`, payload);
      } else {
        await apiPost<ShowApi, typeof payload>('/shows', payload);
      }

      setModalVisible(false);
      setEditingId(null);
      setForm(initialForm);
      await load();
    } finally {
      setSaving(false);
    }
  }

  function renderCard({ item, index }: { item: ShowApi; index: number }): React.JSX.Element {
    const artist = item.artistaId ? artistsById.get(item.artistaId) : undefined;
    const venue = item.casaDeShowId ? venuesById.get(item.casaDeShowId) : undefined;
    const status = getStatus(index);
    const sponsorCount = item.patrocinadores?.length || 0;
    const pressCount = item.veiculosImprensaIds?.length || 0;
    const image = venue?.fotoUrl || fallbackImages[index % fallbackImages.length];

    return (
      <TouchableOpacity activeOpacity={0.86} style={styles.card} onPress={() => openEdit(item)}>
        <View style={styles.imageWrap}>
          <Image source={{ uri: image }} style={styles.image} />
          <View style={[styles.statusBadge, status.style]}>
            <Text style={[styles.statusText, status.textStyle]}>{status.label}</Text>
          </View>
        </View>

        <View style={styles.cardBody}>
          <View style={styles.titleRow}>
            <Text style={styles.showTitle} numberOfLines={2}>
              {artist?.nome || 'Artista nao informado'}
            </Text>
            <View style={styles.dateBlock}>
              <Calendar size={15} color="#20242c" />
              <Text style={styles.dateText}>{formatDisplayDate(item.data)}</Text>
            </View>
          </View>

          <View style={styles.locationRow}>
            <MapPin size={17} color="#087a4b" />
            <Text style={styles.locationText} numberOfLines={1}>
              {venue?.nome || 'Espaco nao informado'}
            </Text>
          </View>

          <View style={styles.tagsRow}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>#{venue?.cidade || 'Evento'}</Text>
            </View>
            {venue?.uf ? (
              <View style={styles.tag}>
                <Text style={styles.tagText}>#{venue.uf}</Text>
              </View>
            ) : null}
            {sponsorCount > 0 ? (
              <View style={styles.neutralTag}>
                <Text style={styles.neutralTagText}>+ {sponsorCount} patrocinadores</Text>
              </View>
            ) : null}
            {pressCount > 0 ? (
              <View style={styles.neutralTag}>
                <Text style={styles.neutralTagText}>+ {pressCount} imprensa</Text>
              </View>
            ) : null}
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>

      <FlatList
        data={filteredItems}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderCard}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.intro}>
            <Text style={styles.screenTitle}>Proximos Shows</Text>
            <Text style={styles.subtitle}>Gerencie o line-up e parcerias da temporada.</Text>

            <View style={styles.searchBox}>
              <Search size={21} color="#6f7480" strokeWidth={2.3} />
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar show, artista ou espaco"
                placeholderTextColor="#6f7480"
                value={query}
                onChangeText={setQuery}
              />
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            {loading ? (
              <ActivityIndicator color="#12b886" size="large" />
            ) : (
              <>
                <Text style={styles.emptyTitle}>{error ? 'Nao foi possivel carregar' : 'Nenhum show encontrado'}</Text>
                <Text style={styles.emptyText}>
                  {error || 'Cadastre um show ou ajuste a busca para ver os cards aqui.'}
                </Text>
              </>
            )}
          </View>
        }
      />

      <TouchableOpacity activeOpacity={0.86} style={styles.fab} onPress={openCreate}>
        <Plus size={31} color="#ffffff" strokeWidth={2.4} />
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{editingId ? 'Editar show' : 'Novo show'}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} hitSlop={10}>
                <X size={24} color="#292c34" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Data (AAAA-MM-DD)"
              placeholderTextColor="#777b84"
              value={form.data}
              maxLength={10}
              onChangeText={(v) => setForm((f) => ({ ...f, data: formatDateInput(v) }))}
            />

            <Text style={styles.fieldLabel}>Artista</Text>
            <FlatList
              horizontal
              data={artists}
              keyExtractor={(item) => String(item.id)}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.optionList}
              renderItem={({ item }) => {
                const selected = form.artistaId === String(item.id);
                return (
                  <TouchableOpacity
                    style={[styles.optionChip, selected && styles.optionChipActive]}
                    onPress={() => setForm((f) => ({ ...f, artistaId: String(item.id) }))}
                  >
                    <Text style={[styles.optionText, selected && styles.optionTextActive]}>{item.nome}</Text>
                  </TouchableOpacity>
                );
              }}
            />

            <Text style={styles.fieldLabel}>Espaco</Text>
            <FlatList
              horizontal
              data={venues}
              keyExtractor={(item) => String(item.id)}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.optionList}
              renderItem={({ item }) => {
                const selected = form.casaDeShowId === String(item.id);
                return (
                  <TouchableOpacity
                    style={[styles.optionChip, selected && styles.optionChipActive]}
                    onPress={() => setForm((f) => ({ ...f, casaDeShowId: String(item.id) }))}
                  >
                    <Text style={[styles.optionText, selected && styles.optionTextActive]}>{item.nome}</Text>
                  </TouchableOpacity>
                );
              }}
            />

            <TouchableOpacity style={[styles.saveButton, saving && styles.saveButtonDisabled]} onPress={handleSubmit} disabled={saving}>
              <Save size={20} color="#ffffff" />
              <Text style={styles.saveButtonText}>{saving ? 'Salvando...' : 'Salvar'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e7e9ee',
    backgroundColor: '#ffffff',
  },
  headerAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1f2933',
  },
  headerTitle: {
    flex: 1,
    color: '#050506',
    fontSize: 17,
    fontWeight: '800',
  },
  bellButton: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingBottom: 104,
  },
  intro: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 12,
  },
  screenTitle: {
    color: '#050506',
    fontSize: 28,
    fontWeight: '900',
    marginBottom: 6,
  },
  subtitle: {
    color: '#2e313a',
    fontSize: 16,
    lineHeight: 23,
    marginBottom: 18,
  },
  searchBox: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#d6d9df',
    borderRadius: 26,
    backgroundColor: '#ffffff',
  },
  searchInput: {
    flex: 1,
    minWidth: 0,
    color: '#20232b',
    fontSize: 15,
  },
  card: {
    marginHorizontal: 18,
    marginBottom: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e1e4e9',
    borderRadius: 24,
    backgroundColor: '#ffffff',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 7,
    elevation: 2,
  },
  imageWrap: {
    position: 'relative',
    height: 150,
    overflow: 'hidden',
    borderRadius: 18,
    backgroundColor: '#dfe3e8',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  statusBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  confirmedBadge: {
    backgroundColor: '#72eba9',
  },
  confirmedBadgeText: {
    color: '#075a38',
  },
  pendingBadge: {
    backgroundColor: '#ffe1b9',
  },
  pendingBadgeText: {
    color: '#6b3d00',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '800',
  },
  cardBody: {
    paddingTop: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  showTitle: {
    flex: 1,
    color: '#040506',
    fontSize: 18,
    lineHeight: 23,
    fontWeight: '900',
  },
  dateBlock: {
    width: 88,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
  },
  dateText: {
    flex: 1,
    color: '#20242c',
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  locationText: {
    flex: 1,
    color: '#087a4b',
    fontSize: 15,
    fontWeight: '700',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#dfe7ff',
  },
  tagText: {
    color: '#44506f',
    fontSize: 12,
    fontWeight: '800',
  },
  neutralTag: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#e9ebef',
  },
  neutralTagText: {
    color: '#4e535d',
    fontSize: 12,
    fontWeight: '800',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 220,
    marginHorizontal: 18,
    padding: 22,
    borderRadius: 24,
    backgroundColor: '#ffffff',
  },
  emptyTitle: {
    color: '#111318',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 6,
    textAlign: 'center',
  },
  emptyText: {
    color: '#5f6570',
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 22,
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.24,
    shadowRadius: 10,
    elevation: 8,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.32)',
  },
  modalCard: {
    maxHeight: '82%',
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 26,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: '#ffffff',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  modalTitle: {
    color: '#111318',
    fontSize: 22,
    fontWeight: '900',
  },
  input: {
    minHeight: 52,
    marginBottom: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#d7dae0',
    borderRadius: 14,
    color: '#111318',
    fontSize: 16,
    backgroundColor: '#ffffff',
  },
  fieldLabel: {
    color: '#30343d',
    fontSize: 14,
    fontWeight: '900',
    marginBottom: 8,
  },
  optionList: {
    gap: 8,
    paddingBottom: 12,
  },
  optionChip: {
    minHeight: 38,
    justifyContent: 'center',
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#d7dae0',
    borderRadius: 19,
    backgroundColor: '#ffffff',
  },
  optionChipActive: {
    borderColor: '#087a4b',
    backgroundColor: '#e8fbf2',
  },
  optionText: {
    color: '#3f444e',
    fontSize: 14,
    fontWeight: '800',
  },
  optionTextActive: {
    color: '#087a4b',
  },
  saveButton: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
    borderRadius: 16,
    backgroundColor: '#087a4b',
  },
  saveButtonDisabled: {
    opacity: 0.65,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
  },
});

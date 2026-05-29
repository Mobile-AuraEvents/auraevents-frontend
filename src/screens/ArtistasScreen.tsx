import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  MoreVertical,
  Phone,
  Plus,
  Save,
  Search,
  Bell,
  UserCircle,
  Users,
  X,
} from 'lucide-react-native';

import { Artista, getArtistas } from '../services/entities';
import { apiPost, apiPut } from '../services/api';

type ArtistaForm = {
  nome: string;
  assessorResponsavel: string;
  telefones: string;
};

const initialForm: ArtistaForm = {
  nome: '',
  assessorResponsavel: '',
  telefones: '',
};

export default function ArtistasScreen(): React.JSX.Element {
  const [items, setItems] = useState<Artista[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ArtistaForm>(initialForm);
  const [query, setQuery] = useState('');

  function onlyDigits(value: string): string {
    return value.replace(/\D/g, '');
  }

  function onlyNameChars(value: string): string {
    return value.replace(/[0-9]/g, '');
  }

  function formatPhone(value: string): string {
    const d = onlyDigits(value).slice(0, 11);
    if (d.length <= 10) {
      return d
        .replace(/^(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d)/, '$1-$2');
    }
    return d
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2');
  }

  function getMainPhone(artista: Artista): string {
    const phone = artista.telefones?.find(Boolean) || '';
    return phone ? formatPhone(phone) : 'Telefone nao informado';
  }

  function getInitials(name: string): string {
    const words = name.trim().split(/\s+/).filter(Boolean);
    const initials = words.slice(0, 2).map((word) => word[0]?.toUpperCase()).join('');
    return initials || 'AR';
  }

  async function load(): Promise<void> {
    try {
      setLoading(true);
      setItems(await getArtistas());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar artistas.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return items.filter((item) => {
      if (!normalizedQuery) return true;

      return [item.nome, item.assessorResponsavel, ...(item.telefones || [])]
        .filter((field): field is string => Boolean(field))
        .some((field) => field.toLowerCase().includes(normalizedQuery));
    });
  }, [items, query]);

  function openCreate(): void {
    setEditingId(null);
    setForm(initialForm);
    setModalVisible(true);
  }

  function openEdit(artista: Artista): void {
    setEditingId(artista.id);
    setForm({
      nome: artista.nome || '',
      assessorResponsavel: artista.assessorResponsavel || '',
      telefones: formatPhone((artista.telefones && artista.telefones[0]) || ''),
    });
    setModalVisible(true);
  }

  async function handleSubmit(): Promise<void> {
    if (!form.nome.trim()) return;
    setSaving(true);
    try {
      const payload = {
        id: editingId,
        nome: form.nome.trim(),
        assessorResponsavel: form.assessorResponsavel.trim(),
        telefones: form.telefones ? [form.telefones] : [],
      };

      if (editingId) {
        await apiPut<Artista, typeof payload>(`/artistas/${editingId}`, payload);
      } else {
        await apiPost<Artista, typeof payload>('/artistas', payload);
      }

      setModalVisible(false);
      setForm(initialForm);
      setEditingId(null);
      await load();
    } finally {
      setSaving(false);
    }
  }

  function renderCard({ item, index }: { item: Artista; index: number }): React.JSX.Element {
    const hasPhone = Boolean(item.telefones?.some(Boolean));
    const avatarColor = avatarColors[index % avatarColors.length];

    return (
      <TouchableOpacity activeOpacity={0.86} style={styles.card} onPress={() => openEdit(item)}>
        <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
          <Text style={styles.avatarText}>{getInitials(item.nome)}</Text>
        </View>

        <View style={styles.cardContent}>
          <Text style={styles.artistName} numberOfLines={1}>
            {item.nome}
          </Text>

          <View style={styles.infoRow}>
            <UserCircle size={18} color="#30323a" strokeWidth={2} />
            <Text style={styles.assessorText} numberOfLines={2}>
              Assessor: {item.assessorResponsavel || 'Nao informado'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Phone size={17} color={hasPhone ? '#087a4b' : '#777b84'} strokeWidth={2.4} />
            <Text style={[styles.phoneText, !hasPhone && styles.mutedText]} numberOfLines={1}>
              {getMainPhone(item)}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          accessibilityLabel={`Editar ${item.nome}`}
          hitSlop={10}
          onPress={() => openEdit(item)}
          style={styles.moreButton}
        >
          <MoreVertical size={21} color="#777b84" strokeWidth={2.8} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>

      <View style={styles.searchBox}>
        <Search size={22} color="#777b84" strokeWidth={2.3} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar artistas ou bandas..."
          placeholderTextColor="#707684"
          value={query}
          onChangeText={setQuery}
        />
      </View>

      <FlatList
        data={filteredItems}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderCard}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            {loading ? (
              <ActivityIndicator color="#12b886" size="large" />
            ) : (
              <>
                <Text style={styles.emptyTitle}>{error ? 'Nao foi possivel carregar' : 'Nenhum artista encontrado'}</Text>
                <Text style={styles.emptyText}>
                  {error || 'Cadastre um artista ou ajuste a busca para ver os cards aqui.'}
                </Text>
              </>
            )}
          </View>
        }
      />

      <TouchableOpacity activeOpacity={0.86} style={styles.fab} onPress={openCreate}>
        <Plus size={32} color="#ffffff" strokeWidth={2.4} />
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{editingId ? 'Editar artista' : 'Novo artista'}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} hitSlop={10}>
                <X size={24} color="#292c34" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Nome"
              placeholderTextColor="#777b84"
              value={form.nome}
              onChangeText={(v) => setForm((f) => ({ ...f, nome: onlyNameChars(v) }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Assessor responsavel"
              placeholderTextColor="#777b84"
              value={form.assessorResponsavel}
              onChangeText={(v) => setForm((f) => ({ ...f, assessorResponsavel: onlyNameChars(v) }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Telefone"
              placeholderTextColor="#777b84"
              keyboardType="phone-pad"
              maxLength={15}
              value={form.telefones}
              onChangeText={(v) => setForm((f) => ({ ...f, telefones: formatPhone(v) }))}
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

const avatarColors = ['#111111', '#1f6f54', '#334155', '#6d4c41', '#6b5b95'];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e7e9ee',
  },
  headerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111111',
  },
  headerTitle: {
    flex: 1,
    color: '#050506',
    fontSize: 22,
    fontWeight: '800',
  },
  bellButton: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minHeight: 54,
    marginHorizontal: 16,
    marginTop: 16,
    paddingHorizontal: 16,
    borderRadius: 27,
    backgroundColor: '#eef0f4',
  },
  searchInput: {
    flex: 1,
    color: '#1f222b',
    fontSize: 17,
    fontWeight: '400',
  },
  listContent: {
    paddingTop: 16,
    paddingBottom: 92,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 106,
    marginHorizontal: 16,
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#e7e8ec',
    borderRadius: 20,
    backgroundColor: '#ffffff',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  avatar: {
    width: 78,
    height: 78,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '900',
  },
  cardContent: {
    flex: 1,
    gap: 5,
    paddingRight: 4,
  },
  artistName: {
    color: '#030405',
    fontSize: 19,
    fontWeight: '900',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  assessorText: {
    flex: 1,
    color: '#30323a',
    fontSize: 15,
    lineHeight: 19,
  },
  phoneText: {
    flex: 1,
    color: '#087a4b',
    fontSize: 16,
    fontWeight: '800',
  },
  mutedText: {
    color: '#777b84',
    fontWeight: '600',
  },
  moreButton: {
    alignSelf: 'flex-start',
    paddingTop: 6,
    paddingLeft: 4,
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
    right: 18,
    bottom: 18,
    width: 62,
    height: 62,
    borderRadius: 31,
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
    marginBottom: 16,
  },
  modalTitle: {
    color: '#111318',
    fontSize: 22,
    fontWeight: '900',
  },
  input: {
    minHeight: 54,
    marginBottom: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#d7dae0',
    borderRadius: 14,
    color: '#111318',
    fontSize: 17,
    backgroundColor: '#ffffff',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minHeight: 54,
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

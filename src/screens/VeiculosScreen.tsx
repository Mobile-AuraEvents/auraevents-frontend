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
  Bell,
  Monitor,
  Phone,
  Plus,
  Radio,
  Save,
  Search,
  User,
  X,
} from 'lucide-react-native';

import { apiPost, apiPut } from '../services/api';
import { VeiculoImprensa, getVeiculosImprensa } from '../services/entities';

type VeiculoForm = {
  cnpj: string;
  razaoSocial: string;
  telefone: string;
  nomeResponsavel: string;
  tipo: 'RADIO' | 'TV';
  numero: string;
  frequencia: 'AM' | 'FM';
  canal: string;
};

const initialForm: VeiculoForm = {
  cnpj: '',
  razaoSocial: '',
  telefone: '',
  nomeResponsavel: '',
  tipo: 'RADIO',
  numero: '',
  frequencia: 'FM',
  canal: '',
};

export default function VeiculosScreen(): React.JSX.Element {
  const [items, setItems] = useState<VeiculoImprensa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<VeiculoForm>(initialForm);

  function onlyDigits(value: string): string {
    return value.replace(/\D/g, '');
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

  function formatCnpj(value: string): string {
    return onlyDigits(value)
      .slice(0, 14)
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  }

  function getKindLabel(item: VeiculoImprensa): string {
    return item.tipo === 'TV' ? 'TV' : 'RADIO';
  }

  function getBadgeText(item: VeiculoImprensa): string {
    if (item.tipo === 'TV') {
      return item.canal ? `Canal ${item.canal}` : 'Canal';
    }

    const number = item.numero || '';
    const frequency = item.frequencia || '';
    return number || frequency ? `${number} ${frequency}`.trim() : 'Radio';
  }

  async function load(): Promise<void> {
    try {
      setLoading(true);
      setItems(await getVeiculosImprensa());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar veiculos de imprensa.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return items;

    return items.filter((item) =>
      [
        item.razaoSocial,
        item.cnpj,
        item.telefone,
        item.nomeResponsavel,
        item.tipo,
        item.numero,
        item.frequencia,
        item.canal,
      ]
        .filter((field): field is string => Boolean(field))
        .some((field) => field.toLowerCase().includes(normalizedQuery)),
    );
  }, [items, query]);

  function openCreate(): void {
    setEditingId(null);
    setForm(initialForm);
    setModalVisible(true);
  }

  function openEdit(item: VeiculoImprensa): void {
    setEditingId(item.id);
    setForm({
      cnpj: formatCnpj(item.cnpj || ''),
      razaoSocial: item.razaoSocial || '',
      telefone: formatPhone(item.telefone || ''),
      nomeResponsavel: item.nomeResponsavel || '',
      tipo: item.tipo || 'RADIO',
      numero: item.numero || '',
      frequencia: item.frequencia || 'FM',
      canal: item.canal || '',
    });
    setModalVisible(true);
  }

  async function handleSubmit(): Promise<void> {
    if (!form.razaoSocial.trim()) return;

    setSaving(true);
    try {
      const payload = {
        id: editingId,
        cnpj: form.cnpj.trim(),
        razaoSocial: form.razaoSocial.trim(),
        telefone: form.telefone.trim(),
        nomeResponsavel: form.nomeResponsavel.trim(),
        tipo: form.tipo,
        numero: form.tipo === 'RADIO' ? form.numero.trim() : '',
        frequencia: form.tipo === 'RADIO' ? form.frequencia : undefined,
        canal: form.tipo === 'TV' ? form.canal.trim() : '',
      };

      if (editingId) {
        await apiPut<VeiculoImprensa, typeof payload>(`/veiculos-imprensa/${editingId}`, payload);
      } else {
        await apiPost<VeiculoImprensa, typeof payload>('/veiculos-imprensa', payload);
      }

      setModalVisible(false);
      setEditingId(null);
      setForm(initialForm);
      await load();
    } finally {
      setSaving(false);
    }
  }

  function renderCard({ item }: { item: VeiculoImprensa }): React.JSX.Element {
    const isTv = item.tipo === 'TV';

    return (
      <TouchableOpacity
        activeOpacity={0.86}
        onPress={() => openEdit(item)}
        style={[styles.card, isTv ? styles.tvCard : styles.radioCard]}
      >
        <View style={styles.cardTop}>
          <View style={[styles.kindPill, isTv ? styles.tvPill : styles.radioPill]}>
            {isTv ? <Monitor size={16} color="#101114" /> : <Radio size={17} color="#087a4b" />}
            <Text style={styles.kindText}>{getKindLabel(item)}</Text>
          </View>
          <View style={styles.infoPill}>
            <Text style={styles.infoPillText}>{getBadgeText(item)}</Text>
          </View>
        </View>

        <Text style={styles.vehicleName} numberOfLines={2}>
          {item.razaoSocial || 'Veiculo sem nome'}
        </Text>
        <Text style={styles.companyText} numberOfLines={1}>
          {item.cnpj || 'CNPJ nao informado'}
        </Text>

        <View style={styles.divider} />

        <View style={styles.contactRow}>
          <User size={16} color="#6b6f7a" />
          <Text style={styles.contactText} numberOfLines={1}>
            {item.nomeResponsavel || 'Responsavel nao informado'}
          </Text>
        </View>
        <View style={styles.contactRow}>
          <Phone size={15} color="#6b6f7a" />
          <Text style={styles.contactText} numberOfLines={1}>
            {item.telefone ? formatPhone(item.telefone) : 'Telefone nao informado'}
          </Text>
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
            <Text style={styles.screenTitle}>Imprensa</Text>
            <Text style={styles.subtitle}>Gerencie os veiculos de comunicacao e contatos oficiais dos seus eventos.</Text>

            <View style={styles.controls}>
              <View style={styles.searchBox}>
                <Search size={21} color="#6f7480" strokeWidth={2.3} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Buscar veiculo ou responsavel"
                  placeholderTextColor="#6f7480"
                  value={query}
                  onChangeText={setQuery}
                />
              </View>

              <TouchableOpacity activeOpacity={0.86} style={styles.newButton} onPress={openCreate}>
                <Plus size={25} color="#ffffff" strokeWidth={2.4} />
                <Text style={styles.newButtonText}>NOVO</Text>
              </TouchableOpacity>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            {loading ? (
              <ActivityIndicator color="#12b886" size="large" />
            ) : (
              <>
                <Text style={styles.emptyTitle}>{error ? 'Nao foi possivel carregar' : 'Nenhum veiculo encontrado'}</Text>
                <Text style={styles.emptyText}>
                  {error || 'Cadastre um veiculo de imprensa ou ajuste a busca para ver os cards aqui.'}
                </Text>
              </>
            )}
          </View>
        }
      />

      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{editingId ? 'Editar veiculo' : 'Novo veiculo'}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} hitSlop={10}>
                <X size={24} color="#292c34" />
              </TouchableOpacity>
            </View>

            <View style={styles.segmented}>
              <TouchableOpacity
                style={[styles.segmentButton, form.tipo === 'RADIO' && styles.segmentButtonActive]}
                onPress={() => setForm((f) => ({ ...f, tipo: 'RADIO' }))}
              >
                <Text style={[styles.segmentText, form.tipo === 'RADIO' && styles.segmentTextActive]}>Radio</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.segmentButton, form.tipo === 'TV' && styles.segmentButtonActive]}
                onPress={() => setForm((f) => ({ ...f, tipo: 'TV' }))}
              >
                <Text style={[styles.segmentText, form.tipo === 'TV' && styles.segmentTextActive]}>TV</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Razao social"
              placeholderTextColor="#777b84"
              value={form.razaoSocial}
              onChangeText={(v) => setForm((f) => ({ ...f, razaoSocial: v }))}
            />
            <TextInput
              style={styles.input}
              placeholder="CNPJ"
              placeholderTextColor="#777b84"
              keyboardType="number-pad"
              maxLength={18}
              value={form.cnpj}
              onChangeText={(v) => setForm((f) => ({ ...f, cnpj: formatCnpj(v) }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Responsavel"
              placeholderTextColor="#777b84"
              value={form.nomeResponsavel}
              onChangeText={(v) => setForm((f) => ({ ...f, nomeResponsavel: v }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Telefone"
              placeholderTextColor="#777b84"
              keyboardType="phone-pad"
              maxLength={15}
              value={form.telefone}
              onChangeText={(v) => setForm((f) => ({ ...f, telefone: formatPhone(v) }))}
            />

            {form.tipo === 'RADIO' ? (
              <View style={styles.inlineFields}>
                <TextInput
                  style={[styles.input, styles.inlineInput]}
                  placeholder="Numero"
                  placeholderTextColor="#777b84"
                  keyboardType="decimal-pad"
                  value={form.numero}
                  onChangeText={(v) => setForm((f) => ({ ...f, numero: v }))}
                />
                <View style={styles.frequencyGroup}>
                  {(['FM', 'AM'] as const).map((freq) => (
                    <TouchableOpacity
                      key={freq}
                      style={[styles.frequencyButton, form.frequencia === freq && styles.frequencyButtonActive]}
                      onPress={() => setForm((f) => ({ ...f, frequencia: freq }))}
                    >
                      <Text style={[styles.frequencyText, form.frequencia === freq && styles.frequencyTextActive]}>{freq}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ) : (
              <TextInput
                style={styles.input}
                placeholder="Canal"
                placeholderTextColor="#777b84"
                value={form.canal}
                onChangeText={(v) => setForm((f) => ({ ...f, canal: v }))}
              />
            )}

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
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e7e9ee',
    backgroundColor: '#ffffff',
  },
  headerAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1f2933',
  },
  headerAvatarText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '900',
  },
  headerTitle: {
    flex: 1,
    color: '#050506',
    fontSize: 19,
    fontWeight: '800',
  },
  bellButton: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingBottom: 88,
  },
  intro: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 18,
  },
  screenTitle: {
    color: '#050506',
    fontSize: 28,
    fontWeight: '900',
    marginBottom: 12,
  },
  subtitle: {
    color: '#2e313a',
    fontSize: 17,
    lineHeight: 25,
    marginBottom: 28,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchBox: {
    flex: 1,
    minWidth: 0,
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#c9ccd3',
    borderRadius: 28,
    backgroundColor: '#f8f9fb',
  },
  searchInput: {
    flex: 1,
    minWidth: 0,
    color: '#20232b',
    fontSize: 14,
  },
  newButton: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 20,
    borderRadius: 28,
    backgroundColor: '#000000',
  },
  newButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '900',
  },
  card: {
    marginHorizontal: 20,
    marginBottom: 18,
    paddingHorizontal: 28,
    paddingVertical: 24,
    borderWidth: 1.6,
    borderRadius: 28,
    backgroundColor: '#ffffff',
  },
  radioCard: {
    borderColor: '#007a4a',
  },
  tvCard: {
    borderColor: '#ffae46',
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  kindPill: {
    minHeight: 30,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    borderRadius: 15,
  },
  radioPill: {
    backgroundColor: '#68efae',
  },
  tvPill: {
    backgroundColor: '#ffd8ad',
  },
  kindText: {
    color: '#262931',
    fontSize: 13,
    fontWeight: '800',
  },
  infoPill: {
    minHeight: 28,
    justifyContent: 'center',
    paddingHorizontal: 11,
    borderRadius: 14,
    backgroundColor: '#e6e8ec',
  },
  infoPillText: {
    color: '#23262d',
    fontSize: 12,
    fontWeight: '700',
  },
  vehicleName: {
    color: '#020304',
    fontSize: 25,
    lineHeight: 30,
    fontWeight: '900',
    marginBottom: 8,
  },
  companyText: {
    color: '#343740',
    fontSize: 16,
  },
  divider: {
    height: 1,
    marginVertical: 18,
    backgroundColor: '#c7cad0',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  contactText: {
    flex: 1,
    color: '#17191f',
    fontSize: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 220,
    marginHorizontal: 20,
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
    marginBottom: 14,
  },
  modalTitle: {
    color: '#111318',
    fontSize: 22,
    fontWeight: '900',
  },
  segmented: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  segmentButton: {
    flex: 1,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#d7dae0',
    borderRadius: 14,
  },
  segmentButtonActive: {
    borderColor: '#087a4b',
    backgroundColor: '#e8fbf2',
  },
  segmentText: {
    color: '#4b505a',
    fontSize: 16,
    fontWeight: '800',
  },
  segmentTextActive: {
    color: '#087a4b',
  },
  input: {
    minHeight: 52,
    marginBottom: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#d7dae0',
    borderRadius: 14,
    color: '#111318',
    fontSize: 16,
    backgroundColor: '#ffffff',
  },
  inlineFields: {
    flexDirection: 'row',
    gap: 10,
  },
  inlineInput: {
    flex: 1,
  },
  frequencyGroup: {
    width: 112,
    flexDirection: 'row',
    gap: 6,
  },
  frequencyButton: {
    flex: 1,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#d7dae0',
    borderRadius: 14,
  },
  frequencyButtonActive: {
    borderColor: '#087a4b',
    backgroundColor: '#e8fbf2',
  },
  frequencyText: {
    color: '#4b505a',
    fontWeight: '900',
  },
  frequencyTextActive: {
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

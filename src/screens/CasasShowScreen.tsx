import React, { useEffect, useMemo, useState } from 'react';
import { apiGet, apiPost } from '../services/api';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
  Modal,
  TextInput,
} from 'react-native';
import { MapPin, Phone } from 'lucide-react-native';

type Casa = {
  id: number;
  nome: string;
  cidade?: string;
  uf?: string;
  capacidadeMaxima?: number;
  telefone?: string;
};

type CasaCreateRequest = {
  nome: string;
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  uf: string;
  capacidadeMaxima: number;
  telefone: string;
};

export default function CasasShowScreen(): React.JSX.Element {
  const [apiVenues, setApiVenues] = useState<Casa[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<CasaCreateRequest>({
    nome: '', rua: '', numero: '', bairro: '', cidade: '', uf: '', capacidadeMaxima: 0, telefone: '',
  });

  async function loadVenues(): Promise<void> {
    try {
      setApiVenues(await apiGet<Casa[]>('/casas-de-show'));
    } catch {
      setApiVenues([]);
    }
  }

  useEffect(() => { loadVenues(); }, []);

  async function handleCreate(): Promise<void> {
    if (!form.nome.trim() || !form.cidade.trim() || !form.uf.trim()) return;
    setSaving(true);
    try {
      await apiPost<Casa, CasaCreateRequest>('/casas-de-show', form);
      setModalVisible(false);
      setForm({ nome: '', rua: '', numero: '', bairro: '', cidade: '', uf: '', capacidadeMaxima: 0, telefone: '' });
      await loadVenues();
    } finally {
      setSaving(false);
    }
  }

  const venues = useMemo(
    () =>
      apiVenues.map((v) => ({
        id: String(v.id),
        name: v.nome,
        location: `${v.cidade || '-'}${v.uf ? '/' + v.uf : ''}`,
        capacity: v.capacidadeMaxima ? `${v.capacidadeMaxima} pessoas` : '-',
        phone: v.telefone || '-',
        image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600',
        badge: 'ATIVO',
        badgeColor: '#12b886',
      })),
    [apiVenues]
  );

  return (
    <>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.pageTitle}>Espacos & Casas de Show</Text>
            <Text style={styles.subtitle}>Gerencie locais cadastrados, verifique capacidades e mantenha contatos atualizados para producoes de alto nivel.</Text>
          </View>
          <View style={styles.avatarContainer}><Text style={styles.avatarText}>G</Text></View>
        </View>

        {venues.map((venue) => (
          <View key={venue.id} style={styles.card}>
            <View style={styles.imageContainer}>
              <Image source={{ uri: venue.image }} style={styles.image} />
              <View style={[styles.badge, { backgroundColor: venue.badgeColor }]}><Text style={styles.badgeText}>{venue.badge}</Text></View>
              <Text style={styles.idLabel}>ID: {venue.id}</Text>
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.venueName}>{venue.name}</Text>
              <View style={styles.locationRow}><MapPin size={16} color="#6c757d" style={styles.locationIcon} /><Text style={styles.location}>{venue.location}</Text></View>
              <View style={styles.infoRow}>
                <View style={styles.infoBox}><Text style={styles.infoLabel}>CAPACIDADE</Text><Text style={styles.infoValue}>{venue.capacity}</Text></View>
                <View style={styles.infoBox}><Text style={styles.infoLabel}>CONTATO</Text><View style={styles.phoneRow}><Phone size={14} color="#151821" style={styles.phoneIcon} /><Text style={styles.infoValue}>{venue.phone}</Text></View></View>
              </View>
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.fab} activeOpacity={0.8} onPress={() => setModalVisible(true)}>
          <Text style={styles.fabIcon}>+</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Nova Casa de Show</Text>
            <TextInput style={styles.input} placeholder="Nome" value={form.nome} onChangeText={(v) => setForm((f) => ({ ...f, nome: v }))} />
            <TextInput style={styles.input} placeholder="Cidade" value={form.cidade} onChangeText={(v) => setForm((f) => ({ ...f, cidade: v }))} />
            <TextInput style={styles.input} placeholder="UF" value={form.uf} maxLength={2} onChangeText={(v) => setForm((f) => ({ ...f, uf: v.toUpperCase() }))} />
            <TextInput style={styles.input} placeholder="Telefone" value={form.telefone} onChangeText={(v) => setForm((f) => ({ ...f, telefone: v }))} />
            <TextInput style={styles.input} placeholder="Capacidade" keyboardType="numeric" value={String(form.capacidadeMaxima || '')} onChangeText={(v) => setForm((f) => ({ ...f, capacidadeMaxima: Number(v) || 0 }))} />

            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setModalVisible(false)}><Text>Cancelar</Text></TouchableOpacity>
              <TouchableOpacity onPress={handleCreate} disabled={saving}><Text style={styles.saveText}>{saving ? 'Salvando...' : 'Salvar'}</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f7f8fb' }, content: { paddingTop: 24, paddingBottom: 32, paddingHorizontal: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 }, pageTitle: { fontSize: 26, fontWeight: '700', color: '#151821', marginBottom: 8 },
  subtitle: { fontSize: 14, lineHeight: 20, color: '#6c757d', marginRight: 16, width: '85%' }, avatarContainer: { width: 48, height: 48, borderRadius: 16, backgroundColor: '#e9ecef', justifyContent: 'center', alignItems: 'center' }, avatarText: { fontSize: 18, fontWeight: '700', color: '#343a40' },
  card: { backgroundColor: '#ffffff', borderRadius: 20, overflow: 'hidden', marginBottom: 18, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 4 },
  imageContainer: { position: 'relative', width: '100%', height: 160 }, image: { width: '100%', height: '100%', resizeMode: 'cover' }, badge: { position: 'absolute', top: 12, right: 12, paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20 }, badgeText: { color: '#ffffff', fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  idLabel: { position: 'absolute', bottom: 12, right: 12, fontSize: 12, color: '#ffffff', backgroundColor: 'rgba(0, 0, 0, 0.4)', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 6, fontWeight: '600' },
  cardBody: { padding: 18 }, venueName: { fontSize: 20, fontWeight: '700', color: '#151821', marginBottom: 10 }, locationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 }, locationIcon: { marginRight: 6 }, location: { fontSize: 14, color: '#6c757d', fontWeight: '500' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#e9ecef', paddingTop: 14 }, infoBox: { flex: 1 }, infoLabel: { fontSize: 11, color: '#8b96a5', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }, infoValue: { fontSize: 15, fontWeight: '700', color: '#151821' }, phoneRow: { flexDirection: 'row', alignItems: 'center' }, phoneIcon: { marginRight: 6 },
  fab: { position: 'absolute', right: 20, bottom: 30, width: 56, height: 56, borderRadius: 28, backgroundColor: '#12b886', justifyContent: 'center', alignItems: 'center', ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.18, shadowRadius: 12 }, android: { elevation: 5 } }) }, fabIcon: { color: '#ffffff', fontSize: 28, lineHeight: 32 },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'center', padding: 20 },
  modalCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16 },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 8, marginBottom: 8 },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  saveText: { color: '#12b886', fontWeight: '700' },
});

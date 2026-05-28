import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, FlatList, Image } from 'react-native';
import { Artista, getArtistas } from '../services/entities';
import { apiPost, apiPut } from '../services/api';
import * as ImagePicker from 'expo-image-picker';

type ArtistaForm = {
  nome: string;
  assessorResponsavel: string;
  fotoUrl: string;
  telefones: string;
};

const initialForm: ArtistaForm = {
  nome: '',
  assessorResponsavel: '',
  fotoUrl: '',
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

  async function load(): Promise<void> {
    try {
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
      fotoUrl: artista.fotoUrl || '',
      telefones: (artista.telefones || []).join(', '),
    });
    setModalVisible(true);
  }

  async function pickImage(): Promise<void> {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      const data = asset.base64 ? `data:image/jpeg;base64,${asset.base64}` : asset.uri;
      setForm((f) => ({ ...f, fotoUrl: data }));
    }
  }

  async function handleSubmit(): Promise<void> {
    if (!form.nome.trim()) return;
    setSaving(true);
    try {
      const payload = {
        id: editingId,
        nome: form.nome,
        assessorResponsavel: form.assessorResponsavel,
        fotoUrl: form.fotoUrl,
        telefones: form.telefones
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Artistas</Text>
      <TouchableOpacity style={styles.addButton} onPress={openCreate}>
        <Text style={styles.addButtonText}>+ Novo Artista</Text>
      </TouchableOpacity>

      {loading ? <Text>Carregando...</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {item.fotoUrl ? <Image source={{ uri: item.fotoUrl }} style={styles.image} /> : null}
            <Text style={styles.name}>{item.nome}</Text>
            <Text>Assessor: {item.assessorResponsavel || '-'}</Text>
            <TouchableOpacity onPress={() => openEdit(item)}>
              <Text style={styles.edit}>Editar</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{editingId ? 'Editar Artista' : 'Novo Artista'}</Text>
            <TextInput style={styles.input} placeholder="Nome" value={form.nome} onChangeText={(v) => setForm((f) => ({ ...f, nome: v }))} />
            <TextInput style={styles.input} placeholder="Assessor responsável" value={form.assessorResponsavel} onChangeText={(v) => setForm((f) => ({ ...f, assessorResponsavel: v }))} />
            <TouchableOpacity style={styles.pickImageButton} onPress={pickImage}>
              <Text style={styles.pickImageText}>Selecionar foto do dispositivo</Text>
            </TouchableOpacity>
            {form.fotoUrl ? <Image source={{ uri: form.fotoUrl }} style={styles.previewImage} /> : null}
            <TextInput style={styles.input} placeholder="Telefones (separados por vírgula)" value={form.telefones} onChangeText={(v) => setForm((f) => ({ ...f, telefones: v }))} />
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => setModalVisible(false)}><Text>Cancelar</Text></TouchableOpacity>
              <TouchableOpacity onPress={handleSubmit} disabled={saving}><Text style={styles.save}>{saving ? 'Salvando...' : 'Salvar'}</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: '600', marginBottom: 8, textAlign: 'center' },
  addButton: { alignSelf: 'center', backgroundColor: '#12b886', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, marginBottom: 12 },
  addButtonText: { color: '#fff', fontWeight: '700' },
  error: { color: '#b91c1c', textAlign: 'center', marginBottom: 8 },
  card: { backgroundColor: '#fff', borderRadius: 10, padding: 12, marginBottom: 10 },
  image: { width: '100%', height: 120, borderRadius: 8, marginBottom: 8 },
  name: { fontSize: 16, fontWeight: '700' },
  edit: { color: '#3730a3', fontWeight: '600', marginTop: 6 },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'center', padding: 20 },
  modalCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16 },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 8, marginBottom: 8 },
  actions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  save: { color: '#12b886', fontWeight: '700' },
  pickImageButton: { backgroundColor: '#eef2ff', paddingVertical: 8, paddingHorizontal: 10, borderRadius: 8, marginBottom: 8 },
  pickImageText: { color: '#3730a3', fontWeight: '600' },
  previewImage: { width: '100%', height: 120, borderRadius: 8, marginBottom: 8 },
});

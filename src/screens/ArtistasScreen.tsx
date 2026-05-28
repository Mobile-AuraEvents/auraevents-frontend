import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { apiGet } from '../services/api';

type Artista = {
  id: number;
  nome: string;
  assessorResponsavel: string;
  telefones: string[];
};

export default function ArtistasScreen(): React.JSX.Element {
  const [artistas, setArtistas] = useState<Artista[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadArtistas(): Promise<void> {
      try {
        const data = await apiGet<Artista[]>('/artistas');
        setArtistas(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro ao carregar artistas.';
        setError(message);
      } finally {
        setLoading(false);
      }
    }

    loadArtistas();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Artistas</Text>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={artistas}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={<Text>Nenhum artista encontrado.</Text>}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.name}>{item.nome}</Text>
              <Text>Assessor: {item.assessorResponsavel || '-'}</Text>
              <Text>Telefones: {item.telefones?.join(', ') || '-'}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: 16,
  },
  card: {
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  error: {
    color: '#b91c1c',
    textAlign: 'center',
  },
});

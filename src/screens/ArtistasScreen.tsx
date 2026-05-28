import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Artista, getArtistas } from '../services/entities';

export default function ArtistasScreen(): React.JSX.Element {
  const [items, setItems] = useState<Artista[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load(): Promise<void> {
      try {
        setItems(await getArtistas());
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar artistas.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Artistas</Text>
      {loading ? <Text>Carregando...</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {!loading && !error ? <Text>{items.length} artista(s) carregado(s).</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
  },
  error: {
    color: '#b91c1c',
    textAlign: 'center',
  },
});

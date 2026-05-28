import React, { useEffect, useMemo, useState } from 'react';
import { apiGet } from '../services/api';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
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

export default function CasasShowScreen(): React.JSX.Element {
  const [apiVenues, setApiVenues] = useState<Casa[]>([]);

  useEffect(() => {
    async function load(): Promise<void> {
      try {
        setApiVenues(await apiGet<Casa[]>('/casas-de-show'));
      } catch {
        setApiVenues([]);
      }
    }
    load();
  }, []);

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
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View>
          <Text style={styles.pageTitle}>Espacos & Casas de Show</Text>
          <Text style={styles.subtitle}>Gerencie locais cadastrados, verifique capacidades e mantenha contatos atualizados para producoes de alto nivel.</Text>
        </View>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>G</Text>
        </View>
      </View>

      {venues.map((venue) => (
        <View key={venue.id} style={styles.card}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: venue.image }} style={styles.image} />
            <View style={[styles.badge, { backgroundColor: venue.badgeColor }]}>
              <Text style={styles.badgeText}>{venue.badge}</Text>
            </View>
            <Text style={styles.idLabel}>ID: {venue.id}</Text>
          </View>

          <View style={styles.cardBody}>
            <Text style={styles.venueName}>{venue.name}</Text>
            <View style={styles.locationRow}>
              <MapPin size={16} color="#6c757d" style={styles.locationIcon} />
              <Text style={styles.location}>{venue.location}</Text>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoBox}>
                <Text style={styles.infoLabel}>CAPACIDADE</Text>
                <Text style={styles.infoValue}>{venue.capacity}</Text>
              </View>
              <View style={styles.infoBox}>
                <Text style={styles.infoLabel}>CONTATO</Text>
                <View style={styles.phoneRow}>
                  <Phone size={14} color="#151821" style={styles.phoneIcon} />
                  <Text style={styles.infoValue}>{venue.phone}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      ))}

      <TouchableOpacity style={styles.fab} activeOpacity={0.8}>
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f7f8fb',
  },
  content: {
    paddingTop: 24,
    paddingBottom: 32,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#151821',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: '#6c757d',
    marginRight: 16,
    width: '85%',
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#e9ecef',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#343a40',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 160,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  badge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  idLabel: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    fontSize: 12,
    color: '#ffffff',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    fontWeight: '600',
  },
  cardBody: {
    padding: 18,
  },
  venueName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#151821',
    marginBottom: 10,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  locationIcon: {
    marginRight: 6,
  },
  location: {
    fontSize: 14,
    color: '#6c757d',
    fontWeight: '500',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    paddingTop: 14,
  },
  infoBox: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: '#8b96a5',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#151821',
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  phoneIcon: {
    marginRight: 6,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#12b886',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.18,
        shadowRadius: 12,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  fabIcon: {
    color: '#ffffff',
    fontSize: 28,
    lineHeight: 32,
  },
});

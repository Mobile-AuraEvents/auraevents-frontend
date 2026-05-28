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

const venues = [
  {
    id: '042',
    name: 'Arena Art',
    location: 'São Paulo/SP',
    capacity: '5.000 pessoas',
    phone: '(11) 96765-4321',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600',
    badge: 'PREMIUM',
    badgeColor: '#12b886',
  },
  {
    id: '118',
    name: 'Studio Jazz',
    location: 'Curitiba/PR',
    capacity: '250 pessoas',
    phone: '(41) 3232-1000',
    image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600',
    badge: 'INTIMISTA',
    badgeColor: '#ff8c42',
  },
  {
    id: '055',
    name: 'Teatro de Arena',
    location: 'Rio de Janeiro/RJ',
    capacity: '1.200 pessoas',
    phone: '(21) 2555-8800',
    image: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=600',
    badge: 'MODERNO',
    badgeColor: '#0b6aef',
  },
  {
    id: '021',
    name: 'Palácio das Artes',
    location: 'Belo Horizonte/MG',
    capacity: '1.700 pessoas',
    phone: '(31) 3236-7800',
    image: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=600',
    badge: 'HISTÓRICO',
    badgeColor: '#d4a574',
  },
  {
    id: '033',
    name: 'Espaço Verde Eventos',
    location: 'Brasília/DF',
    capacity: '3.500 pessoas',
    phone: '(61) 3456-7890',
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600',
    badge: 'ECO',
    badgeColor: '#51cf66',
  },
  {
    id: '067',
    name: 'Megadome Salvador',
    location: 'Salvador/BA',
    capacity: '8.000 pessoas',
    phone: '(71) 3012-3456',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600',
    badge: 'GIGANTE',
    badgeColor: '#e03131',
  },
  {
    id: '089',
    name: 'Auditório Central',
    location: 'Recife/PE',
    capacity: '2.200 pessoas',
    phone: '(81) 3456-8901',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600',
    badge: 'CLÁSSICO',
    badgeColor: '#5c7cfa',
  },
  {
    id: '045',
    name: 'Estúdio Underground',
    location: 'Porto Alegre/RS',
    capacity: '800 pessoas',
    phone: '(51) 2456-7890',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600',
    badge: 'ALTERNATIVO',
    badgeColor: '#9775fa',
  },
  {
    id: '076',
    name: 'Centro de Convenções',
    location: 'Manaus/AM',
    capacity: '4.000 pessoas',
    phone: '(92) 3234-5678',
    image: 'https://images.unsplash.com/photo-1486591978090-58e619d37fe7?w=600',
    badge: 'CORPORATIVO',
    badgeColor: '#0c84ff',
  },
];

export default function CasasShowScreen(): React.JSX.Element {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View>
          <Text style={styles.pageTitle}>Espaços & Casas de Show</Text>
          <Text style={styles.subtitle}>Gerencie locais cadastrados, verifique capacidades e mantenha contatos atualizados para produções de alto nível.</Text>
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
              <Text style={styles.locationIcon}>??</Text>
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
                  <Text style={styles.phoneIcon}>??</Text>
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
    fontSize: 16,
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
    fontSize: 14,
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


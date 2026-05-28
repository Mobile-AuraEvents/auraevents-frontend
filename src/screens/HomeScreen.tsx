import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';

const stats = [
  { label: 'Shows', value: '24', icon: '🎵', color: '#22c58b' },
  { label: 'Artistas', value: '12', icon: '👤', color: '#0b6aef' },
  { label: 'Patrocinadores', value: '8', icon: '🤝', color: '#15aabf' },
  { label: 'Espaços', value: '6', icon: '📍', color: '#ff8c00' },
];

const events = [
  {
    status: 'ESGOTADO',
    title: 'Noites de Jazz - Trio Urbano',
    datetime: '15 Out, 2024 • 20:30',
    location: 'Teatro Municipal, São Paulo',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
    statusColor: '#40c057',
  },
  {
    status: 'CONFIRMADO',
    title: 'Eco Rock Festival - Headliner',
    datetime: '22 Out, 2024 • 19:00',
    location: 'Arena Multiplace, Rio de Janeiro',
    image: 'https://images.unsplash.com/photo-1504805572947-34fad45aed93?auto=format&fit=crop&w=1200&q=80',
    statusColor: '#228be6',
  },
  {
    status: 'EM PLANEJAMENTO',
    title: 'Voz e Violão: Novas Rotas',
    datetime: '05 Nov, 2024 • 21:00',
    location: 'Centro Cultural, Belo Horizonte',
    image: 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?auto=format&fit=crop&w=1200&q=80',
    statusColor: '#748ffc',
  },
  {
    status: 'CONFIRMADO',
    title: 'Indie Nights - Aurora',
    datetime: '12 Nov, 2024 • 21:00',
    location: 'Teatro Oficina, São Paulo',
    image: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=1200&q=80',
    statusColor: '#6f42c1',
  },
  {
    status: 'CONFIRMADO',
    title: 'Festival Samba & Sol',
    datetime: '01 Dec, 2024 • 17:00',
    location: 'Praça Central, Salvador',
    image: require('../../assets/logo-auraev.jpg'),
    statusColor: '#e8590c',
  },
  {
    status: 'EM CARTAZ',
    title: 'Experimental Electronica',
    datetime: '10 Dec, 2024 • 23:00',
    location: 'Club Zero, Belo Horizonte',
    image: 'https://images.unsplash.com/photo-1508921912186-1d1a45ebb3c1?auto=format&fit=crop&w=1200&q=80',
    statusColor: '#20c997',
  },
  {
    status: 'CONFIRMADO',
    title: 'Classical Evening - Orquestra Nova',
    datetime: '20 Dec, 2024 • 19:30',
    location: 'Sala Sinfônica, Curitiba',
    image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1200&q=80',
    statusColor: '#2b8a3e',
  },
  {
    status: 'EM PLANEJAMENTO',
    title: 'New Year\'s Eve Bash',
    datetime: '31 Dec, 2024 • 22:00',
    location: 'Marina Stage, Rio de Janeiro',
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80',
    statusColor: '#d63384',
  },
];

export default function HomeScreen(): React.JSX.Element {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSubtitle}>Olá, Gestor</Text>
          <Text style={styles.headerTitle}>Gestão de Eventos</Text>
        </View>
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>G</Text>
        </View>
      </View>

      <View style={styles.statsGrid}>
        {stats.map((item) => (
          <View key={item.label} style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: item.color + '22' }]}> 
              <Text style={[styles.statIconText, { color: item.color }]}>{item.icon}</Text>
            </View>
            <Text style={styles.statValue}>{item.value}</Text>
            <Text style={styles.statLabel}>{item.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Próximos Shows</Text>
        <TouchableOpacity>
          <Text style={styles.sectionAction}>Ver todos</Text>
        </TouchableOpacity>
      </View>

      {events.map((event) => (
        <View key={event.title} style={styles.eventCard}>
          <Image
            source={typeof event.image === 'string' ? { uri: event.image } : event.image}
            style={styles.eventImage}
          />
          <View style={styles.eventBody}>
            <View style={[styles.eventBadge, { backgroundColor: event.statusColor + '16' }]}> 
              <Text style={[styles.eventBadgeText, { color: event.statusColor }]}>{event.status}</Text>
            </View>
            <Text style={styles.eventTitle}>{event.title}</Text>
            <Text style={styles.eventMeta}>{event.datetime}</Text>
            <Text style={styles.eventMeta}>{event.location}</Text>
          </View>
          <View style={styles.eventActionButton}>
            <Text style={styles.eventActionIcon}>›</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f7f8fb',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 32,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerSubtitle: {
    color: '#6c757d',
    fontSize: 15,
    marginBottom: 4,
  },
  headerTitle: {
    color: '#151821',
    fontSize: 28,
    fontWeight: '700',
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#e9ecef',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#343a40',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 18,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 3,
  },
  statIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  statIconText: {
    fontSize: 20,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#151821',
  },
  statLabel: {
    marginTop: 6,
    fontSize: 14,
    color: '#6c757d',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#151821',
  },
  sectionAction: {
    fontSize: 14,
    color: '#22c58b',
    fontWeight: '600',
  },
  eventCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 5,
  },
  eventImage: {
    width: '100%',
    height: 160,
  },
  eventBody: {
    padding: 16,
  },
  eventBadge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  eventBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#151821',
    marginBottom: 8,
  },
  eventMeta: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 4,
  },
  eventActionButton: {
    position: 'absolute',
    right: 16,
    top: 140,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  eventActionIcon: {
    fontSize: 24,
    color: '#151821',
  },
});

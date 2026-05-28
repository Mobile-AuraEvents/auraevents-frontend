import React, { useEffect, useMemo, useState } from 'react';
import { apiGet } from '../services/api';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Image,
} from 'react-native';

type Patrocinador = { id: number; nome: string; cnpj: string; telefone: string };

export default function PatrocinadoresScreen(): React.JSX.Element {
  const [apiSponsors, setApiSponsors] = useState<Patrocinador[]>([]);

  useEffect(() => {
    async function load(): Promise<void> {
      try {
        setApiSponsors(await apiGet<Patrocinador[]>('/patrocinadores'));
      } catch {
        setApiSponsors([]);
      }
    }
    load();
  }, []);

  const sponsors = useMemo(
    () =>
      apiSponsors.map((s) => ({
        tier: 'Parceiro',
        name: s.nome,
        cnpj: s.cnpj || '-',
        phone: s.telefone || '-',
        initials: [s.nome.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase() || 'SP'],
        guests: 0,
        badgeColor: '#12b886',
        logoUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(s.nome)}&background=12b886&color=ffffff&size=128`,
      })),
    [apiSponsors]
  );

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View>
          <Text style={styles.pageLabel}>Patrocinadores</Text>
          <Text style={styles.subtitle}>Gerencie as parcerias corporativas e convidados do evento.</Text>
        </View>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>G</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statsCard}>
          <Text style={styles.statsNumber}>{apiSponsors.length}</Text>
          <Text style={styles.statsLabel}>TOTAL</Text>
        </View>
        <View style={[styles.statsCard, styles.activeCard]}>
          <Text style={[styles.statsNumber, styles.activeNumber]}>{apiSponsors.length}</Text>
          <Text style={[styles.statsLabel, styles.activeLabel]}>ATIVOS</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statsCardWide}>
          <Text style={styles.statsLabelSmall}>INVESTIMENTO TOTAL</Text>
          <Text style={styles.statsValue}>R$ 530k</Text>
        </View>
      </View>

      {sponsors.map((item) => (
        <View key={item.name} style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.logoCircle}>
              <Image source={{ uri: item.logoUrl }} style={styles.logoImage} />
            </View>
            <View style={styles.badge}>
              <Text style={[styles.badgeText, { color: item.badgeColor }]}>{item.tier}</Text>
            </View>
          </View>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Text style={styles.cardMeta}>{item.cnpj}</Text>
          <Text style={styles.cardMeta}>{item.phone}</Text>
          <View style={styles.cardFooter}>
            <TouchableOpacity style={styles.viewGuestsButton} activeOpacity={0.7}>
              <Text style={styles.viewGuestsText}>Ver Convidados</Text>
            </TouchableOpacity>
            <View style={styles.guestsStack}>
              {item.initials.map((initial, index) => (
                <View key={initial} style={[styles.guestAvatar, { left: index * 18 }]}>
                  <Text style={styles.guestAvatarText}>{initial}</Text>
                </View>
              ))}
              <View style={[styles.guestCount, { left: item.initials.length * 18 + 6 }]}>
                <Text style={styles.guestCountText}>{item.guests}</Text>
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
  screen: { flex: 1, backgroundColor: '#f7f8fb' },
  content: { paddingTop: 24, paddingBottom: 32, paddingHorizontal: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  pageLabel: { fontSize: 28, fontWeight: '700', color: '#151821', marginBottom: 6 },
  subtitle: { fontSize: 15, lineHeight: 22, color: '#6c757d', width: '80%' },
  avatarContainer: { width: 48, height: 48, borderRadius: 16, backgroundColor: '#e9ecef', justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 18, fontWeight: '700', color: '#343a40' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  statsCard: { flex: 1, backgroundColor: '#ffffff', borderRadius: 22, paddingVertical: 18, paddingHorizontal: 16, marginRight: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 3 },
  statsCardWide: { flex: 1, backgroundColor: '#ffffff', borderRadius: 22, paddingVertical: 18, paddingHorizontal: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 3 },
  activeCard: { backgroundColor: '#e8faf3', marginRight: 0 },
  statsNumber: { fontSize: 28, fontWeight: '700', color: '#151821' },
  activeNumber: { color: '#12b886' },
  statsLabel: { marginTop: 8, fontSize: 12, color: '#6c757d', letterSpacing: 1 },
  activeLabel: { color: '#12b886' },
  statsLabelSmall: { fontSize: 12, textTransform: 'uppercase', color: '#8b96a5', marginBottom: 8 },
  statsValue: { fontSize: 22, fontWeight: '700', color: '#151821' },
  card: { backgroundColor: '#ffffff', borderRadius: 24, padding: 20, marginBottom: 18, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 4 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  logoCircle: { width: 42, height: 42, borderRadius: 14, justifyContent: 'center', alignItems: 'center', overflow: 'hidden', backgroundColor: '#f1f3f5' },
  logoImage: { width: 40, height: 40, resizeMode: 'contain' },
  badge: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 999, backgroundColor: '#f8f9fa' },
  badgeText: { fontSize: 12, fontWeight: '700' },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#151821', marginBottom: 10 },
  cardMeta: { fontSize: 14, color: '#6c757d', lineHeight: 22, marginBottom: 4 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 },
  viewGuestsButton: { flexDirection: 'row', alignItems: 'center' },
  viewGuestsText: { fontSize: 14, fontWeight: '700', color: '#1f8a4b' },
  viewGuestsArrow: { marginLeft: 6, fontSize: 18, color: '#1f8a4b' },
  guestsStack: { flexDirection: 'row', alignItems: 'center', marginLeft: 12 },
  guestAvatar: { position: 'absolute', width: 32, height: 32, borderRadius: 16, backgroundColor: '#dee2e6', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#f7f8fb' },
  guestAvatarText: { fontSize: 12, fontWeight: '700', color: '#343a40' },
  guestCount: { position: 'absolute', width: 34, height: 34, borderRadius: 17, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  guestCountText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  fab: { position: 'absolute', right: 20, bottom: 30, width: 56, height: 56, borderRadius: 28, backgroundColor: '#12b886', justifyContent: 'center', alignItems: 'center', ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.18, shadowRadius: 12 }, android: { elevation: 5 } }) },
  fabIcon: { color: '#ffffff', fontSize: 28, lineHeight: 32 },
});

import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import CasasShowScreen from '../screens/CasasShowScreen';
import ShowsScreen from '../screens/ShowsScreen';
import VeiculosScreen from '../screens/VeiculosScreen';
import PatrocinadoresScreen from '../screens/PatrocinadoresScreen';
import ArtistasScreen from '../screens/ArtistasScreen';
import { RootStackParamList } from './AppRoutes';

export type MainTabParamList = {
  Inicio: undefined;
  Shows: undefined;
  Espacos: undefined;
  Mais: undefined;
  Patrocinadores: undefined;
  Imprensa: undefined;
  Artistas: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();
type RootNav = NativeStackNavigationProp<RootStackParamList>;

export default function MainTabsNavigator(): React.JSX.Element {
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const rootNavigation = useNavigation<RootNav>();

  return (
    <View style={styles.container}>
      {isMoreMenuOpen ? (
        <>
          <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={() => setIsMoreMenuOpen(false)} />
          <View style={styles.moreMenu}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setIsMoreMenuOpen(false);
                rootNavigation.navigate('MainTabs', { screen: 'Artistas' });
              }}
            >
              <Text style={styles.menuItemText}>Artistas</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setIsMoreMenuOpen(false);
                rootNavigation.navigate('MainTabs', { screen: 'Patrocinadores' });
              }}
            >
              <Text style={styles.menuItemText}>Patrocinadores</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setIsMoreMenuOpen(false);
                rootNavigation.navigate('MainTabs', { screen: 'Imprensa' });
              }}
            >
              <Text style={styles.menuItemText}>Imprensa</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : null}

      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#22c58b',
          tabBarInactiveTintColor: '#222',
          tabBarStyle: {
            height: 72,
            paddingTop: 8,
            paddingBottom: 10,
            borderTopWidth: 0,
            backgroundColor: '#f3f3f4',
          },
          tabBarLabelStyle: {
            fontSize: 14,
            fontWeight: '500',
          },
        }}
      >
        <Tab.Screen name="Inicio" component={HomeScreen} options={{ title: 'Início' }} />
        <Tab.Screen name="Shows" component={ShowsScreen} options={{ title: 'Shows' }} />
        <Tab.Screen name="Espacos" component={CasasShowScreen} options={{ title: 'Espaços' }} />
        <Tab.Screen
          name="Mais"
          component={VeiculosScreen}
          options={{ title: 'Mais' }}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              e.preventDefault();
              setIsMoreMenuOpen((prev) => !prev);
            },
          })}
        />
        <Tab.Screen
          name="Patrocinadores"
          component={PatrocinadoresScreen}
          options={{
            title: 'Patrocinadores',
            tabBarButton: () => null,
            tabBarItemStyle: { display: 'none' },
          }}
        />
        <Tab.Screen
          name="Imprensa"
          component={VeiculosScreen}
          options={{
            title: 'Imprensa',
            tabBarButton: () => null,
            tabBarItemStyle: { display: 'none' },
          }}
        />
        <Tab.Screen
          name="Artistas"
          component={ArtistasScreen}
          options={{
            title: 'Artistas',
            tabBarButton: () => null,
            tabBarItemStyle: { display: 'none' },
          }}
        />
      </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 40,
  },
  moreMenu: {
    position: 'absolute',
    right: 16,
    bottom: 82,
    zIndex: 50,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    paddingVertical: 8,
    minWidth: 170,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  menuItemText: {
    fontSize: 15,
    color: '#151821',
    fontWeight: '500',
  },
});

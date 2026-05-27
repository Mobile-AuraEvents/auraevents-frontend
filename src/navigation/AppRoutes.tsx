import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import CasasShowScreen from '../screens/CasasShowScreen';
import ArtistasScreen from '../screens/ArtistasScreen';
import PatrocinadoresScreen from '../screens/PatrocinadoresScreen';
import VeiculosScreen from '../screens/VeiculosScreen';
import ShowsScreen from '../screens/ShowsScreen';

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  CasasShow: undefined;
  Artistas: undefined;
  Patrocinadores: undefined;
  Veiculos: undefined;
  Shows: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppRoutes(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
        <Stack.Screen name="CasasShow" component={CasasShowScreen} options={{ title: 'Casas de Show' }} />
        <Stack.Screen name="Artistas" component={ArtistasScreen} options={{ title: 'Artistas' }} />
        <Stack.Screen name="Patrocinadores" component={PatrocinadoresScreen} options={{ title: 'Patrocinadores' }} />
        <Stack.Screen name="Veiculos" component={VeiculosScreen} options={{ title: 'Veiculos de Imprensa' }} />
        <Stack.Screen name="Shows" component={ShowsScreen} options={{ title: 'Shows' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

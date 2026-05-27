import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ShowsScreen(): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shows</Text>
      <Text>Tela base.</Text>
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
});

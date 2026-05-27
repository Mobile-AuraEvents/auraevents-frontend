import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';

export default function LoginScreen(): React.JSX.Element {
  return (
    <View style={styles.container}>
      <View style={styles.logoCircle}>
        <Image source={require('../../assets/logo-auraev.jpg')} style={styles.logoImage} resizeMode="cover" />
      </View>

      <Text style={styles.title}>Bem-vindo de volta</Text>
      <Text style={styles.subtitle}>Acesse sua galeria de eventos e produções</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Email</Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="seu@email.com"
            placeholderTextColor="#7a7d86"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <Text style={[styles.label, styles.passwordLabel]}>Senha</Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Digite sua senha"
            placeholderTextColor="#7a7d86"
            style={styles.input}
            secureTextEntry
          />
          <Text style={styles.trailingIcon}>o</Text>
        </View>

        <TouchableOpacity activeOpacity={0.85} style={styles.loginButton}>
          <Text style={styles.loginButtonText}>ENTRAR</Text>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.8}>
          <Text style={styles.forgotText}>Esqueci minha senha</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.signUpText}>
        Ainda nao tem uma conta? <Text style={styles.signUpBold}>Solicite acesso</Text>
      </Text>

      <Text style={styles.footer}>PREMIUM PARTNER ECOSYSTEM</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#efeff2',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 72,
  },
  logoCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    borderColor: '#1d233a',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  logoText: {
    fontSize: 44,
    fontWeight: '700',
    color: '#1d233a',
  },
  logoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 55,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#12141a',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#3a3f4a',
    marginBottom: 42,
  },
  card: {
    width: '100%',
    backgroundColor: '#f5f5f6',
    borderRadius: 30,
    paddingVertical: 28,
    paddingHorizontal: 18,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  label: {
    fontSize: 17,
    fontWeight: '600',
    color: '#151821',
    marginLeft: 8,
    marginBottom: 12,
  },
  passwordLabel: {
    marginTop: 22,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8e8eb',
    borderRadius: 999,
    paddingHorizontal: 18,
    height: 64,
  },
  icon: {
    fontSize: 20,
    color: '#515562',
    width: 26,
    textAlign: 'center',
  },
  trailingIcon: {
    fontSize: 20,
    color: '#515562',
    marginLeft: 8,
  },
  input: {
    flex: 1,
    marginLeft: 14,
    fontSize: 17,
    color: '#2a2f3b',
  },
  loginButton: {
    marginTop: 28,
    height: 62,
    borderRadius: 999,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
    letterSpacing: 0.4,
  },
  forgotText: {
    textAlign: 'center',
    marginTop: 26,
    color: '#3a3f4a',
    fontSize: 17,
  },
  signUpText: {
    marginTop: 44,
    color: '#30343d',
    fontSize: 17,
  },
  signUpBold: {
    fontWeight: '700',
    color: '#0f1116',
  },
  footer: {
    marginTop: 54,
    color: '#a2a5ad',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 2,
  },
});

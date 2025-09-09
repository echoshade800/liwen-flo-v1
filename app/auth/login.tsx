import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { apiClient } from '../lib/api';
import { useCycleStore } from '../store/useCycleStore';
import { colors, radii, spacing, typography } from '../theme/tokens';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const initializeUser = useCycleStore(state => state.initializeUser);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setIsLoading(true);
    try {
      await apiClient.login(email.trim(), password);
      
      // Reload user data after successful login
      await initializeUser();
      
      // Navigate to main app
      router.replace('/');
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Login Failed', error instanceof Error ? error.message : 'Please check your credentials and try again');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = () => {
    router.push('/auth/register');
  };

  const handleSkip = () => {
    // Continue without account - go to onboarding
    router.replace('/onboarding');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.content} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to sync your data across devices</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderTextColor={colors.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                placeholderTextColor={colors.textSecondary}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity 
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons 
                  name={showPassword ? 'eye-off' : 'eye'} 
                  size={20} 
                  color={colors.textSecondary} 
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.loginButton, isLoading && styles.buttonDisabled]} 
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
            <Text style={styles.registerButtonText}>Create New Account</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipButtonText}>Continue Without Account</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing(3),
  },
  header: {
    paddingTop: spacing(8),
    paddingBottom: spacing(4),
    alignItems: 'center',
  },
  title: {
    ...typography.h1,
    color: colors.primary,
    marginBottom: spacing(1),
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  form: {
    flex: 1,
    justifyContent: 'center',
  },
  inputContainer: {
    marginBottom: spacing(3),
  },
  label: {
    ...typography.caption,
    color: colors.text,
    fontWeight: '600',
    marginBottom: spacing(1),
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: radii.medium,
    padding: spacing(2),
    ...typography.body,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.gray300,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radii.medium,
    borderWidth: 1,
    borderColor: colors.gray300,
  },
  passwordInput: {
    flex: 1,
    padding: spacing(2),
    ...typography.body,
    color: colors.text,
  },
  eyeButton: {
    padding: spacing(2),
  },
  loginButton: {
    backgroundColor: colors.primary,
    borderRadius: radii.card,
    paddingVertical: spacing(2),
    marginBottom: spacing(3),
  },
  loginButtonText: {
    ...typography.body,
    color: colors.white,
    textAlign: 'center',
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing(2),
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.gray300,
  },
  dividerText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginHorizontal: spacing(2),
  },
  registerButton: {
    backgroundColor: colors.white,
    borderRadius: radii.card,
    paddingVertical: spacing(2),
    borderWidth: 1,
    borderColor: colors.primary,
    marginBottom: spacing(2),
  },
  registerButtonText: {
    ...typography.body,
    color: colors.primary,
    textAlign: 'center',
    fontWeight: '600',
  },
  skipButton: {
    paddingVertical: spacing(1.5),
  },
  skipButtonText: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  buttonDisabled: {
    backgroundColor: colors.gray300,
  },
});
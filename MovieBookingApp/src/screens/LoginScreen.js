// src/screens/LoginScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { login } from '../services/api';
import { Button, Input } from '../components';
import { COLORS, FONTS, SPACING, RADIUS } from '../utils/theme';
import { showAlert } from '../utils/helpers';

export default function LoginScreen({ navigation }) {
  const { signIn } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Invalid email';
    if (!form.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const data = await login({ email: form.email, password: form.password });
      // Adapt to your API response shape
      const token = data.token || data.accessToken;
      const userId = data.userId || data.user?.id || data.user?._id;
      const role = data.role || data.user?.role || 'user';
      const email = form.email;
      const name = data.name || data.user?.name || '';
      await signIn({ token, userId: String(userId), role, email, name });
    } catch (error) {
      showAlert('Login Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoEmoji}>🎬</Text>
            </View>
            <Text style={styles.appName}>CineBook</Text>
            <Text style={styles.tagline}>Your Cinema, Your Way</Text>
          </View>

          {/* Form Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Welcome Back</Text>
            <Text style={styles.cardSubtitle}>Sign in to continue</Text>

            <View style={styles.form}>
              <Input
                label="Email"
                placeholder="you@example.com"
                value={form.email}
                onChangeText={(v) => setForm({ ...form, email: v })}
                keyboardType="email-address"
                error={errors.email}
              />
              <Input
                label="Password"
                placeholder="Enter your password"
                value={form.password}
                onChangeText={(v) => setForm({ ...form, password: v })}
                secureTextEntry
                error={errors.password}
              />
            </View>

            <Button
              title="Sign In"
              onPress={handleLogin}
              loading={loading}
              style={styles.loginBtn}
            />
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>New to CineBook? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.footerLink}>Create Account</Text>
            </TouchableOpacity>
          </View>

          {/* Decorative */}
          <View style={styles.decorRow}>
            {['🎭', '🍿', '🎥', '⭐'].map((e, i) => (
              <Text key={i} style={styles.decorEmoji}>{e}</Text>
            ))}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  flex: { flex: 1 },
  container: {
    flexGrow: 1,
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.xxxl,
    paddingBottom: SPACING.xxl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: { alignItems: 'center', marginBottom: SPACING.xxxl },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.primaryGlow,
    borderWidth: 2,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.base,
  },
  logoEmoji: { fontSize: 36 },
  appName: {
    fontSize: FONTS.sizes.hero,
    fontWeight: FONTS.weights.black,
    color: COLORS.text,
    letterSpacing: -1,
  },
  tagline: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },

  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xxl,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.xl,
    width: '100%',
    maxWidth: 460,
  },
  cardTitle: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.extrabold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  cardSubtitle: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xl,
  },
  form: { marginBottom: SPACING.base },
  loginBtn: { marginTop: SPACING.sm },

  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    maxWidth: 460,
  },
  footerText: { color: COLORS.textSecondary, fontSize: FONTS.sizes.base },
  footerLink: {
    color: COLORS.primary,
    fontSize: FONTS.sizes.base,
    fontWeight: FONTS.weights.bold,
  },

  decorRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.lg,
    marginTop: SPACING.xxl,
    width: '100%',
    maxWidth: 460,
  },
  decorEmoji: { fontSize: 24, opacity: 0.4 },
});

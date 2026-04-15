// src/screens/RegisterScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { register } from '../services/api';
import { Button, Input } from '../components';
import { COLORS, FONTS, SPACING, RADIUS } from '../utils/theme';

export default function RegisterScreen({ navigation }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Invalid email';
    if (!form.password) newErrors.password = 'Password is required';
    else if (form.password.length < 6) newErrors.password = 'Min 6 characters';
    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      });
      Alert.alert('Account Created! 🎉', 'Please login to continue.', [
        { text: 'Login', onPress: () => navigation.replace('Login') },
      ]);
    } catch (error) {
      Alert.alert('Registration Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  const roles = ['user', 'admin'];

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
          {/* Back */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
          >
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join the CineBook experience</Text>
          </View>

          {/* Form */}
          <View style={styles.card}>
            <Input
              label="Full Name"
              placeholder="John Doe"
              value={form.name}
              onChangeText={(v) => setForm({ ...form, name: v })}
              autoCapitalize="words"
              error={errors.name}
            />
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
              placeholder="Min. 6 characters"
              value={form.password}
              onChangeText={(v) => setForm({ ...form, password: v })}
              secureTextEntry
              error={errors.password}
            />
            <Input
              label="Confirm Password"
              placeholder="Repeat your password"
              value={form.confirmPassword}
              onChangeText={(v) => setForm({ ...form, confirmPassword: v })}
              secureTextEntry
              error={errors.confirmPassword}
            />

            {/* Role Selector */}
            <View style={styles.roleSection}>
              <Text style={styles.roleLabel}>ACCOUNT TYPE</Text>
              <View style={styles.roleRow}>
                {roles.map((r) => (
                  <TouchableOpacity
                    key={r}
                    onPress={() => setForm({ ...form, role: r })}
                    style={[
                      styles.roleBtn,
                      form.role === r && styles.roleBtnActive,
                    ]}
                  >
                    <Text style={styles.roleEmoji}>
                      {r === 'admin' ? '🛡️' : '🎟️'}
                    </Text>
                    <Text
                      style={[
                        styles.roleBtnText,
                        form.role === r && styles.roleBtnTextActive,
                      ]}
                    >
                      {r.charAt(0).toUpperCase() + r.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <Button
              title="Create Account"
              onPress={handleRegister}
              loading={loading}
              style={styles.registerBtn}
            />
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.footerLink}>Sign In</Text>
            </TouchableOpacity>
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
    paddingTop: SPACING.base,
    paddingBottom: SPACING.xxl,
  },
  backBtn: { marginBottom: SPACING.xl },
  backText: {
    color: COLORS.primary,
    fontSize: FONTS.sizes.base,
    fontWeight: FONTS.weights.semibold,
  },
  header: { marginBottom: SPACING.xl },
  title: {
    fontSize: FONTS.sizes.display,
    fontWeight: FONTS.weights.black,
    color: COLORS.text,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: FONTS.sizes.base,
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
  },

  roleSection: { marginBottom: SPACING.base },
  roleLabel: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
    letterSpacing: 0.5,
  },
  roleRow: { flexDirection: 'row', gap: SPACING.sm },
  roleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  roleBtnActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryGlow,
  },
  roleEmoji: { fontSize: 18 },
  roleBtnText: {
    fontSize: FONTS.sizes.base,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.textSecondary,
  },
  roleBtnTextActive: { color: COLORS.primary },

  registerBtn: { marginTop: SPACING.base },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: { color: COLORS.textSecondary, fontSize: FONTS.sizes.base },
  footerLink: {
    color: COLORS.primary,
    fontSize: FONTS.sizes.base,
    fontWeight: FONTS.weights.bold,
  },
});

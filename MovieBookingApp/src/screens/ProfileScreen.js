// src/screens/ProfileScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components';
import { COLORS, FONTS, SPACING, RADIUS } from '../utils/theme';
import { showConfirm } from '../utils/helpers';

const MenuItem = ({ icon, label, value, onPress, danger = false }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.7}
    style={styles.menuItem}
  >
    <Text style={styles.menuItemIcon}>{icon}</Text>
    <View style={styles.menuItemContent}>
      <Text style={[styles.menuItemLabel, danger && { color: COLORS.error }]}>
        {label}
      </Text>
      {value && <Text style={styles.menuItemValue}>{value}</Text>}
    </View>
    <Text style={styles.menuItemArrow}>›</Text>
  </TouchableOpacity>
);

export default function ProfileScreen() {
  const { user, signOut } = useAuth();

  const handleLogout = () => {
    showConfirm('Sign Out', 'Are you sure you want to sign out?', signOut);
  };

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.slice(0, 2).toUpperCase() || 'U';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.userName}>{user?.name || 'Movie Fan'}</Text>
          <Text style={styles.userEmail}>{user?.email || ''}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleBadgeText}>
              {user?.role === 'admin' ? '🛡️ Admin' : '🎟️ User'}
            </Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsCard}>
          {[
            { label: 'Movies Watched', value: '12', icon: '🎬' },
            { label: 'Seats Booked', value: '28', icon: '💺' },
            { label: 'Total Spent', value: '₹7,000', icon: '💰' },
          ].map((stat) => (
            <View key={stat.label} style={styles.statItem}>
              <Text style={styles.statIcon}>{stat.icon}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Account Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.menuCard}>
            <MenuItem icon="👤" label="Full Name" value={user?.name || 'N/A'} />
            <View style={styles.menuDivider} />
            <MenuItem icon="📧" label="Email" value={user?.email || 'N/A'} />
            <View style={styles.menuDivider} />
            <MenuItem icon="🆔" label="User ID" value={user?.userId?.slice(-8) || 'N/A'} />
            <View style={styles.menuDivider} />
            <MenuItem icon="🔑" label="Role" value={user?.role || 'user'} />
          </View>
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.menuCard}>
            <MenuItem icon="🔔" label="Notifications" value="Enabled" onPress={() => {}} />
            <View style={styles.menuDivider} />
            <MenuItem icon="🌙" label="Theme" value="Dark" onPress={() => {}} />
            <View style={styles.menuDivider} />
            <MenuItem icon="🌐" label="Language" value="English" onPress={() => {}} />
          </View>
        </View>

        {/* Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.menuCard}>
            <MenuItem icon="❓" label="Help & FAQ" onPress={() => {}} />
            <View style={styles.menuDivider} />
            <MenuItem icon="📝" label="Terms of Service" onPress={() => {}} />
            <View style={styles.menuDivider} />
            <MenuItem icon="🔒" label="Privacy Policy" onPress={() => {}} />
          </View>
        </View>

        {/* App info */}
        <View style={styles.appInfo}>
          <Text style={styles.appName}>🎬 CineBook</Text>
          <Text style={styles.appVersion}>Version 1.0.0</Text>
        </View>

        {/* Logout */}
        <Button
          title="Sign Out"
          onPress={handleLogout}
          variant="secondary"
          style={styles.logoutBtn}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  content: {
    paddingHorizontal: SPACING.base,
    paddingBottom: SPACING.xxxl,
  },

  avatarSection: { alignItems: 'center', paddingVertical: SPACING.xxxl },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primaryGlow,
    borderWidth: 3,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.base,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  avatarText: {
    fontSize: FONTS.sizes.xxxl,
    fontWeight: FONTS.weights.black,
    color: COLORS.primary,
  },
  userName: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.extrabold,
    color: COLORS.text,
  },
  userEmail: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  roleBadge: {
    marginTop: SPACING.md,
    backgroundColor: COLORS.cardElevated,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  roleBadgeText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    fontWeight: FONTS.weights.semibold,
  },

  statsCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.base,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.xl,
  },
  statItem: { flex: 1, alignItems: 'center', gap: 4 },
  statIcon: { fontSize: 20 },
  statValue: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.extrabold,
    color: COLORS.text,
  },
  statLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },

  section: { marginBottom: SPACING.xl },
  sectionTitle: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.sm,
  },
  menuCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.base,
    gap: SPACING.md,
  },
  menuItemIcon: { fontSize: 20 },
  menuItemContent: { flex: 1 },
  menuItemLabel: {
    fontSize: FONTS.sizes.base,
    color: COLORS.text,
    fontWeight: FONTS.weights.medium,
  },
  menuItemValue: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  menuItemArrow: {
    fontSize: FONTS.sizes.xl,
    color: COLORS.textMuted,
  },
  menuDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginLeft: SPACING.base + 20 + SPACING.md,
  },

  appInfo: { alignItems: 'center', marginBottom: SPACING.xl, gap: 4 },
  appName: {
    fontSize: FONTS.sizes.base,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textSecondary,
  },
  appVersion: { fontSize: FONTS.sizes.sm, color: COLORS.textMuted },

  logoutBtn: {
    borderColor: COLORS.error,
  },
});

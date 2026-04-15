// src/screens/AdminDashboardScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { getMovies } from '../services/api';
import { LoadingScreen, Button } from '../components';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../utils/theme';

export default function AdminDashboardScreen({ navigation }) {
  const { user, signOut } = useAuth();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('dashboard');

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const data = await getMovies();
      setMovies(Array.isArray(data) ? data : data.movies || []);
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: signOut },
    ]);
  };

  if (loading) return <LoadingScreen message="Loading admin panel..." />;

  const stats = [
    { icon: '🎬', label: 'Movies', value: movies.length, color: COLORS.primary },
    { icon: '👥', label: 'Users', value: '—', color: COLORS.accent },
    { icon: '🎟️', label: 'Bookings', value: '—', color: COLORS.success },
    { icon: '💰', label: 'Revenue', value: '—', color: COLORS.gold },
  ];

  const renderMovieItem = ({ item }) => (
    <View style={[styles.movieItem, SHADOWS.card]}>
      <View style={styles.movieItemLeft}>
        <Text style={styles.movieItemEmoji}>🎬</Text>
        <View>
          <Text style={styles.movieItemTitle} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.movieItemGenre}>{item.genre || 'N/A'}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.editBtn}>
        <Text style={styles.editBtnText}>Edit</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      {/* Admin Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerLabel}>Admin Panel</Text>
          <Text style={styles.headerName}>
            {user?.name || user?.email?.split('@')[0]}
          </Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tab === 'movies' ? movies : []}
        keyExtractor={(item) => String(item._id || item.id)}
        renderItem={renderMovieItem}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            {/* Stats Grid */}
            <View style={styles.statsGrid}>
              {stats.map((stat) => (
                <View
                  key={stat.label}
                  style={[styles.statCard, { borderColor: `${stat.color}44` }]}
                >
                  <Text style={styles.statCardIcon}>{stat.icon}</Text>
                  <Text style={[styles.statCardValue, { color: stat.color }]}>
                    {stat.value}
                  </Text>
                  <Text style={styles.statCardLabel}>{stat.label}</Text>
                </View>
              ))}
            </View>

            {/* Quick Actions */}
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.actionsGrid}>
              <TouchableOpacity
                style={styles.actionCard}
                onPress={() => navigation.navigate('AddMovie', { onSuccess: fetchMovies })}
              >
                <Text style={styles.actionIcon}>➕</Text>
                <Text style={styles.actionLabel}>Add Movie</Text>
                <Text style={styles.actionDesc}>Add a new movie to the catalog</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionCard}
                onPress={() => setTab('movies')}
              >
                <Text style={styles.actionIcon}>🎬</Text>
                <Text style={styles.actionLabel}>View Movies</Text>
                <Text style={styles.actionDesc}>Manage the movie catalog</Text>
              </TouchableOpacity>
            </View>

            {tab === 'movies' && (
              <View style={styles.moviesHeader}>
                <Text style={styles.sectionTitle}>
                  All Movies ({movies.length})
                </Text>
                <TouchableOpacity onPress={() => setTab('dashboard')}>
                  <Text style={styles.backLink}>← Dashboard</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        }
        ListEmptyComponent={
          tab === 'movies' ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyEmoji}>🎭</Text>
              <Text style={styles.emptyText}>No movies in catalog</Text>
              <Button
                title="Add First Movie"
                onPress={() => navigation.navigate('AddMovie', { onSuccess: fetchMovies })}
                style={styles.addFirstBtn}
              />
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.base,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.primary,
    fontWeight: FONTS.weights.bold,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  headerName: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.extrabold,
    color: COLORS.text,
  },
  logoutBtn: {
    backgroundColor: COLORS.errorGlow,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: `${COLORS.error}44`,
  },
  logoutText: {
    color: COLORS.error,
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.bold,
  },

  content: {
    paddingHorizontal: SPACING.base,
    paddingBottom: SPACING.xxxl,
  },

  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginTop: SPACING.xl,
    marginBottom: SPACING.xl,
  },
  statCard: {
    width: '47%',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.base,
    borderWidth: 1,
    alignItems: 'center',
    gap: SPACING.xs,
  },
  statCardIcon: { fontSize: 24 },
  statCardValue: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.black,
  },
  statCardLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  sectionTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.extrabold,
    color: COLORS.text,
    marginBottom: SPACING.base,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: SPACING.base,
    marginBottom: SPACING.xl,
  },
  actionCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.base,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.xs,
  },
  actionIcon: { fontSize: 28 },
  actionLabel: {
    fontSize: FONTS.sizes.base,
    fontWeight: FONTS.weights.bold,
    color: COLORS.text,
  },
  actionDesc: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },

  moviesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.base,
  },
  backLink: { color: COLORS.primary, fontSize: FONTS.sizes.sm, fontWeight: FONTS.weights.semibold },

  movieItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.base,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.sm,
  },
  movieItemLeft: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, flex: 1 },
  movieItemEmoji: { fontSize: 24 },
  movieItemTitle: {
    fontSize: FONTS.sizes.base,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.text,
    maxWidth: 180,
  },
  movieItemGenre: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary },
  editBtn: {
    backgroundColor: COLORS.cardElevated,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  editBtnText: { fontSize: FONTS.sizes.sm, color: COLORS.text, fontWeight: FONTS.weights.medium },

  emptyContainer: { alignItems: 'center', paddingVertical: SPACING.xxxl, gap: SPACING.md },
  emptyEmoji: { fontSize: 56 },
  emptyText: { fontSize: FONTS.sizes.base, color: COLORS.textSecondary },
  addFirstBtn: { width: 180, marginTop: SPACING.sm },
});

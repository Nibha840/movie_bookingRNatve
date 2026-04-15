// src/screens/HomeScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  StatusBar,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { getMovies } from '../services/api';
import { MovieCard, LoadingScreen, ErrorMessage } from '../components';
import { COLORS, FONTS, SPACING, RADIUS } from '../utils/theme';

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const [movies, setMovies] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  const fetchMovies = useCallback(async () => {
    try {
      setError(null);
      const data = await getMovies();
      const list = Array.isArray(data) ? data : data.movies || [];
      setMovies(list);
      setFiltered(list);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  useEffect(() => {
    if (!search.trim()) {
      setFiltered(movies);
    } else {
      const q = search.toLowerCase();
      setFiltered(
        movies.filter(
          (m) =>
            m.title?.toLowerCase().includes(q) ||
            m.genre?.toLowerCase().includes(q)
        )
      );
    }
  }, [search, movies]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchMovies();
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  if (loading) return <LoadingScreen message="Loading movies..." />;
  if (error && !movies.length) {
    return (
      <View style={styles.safe}>
        <ErrorMessage message={error} onRetry={fetchMovies} />
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <MovieCard
      movie={item}
      onPress={() => navigation.navigate('MovieDetails', { movie: item })}
    />
  );

  const renderHeader = () => (
    <View>
      {/* Greeting */}
      <View style={styles.greeting}>
        <View>
          <Text style={styles.greetingText}>{getGreeting()},</Text>
          <Text style={styles.userName}>
            {user?.name || user?.email?.split('@')[0] || 'Movie Fan'} 👋
          </Text>
        </View>
        <View style={styles.greetingBadge}>
          <Text style={styles.greetingBadgeText}>🎬 Now Showing</Text>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search movies or genres..."
          placeholderTextColor={COLORS.textMuted}
          value={search}
          onChangeText={setSearch}
          selectionColor={COLORS.primary}
        />
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{movies.length}</Text>
          <Text style={styles.statLabel}>Movies</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {[...new Set(movies.map((m) => m.genre).filter(Boolean))].length}
          </Text>
          <Text style={styles.statLabel}>Genres</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>₹250</Text>
          <Text style={styles.statLabel}>Per Seat</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>
        {search ? `Results (${filtered.length})` : 'All Movies'}
      </Text>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyEmoji}>🎭</Text>
      <Text style={styles.emptyTitle}>No movies found</Text>
      <Text style={styles.emptyText}>
        {search ? 'Try a different search term' : 'Pull down to refresh'}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item._id || item.id)}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  list: {
    paddingHorizontal: SPACING.base,
    paddingBottom: SPACING.xxxl,
  },

  greeting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.base,
    marginBottom: SPACING.xl,
  },
  greetingText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
  },
  userName: {
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.extrabold,
    color: COLORS.text,
  },
  greetingBadge: {
    backgroundColor: COLORS.primaryGlow,
    borderWidth: 1,
    borderColor: `${COLORS.primary}66`,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  greetingBadgeText: {
    color: COLORS.primary,
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.bold,
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.base,
    height: 48,
    marginBottom: SPACING.xl,
  },
  searchIcon: { fontSize: 16, marginRight: SPACING.sm },
  searchInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: FONTS.sizes.base,
  },

  statsRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.base,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: {
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.extrabold,
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.xs,
  },

  sectionTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.extrabold,
    color: COLORS.text,
    marginBottom: SPACING.base,
  },

  row: { justifyContent: 'space-between' },

  emptyContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.xxxl,
    gap: SPACING.md,
  },
  emptyEmoji: { fontSize: 56 },
  emptyTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.text,
  },
  emptyText: { color: COLORS.textSecondary, fontSize: FONTS.sizes.base },
});

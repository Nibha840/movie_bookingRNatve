// src/screens/MyBookingsScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { getUserBookings } from '../services/api';
import { LoadingScreen } from '../components';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../utils/theme';
import { formatCurrency, formatDate } from '../utils/helpers';

const BookingCard = ({ booking }) => {
  const seats = Array.isArray(booking.seats) ? booking.seats : [];
  const movie = booking.movie || booking.showtime?.movie || {};

  return (
    <View style={[styles.card, SHADOWS.card]}>
      {/* Header */}
      <View style={styles.cardHeader}>
        <View style={styles.cardIconContainer}>
          <Text style={styles.cardIcon}>🎬</Text>
        </View>
        <View style={styles.cardMovieInfo}>
          <Text style={styles.cardMovieTitle} numberOfLines={1}>
            {movie.title || booking.movieTitle || 'Movie'}
          </Text>
          <Text style={styles.cardMovieGenre}>
            {movie.genre || booking.genre || 'Cinema'}
          </Text>
        </View>
        <View style={styles.statusBadge}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>Confirmed</Text>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.cardDivider} />

      {/* Details */}
      <View style={styles.cardDetails}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>SEATS</Text>
          <Text style={styles.detailValue}>{seats.join(', ') || 'N/A'}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>AMOUNT</Text>
          <Text style={[styles.detailValue, styles.amount]}>
            {formatCurrency(booking.totalPrice || 0)}
          </Text>
        </View>
      </View>

      <View style={styles.cardDetails}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>BOOKED ON</Text>
          <Text style={styles.detailValue}>
            {formatDate(booking.createdAt)}
          </Text>
        </View>
      </View>

      {/* Transaction */}
      <View style={styles.txnRow}>
        <Text style={styles.txnLabel}>TXN ID: </Text>
        <Text style={styles.txnValue} numberOfLines={1}>
          {booking.transactionId || booking._id || 'N/A'}
        </Text>
      </View>
    </View>
  );
};

export default function MyBookingsScreen() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchBookings = useCallback(async () => {
    try {
      setError(null);
      const data = await getUserBookings(user?.userId);
      const list = Array.isArray(data) ? data : data.bookings || [];
      setBookings(list);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.userId]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchBookings();
  };

  if (loading) return <LoadingScreen message="Loading your bookings..." />;

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>My Bookings</Text>
      <Text style={styles.headerSubtitle}>
        {bookings.length} booking{bookings.length !== 1 ? 's' : ''}
      </Text>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyEmoji}>🎟️</Text>
      <Text style={styles.emptyTitle}>No bookings yet</Text>
      <Text style={styles.emptyText}>
        Your movie tickets will appear here after booking.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <FlatList
        data={bookings}
        keyExtractor={(item) => String(item._id || item.id || Math.random())}
        renderItem={({ item }) => <BookingCard booking={item} />}
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

  header: {
    paddingTop: SPACING.base,
    marginBottom: SPACING.xl,
  },
  headerTitle: {
    fontSize: FONTS.sizes.display,
    fontWeight: FONTS.weights.black,
    color: COLORS.text,
    letterSpacing: -1,
  },
  headerSubtitle: {
    fontSize: FONTS.sizes.base,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },

  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.base,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.base,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  cardIconContainer: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.primaryGlow,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: `${COLORS.primary}44`,
  },
  cardIcon: { fontSize: 20 },
  cardMovieInfo: { flex: 1 },
  cardMovieTitle: {
    fontSize: FONTS.sizes.base,
    fontWeight: FONTS.weights.bold,
    color: COLORS.text,
  },
  cardMovieGenre: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.successGlow,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: `${COLORS.success}44`,
    gap: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.success,
  },
  statusText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.success,
    fontWeight: FONTS.weights.bold,
  },

  cardDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginBottom: SPACING.md,
  },

  cardDetails: {
    flexDirection: 'row',
    marginBottom: SPACING.sm,
    gap: SPACING.xl,
  },
  detailItem: { flex: 1 },
  detailLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.text,
  },
  amount: { color: COLORS.success, fontSize: FONTS.sizes.base },

  txnRow: {
    flexDirection: 'row',
    marginTop: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
  },
  txnLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    fontFamily: 'monospace',
  },
  txnValue: {
    flex: 1,
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
    fontFamily: 'monospace',
  },

  emptyContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.xxxl * 2,
    gap: SPACING.md,
  },
  emptyEmoji: { fontSize: 64 },
  emptyTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.text,
  },
  emptyText: {
    fontSize: FONTS.sizes.base,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: SPACING.xl,
  },
});

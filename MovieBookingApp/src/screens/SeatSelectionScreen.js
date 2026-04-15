// src/screens/SeatSelectionScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../utils/theme';
import { PRICE_PER_SEAT, formatCurrency } from '../utils/helpers';

const ROWS = ['A', 'B'];
const COLS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Simulate some pre-booked seats
const BOOKED_SEATS = ['A3', 'A7', 'B2', 'B5', 'B9'];

export default function SeatSelectionScreen({ navigation, route }) {
  const { movie } = route.params;
  const [selectedSeats, setSelectedSeats] = useState([]);

  const toggleSeat = (seat) => {
    if (BOOKED_SEATS.includes(seat)) return;
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
  };

  const getSeatStatus = (seat) => {
    if (BOOKED_SEATS.includes(seat)) return 'booked';
    if (selectedSeats.includes(seat)) return 'selected';
    return 'available';
  };

  const totalPrice = selectedSeats.length * PRICE_PER_SEAT;

  const handleProceed = () => {
    if (!selectedSeats.length) return;
    navigation.navigate('Payment', { movie, seats: selectedSeats, totalPrice });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Select Seats</Text>
          <Text style={styles.headerSubtitle} numberOfLines={1}>
            {movie.title}
          </Text>
        </View>
        <View style={styles.seatCount}>
          <Text style={styles.seatCountText}>{selectedSeats.length}</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Screen indicator */}
        <View style={styles.screenContainer}>
          <View style={styles.screen} />
          <Text style={styles.screenLabel}>SCREEN</Text>
        </View>

        {/* Seat Grid */}
        <View style={styles.seatGrid}>
          {ROWS.map((row) => (
            <View key={row} style={styles.seatRow}>
              <Text style={styles.rowLabel}>{row}</Text>
              <View style={styles.seats}>
                {COLS.map((col) => {
                  const seat = `${row}${col}`;
                  const status = getSeatStatus(seat);
                  return (
                    <TouchableOpacity
                      key={seat}
                      onPress={() => toggleSeat(seat)}
                      disabled={status === 'booked'}
                      activeOpacity={0.7}
                      style={[styles.seat, styles[`seat_${status}`]]}
                    >
                      <Text style={[styles.seatText, status === 'selected' && styles.seatTextSelected]}>
                        {col}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ))}
        </View>

        {/* Legend */}
        <View style={styles.legend}>
          {[
            { color: COLORS.seatAvailable, label: 'Available' },
            { color: COLORS.primary, label: 'Selected' },
            { color: COLORS.seatBooked, label: 'Booked' },
          ].map((item) => (
            <View key={item.label} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: item.color }]} />
              <Text style={styles.legendText}>{item.label}</Text>
            </View>
          ))}
        </View>

        {/* Showtime Info */}
        <View style={styles.showtimeCard}>
          <Text style={styles.showtimeTitle}>🕐 Show Details</Text>
          <View style={styles.showtimeGrid}>
            {[
              { label: 'Date', value: 'Today' },
              { label: 'Show', value: '7:30 PM' },
              { label: 'Hall', value: 'Audi 1' },
              { label: 'Type', value: '2D' },
            ].map((item) => (
              <View key={item.label} style={styles.showtimeItem}>
                <Text style={styles.showtimeLabel}>{item.label}</Text>
                <Text style={styles.showtimeValue}>{item.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Selected Seats */}
        {selectedSeats.length > 0 && (
          <View style={styles.selectedCard}>
            <Text style={styles.selectedTitle}>Selected Seats</Text>
            <View style={styles.selectedSeatsRow}>
              {selectedSeats.map((seat) => (
                <View key={seat} style={styles.selectedSeatBadge}>
                  <Text style={styles.selectedSeatBadgeText}>{seat}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom Checkout */}
      <View style={styles.checkout}>
        <View style={styles.checkoutInfo}>
          <Text style={styles.checkoutSeats}>
            {selectedSeats.length} seat{selectedSeats.length !== 1 ? 's' : ''} × ₹{PRICE_PER_SEAT}
          </Text>
          <Text style={styles.checkoutTotal}>{formatCurrency(totalPrice)}</Text>
        </View>
        <Button
          title="Proceed to Pay"
          onPress={handleProceed}
          disabled={!selectedSeats.length}
          style={styles.checkoutBtn}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.base,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  backBtnText: { color: COLORS.text, fontSize: FONTS.sizes.xl },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: {
    fontSize: FONTS.sizes.base,
    fontWeight: FONTS.weights.bold,
    color: COLORS.text,
  },
  headerSubtitle: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    maxWidth: 180,
  },
  seatCount: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primaryGlow,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  seatCountText: {
    color: COLORS.primary,
    fontWeight: FONTS.weights.extrabold,
    fontSize: FONTS.sizes.base,
  },

  content: { padding: SPACING.base, paddingBottom: 0 },

  screenContainer: { alignItems: 'center', marginBottom: SPACING.xl },
  screen: {
    width: '80%',
    height: 4,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.full,
    opacity: 0.6,
    marginBottom: SPACING.sm,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 6,
  },
  screenLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    letterSpacing: 3,
    textTransform: 'uppercase',
  },

  seatGrid: { alignItems: 'center', marginBottom: SPACING.xl },
  seatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  rowLabel: {
    width: 20,
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
    fontWeight: FONTS.weights.bold,
    marginRight: SPACING.sm,
    textAlign: 'center',
  },
  seats: {
    flexDirection: 'row',
    gap: 6,
  },
  seat: {
    width: 28,
    height: 28,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  seat_available: {
    backgroundColor: COLORS.seatAvailable,
    borderColor: COLORS.borderLight,
  },
  seat_selected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primaryDark,
    ...SHADOWS.glow,
  },
  seat_booked: {
    backgroundColor: COLORS.seatBooked,
    borderColor: COLORS.seatBooked,
    opacity: 0.4,
  },
  seatText: {
    fontSize: 9,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textMuted,
  },
  seatTextSelected: { color: COLORS.text },

  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.xl,
    marginBottom: SPACING.xl,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  legendDot: { width: 12, height: 12, borderRadius: RADIUS.sm },
  legendText: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary },

  showtimeCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.base,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.base,
  },
  showtimeTitle: {
    fontSize: FONTS.sizes.base,
    fontWeight: FONTS.weights.bold,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  showtimeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  showtimeItem: { width: '50%', marginBottom: SPACING.sm },
  showtimeLabel: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 },
  showtimeValue: { fontSize: FONTS.sizes.base, fontWeight: FONTS.weights.semibold, color: COLORS.text },

  selectedCard: {
    backgroundColor: COLORS.primaryGlow,
    borderRadius: RADIUS.xl,
    padding: SPACING.base,
    borderWidth: 1,
    borderColor: `${COLORS.primary}44`,
    marginBottom: SPACING.base,
  },
  selectedTitle: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.bold,
    color: COLORS.primary,
    marginBottom: SPACING.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  selectedSeatsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  selectedSeatBadge: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  selectedSeatBadgeText: {
    color: COLORS.text,
    fontWeight: FONTS.weights.extrabold,
    fontSize: FONTS.sizes.sm,
  },

  checkout: {
    padding: SPACING.base,
    paddingBottom: SPACING.xl,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.surface,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.base,
  },
  checkoutInfo: { flex: 1 },
  checkoutSeats: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  checkoutTotal: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.extrabold,
    color: COLORS.text,
  },
  checkoutBtn: { width: 160 },
});

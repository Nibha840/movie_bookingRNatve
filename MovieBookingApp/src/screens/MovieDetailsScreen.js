// src/screens/MovieDetailsScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Badge } from '../components';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../utils/theme';

const { width, height } = Dimensions.get('window');
const POSTER_HEIGHT = height * 0.45;

export default function MovieDetailsScreen({ navigation, route }) {
  const { movie } = route.params;

  const handleBookTicket = () => {
    navigation.navigate('SeatSelection', { movie });
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Poster Hero */}
      <View style={styles.posterContainer}>
        {movie.poster_url ? (
          <Image
            source={{ uri: movie.poster_url }}
            style={styles.poster}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.posterPlaceholder}>
            <Text style={styles.posterEmoji}>🎬</Text>
          </View>
        )}
        {/* Gradient overlay */}
        <View style={styles.posterGradient} />

        {/* Back Button */}
        <SafeAreaView style={styles.backArea}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
          >
            <Text style={styles.backBtnText}>←</Text>
          </TouchableOpacity>
        </SafeAreaView>

        {/* Genre Badge on poster */}
        <View style={styles.genreBadgeOnPoster}>
          <Badge label={movie.genre || 'Movie'} color={COLORS.accent} />
        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentInner}
        showsVerticalScrollIndicator={false}
      >
        {/* Title & Meta */}
        <View style={styles.titleRow}>
          <View style={styles.titleBlock}>
            <Text style={styles.title}>{movie.title}</Text>
            <Text style={styles.id}>ID: {movie._id || movie.id || 'N/A'}</Text>
          </View>
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingEmoji}>⭐</Text>
            <Text style={styles.ratingText}>4.5</Text>
          </View>
        </View>

        {/* Info Chips */}
        <View style={styles.chips}>
          {[
            { icon: '🎭', label: movie.genre || 'Drama' },
            { icon: '⏱️', label: '2h 15m' },
            { icon: '🔞', label: 'UA' },
          ].map((chip, i) => (
            <View key={i} style={styles.chip}>
              <Text style={styles.chipEmoji}>{chip.icon}</Text>
              <Text style={styles.chipText}>{chip.label}</Text>
            </View>
          ))}
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Synopsis</Text>
          <Text style={styles.description}>
            {movie.description || 'No description available for this movie.'}
          </Text>
        </View>

        {/* Pricing Info */}
        <View style={styles.pricingCard}>
          <View style={styles.pricingRow}>
            <Text style={styles.pricingIcon}>🎟️</Text>
            <View>
              <Text style={styles.pricingLabel}>Price Per Seat</Text>
              <Text style={styles.pricingValue}>₹250</Text>
            </View>
          </View>
          <View style={styles.pricingDivider} />
          <View style={styles.pricingRow}>
            <Text style={styles.pricingIcon}>🏟️</Text>
            <View>
              <Text style={styles.pricingLabel}>Available Seats</Text>
              <Text style={styles.pricingValue}>A1–A10, B1–B10</Text>
            </View>
          </View>
        </View>

        {/* CTA */}
        <Button
          title="🎫  Book My Ticket"
          onPress={handleBookTicket}
          style={styles.bookBtn}
        />

        <Text style={styles.disclaimer}>
          *Seats are subject to availability. Booking is non-refundable.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },

  posterContainer: {
    height: POSTER_HEIGHT,
    position: 'relative',
  },
  poster: {
    width: '100%',
    height: '100%',
  },
  posterPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  posterEmoji: { fontSize: 80 },
  posterGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(10,10,15,1) 100%)',
    // For RN: use bottom gradient effect
    borderBottomWidth: 0,
    opacity: 0.7,
  },

  backArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  backBtn: {
    margin: SPACING.base,
    width: 42,
    height: 42,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  backBtnText: {
    color: COLORS.text,
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.bold,
  },

  genreBadgeOnPoster: {
    position: 'absolute',
    bottom: SPACING.base,
    left: SPACING.base,
  },

  content: { flex: 1 },
  contentInner: {
    padding: SPACING.base,
    paddingBottom: SPACING.xxxl,
  },

  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.base,
  },
  titleBlock: { flex: 1, marginRight: SPACING.base },
  title: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.black,
    color: COLORS.text,
    letterSpacing: -0.5,
    lineHeight: 30,
  },
  id: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accentGlow,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderWidth: 1,
    borderColor: `${COLORS.accent}55`,
    gap: 4,
  },
  ratingEmoji: { fontSize: 14 },
  ratingText: {
    color: COLORS.accent,
    fontWeight: FONTS.weights.bold,
    fontSize: FONTS.sizes.md,
  },

  chips: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 4,
  },
  chipEmoji: { fontSize: 12 },
  chipText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    fontWeight: FONTS.weights.medium,
  },

  section: { marginBottom: SPACING.xl },
  sectionLabel: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.sm,
  },
  description: {
    fontSize: FONTS.sizes.base,
    color: COLORS.textSecondary,
    lineHeight: 24,
  },

  pricingCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.base,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.xl,
  },
  pricingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  pricingIcon: { fontSize: 24 },
  pricingLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  pricingValue: {
    fontSize: FONTS.sizes.base,
    fontWeight: FONTS.weights.bold,
    color: COLORS.text,
  },
  pricingDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: SPACING.xs,
  },

  bookBtn: { marginBottom: SPACING.md },
  disclaimer: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 16,
  },
});

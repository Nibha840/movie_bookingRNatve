// src/components/index.js
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  TextInput,
  Image,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../utils/theme';

// Max content width for web layout
const MAX_CONTENT_WIDTH = 1400;

// ─── BUTTON ──────────────────────────────────────────────────────────────────
export const Button = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
  style,
  textStyle,
  icon,
}) => {
  const variants = {
    primary: {
      bg: COLORS.primary,
      text: COLORS.text,
      border: 'transparent',
    },
    secondary: {
      bg: 'transparent',
      text: COLORS.primary,
      border: COLORS.primary,
    },
    ghost: {
      bg: COLORS.cardElevated,
      text: COLORS.text,
      border: COLORS.border,
    },
    success: {
      bg: COLORS.success,
      text: COLORS.text,
      border: 'transparent',
    },
  };

  const v = variants[variant] || variants.primary;
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      style={[
        styles.button,
        {
          backgroundColor: v.bg,
          borderColor: v.border,
          borderWidth: v.border !== 'transparent' ? 1.5 : 0,
          opacity: isDisabled ? 0.6 : 1,
        },
        variant === 'primary' && SHADOWS.glow,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={v.text} size="small" />
      ) : (
        <View style={styles.buttonContent}>
          {icon && <View style={styles.buttonIcon}>{icon}</View>}
          <Text style={[styles.buttonText, { color: v.text }, textStyle]}>
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

// ─── INPUT ───────────────────────────────────────────────────────────────────
export const Input = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType,
  autoCapitalize = 'none',
  error,
  icon,
  style,
}) => {
  return (
    <View style={[styles.inputContainer, style]}>
      {label && <Text style={styles.inputLabel}>{label}</Text>}
      <View style={[styles.inputWrapper, error && { borderColor: COLORS.error }]}>
        {icon && typeof icon === 'string' ? (
          <Text style={styles.inputIcon}>{icon}</Text>
        ) : (
          icon && <View style={styles.inputIcon}>{icon}</View>
        )}
        <TextInput
          style={[styles.input, icon && { paddingLeft: SPACING.xs }]}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textMuted}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          selectionColor={COLORS.primary}
        />
      </View>
      {error && <Text style={styles.inputError}>{error}</Text>}
    </View>
  );
};

// ─── CARD ────────────────────────────────────────────────────────────────────
export const Card = ({ children, style, onPress }) => {
  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.85}
        style={[styles.card, SHADOWS.card, style]}
      >
        {children}
      </TouchableOpacity>
    );
  }
  return <View style={[styles.card, SHADOWS.card, style]}>{children}</View>;
};

// ─── BADGE ───────────────────────────────────────────────────────────────────
export const Badge = ({ label, color = COLORS.primary }) => (
  <View style={[styles.badge, { backgroundColor: `${color}22`, borderColor: `${color}55` }]}>
    <Text style={[styles.badgeText, { color }]}>{label}</Text>
  </View>
);

// ─── MOVIE CARD ──────────────────────────────────────────────────────────────
export const MovieCard = ({ movie, onPress, numColumns = 2 }) => {
  const { width: windowWidth } = useWindowDimensions();

  // On web, cap content area to MAX_CONTENT_WIDTH for a cleaner look
  const isWeb = Platform.OS === 'web';
  const contentWidth = isWeb ? Math.min(windowWidth, MAX_CONTENT_WIDTH) : windowWidth;
  // Calculate card width: total width minus padding and gaps between cards
  const totalGap = SPACING.base * (numColumns + 1); // padding + gaps
  const cardWidth = (contentWidth - totalGap) / numColumns;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[styles.movieCard, { width: cardWidth }, SHADOWS.card]}
    >
      <View style={styles.movieImageContainer}>
        {movie.poster_url ? (
          <Image
            source={{ uri: movie.poster_url }}
            style={styles.movieImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.movieImagePlaceholder}>
            <Text style={styles.movieImagePlaceholderIcon}>🎬</Text>
          </View>
        )}
        <View style={styles.movieImageOverlay} />
        <View style={styles.movieGenreBadge}>
          <Badge label={movie.genre || 'Movie'} color={COLORS.accent} />
        </View>
      </View>
      <View style={styles.movieInfo}>
        <Text style={styles.movieTitle} numberOfLines={2}>
          {movie.title}
        </Text>
        <Text style={styles.movieDesc} numberOfLines={2}>
          {movie.description}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

// ─── LOADING SCREEN ──────────────────────────────────────────────────────────
export const LoadingScreen = ({ message = 'Loading...' }) => (
  <View style={styles.loadingScreen}>
    <ActivityIndicator size="large" color={COLORS.primary} />
    <Text style={styles.loadingText}>{message}</Text>
  </View>
);

// ─── ERROR MESSAGE ───────────────────────────────────────────────────────────
export const ErrorMessage = ({ message, onRetry }) => (
  <View style={styles.errorContainer}>
    <Text style={styles.errorEmoji}>⚠️</Text>
    <Text style={styles.errorTitle}>Oops!</Text>
    <Text style={styles.errorText}>{message}</Text>
    {onRetry && (
      <Button title="Try Again" onPress={onRetry} style={styles.retryBtn} />
    )}
  </View>
);

// ─── SECTION HEADER ──────────────────────────────────────────────────────────
export const SectionHeader = ({ title, subtitle }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {subtitle && <Text style={styles.sectionSubtitle}>{subtitle}</Text>}
  </View>
);

// ─── DIVIDER ─────────────────────────────────────────────────────────────────
export const Divider = ({ style }) => (
  <View style={[styles.divider, style]} />
);

// ─── STYLES ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  // Button
  button: {
    height: 52,
    borderRadius: RADIUS.lg,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  buttonIcon: { marginRight: SPACING.xs },
  buttonText: {
    fontSize: FONTS.sizes.base,
    fontWeight: FONTS.weights.bold,
    letterSpacing: 0.5,
  },

  // Input
  inputContainer: { marginBottom: SPACING.base },
  inputLabel: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.semibold,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.base,
    height: 52,
  },
  inputIcon: { marginRight: SPACING.sm },
  input: {
    flex: 1,
    color: COLORS.text,
    fontSize: FONTS.sizes.base,
  },
  inputError: {
    color: COLORS.error,
    fontSize: FONTS.sizes.sm,
    marginTop: SPACING.xs,
  },

  // Card
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.base,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  // Badge
  badge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weights.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Movie Card
  movieCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    marginBottom: SPACING.base,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  movieImageContainer: {
    height: 200,
    position: 'relative',
  },
  movieImage: {
    width: '100%',
    height: '100%',
  },
  movieImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.cardElevated,
    justifyContent: 'center',
    alignItems: 'center',
  },
  movieImagePlaceholderIcon: { fontSize: 48 },
  movieImageOverlay: {
    ...StyleSheet.absoluteFillObject,
    background:
      'linear-gradient(to bottom, transparent 50%, rgba(10,10,15,0.9) 100%)',
    backgroundColor: 'transparent',
  },
  movieGenreBadge: {
    position: 'absolute',
    top: SPACING.sm,
    left: SPACING.sm,
  },
  movieInfo: { padding: SPACING.md },
  movieTitle: {
    fontSize: FONTS.sizes.base,
    fontWeight: FONTS.weights.bold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  movieDesc: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },

  // Loading
  loadingScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    gap: SPACING.base,
  },
  loadingText: {
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.base,
  },

  // Error
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xxl,
    gap: SPACING.md,
  },
  errorEmoji: { fontSize: 48 },
  errorTitle: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.bold,
    color: COLORS.text,
  },
  errorText: {
    fontSize: FONTS.sizes.base,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  retryBtn: { marginTop: SPACING.base, width: 160 },

  // Section
  sectionHeader: { marginBottom: SPACING.base },
  sectionTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.extrabold,
    color: COLORS.text,
  },
  sectionSubtitle: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.base,
  },
});

// src/screens/WelcomeScreen.js
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Animated,
  Platform,
  useWindowDimensions,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components';
import { COLORS, FONTS, SPACING, RADIUS } from '../utils/theme';

export default function WelcomeScreen({ navigation }) {
  const { width: windowWidth } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const isWide = windowWidth > 768;

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const glowAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 0.7,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.3,
          duration: 1800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Wide screen = side-by-side layout, narrow = stacked
  if (isWide) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

        {/* Decorative BG circles */}
        <Animated.View style={[styles.floatingCircle, styles.circle1, { opacity: glowAnim }]} />
        <Animated.View style={[styles.floatingCircle, styles.circle2, { opacity: glowAnim }]} />
        <Animated.View style={[styles.floatingCircle, styles.circle3, { opacity: glowAnim }]} />

        <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
          <View style={styles.wideLayout}>

            {/* LEFT — Branding & info */}
            <Animated.View
              style={[
                styles.wideLeft,
                { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
              ]}
            >
              <View style={styles.logoWrapper}>
                <Animated.View style={[styles.logoGlow, styles.logoGlowLarge, { opacity: glowAnim }]} />
                <View style={[styles.logoContainer, styles.logoLarge]}>
                  <Text style={styles.logoEmojiLarge}>🎬</Text>
                </View>
              </View>

              <Text style={styles.appNameLarge}>CineBook</Text>
              <Text style={styles.taglineLarge}>Your Cinema, Your Way</Text>

              <View style={styles.dividerLine} />

              <Text style={styles.headlineLarge}>
                Book Your Perfect{'\n'}
                <Text style={styles.headlineAccent}>Movie Experience</Text>
              </Text>

              <Text style={styles.descriptionLarge}>
                Browse movies, pick your favorite seats, pay securely with Razorpay, and get instant booking confirmation — all in one place.
              </Text>

              {/* Feature cards */}
              <View style={styles.featureGrid}>
                {[
                  { icon: '🎥', title: 'Browse', desc: '37+ Movies' },
                  { icon: '💺', title: 'Select', desc: 'Pick Seats' },
                  { icon: '💳', title: 'Pay', desc: 'Razorpay' },
                  { icon: '🎫', title: 'Book', desc: 'Get Tickets' },
                ].map((item, i) => (
                  <View key={i} style={styles.featureCard}>
                    <Text style={styles.featureCardIcon}>{item.icon}</Text>
                    <Text style={styles.featureCardTitle}>{item.title}</Text>
                    <Text style={styles.featureCardDesc}>{item.desc}</Text>
                  </View>
                ))}
              </View>
            </Animated.View>

            {/* RIGHT — CTA */}
            <Animated.View
              style={[
                styles.wideRight,
                { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
              ]}
            >
              <View style={styles.ctaCard}>
                <Text style={styles.ctaCardTitle}>Ready to Watch?</Text>
                <Text style={styles.ctaCardSubtitle}>
                  Join thousands of movie lovers. Create your account or sign in to start booking.
                </Text>

                <Button
                  title="🚀  Get Started — It's Free"
                  onPress={() => navigation.navigate('Register')}
                  style={styles.primaryBtnLarge}
                />
                <Button
                  title="I Already Have an Account"
                  onPress={() => navigation.navigate('Login')}
                  variant="ghost"
                  style={styles.secondaryBtnLarge}
                />

                <View style={styles.trustRowWide}>
                  {[
                    { icon: '🔒', text: 'Secure Payments' },
                    { icon: '⚡', text: 'Instant Booking' },
                    { icon: '📧', text: 'Email Confirmation' },
                  ].map((item, i) => (
                    <View key={i} style={styles.trustItemWide}>
                      <Text style={styles.trustIconWide}>{item.icon}</Text>
                      <Text style={styles.trustTextWide}>{item.text}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </Animated.View>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  // MOBILE layout (stacked)
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <Animated.View style={[styles.floatingCircle, styles.circle1, { opacity: glowAnim }]} />
      <Animated.View style={[styles.floatingCircle, styles.circle2, { opacity: glowAnim }]} />

      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.mobileContent}>

          <Animated.View
            style={[styles.heroSection, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}
          >
            <View style={styles.logoWrapper}>
              <Animated.View style={[styles.logoGlow, { opacity: glowAnim }]} />
              <View style={styles.logoContainer}>
                <Text style={styles.logoEmoji}>🎬</Text>
              </View>
            </View>
            <Text style={styles.appName}>CineBook</Text>
            <Text style={styles.tagline}>Your Cinema, Your Way</Text>

            <View style={styles.featurePills}>
              {[
                { icon: '🎥', label: 'Movies' },
                { icon: '💺', label: 'Seats' },
                { icon: '💳', label: 'Pay' },
                { icon: '🎫', label: 'Tickets' },
              ].map((item, index) => (
                <View key={index} style={styles.pill}>
                  <Text style={styles.pillIcon}>{item.icon}</Text>
                  <Text style={styles.pillLabel}>{item.label}</Text>
                </View>
              ))}
            </View>
          </Animated.View>

          <Animated.View
            style={[styles.descSection, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
          >
            <Text style={styles.headline}>
              Book Your Perfect{'\n'}
              <Text style={styles.headlineAccent}>Movie Experience</Text>
            </Text>
            <Text style={styles.description}>
              Browse movies, pick your seats, pay securely, and get instant booking confirmation.
            </Text>
          </Animated.View>

          <Animated.View
            style={[styles.ctaSection, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
          >
            <Button
              title="Get Started"
              onPress={() => navigation.navigate('Register')}
              style={styles.primaryBtn}
            />
            <Button
              title="I Already Have an Account"
              onPress={() => navigation.navigate('Login')}
              variant="ghost"
              style={styles.secondaryBtn}
            />

            <View style={styles.trustRow}>
              {[
                { icon: '🔒', text: 'Secure' },
                { icon: '⚡', text: 'Instant' },
                { icon: '📧', text: 'Email' },
              ].map((item, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <View style={styles.trustDot} />}
                  <View style={styles.trustItem}>
                    <Text style={styles.trustIcon}>{item.icon}</Text>
                    <Text style={styles.trustText}>{item.text}</Text>
                  </View>
                </React.Fragment>
              ))}
            </View>
          </Animated.View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    overflow: 'hidden',
  },
  safe: { flex: 1 },

  // ── Decorative circles ──
  floatingCircle: {
    position: 'absolute',
    borderRadius: RADIUS.full,
  },
  circle1: {
    width: 400,
    height: 400,
    backgroundColor: COLORS.primaryGlow,
    top: -120,
    right: -120,
  },
  circle2: {
    width: 300,
    height: 300,
    backgroundColor: 'rgba(229,9,20,0.08)',
    bottom: -60,
    left: -100,
  },
  circle3: {
    width: 250,
    height: 250,
    backgroundColor: 'rgba(245,166,35,0.06)',
    top: '50%',
    right: -80,
  },

  // ════════════════════════════════════════════════════════
  // WIDE / DESKTOP LAYOUT
  // ════════════════════════════════════════════════════════
  wideLayout: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 60,
    gap: 60,
  },

  // Left column
  wideLeft: {
    flex: 1,
    paddingRight: 20,
  },
  logoLarge: {
    width: 110,
    height: 110,
    borderRadius: RADIUS.xxl,
  },
  logoEmojiLarge: { fontSize: 52 },
  logoGlowLarge: {
    width: 140,
    height: 140,
    top: -15,
    left: -15,
  },
  appNameLarge: {
    fontSize: 56,
    fontWeight: FONTS.weights.black,
    color: COLORS.text,
    letterSpacing: -2,
  },
  taglineLarge: {
    fontSize: FONTS.sizes.lg,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  dividerLine: {
    width: 60,
    height: 3,
    backgroundColor: COLORS.primary,
    borderRadius: 2,
    marginVertical: SPACING.xl,
  },
  headlineLarge: {
    fontSize: 36,
    fontWeight: FONTS.weights.extrabold,
    color: COLORS.text,
    lineHeight: 46,
    letterSpacing: -0.5,
  },
  descriptionLarge: {
    fontSize: FONTS.sizes.lg,
    color: COLORS.textSecondary,
    lineHeight: 28,
    marginTop: SPACING.base,
    maxWidth: 500,
  },

  // Feature grid
  featureGrid: {
    flexDirection: 'row',
    marginTop: SPACING.xxl,
    gap: SPACING.md,
  },
  featureCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.base,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    minWidth: 100,
    flex: 1,
  },
  featureCardIcon: { fontSize: 28, marginBottom: SPACING.xs },
  featureCardTitle: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.bold,
    color: COLORS.text,
  },
  featureCardDesc: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    marginTop: 2,
  },

  // Right column — CTA card
  wideRight: {
    width: 420,
    flexShrink: 0,
  },
  ctaCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xxl,
    padding: SPACING.xxl,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  ctaCardTitle: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: FONTS.weights.extrabold,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  ctaCardSubtitle: {
    fontSize: FONTS.sizes.base,
    color: COLORS.textSecondary,
    lineHeight: 24,
    marginBottom: SPACING.xxl,
  },
  primaryBtnLarge: {
    height: 56,
    borderRadius: RADIUS.xl,
    marginBottom: SPACING.md,
  },
  secondaryBtnLarge: {
    height: 52,
    borderRadius: RADIUS.xl,
  },
  trustRowWide: {
    marginTop: SPACING.xl,
    gap: SPACING.md,
  },
  trustItemWide: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  trustIconWide: { fontSize: 16 },
  trustTextWide: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
    fontWeight: FONTS.weights.medium,
  },

  // ════════════════════════════════════════════════════════
  // MOBILE LAYOUT
  // ════════════════════════════════════════════════════════
  mobileContent: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  // Logo
  logoWrapper: { position: 'relative', marginBottom: SPACING.lg },
  logoGlow: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary,
    top: -10,
    left: -10,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: RADIUS.xxl,
    backgroundColor: COLORS.card,
    borderWidth: 2.5,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  logoEmoji: { fontSize: 46 },

  heroSection: {
    alignItems: 'center',
    paddingTop: SPACING.xxxl,
  },
  appName: {
    fontSize: 48,
    fontWeight: FONTS.weights.black,
    color: COLORS.text,
    letterSpacing: -2,
  },
  tagline: {
    fontSize: FONTS.sizes.base,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
    letterSpacing: 1,
  },
  featurePills: {
    flexDirection: 'row',
    marginTop: SPACING.xl,
    gap: SPACING.sm,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  pillIcon: { fontSize: 12 },
  pillLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
    fontWeight: FONTS.weights.semibold,
  },

  descSection: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  headline: {
    fontSize: FONTS.sizes.xxxl,
    fontWeight: FONTS.weights.extrabold,
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: 38,
    letterSpacing: -0.5,
  },
  headlineAccent: {
    color: COLORS.primary,
  },
  description: {
    fontSize: FONTS.sizes.base,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginTop: SPACING.base,
    paddingHorizontal: SPACING.sm,
  },

  ctaSection: {
    width: '100%',
    maxWidth: 400,
    paddingBottom: SPACING.xl,
    gap: SPACING.md,
  },
  primaryBtn: {
    height: 56,
    borderRadius: RADIUS.xl,
  },
  secondaryBtn: {
    height: 52,
    borderRadius: RADIUS.xl,
  },
  trustRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.base,
    gap: SPACING.sm,
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trustIcon: { fontSize: 12 },
  trustText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    fontWeight: FONTS.weights.medium,
  },
  trustDot: {
    width: 3,
    height: 3,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.textMuted,
  },
});

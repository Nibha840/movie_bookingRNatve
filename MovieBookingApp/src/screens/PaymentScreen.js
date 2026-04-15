// src/screens/PaymentScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { processPayment } from '../services/api';
import { Button, Input } from '../components';
import { COLORS, FONTS, SPACING, RADIUS } from '../utils/theme';
import { formatCurrency, generateTransactionId } from '../utils/helpers';

const UPI_APPS = [
  { name: 'GPay', emoji: '💳', hint: 'example@gpay' },
  { name: 'PhonePe', emoji: '📱', hint: 'example@phonepe' },
  { name: 'Paytm', emoji: '💰', hint: 'example@paytm' },
  { name: 'BHIM', emoji: '🏦', hint: 'example@upi' },
];

export default function PaymentScreen({ navigation, route }) {
  const { movie, seats, totalPrice } = route.params;
  const [upiId, setUpiId] = useState('');
  const [upiError, setUpiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);

  const validateUpi = () => {
    if (!upiId.trim()) {
      setUpiError('UPI ID is required');
      return false;
    }
    if (!upiId.includes('@')) {
      setUpiError('Enter a valid UPI ID (e.g., name@upi)');
      return false;
    }
    setUpiError('');
    return true;
  };

  const handlePay = async () => {
    if (!validateUpi()) return;
    setLoading(true);

    try {
      // Simulate 2 second payment processing
      await new Promise((res) => setTimeout(res, 2000));
      const data = await processPayment({ upiId, amount: totalPrice });
      const transactionId = data?.transactionId || generateTransactionId();
      navigation.replace('BookingConfirmation', {
        movie,
        seats,
        totalPrice,
        transactionId,
        upiId,
      });
    } catch (error) {
      Alert.alert(
        'Payment Failed ❌',
        error.message || 'Transaction could not be processed. Please try again.',
        [{ text: 'Retry', style: 'destructive' }, { text: 'Cancel', onPress: () => navigation.goBack() }]
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Secure Payment</Text>
        <View style={styles.secureTag}>
          <Text style={styles.secureTagText}>🔒 SSL</Text>
        </View>
      </View>

      {/* Loading Overlay */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingTitle}>Processing Payment...</Text>
            <Text style={styles.loadingSubtitle}>
              Please do not press back or close the app
            </Text>
            <View style={styles.loadingDots}>
              {[0, 1, 2].map((i) => (
                <View key={i} style={[styles.loadingDot, { opacity: 0.3 + i * 0.3 }]} />
              ))}
            </View>
          </View>
        </View>
      )}

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        style={{ pointerEvents: loading ? 'none' : 'auto' }}
      >
        {/* Order Summary */}
        <View style={styles.orderCard}>
          <Text style={styles.orderTitle}>Order Summary</Text>
          <View style={styles.orderRow}>
            <Text style={styles.orderLabel}>Movie</Text>
            <Text style={styles.orderValue} numberOfLines={1}>{movie.title}</Text>
          </View>
          <View style={styles.orderRow}>
            <Text style={styles.orderLabel}>Seats</Text>
            <Text style={styles.orderValue}>{seats.join(', ')}</Text>
          </View>
          <View style={styles.orderRow}>
            <Text style={styles.orderLabel}>Quantity</Text>
            <Text style={styles.orderValue}>{seats.length} × ₹250</Text>
          </View>
          <View style={[styles.orderRow, styles.orderTotal]}>
            <Text style={styles.orderTotalLabel}>Total Amount</Text>
            <Text style={styles.orderTotalValue}>{formatCurrency(totalPrice)}</Text>
          </View>
        </View>

        {/* UPI App Selector */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pay With UPI</Text>
          <View style={styles.upiAppsGrid}>
            {UPI_APPS.map((app) => (
              <TouchableOpacity
                key={app.name}
                onPress={() => {
                  setSelectedApp(app.name);
                  setUpiId('');
                }}
                style={[
                  styles.upiApp,
                  selectedApp === app.name && styles.upiAppSelected,
                ]}
              >
                <Text style={styles.upiAppEmoji}>{app.emoji}</Text>
                <Text style={[
                  styles.upiAppName,
                  selectedApp === app.name && styles.upiAppNameSelected,
                ]}>{app.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* UPI ID Input */}
        <View style={styles.section}>
          <Input
            label="UPI ID"
            placeholder={
              selectedApp
                ? UPI_APPS.find((a) => a.name === selectedApp)?.hint
                : 'yourname@upi'
            }
            value={upiId}
            onChangeText={(v) => { setUpiId(v); setUpiError(''); }}
            keyboardType="email-address"
            error={upiError}
          />
        </View>

        {/* Pay Securely note */}
        <View style={styles.secureNote}>
          <Text style={styles.secureNoteIcon}>🔐</Text>
          <Text style={styles.secureNoteText}>
            Your payment is encrypted and secured. We never store your UPI credentials.
          </Text>
        </View>

        {/* Pay Button */}
        <Button
          title={`Pay ${formatCurrency(totalPrice)}`}
          onPress={handlePay}
          loading={loading}
          style={styles.payBtn}
        />

        <Text style={styles.disclaimer}>
          By proceeding, you agree to our Terms of Service and Refund Policy.
        </Text>
      </ScrollView>
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
    marginRight: SPACING.sm,
  },
  backBtnText: { color: COLORS.text, fontSize: FONTS.sizes.xl },
  headerTitle: {
    flex: 1,
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color: COLORS.text,
  },
  secureTag: {
    backgroundColor: COLORS.successGlow,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: `${COLORS.success}55`,
  },
  secureTagText: { color: COLORS.success, fontSize: FONTS.sizes.xs, fontWeight: FONTS.weights.bold },

  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  loadingCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xxl,
    padding: SPACING.xxxl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    width: 280,
    gap: SPACING.base,
  },
  loadingTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: FONTS.weights.bold,
    color: COLORS.text,
  },
  loadingSubtitle: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  loadingDots: { flexDirection: 'row', gap: SPACING.sm },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary,
  },

  content: {
    padding: SPACING.base,
    paddingBottom: SPACING.xxxl,
  },

  orderCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.base,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.xl,
  },
  orderTitle: {
    fontSize: FONTS.sizes.base,
    fontWeight: FONTS.weights.extrabold,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  orderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  orderLabel: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary },
  orderValue: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.text,
    fontWeight: FONTS.weights.medium,
    maxWidth: 200,
    textAlign: 'right',
  },
  orderTotal: {
    borderBottomWidth: 0,
    marginTop: SPACING.xs,
    paddingTop: SPACING.md,
  },
  orderTotalLabel: {
    fontSize: FONTS.sizes.base,
    fontWeight: FONTS.weights.bold,
    color: COLORS.text,
  },
  orderTotalValue: {
    fontSize: FONTS.sizes.xl,
    fontWeight: FONTS.weights.extrabold,
    color: COLORS.primary,
  },

  section: { marginBottom: SPACING.xl },
  sectionTitle: {
    fontSize: FONTS.sizes.base,
    fontWeight: FONTS.weights.bold,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },

  upiAppsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  upiApp: {
    flex: 1,
    minWidth: 70,
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.card,
    gap: 4,
  },
  upiAppSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryGlow,
  },
  upiAppEmoji: { fontSize: 24 },
  upiAppName: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
    fontWeight: FONTS.weights.semibold,
  },
  upiAppNameSelected: { color: COLORS.primary },

  secureNote: {
    flexDirection: 'row',
    backgroundColor: COLORS.successGlow,
    borderRadius: RADIUS.lg,
    padding: SPACING.base,
    borderWidth: 1,
    borderColor: `${COLORS.success}44`,
    marginBottom: SPACING.xl,
    gap: SPACING.sm,
    alignItems: 'flex-start',
  },
  secureNoteIcon: { fontSize: 18 },
  secureNoteText: {
    flex: 1,
    fontSize: FONTS.sizes.sm,
    color: COLORS.success,
    lineHeight: 20,
  },

  payBtn: { marginBottom: SPACING.md },
  disclaimer: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 16,
  },
});

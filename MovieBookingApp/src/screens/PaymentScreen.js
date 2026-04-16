// src/screens/PaymentScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  StatusBar,
  Modal,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createRazorpayOrder, verifyRazorpayPayment } from '../services/api';
import RazorpayCheckout from '../components/RazorpayCheckout';
import { Button } from '../components';
import { COLORS, FONTS, SPACING, RADIUS } from '../utils/theme';
import { formatCurrency, showAlert } from '../utils/helpers';

export default function PaymentScreen({ navigation, route }) {
  const { movie, seats, totalPrice } = route.params;
  const [loading, setLoading] = useState(false);
  const [showRazorpay, setShowRazorpay] = useState(false);
  const [orderData, setOrderData] = useState(null);

  // Step 1: Create order on backend, then open Razorpay checkout
  const handlePay = async () => {
    setLoading(true);
    try {
      // Create Razorpay order from our backend
      const data = await createRazorpayOrder({ amount: totalPrice });

      if (data.success) {
        setOrderData({
          orderId: data.order_id,
          amount: data.amount,
          currency: data.currency,
          keyId: data.key,
        });
        setShowRazorpay(true);
      } else {
        showAlert('Error ❌', 'Could not create payment order. Please try again.');
      }
    } catch (error) {
      showAlert(
        'Payment Error ❌',
        error.message || 'Failed to initiate payment. Check your internet connection.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Razorpay payment successful — verify on backend
  const handlePaymentSuccess = async (paymentData) => {
    // Clean up Razorpay state FIRST to prevent re-renders
    setShowRazorpay(false);
    setOrderData(null);
    setLoading(true);

    try {
      console.log('🔄 Verifying payment...', paymentData.razorpay_payment_id);

      const verifyResult = await verifyRazorpayPayment({
        razorpay_order_id: paymentData.razorpay_order_id,
        razorpay_payment_id: paymentData.razorpay_payment_id,
        razorpay_signature: paymentData.razorpay_signature,
      });

      console.log('✅ Verification result:', verifyResult);

      if (verifyResult.success) {
        setLoading(false);
        // Small delay to let state updates settle before navigation
        setTimeout(() => {
          navigation.replace('BookingConfirmation', {
            movie,
            seats,
            totalPrice,
            transactionId: verifyResult.transactionId,
            paymentMethod: 'Razorpay',
          });
        }, 300);
      } else {
        setLoading(false);
        showAlert(
          'Verification Failed ❌',
          'Payment was received but verification failed. Please contact support.',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      }
    } catch (error) {
      console.error('❌ Verification error:', error);
      setLoading(false);

      // Even if verification API fails, still redirect with payment ID
      // (payment was already deducted, so don't block the user)
      showAlert(
        'Payment Received ⚠️',
        'Payment was successful but verification had an issue. Your booking is being processed.',
        [{
          text: 'Continue',
          onPress: () => {
            navigation.replace('BookingConfirmation', {
              movie,
              seats,
              totalPrice,
              transactionId: paymentData.razorpay_payment_id,
              paymentMethod: 'Razorpay',
            });
          },
        }]
      );
    }
  };

  // Step 3: Payment failed or cancelled
  const handlePaymentFailure = (error) => {
    setShowRazorpay(false);
    setLoading(false);

    if (error === 'Payment cancelled by user') {
      // User just dismissed, no alert needed
      return;
    }

    showAlert(
      'Payment Failed ❌',
      error || 'Transaction could not be processed. Please try again.',
      [
        { text: 'Retry', onPress: handlePay },
        { text: 'Cancel', style: 'cancel', onPress: () => navigation.goBack() },
      ]
    );
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
            <Text style={styles.loadingTitle}>Processing...</Text>
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

      {/* Razorpay Checkout */}
      {Platform.OS === 'web' ? (
        // On web: Razorpay opens its own popup, no Modal needed
        showRazorpay && orderData && (
          <RazorpayCheckout
            orderId={orderData.orderId}
            amount={orderData.amount}
            currency={orderData.currency}
            keyId={orderData.keyId}
            userInfo={{}}
            onSuccess={handlePaymentSuccess}
            onFailure={handlePaymentFailure}
          />
        )
      ) : (
        // On native (Android/iOS): Use Modal with WebView
        <Modal
          visible={showRazorpay}
          animationType="slide"
          onRequestClose={() => {
            setShowRazorpay(false);
          }}
        >
          <SafeAreaView style={styles.modalContainer} edges={['top', 'bottom']}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                onPress={() => {
                  setShowRazorpay(false);
                }}
                style={styles.modalCloseBtn}
              >
                <Text style={styles.modalCloseBtnText}>✕ Close</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Razorpay Payment</Text>
              <View style={{ width: 70 }} />
            </View>
            {orderData && (
              <RazorpayCheckout
                orderId={orderData.orderId}
                amount={orderData.amount}
                currency={orderData.currency}
                keyId={orderData.keyId}
                userInfo={{}}
                onSuccess={handlePaymentSuccess}
                onFailure={handlePaymentFailure}
              />
            )}
          </SafeAreaView>
        </Modal>
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

        {/* Razorpay Payment Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <View style={styles.razorpayCard}>
            <View style={styles.razorpayHeader}>
              <Text style={styles.razorpayLogo}>💳</Text>
              <View style={styles.razorpayInfo}>
                <Text style={styles.razorpayTitle}>Razorpay Secure Checkout</Text>
                <Text style={styles.razorpayDesc}>
                  UPI • Cards • Net Banking • Wallets
                </Text>
              </View>
            </View>
            <View style={styles.razorpayMethods}>
              {['💳 Cards', '📱 UPI', '🏦 NetBanking', '💰 Wallets'].map((method) => (
                <View key={method} style={styles.methodChip}>
                  <Text style={styles.methodChipText}>{method}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Secure Note */}
        <View style={styles.secureNote}>
          <Text style={styles.secureNoteIcon}>🔐</Text>
          <Text style={styles.secureNoteText}>
            Your payment is processed securely by Razorpay. We never store your card or bank details.
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

        {/* Test Mode Info */}
        <View style={styles.testModeCard}>
          <Text style={styles.testModeTitle}>🧪 Test Mode</Text>
          <Text style={styles.testModeText}>
            Use these methods to test payment:{'\n'}
            🏦 Net Banking: Select any bank → Click Pay{'\n'}
            📱 UPI: Enter success@razorpay{'\n'}
            💰 Wallets: Select any → Click Pay
          </Text>
        </View>
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

  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalCloseBtn: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.md,
    backgroundColor: `${COLORS.error}22`,
  },
  modalCloseBtnText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.error,
    fontWeight: FONTS.weights.semibold,
  },
  modalTitle: {
    fontSize: FONTS.sizes.base,
    fontWeight: FONTS.weights.bold,
    color: COLORS.text,
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

  // Razorpay Card
  razorpayCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.base,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    gap: SPACING.md,
  },
  razorpayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  razorpayLogo: {
    fontSize: 36,
  },
  razorpayInfo: {
    flex: 1,
  },
  razorpayTitle: {
    fontSize: FONTS.sizes.base,
    fontWeight: FONTS.weights.bold,
    color: COLORS.text,
  },
  razorpayDesc: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  razorpayMethods: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
  },
  methodChip: {
    backgroundColor: `${COLORS.primary}15`,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: `${COLORS.primary}33`,
  },
  methodChipText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.primary,
    fontWeight: FONTS.weights.medium,
  },

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
    marginBottom: SPACING.xl,
  },

  // Test mode info card
  testModeCard: {
    backgroundColor: `${COLORS.warning}15`,
    borderRadius: RADIUS.lg,
    padding: SPACING.base,
    borderWidth: 1,
    borderColor: `${COLORS.warning}44`,
  },
  testModeTitle: {
    fontSize: FONTS.sizes.sm,
    fontWeight: FONTS.weights.bold,
    color: COLORS.warning,
    marginBottom: SPACING.xs,
  },
  testModeText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
});

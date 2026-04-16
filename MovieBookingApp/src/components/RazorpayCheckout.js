// src/components/RazorpayCheckout.js
import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, Platform } from 'react-native';
import { COLORS, FONTS, SPACING } from '../utils/theme';

// ─── WEB VERSION ─────────────────────────────────────────────────────────────
// On web, we load Razorpay's checkout.js and open their popup directly
function RazorpayCheckoutWeb({ orderId, amount, currency, keyId, userInfo, onSuccess, onFailure }) {
  const hasOpenedRef = useRef(false);
  const rzpInstanceRef = useRef(null);

  useEffect(() => {
    // Prevent double-opening (e.g., on React re-render)
    if (hasOpenedRef.current) return;
    hasOpenedRef.current = true;

    // Load Razorpay script dynamically
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;

    script.onload = () => {
      try {
        const options = {
          key: keyId,
          amount: String(amount),
          currency: currency || 'INR',
          name: 'Movie Booking App',
          description: 'Movie Ticket Booking',
          order_id: orderId,
          prefill: {
            name: userInfo?.name || '',
            email: userInfo?.email || '',
            contact: userInfo?.phone || '',
          },
          theme: {
            color: '#6C63FF',
          },
          handler: function (response) {
            console.log('✅ Razorpay payment success callback:', response.razorpay_payment_id);
            onSuccess && onSuccess({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            });
          },
          modal: {
            ondismiss: function () {
              console.log('ℹ️ Razorpay modal dismissed by user');
              onFailure && onFailure('Payment cancelled by user');
            },
            escape: true,
            backdropclose: false,
          },
        };

        const rzp = new window.Razorpay(options);
        rzpInstanceRef.current = rzp;

        rzp.on('payment.failed', function (response) {
          console.error('❌ Razorpay payment failed:', response.error?.description);
          onFailure && onFailure(
            response.error?.description || 'Payment failed'
          );
        });

        // Open Razorpay checkout popup
        rzp.open();
      } catch (e) {
        console.error('Razorpay init error:', e);
        onFailure && onFailure('Failed to initialize Razorpay: ' + e.message);
      }
    };

    script.onerror = () => {
      onFailure && onFailure('Failed to load Razorpay. Check your internet connection.');
    };

    document.body.appendChild(script);

    return () => {
      // Cleanup on unmount
      hasOpenedRef.current = false;
      rzpInstanceRef.current = null;
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [orderId, amount, currency, keyId]);

  return (
    <View style={styles.webLoadingContainer}>
      <ActivityIndicator size="large" color={COLORS.primary} />
      <Text style={styles.loadingText}>Opening Razorpay Checkout...</Text>
      <Text style={styles.loadingSubText}>A payment popup will appear shortly</Text>
    </View>
  );
}

// ─── NATIVE VERSION (Android / iOS) ─────────────────────────────────────────
// On native, we use WebView with Razorpay checkout.js inside HTML
function RazorpayCheckoutNative({ orderId, amount, currency, keyId, userInfo, onSuccess, onFailure }) {
  // Lazy import WebView only on native (won't crash on web)
  let WebView;
  try {
    WebView = require('react-native-webview').WebView;
  } catch (e) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>WebView not available. Please run on Android/iOS.</Text>
      </View>
    );
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          background: #0a0a1a;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: #fff;
        }
        .loading-container {
          text-align: center;
          padding: 40px;
        }
        .spinner {
          border: 4px solid rgba(255,255,255,0.1);
          border-left-color: #6C63FF;
          border-radius: 50%;
          width: 48px;
          height: 48px;
          animation: spin 0.8s linear infinite;
          margin: 0 auto 20px;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .title { font-size: 18px; font-weight: 600; margin-bottom: 8px; }
        .subtitle { font-size: 14px; color: rgba(255,255,255,0.5); }
      </style>
    </head>
    <body>
      <div class="loading-container" id="loader">
        <div class="spinner"></div>
        <div class="title">Opening Razorpay...</div>
        <div class="subtitle">Please wait, do not close this page</div>
      </div>

      <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
      <script>
        var options = {
          key: "${keyId}",
          amount: "${amount}",
          currency: "${currency || 'INR'}",
          name: "Movie Booking App",
          description: "Movie Ticket Booking",
          order_id: "${orderId}",
          prefill: {
            name: "${userInfo?.name || ''}",
            email: "${userInfo?.email || ''}",
            contact: "${userInfo?.phone || ''}"
          },
          theme: {
            color: "#6C63FF",
            backdrop_color: "rgba(10, 10, 26, 0.9)"
          },
          handler: function(response) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              status: 'success',
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature
            }));
          },
          modal: {
            ondismiss: function() {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                status: 'dismissed',
                error: 'Payment cancelled by user'
              }));
            },
            escape: false,
            backdropclose: false
          }
        };

        try {
          var rzp = new Razorpay(options);

          rzp.on('payment.failed', function(response) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              status: 'failed',
              error: response.error.description || 'Payment failed',
              code: response.error.code,
              reason: response.error.reason
            }));
          });

          setTimeout(function() {
            rzp.open();
          }, 500);
        } catch(e) {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            status: 'error',
            error: 'Failed to initialize Razorpay: ' + e.message
          }));
        }
      </script>
    </body>
    </html>
  `;

  const handleMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);

      if (data.status === 'success') {
        onSuccess && onSuccess({
          razorpay_payment_id: data.razorpay_payment_id,
          razorpay_order_id: data.razorpay_order_id,
          razorpay_signature: data.razorpay_signature,
        });
      } else {
        onFailure && onFailure(data.error || 'Payment failed');
      }
    } catch (e) {
      console.error('RazorpayCheckout: Failed to parse message', e);
      onFailure && onFailure('Something went wrong with payment');
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        source={{ html: htmlContent }}
        onMessage={handleMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={true}
        style={styles.webview}
        originWhitelist={['*']}
        mixedContentMode="compatibility"
        renderLoading={() => (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Loading Razorpay...</Text>
          </View>
        )}
        onError={() => {
          onFailure && onFailure('Failed to load payment page. Check internet connection.');
        }}
      />
    </View>
  );
}

// ─── MAIN EXPORT ─────────────────────────────────────────────────────────────
// Automatically picks correct version based on platform
export default function RazorpayCheckout(props) {
  if (Platform.OS === 'web') {
    return <RazorpayCheckoutWeb {...props} />;
  }
  return <RazorpayCheckoutNative {...props} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  webLoadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: SPACING.xxxl,
  },
  loadingText: {
    marginTop: SPACING.md,
    color: COLORS.text,
    fontSize: FONTS.sizes.base,
    fontWeight: '600',
  },
  loadingSubText: {
    marginTop: SPACING.xs,
    color: COLORS.textSecondary,
    fontSize: FONTS.sizes.sm,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xxxl,
  },
  errorText: {
    color: COLORS.error,
    fontSize: FONTS.sizes.base,
    textAlign: 'center',
  },
});

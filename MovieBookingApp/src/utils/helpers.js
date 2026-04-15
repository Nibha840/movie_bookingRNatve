// src/utils/helpers.js
import { Alert, Platform } from 'react-native';

/**
 * Cross-platform alert that works on both web and native.
 * On web, Alert.alert is not supported, so we use window.alert.
 */
export const showAlert = (title, message, buttons) => {
  if (Platform.OS === 'web') {
    // If there are action buttons (like OK with onPress), handle them
    if (buttons && buttons.length > 0) {
      window.alert(`${title}\n\n${message || ''}`);
      // Find the non-cancel button and call its onPress
      const actionButton = buttons.find(b => b.style !== 'cancel') || buttons[0];
      if (actionButton && actionButton.onPress) {
        actionButton.onPress();
      }
    } else {
      window.alert(`${title}\n\n${message || ''}`);
    }
  } else {
    Alert.alert(title, message, buttons);
  }
};

/**
 * Cross-platform confirm dialog.
 * On web, uses window.confirm. On native, uses Alert.alert with Cancel/Confirm.
 */
export const showConfirm = (title, message, onConfirm) => {
  if (Platform.OS === 'web') {
    if (window.confirm(`${title}\n\n${message || ''}`)) {
      onConfirm();
    }
  } else {
    Alert.alert(title, message, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Confirm', style: 'destructive', onPress: onConfirm },
    ]);
  }
};
export const formatCurrency = (amount) => {
  return `₹${Number(amount).toLocaleString('en-IN')}`;
};

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const generateTransactionId = () => {
  return 'TXN' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
};

export const generateRows = () => {
  const rows = ['A', 'B'];
  const seats = [];
  rows.forEach(row => {
    for (let i = 1; i <= 10; i++) {
      seats.push(`${row}${i}`);
    }
  });
  return seats;
};

export const PRICE_PER_SEAT = 250;

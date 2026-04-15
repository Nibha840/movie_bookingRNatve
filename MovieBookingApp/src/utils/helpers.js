// src/utils/helpers.js
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

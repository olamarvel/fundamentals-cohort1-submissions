import { format, formatDistanceToNow } from 'date-fns';

/**
 * Format currency
 */
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

/**
 * Format date
 */
export const formatDate = (date) => {
  return format(new Date(date), 'MMM dd, yyyy');
};

/**
 * Format date with time
 */
export const formatDateTime = (date) => {
  return format(new Date(date), 'MMM dd, yyyy HH:mm');
};

/**
 * Format relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (date) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

/**
 * Format transaction type for display
 */
export const formatTransactionType = (type) => {
  const types = {
    payment: 'Payment',
    deposit: 'Deposit',
    transfer: 'Transfer',
    refund: 'Refund',
  };
  return types[type] || type;
};

/**
 * Get transaction type color
 */
export const getTransactionTypeColor = (type) => {
  const colors = {
    payment: 'text-red-600 bg-red-50',
    deposit: 'text-green-600 bg-green-50',
    transfer: 'text-blue-600 bg-blue-50',
    refund: 'text-orange-600 bg-orange-50',
  };
  return colors[type] || 'text-gray-600 bg-gray-50';
};
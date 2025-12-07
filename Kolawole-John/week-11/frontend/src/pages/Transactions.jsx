import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { TransactionList } from '@/components/dashboard/TransactionList';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { transactionApi } from '@/api/transactionApi';
import { validateAmount } from '@/utils/validators';
import { PlusIcon } from '@heroicons/react/24/outline';

export const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Create transaction form state
  const [formData, setFormData] = useState({
    amount: '',
    type: 'deposit',
    description: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await transactionApi.getAll({ limit: 50 });
      setTransactions(response.data.transactions);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.amount || !validateAmount(formData.amount)) {
      errors.amount = 'Please enter a valid amount greater than 0';
    }

    if (!formData.type) {
      errors.type = 'Please select a transaction type';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateTransaction = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setCreating(true);
    setError('');

    try {
      await transactionApi.create({
        amount: parseFloat(formData.amount),
        type: formData.type,
        description: formData.description || undefined,
      });

      // Reset form and reload transactions
      setFormData({ amount: '', type: 'deposit', description: '' });
      setShowCreateModal(false);
      await loadTransactions();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create transaction');
    } finally {
      setCreating(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
            <p className="text-gray-600 mt-1">View and manage your transaction history</p>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            <PlusIcon className="h-5 w-5 mr-2 inline" />
            New Transaction
          </Button>
        </div>

        <ErrorMessage message={error} onClose={() => setError('')} />

        {/* Transactions List */}
        {loading ? (
          <LoadingSpinner size="lg" text="Loading transactions..." />
        ) : (
          <TransactionList transactions={transactions} loading={false} />
        )}

        {/* Create Transaction Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 animate-fadeIn">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Create Transaction
              </h2>

              <form onSubmit={handleCreateTransaction}>
                <Input
                  label="Amount"
                  type="number"
                  name="amount"
                  placeholder="100.00"
                  value={formData.amount}
                  onChange={handleFormChange}
                  error={formErrors.amount}
                  required
                  step="0.01"
                  min="0.01"
                />

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Transaction Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="deposit">Deposit</option>
                    <option value="payment">Payment</option>
                    <option value="transfer">Transfer</option>
                    <option value="refund">Refund</option>
                  </select>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description (Optional)
                  </label>
                  <textarea
                    name="description"
                    placeholder="Add a note..."
                    value={formData.description}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    rows="3"
                  />
                </div>

                <div className="flex space-x-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    loading={creating}
                    disabled={creating}
                    className="flex-1"
                  >
                    Create
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { transactionService } from '../services';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const { user, refreshUser } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [transferData, setTransferData] = useState({
    receiverEmail: '',
    amount: '',
    description: ''
  });
  const [depositAmount, setDepositAmount] = useState('');
  const [processing, setProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await transactionService.getTransactionHistory({ limit: 10 });
      setTransactions(response.data.transactions);
    } catch (err) {
      setError('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setError('');

    try {
      await transactionService.createTransaction({
        ...transferData,
        amount: parseFloat(transferData.amount)
      });
      
      setSuccessMessage('Transfer completed successfully!');
      setShowTransferModal(false);
      setTransferData({ receiverEmail: '', amount: '', description: '' });
      
      await refreshUser();
      await fetchTransactions();
      
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Transfer failed');
    } finally {
      setProcessing(false);
    }
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setError('');

    try {
      await transactionService.deposit(parseFloat(depositAmount));
      
      setSuccessMessage('Deposit successful!');
      setShowDepositModal(false);
      setDepositAmount('');
      
      await refreshUser();
      await fetchTransactions();
      
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Deposit failed');
    } finally {
      setProcessing(false);
    }
  };

  const getTransactionType = (transaction) => {
    if (transaction.type === 'deposit') return '💵 Deposit';
    if (transaction.senderId === user.id) return '📤 Sent';
    return '📥 Received';
  };

  const getTransactionAmount = (transaction) => {
    if (transaction.type === 'deposit' || transaction.receiverId === user.id) {
      return `+$${parseFloat(transaction.amount).toFixed(2)}`;
    }
    return `-$${parseFloat(transaction.amount).toFixed(2)}`;
  };

  const getTransactionColor = (transaction) => {
    if (transaction.type === 'deposit' || transaction.receiverId === user.id) {
      return 'text-green-600';
    }
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {successMessage && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {successMessage}
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Balance Card */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg p-8 text-white mb-8">
          <h2 className="text-xl font-semibold mb-2">Available Balance</h2>
          <p className="text-5xl font-bold mb-6">
            ${user ? parseFloat(user.accountBalance).toFixed(2) : '0.00'}
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => setShowDepositModal(true)}
              className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              💵 Deposit
            </button>
            <button
              onClick={() => setShowTransferModal(true)}
              className="px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              📤 Transfer
            </button>
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6">Recent Transactions</h2>

          {loading ? (
            <div className="text-center py-8">
              <div className="spinner mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading transactions...</p>
            </div>
          ) : transactions.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No transactions yet</p>
          ) : (
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">{getTransactionType(transaction).split(' ')[0]}</div>
                    <div>
                      <p className="font-semibold">
                        {transaction.type === 'deposit'
                          ? 'Account Deposit'
                          : transaction.senderId === user.id
                          ? `To: ${transaction.receiver.email}`
                          : `From: ${transaction.sender.email}`}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(transaction.createdAt).toLocaleString()}
                      </p>
                      {transaction.description && (
                        <p className="text-sm text-gray-600">{transaction.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-xl font-bold ${getTransactionColor(transaction)}`}>
                      {getTransactionAmount(transaction)}
                    </p>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        transaction.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Transfer Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-6">Transfer Funds</h2>
            <form onSubmit={handleTransfer} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Recipient Email
                </label>
                <input
                  type="email"
                  value={transferData.receiverEmail}
                  onChange={(e) =>
                    setTransferData({ ...transferData, receiverEmail: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="recipient@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={transferData.amount}
                  onChange={(e) =>
                    setTransferData({ ...transferData, amount: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (Optional)
                </label>
                <input
                  type="text"
                  value={transferData.description}
                  onChange={(e) =>
                    setTransferData({ ...transferData, description: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Payment for..."
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowTransferModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {processing ? 'Processing...' : 'Transfer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-6">Deposit Funds</h2>
            <form onSubmit={handleDeposit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowDepositModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                  {processing ? 'Processing...' : 'Deposit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

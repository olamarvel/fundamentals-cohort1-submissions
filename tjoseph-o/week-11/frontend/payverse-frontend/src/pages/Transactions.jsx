import { useState, useEffect } from 'react';
import { transactionService } from '../services';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const Transactions = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    page: 1,
    limit: 20
  });

  useEffect(() => {
    fetchTransactions();
  }, [filters]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.type) params.type = filters.type;
      params.page = filters.page;
      params.limit = filters.limit;

      const response = await transactionService.getTransactionHistory(params);
      setTransactions(response.data.transactions);
      setError('');
    } catch (err) {
      setError('Failed to load transactions');
    } finally {
      setLoading(false);
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
        <h1 className="text-3xl font-bold mb-6">Transaction History</h1>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6 flex gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">All</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value, page: 1 })}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">All</option>
              <option value="transfer">Transfer</option>
              <option value="payment">Payment</option>
              <option value="deposit">Deposit</option>
            </select>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="text-center py-12">
              <div className="spinner mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading transactions...</p>
            </div>
          ) : transactions.length === 0 ? (
            <p className="text-center text-gray-500 py-12">No transactions found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      From/To
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-xl">
                          {getTransactionType(transaction).split(' ')[0]}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {transaction.type === 'deposit' ? (
                          <span className="text-gray-500">System Deposit</span>
                        ) : transaction.senderId === user.id ? (
                          <div>
                            <p className="font-medium">{transaction.receiver.email}</p>
                            <p className="text-sm text-gray-500">
                              {transaction.receiver.firstName} {transaction.receiver.lastName}
                            </p>
                          </div>
                        ) : (
                          <div>
                            <p className="font-medium">{transaction.sender.email}</p>
                            <p className="text-sm text-gray-500">
                              {transaction.sender.firstName} {transaction.sender.lastName}
                            </p>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">
                          {transaction.description || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(transaction.createdAt).toLocaleDateString()}
                        <br />
                        <span className="text-xs">
                          {new Date(transaction.createdAt).toLocaleTimeString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs rounded ${
                            transaction.status === 'completed'
                              ? 'bg-green-100 text-green-700'
                              : transaction.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {transaction.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className={`text-lg font-bold ${getTransactionColor(transaction)}`}>
                          {getTransactionAmount(transaction)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Transactions;

import { formatCurrency, formatRelativeTime, formatTransactionType, getTransactionTypeColor } from '@/utils/formatters';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';

export const TransactionList = ({ transactions, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">No transactions yet</h3>
        <p className="text-gray-500">Your transaction history will appear here</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="divide-y divide-gray-200">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="p-6 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Icon based on transaction type */}
                <div className={`p-2 rounded-lg ${getTransactionTypeColor(transaction.type)}`}>
                  {transaction.type === 'deposit' ? (
                    <ArrowDownIcon className="h-5 w-5" />
                  ) : (
                    <ArrowUpIcon className="h-5 w-5" />
                  )}
                </div>

                {/* Transaction details */}
                <div>
                  <p className="font-medium text-gray-900">
                    {formatTransactionType(transaction.type)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {transaction.description || 'No description'}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {formatRelativeTime(transaction.created_at)}
                  </p>
                </div>
              </div>

              {/* Amount */}
              <div className="text-right">
                <p className={`text-lg font-bold ${
                  transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'deposit' ? '+' : '-'}
                  {formatCurrency(transaction.amount, transaction.currency)}
                </p>
                <p className={`text-xs px-2 py-1 rounded-full inline-block mt-1 ${getTransactionTypeColor(transaction.type)}`}>
                  {transaction.status}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
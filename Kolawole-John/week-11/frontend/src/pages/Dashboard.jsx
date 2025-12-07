import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { TransactionList } from '@/components/dashboard/TransactionList';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { transactionApi } from '@/api/transactionApi';
import { formatCurrency } from '@/utils/formatters';
import {
  BanknotesIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

export const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError('');

    try {
      // Load stats and recent transactions in parallel
      const [statsResponse, transactionsResponse] = await Promise.all([
        transactionApi.getStats(),
        transactionApi.getAll({ limit: 5 }),
      ]);

      setStats(statsResponse.data);
      setRecentTransactions(transactionsResponse.data.transactions);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8 animate-fadeIn">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Overview of your account activity</p>
        </div>

        <ErrorMessage message={error} onClose={() => setError('')} />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Current Balance"
            value={formatCurrency(stats?.balance || 0)}
            subtitle={stats?.currency || 'USD'}
            icon={BanknotesIcon}
            color="primary"
          />
          <StatsCard
            title="Total Received"
            value={formatCurrency(stats?.stats?.total_received || 0)}
            subtitle="All time deposits"
            icon={ArrowTrendingUpIcon}
            color="green"
          />
          <StatsCard
            title="Total Spent"
            value={formatCurrency(stats?.stats?.total_spent || 0)}
            subtitle="All time payments"
            icon={ArrowTrendingDownIcon}
            color="red"
          />
          <StatsCard
            title="Recent Activity"
            value={stats?.stats?.transactions_last_30_days || 0}
            subtitle="Last 30 days"
            icon={ClockIcon}
            color="blue"
          />
        </div>

        {/* Recent Transactions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Recent Transactions</h2>
            <Link
              to="/transactions"
              className="text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              View All →
            </Link>
          </div>
          <TransactionList transactions={recentTransactions} loading={false} />
        </div>
      </div>
    </Layout>
  );
};
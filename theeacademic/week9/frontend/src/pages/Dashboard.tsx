import React from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { paymentService, customerService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { 
  CreditCard, 
  Users, 
  TrendingUp, 
  Activity,
  ArrowRight 
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { 
    data: paymentStats, 
    loading: paymentLoading, 
    error: paymentError,
    refetch: refetchPayments 
  } = useApi(() => paymentService.getPaymentStats());

  const { 
    data: customerStats, 
    loading: customerLoading, 
    error: customerError,
    refetch: refetchCustomers 
  } = useApi(() => customerService.getCustomerStats());

  if (paymentLoading || customerLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (paymentError || customerError) {
    return (
      <ErrorMessage 
        message={paymentError || customerError || 'Failed to load dashboard data'} 
        onRetry={() => {
          refetchPayments();
          refetchCustomers();
        }}
      />
    );
  }

  const stats = [
    {
      name: 'Total Payments',
      value: paymentStats?.total || 0,
      icon: CreditCard,
      color: 'bg-blue-500',
      link: '/payments',
    },
    {
      name: 'Total Customers',
      value: customerStats?.total || 0,
      icon: Users,
      color: 'bg-green-500',
      link: '/customers',
    },
    {
      name: 'Completed Payments',
      value: paymentStats?.byStatus.completed || 0,
      icon: TrendingUp,
      color: 'bg-purple-500',
      link: '/payments?status=completed',
    },
    {
      name: 'Active Customers',
      value: customerStats?.active || 0,
      icon: Activity,
      color: 'bg-orange-500',
      link: '/customers',
    },
  ];

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome to LegacyBridge - Your modern integration dashboard
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.name}
              to={stat.link}
              className="relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              <dt>
                <div className={`absolute ${stat.color} rounded-md p-3`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <p className="ml-16 text-sm font-medium text-gray-500 truncate">
                  {stat.name}
                </p>
              </dt>
              <dd className="ml-16 pb-6 flex items-baseline sm:pb-7">
                <p className="text-2xl font-semibold text-gray-900">
                  {stat.value.toLocaleString()}
                </p>
                <div className="absolute bottom-0 inset-x-0 bg-gray-50 px-4 py-4 sm:px-6">
                  <div className="text-sm">
                    <span className="text-blue-600 font-medium flex items-center">
                      View details
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </span>
                  </div>
                </div>
              </dd>
            </Link>
          );
        })}
      </div>

      {/* Payment Status Overview */}
      {paymentStats && (
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Payment Status Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {paymentStats.byStatus.pending}
              </div>
              <div className="text-sm text-gray-500">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {paymentStats.byStatus.completed}
              </div>
              <div className="text-sm text-gray-500">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {paymentStats.byStatus.failed}
              </div>
              <div className="text-sm text-gray-500">Failed</div>
            </div>
          </div>
        </div>
      )}

      {/* Financial Summary */}
      {paymentStats && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Financial Summary</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <div className="text-sm text-gray-500">Total Amount</div>
              <div className="text-2xl font-bold text-gray-900">
                ${paymentStats.totalAmount.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Average Payment</div>
              <div className="text-2xl font-bold text-gray-900">
                ${Math.round(paymentStats.averageAmount).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
import React from 'react';
import { useApi } from '../hooks/useApi';
import { paymentService, customerService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { BarChart3, PieChart, TrendingUp, MapPin } from 'lucide-react';

const Analytics: React.FC = () => {
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
        message={paymentError || customerError || 'Failed to load analytics data'} 
        onRetry={() => {
          refetchPayments();
          refetchCustomers();
        }}
      />
    );
  }

  const paymentSuccessRate = paymentStats 
    ? ((paymentStats.byStatus.completed / paymentStats.total) * 100).toFixed(1)
    : 0;

  const customerWithCompanyRate = customerStats
    ? ((customerStats.withCompany / customerStats.total) * 100).toFixed(1)
    : 0;

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="mt-2 text-gray-600">
          Insights and statistics from your integrated legacy data
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Success Rate</p>
              <p className="text-2xl font-semibold text-gray-900">{paymentSuccessRate}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Payment</p>
              <p className="text-2xl font-semibold text-gray-900">
                ${Math.round(paymentStats?.averageAmount || 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <PieChart className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Business Rate</p>
              <p className="text-2xl font-semibold text-gray-900">{customerWithCompanyRate}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <MapPin className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Top Cities</p>
              <p className="text-2xl font-semibold text-gray-900">
                {customerStats?.topCities.length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Payment Status Distribution */}
        {paymentStats && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Status Distribution</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded mr-3"></div>
                  <span className="text-sm text-gray-600">Completed</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-900 mr-2">
                    {paymentStats.byStatus.completed}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({((paymentStats.byStatus.completed / paymentStats.total) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-yellow-500 rounded mr-3"></div>
                  <span className="text-sm text-gray-600">Pending</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-900 mr-2">
                    {paymentStats.byStatus.pending}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({((paymentStats.byStatus.pending / paymentStats.total) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-500 rounded mr-3"></div>
                  <span className="text-sm text-gray-600">Failed</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-900 mr-2">
                    {paymentStats.byStatus.failed}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({((paymentStats.byStatus.failed / paymentStats.total) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Top Cities */}
        {customerStats && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Customer Cities</h2>
            <div className="space-y-3">
              {customerStats.topCities.map((city, index) => (
                <div key={city.city} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-xs font-medium text-blue-600">{index + 1}</span>
                    </div>
                    <span className="text-sm text-gray-900">{city.city}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900 mr-2">{city.count}</span>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ 
                          width: `${(city.count / customerStats.topCities[0].count) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Financial Overview */}
      {paymentStats && (
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Financial Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                ${paymentStats.totalAmount.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500 mt-1">Total Revenue</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                ${Math.round(paymentStats.averageAmount).toLocaleString()}
              </div>
              <div className="text-sm text-gray-500 mt-1">Average Payment</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {paymentStats.total}
              </div>
              <div className="text-sm text-gray-500 mt-1">Total Transactions</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
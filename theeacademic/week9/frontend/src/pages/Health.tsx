import React from 'react';
import { useApi } from '../hooks/useApi';
import { healthService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Server, 
  Database,
  Zap 
} from 'lucide-react';

const Health: React.FC = () => {
  const { 
    data: healthData, 
    loading, 
    error, 
    refetch 
  } = useApi(() => healthService.getHealth(), []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={refetch} />;
  }

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const isHealthy = healthData?.success;

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">System Health</h1>
        <p className="mt-2 text-gray-600">
          Monitor the status and performance of the LegacyBridge integration service
        </p>
      </div>

      {/* Overall Status */}
      <div className="mb-8">
        <div className={`rounded-lg p-6 ${isHealthy ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <div className="flex items-center">
            {isHealthy ? (
              <CheckCircle className="h-8 w-8 text-green-600" />
            ) : (
              <XCircle className="h-8 w-8 text-red-600" />
            )}
            <div className="ml-4">
              <h2 className={`text-xl font-semibold ${isHealthy ? 'text-green-900' : 'text-red-900'}`}>
                System Status: {isHealthy ? 'Healthy' : 'Unhealthy'}
              </h2>
              <p className={`text-sm ${isHealthy ? 'text-green-700' : 'text-red-700'}`}>
                {isHealthy 
                  ? 'All systems are operational and functioning normally'
                  : 'Some systems are experiencing issues'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Uptime</p>
              <p className="text-lg font-semibold text-gray-900">
                {healthData?.data?.uptime ? formatUptime(healthData.data.uptime) : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Server className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">API Version</p>
              <p className="text-lg font-semibold text-gray-900">
                {healthData?.version || 'N/A'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Database className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Cache Status</p>
              <p className="text-lg font-semibold text-gray-900">
                {healthData?.data?.cache ? 'Active' : 'Inactive'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Zap className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Response Time</p>
              <p className="text-lg font-semibold text-gray-900">
                {new Date(healthData?.timestamp || '').getTime() - Date.now() + 'ms' || 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Cache Statistics */}
      {healthData?.data?.cache && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Cache Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {healthData.data.cache.keys || 0}
              </div>
              <div className="text-sm text-gray-500 mt-1">Cached Keys</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {healthData.data.cache.hits || 0}
              </div>
              <div className="text-sm text-gray-500 mt-1">Cache Hits</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {healthData.data.cache.misses || 0}
              </div>
              <div className="text-sm text-gray-500 mt-1">Cache Misses</div>
            </div>
          </div>
        </div>
      )}

      {/* System Information */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">System Information</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-sm font-medium text-gray-600">Status</span>
            <span className={`text-sm font-semibold ${isHealthy ? 'text-green-600' : 'text-red-600'}`}>
              {healthData?.data?.status || 'Unknown'}
            </span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-sm font-medium text-gray-600">Last Check</span>
            <span className="text-sm text-gray-900">
              {healthData?.timestamp ? new Date(healthData.timestamp).toLocaleString() : 'N/A'}
            </span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-sm font-medium text-gray-600">API Version</span>
            <span className="text-sm text-gray-900">{healthData?.version || 'N/A'}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-sm font-medium text-gray-600">Environment</span>
            <span className="text-sm text-gray-900">Production</span>
          </div>
        </div>
      </div>

      {/* Refresh Button */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={refetch}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Zap className="w-4 h-4 mr-2" />
          Refresh Status
        </button>
      </div>
    </div>
  );
};

export default Health;
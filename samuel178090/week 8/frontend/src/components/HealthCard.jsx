const HealthCard = ({ health, detailedHealth }) => {
  const getStatusColor = (status) => {
    return status === 'OK' ? '#10b981' : '#ef4444';
  };

  const formatUptime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="card health-card">
      <div className="card-header">
        <h3>System Health</h3>
        <div 
          className="status-indicator"
          style={{ backgroundColor: getStatusColor(health?.status) }}
        ></div>
      </div>
      
      <div className="card-content">
        {health && (
          <>
            <div className="metric">
              <span className="metric-label">Status:</span>
              <span className="metric-value">{health.status}</span>
            </div>
            
            <div className="metric">
              <span className="metric-label">Uptime:</span>
              <span className="metric-value">{formatUptime(health.uptime)}</span>
            </div>
            
            <div className="metric">
              <span className="metric-label">Version:</span>
              <span className="metric-value">{health.version}</span>
            </div>
          </>
        )}
        
        {detailedHealth?.memory && (
          <div className="memory-info">
            <h4>Memory Usage</h4>
            <div className="metric">
              <span className="metric-label">RSS:</span>
              <span className="metric-value">{detailedHealth.memory.rss}</span>
            </div>
            <div className="metric">
              <span className="metric-label">Heap Used:</span>
              <span className="metric-value">{detailedHealth.memory.heapUsed}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthCard;
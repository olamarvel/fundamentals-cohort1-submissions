const StatusCard = ({ status }) => {
  const getStatusColor = (status) => {
    return status === 'running' ? '#10b981' : '#ef4444';
  };

  return (
    <div className="card status-card">
      <div className="card-header">
        <h3>Service Status</h3>
        <div 
          className="status-indicator"
          style={{ backgroundColor: getStatusColor(status?.status) }}
        ></div>
      </div>
      
      <div className="card-content">
        {status && (
          <>
            <div className="metric">
              <span className="metric-label">Service:</span>
              <span className="metric-value">{status.service}</span>
            </div>
            
            <div className="metric">
              <span className="metric-label">Status:</span>
              <span className="metric-value status-badge" style={{ color: getStatusColor(status.status) }}>
                {status.status}
              </span>
            </div>
            
            <div className="metric">
              <span className="metric-label">Environment:</span>
              <span className="metric-value">{status.environment}</span>
            </div>
            
            <div className="metric">
              <span className="metric-label">Last Check:</span>
              <span className="metric-value">
                {new Date(status.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StatusCard;
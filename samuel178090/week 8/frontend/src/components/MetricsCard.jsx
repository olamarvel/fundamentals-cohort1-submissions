const MetricsCard = ({ version, health }) => {
  return (
    <div className="card metrics-card">
      <div className="card-header">
        <h3>System Metrics</h3>
      </div>
      
      <div className="card-content">
        {version && (
          <>
            <div className="metric">
              <span className="metric-label">App Version:</span>
              <span className="metric-value">{version.version}</span>
            </div>
            
            <div className="metric">
              <span className="metric-label">Node Version:</span>
              <span className="metric-value">{version.nodeVersion}</span>
            </div>
            
            <div className="metric">
              <span className="metric-label">Build Time:</span>
              <span className="metric-value">
                {new Date(version.buildTime).toLocaleDateString()}
              </span>
            </div>
          </>
        )}
        
        {health && (
          <>
            <div className="metric">
              <span className="metric-label">Environment:</span>
              <span className="metric-value">{health.environment}</span>
            </div>
            
            <div className="metric">
              <span className="metric-label">Memory Total:</span>
              <span className="metric-value">{health.memory?.heapTotal}</span>
            </div>
          </>
        )}
        
        <div className="metrics-footer">
          <small>Metrics updated every 30 seconds</small>
        </div>
      </div>
    </div>
  );
};

export default MetricsCard;
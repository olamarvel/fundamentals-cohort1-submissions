import { useState, useEffect, useRef } from 'react'
import './App.css'

function App() {
  const [config, setConfig] = useState({
    url: 'http://localhost:5000/api',
    totalRequests: 1000,
    batchSize: 50, 
    pollInterval: 2000 
  });

  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({
    sent: 0,
    pending: 0,
    completed: 0,
    failed: 0
  });

  const jobIdsRef = useRef([]); 
  const shouldStopRef = useRef(false);

  const addLog = (msg) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 50));
  };

  const startStressTest = async () => {
    setIsRunning(true);
    shouldStopRef.current = false;
    jobIdsRef.current = [];
    setStats({ sent: 0, pending: 0, completed: 0, failed: 0 });
    addLog(`🚀 Starting Test: ${config.totalRequests} requests...`);

    let sentCount = 0;

    while (sentCount < config.totalRequests && !shouldStopRef.current) {
      const currentBatchSize = Math.min(config.batchSize, config.totalRequests - sentCount);
      const promises = [];

      for (let i = 0; i < currentBatchSize; i++) {
        const payload = {
          type: 'email',
          to: `user_${sentCount + i}@test.com`,
          content: `Frontend Load Test #${sentCount + i}`
        };

        promises.push(
          fetch(`${config.url}/notify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          })
          .then(res => res.json())
          .then(data => {
            if (data.jobId) return data.jobId;
            throw new Error('No Job ID');
          })
          .catch(err => null) 
        );
      }

      const results = await Promise.all(promises);
      
      const validIds = results.filter(id => id !== null);
      jobIdsRef.current = [...jobIdsRef.current, ...validIds];
      
      sentCount += currentBatchSize;
      
      setStats(prev => ({
        ...prev,
        sent: sentCount,
        pending: jobIdsRef.current.length 
      }));

      await new Promise(r => setTimeout(r, 50));
    }

    addLog(`✅ Finished Sending. Tracking ${jobIdsRef.current.length} jobs...`);
  };

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(async () => {
        if (jobIdsRef.current.length === 0 && stats.sent > 0) {
           if(stats.sent >= config.totalRequests) {
             setIsRunning(false);
             addLog("🎉 All jobs processed!");
           }
           return;
        }

        const batchToCheck = jobIdsRef.current.slice(0, 20); 
        
        if (batchToCheck.length === 0) return;

        let completedInBatch = 0;
        let failedInBatch = 0;

        await Promise.all(batchToCheck.map(async (id) => {
            try {
                const res = await fetch(`${config.url}/status/${id}`);
                const data = await res.json();
                
                if (data.status === 'SENT') {
                    completedInBatch++;
                    jobIdsRef.current = jobIdsRef.current.filter(jobId => jobId !== id);
                } else if (data.status === 'FAILED') {
                    failedInBatch++;
                    jobIdsRef.current = jobIdsRef.current.filter(jobId => jobId !== id);
                }
            } catch (e) { console.error(e); }
        }));

        setStats(prev => ({
            ...prev,
            completed: prev.completed + completedInBatch,
            failed: prev.failed + failedInBatch,
            pending: jobIdsRef.current.length 
        }));

      }, config.pollInterval);
    }
    return () => clearInterval(interval);
  }, [isRunning, config.pollInterval, config.url]);

  const stopTest = () => {
    shouldStopRef.current = true;
    setIsRunning(false);
    addLog("🛑 Test Stopped manually.");
  };

  return (
    <div className="container">
      <h1>⚡ Notification System Load Tester</h1>
      
      {/* CONTROL PANEL */}
      <div className="card controls">
        <div className="input-group">
            <label>API URL:</label>
            <input value={config.url} onChange={e => setConfig({...config, url: e.target.value})} />
        </div>
        <div className="input-group">
            <label>Total Requests:</label>
            <input type="number" value={config.totalRequests} onChange={e => setConfig({...config, totalRequests: Number(e.target.value)})} />
        </div>
        <div className="input-group">
            <label>Batch Size (Concurrency):</label>
            <input type="number" value={config.batchSize} onChange={e => setConfig({...config, batchSize: Number(e.target.value)})} />
        </div>
        <div className="actions">
            {!isRunning ? (
                <button className="btn start" onClick={startStressTest}>🚀 Start Test</button>
            ) : (
                <button className="btn stop" onClick={stopTest}>🛑 Stop</button>
            )}
        </div>
      </div>

      {/* STATS DASHBOARD */}
      <div className="stats-grid">
        <div className="stat-box blue">
            <h3>Sent to Queue</h3>
            <p>{stats.sent}</p>
        </div>
        <div className="stat-box yellow">
            <h3>Pending (In Queue)</h3>
            <p>{stats.pending}</p>
        </div>
        <div className="stat-box green">
            <h3>Completed</h3>
            <p>{stats.completed}</p>
        </div>
        <div className="stat-box red">
            <h3>Failed</h3>
            <p>{stats.failed}</p>
        </div>
      </div>

      {/* LIVE LOGS */}
      <div className="logs">
        <h3>System Logs</h3>
        <div className="log-window">
            {logs.map((log, i) => <div key={i} className="log-entry">{log}</div>)}
        </div>
      </div>
    </div>
  )
}

export default App
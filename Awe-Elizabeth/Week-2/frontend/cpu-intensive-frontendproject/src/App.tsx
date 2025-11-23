import { useState } from 'react'
import './App.css'

function App() {
  const [status, setStatus] = useState("")

    async function sendRequests() {
    setStatus("Sending 100 requests...");
    const requests = Array.from({ length: 100 }, () =>
      fetch("http://localhost:5030/api/process-data", { method: "POST" })
    );

    const results = await Promise.all(requests);
    setStatus(`Completed ${results.length} requests`);
  }

  return (
    <>
      <div style={{ padding: "2rem" }}>
      <h1>Making CPU Intensive Request</h1>
      <button onClick={sendRequests}>Send 100 Requests</button>
      <p>{status}</p>
    </div>
    </>
  )
}

export default App

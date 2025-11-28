
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Payments from './pages/Payments';
import Customers from './pages/Customers';
import Analytics from './pages/Analytics';
import Health from './pages/Health';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/health" element={<Health />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CustomersPage from './pages/CustomersPage';
import PaymentsPage from './pages/PaymentsPage';
import CustomerDetailPage from './pages/CustomerDetailPage';
import PaymentDetailPage from './pages/PaymentDetailPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="nav-container">
            <Link to="/" className="logo">
              LegacyBridge
            </Link>
            <div className="nav-links">
              <Link to="/customers">Customers</Link>
              <Link to="/payments">Payments</Link>
            </div>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<CustomersPage />} />
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/customers/:id" element={<CustomerDetailPage />} />
            <Route path="/payments" element={<PaymentsPage />} />
            <Route path="/payments/:id" element={<PaymentDetailPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;


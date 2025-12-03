import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../services/api';
import { Customer } from '../types';

function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getCustomers();
      setCustomers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <p>Loading customers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="error">Error: {error}</div>
        <button className="btn btn-primary" onClick={loadCustomers}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1>Customers</h1>
        <p>View all transformed customer data from legacy system</p>
      </div>

      <div className="grid">
        {customers.map((customer) => (
          <div key={customer.id} className="card">
            <div className="card-header">
              <h3 className="card-title">{customer.fullName}</h3>
              <span className={`status-badge status-${customer.status}`}>
                {customer.status}
              </span>
            </div>
            <div className="card-body">
              <p>
                <strong>Email:</strong> {customer.email}
              </p>
              <p>
                <strong>Phone:</strong> {customer.contactInfo.phone}
              </p>
              <p>
                <strong>Company:</strong> {customer.company}
              </p>
              <p>
                <strong>Address:</strong> {customer.contactInfo.address}
              </p>
              <div style={{ marginTop: '1rem' }}>
                <Link to={`/customers/${customer.id}`} className="btn btn-primary">
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CustomersPage;



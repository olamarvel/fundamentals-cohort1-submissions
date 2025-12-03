import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiService } from '../services/api';
import { Customer, Payment } from '../types';

function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadCustomerData(parseInt(id, 10));
    }
  }, [id]);

  const loadCustomerData = async (customerId: number) => {
    try {
      setLoading(true);
      setError(null);
      const [customerData, paymentsData] = await Promise.all([
        apiService.getCustomerById(customerId),
        apiService.getCustomerPayments(customerId),
      ]);
      setCustomer(customerData);
      setPayments(paymentsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load customer data');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    if (currency === 'KES') {
      return `KES ${new Intl.NumberFormat('en-KE').format(amount)}`;
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="loading">
        <p>Loading customer details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="error">Error: {error}</div>
        <Link to="/customers" className="btn btn-primary">
          Back to Customers
        </Link>
      </div>
    );
  }

  if (!customer) {
    return (
      <div>
        <div className="error">Customer not found</div>
        <Link to="/customers" className="btn btn-primary">
          Back to Customers
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <Link to="/customers" className="btn btn-primary">
          ← Back to Customers
        </Link>
      </div>

      <div className="detail-section">
        <h2>Customer Information</h2>
        <div className="detail-row">
          <div className="detail-label">Full Name</div>
          <div className="detail-value">{customer.fullName}</div>
        </div>
        <div className="detail-row">
          <div className="detail-label">Email</div>
          <div className="detail-value">{customer.email}</div>
        </div>
        <div className="detail-row">
          <div className="detail-label">Phone</div>
          <div className="detail-value">{customer.contactInfo.phone}</div>
        </div>
        <div className="detail-row">
          <div className="detail-label">Address</div>
          <div className="detail-value">{customer.contactInfo.address}</div>
        </div>
        <div className="detail-row">
          <div className="detail-label">Company</div>
          <div className="detail-value">{customer.company}</div>
        </div>
        <div className="detail-row">
          <div className="detail-label">Status</div>
          <div className="detail-value">
            <span className={`status-badge status-${customer.status}`}>
              {customer.status}
            </span>
          </div>
        </div>
        <div className="detail-row">
          <div className="detail-label">Registration Date</div>
          <div className="detail-value">{formatDate(customer.registrationDate)}</div>
        </div>
      </div>

      <div className="detail-section">
        <h2>Payment History ({payments.length})</h2>
        {payments.length === 0 ? (
          <p style={{ color: '#7f8c8d' }}>No payments found for this customer.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id}>
                  <td>{payment.id}</td>
                  <td>{formatCurrency(payment.amount, payment.currency)}</td>
                  <td>
                    <span className={`status-badge status-${payment.status}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td>{formatDate(payment.transactionDate)}</td>
                  <td>{payment.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default CustomerDetailPage;



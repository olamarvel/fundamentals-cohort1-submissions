import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiService } from '../services/api';
import { Payment } from '../types';

function PaymentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadPayment(parseInt(id, 10));
    }
  }, [id]);

  const loadPayment = async (paymentId: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getPaymentById(paymentId);
      setPayment(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load payment');
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
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="loading">
        <p>Loading payment details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="error">Error: {error}</div>
        <Link to="/payments" className="btn btn-primary">
          Back to Payments
        </Link>
      </div>
    );
  }

  if (!payment) {
    return (
      <div>
        <div className="error">Payment not found</div>
        <Link to="/payments" className="btn btn-primary">
          Back to Payments
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <Link to="/payments" className="btn btn-primary">
          ← Back to Payments
        </Link>
      </div>

      <div className="detail-section">
        <h2>Payment Details</h2>
        <div className="detail-row">
          <div className="detail-label">Payment ID</div>
          <div className="detail-value">{payment.id}</div>
        </div>
        <div className="detail-row">
          <div className="detail-label">Customer</div>
          <div className="detail-value">
            <Link to={`/customers/${payment.customerId}`} className="btn-link">
              {payment.customerName}
            </Link>
          </div>
        </div>
        <div className="detail-row">
          <div className="detail-label">Amount</div>
          <div className="detail-value">{formatCurrency(payment.amount, payment.currency)}</div>
        </div>
        <div className="detail-row">
          <div className="detail-label">Status</div>
          <div className="detail-value">
            <span className={`status-badge status-${payment.status}`}>
              {payment.status}
            </span>
          </div>
        </div>
        <div className="detail-row">
          <div className="detail-label">Transaction Date</div>
          <div className="detail-value">{formatDate(payment.transactionDate)}</div>
        </div>
        <div className="detail-row">
          <div className="detail-label">Description</div>
          <div className="detail-value">{payment.description}</div>
        </div>
        <div className="detail-row">
          <div className="detail-label">Processed At</div>
          <div className="detail-value">{formatDate(payment.metadata.processedAt)}</div>
        </div>
        <div className="detail-row">
          <div className="detail-label">Original ID</div>
          <div className="detail-value">{payment.metadata.originalId}</div>
        </div>
      </div>
    </div>
  );
}

export default PaymentDetailPage;



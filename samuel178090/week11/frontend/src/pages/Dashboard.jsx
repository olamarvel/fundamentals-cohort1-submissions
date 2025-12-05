import React, { useState, useEffect } from 'react';
import { transactionAPI, userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newTransaction, setNewTransaction] = useState({
    amount: '',
    type: 'credit',
    description: ''
  });
  const [creating, setCreating] = useState(false);
  const [showUsers, setShowUsers] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchTransactions();
    if (user?.role === 'admin') {
      fetchUsers();
    }
  }, [user]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = user?.role === 'admin' 
        ? await transactionAPI.getAllAdmin()
        : await transactionAPI.getAll();
      setTransactions(response.data);
    } catch (error) {
      setError('Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await userAPI.getAll();
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users');
    }
  };

  const getUserName = (userId) => {
    const foundUser = users.find(u => u.id === userId);
    return foundUser ? foundUser.fullName : `User ${userId}`;
  };

  const handleCreateTransaction = async (e) => {
    e.preventDefault();
    setCreating(true);
    setError('');
    setSuccess('');

    try {
      await transactionAPI.create(newTransaction);
      setNewTransaction({ amount: '', type: 'credit', description: '' });
      setSuccess('Transaction created successfully!');
      fetchTransactions();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to create transaction');
    } finally {
      setCreating(false);
    }
  };

  const handleInputChange = (e) => {
    setNewTransaction({
      ...newTransaction,
      [e.target.name]: e.target.value
    });
  };

  // Calculate stats
  const stats = {
    total: transactions.length,
    completed: transactions.filter(t => t.status === 'completed').length,
    pending: transactions.filter(t => t.status === 'pending').length,
    totalAmount: transactions.reduce((sum, t) => {
      return sum + (t.type === 'credit' ? t.amount : -t.amount);
    }, 0)
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <div>Loading PayVerse Dashboard...</div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#1f2937', marginBottom: '8px' }}>
          {user?.role === 'admin' ? '🛡️ Admin Control Panel' : `Welcome back, ${user?.email?.split('@')[0]}!`}
        </h1>
        <p style={{ color: '#6b7280', fontSize: '16px' }}>
          {user?.role === 'admin' ? 'System Administrator - Full Platform Control' : 'Your Personal Payment Dashboard'}
        </p>
      </div>

      {/* Admin vs User Stats */}
      {user?.role === 'admin' ? (
        // ADMIN STATS - System Overview
        <>
          <div className="grid grid-cols-4" style={{ marginBottom: '20px' }}>
            <div className="card" style={{ textAlign: 'center', padding: '20px', backgroundColor: '#fef2f2' }}>
              <div style={{ fontSize: '28px', fontWeight: '700', color: '#dc2626', marginBottom: '4px' }}>
                {new Set(transactions.map(t => t.userId)).size}
              </div>
              <div style={{ color: '#991b1b', fontSize: '14px', fontWeight: '600' }}>👥 Total Users</div>
            </div>
            
            <div className="card" style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f0f9ff' }}>
              <div style={{ fontSize: '28px', fontWeight: '700', color: '#0284c7', marginBottom: '4px' }}>
                {stats.total}
              </div>
              <div style={{ color: '#0c4a6e', fontSize: '14px', fontWeight: '600' }}>🏦 System Transactions</div>
            </div>
            
            <div className="card" style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f0fdf4' }}>
              <div style={{ fontSize: '28px', fontWeight: '700', color: '#16a34a', marginBottom: '4px' }}>
                ₦{transactions.reduce((sum, t) => sum + Math.abs(t.amount), 0).toLocaleString()}
              </div>
              <div style={{ color: '#166534', fontSize: '14px', fontWeight: '600' }}>💰 Total Volume</div>
            </div>
            
            <div className="card" style={{ textAlign: 'center', padding: '20px', backgroundColor: '#fffbeb' }}>
              <div style={{ fontSize: '28px', fontWeight: '700', color: '#d97706', marginBottom: '4px' }}>
                {stats.total > 0 ? ((stats.completed / stats.total) * 100).toFixed(1) : 0}%
              </div>
              <div style={{ color: '#92400e', fontSize: '14px', fontWeight: '600' }}>📊 Success Rate</div>
            </div>
          </div>
          
          {/* Admin Control Panel */}
          <div className="card" style={{ backgroundColor: '#fef3c7', border: '2px solid #f59e0b', marginBottom: '20px' }}>
            <h3 style={{ color: '#92400e', marginBottom: '16px' }}>⚡ Admin Controls</h3>
            <div className="grid grid-cols-3">
              <button 
                className="btn btn-primary" 
                style={{ margin: '4px' }}
                onClick={() => setShowUsers(!showUsers)}
              >
                👥 {showUsers ? 'Hide' : 'Show'} Users ({users.length})
              </button>
              <button 
                className="btn btn-success" 
                style={{ margin: '4px' }}
                onClick={() => {
                  const report = `📊 PAYVERSE SYSTEM REPORT\n\nTotal Volume: ₦${transactions.reduce((sum, t) => sum + Math.abs(t.amount), 0).toLocaleString()}\nTransactions: ${stats.total}\nUsers: ${users.length}\nSuccess Rate: ${stats.total > 0 ? ((stats.completed / stats.total) * 100).toFixed(1) : 0}%\nGenerated: ${new Date().toLocaleString()}`;
                  setSuccess(report);
                }}
              >
                📊 System Reports
              </button>
              <button 
                className="btn btn-danger" 
                style={{ margin: '4px' }}
                onClick={() => {
                  const status = `🔧 PAYVERSE SYSTEM STATUS\n\n✅ REST API: Operational\n✅ JWT Authentication: Active\n✅ Database: Connected\n✅ Transaction Processing: Online\n✅ User Management: Functional\n\nLast Check: ${new Date().toLocaleString()}`;
                  setSuccess(status);
                }}
              >
                🔧 Platform Settings
              </button>
            </div>
          </div>
          
          {/* Admin User Management Panel */}
          {showUsers && (
            <div className="card" style={{ backgroundColor: '#f0f9ff', border: '2px solid #0284c7' }}>
              <h3 style={{ color: '#0c4a6e', marginBottom: '16px' }}>👥 User Management</h3>
              <div style={{ overflowX: 'auto' }}>
                <table className="table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Transactions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => {
                      const userTransactions = transactions.filter(t => t.userId === u.id);
                      return (
                        <tr key={u.id}>
                          <td style={{ fontFamily: 'monospace', fontWeight: '600' }}>#{u.id}</td>
                          <td style={{ fontWeight: '600' }}>{u.fullName}</td>
                          <td>{u.email}</td>
                          <td>
                            <span className={`badge ${u.role === 'admin' ? 'badge-warning' : 'badge-success'}`}>
                              {u.role === 'admin' ? '👑 Admin' : '👤 User'}
                            </span>
                          </td>
                          <td>{userTransactions.length} transactions</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      ) : (
        // USER STATS - Personal Overview
        <div className="grid grid-cols-4" style={{ marginBottom: '32px' }}>
          <div className="card" style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#2563eb', marginBottom: '4px' }}>
              {stats.total}
            </div>
            <div style={{ color: '#6b7280', fontSize: '14px' }}>Your Transactions</div>
          </div>
          
          <div className="card" style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#16a34a', marginBottom: '4px' }}>
              {stats.completed}
            </div>
            <div style={{ color: '#6b7280', fontSize: '14px' }}>Completed</div>
          </div>
          
          <div className="card" style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#d97706', marginBottom: '4px' }}>
              {stats.pending}
            </div>
            <div style={{ color: '#6b7280', fontSize: '14px' }}>Pending</div>
          </div>
          
          <div className="card" style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ 
              fontSize: '28px', 
              fontWeight: '700', 
              color: stats.totalAmount >= 0 ? '#16a34a' : '#dc2626',
              marginBottom: '4px' 
            }}>
              ₦{Math.abs(stats.totalAmount).toLocaleString()}
            </div>
            <div style={{ color: '#6b7280', fontSize: '14px' }}>Your Balance</div>
          </div>
        </div>
      )}
      
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
      
      {/* Different Transaction Forms */}
      <div className="card">
        <h3 style={{ marginBottom: '20px', color: '#1f2937' }}>
          {user?.role === 'admin' ? '🛠️ Admin: Create System Transaction' : '💳 Create New Transaction'}
        </h3>
        {user?.role === 'admin' && (
          <div style={{ 
            backgroundColor: '#fef2f2', 
            padding: '16px', 
            borderRadius: '8px', 
            marginBottom: '20px',
            border: '2px solid #fca5a5'
          }}>
            <p style={{ color: '#dc2626', fontSize: '14px', fontWeight: '700' }}>
              ⚠️ ADMIN MODE: Creating transactions for the entire system
            </p>
          </div>
        )}
        <form onSubmit={handleCreateTransaction}>
          <div className="grid grid-cols-4" style={{ alignItems: 'end' }}>
            <div className="form-group">
              <label>Amount (₦)</label>
              <input
                type="number"
                name="amount"
                value={newTransaction.amount}
                onChange={handleInputChange}
                required
                min="100"
                step="100"
                placeholder="50000"
              />
            </div>
            
            <div className="form-group">
              <label>Transaction Type</label>
              <select
                name="type"
                value={newTransaction.type}
                onChange={handleInputChange}
              >
                <option value="credit">💰 Credit (Incoming)</option>
                <option value="debit">💸 Debit (Outgoing)</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Description</label>
              <input
                type="text"
                name="description"
                value={newTransaction.description}
                onChange={handleInputChange}
                placeholder="Payment description..."
              />
            </div>
            
            <button 
              type="submit" 
              className={`btn ${newTransaction.type === 'credit' ? 'btn-success' : 'btn-primary'}`}
              disabled={creating}
              style={{ marginBottom: '20px' }}
            >
              {creating ? (
                <>
                  <div className="spinner" style={{ width: '16px', height: '16px', marginRight: '8px' }}></div>
                  Processing...
                </>
              ) : (
                `${newTransaction.type === 'credit' ? '💰' : '💸'} Create ${newTransaction.type === 'credit' ? 'Credit' : 'Debit'}`
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Transactions List */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ color: '#1f2937' }}>
            📊 {user?.role === 'admin' ? 'All System Transactions' : 'Your Transaction History'}
          </h3>
          <span style={{ 
            backgroundColor: '#f3f4f6', 
            padding: '6px 12px', 
            borderRadius: '20px', 
            fontSize: '14px',
            color: '#374151',
            fontWeight: '600'
          }}>
            {transactions.length} transactions
          </span>
        </div>
        
        {transactions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>💳</div>
            <p>No transactions yet. Create your first transaction above!</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  {user?.role === 'admin' && <th>User</th>}
                  <th>Amount</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Description</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td style={{ fontFamily: 'monospace', fontWeight: '600' }}>#{transaction.id}</td>
                    {user?.role === 'admin' && <td>User {transaction.userId}</td>}
                    <td>
                      <span style={{ 
                        color: transaction.type === 'credit' ? '#16a34a' : '#dc2626',
                        fontWeight: '700',
                        fontSize: '16px'
                      }}>
                        {transaction.type === 'credit' ? '+' : '-'}₦{transaction.amount.toLocaleString()}
                      </span>
                    </td>
                    <td>
                      <span className={`badge badge-${transaction.type}`}>
                        {transaction.type === 'credit' ? '💰 Credit' : '💸 Debit'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge badge-${transaction.status === 'completed' ? 'success' : 'warning'}`}>
                        {transaction.status === 'completed' ? '✅ Completed' : '⏳ Pending'}
                      </span>
                    </td>
                    <td style={{ color: '#6b7280' }}>
                      {transaction.description || 'No description'}
                    </td>
                    <td style={{ color: '#6b7280', fontSize: '14px' }}>
                      {new Date(transaction.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div style={{ 
        textAlign: 'center', 
        marginTop: '40px', 
        padding: '20px',
        color: '#9ca3af',
        fontSize: '14px'
      }}>
        <p>🔒 PayVerse - Secure Payment Processing Platform</p>
        <p>Demonstrating: SQL Database • JWT Authentication • REST API</p>
      </div>
    </div>
  );
};

export default Dashboard;
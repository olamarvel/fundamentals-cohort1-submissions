import {useState} from 'react';
import PaymentsPage from './pages/PaymentsPage';
import CustomersPage from './pages/CustomersPage';

export default function App() {
const [page, setPage] = useState<'payments' | 'customers'>('payments');


return (
    <div style={{padding: 20}}>
        <h1>LegacyBridge UI</h1>


        <nav style={{marginBottom: 20}}>
            <button onClick={() => setPage('payments')}>Payments</button>
            <button onClick={() => setPage('customers')}>Customers</button>
        </nav>


        {page === 'payments' ? <PaymentsPage /> : <CustomersPage />}
    </div>
);
}
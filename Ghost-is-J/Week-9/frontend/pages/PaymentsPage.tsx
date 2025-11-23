import {useEffect, useState} from 'react';
import api from '../api/client';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import PaymentCard from '../components/PaymentCard';


export default function PaymentsPage() {
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');
const [data, setData] = useState<any[]>([]);


useEffect(() => {
api.get('/v2/payments')
.then(res => setData(res.data))
.catch(err => setError(err.message))
.finally(() => setLoading(false));
}, []);


if (loading) return <Loader />;
if (error) return <ErrorMessage message={error} />;


return (
<div>
<h2>Payments</h2>
{data.map((p) => (
<PaymentCard key={p.id} {...p} />
))}
</div>
);
}
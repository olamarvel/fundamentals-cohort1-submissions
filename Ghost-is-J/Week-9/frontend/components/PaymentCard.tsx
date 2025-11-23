interface Props {
id: number;
amount: number;
customerName: string;
status: string;
}


export default function PaymentCard(props: Props) {
return (
        <div style={{ border: '1px solid #ccc', padding: 10, marginBottom: 10 }}>
            <h3>Payment #{props.id}</h3>
            <p><strong>Amount:</strong> {props.amount}</p>
            <p><strong>Customer:</strong> {props.customerName}</p>
            <p><strong>Status:</strong> {props.status}</p>
        </div>
    );
}
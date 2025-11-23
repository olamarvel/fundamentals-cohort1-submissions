export interface Customer {
  id: number;
  fullName: string;
  username: string;
  email: string;
  companyName: string;
  status: "active" | "inactive" | "suspended";
  registeredAt: string;
}

export interface Payment {
  id: number;
  customerId: number;
  title: string;
  description: string;
  amount: number;
  currency: "NGN";
  status: "completed" | "refunded" | "pending";
  processedAt: string;
}

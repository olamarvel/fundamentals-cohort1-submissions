export interface User {
  id: number;
  email: string;
  name: string;
  created_at: string;
}

export interface Transaction {
  id: number;
  user_id: number;
  amount: string; // Numeric from DB comes as string
  currency: string;
  status: "pending" | "completed" | "failed";
  reference: string | null;
  created_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

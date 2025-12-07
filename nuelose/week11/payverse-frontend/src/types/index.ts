export type User = {
  id: string;
  email: string;
  name: string | null;
};

export type Payment = {
  id: string;
  amount: number;
  currency: "NGN" | "GHS" | "KES";
  status: string;
  createdAt: string;
  sender: { name: string | null; email: string };
  receiver?: { name: string | null; email: string };
};

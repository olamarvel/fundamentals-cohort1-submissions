import { useState, useEffect, useCallback } from "react";
import { api } from "../lib/api";
import { Transaction } from "../types/index";
import { useWebSocket } from "./useWebSocket";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3001";

export function useTransactions(userId: number | null) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { isConnected, lastMessage } = useWebSocket(WS_URL);

  const fetchTransactions = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError("");
      const data = await api.getTransactions(userId);
      setTransactions(data);
    } catch {
      setError("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  }, [userId]); // Only recreate when userId changes

  const createTransaction = async (txData: {
    userId: number;
    amount: number;
    currency?: string;
    status?: string;
  }) => {
    try {
      await api.createTransaction(txData);
      await fetchTransactions();
      return true;
    } catch {
      setError("Failed to create transaction");
      return false;
    }
  };

  // Listen for WebSocket updates
  useEffect(() => {
    if (lastMessage) {
      console.log("🔄 Real-time update received:", lastMessage);

      // Type guard to check if message has 'type' property
      if (
        typeof lastMessage === "object" &&
        lastMessage !== null &&
        "type" in lastMessage &&
        (lastMessage as { type: string }).type === "transaction_created"
      ) {
        fetchTransactions();
      }
    }
  }, [lastMessage, fetchTransactions]);
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]); // Now safe to include

  return {
    transactions,
    loading,
    error,
    createTransaction,
    refetch: fetchTransactions,
    isConnected,
  };
}

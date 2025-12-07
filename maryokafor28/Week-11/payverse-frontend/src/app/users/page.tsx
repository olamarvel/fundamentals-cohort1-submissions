"use client";

import { useState } from "react";
import { useUsers } from "../../hooks/useUsers";
import { useRouter } from "next/navigation";

export default function UsersPage() {
  const router = useRouter();
  const { users, loading, error, createUser } = useUsers();
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [creating, setCreating] = useState(false);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    const success = await createUser(formData);
    if (success) {
      setFormData({ name: "", email: "" });
    }
    setCreating(false);
  };

  if (loading) return <div className="p-8">Loading users...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => router.push("/")}
        className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        Back to Home
      </button>

      <h1 className="text-3xl font-bold mb-6">Users (SQL Database)</h1>

      {/* Create User Form */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Create New User</h2>
        <form onSubmit={handleCreateUser} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="w-full p-2 border rounded"
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
            className="w-full p-2 border rounded"
          />
          <button
            type="submit"
            disabled={creating}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
          >
            {creating ? "Creating..." : "Create User"}
          </button>
        </form>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      {/* Users List */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">All Users</h2>
        {users.length === 0 ? (
          <p className="text-gray-500">No users found</p>
        ) : (
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="border p-4 rounded">
                <p className="font-semibold">{user.name}</p>
                <p className="text-gray-600">{user.email}</p>
                <p className="text-sm text-gray-400">
                  Created: {new Date(user.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { registerUser } from "../api/authApi";
import { validateEmail, validatePassword, sanitizeInput } from "../utils/validators";
import { useNavigate } from "react-router-dom";

const Register: React.FC = () => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const cleanFirstName = sanitizeInput(firstName);
    const cleanLastName = sanitizeInput(lastName);
    const cleanEmail = sanitizeInput(email);
    const cleanPassword = password;

    if (!validateEmail(cleanEmail)) {
      setError("Invalid email format");
      return;
    }

    if (!validatePassword(cleanPassword)) {
      setError(
        "Password must include uppercase, lowercase, number, and special character"
      );
      return;
    }

    try {
      await registerUser({cleanFirstName, cleanLastName, cleanEmail, cleanPassword});
      setSuccess("Registration successful! You can now log in.");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md w-96"
      >
        <h1 className="text-2xl font-bold mb-4 text-center">Register</h1>

        {error && <p className="text-red-500 text-center mb-2">{error}</p>}
        {success && <p className="text-green-500 text-center mb-2">{success}</p>}

        <div className="mb-3">
          <label className="block text-gray-700 text-sm font-bold mb-1">
            First Name
          </label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="John Doe"
          />
        </div>
       
        <div className="mb-3">
          <label className="block text-gray-700 text-sm font-bold mb-1">
            Last Name
          </label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="John Doe"
          />
        </div>

        <div className="mb-3">
          <label className="block text-gray-700 text-sm font-bold mb-1">
            Email
          </label>
          <input
            type="email"
            className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-1">
            Password
          </label>
          <input
            type="password"
            className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white w-full py-2 rounded-md hover:bg-green-700"
        >
          Register
        </button>

        <p className="text-center mt-3 text-sm">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 cursor-pointer"
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
};

export default Register;

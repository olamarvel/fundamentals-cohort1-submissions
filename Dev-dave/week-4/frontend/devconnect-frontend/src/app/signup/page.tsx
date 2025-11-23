"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api"; // axios instance (baseURL: your backend)
import Link from "next/link";
import { Eye, EyeOff } from  "lucide-react";


interface SignupFormInputs {
  name: string;
  email: string;
  password: string;
}

const SignUp = () => {
  const { register, handleSubmit, formState: { errors }, } = useForm<SignupFormInputs>();
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const onSubmit: SubmitHandler<SignupFormInputs> = async (data) => {
    try {
      await api.post("/auth/register", data);
      alert("Registration successful! Please log in.");
      router.push("/login");
    } catch (err) {
      console.error("Registration failed:", err);
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <main className="flex min-h-screen bg-amber-50 items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-4 text-center text-gray-800">
          Create Account
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input {...register("name", { required: "Full name is required" })} type="text" placeholder="Full Name" className="border-1 border-black-900 text-black p-2 w-full rounded" />
               {errors.name && (
               <p className="text-sm  mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
          <input {...register("email", { required: "Email is required", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,  message: "Please enter a valid email address", }, })} type="email" placeholder="Email" className="border-1 border-black-900 text-black p-2 w-full rounded" />
            {errors.email && (
            <p className="text-sm mt-1">
            {errors.email.message}
            </p>
            )}
          </div>

         <div className="relative mb-4">
          <input {...register("password", { required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters long", } })} type={showPassword ? "text" : "password"} placeholder="Password" className="border-1 border-black-900 text-black p-2 w-full mb-4 rounded pr-10"/>

        {/*Eye Icon Toggle */}
        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700" >
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>

        {errors.password && (
        <p className="text-sm mt-1">
        {errors.password.message}
        </p>
            )}
        </div>

          <button
            type="submit"
            className="w-full  text-white py-2 rounded bg-amber-500 hover:bg-amber-600  transition"
          >
            Sign Up
          </button>
        </form>

        {/* Link to Login */}
        <p className="text-sm text-center mt-4 text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-amber-500 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
};

export default SignUp;

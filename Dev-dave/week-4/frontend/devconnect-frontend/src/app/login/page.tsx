"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from  "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

interface LoginFormInputs {
  email: string;
  password: string;
}

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();
  const { login } = useAuth();
  const  router  = useRouter();
  
  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    try {
      const res = await api.post("/auth/login", data);
      login(res.data.user, res.data.accessToken);
      router.push("/homepage");
    } catch (err) {
      console.error("Login failed:", err);
      alert("Invalid credentials");
    }
  };


    return(
    <main className="flex min-h-screen bg-amber-50 items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-4 text-center text-gray-800">
          Login
        </h1>

     <form onSubmit={handleSubmit(onSubmit)} className="mx-auto mt-3 p-6  bg-white shadow rounded">
     <div>
        {/* Email */}
      <input {...register("email", { required: "Email is required", pattern: {  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Please enter a valid email address", } })} placeholder="Email" className="border-1 border-black-900 text-black p-2 w-full mb-4 rounded" />
       {errors.email && (
       <p className=" text-sm mb-2">{errors.email.message}</p>
      )}
     </div>
     
      {/* Password Field with Eye Toggle */}
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

      {/* Submit */}
      <button
        type="submit"
        className="bg-amber-500 hover:bg-amber-600 text-white p-2 w-full rounded transition"
      >
        Login
      </button>
    </form>
    </div>
    </main>
    );
}

export default LoginPage
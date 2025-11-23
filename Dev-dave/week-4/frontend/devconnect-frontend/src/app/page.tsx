"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const LandingPage = () =>  {
  const { user } = useAuth();
  const router = useRouter();

  
  useEffect(() => {
    if (user) {
      router.push("/homepage");
    }
  }, [user, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-amber-50 text-center px-6">
      <div className="max-w-2xl">
        <h1 className="text-5xl md:text-6xl font-bold mb-4  text-amber-900  tracking-tight">
          Welcome to DevConnect
        </h1>

        <p className="text-gray-600 text-lg md:text-xl mb-8">
           A place where developers share ideas, collaborate on projects, and build amazing products together.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.push("/signup")}
            className=" bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg shadow-md transition"
          >
            Get Started
          </button>

          <button
            onClick={() => router.push("/login")}
            className="border border-amber-400 text-amber-700 hover:bg-amber-100  px-6 py-3 rounded-lg shadow-md transition"
          >
            Login
          </button>
        </div>

       <footer className="w-full py-6 mt-5 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} DevConnect. Built for developers, by developers.
      </footer>
    </div>
    </div>
  );
}

export default LandingPage;

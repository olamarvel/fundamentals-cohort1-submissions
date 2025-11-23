"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

const LogoutPage = () => {
  const router = useRouter();
  const { logout } = useAuth();

  useEffect(() => {
    // Perform logout as soon as the page loads
    logout();

    // Redirect after 2 seconds
    const timer = setTimeout(() => {
      router.push("/");
    }, 2000);

    return () => clearTimeout(timer);
  }, [logout, router]);

  return (
    <main className="min-h-screen bg-amber-50 text-amber-900 flex flex-col items-center justify-center">
      <Navbar />
      <section className="flex flex-col items-center justify-center flex-grow text-center px-4">
        <h1 className="text-3xl font-bold mb-3 text-amber-800">Logging Out...</h1>
        <p className="text-amber-700">
          You are being signed out of your account. Redirecting to login page...
        </p>
        <div className="mt-6 w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
      </section>
      <Footer />
    </main>
  );
};

export default LogoutPage;

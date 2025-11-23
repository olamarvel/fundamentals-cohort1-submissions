"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

const CreateProjectPage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();
  const { token } = useAuth(); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!token) {
        console.error("No token found — user not authenticated");
        return;
      }

      await api.post("/projects", { title, description },{ headers: { Authorization: `Bearer ${token}` } } );
      router.push("/");
      } catch (error) {
        console.error("Failed to create project", error);
        alert("Something went wrong. Try again.");
      }
    };

  return (
   <main className="min-h-screen  bg-amber-50 text-gray-800">
       <Navbar />


     <section className="max-w-2xl mx-auto text-center py-20 px-6" >
       <h1 className="text-3xl text-gray-800  font-bold mb-6">Create a New Project</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Project title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border border-gray-700 rounded-lg p-3"
        />
        <textarea
          placeholder="Project description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border border-gray-700 rounded-lg p-3"
          rows={5}
        />
        <button
          type="submit"
          className=" bg-amber-600 hover:bg-amber-600  text-white py-3 rounded-lg hover:shadow-lg  transition"
        >
          Create Project
        </button>
      </form>
     </section>
      
    <Footer />
    </main>
  );
};

export default CreateProjectPage;

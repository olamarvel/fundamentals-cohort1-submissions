"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import ProjectCard from "../components/projectCard";
import api from "@/lib/api";

interface Author {
  name: string;
  email?: string;
}

interface Project {
  _id: string;
  title: string;
  description: string;
  author: Author;
}

const HomePage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get("/projects");
        setProjects(res.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <main className="min-h-screen bg-amber-50 text-gray-800">
      <Navbar />

      {/* HERO SECTION */}
      <section className="max-w-6xl mx-auto text-center py-16 px-6">
        <h1 className="text-4xl font-bold text-amber-900 mb-4">
          Welcome to <span className="text-amber-700">DevConnect</span>
        </h1>
        <p className="text-stone-500 text-lg max-w-2xl mx-auto mb-8">
          A community where developers share ideas, collaborate on projects,
          and build amazing products together.
        </p>
        <Link
          href="/createproject"
          className="inline-block px-6 py-3 bg-amber-600 text-white rounded-lg hover:shadow-lg transition font-medium"
        >
          Share a New Project
        </Link>
      </section>

      {/* PROJECTS LIST */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <h2 className="text-2xl font-semibold text-amber-900 mb-6">
          Explore Projects
        </h2>

        {loading ? (
          <p className="text-stone-500">Loading projects...</p>
        ) : projects.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <ProjectCard 
                 key={project._id}
                _id={project._id}
                title={project.title}
                description={project.description}
                author={project.author}
              />
            ))}
          </div>
        ) : (
          <p className="text-stone-500">No projects yet. Be the first to share one!</p>
        )}
      </section>

      <Footer />
    </main>
  );
};

export default HomePage;

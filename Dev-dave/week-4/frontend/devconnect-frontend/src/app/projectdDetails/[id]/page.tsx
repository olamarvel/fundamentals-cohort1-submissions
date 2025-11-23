"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import  CommentSection  from "../../components/commentSection";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";

interface Project {
  _id: string;
  title: string;
  description: string;
  author: { name: string };
  createdAt: string;
}

const ProjectDetailsPage = () => {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await api.get(`/projects/${id}`);
        setProject(response.data);
      } catch (error) {
        console.error("Failed to load project details:", error);
      }
    };

    fetchProject();
  }, [id]);

 if (!project)
  return (
    <main className="flex justify-center items-center min-h-screen bg-amber-50 text-amber-900">
      <p className="text-lg font-medium">Loading project...</p>
    </main>
  );

  return (
     <main className="min-h-screen bg-amber-50 text-amber-900">
       <Navbar />

      <section className="max-w-3xl mx-auto text-center py-20 px-6">
        <h1 className="text-3xl font-bold text-amber-900  mb-4">{project.title}</h1>
      <p className="text-amber-800 mb-4">{project.description}</p>
      <p className="text-sm text-amber-600 mb-6">
        By <span className="font-medium">{project.author?.name}</span> —{" "}
        {new Date(project.createdAt).toLocaleDateString()}
      </p>

      {/* ✅ Comment section here */}
      <CommentSection projectId={id as string} />
      </section>

     <Footer />
    </main>
  );
};

export default ProjectDetailsPage;

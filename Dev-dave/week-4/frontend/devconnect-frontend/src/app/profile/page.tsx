"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { Trash2 } from "lucide-react"; // for delete icon

interface Author {
  _id: string;
  name: string;
  email: string;
}

interface Project {
  _id: string;
  title: string;
  description: string;
  author: Author;
}

const ProfilePage = () => {
  const { user, token } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  
  useEffect(() => {
    const fetchProjects = async () => {
      if (!user || !token) {
        console.warn("No user or token found.");
        setLoading(false);
        return;
      }

      try {
        const res = await api.get(`/projects/user/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProjects(res.data.projects || res.data);
      } catch (err) {
        console.error("Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [user, token]);


  const handleDelete = async (projectId: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this project?");
    if (!confirmed) return;

    setDeleting(projectId);

    try {
      await api.delete(`/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Remove the deleted project from the list immediately
      setProjects((prev) => prev.filter((p) => p._id !== projectId));
      alert("Project deleted successfully");
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete project");
    } finally {
      setDeleting(null);
    }
  };

  
  if (loading) {
    return (
      <main className="flex justify-center items-center min-h-screen bg-amber-50 text-amber-800">
        <p className="text-lg font-medium">Loading profile...</p>
      </main>
    );
  }

  // No user
  if (!user) {
    return (
      <main className="flex justify-center items-center min-h-screen bg-amber-50 text-amber-800">
        <p className="text-lg font-medium">
          Unable to load profile. Please log in again.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-amber-50 text-amber-900">
      <Navbar />

      <section className="max-w-5xl mx-auto text-center py-20 px-6">
        <h1 className="text-3xl font-bold text-amber-900 mb-2">
          Hello, {user.name}
        </h1>
        <p className="text-amber-600">{user.email}</p>

        <h2 className="text-2xl font-semibold text-amber-800 mb-6 mt-8">
          Your Projects
        </h2>

        {projects.length === 0 ? (
          <p className="text-amber-600">You haven’t created any projects yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div
                key={project._id}
                className="relative bg-white shadow-md rounded-2xl border border-amber-100 hover:shadow-lg transition p-5 text-left"
              >
              
                <h3 className="text-xl font-semibold text-amber-900 mb-2">
                  {project.title}
                </h3>
                <p className="text-amber-700 mb-3">{project.description}</p>
                <p className="text-sm text-amber-500">
                  By {project.author.name}
                </p>

                
                <button
                  onClick={() => handleDelete(project._id)}
                  disabled={deleting === project._id}
                  className="absolute top-3 right-3 bg-red-100 text-red-600 hover:bg-red-200 p-2 rounded-full transition"
                  title="Delete project"
                >
                  {deleting === project._id ? (
                    <span className="text-xs font-medium">...</span>
                  ) : (
                    <Trash2 size={18} />
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
};

export default ProfilePage;

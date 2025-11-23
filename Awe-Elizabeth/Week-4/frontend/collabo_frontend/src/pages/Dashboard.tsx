import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getUserPosts } from "../services/api";
import PostForm from "../components/PostForm";
import PostCard from "../components/PostCard";

interface Post {
  _id: string;
  title: string;
  authorName: string
  description: string;
  createdAt?: string;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
      try {
        const data = await getUserPosts(); 
        setPosts(data);
      } catch (err) {
        console.error("Failed to fetch user posts", err);
      } finally {
        setLoading(false);
      }}

  // Fetch posts created by the logged-in user
  useEffect( () => {
    fetchPosts();
  }, []);

  // Update post list after creating a new one
  const handlePostCreated = async () => {
    await fetchPosts()
    //setPosts((prev) => [newPost, ...prev]);
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      {/* ===== Profile Header ===== */}
      <section className="bg-white shadow rounded-xl p-6 flex items-center gap-4 border">
        <img
          src="https://via.placeholder.com/80"
          alt="Profile"
          className="w-20 h-20 rounded-full border object-cover"
        />
        <div>
          <h1 className="text-2xl font-semibold">{user?.firstName || "John Doe"}</h1>
          <p className="text-gray-500 text-sm">{user?.email || "user@example.com"}</p>
        </div>
      </section>

      {/* ===== About Section ===== */}
      <section className="bg-white p-6 rounded-xl shadow border">
        <h2 className="text-lg font-semibold mb-2">About</h2>
        <p className="text-gray-600">
          Passionate developer who loves collaborating on open-source projects.
          You can edit this section to tell others more about yourself.
        </p>
      </section>

      {/* ===== Create Post Section ===== */}
      <section>
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="bg-indigo-600 text-white px-5 py-2 rounded hover:bg-indigo-500 transition"
          >
            + Create New Post
          </button>
        ) : (
          <PostForm onCancel={() => setShowForm(false)} onPostCreated={handlePostCreated} />
        )}
      </section>

      {/* ===== User Posts Section ===== */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">My Posts</h2>

        {loading ? (
          <p className="text-gray-500 text-sm">Loading your posts...</p>
        ) : posts.length === 0 ? (
          <p className="text-gray-500 text-sm">You haven’t created any posts yet.</p>
        ) : (
          posts.map((post) => <PostCard key={post._id} post={post} />)
        )}
      </section>
    </div>
  );
}

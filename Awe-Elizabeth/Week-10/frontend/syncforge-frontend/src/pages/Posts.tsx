import { useEffect, useState } from "react";

interface Post {
  id: number;
  title: string;
  description: string;
  authorName: string;
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/api/v1/posts")
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        setPosts(data.result);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading posts...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>All Posts</h2>

      {posts.slice(0, 10).map((post) => (
        <div key={post.id} style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10 }}>
          <h3>{post.title}</h3>
          <p>{post.description}</p>
        </div>
      ))}
    </div>
  );
}

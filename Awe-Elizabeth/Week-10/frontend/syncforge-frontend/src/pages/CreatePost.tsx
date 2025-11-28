import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreatePostPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [authorName, setAuthorName] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await fetch("http://localhost:3000/api/v1/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, authorName }),
    });

    navigate("/posts");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Create New Post</h2>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 400 }}>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ padding: 10 }}
        />

        <textarea
          placeholder="Body"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ padding: 10 }}
        />
         <input
          placeholder="Author Name"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          style={{ padding: 10 }}
        />

        <button type="submit" style={{ padding: 10, background: "blue", color: "white" }}>
          Submit
        </button>
      </form>
    </div>
  );
}

import { useState } from "react";
import { createPost } from "../services/api";
import { post } from "./PostCard";

interface PostFormProps {
  onCancel?: () => void;
  onPostCreated?: (post: post) => void;
}

const TECH_SKILLS = ["React", "Node.js", "TypeScript", "Python", "MongoDB", "SQL", "C#"];
export default function PostForm({ onCancel, onPostCreated }: PostFormProps) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const handleTagChange = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newPost = await createPost({ title, description: desc, skills: selectedTags });
      if(newPost.success){
        if (onPostCreated) onPostCreated(newPost);
            setTitle("");
            setDesc("");
      }else{
            alert(newPost.message)
      }
    } catch {
      alert("Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border rounded-xl p-4 shadow-md space-y-3"
    >
      <h2 className="text-lg font-semibold">New Project Post</h2>
      <input
        className="border p-2 w-full rounded"
        placeholder="Project Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        className="border p-2 w-full rounded"
        placeholder="Project Description"
        rows={4}
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        required
      />
      {/* Technology Checkboxes */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Technologies</h3>
        <div className="flex flex-wrap gap-3">
          {TECH_SKILLS.map((tag) => (
            <label
              key={tag}
              className={`flex items-center gap-2 border px-3 py-1 rounded-lg cursor-pointer hover:bg-gray-50 ${
                selectedTags.includes(tag) ? "border-indigo-500 bg-indigo-50" : "border-gray-300"
              }`}
            >
              <input
                type="checkbox"
                checked={selectedTags.includes(tag)}
                onChange={() => handleTagChange(tag)}
              />
              <span>{tag}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="flex justify-end gap-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="border px-4 py-2 rounded hover:bg-gray-100 transition"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-500 transition"
          disabled={loading}
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </div>
    </form>
  );
}

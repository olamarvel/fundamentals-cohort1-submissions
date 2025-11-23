"use client";
import { useState, FormEvent } from "react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";


  interface Comment {
  _id: string;
  text: string;
  author: { name: string };
  createdAt: string;
}

interface CommentFormProps {
  projectId: string;
  onCommentAdded: (comment: Comment) => void;
}

const CommentForm = ({ projectId, onCommentAdded }: CommentFormProps) => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    
    try {  
    if (!token) {
      alert("Please log in to add a comment.");
      return;
    }

     setLoading(true);

      const response = await api.post( `/comments/${projectId}`, { text }, { headers: { Authorization: `Bearer ${token}`, }, } );

      // ✅ Emit the new comment to the parent
      onCommentAdded(response.data);
      setText("");
    } catch (error) {
      console.error("Couldn't post comment:", error);
      alert("Failed to post comment. Please try again.");
    } finally {
      setLoading(false);
    }
    };

  
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write your comment..."
        className="w-full border border-amber-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
        rows={3}
      />
      <button
        type="submit"
        disabled={loading}
        className={`self-end bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition ${
          loading ? "opacity-75 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Posting..." : "Add Comment"}
      </button>
    </form>
  );
};

export default CommentForm;

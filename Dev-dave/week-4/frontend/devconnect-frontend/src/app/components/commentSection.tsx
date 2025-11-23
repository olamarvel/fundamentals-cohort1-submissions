"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import CommentForm from "./commentForm";


interface Comment {
  _id: string;
  text: string;
  author: { name: string };
  createdAt: string;
}

const CommentSection = ({ projectId }: { projectId: string }) => {
  const [comments, setComments] = useState<Comment[]>([]);

 useEffect(() => {
    const getComments = async () => {
      try {
        const response = await api.get(`/comments/${projectId}`);
        setComments(response.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    getComments();
  }, [projectId]);

  
  return (
    <div className="mt-10 bg-amber-50 rounded-xl p-6 border border-amber-100 shadow-sm">
      <h3 className="text-xl text-amber-800 font-semibold mb-4">Comments</h3>

      <CommentForm projectId={projectId} onCommentAdded={(comment) => setComments((prev) => [comment, ...prev])} />

      <div className="space-y-4 mt-6">
        {comments.length > 0 ? (
          comments.map((c) => (
            <div key={c._id} className=" bg-amber-100 p-3 rounded-lg">
              <p className="text-gray-900">{c.text}</p>
              <p className="text-xs text-amber-600 mt-1">
                By {c.author?.name || "Unknown"} —{" "}
                {new Date(c.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))
        ) : (
          <p className="text-amber-900">No comments yet. Be the first!</p>
        )}
      </div>
    </div>
  );
};

export default CommentSection;

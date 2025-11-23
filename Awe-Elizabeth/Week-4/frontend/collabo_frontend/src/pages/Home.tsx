import { useEffect, useState } from "react";
import PostCard, { post } from "../components/PostCard";
import { getAllPosts } from "../services/api";



const mockPosts = [
  { _id: "1", title: "Open Source Chat App", authorName: "Jane", description: "Looking for devs to build a React chat app." },
  { _id: "2", title: "AI Study Partner", authorName: "John", description: "Building an AI study app for students." },
];

export default function Home() {
    const [posts, setPosts] = useState(Array<post | null>)

    useEffect(() => {
        const getPosts = async () => {
            const res: post[] | [] = await getAllPosts();
            if(res) setPosts(res);                
        }
        getPosts();
    }, [])

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Explore Project Ideas</h1>
     {
        posts.length > 0 ? posts.map(post => <PostCard key={post?._id} post={post} />) :
        mockPosts.map(post => <PostCard key={post._id} post={post} />)
     }
    </div>
  );
}

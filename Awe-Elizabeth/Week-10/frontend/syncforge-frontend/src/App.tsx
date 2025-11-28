import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import PostsPage from "./pages/Posts"
import CreatePostPage from "./pages/CreatePost";

export default function App() {
  return (
    <BrowserRouter>
      <nav style={{ display: "flex", gap: "20px", padding: "20px" }}>
        <Link to="/">Home</Link>
        <Link to="/posts">All Posts</Link>
        <Link to="/create">Create Post</Link>
      </nav>

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/posts" element={<PostsPage />} />
        <Route path="/create" element={<CreatePostPage />} />
      </Routes>
    </BrowserRouter>
  );
}



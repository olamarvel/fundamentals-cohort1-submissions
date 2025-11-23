interface PostProps {
  post: post | null;
}
export interface post{
    _id: string,
    title: string,
    authorName: string,
    description: string
}

export default function PostCard({ post }: PostProps) {
  return (
    <div className="bg-white rounded-xl shadow p-4 border">
      <h2 className="text-lg font-medium">{post?.title}</h2>
      <p className="text-gray-600">{post?.description}</p>
      <p className="text-sm text-gray-400 mt-2">By {post?.authorName}</p>
    </div>
  );
}

import Link from "next/link";

interface Author {
  name: string;
  email?: string;
}

interface ProjectCardProps {
  _id: string;
  title: string;
  description: string;
  author: Author;
}

const ProjectCard = ({ _id, title, description, author }: ProjectCardProps) => {
  return (
    <div className="bg-amber-50 shadow-sm hover:shadow-lg rounded-xl p-6 border border-gray-100 transition">
      <h3 className="text-lg font-semibold text-amber-900 mb-2">{title}</h3>
      <p className="text-gray-800 text-sm mb-4">{description}</p>

      <p className="text-sm text-amber-600 mb-4">
        <span className="font-medium text-amber-800">By:</span> {author?.name || "Unknown"}
      </p>

      <Link
        href={`/projectdDetails/${_id}`}
        className="inline-block text-amber-800 font-medium hover:text-amber-600 hover:underline transition duration-200"
      >
        View Details →
      </Link>
    </div>
  );
};

export default ProjectCard;

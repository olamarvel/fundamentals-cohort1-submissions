import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-primary-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span className="text-xl font-bold">SyncForge</span>
          </Link>

          <div className="flex items-center space-x-6">
            <Link
              to="/"
              className="hover:text-primary-200 transition-colors font-medium"
            >
              Tasks
            </Link>
            <Link
              to="/create"
              className="hover:text-primary-200 transition-colors font-medium"
            >
              Create Task
            </Link>
            <Link
              to="/stats"
              className="hover:text-primary-200 transition-colors font-medium"
            >
              Statistics
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

import { Link } from "react-router-dom";
import { FiHome } from "react-icons/fi";

const NotFound = () => (
  <div className="min-h-[70vh] flex items-center justify-center px-4">
    <div className="text-center">
      <p className="text-7xl font-bold text-primary-600 mb-4">404</p>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
      <p className="text-gray-500 mb-6">The page you're looking for doesn't exist or has been moved.</p>
      <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition">
        <FiHome className="w-4 h-4" /> Go Home
      </Link>
    </div>
  </div>
);

export default NotFound;

import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-gray-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between relative">
        
        <div className="flex-shrink-0">
          <h1 className="text-2xl font-bold">Student Portal</h1>
        </div>

        <ul className="absolute left-1/2 transform -translate-x-1/2 flex space-x-6 items-center">
          <li>
            <Link
              to="/"
              className="hover:text-gray-300 transition font-medium"
            >
              Home
            </Link>
          </li>
          <li>
          </li>
          <li>
            <Link
              to="/students"
              className="hover:text-gray-300 transition font-medium"
            >
              Students
            </Link>
          </li>
          <li>
            <Link
              to="/login"
              className="hover:text-gray-300 transition font-medium"
            >
              Login
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;

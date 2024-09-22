// Header.jsx
import { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import LoginModal from "./LoginModal";
import { LogIn, LogOut, User } from "lucide-react";
import { Link } from "react-router-dom"; // Link'i import edin

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const [imageError, setImageError] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <header className="container mx-auto px-4">
      <div className="flex justify-between items-center py-4">
        <span className="font-bold text-xl text-gray-800">Console</span>
        <nav className="flex items-center space-x-4">
          {user ? (
            <>
            {user.role === 'admin' && (
  <>
    <Link to="/videos" className="text-blue-500 hover:text-blue-700 font-medium mr-4">Videos</Link>
    <Link to="/exercises" className="text-blue-500 hover:text-blue-700 font-medium">Exercises</Link>
  </>
)}
              {!imageError ? (
                <img
                  src={user.image}
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                  onError={handleImageError}
                />
              ) : (
                <User className="w-8 h-8 text-gray-600" />
              )}
              <span className="text-gray-700">{user.firstname} {user.lastname}</span>


              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Login
            </button>
          )}
        </nav>
      </div>
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </header>
  );
};

export default Header;

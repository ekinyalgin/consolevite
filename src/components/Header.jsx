// Header.jsx
import { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import LoginModal from "./LoginModal";
import { LogIn, LogOut, User, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const [imageError, setImageError] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const headerRef = useRef(); // Added reference to Header

  const handleImageError = () => {
    setImageError(true);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close menu when clicking outside the Header
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [headerRef]);

  return (
    <header ref={headerRef} className="bg-gradient-to-r from-gray-900 to-gray-700 text-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <span className="font-bold text-2xl text-white tracking-wide">Console</span>
          
          {/* Mobile menu button */}
          <button onClick={toggleMenu} className="md:hidden">
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {renderNavItems()}
          </nav>
        </div>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4">
            {renderNavItems()}
          </nav>
        )}
      </div>
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </header>
  );

  function renderNavItems() {
    return (
      <>
        {user ? (
          <>
            {user.role === 'admin' && (
              <div className="flex flex-col md:flex-row md:items-center md:space-x-6 space-y-2 md:space-y-0">
                <Link onClick={() => { setIsMenuOpen(false); }} to="/todos" className="text-gray-300 hover:text-blue-400 transition-colors duration-300 text-sm font-medium">Todos</Link>
                <Link onClick={() => { setIsMenuOpen(false); }} to="/sites" className="text-gray-300 hover:text-blue-400 transition-colors duration-300 text-sm font-medium">Sites</Link>
                <Link onClick={() => { setIsMenuOpen(false); }} to="/inspire" className="text-gray-300 hover:text-blue-400 transition-colors duration-300 text-sm font-medium">Inspire</Link>
                <Link onClick={() => { setIsMenuOpen(false); }} to="/exercises" className="text-gray-300 hover:text-blue-400 transition-colors duration-300 text-sm font-medium">Exercises</Link>

              </div>
            )}
            {user.role === 'emine' && (
              <div className="flex flex-col md:flex-row md:items-center md:space-x-6 space-y-2 md:space-y-0">
                <Link onClick={() => { setIsMenuOpen(false); }} to="/production" className="text-gray-300 hover:text-blue-400 transition-colors duration-300 text-sm font-medium">Production</Link>
              </div>
            )}
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              {!imageError ? (
                <img
                  src={user.image}
                  alt="Profile"
                  className="w-10 h-10 rounded-full border-2 border-blue-400 shadow-md"
                  onError={handleImageError}
                />
              ) : (
                <User className="w-10 h-10 text-blue-400 bg-gray-700 rounded-full p-1" />
              )}
              <span className="text-gray-300 font-medium">{user.firstname} {user.lastname}</span>
            </div>

            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center transition-all duration-300 shadow-md hover:shadow-lg mt-4 md:mt-0"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsLoginModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <LogIn className="w-4 h-4 mr-2" />
            Login
          </button>
        )}
      </>
    );
  }
};

export default Header;

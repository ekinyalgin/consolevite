import { useState } from "react";
import { LogIn } from "lucide-react";

const LoginModal = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const google = () => {
    window.open(`${import.meta.env.VITE_SERVER_URL}/auth/google`, "_self");
  };

  if (!isOpen) return null;

  const handleOutsideClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={handleOutsideClick}
    >
      <div className="text-gray-600 bg-white rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-2 text-center">Welcome Back</h2>
        <p className="mb-6 text-center">Please sign in to continue</p>
        <button
          onClick={google}
          className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
        >
          <LogIn className="w-5 h-5 mr-2" />
          Sign in with Google
        </button>
        <button
          onClick={onClose}
          className="mt-4 w-full bg-gray-200 text-gray-800 py-3 rounded-md hover:bg-gray-300 transition duration-150 ease-in-out"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default LoginModal;
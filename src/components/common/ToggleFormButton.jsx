import React from 'react';
import { Plus, X } from 'lucide-react';

const ToggleFormButton = ({ isOpen, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-4 right-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 shadow-lg transition-all duration-300 transform hover:scale-110"
      aria-label={isOpen ? "Close form" : "Open form"}
    >
      {isOpen ? <X size={24} /> : <Plus size={24} />}
    </button>
  );
};

export default ToggleFormButton;

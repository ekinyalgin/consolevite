// components/Sites/LanguagePopup.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

const LanguagePopup = ({ onClose, onNotification, onLanguageChange }) => {
  const [languages, setLanguages] = useState([]);
  const [newLanguage, setNewLanguage] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchLanguages();
  }, []);

  const fetchLanguages = async () => {
    try {
      const response = await axios.get(`${API_URL}/sites/languages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLanguages(response.data);
    } catch (error) {
      onNotification('Error fetching languages', 'error');
    }
  };

  const handleAddLanguage = async () => {
    if (!newLanguage.trim()) return;
    try {
      const response = await axios.post(
        `${API_URL}/sites/languages`,
        { name: newLanguage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLanguages([...languages, response.data]);
      setNewLanguage('');
      onLanguageChange(); // Güncelleme için tetikleme
      onNotification('Language added successfully', 'success');
    } catch (error) {
      onNotification('Error adding language', 'error');
    }
  };

  const handleDeleteLanguage = async (id) => {
    if (window.confirm('Are you sure you want to delete this language?')) {
      try {
        await axios.delete(`${API_URL}/sites/languages/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLanguages(languages.filter((lang) => lang.id !== id));
        onLanguageChange(); // Güncelleme için tetikleme
        onNotification('Language deleted successfully', 'success');
      } catch (error) {
        onNotification('Error deleting language', 'error');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
  <div className="bg-white p-6 rounded-xl shadow-xl w-96 transform transition-all duration-300 scale-100">
    <h2 className="text-2xl font-semibold text-gray-700 mb-4 text-center">Manage Languages</h2>

    <div className="flex flex-col mb-4">
      <input
        type="text"
        value={newLanguage}
        onChange={(e) => setNewLanguage(e.target.value)}
        className="w-full p-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="Enter new language"
      />
      <button
        onClick={handleAddLanguage}
        className="mt-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-200 shadow-md hover:shadow-lg"
      >
        Add Language
      </button>
    </div>

    <ul className="max-h-40 overflow-y-auto border-t border-b border-gray-200 divide-y divide-gray-200 mb-4">
      {languages.map((lang) => (
        <li key={lang.id} className="flex justify-between items-center py-2 px-1 hover:bg-gray-100 transition-colors">
          <span className="text-gray-700 px-2">{lang.name}</span>
          <button
            onClick={() => handleDeleteLanguage(lang.id)}
            className="text-red-500 hover:text-red-700 transition-colors px-2"
          >
            <Trash2 strokeWidth={2}  />
          </button>
        </li>
      ))}
    </ul>

    <button
      onClick={onClose}
      className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-md transition duration-200"
    >
      Close
    </button>
  </div>
</div>

  );
};

export default LanguagePopup;

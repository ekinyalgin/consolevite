// components/Sites/LanguagePopup.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import tableClasses from '../../utils/tableClasses';

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
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-xl font-bold mb-4">Manage Languages</h2>
        <div className="mb-4">
          <input
            type="text"
            value={newLanguage}
            onChange={(e) => setNewLanguage(e.target.value)}
            className={tableClasses.formInput}
            placeholder="Enter new language"
          />
          <button onClick={handleAddLanguage} className={`${tableClasses.formButton} mt-2`}>
            Add Language
          </button>
        </div>
        <ul className="mb-4">
          {languages.map((lang) => (
            <li key={lang.id} className="flex justify-between items-center border-b py-2">
              {lang.name}
              <button
                onClick={() => handleDeleteLanguage(lang.id)}
                className={tableClasses.deleteIcon}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
        <button onClick={onClose} className={tableClasses.cancelButton}>
          Close
        </button>
      </div>
    </div>
  );
};

export default LanguagePopup;

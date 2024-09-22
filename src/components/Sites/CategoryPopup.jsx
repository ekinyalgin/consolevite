// components/Sites/CategoryPopup.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import tableClasses from '../../utils/tableClasses';

const API_URL = import.meta.env.VITE_API_URL;

const CategoryPopup = ({ onClose, onNotification, onCategoryChange }) => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/sites/categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(response.data);
    } catch (error) {
      onNotification('Error fetching categories', 'error');
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      const response = await axios.post(
        `${API_URL}/sites/categories`,
        { name: newCategory },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCategories([...categories, response.data]);
      setNewCategory('');
      onCategoryChange(); // Güncelleme için tetikleme
      onNotification('Category added successfully', 'success');
    } catch (error) {
      onNotification('Error adding category', 'error');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await axios.delete(`${API_URL}/sites/categories/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategories(categories.filter((cat) => cat.id !== id));
        onCategoryChange(); // Güncelleme için tetikleme
        onNotification('Category deleted successfully', 'success');
      } catch (error) {
        onNotification('Error deleting category', 'error');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-xl font-bold mb-4">Manage Categories</h2>
        <div className="mb-4">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className={tableClasses.formInput}
            placeholder="Enter new category"
          />
          <button onClick={handleAddCategory} className={`${tableClasses.formButton} mt-2`}>
            Add Category
          </button>
        </div>
        <ul className="mb-4">
          {categories.map((cat) => (
            <li key={cat.id} className="flex justify-between items-center border-b py-2">
              {cat.name}
              <button
                onClick={() => handleDeleteCategory(cat.id)}
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

export default CategoryPopup;

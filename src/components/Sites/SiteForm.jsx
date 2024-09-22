// components/Sites/SiteForm.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import tableClasses from '../../utils/tableClasses';
import LanguagePopup from './LanguagePopup';
import CategoryPopup from './CategoryPopup';

const API_URL = import.meta.env.VITE_API_URL;

const SiteForm = ({ onSubmit, onCancel, initialData, onNotification }) => {  // onNotification prop'unu ekleyin
  const [formData, setFormData] = useState({
    domainName: '',
    monthlyVisitors: '',
    language: '',
    category: ''
  });
  const [languages, setLanguages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showLanguagePopup, setShowLanguagePopup] = useState(false);
  const [showCategoryPopup, setShowCategoryPopup] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchLanguages();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData({
        domainName: initialData.domain_name,
        monthlyVisitors: initialData.monthly_visitors,
        language: initialData.language,
        category: initialData.category,
      });
    }
  }, [initialData]);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submittedData = {
      id: initialData?.id, // Eğer güncelleme ise, id'yi ekleyin
      domain_name: formData.domainName,
      monthly_visitors: parseInt(formData.monthlyVisitors, 10),
      language: formData.language,
      category: formData.category
    };
    onSubmit(submittedData);
  };

  return (
    <form onSubmit={handleSubmit} className={tableClasses.formContainer}>
      <div className="mb-4">
        <label className={tableClasses.formLabel}>Domain Name</label>
        <input
          type="text"
          name="domainName"
          value={formData.domainName}
          onChange={handleInputChange}
          className={tableClasses.formInput}
          required
        />
      </div>
      <div className="mb-4">
        <label className={tableClasses.formLabel}>Monthly Visitors</label>
        <input
          type="number"
          name="monthlyVisitors"
          value={formData.monthlyVisitors}
          onChange={handleInputChange}
          className={tableClasses.formInput}
          required
        />
      </div>
      <div className="mb-4 flex items-center">
        <label className={tableClasses.formLabel}>Language</label>
        <select
          name="language"
          value={formData.language}
          onChange={handleInputChange}
          className={tableClasses.formInput}
          required
        >
          <option value="">Select Language</option>
          {languages.map((lang) => (
            <option key={lang.id} value={lang.name}>{lang.name}</option>
          ))}
        </select>
        <button type="button" onClick={() => setShowLanguagePopup(true)} className={`${tableClasses.addButton} ml-2`}>
          Add Language
        </button>
      </div>
      <div className="mb-4 flex items-center">
        <label className={tableClasses.formLabel}>Category</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          className={tableClasses.formInput}
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.name}>{cat.name}</option>
          ))}
        </select>
        <button type="button" onClick={() => setShowCategoryPopup(true)} className={`${tableClasses.addButton} ml-2`}>
          Add Category
        </button>
      </div>
      <div className="flex space-x-4">
        <button type="submit" className={tableClasses.formButton}>
          {initialData ? 'Update' : 'Add'} Site
        </button>
        <button type="button" onClick={onCancel} className={tableClasses.cancelButton}>
          Cancel
        </button>
      </div>

      {/* Language Popup */}
      {showLanguagePopup && (
        <LanguagePopup
          onClose={() => setShowLanguagePopup(false)}
          onNotification={onNotification}
          onLanguageChange={fetchLanguages} // Yeni dil eklendiğinde verileri yenile
        />
      )}

      {/* Category Popup */}
      {showCategoryPopup && (
        <CategoryPopup
          onClose={() => setShowCategoryPopup(false)}
          onNotification={onNotification}
          onCategoryChange={fetchCategories} // Yeni kategori eklendiğinde verileri yenile
        />
      )}
    </form>
  );
};

export default SiteForm;

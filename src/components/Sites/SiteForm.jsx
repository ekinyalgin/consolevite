// components/Sites/SiteForm.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import tableClasses from '../../utils/tableClasses';
import LanguagePopup from './LanguagePopup';
import CategoryPopup from './CategoryPopup';

const API_URL = import.meta.env.VITE_API_URL;

const SiteForm = ({ onNotification, onSiteAdded, selectedSite, resetSelectedSite }) => {
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
    if (selectedSite) {
      setFormData({
        domainName: selectedSite.domain_name,
        monthlyVisitors: selectedSite.monthly_visitors,
        language: selectedSite.language,
        category: selectedSite.category,
      });
    }
  }, [selectedSite]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedSite) {
        const response = await axios.put(`${API_URL}/sites/${selectedSite.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        onNotification('Site updated successfully', 'success');
        onSiteAdded(response.data);
      } else {
        const response = await axios.post(`${API_URL}/sites`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        onNotification('Site added successfully', 'success');
        onSiteAdded(response.data);
      }
      resetForm();
    } catch (error) {
      onNotification('Error saving site', 'error');
    }
  };

  const resetForm = () => {
    setFormData({ domainName: '', monthlyVisitors: '', language: '', category: '' });
    resetSelectedSite(); // Edit işlemi tamamlandığında formu resetler
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
          {selectedSite ? 'Update' : 'Add'}
        </button>
        {selectedSite && (
          <button type="button" onClick={resetForm} className={tableClasses.cancelButton}>
            X
          </button>
        )}
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

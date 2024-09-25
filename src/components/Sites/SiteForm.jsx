// components/Sites/SiteForm.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import tableClasses from '../../utils/tableClasses';
import LanguagePopup from './LanguagePopup';
import CategoryPopup from './CategoryPopup';
import { XCircle, Plus } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

const SiteForm = ({ onSubmit, onCancel, initialData, onNotification }) => {
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
        domainName: initialData.domain_name || '',
        monthlyVisitors: initialData.monthly_visitors || '',
        language: initialData.language || '',
        category: initialData.category || '',
      });
    } else {
      resetForm();
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
    
    // Boş alanları kontrol et
    if (!formData.domainName.trim() || !formData.monthlyVisitors || !formData.language || !formData.category) {
      onNotification('All fields are required', 'error');
      return;
    }

    const submittedData = {
      id: initialData?.id,
      domain_name: formData.domainName.trim(),
      monthly_visitors: parseInt(formData.monthlyVisitors, 10),
      language: formData.language,
      category: formData.category
    };

    console.log('Submitting data:', submittedData); // Debugging için

    onSubmit(submittedData);
  };

  const resetForm = () => {
    setFormData({
      domainName: '',
      monthlyVisitors: '',
      language: '',
      category: ''
    });
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className={tableClasses.formContainer + " space-y-4"}>
      <input
        type="text"
        name="domainName"
        value={formData.domainName}
        onChange={handleInputChange}
        className={`${tableClasses.formInput} w-full`}
        placeholder="Domain Name"
        required
      />
      <input
        type="number"
        name="monthlyVisitors"
        value={formData.monthlyVisitors}
        onChange={handleInputChange}
        className={`${tableClasses.formInput} w-full`}
        placeholder="Monthly Visitors"
        required
      />
      <div className="flex items-center space-x-2">
        <select
          name="language"
          value={formData.language}
          onChange={handleInputChange}
          className={`${tableClasses.formInput} w-3/4`}
          required
        >
          <option value="">Select Language</option>
          {languages.map((lang) => (
            <option key={lang.id} value={lang.name}>{lang.name}</option>
          ))}
        </select>
        <button 
          type="button" 
          onClick={() => setShowLanguagePopup(true)} 
          className={`${tableClasses.addButton} w-1/4 flex items-center justify-center`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <div className="flex items-center space-x-2">
        <select
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          className={`${tableClasses.formInput} w-3/4`}
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.name}>{cat.name}</option>
          ))}
        </select>
        <button 
          type="button" 
          onClick={() => setShowCategoryPopup(true)} 
          className={`${tableClasses.addButton} w-1/4 flex items-center justify-center`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <div className="flex space-x-2">
        <button
          type="submit"
          className={`${tableClasses.formButton} ${initialData ? 'w-4/6' : 'w-full'}`}
        >
          {initialData ? 'Update' : 'Add'} Site
        </button>
        {initialData && (
          <button
            type="button"
            onClick={resetForm}
            className={`${tableClasses.formButton} w-2/6 flex items-center justify-center`}
          >
            <XCircle className="w-4 h-4" />
          </button>
        )}
      </div>

      {showLanguagePopup && (
        <LanguagePopup
          onClose={() => setShowLanguagePopup(false)}
          onNotification={onNotification}
          onLanguageChange={fetchLanguages}
        />
      )}

      {showCategoryPopup && (
        <CategoryPopup
          onClose={() => setShowCategoryPopup(false)}
          onNotification={onNotification}
          onCategoryChange={fetchCategories}
        />
      )}
    </form>
  );
};

export default SiteForm;

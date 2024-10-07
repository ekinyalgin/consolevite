import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FormComponent from '../common/FormComponent';
import LanguagePopup from './LanguagePopup';
import CategoryPopup from './CategoryPopup';
import { Plus } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

const SiteForm = ({ onSubmit, onCancel, initialData, onNotification }) => {
  const [formData, setFormData] = useState({
    domain_name: '',
    monthly_visitors: '',
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
        domain_name: initialData.domain_name || '',
        monthly_visitors: initialData.monthly_visitors || '',
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

  const handleChange = (name, value) => {
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.domain_name.trim() || !formData.monthly_visitors || !formData.language || !formData.category) {
      onNotification('All fields are required', 'error');
      return;
    }

    const submittedData = {
      id: initialData?.id,
      domain_name: formData.domain_name.trim(),
      monthly_visitors: parseInt(formData.monthly_visitors, 10),
      language: formData.language,
      category: formData.category
    };

    onSubmit(submittedData);
  };

  const resetForm = () => {
    setFormData({
      domain_name: '',
      monthly_visitors: '',
      language: '',
      category: ''
    });
    onCancel();
  };

  const fields = [
    { name: 'domain_name', label: 'Domain Name', type: 'text', required: true },
    { name: 'monthly_visitors', label: 'Monthly Visitors', type: 'number', required: true },
    { 
      name: 'language', 
      label: 'Language', 
      type: 'custom',
      required: true,
      render: (value, onChange) => (
        <div className="flex items-center space-x-2">
          <select
            value={value}
            onChange={(e) => onChange('language', e.target.value)}
            className="text-sm text-gray-400 w-4/5 p-2 border rounded"
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
            className="w-1/5 h-9 bg-blue-500 text-white rounded flex items-center justify-center"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      )
    },
    { 
      name: 'category', 
      label: 'Category', 
      type: 'custom',
      required: true,
      render: (value, onChange) => (
        <div className="flex items-center space-x-2">
          <select
            value={value}
            onChange={(e) => onChange('category', e.target.value)}
            className="text-sm text-gray-400 w-4/5 p-2 border rounded"
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
            className="w-1/5 h-9 p-2 bg-blue-500 text-white rounded flex items-center justify-center"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      )
    },
  ];

  return (
    <>
      <FormComponent
        formData={formData}
        fields={fields}
        title="Site"
        onChange={handleChange}
        onSubmit={handleSubmit}
        onCancel={resetForm}
        isEdit={!!initialData}
      />

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
    </>
  );
};

export default SiteForm;
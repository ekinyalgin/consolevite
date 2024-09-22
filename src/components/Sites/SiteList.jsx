// components/Sites/SiteList.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import tableClasses from '../../utils/tableClasses';
import { Link } from 'react-router-dom';
import { CheckSquare, Eye, Download, Edit, Trash2, Settings } from 'lucide-react';
import BulkUpdateVisitors from './BulkUpdateVisitors';

const API_URL = import.meta.env.VITE_API_URL;

const SiteList = ({ onNotification, onEditSite }) => {
  const [sites, setSites] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(localStorage.getItem('activeCategory') || null);
  const [showBulkUpdate, setShowBulkUpdate] = useState(false); // Bulk Update formu için state
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (activeCategory) {
      fetchSitesByCategory(activeCategory);
    }
  }, [activeCategory]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/sites/categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(response.data);
      if (!activeCategory && response.data.length > 0) {
        setActiveCategory(response.data[0].name);
      }
    } catch (error) {
      onNotification('Error fetching categories', 'error');
    }
  };

  const fetchSitesByCategory = async (category) => {
    try {
      const response = await axios.get(`${API_URL}/sites`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const filteredSites = response.data.filter((site) => site.category === category);
      setSites(filteredSites);
      localStorage.setItem('activeCategory', category);
    } catch (error) {
      onNotification('Error fetching sites', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this site?')) {
      try {
        await axios.delete(`${API_URL}/sites/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        onNotification('Site deleted successfully', 'success');
        fetchSitesByCategory(activeCategory);
      } catch (error) {
        onNotification('Error deleting site', 'error');
      }
    }
  };

  return (
    <div className={tableClasses.container}>
      <div className="mb-4 border-b border-gray-200 flex justify-between">
        <ul className="flex flex-wrap -mb-px">
          {categories.map((category) => (
            <li key={category.id} className="mr-2">
              <button
                className={`inline-block p-4 text-gray-400 font-semibold text-sm ${
                  activeCategory === category.name
                    ? 'text-blue-600 border-b-2 text-black border-gray-600'
                    : 'hover:text-gray-600 hover:border-gray-300'
                }`}
                onClick={() => setActiveCategory(category.name)}
              >
                {category.name}
              </button>
            </li>
          ))}
        </ul>
        <button
          className="text-blue-500 hover:text-blue-700"
          onClick={() => setShowBulkUpdate(!showBulkUpdate)}
        >
          <Settings /> Bulk Update
        </button>
      </div>

      {showBulkUpdate && (
        <BulkUpdateVisitors
          activeCategory={activeCategory}
          onNotification={onNotification}
        />
      )}

      {/* Site Tablosu */}
      <table className={tableClasses.table}>
        <thead className={tableClasses.tableHeader}>
          <tr>
            <th className={tableClasses.tableHeaderCell}><CheckSquare /></th>
            <th className={tableClasses.tableHeaderCell}>Domain Name</th>
            <th className={tableClasses.tableHeaderCell}>Monthly Visitors</th>
            <th className={tableClasses.tableHeaderCell}>Language</th>
            <th className={tableClasses.tableHeaderCell}>Actions</th>
          </tr>
        </thead>
        <tbody className={tableClasses.tableBody}>
          {sites.map((site) => (
            <tr key={site.id} className={tableClasses.tableRow}>
              <td className={tableClasses.tableCell}>
                <input type="checkbox" />
              </td>
              <td className={tableClasses.tableCell}>{site.domain_name}</td>
              <td className={tableClasses.tableCell}>{site.monthly_visitors}</td>
              <td className={tableClasses.tableCell}>{site.language}</td>
              <td className={tableClasses.tableCell}>
                <div className={tableClasses.actionContainer}>
                  <Link to={`/admin/url-review/${site.domain_name}`} className={tableClasses.noteIcon}>
                    <Eye />
                  </Link>
                  <button className={tableClasses.editIcon} onClick={() => onEditSite(site)}>
                    <Edit />
                  </button>
                  <button className={tableClasses.deleteIcon} onClick={() => handleDelete(site.id)}>
                    <Trash2 />
                  </button>
                  <button className={tableClasses.editIcon}>
                    <Download />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {sites.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center py-4">
                No sites available for this category
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SiteList;

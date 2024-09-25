import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BulkUpdateVisitors from './BulkUpdateVisitors'; 
import tableClasses from '../../utils/tableClasses';
import { CheckSquare, Eye, Download, Edit, Trash2, Settings, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

const SiteList = ({ onNotification, onEditSite, refreshKey }) => {
  const [sites, setSites] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(localStorage.getItem('activeCategory') || null);
  const [selectedSites, setSelectedSites] = useState([]); 
  const [showBulkUpdate, setShowBulkUpdate] = useState(false); 
  const token = localStorage.getItem('token');
  const [languages, setLanguages] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingSite, setEditingSite] = useState(null);

  useEffect(() => {
    fetchCategories();
    fetchLanguages();
  }, []);

  useEffect(() => {
    if (activeCategory) {
      fetchSitesByCategory(activeCategory);
    }
  }, [activeCategory, refreshKey]);

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

  const handleDownload = async (domainName, language, monthlyVisitors) => {
    try {
      const response = await axios.get(`${API_URL}/excel/download/${domainName}`, {
        params: { language, monthlyVisitors },
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      onNotification('Error while downloading the file', 'error');
    }
  };

  const fetchExcelUrls = async (domainName) => {
    try {
      const response = await axios.get(`${API_URL}/excel/content/${domainName}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching Excel URLs:', error);
      return [];
    }
  };

  const fetchSitesByCategory = async (category) => {
    try {
      const response = await axios.get(`${API_URL}/sites`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const filteredSites = response.data.filter(site => site.category === category);
      
      const sitesWithReviewStatus = await Promise.all(filteredSites.map(async (site) => {
        // Excel dosyasının olup olmadığını ve URL durumunu kontrol edin
        const checkResponse = await axios.get(`${API_URL}/excel/check-excel/${site.domain_name}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const hasExcelFile = checkResponse.data.hasFile;

        // URL'leri kontrol etme (not reviewed kısmında URL var mı?)
        const urlStatusResponse = await axios.get(`${API_URL}/urls/status/${site.domain_name}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { hasNotReviewed, hasReviewed } = urlStatusResponse.data;

        return {
          ...site,
          hasExcelFile,
          hasNotReviewed,
          hasReviewed,
        };
      }));

      setSites(sitesWithReviewStatus);
      localStorage.setItem('activeCategory', category);
    } catch (error) {
      onNotification('Error fetching sites', 'error');
    }
  };

  const handleCheckboxChange = (site) => {
    if (selectedSites.some(selected => selected.id === site.id)) {
      setSelectedSites(selectedSites.filter(selected => selected.id !== site.id));
    } else {
      setSelectedSites([...selectedSites, site]);
    }
  };

  const handleBulkDownload = async () => {
    if (selectedSites.length === 0) {
      onNotification('Please select at least one site', 'error');
      return;
    }

    try {
      await axios.post(`${API_URL}/excel/download-multiple`, 
        { 
          sites: selectedSites.map(site => ({
            domainName: site.domain_name,
            language: site.language,
            monthlyVisitors: site.monthly_visitors
          }))
        }, 
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      onNotification('Bulk download started successfully', 'success');
    } catch (error) {
      onNotification('Error during bulk download', 'error');
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

  const handleEditClick = (site) => {
    onEditSite(site);
  };

  const handleAddAllNewUrls = async () => {
    try {
      const sitesWithExcel = sites.filter(site => site.hasExcelFile);
      for (const site of sitesWithExcel) {
        const excelUrls = await fetchExcelUrls(site.domain_name);
        const dbUrlsResponse = await axios.get(`${API_URL}/urls/${site.domain_name}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const dbUrls = [...dbUrlsResponse.data.notReviewed, ...dbUrlsResponse.data.reviewed].map(url => url.url);
        const newUrls = excelUrls.filter(url => !dbUrls.includes(url));
        if (newUrls.length > 0) {
          await axios.post(`${API_URL}/urls/add-urls/${site.domain_name}`, 
            { urls: newUrls }, 
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          // Delete the Excel file after adding URLs
          await axios.delete(`${API_URL}/excel/delete/${site.domain_name}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
        }
      }
      onNotification('New URLs from Excel files added to the database and Excel files deleted', 'success');
      fetchSitesByCategory(activeCategory); // Refresh the site list
    } catch (error) {
      console.error('Error adding new URLs from Excel files to the database:', error);
      onNotification('Error adding new URLs from Excel files to the database', 'error');
    }
  };

  return (
    <div>
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
          className="text-gray-600 hover:text-blue-700"
          onClick={() => setShowBulkUpdate(!showBulkUpdate)}
        >
          <Settings /> 
        </button>
      </div>

      {/* BulkUpdateVisitors Bileşeni */}
      {showBulkUpdate && (
        <BulkUpdateVisitors
          activeCategory={activeCategory}
          onNotification={onNotification}
        />
      )}

      {/* Site Tablosu */}
      <table className={tableClasses.table}>
        <thead className={tableClasses.tableHeaderRow}>
        <tr>
            <th className={tableClasses.tableHeader + " w-1/12"}>Check</th>
            <th className={tableClasses.tableHeader + " w-3/12 text-left px-2"}>Domain Name</th>
            <th className={tableClasses.tableHeader + " w-2/12"}>Monthly</th>
            <th className={tableClasses.tableHeader + " w-2/12"}>Language</th>
            <th className={tableClasses.tableHeader + " w-2/12"}>Download</th>
            <th className={tableClasses.tableHeader + " w-2/12"}>Actions</th>
          </tr>
        </thead>
        <tbody className={tableClasses.tableBody}>
          {sites.map((site) => (
            <tr key={site.id} className={tableClasses.tableRow}>
              <td className={tableClasses.tableCell}>
                <input
                  type="checkbox"
                  checked={selectedSites.some(selected => selected.id === site.id)}
                  onChange={() => handleCheckboxChange(site)}
                />
              </td>
              <td className="border-b border-gray-100 text-left text-sm px-2">
              {site.hasNotReviewed ? (
                    <Link to={`/url-review/${site.domain_name}`} className={tableClasses.noteIcon}>
                      {site.domain_name}
                    </Link>
                  ) : (
                    <span>{site.domain_name}</span>
                  )}
              </td>
              <td className={tableClasses.tableCell}>{site.monthly_visitors}</td>
              <td className={tableClasses.tableCell}>{site.language}</td>
              <td className={tableClasses.tableCell}>
              <button onClick={() => handleDownload(site.domain_name, site.language, site.monthly_visitors)}>
                      <Download className={tableClasses.downloadIcon} strokeWidth={2} />
                    </button>

              </td>
              <td className={tableClasses.tableCell}>
                <div className="flex items-center justify-center space-x-2 h-full">
              
                  <button onClick={() => handleEditClick(site)}>
                    <Edit className={tableClasses.editIcon} strokeWidth={2}  />
                  </button>
                  <button onClick={() => handleDelete(site.id)}>
                    <Trash2 className={tableClasses.deleteIcon} strokeWidth={2}  />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {sites.length === 0 && (
            <tr>
              <td colSpan="7" className="text-center py-4">
                No sites available for this category
              </td>
            </tr>
          )}
        </tbody>
      </table>

            <div className="mt-4 flex items-center justify-between">
        <button 
          onClick={handleBulkDownload}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Download Report
        </button>
      

        <button 
          onClick={handleAddAllNewUrls}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Add All New URLs from Excel Files
        </button>
      </div>
    </div>
  );
};

export default SiteList;

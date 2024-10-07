import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TableComponent from '../common/TableComponent';
import { Download, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import BulkUpdateVisitors from './BulkUpdateVisitors';
import SiteListActions from './SiteListActions';

const API_URL = import.meta.env.VITE_API_URL;

const SiteList = ({ onNotification, onEditSite, refreshKey }) => {
  const [sites, setSites] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(localStorage.getItem('activeCategory') || null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showBulkUpdate, setShowBulkUpdate] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchCategories();
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

  const fetchSitesByCategory = async (category) => {
    try {
      const response = await axios.get(`${API_URL}/sites`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const filteredSites = response.data.filter(site => site.category === category);

      const sitesWithReviewStatus = await Promise.all(filteredSites.map(async (site) => {
        const checkResponse = await axios.get(`${API_URL}/excel/check-excel/${site.domain_name}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const hasExcelFile = checkResponse.data.hasFile;

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

  const handleDownload = async (domainName, language, monthlyVisitors) => {
    try {
      await axios.get(`${API_URL}/excel/download/${domainName}`, {
        params: { language, monthlyVisitors },
        headers: { Authorization: `Bearer ${token}` },
      });
      onNotification('File downloaded successfully', 'success');
    } catch (error) {
      onNotification('Error while downloading the file', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this site?')) {
      const originalSites = sites;
      setSites(prevSites => prevSites.filter(site => site.id !== id));

      try {
        await axios.delete(`${API_URL}/sites/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        onNotification('Site deleted successfully', 'success');
      } catch (error) {
        onNotification('Error deleting site', 'error');
        setSites(originalSites);
      }
    }
  };

  const columns = [
    { 
      key: 'domain_name', 
      label: 'Domain Name',
      render: (value, item) => (
        <Link 
          to={`/url-review/${value}`} 
          className={`${item.hasNotReviewed ? 'underline' : ''} text-black hover:text-black`}
        >
          {value}
        </Link>
      )
    },
    { key: 'monthly_visitors', label: 'Monthly', className: "text-center",
      render: (value) => (
        <div className="text-center text-xs">{value}</div>
      ) },
    { key: 'language', label: 'Language', className: "text-center", 
      render: (value) => (
        <div className="text-center">{value}</div>
      )
    },
    { 
      key: 'download', 
      label: 'Download',
      className: "text-center",
      render: (_, item) => (
        <button className="w-full" onClick={() => handleDownload(item.domain_name, item.language, item.monthly_visitors)}>
          <Download className="w-4 h-4 mx-auto text-center text-gray-500 hover:text-gray-700" strokeWidth={2} />
        </button>
      )
    },
  ];

  const handleBulkDownload = async () => {
    setIsDownloading(true);
    try {
      const sitesToDownload = selectedItems.map(id => {
        const site = sites.find(s => s.id === id);
        return {
          domainName: site.domain_name,
          language: site.language,
          monthlyVisitors: site.monthly_visitors
        };
      });

      await axios.post(`${API_URL}/excel/download-multiple`, { sites: sitesToDownload }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      onNotification('Bulk download started successfully', 'success');
    } catch (error) {
      onNotification('Error starting bulk download', 'error');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleAddUrls = async () => {
    setIsLoading(true);
    try {
      const sitesToProcess = selectedItems.map(id => {
        const site = sites.find(s => s.id === id);
        return { id: site.id, domainName: site.domain_name };
      });

      const response = await axios.post(`${API_URL}/excel/add-urls-and-delete`, 
        { sites: sitesToProcess },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      onNotification('URLs added successfully', 'success');
      fetchSitesByCategory(activeCategory);
    } catch (error) {
      onNotification('Error adding URLs', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-4 border-b border-gray-200 flex justify-between">
        <ul className="flex flex-wrap -mb-px">
          {categories.map((category) => (
            <li key={category.id} className="mr-2">
              <button
                className={`inline-block p-2 text-gray-400 font-semibold text-xs ${
                  activeCategory === category.name
                    ? 'text-gray-800 border-b-2 border-gray-600'
                    : 'hover:text-gray-600'
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
          <Settings className="w-5"/> 
        </button>
      </div>

      {showBulkUpdate && (
        <BulkUpdateVisitors
          activeCategory={activeCategory}
          onNotification={onNotification}
          onBulkUpdate={() => fetchSitesByCategory(activeCategory)}
        />
      )}

      <TableComponent
        columns={columns}
        data={sites}
        keyField="id"
        onEdit={onEditSite}
        onDelete={handleDelete}
        selectable={true}
        selectedItems={selectedItems}
        onSelectChange={setSelectedItems}
      />

      <SiteListActions 
        onBulkDownload={handleBulkDownload}
        onAddUrls={handleAddUrls}
        isDownloading={isDownloading}
        isAddingUrls={isLoading}
      />
    </div>
  );
};

export default SiteList;
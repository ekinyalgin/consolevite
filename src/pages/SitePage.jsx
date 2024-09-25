import React, { useState, useCallback } from 'react';
import SiteForm from '../components/Sites/SiteForm';
import SiteList from '../components/Sites/SiteList';
import Notification from '../utils/Notification';
import tableClasses from '../utils/tableClasses';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const SitePage = () => {
  const [notification, setNotification] = useState(null);
  const [selectedSite, setSelectedSite] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const token = localStorage.getItem('token');

  const handleNotification = (message, type) => {
    setNotification({ message, type });
  };

  const refreshSiteList = useCallback(() => {
    setRefreshKey(prevKey => prevKey + 1);
  }, []);

  const handleSiteAddedOrUpdated = async (siteData) => {
    try {
      console.log('Received site data:', siteData); // Debugging

      if (!siteData.domain_name || !siteData.monthly_visitors || !siteData.language || !siteData.category) {
        throw new Error('All fields are required');
      }

      if (siteData.id) {
        // Update existing site
        const response = await axios.put(`${API_URL}/sites/${siteData.id}`, siteData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Update response:', response.data); // Debugging
        handleNotification('Site updated successfully', 'success');
      } else {
        // Add new site
        const response = await axios.post(`${API_URL}/sites`, siteData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Add response:', response.data); // Debugging
        handleNotification('Site added successfully', 'success');
      }
      setSelectedSite(null);
      refreshSiteList();
    } catch (error) {
      console.error('Error in handleSiteAddedOrUpdated:', error.response || error);
      handleNotification(`Error: ${error.response?.data?.message || error.message}`, 'error');
    }
  };

  const handleEditSite = (site) => {
    setSelectedSite(site);
  };

  return (
    <div className="container mx-auto p-2">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <h1 className={tableClasses.h1}>Sites</h1>
      <div className="sm:space-x-8 flex flex-col md:flex-row">
        <div className="sm:bg-gray-100 rounded-lg sm:p-5 w-full md:w-3/12 mb-5 md:mb-0">
          <SiteForm
            onNotification={handleNotification}
            onSubmit={handleSiteAddedOrUpdated}
            initialData={selectedSite}
            onCancel={() => setSelectedSite(null)}
          />
        </div>
        <div className="lg:w-9/12">
          <SiteList 
            onNotification={handleNotification} 
            onEditSite={handleEditSite} 
            onBulkUpdate={(updatedSites) => {
              setSelectedSite(null);
              refreshSiteList();
            }}
            refreshKey={refreshKey}
          />
        </div>
      </div>
    </div>
  );
};

export default SitePage;
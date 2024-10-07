import React, { useState, useCallback, useEffect } from 'react';
import SiteForm from './SiteForm';
import SiteList from './SiteList';
import Notification from '../../utils/Notification';
import axios from 'axios';
import ToggleFormButton from '../common/ToggleFormButton';

const API_URL = import.meta.env.VITE_API_URL;

const SiteContainer = () => {
  const [isFormOpen, setIsFormOpen] = useState(() => {
    const stored = localStorage.getItem('siteFormOpen');
    return stored ? JSON.parse(stored) : false;
  });
  const [sites, setSites] = useState([]);
  const [notification, setNotification] = useState(null);
  const [selectedSite, setSelectedSite] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const token = localStorage.getItem('token');

  useEffect(() => {
    localStorage.setItem('siteFormOpen', JSON.stringify(isFormOpen));
  }, [isFormOpen]);

  const handleNotification = (message, type) => {
    setNotification({ message, type });
  };

  const refreshSiteList = useCallback(() => {
    setRefreshKey(prevKey => prevKey + 1);
  }, []);

  const fetchSites = async () => {
    try {
      const response = await axios.get(`${API_URL}/sites`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSites(response.data);
    } catch (error) {
      console.error('Error fetching sites:', error);
      handleNotification('Error fetching sites', 'error');
    }
  };

  useEffect(() => {
    fetchSites();
  }, [refreshKey]);

  const handleSiteAddedOrUpdated = async (siteData) => {
    try {
      let response;
      if (siteData.id) {
        response = await axios.put(`${API_URL}/sites/${siteData.id}`, siteData, { headers: { Authorization: `Bearer ${token}` }});
      } else {
        response = await axios.post(`${API_URL}/sites`, siteData, { headers: { Authorization: `Bearer ${token}` }});
      }

      handleNotification(siteData.id ? 'Site updated successfully' : 'Site added successfully', 'success');
      setSelectedSite(null);
      // Form açık kalacak, kapatmıyoruz
      refreshSiteList();
    } catch (error) {
      console.error('Error in handleSiteAddedOrUpdated:', error.response || error);
      handleNotification(`Error: ${error.response?.data?.message || error.message}`, 'error');
    }
  };

  const handleEditSite = (site) => {
    setSelectedSite(site);
    setIsFormOpen(true);
  };

  const handleFormCancel = () => {
    setSelectedSite(null);
    // Form açık kalacak, kapatmıyoruz
  };

  const toggleForm = () => {
    setIsFormOpen(prev => !prev);
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

      <h1 className="text-2xl font-bold mb-4">Sites</h1>
      <div className="sm:space-x-8 flex flex-col md:flex-row">
        {isFormOpen && (
          <div className="sm:bg-gray-100 rounded-lg sm:p-5 w-full md:w-3/12 mb-5 md:mb-0">
            <SiteForm
              onNotification={handleNotification}
              onSubmit={handleSiteAddedOrUpdated}
              initialData={selectedSite}
              onCancel={handleFormCancel}
            />
          </div>
        )}
        <div className={`w-full ${isFormOpen ? 'md:w-9/12' : 'md:w-full'}`}>
          <SiteList 
            sites={sites}
            onNotification={handleNotification} 
            onEditSite={handleEditSite} 
            onBulkUpdate={refreshSiteList}
            refreshKey={refreshKey}
          />
        </div>
      </div>

      <ToggleFormButton isOpen={isFormOpen} onClick={toggleForm} />
    </div>
  );
};

export default SiteContainer;
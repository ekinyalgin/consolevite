import React, { useState, useCallback, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SiteForm from '../components/Sites/SiteForm';
import SiteList from '../components/Sites/SiteList';
import Notification from '../utils/Notification';
import tableClasses from '../utils/tableClasses';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import { LoaderCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

const SitePage = () => {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [pageState, setPageState] = useState('loading');
  const [notification, setNotification] = useState(null);
  const [selectedSite, setSelectedSite] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!loading) {
      if (!user) {
        setPageState('unauthorized');
      } else if (user.role !== 'admin') {
        setPageState('forbidden');
      } else {
        setPageState('loaded');
      }
    }
  }, [user, loading]);

  const handleNotification = (message, type) => {
    setNotification({ message, type });
  };

  const refreshSiteList = useCallback(() => {
    setRefreshKey(prevKey => prevKey + 1);
  }, []);

  const handleSiteAddedOrUpdated = async (siteData) => {
    try {
      console.log('Received site data:', siteData);

      if (!siteData.domain_name || !siteData.monthly_visitors || !siteData.language || !siteData.category) {
        throw new Error('All fields are required');
      }

      if (siteData.id) {
        const response = await axios.put(`${API_URL}/sites/${siteData.id}`, siteData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Update response:', response.data);
        handleNotification('Site updated successfully', 'success');
      } else {
        const response = await axios.post(`${API_URL}/sites`, siteData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Add response:', response.data);
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

  if (pageState === 'loading') {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoaderCircle className="animate-spin text-blue-500" size={48} />
      </div>
    );
  }

  if (pageState === 'unauthorized') {
    return (
      <div className="container mx-auto p-4">
        <h1 className={tableClasses.h1}>Access Denied</h1>
        <p>Please log in to view this page.</p>
      </div>
    );
  }

  if (pageState === 'forbidden') {
    return (
      <div className="container mx-auto p-4">
        <h1 className={tableClasses.h1}>Unauthorized Access</h1>
        <p>Sorry, you don't have permission to view this page. Only administrators can access the Sites list.</p>
      </div>
    );
  }

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
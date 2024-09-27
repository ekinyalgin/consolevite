import React, { useState, useCallback, useEffect } from 'react';
import SiteForm from '../components/Sites/SiteForm';
import SiteList from '../components/Sites/SiteList';
import Notification from '../utils/Notification';
import tableClasses from '../utils/tableClasses';
import axios from 'axios';
import { Plus, X } from 'lucide-react'; // Plus ve X ikonlarını ekliyoruz

const API_URL = import.meta.env.VITE_API_URL;

const SitePage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false); // Formun açık/kapalı durumunu kontrol eden state
  const [sites, setSites] = useState([]); // `sites` ve `setSites` state'ini tanımlayın
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
    let tempId = `temp-${Math.random()}`; // Geçici bir ID oluştur

    if (siteData.id) {
        setSites((prevSites) => 
            prevSites.map((site) => (site.id === siteData.id ? { ...site, ...siteData } : site))
        );
    } else {
        setSites((prevSites) => [...prevSites, { ...siteData, id: tempId }]);
    }

    try {
        const response = siteData.id 
            ? await axios.put(`${API_URL}/sites/${siteData.id}`, siteData, { headers: { Authorization: `Bearer ${token}` }})
            : await axios.post(`${API_URL}/sites`, siteData, { headers: { Authorization: `Bearer ${token}` }});

        const savedSite = response.data;
        setSites((prevSites) => 
            prevSites.map((site) => (site.id === (siteData.id || tempId) ? savedSite : site))
        );

        handleNotification(siteData.id ? 'Site updated successfully' : 'Site added successfully', 'success');
        setSelectedSite(null);
    } catch (error) {
        console.error('Error in handleSiteAddedOrUpdated:', error.response || error);
        handleNotification(`Error: ${error.response?.data?.message || error.message}`, 'error');

        setSites((prevSites) => {
            if (siteData.id) {
                return prevSites.map((site) => (site.id === siteData.id ? siteData : site));
            } else {
                return prevSites.filter((site) => site.id !== tempId);
            }
        });
    }
  };


  const handleEditSite = (site) => {
    setSelectedSite(site);
    setIsFormOpen(true); // Düzenleme için formu aç
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
        <div className={`sm:bg-gray-100 rounded-lg sm:p-5 w-full md:w-3/12 mb-5 md:mb-0 ${isFormOpen ? '' : 'hidden md:block'}`}>
          <SiteForm
            onNotification={handleNotification}
            onSubmit={handleSiteAddedOrUpdated}
            initialData={selectedSite}
            onCancel={() => {
              setSelectedSite(null);
              setIsFormOpen(false); // Form kapatıldığında `isFormOpen` state'ini false yapıyoruz
            }}
          />
        </div>
        <div className="lg:w-9/12">
          <SiteList 
            sites={sites} // `sites` ve `setSites` burada kullanıma sunulmalı
            setSites={setSites} // `setSites` fonksiyonunu `SiteList`'e geçirin
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

      {/* Formu aç/kapa butonu */}
      {!isFormOpen && (
        <button
          onClick={() => setIsFormOpen(true)}
          className="fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-full shadow-md hover:bg-blue-700 transition duration-300 md:hidden"
        >
          <Plus className="w-4 h-4" strokeWidth={3} />
        </button>
      )}

      {isFormOpen && (
        <button
          onClick={() => setIsFormOpen(false)}
          className="fixed bottom-4 right-4 bg-red-600 text-white p-4 rounded-full shadow-md hover:bg-red-700 transition duration-300 md:hidden"
        >
          <X className="w-4 h-4" strokeWidth={3} />
        </button>
      )}
    </div>
  );
};

export default SitePage;

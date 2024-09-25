import React, { useState } from 'react';
import SiteForm from '../components/Sites/SiteForm';
import SiteList from '../components/Sites/SiteList';
import Notification from '../utils/Notification';
import tableClasses from '../utils/tableClasses';

const SitePage = () => {
  const [notification, setNotification] = useState(null);
  const [showSiteForm, setShowSiteForm] = useState(false);
  const [selectedSite, setSelectedSite] = useState(null);

  const handleNotification = (message, type) => {
    setNotification({ message, type });
  };

  const handleSiteAddedOrUpdated = (site) => {
    setShowSiteForm(false);
    setSelectedSite(null);
  };

  const handleEditSite = (site) => {
    setSelectedSite(site);
    setShowSiteForm(true);
  };

  const handleAddNewSite = () => {
    setSelectedSite(null);
    setShowSiteForm(!showSiteForm);
  };

  return (
    <div className="container mx-auto p-2">
     <h1 className={tableClasses.h1}>Sites</h1>
        
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={handleAddNewSite}>
          {showSiteForm ? 'Close Form' : '+ Add Site'}
        </button>
     

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {showSiteForm && (
        <SiteForm
          onNotification={handleNotification}
          onSiteAdded={handleSiteAddedOrUpdated}
          selectedSite={selectedSite}
          resetSelectedSite={() => setShowSiteForm(false)}
        />
      )}

      <SiteList 
        onNotification={handleNotification} 
        onEditSite={handleEditSite} 
        onBulkUpdate={(updatedSites) => {
          setSelectedSite(null);
          setShowSiteForm(false);
        }}
      />
    </div>
  );
};

export default SitePage;
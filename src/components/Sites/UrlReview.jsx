import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import tableClasses from '../../utils/tableClasses';
import Notification from '../../utils/Notification';
import { ChartNoAxesGantt, MoveLeft, Trash2, BarChart2, Check } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

// Add this helper function at the top of the file, outside of the component
const formatUrl = (url) => {
  return url.replace(/^(https?:\/\/)?(www\.)?/, '');
};

const UrlReview = () => {
  const { domainName } = useParams();
  const [notReviewedUrls, setNotReviewedUrls] = useState([]);
  const [reviewedUrls, setReviewedUrls] = useState([]);
  const [excelUrls, setExcelUrls] = useState([]);
  const [notification, setNotification] = useState(null);
  const [showReviewed, setShowReviewed] = useState(false);
  const [selectedExcelUrls, setSelectedExcelUrls] = useState([]);
  const [showExcelContent, setShowExcelContent] = useState(false);
  const token = localStorage.getItem('token');

  const fetchUrls = async () => {
    try {
      if (domainName) {
        const response = await axios.get(`${API_URL}/urls/${domainName}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotReviewedUrls(response.data.notReviewed);
        setReviewedUrls(response.data.reviewed);
      } else {
        console.error('Domain name is undefined');
      }
    } catch (error) {
      setNotification({ message: 'Error fetching URLs', type: 'error' });
    }
  };

  useEffect(() => {
    if (domainName) {
      fetchUrls();
    }
  }, [domainName]);

  const fetchNotReviewedUrls = async () => {
    if (!domainName) {
      setNotification({ message: 'Invalid domain name', type: 'error' });
      return;
    }
    try {
      const response = await axios.get(`${API_URL}/urls/${domainName}/not-reviewed`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotReviewedUrls(response.data);
    } catch (error) {
      setNotification({ message: 'Error fetching not reviewed URLs', type: 'error' });
    }
  };

  const fetchReviewedUrls = async () => {
    if (!domainName) {
      setNotification({ message: 'Invalid domain name', type: 'error' });
      return;
    }
    try {
      const response = await axios.get(`${API_URL}/urls/${domainName}/reviewed`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReviewedUrls(response.data);
    } catch (error) {
      setNotification({ message: 'Error fetching reviewed URLs', type: 'error' });
    }
  };

  const handleReviewToggle = async (id, currentReviewStatus) => {
    // Find the URL object to be updated
    const urlToUpdate = currentReviewStatus
      ? reviewedUrls.find(url => url.id === id)
      : notReviewedUrls.find(url => url.id === id);
  
    // Optimistically update the UI
    const updatedUrl = { ...urlToUpdate, reviewed: !currentReviewStatus };
    if (currentReviewStatus) {
      setReviewedUrls(prevUrls => prevUrls.filter(url => url.id !== id));
      setNotReviewedUrls(prevUrls => [...prevUrls, updatedUrl]);
    } else {
      setNotReviewedUrls(prevUrls => prevUrls.filter(url => url.id !== id));
      setReviewedUrls(prevUrls => [...prevUrls, updatedUrl]);
    }
  
    try {
      const response = await axios.put(`${API_URL}/urls/${id}/review`, 
        { reviewed: !currentReviewStatus }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      setNotification({ message: 'URL review status updated successfully', type: 'success' });
    } catch (error) {
      console.error('Error updating URL review status:', error);
      setNotification({ message: 'Error updating URL review status', type: 'error' });
  
      // Revert the UI to its previous state
      if (currentReviewStatus) {
        setNotReviewedUrls(prevUrls => prevUrls.filter(url => url.id !== id));
        setReviewedUrls(prevUrls => [...prevUrls, urlToUpdate]);
      } else {
        setReviewedUrls(prevUrls => prevUrls.filter(url => url.id !== id));
        setNotReviewedUrls(prevUrls => [...prevUrls, urlToUpdate]);
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this URL?')) {
      // Optimistically update the UI
      const prevNotReviewedUrls = notReviewedUrls;
      const prevReviewedUrls = reviewedUrls;
      setNotReviewedUrls(prevUrls => prevUrls.filter(url => url.id !== id));
      setReviewedUrls(prevUrls => prevUrls.filter(url => url.id !== id));

      try {
        await axios.delete(`${API_URL}/urls/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotification({ message: 'URL deleted successfully', type: 'success' });
      } catch (error) {
        setNotification({ message: 'Error deleting URL', type: 'error' });

        // Revert the UI to its previous state
        setNotReviewedUrls(prevNotReviewedUrls);
        setReviewedUrls(prevReviewedUrls);
      }
    }
  };


  const fetchExcelUrls = async () => {
    try {
      if (!token) {
        setNotification({ message: 'Authentication token is missing. Please log in again.', type: 'error' });
        return;
      }
  
      const response = await axios.get(`${API_URL}/excel/content/${domainName}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (response.data && Array.isArray(response.data)) {
        // Veritabanında olmayan URL'leri filtrele
        const dbUrls = [...notReviewedUrls, ...reviewedUrls].map(u => u.url);
        const newUrls = response.data.filter(url => !dbUrls.includes(url));
        setExcelUrls(newUrls);
      } else {
        setNotification({ message: 'Unexpected response format from server', type: 'error' });
      }
    } catch (error) {
      console.error('Error fetching Excel URLs:', error);
      if (error.response && error.response.data && error.response.data.error) {
        setNotification({ message: error.response.data.error, type: 'error' });
      } else {
        setNotification({ message: 'Error fetching Excel URLs', type: 'error' });
      }
    }
  };

  const handleAddSelectedUrls = async () => {
    try {
      const response = await axios.post(`${API_URL}/urls/add-urls/${domainName}`, 
        { urls: selectedExcelUrls }, 
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      // Yeni eklenen URL'leri al
      const newUrls = response.data.addedUrls;

      // notReviewedUrls state'ini güncelle
      setNotReviewedUrls(prevUrls => [...prevUrls, ...newUrls]);

      // Excel listesini güncelle
      setExcelUrls(prevUrls => prevUrls.filter(url => !selectedExcelUrls.includes(url)));

      // Seçili URL'leri temizle
      setSelectedExcelUrls([]);

      setNotification({ message: 'Selected URLs added to database', type: 'success' });
    } catch (error) {
      setNotification({ message: 'Error adding URLs to database', type: 'error' });
    }
  };

  const handleAddAllUrls = async () => {
    try {
      // Add all URLs to the database
      const response = await axios.post(`${API_URL}/urls/add-urls/${domainName}`, 
        { urls: excelUrls }, 
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      // Yeni eklenen URL'leri al
      const newUrls = response.data.addedUrls;

      // notReviewedUrls state'ini güncelle
      setNotReviewedUrls(prevUrls => [...prevUrls, ...newUrls]);

      // Excel listesini temizle
      setExcelUrls([]);

      // Excel dosyasını sil
      await axios.delete(`${API_URL}/excel/delete/${domainName}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotification({ message: 'All URLs added to database and Excel file deleted', type: 'success' });
    } catch (error) {
      setNotification({ message: 'Error adding URLs to database or deleting Excel file', type: 'error' });
    }
  };

  const toggleExcelUrlSelection = (url) => {
    setSelectedExcelUrls(prev => 
      prev.includes(url) ? prev.filter(u => u !== url) : [...prev, url]
    );
  };

  const toggleAllExcelUrls = () => {
    if (selectedExcelUrls.length === excelUrls.length) {
      setSelectedExcelUrls([]);
    } else {
      setSelectedExcelUrls([...excelUrls]);
    }
  };

  return (
    <div className="overflow-x-auto w-full">
      <div className='flex items-center mb-6'>
      <a href="/sites">
  <div className='hover:bg-gray-200 rounded-full p-2 flex items-center justify-center'>
    <MoveLeft className='text-black w-5 h-5' />
  </div>
  </a>
  <h1 className={`${tableClasses.h1} ml-4 !mb-0`}>{`URL Review for ${domainName || 'Unknown Domain'}`}</h1>
</div>


      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {domainName && (
        <>
          <button
            className={tableClasses.transButton}
            onClick={() => {
              setShowExcelContent(!showExcelContent);
              if (!showExcelContent) fetchExcelUrls();
            }}
          >
            {showExcelContent ? 'Hide Excel URLs' : 'Show Excel URLs'}
          </button>

          {showExcelContent && (
            <div>
            <div className="flex space-x-2 my-4">

              <button
                className={tableClasses.transButton}
                onClick={toggleAllExcelUrls}
              >
                {selectedExcelUrls.length === excelUrls.length ? 'Deselect All' : 'Select All'}
              </button>
              <button
                className={tableClasses.formButton}
                onClick={handleAddAllUrls}
              >
                Select All and Add to Database
              </button>

              </div>
              
              <table className={tableClasses.table}>
              <thead className={tableClasses.tableHeader}>
                  <tr>
                    <th className={tableClasses.tableHeader + " w-1/6"}>Select</th>
                    <th className={tableClasses.tableHeader + " w-5/6"}>URL</th>
                  </tr>
                </thead>
                <tbody className={tableClasses.tableBody}>
                  {excelUrls.length > 0 ? excelUrls.map((url, index) => (
                    <tr key={index} className={tableClasses.tableRow}>
                      <td className={tableClasses.tableCell}>
                        <input
                          type="checkbox"
                          checked={selectedExcelUrls.includes(url)}
                          onChange={() => toggleExcelUrlSelection(url)}
                        />
                      </td>
                      <td className={tableClasses.tableCell}>{url}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="2" className="text-center py-4">No new URLs found in Excel</td>
                    </tr>
                  )}
                </tbody>
              </table>
              {excelUrls.length > 0 && (
                <button
                  className={tableClasses.transButton}
                  onClick={handleAddSelectedUrls}
                >
                  Add Selected URLs
                </button>
              )}
            </div>
          )}

          <h2 className={tableClasses.h2 + " mt-4"}>Not Reviewed Pages</h2>
          <table className={tableClasses.table}>
            <thead className={tableClasses.tableHeader}>
              <tr>
                <th className={tableClasses.tableHeader + " w-1/12"}>Done</th>
                <th className={tableClasses.tableHeader + " w-1/12"}>Semrush</th>
                <th className={tableClasses.tableHeader + " w-8/12 text-left px-2"}>URL</th>
                <th className={tableClasses.tableHeader + " w-2/12"}>Delete</th>
              </tr>
            </thead>
            <tbody className={tableClasses.tableBody}>
              {notReviewedUrls.length > 0 ? notReviewedUrls.map((url) => (
                <tr key={url.id} className={tableClasses.tableRow}>
                  <td className={tableClasses.tableCell}>
                    <button onClick={() => handleReviewToggle(url.id, false)}>
                    <Check className={tableClasses.checkIcon} strokeWidth={3} />
                    </button>
                  </td>
                  <td className={tableClasses.tableCell}>
                  <a 
  href={`https://sr.toolsminati.com/analytics/organic/overview/?db=us&q=${url.url}&searchType=subfolder`} 
  target="_blank" 
  rel="noopener noreferrer"
>
  <ChartNoAxesGantt className={tableClasses.chartIcon} strokeWidth={3} />
</a>

                  </td>
                  <td className={tableClasses.tableTitle}>
                      <a href={url.url} target="_blank" rel="noopener noreferrer">{formatUrl(url.url)}</a>
                  </td>
                  <td className={tableClasses.tableCell}>
                    <button onClick={() => handleDelete(url.id)} className={tableClasses.deleteIcon}>
                    <Trash2 className={tableClasses.deleteIcon} strokeWidth={2} />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className="text-center py-4">No more URLs available</td>
                </tr>
              )}
            </tbody>
          </table>

          <h2 className={tableClasses.h2 + " mt-4"}>Reviewed Pages</h2>
          <button
            className={tableClasses.transButton + " mb-6"}
            onClick={() => setShowReviewed(!showReviewed)}
          >
            {showReviewed ? 'Hide Reviewed' : 'Show Reviewed'}
          </button>

          {showReviewed && (
            <table className={tableClasses.table}>
              <thead className={tableClasses.tableHeader}>
                <tr>
                <th className={tableClasses.tableHeader + " w-1/12"}>Done</th>
                <th className={tableClasses.tableHeader + " w-1/12"}>Semrush</th>
                <th className={tableClasses.tableHeader + " w-8/12 text-left px-2"}>URL</th>
                <th className={tableClasses.tableHeader + " w-2/12"}>Delete</th>
                </tr>
              </thead>
              <tbody className={tableClasses.tableBody}>
                {reviewedUrls.length > 0 ? reviewedUrls.map((url) => (
                  <tr key={url.id} className={tableClasses.tableRow}>
                    <td className={tableClasses.tableCell}>
                      <button onClick={() => handleReviewToggle(url.id, true)}>
                      <Check className={tableClasses.checkIcon} strokeWidth={3} />
                      </button>
                    </td>
                    <td className={tableClasses.tableCell}>
                    <a 
  href={`https://sr.toolsminati.com/analytics/organic/overview/?db=us&q=${url.url}&searchType=subfolder`} 
  target="_blank" 
  rel="noopener noreferrer"
>
  <ChartNoAxesGantt className={tableClasses.chartIcon} strokeWidth={3} />
</a>
                    </td>
                    <td className={tableClasses.tableTitle}>
                      <a href={url.url} target="_blank" rel="noopener noreferrer">
                        {formatUrl(url.url)}
                      </a>
                    </td>
                    <td className={tableClasses.tableCell}>
                      <button onClick={() => handleDelete(url.id)}>
                      <Trash2 className={tableClasses.deleteIcon} strokeWidth={2} />
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4" className="text-center py-4">No reviewed URLs available</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
};

export default UrlReview;
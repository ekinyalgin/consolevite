import React, { useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const BulkUpdateVisitors = ({ activeCategory, onNotification, onBulkUpdate }) => {
  const [bulkUpdateForm, setBulkUpdateForm] = useState({
    minVisitors: '',
    maxVisitors: '',
    changeValue: '',
    changeType: 'decrease'
  });
  const token = localStorage.getItem('token');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBulkUpdateForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/sites/bulk-update`, {
        ...bulkUpdateForm,
        category: activeCategory
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onNotification('Bulk update successful', 'success');
      onBulkUpdate(response.data.updatedSites); 
    } catch (error) {
      onNotification('Error during bulk update', 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="my-6">
      <div className="flex space-x-1 text-xs sm:text-base sm:space-x-4">
        <input type="number" name="minVisitors" placeholder="Min Visitors" value={bulkUpdateForm.minVisitors} onChange={handleInputChange}className="text-xs w-1/5 bg-white border shadow-sm rounded px-2 py-2" required />
        <input type="number" name="maxVisitors" placeholder="Max Visitors" value={bulkUpdateForm.maxVisitors} onChange={handleInputChange} className="text-xs w-1/5 bg-white border shadow-sm rounded px-2 py-2" required />
        <input type="number" name="changeValue" placeholder="Change Value" value={bulkUpdateForm.changeValue} onChange={handleInputChange} className="text-xs w-1/5 bg-white border shadow-sm rounded px-2 py-2" required />
        <select name="changeType" value={bulkUpdateForm.changeType} onChange={handleInputChange} className="text-xs w-1/5 bg-white border shadow-sm rounded px-2 py-2">
          <option value="decrease">Decrease</option>
          <option value="increase">Increase</option>
        </select>
        <button type="submit" className="border border-black rounded text-xs w-1/5 bg-white">
          Update
        </button>
      </div>
    </form>
  );
};

export default BulkUpdateVisitors;
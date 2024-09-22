// components/ExcelViewer.js
import React, { useState } from 'react';
import axios from 'axios';
import tableClasses from '../utils/tableClasses';
import Notification from '../utils/Notification';
import * as XLSX from 'xlsx';

const API_URL = import.meta.env.VITE_API_URL;

const ExcelViewer = ({ domainName, onNotification }) => {
  const [excelData, setExcelData] = useState([]);
  const token = localStorage.getItem('token');

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(sheet);
      setExcelData(json.map(row => row.URL || row.url)); // 'URL' veya 'url' olarak kabul ediyoruz
    };

    reader.readAsBinaryString(file);
  };

  const handleAddUrls = async () => {
    try {
      await axios.post(`${API_URL}/urls/add-from-excel`, { urls: excelData, domainName }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onNotification('URLs added successfully from Excel', 'success');
      setExcelData([]); // Formu temizle
    } catch (error) {
      onNotification('Error adding URLs from Excel', 'error');
    }
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-4">Upload URLs from Excel</h2>
      {onNotification && (
        <Notification
          message={onNotification.message}
          type={onNotification.type}
          onClose={() => onNotification(null)}
        />
      )}
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
        className={tableClasses.formInput}
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 mt-4 rounded hover:bg-blue-600"
        onClick={handleAddUrls}
        disabled={excelData.length === 0}
      >
        Add Selected URLs
      </button>

      {excelData.length > 0 && (
        <div className="mt-4">
          <table className={tableClasses.table}>
            <thead className={tableClasses.tableHeader}>
              <tr>
                <th className={tableClasses.tableHeaderCell}>URL</th>
              </tr>
            </thead>
            <tbody className={tableClasses.tableBody}>
              {excelData.map((url, index) => (
                <tr key={index} className={tableClasses.tableRow}>
                  <td className={tableClasses.tableCell}>{url}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ExcelViewer;

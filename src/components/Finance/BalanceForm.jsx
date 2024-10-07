import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';  // Add this import
import { X } from 'lucide-react';

// Create an axios instance with the correct base URL
const api = axios.create({
  baseURL: 'http://localhost:5000', // Update this to match your server's port
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});

const BalanceForm = ({ initialBalance, onBalanceAdded, onClose, categories }) => {
  const [balance, setBalance] = useState({
    type: 'expense',
    category: '',
    totalAmount: '',
    date: new Date().toISOString().slice(0, 7), // YYYY-MM format
    note: '',
    isInstallment: false,
    totalInstallments: 1,
    isRecurring: false, // Yeni eklenen alan
  });
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    if (initialBalance) {
      setBalance({
        ...initialBalance,
        date: new Date(initialBalance.date).toISOString().slice(0, 7),
        isInstallment: initialBalance.totalInstallments > 1,
        totalInstallments: initialBalance.totalInstallments || 1,
        isRecurring: initialBalance.isRecurring || false, // Yeni eklenen alan
      });
    }
  }, [initialBalance]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBalance(prev => {
      const newBalance = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      };
      
      if (name === 'type' && value === 'income') {
        newBalance.isInstallment = false;
        newBalance.totalInstallments = 1;
      }
      
      return newBalance;
    });
  };

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    const submittedBalance = {
      ...balance,
      category: balance.category || newCategory,
      date: balance.date + '-01',
      totalInstallments: balance.isInstallment ? balance.totalInstallments : 1,
    };
    try {
      await onBalanceAdded(submittedBalance);
      onClose();
    } catch (error) {
      console.error('Error adding/updating balance:', error);
    }
  }, [balance, newCategory, onBalanceAdded, onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center" onClick={onClose}>
      <div className="bg-white p-6 rounded-lg w-full max-w-md relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-2 right-2">
          <X size={24} />
        </button>
        <h2 className="text-xl font-bold mb-4">{initialBalance ? 'Edit Balance' : 'Add New Balance'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <select 
            name="type" 
            value={balance.type} 
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="income">Gelir</option>
            <option value="expense">Gider</option>
          </select>
          <div>
            <select
              name="category"
              value={balance.category}
              onChange={handleChange}
              className="w-full p-2 border rounded mb-2"
            >
              <option value="">Kategori Seçin veya Yeni Ekleyin</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>{category}</option>
              ))}
            </select>
            {balance.category === '' && (
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Yeni Kategori"
                className="w-full p-2 border rounded"
              />
            )}
          </div>
          <input
            type="number"
            name="totalAmount"
            placeholder="Toplam Tutar"
            value={balance.totalAmount}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
          <input
            type="month"
            name="date"
            value={balance.date}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
          <textarea
            name="note"
            placeholder="Not"
            value={balance.note}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          {balance.type === 'expense' && (
            <>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isInstallment"
                  checked={balance.isInstallment}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label htmlFor="isInstallment">Taksitli mi?</label>
              </div>
              {balance.isInstallment && (
                <input
                  type="number"
                  name="totalInstallments"
                  placeholder="Toplam Taksit Sayısı"
                  value={balance.totalInstallments}
                  onChange={handleChange}
                  min="2"
                  required
                  className="w-full p-2 border rounded"
                />
              )}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isRecurring"
                  checked={balance.isRecurring}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label htmlFor="isRecurring">Tekrar Eden mi?</label>
              </div>
            </>
          )}
          <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            {initialBalance ? 'Güncelle' : 'Ekle'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default React.memo(BalanceForm);
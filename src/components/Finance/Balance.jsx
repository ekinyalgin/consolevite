import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BalanceList from './BalanceList';

const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});

const Balance = () => {
  const [balance, setBalance] = useState({
    totalIncome: 0,
    totalExpense: 0,
    netBalance: 0,
    balances: [],
    futureInstallments: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);

  const fetchBalance = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/api/balances`);
      setBalance(response.data);
      
      // Kategorileri çek
      const uniqueCategories = [...new Set(response.data.balances.map(b => b.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching balance:', error);
      setError('Failed to fetch balance. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  const handleDeleteBalance = async (id) => {
    try {
      await api.delete(`/api/balances/${id}`);
      fetchBalance();
    } catch (error) {
      console.error('Error deleting balance:', error);
      setError('Failed to delete balance. Please try again.');
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Gelir-Gider Tablosu</h2>
      <div className="grid grid-cols-4 gap-4 mb-4">
        <div className="bg-green-100 p-4 rounded">
          <p className="text-lg font-semibold">Toplam Gelir:</p>
          <p className="text-2xl">{balance.totalIncome?.toFixed(2) || '0.00'} TL</p>
        </div>
        <div className="bg-red-100 p-4 rounded">
          <p className="text-lg font-semibold">Toplam Gider:</p>
          <p className="text-2xl">{balance.totalExpense?.toFixed(2) || '0.00'} TL</p>
        </div>
        <div className="bg-blue-100 p-4 rounded">
          <p className="text-lg font-semibold">Net Kazanç:</p>
          <p className="text-2xl">{balance.netBalance?.toFixed(2) || '0.00'} TL</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded">
          <p className="text-lg font-semibold">Gelecek Taksitler:</p>
          <p className="text-2xl">{balance.futureInstallments?.toFixed(2) || '0.00'} TL</p>
        </div>
      </div>
      <BalanceList 
        balances={balance.balances} 
        onDelete={handleDeleteBalance}
        onEdit={fetchBalance}
        categories={categories}
      />
    </div>
  );
};

export default Balance;
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import BalanceList from './BalanceList';
import BalanceForm from './BalanceForm';

const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});

const MonthlyBalance = () => {
  const [balance, setBalance] = useState({
    totalIncome: 0,
    totalExpense: 0,
    netBalance: 0,
    groupedBalances: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const fetchMonthlyBalance = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/api/balances`);
      const totalIncome = parseFloat(response.data.totalIncome) || 0;
      const totalExpense = response.data.groupedBalances.reduce((sum, group) => {
        return sum + group.balances.reduce((groupSum, balance) => {
          return balance.type === 'expense' ? groupSum + parseFloat(balance.totalAmount) : groupSum;
        }, 0);
      }, 0);
      const netBalance = totalIncome - totalExpense;

      setBalance({
        ...response.data,
        totalIncome,
        totalExpense,
        netBalance,
        groupedBalances: response.data.groupedBalances.sort((a, b) => a.date.localeCompare(b.date)),
      });
      
      const uniqueCategories = [...new Set(response.data.groupedBalances.flatMap(group => group.balances.map(b => b.category)))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching monthly balance:', error);
      setError('Failed to fetch monthly balance. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMonthlyBalance();
  }, [fetchMonthlyBalance]);

  const handleDeleteBalance = async (id) => {
    try {
      await api.delete(`/api/balances/${id}`);
      fetchMonthlyBalance();
    } catch (error) {
      console.error('Error deleting balance:', error);
      setError('Failed to delete balance. Please try again.');
    }
  };

  const handleDecreaseInstallment = async (id) => {
    try {
      await api.post(`/api/balances/${id}/decrease-installment`);
      fetchMonthlyBalance();
    } catch (error) {
      console.error('Error decreasing installment:', error);
      setError('Failed to decrease installment. Please try again.');
    }
  };

  const handleAddBalance = useCallback(async (newBalance) => {
    try {
      await api.post('/api/balances', newBalance);
      setIsModalVisible(false);
      await fetchMonthlyBalance();
    } catch (error) {
      console.error('Error adding balance:', error);
      setError('Failed to add balance. Please try again.');
    }
  }, [fetchMonthlyBalance]);

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Gelir-Gider Tablosu</h2>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-green-100 p-4 rounded">
          <p className="text-lg font-semibold">Toplam Gelir:</p>
          <p className="text-2xl">{balance.totalIncome.toFixed(2)} TL</p>
        </div>
        <div className="bg-red-100 p-4 rounded">
          <p className="text-lg font-semibold">Toplam Gider:</p>
          <p className="text-2xl">{balance.totalExpense.toFixed(2)} TL</p>
        </div>
        <div className="bg-blue-100 p-4 rounded">
          <p className="text-lg font-semibold">Net Bakiye:</p>
          <p className="text-2xl">{balance.netBalance.toFixed(2)} TL</p>
        </div>
      </div>
      <button
        onClick={() => setIsModalVisible(true)}
        className="bg-transparent border border-gray-500 text-black text-xs px-3 font-semibold py-2 rounded hover:bg-gray-600 hover:text-white transition flex items-center mt-6 mb-3"
      >
        Add New Balance
      </button>
      {balance.groupedBalances.map((group) => (
        <div key={group.date} className="mb-8">
          <h3 className="text-sm font-semibold mb-2">{group.date}</h3>
          <BalanceList 
            balances={group.balances} 
            onDelete={handleDeleteBalance}
            onEdit={fetchMonthlyBalance}
            onDecreaseInstallment={handleDecreaseInstallment}
            categories={categories}
          />
        </div>
      ))}
      {isModalVisible && (
        <BalanceForm 
          onBalanceAdded={handleAddBalance}
          onClose={() => setIsModalVisible(false)}
          categories={categories}
        />
      )}
    </div>
  );
};

export default MonthlyBalance;
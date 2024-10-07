import React, { useState } from 'react';
import { Settings2, X, ArrowUpCircle, ArrowDownCircle, Check } from 'lucide-react';
import BalanceForm from './BalanceForm';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});

const BalanceList = ({ balances, onDelete, onEdit, onDecreaseInstallment, categories }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingBalance, setEditingBalance] = useState(null);

  const handleEdit = (balance) => {
    setEditingBalance(balance);
    setIsModalVisible(true);
  };

  const handleUpdateBalance = async (updatedBalance) => {
    try {
      const response = await api.put(`/api/balances/${updatedBalance.id}`, updatedBalance);
      setIsModalVisible(false);
      onEdit();
    } catch (error) {
      console.error('Error updating balance:', error.response?.data?.error || error.message);
    }
  };

  const handleDecreaseInstallment = async (balance) => {
    if (balance.totalInstallments > 0) {
      try {
        await onDecreaseInstallment(balance.id);
      } catch (error) {
        console.error('Error decreasing installment:', error);
      }
    }
  };

  const renderBalanceRow = (balance) => {
    const date = new Date(balance.date);
    const formattedDate = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;

    return (
      <tr key={balance.id} className="hover:bg-gray-100 text-sm h-10">
        <td className="w-1/12">
          {balance.type === 'income' ? 
            <ArrowUpCircle className="w-5 mx-auto text-green-500" /> : 
            balance.totalInstallments > 0 ?
              <ArrowDownCircle 
                className="w-5 mx-auto text-red-500 cursor-pointer"
                onClick={() => handleDecreaseInstallment(balance)}
              /> :
              <Check className="w-4 mx-auto text-blue-500" />
          }
        </td>
        <td className="">{balance.category}</td>
        <td className="text-center">{parseFloat(balance.totalAmount).toFixed(2)} ₺</td>
        <td className="text-center">
          {balance.totalInstallments > 0 ? 
            `${balance.totalInstallments}` : 
            'Tamamlandı'
          }
        </td>
        <td className="">{balance.note}</td>
        <td className="">
          <button
            onClick={() => handleEdit(balance)}
            className="mr-2 p-1 text-yellow-500 text-white rounded hover:text-yellow-600  transition"
          >
            <Settings2 size={16} />
          </button>
          <button
            onClick={() => onDelete(balance.id)}
            className="p-1 text-red-500 text-white rounded hover:text-red-600"
          >
            <X size={16} />
          </button>
        </td>
      </tr>
    );
  };

  return (
    <div className="min-w-full divide-y divide-gray-50 bg-white shadow rounded overflow-hidden">
      <table className="w-full border-collapse ">
        <thead>
          <tr className="bg-gray-100 h-8 text-xs text-center font-semibold">
            <th className="font-semibold w-1/12">Type</th>
            <th className="font-semibold w-3/12">Category</th>
            <th className="font-semibold w-2/12">Total Amount</th>
            <th className="font-semibold w-1/12">Installments</th>
            <th className="font-semibold w-1/12">Note</th>
            <th className="font-semibold w-1/12">Actions</th>
          </tr>
        </thead>
        <tbody>
          {balances.map(renderBalanceRow)}
        </tbody>
      </table>

      {isModalVisible && (
        <BalanceForm 
          initialBalance={editingBalance}
          onBalanceAdded={handleUpdateBalance}
          onClose={() => setIsModalVisible(false)}
          categories={categories}
        />
      )}
    </div>
  );
};

export default BalanceList;
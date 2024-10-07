import React, { useState, useEffect } from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
});

const ProductPurchasePlanner = () => {
  const [product, setProduct] = useState({
    name: '',
    price: 0,
    installments: 1,
  });
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);
  const [monthlySavings, setMonthlySavings] = useState(0);
  const [purchasePlan, setPurchasePlan] = useState(null);

  useEffect(() => {
    // Fetch user's financial data (income, expenses) from the server
    const fetchFinancialData = async () => {
      try {
        const response = await api.get('/api/balances/monthly-average');
        const { averageIncome, averageExpense } = response.data;
        setMonthlyIncome(averageIncome);
        setMonthlyExpenses(averageExpense);
        setMonthlySavings(averageIncome - averageExpense);
      } catch (error) {
        console.error('Error fetching financial data:', error);
      }
    };

    fetchFinancialData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: name === 'price' || name === 'installments' ? Number(value) : value }));
  };

  const calculatePurchasePlan = () => {
    const { price, installments } = product;
    const monthsToPurchase = Math.ceil(price / monthlySavings);
    const installmentAmount = price / installments;
    const canAffordInstallments = installmentAmount <= monthlySavings;

    const plan = {
      monthsToPurchase,
      installmentAmount,
      canAffordInstallments,
      recommendedPlan: canAffordInstallments && installments > 1 ? 'installments' : 'savings',
    };

    setPurchasePlan(plan);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Ürün Satın Alma Planlayıcısı</h2>
      <div className="mb-4">
        <input
          type="text"
          name="name"
          value={product.name}
          onChange={handleInputChange}
          placeholder="Ürün Adı"
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <input
          type="number"
          name="price"
          value={product.price}
          onChange={handleInputChange}
          placeholder="Ürün Fiyatı"
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <input
          type="number"
          name="installments"
          value={product.installments}
          onChange={handleInputChange}
          placeholder="Taksit Sayısı"
          min="1"
          className="w-full p-2 border rounded"
        />
      </div>
      <button
        onClick={calculatePurchasePlan}
        className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Satın Alma Planı Hesapla
      </button>
      {purchasePlan && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold mb-2">Satın Alma Planı</h3>
          <p>Peşin alım için gereken süre: {purchasePlan.monthsToPurchase} ay</p>
          <p>Aylık taksit tutarı: {purchasePlan.installmentAmount.toFixed(2)} TL</p>
          <p>
            Taksitli alım: 
            {purchasePlan.canAffordInstallments ? ' Uygun' : ' Uygun Değil'}
          </p>
          <p>
            Önerilen plan: 
            {purchasePlan.recommendedPlan === 'installments' ? ' Taksitli Alım' : ' Biriktirerek Alım'}
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductPurchasePlanner;
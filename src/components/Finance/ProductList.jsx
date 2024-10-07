import React, { useState, useEffect } from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
});

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', link: '', price: '', installments: 1 });
  const [purchasePlans, setPurchasePlans] = useState({});
  const [editingProduct, setEditingProduct] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingProduct) {
      setEditingProduct(prev => ({ ...prev, [name]: value }));
    } else {
      setNewProduct(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/products', newProduct);
      setNewProduct({ name: '', link: '', price: '', installments: 1 });
      fetchProducts();
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleEditProduct = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/api/products/${editingProduct.id}`, editingProduct);
      setEditingProduct(null);
      setShowPopup(false);
      fetchProducts();
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await api.delete(`/api/products/${id}`);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const fetchPurchasePlan = async (productId) => {
    try {
      const response = await api.get(`/api/products/${productId}/purchase-plan`);
      setPurchasePlans(prev => ({ ...prev, [productId]: response.data }));
    } catch (error) {
      console.error('Error fetching purchase plan:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Ürün Listesi</h2>
      <form onSubmit={handleAddProduct} className="mb-8">
        <input
          type="text"
          name="name"
          value={newProduct.name}
          onChange={handleInputChange}
          placeholder="Ürün Adı"
          className="mr-2 p-2 border rounded"
          required
        />
        <input
          type="url"
          name="link"
          value={newProduct.link}
          onChange={handleInputChange}
          placeholder="Ürün Linki"
          className="mr-2 p-2 border rounded"
        />
        <input
          type="number"
          name="price"
          value={newProduct.price}
          onChange={handleInputChange}
          placeholder="Fiyat"
          className="mr-2 p-2 border rounded"
          required
        />
        <input
          type="number"
          name="installments"
          value={newProduct.installments}
          onChange={handleInputChange}
          placeholder="Taksit Sayısı"
          className="mr-2 p-2 border rounded"
          min="1"
        />
        <button type="submit" className="p-2 bg-blue-500 text-white rounded">Ürün Ekle</button>
      </form>
      <table className="min-w-full bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 text-left">Ürün Adı</th>
            <th className="py-2 px-4 text-left">Fiyat</th>
            <th className="py-2 px-4 text-left">Taksit</th>
            <th className="py-2 px-4 text-left">İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id} className="border-b">
              <td className="py-2 px-4">{product.name}</td>
              <td className="py-2 px-4">{product.price} TL</td>
              <td className="py-2 px-4">{product.installments}</td>
              <td className="py-2 px-4">
                <button onClick={() => { setEditingProduct(product); setShowPopup(true); }} className="mr-2 text-blue-500">Düzenle</button>
                <button onClick={() => handleDeleteProduct(product.id)} className="mr-2 text-red-500">Sil</button>
                <button onClick={() => fetchPurchasePlan(product.id)} className="text-green-500">Satın Alma Planı</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg relative">
            <button onClick={() => setShowPopup(false)} className="absolute top-2 right-2 text-xl">&times;</button>
            <h3 className="text-xl font-bold mb-4">Ürün Düzenle</h3>
            <form onSubmit={handleEditProduct} className="space-y-4">
              <input
                type="text"
                name="name"
                value={editingProduct.name}
                onChange={handleInputChange}
                placeholder="Ürün Adı"
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="url"
                name="link"
                value={editingProduct.link}
                onChange={handleInputChange}
                placeholder="Ürün Linki"
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                name="price"
                value={editingProduct.price}
                onChange={handleInputChange}
                placeholder="Fiyat"
                className="w-full p-2 border rounded"
                required
              />
              <input
                type="number"
                name="installments"
                value={editingProduct.installments}
                onChange={handleInputChange}
                placeholder="Taksit Sayısı"
                className="w-full p-2 border rounded"
                min="1"
              />
              <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">Güncelle</button>
            </form>
          </div>
        </div>
      )}
      {Object.entries(purchasePlans).map(([productId, plan]) => (
        <div key={productId} className="mt-4 p-4 border rounded">
          <h3 className="text-xl font-semibold mb-2">Satın Alma Planı: {products.find(p => p.id === parseInt(productId))?.name}</h3>
          <p>Peşin alım için gereken süre: {plan.monthsToPurchase} ay</p>
          <p>Aylık taksit tutarı: {plan.installmentAmount.toFixed(2)} TL</p>
          <p>Taksitli alım: {plan.canAffordInstallments ? 'Uygun' : 'Uygun Değil'}</p>
          <p>Önerilen plan: {plan.recommendedPlan === 'installments' ? 'Taksitli Alım' : 'Biriktirerek Alım'}</p>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
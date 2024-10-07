import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL + '/exercises';

const exerciseService = {
  
  // Tüm egzersizleri getir
  getAll: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching exercises:', error);
      throw error;
    }
  },

  // Yeni egzersiz oluştur
  create: async (exercise) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(API_URL, exercise, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating exercise:', error);
      throw error;
    }
  },

  // Mevcut egzersizi güncelle
  update: async (exercise) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}/${exercise.id}`, exercise, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating exercise:', error);
      throw error;
    }
  },

  // Egzersizi sil
  remove: async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting exercise:', error);
      throw error;
    }
  }
};

export default exerciseService;

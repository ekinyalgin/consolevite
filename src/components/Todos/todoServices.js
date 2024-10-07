import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL; // Çevre değişkenlerinden API URL'sini çekiyoruz

// Tüm todo'ları getirme
const getTodos = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/todos`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching todos:', error);
    throw error;
  }
};

// Yeni todo oluşturma
const createTodo = async (todoData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/todos`, todoData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating todo:', error);
    throw error;
  }
};

// Mevcut todo'yu güncelleme
const updateTodo = async (todoData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_URL}/todos/${todoData.id}`, todoData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating todo:', error);
    throw error;
  }
};

// Todo'nun tarihini güncelleme
const updateTodoDate = async (id, date) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_URL}/todos/${id}/date`, { date }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating todo date:', error);
    throw error;
  }
};

// Todo'yu silme
const deleteTodo = async (id) => {
  try {
    const token = localStorage.getItem('token');
    await axios.delete(`${API_URL}/todos/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error('Error deleting todo:', error);
    throw error;
  }
};

export {
  getTodos,
  createTodo,
  updateTodo,
  updateTodoDate,
  deleteTodo,
};

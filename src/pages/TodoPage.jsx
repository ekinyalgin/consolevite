// TodoPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import TodoForm from '../components/Todos/TodoForm';
import TodoList from '../components/Todos/TodoList';
import Notification from '../utils/Notification';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { formatDate, getNextDay } from '../components/Todos/dateUtils';

const TodoPage = () => {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [todos, setTodos] = useState([]);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [notification, setNotification] = useState(null);
  const [categories, setCategories] = useState([]);
  const [notReviewedUrls, setNotReviewedUrls] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL;

  // Görevleri gruplandıran fonksiyon
  const groupTodosByDate = (todos) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const grouped = todos.reduce((groupedTodos, todo) => {
      const todoDate = todo.date ? new Date(todo.date) : null;
      todoDate && todoDate.setHours(0, 0, 0, 0);
      let groupKey = todo.date;

      if (todoDate) {
        if (todoDate.getTime() === today.getTime()) {
          groupKey = "Today";
        } else if (todoDate.getTime() === yesterday.getTime()) {
          groupKey = "Yesterday";
        } else if (todoDate.getTime() === tomorrow.getTime()) {
          groupKey = "Tomorrow";
        } else {
          groupKey = todoDate.toLocaleDateString('tr-TR');
        }
      }

      if (!groupedTodos[groupKey]) {
        groupedTodos[groupKey] = [];
      }
      groupedTodos[groupKey].push(todo);
      return groupedTodos;
    }, {});

    const sortDates = (a, b) => {
      const specialDates = { "Yesterday": yesterday, "Today": today, "Tomorrow": tomorrow };
      const dateA = specialDates[a] || new Date(a.split('.').reverse().join('-'));
      const dateB = specialDates[b] || new Date(b.split('.').reverse().join('-'));
      return dateA - dateB;
    };

    const sortedGroups = Object.keys(grouped).sort(sortDates);

    const orderedTodos = {};
    sortedGroups.forEach((key) => {
      orderedTodos[key] = grouped[key];
    });

    return orderedTodos;
  };

  const fetchTodos = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/todos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTodos(response.data);
    } catch (error) {
      setNotification({ message: 'Failed to fetch todos', type: 'error' });
    }
  };

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/login');
      } else {
        fetchTodos();
      }
    }
  }, [user, loading, navigate]);

  const handleToggleDone = async (id, currentDate) => {
    try {
      let nextDate;
      if (currentDate) {
        nextDate = new Date(currentDate);
        nextDate.setDate(nextDate.getDate() + 1);
      } else {
        nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + 1);
      }

      const formattedDate = formatDate(nextDate);

      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}/todos/${id}/date`, 
        { date: formattedDate }, 
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      const updatedTodo = response.data;
      
      setTodos(prevTodos => prevTodos.map(todo => todo.id === id ? updatedTodo : todo));

      setNotification({ message: 'Todo updated successfully', type: 'success' });
    } catch (error) {
      console.error('Error updating todo:', error);
      setNotification({ message: `Error updating todo: ${error.message}`, type: 'error' });
    }
  };

  const handleDateChange = async (id, newDate) => {
    try {
      if (!newDate) {
        throw new Error('Invalid date selection.');
      }

      // Tarihi UTC'ye çevir
      const utcDate = Date.UTC(newDate.getFullYear(), newDate.getMonth(), newDate.getDate());
      const formattedDate = new Date(utcDate).toISOString().split('T')[0];

      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}/todos/${id}/date`, { date: formattedDate }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedTodo = response.data;
      setTodos(prevTodos => prevTodos.map(todo => todo.id === id ? updatedTodo : todo));
      setNotification({ message: 'Todo date updated successfully', type: 'success' });
    } catch (error) {
      console.error('Error updating todo date:', error);
      setNotification({ message: 'Error while updating date: ' + error.message, type: 'error' });
    }
  };

  const handleSave = async (todoData) => {
    try {
      const token = localStorage.getItem('token');
      let response;

      if (todoData.date) {
        const utcDate = Date.UTC(todoData.date.getFullYear(), todoData.date.getMonth(), todoData.date.getDate());
        todoData.date = new Date(utcDate).toISOString().split('T')[0];
      }

      if (todoData.id) {
        response = await axios.put(`${API_URL}/todos/${todoData.id}`, todoData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTodos(prevTodos => prevTodos.map(todo => 
          todo.id === todoData.id ? response.data : todo
        ));
      } else {
        response = await axios.post(`${API_URL}/todos`, todoData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTodos(prevTodos => [...prevTodos, response.data]);
      }

      setNotification({ message: 'Todo saved successfully', type: 'success' });
      setIsFormOpen(false);
      setSelectedTodo(null);
    } catch (error) {
      console.error('Error saving todo:', error);
      setNotification({ message: 'Error saving todo', type: 'error' });
    }
  };

  const handleEdit = (todo) => {
    setSelectedTodo(todo);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/todos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotification({ message: 'Todo deleted successfully', type: 'success' });
      fetchTodos();
    } catch (error) {
      setNotification({ message: 'Error deleting todo', type: 'error' });
    }
  };

  const groupedTodos = groupTodosByDate(todos);

  return (
    <div className="container mx-auto p-4">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Todos</h1>
        <button onClick={() => { setIsFormOpen(!isFormOpen); setSelectedTodo(null); }} className="bg-blue-500 text-white px-4 py-2 rounded">
          {isFormOpen ? 'Close Form' : 'Add Todo'}
        </button>
      </div>

      {isFormOpen && (
        <TodoForm
          selectedTodo={selectedTodo}
          onSave={handleSave}
          onCancel={() => setIsFormOpen(false)}
        />
      )}

      {Object.entries(groupedTodos).map(([date, todos]) => (
        <div key={date}>
          <h2 className="text-lg font-bold mt-4 mb-2">{date}</h2>
          <TodoList
            todos={todos}
            onEdit={handleEdit}
            onToggleDone={handleToggleDone}
            onDateChange={handleDateChange}
            onDelete={handleDelete}
            categories={categories}
            notReviewedUrls={notReviewedUrls}
          />
        </div>
      ))}
    </div>
  );
};

export default TodoPage;

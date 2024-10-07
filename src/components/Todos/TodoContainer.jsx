import React, { useState, useEffect, useRef } from 'react';
import { Plus, X, LoaderCircle } from 'lucide-react';
import TodoForm from './TodoForm';
import TodoList from './TodoList';
import Notification from '../../utils/Notification';
import axios from 'axios';
import { formatDate } from './dateUtils';
import ToggleFormButton from '../common/ToggleFormButton';

const TodoContainer = () => {
  const [todos, setTodos] = useState([]);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [notification, setNotification] = useState(null);
  const [categories, setCategories] = useState([]);
  const [notReviewedUrls, setNotReviewedUrls] = useState([]);
  const [sites, setSites] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isFormOpen, setIsFormOpen] = useState(() => {
    const stored = localStorage.getItem('todoFormOpen');
    return stored ? JSON.parse(stored) : false;
  });
  const API_URL = import.meta.env.VITE_API_URL;
  const formRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    localStorage.setItem('todoFormOpen', JSON.stringify(isFormOpen));
  }, [isFormOpen]);

  const fetchData = async () => {
    try {
      await Promise.all([fetchTodos(), fetchCategories(), fetchNotReviewedUrls(), fetchSites()]);
    } catch (error) {
      console.error('Error fetching data:', error);
      setNotification({ message: 'Failed to fetch data', type: 'error' });
    }
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

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/sites/categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchNotReviewedUrls = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/urls/not-reviewed`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotReviewedUrls(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching not reviewed URLs:', error);
    }
  };

  const fetchSites = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/sites`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSites(response.data);
    } catch (error) {
      console.error('Error fetching sites:', error);
    }
  };

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

  const handleToggleDone = async (id, currentDate) => {
    let nextDate = currentDate ? new Date(currentDate) : new Date();
    nextDate.setDate(nextDate.getDate() + 1);
    const formattedDate = formatDate(nextDate);

    setTodos(prevTodos => prevTodos.map(todo => todo.id === id ? { ...todo, date: formattedDate } : todo));

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}/todos/${id}/date`, { date: formattedDate }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedTodo = response.data;
      setTodos(prevTodos => prevTodos.map(todo => todo.id === id ? updatedTodo : todo));
      setNotification({ message: 'Todo updated successfully', type: 'success' });
    } catch (error) {
      console.error('Error updating todo:', error);
      setNotification({ message: `Error updating todo: ${error.message}`, type: 'error' });
      setTodos(prevTodos => prevTodos.map(todo => todo.id === id ? { ...todo, date: currentDate } : todo));
    }
  };

  const handleDateChange = async (id, newDate) => {
    try {
      if (!newDate) {
        throw new Error('Invalid date selection.');
      }

      const formattedDate = new Date(Date.UTC(newDate.getFullYear(), newDate.getMonth(), newDate.getDate())).toISOString().split('T')[0];
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
    let tempId = null;
    if (todoData.date) {
      todoData.date = new Date(Date.UTC(todoData.date.getFullYear(), todoData.date.getMonth(), todoData.date.getDate())).toISOString().split('T')[0];
    }

    if (todoData.id) {
      setTodos(prevTodos => prevTodos.map(todo => todo.id === todoData.id ? { ...todoData } : todo));
    } else {
      tempId = `temp-${Math.random()}`;
      setTodos(prevTodos => [...prevTodos, { ...todoData, id: tempId }]);
    }

    try {
      const token = localStorage.getItem('token');
      let response;

      if (todoData.id) {
        response = await axios.put(`${API_URL}/todos/${todoData.id}`, todoData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        response = await axios.post(`${API_URL}/todos`, todoData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTodos(prevTodos => prevTodos.map(todo => todo.id === tempId ? response.data : todo));
      }
      setNotification({ message: 'Todo saved successfully', type: 'success' });
      setSelectedTodo(null);
      // Form açık kalacak, kapatmıyoruz
    } catch (error) {
      console.error('Error saving todo:', error);
      setNotification({ message: 'Error saving todo', type: 'error' });
      if (!todoData.id) {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== tempId));
      }
    }
  };

  const handleEdit = (todo) => {
    setSelectedTodo(todo);
    setIsFormOpen(true);
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleFormCancel = () => {
    setSelectedTodo(null);
    // Form açık kalacak, kapatmıyoruz
  };

  const handleDelete = async (id) => {
    const previousTodos = todos;
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/todos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotification({ message: 'Todo deleted successfully', type: 'success' });
    } catch (error) {
      console.error('Error deleting todo:', error);
      setNotification({ message: 'Error deleting todo', type: 'error' });
      setTodos(previousTodos);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleForm = () => {
    setIsFormOpen(prev => !prev);
  };

  const groupedTodos = groupTodosByDate(todos);

  return (
    <div className="container mx-auto p-2">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <h1 className="font-semibold mb-4 text-2xl">Todos</h1>
      <div className="sm:space-x-8 flex flex-col md:flex-row">
        {isFormOpen && (
          <div ref={formRef} className="sm:bg-gray-100 rounded-lg sm:p-5 w-full md:w-3/12 mb-5 md:mb-0">
            <TodoForm
              key={selectedTodo ? selectedTodo.id : 'new'}
              selectedTodo={selectedTodo}
              onSave={handleSave}
              onCancel={handleFormCancel}
            />
          </div>
        )}

        <div className={`w-full ${isFormOpen ? 'md:w-9/12' : 'md:w-full'}`}>
          {Object.entries(groupedTodos).map(([date, todos]) => (
            <div key={date} className="mb-6">
              <h2 className="font-semibold mb-4 text-sm text-gray-600">{date}</h2>
              <TodoList
                todos={todos}
                onEdit={handleEdit}
                onToggleDone={handleToggleDone}
                onDateChange={handleDateChange}
                onDelete={handleDelete}
                categories={categories}
                notReviewedUrls={notReviewedUrls}
                sites={sites}
              />
            </div>
          ))}
        </div>
      </div>

      <ToggleFormButton isOpen={isFormOpen} onClick={toggleForm} />
    </div>
  );
};

export default TodoContainer;
// TodoPage.jsx
import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import TodoForm from '../components/Todos/TodoForm';
import TodoList from '../components/Todos/TodoList';
import Notification from '../utils/Notification';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { formatDate, getNextDay } from '../components/Todos/dateUtils';
import tableClasses from '../utils/tableClasses';
import { LoaderCircle, Plus, X } from 'lucide-react'; // Lucide ikonunu import ediyoruz

const TodoPage = () => {
    const { user, loading } = useContext(AuthContext);
    const navigate = useNavigate();
    const [pageState, setPageState] = useState('loading');
    const [todos, setTodos] = useState([]);
    const [selectedTodo, setSelectedTodo] = useState(null);
    const [notification, setNotification] = useState(null);
    const [categories, setCategories] = useState([]);
    const [notReviewedUrls, setNotReviewedUrls] = useState([]);
    const [sites, setSites] = useState([]);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [isFormOpen, setIsFormOpen] = useState(false); // Formun açık/kapalı durumunu kontrol eden state

    const API_URL = import.meta.env.VITE_API_URL;
    const formRef = useRef(null);

    useEffect(() => {
        if (!loading) {
            if (!user) {
                setPageState('unauthorized');
            } else if (user.role !== 'admin') {
                setPageState('forbidden');
            } else {
                setPageState('loading');
                fetchData();
            }
        }
    }, [user, loading]);

    const fetchData = async () => {
        try {
            await Promise.all([
                fetchTodos(),
                fetchCategories(),
                fetchNotReviewedUrls(),
                fetchSites()
            ]);
            setPageState('loaded');
        } catch (error) {
            console.error('Error fetching data:', error);
            setNotification({ message: 'Failed to fetch data', type: 'error' });
            setPageState('error');
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
        // Optimistik güncelleme
        let nextDate;
        if (currentDate) {
            nextDate = new Date(currentDate);
            nextDate.setDate(nextDate.getDate() + 1);
        } else {
            nextDate = new Date();
            nextDate.setDate(nextDate.getDate() + 1);
        }
        const formattedDate = formatDate(nextDate);
    
        // UI'yı hemen güncelle
        setTodos(prevTodos => 
            prevTodos.map(todo => 
                todo.id === id ? { ...todo, date: formattedDate } : todo
            )
        );
    
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`${API_URL}/todos/${id}/date`, 
                { date: formattedDate }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
    
            const updatedTodo = response.data;
    
            // Sunucu yanıtı geldiğinde doğru verilerle UI'yı güncelle
            setTodos(prevTodos => prevTodos.map(todo => 
                todo.id === id ? updatedTodo : todo
            ));
    
            setNotification({ message: 'Todo updated successfully', type: 'success' });
        } catch (error) {
            // Hata durumunda UI'yı eski haline getir
            console.error('Error updating todo:', error);
            setNotification({ message: `Error updating todo: ${error.message}`, type: 'error' });
    
            // Eski duruma geri döndür
            setTodos(prevTodos => 
                prevTodos.map(todo => 
                    todo.id === id ? { ...todo, date: currentDate } : todo
                )
            );
        }
    };
    
    const handleDateChange = async (id, newDate) => {
        try {
            if (!newDate) {
                throw new Error('Invalid date selection.');
            }

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
        let tempId = null; // tempId'yi başlangıçta tanımlayın
        
        // Optimistik güncelleme: UI'ya yeni görevi hemen ekle/güncelle
        if (todoData.date) {
            const utcDate = Date.UTC(todoData.date.getFullYear(), todoData.date.getMonth(), todoData.date.getDate());
            todoData.date = new Date(utcDate).toISOString().split('T')[0];
        }
    
        if (todoData.id) {
            // Güncelleme için optimistik güncelleme
            setTodos(prevTodos => prevTodos.map(todo => 
                todo.id === todoData.id ? { ...todoData } : todo
            ));
        } else {
            // Yeni ekleme için optimistik güncelleme
            tempId = `temp-${Math.random()}`; // Geçici bir ID ile yeni öğe oluştur
            setTodos(prevTodos => [...prevTodos, { ...todoData, id: tempId }]);
        }
    
        try {
            const token = localStorage.getItem('token');
            let response;
    
            if (todoData.id) {
                // Güncelleme isteği
                response = await axios.put(`${API_URL}/todos/${todoData.id}`, todoData, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setTodos(prevTodos => prevTodos.map(todo => 
                    todo.id === todoData.id ? response.data : todo
                ));
            } else {
                // Ekleme isteği
                response = await axios.post(`${API_URL}/todos`, todoData, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                // Geçici öğeyi gerçek öğe ile değiştir
                setTodos(prevTodos => prevTodos.map(todo => 
                    todo.id === tempId ? response.data : todo
                ));
            }
    
            setNotification({ message: 'Todo saved successfully', type: 'success' });
            setSelectedTodo(null);
        } catch (error) {
            console.error('Error saving todo:', error);
            let errorMessage = 'Error saving todo';
            if (error.response && error.response.data && error.response.data.details) {
                errorMessage += ': ' + error.response.data.details;
            }
            setNotification({ message: errorMessage, type: 'error' });
    
            // Hata durumunda optimistik değişiklikleri geri alın
            if (!todoData.id) {
                setTodos(prevTodos => prevTodos.filter(todo => todo.id !== tempId));
            }
        }
    };
    

    const handleEdit = (todo) => {
        setSelectedTodo(todo);
        setIsFormOpen(true); // Düzenleme için formu aç
        if (formRef.current) {
            formRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleFormCancel = () => {
        setSelectedTodo(null);
        setIsFormOpen(false); // Form kapatıldığında `isFormOpen` state'ini false yapıyoruz
    };

    const handleDelete = async (id) => {
        // Optimistik güncelleme: UI'dan öğeyi hemen kaldır
        const previousTodos = todos; // Eski durumu saklayın
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
    
            // Hata durumunda UI'yı eski haline getir
            setTodos(previousTodos);
        }
    };
    

    useEffect(() => {
        const handleResize = () => {
            const newIsMobile = window.innerWidth < 768;
            setIsMobile(newIsMobile);
        };

        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (pageState === 'loading') {
        return (
            <div className="flex justify-center items-center h-screen">
                <LoaderCircle className="animate-spin text-blue-500" size={48} />
            </div>
        );
    }

    if (pageState === 'unauthorized') {
        return (
            <div className="container mx-auto p-4">
                <h1 className={tableClasses.h1}>Access Denied</h1>
                <p>Please log in to view this page.</p>
            </div>
        );
    }

    if (pageState === 'forbidden') {
        return (
            <div className="container mx-auto p-4">
                <h1 className={tableClasses.h1}>Unauthorized Access</h1>
                <p>Sorry, you don't have permission to view this page. Only administrators can access the Todo list.</p>
            </div>
        );
    }

    if (pageState === 'error') {
        return (
            <div className="container mx-auto p-4">
                <h1 className={tableClasses.h1}>Error</h1>
                <p>An error occurred while loading the page. Please try again later.</p>
            </div>
        );
    }

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
            
            <h1 className={tableClasses.h1}>Todos</h1>
            <div className="sm:space-x-8 flex flex-col md:flex-row">
                {/* Form Section */}
                <div ref={formRef} className={`sm:bg-gray-100 rounded-lg sm:p-5 w-full md:w-3/12 mb-5 md:mb-0 ${isFormOpen ? '' : 'hidden md:block'}`}>
                    <TodoForm
                        key={selectedTodo ? selectedTodo.id : 'new'}
                        selectedTodo={selectedTodo}
                        onSave={handleSave}
                        onCancel={handleFormCancel}
                    />
                </div>

                {/* List Section */}
                <div className="w-full md:w-9/12">
                    {Object.entries(groupedTodos).map(([date, todos]) => (
                        <div key={date} className="mb-6">
                            <h2 className={tableClasses.h2}>{date}</h2>
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

            {/* Formu aç/kapa butonu */}
            {!isFormOpen && (
                <button
                    onClick={() => setIsFormOpen(true)}
                    className="fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-full shadow-md hover:bg-blue-700 transition duration-300 md:hidden"
                >
                    <Plus className="w-4 h-4" strokeWidth={3} />
                </button>
            )}

            {isFormOpen && (
                <button
                    onClick={() => setIsFormOpen(false)}
                    className="fixed bottom-4 right-4 bg-red-600 text-white p-4 rounded-full shadow-md hover:bg-red-700 transition duration-300 md:hidden"
                >
                    <X className="w-4 h-4" strokeWidth={3} />
                </button>
            )}
        </div>
    );
};

export default TodoPage;

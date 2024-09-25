import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import ExerciseForm from '../components/Exercises/ExerciseForm';
import ExerciseList from '../components/Exercises/ExerciseList';
import { PlayCircle, Shuffle, X } from 'lucide-react';
import Notification from '../utils/Notification';
import tableClasses from '../utils/tableClasses';
import { AuthContext } from '../contexts/AuthContext';
import { LoaderCircle } from 'lucide-react';
import axios from 'axios';

const ExercisePage = () => {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [pageState, setPageState] = useState('loading');
  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [notification, setNotification] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showOnlySelected, setShowOnlySelected] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!loading) {
      if (!user) {
        setPageState('unauthorized');
      } else if (user.role !== 'admin') {
        setPageState('forbidden');
      } else {
        setPageState('loading');
        fetchExercises();
      }
    }
  }, [user, loading]);

  const fetchExercises = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/exercises`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExercises(response.data);
      setPageState('loaded');
    } catch (error) {
      console.error('Error fetching exercises:', error);
      showNotification('Failed to load exercises', 'error');
      setPageState('error');
    }
  }, [API_URL]);

  const showNotification = (message, type) => {
    setNotification({ message, type });
  };

  const handleSave = async (exerciseData) => {
    try {
      const token = localStorage.getItem('token');
      let response;

      if (exerciseData.id) {
        response = await axios.put(`${API_URL}/exercises/${exerciseData.id}`, exerciseData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setExercises(prevExercises => prevExercises.map(exercise => 
          exercise.id === exerciseData.id ? response.data : exercise
        ));
      } else {
        response = await axios.post(`${API_URL}/exercises`, exerciseData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setExercises(prevExercises => [...prevExercises, response.data]);
      }

      showNotification(exerciseData.id ? 'Exercise updated successfully' : 'Exercise added successfully', 'success');
      setSelectedExercise(null);
    } catch (error) {
      console.error('Error saving exercise:', error);
      showNotification('Failed to save exercise', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/exercises/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExercises(prevExercises => prevExercises.filter(exercise => exercise.id !== id));
      showNotification('Exercise deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting exercise:', error);
      showNotification('Failed to delete exercise', 'error');
    }
  };

  const handleEdit = (exercise) => {
    setSelectedExercise(exercise);
  };

  const startRandomExercise = () => {
    if (exercises.length > 0) {
      const totalDuration = exercises.reduce((acc, exercise) => {
        const [minutes, seconds] = exercise.duration.split(':').map(Number);
        return acc + minutes * 60 + seconds;
      }, 0);

      const targetDuration = totalDuration / 7;
      let selectedDuration = 0;
      const selected = [];
      const shuffledExercises = [...exercises].sort(() => 0.5 - Math.random());

      for (let i = 0; i < shuffledExercises.length; i++) {
        const exercise = shuffledExercises[i];
        const [minutes, seconds] = exercise.duration.split(':').map(Number);
        const durationInSeconds = minutes * 60 + seconds;

        if (selectedDuration + durationInSeconds <= targetDuration) {
          selected.push(exercise.id);
          selectedDuration += durationInSeconds;
        }

        if (selectedDuration >= targetDuration) break;
      }

      setSelectedIds(selected);
      setShowOnlySelected(true);
    } else {
      showNotification('No exercises available', 'error');
    }
  };

  const clearSelection = () => {
    setSelectedIds([]);
    setShowOnlySelected(false);
  };

  const startExercise = () => {
    const selectedExercises = exercises.filter((exercise) => selectedIds.includes(exercise.id));
    navigate('/start-exercise', { state: { exercises: selectedExercises } });
  };

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
        <p>Sorry, you don't have permission to view this page. Only administrators can access the Exercises list.</p>
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

  return (
    <div className="container mx-auto p-2">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <h1 className={tableClasses.h1}>Exercises</h1>
      <div className="sm:space-x-8 flex flex-col md:flex-row">
        <div className="sm:bg-gray-100 rounded-lg sm:p-5 w-full md:w-3/12 mb-5 md:mb-0">
          <ExerciseForm
            selectedExercise={selectedExercise}
            onSave={handleSave}
            onCancel={() => setSelectedExercise(null)}
          />
        </div>
        <div className="lg:w-9/12">
          <div className={tableClasses.buttonContainer}>
            <button onClick={startRandomExercise} className={tableClasses.transButton + " flex items-center"}>
              <Shuffle className="w-4 mr-2" /> Random
            </button>
            <button onClick={clearSelection} className={tableClasses.transButton + " flex items-center"}>
              <X className="w-4 mr-2" /> Clear Selection
            </button>
            <button onClick={startExercise} className={tableClasses.transButton + " flex items-center"}>
              <PlayCircle className="w-4 mr-2" /> Start Exercise
            </button>
          </div>

          <ExerciseList 
            exercises={exercises} 
            selectedIds={selectedIds} 
            setSelectedIds={setSelectedIds} 
            onEdit={handleEdit} 
            onDelete={handleDelete} 
            showOnlySelected={showOnlySelected} 
          />
        </div>
      </div>
    </div>
  );
};

export default ExercisePage;

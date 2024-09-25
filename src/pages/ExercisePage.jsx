// pages/ExercisePage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import ExerciseForm from '../components/Exercises/ExerciseForm';
import ExerciseList from '../components/Exercises/ExerciseList';
import { PlayCircle, Shuffle, X } from 'lucide-react';
import Notification from '../utils/Notification';
import { useNavigate } from 'react-router-dom';
import tableClasses from '../utils/tableClasses'; 

const ExercisePage = () => {
  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [notification, setNotification] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showOnlySelected, setShowOnlySelected] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const fetchExercises = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/exercises`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, 
        },
      });

      if (response.status === 401) {
        throw new Error('Unauthorized. Please log in again.');
      }

      const data = await response.json();
      setExercises(data);
    } catch (error) {
      showNotification(error.message || 'Failed to load exercises', 'error');
    }
  }, [API_URL]);

  useEffect(() => {
    fetchExercises();
  }, [fetchExercises, refreshKey]);

  const showNotification = (message, type) => {
    setNotification({ message, type });
  };

  const handleSave = async (exerciseData) => {
    const token = localStorage.getItem('token');
    const method = selectedExercise ? 'PUT' : 'POST';
    const endpoint = selectedExercise
      ? `${API_URL}/exercises/${selectedExercise.id}`
      : `${API_URL}/exercises`;

    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(exerciseData),
      });

      if (response.status === 401) {
        throw new Error('Unauthorized. Please log in again.');
      }

      setRefreshKey(oldKey => oldKey + 1);
      showNotification(selectedExercise ? 'Exercise updated successfully' : 'Exercise added successfully', 'success');
      setSelectedExercise(null);
    } catch (error) {
      showNotification(error.message || 'Failed to save exercise', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/exercises/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Request failed');

      setRefreshKey(oldKey => oldKey + 1);
      showNotification('Exercise deleted successfully', 'success');
    } catch (error) {
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

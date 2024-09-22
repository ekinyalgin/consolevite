// pages/ExercisePage.jsx
import React, { useState, useEffect } from 'react';
import ExerciseForm from '../components/Exercises/ExerciseForm';
import ExerciseList from '../components/Exercises/ExerciseList';
import { Plus, PlayCircle, Shuffle, X } from 'lucide-react';
import Notification from '../utils/Notification';
import { useNavigate } from 'react-router-dom';
import tableClasses from '../utils/tableClasses'; // tableClasses dosyasını import ediyoruz

const ExercisePage = () => {
  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [notification, setNotification] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      const token = localStorage.getItem('token'); // Local storage'dan token'ı al
      const response = await fetch(`${API_URL}/exercises`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Authorization başlığını ekle
        },
      });

      if (response.status === 401) {
        throw new Error('Unauthorized. Please log in again.');
      }

      const data = await response.json();
      setExercises(data);
    } catch (error) {
      setNotification({ message: error.message || 'Failed to load exercises', type: 'error' });
    }
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

      fetchExercises();
      setNotification({
        message: selectedExercise ? 'Exercise updated successfully' : 'Exercise added successfully',
        type: 'success',
      });

      setSelectedExercise(null);
      setIsFormOpen(false);
    } catch (error) {
      setNotification({ message: error.message || 'Failed to save exercise', type: 'error' });
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token'); // Local Storage'dan token'ı al
      const response = await fetch(`${API_URL}/exercises/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Authorization başlığını ekleyin
        },
      });

      if (!response.ok) throw new Error('Request failed');

      fetchExercises();
      setNotification({ message: 'Exercise deleted successfully', type: 'success' });
    } catch (error) {
      setNotification({ message: 'Failed to delete exercise', type: 'error' });
    }
  };

  const handleEdit = (exercise) => {
    setSelectedExercise(exercise);
    setIsFormOpen(true);
  };

  const toggleForm = () => {
    setIsFormOpen(!isFormOpen);
    if (!isFormOpen) setSelectedExercise(null);
  };

  const [showOnlySelected, setShowOnlySelected] = useState(false);

  const startRandomExercise = () => {
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
    setShowOnlySelected(true); // Sadece seçili olanları göster
  };

  const clearSelection = () => {
    setSelectedIds([]);
    setShowOnlySelected(false); // Hepsini göster
  };

  const startExercise = () => {
    const selectedExercises = exercises.filter((exercise) => selectedIds.includes(exercise.id));
    navigate('/start-exercise', { state: { exercises: selectedExercises } });
  };

  return (
    <div className={tableClasses.container}>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <div className="flex justify-between items-center mb-4">
        <h1 className={tableClasses.title}>Exercises</h1>
        <button onClick={toggleForm} className={tableClasses.addButton}>
          <Plus className="mr-2" />
          {isFormOpen ? 'Close Form' : 'Add Exercise'}
        </button>
      </div>

      {isFormOpen && (
        <ExerciseForm
          selectedExercise={selectedExercise}
          onSave={handleSave}
          onCancel={() => {
            setSelectedExercise(null);
            setIsFormOpen(false);
          }}
        />
      )}

      <div className={tableClasses.filterContainer}>
        <button onClick={startRandomExercise} className={tableClasses.randomIcon}>
          <Shuffle className="mr-2" /> Random
        </button>
        <button onClick={clearSelection} className={tableClasses.cancelButton}>
          <X className="mr-2" /> Clear Selection
        </button>
        <button onClick={startExercise} className={tableClasses.formButton}>
          <PlayCircle className="mr-2" /> Start Exercise
        </button>
      </div>

      <ExerciseList exercises={exercises} selectedIds={selectedIds} setSelectedIds={setSelectedIds} onEdit={handleEdit} onDelete={handleDelete} showOnlySelected={showOnlySelected} />
    </div>
  );
};

export default ExercisePage;
